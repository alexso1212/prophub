import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import GuideMapOverlay from "./GuideMapOverlay";
import { roadmapStages, type RoadmapBone, type RoadmapCta } from "../data/roadmapData";
import { guides } from "../data/guides";
import "../styles/roadmapGraph.css";

/**
 * 相机式鱼骨图：单屏不滚动，节点之间靠 world 的 transform 平移+缩放「飞行运镜」。
 * L0 总览（整条鱼骨）→ 点阶段：相机飞向它并放大、它的骨节(行动点/攻略叶子)长出
 * → 点攻略叶子：弹出「比喻+迷你导图」浮层。返回 = 相机反向回飞。桌面横向鱼骨，
 * 手机竖向鱼骨；两者都把焦点子树框进一屏。
 */

const PAD = 1.16;
const HW = 112; // 节点半宽（用于 bbox）
const HH = 46;  // 节点半高

interface Pt { x: number; y: number; up?: boolean }

export default function RoadmapGraph({ prefix }: { prefix: string }) {
  const [level, setLevel] = useState<"overview" | "stage">("overview");
  const [stageId, setStageId] = useState<string>(roadmapStages[0].id);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [vp, setVp] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const vpRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    const measure = () => setVp({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isMobile = vp.w > 0 && vp.w < 760;

  // 阶段节点坐标：桌面横向鱼骨（上下交错），手机竖向脊。
  const stagePts: Pt[] = useMemo(
    () =>
      roadmapStages.map((_, i) =>
        isMobile
          ? { x: 200, y: 110 + i * 132, up: false }
          : { x: 170 + i * 210, y: i % 2 === 0 ? 400 : 600, up: i % 2 === 0 },
      ),
    [isMobile],
  );

  const bonePt = (stageIdx: number, i: number, n: number): Pt => {
    const sp = stagePts[stageIdx];
    if (isMobile) {
      return { x: sp.x + 230, y: sp.y + (i - (n - 1) / 2) * 84 };
    }
    const dir = sp.up ? -1 : 1;
    return { x: sp.x, y: sp.y + dir * (104 + i * 86) };
  };

  const stageIdx = Math.max(0, roadmapStages.findIndex((s) => s.id === stageId));
  const sp = stagePts[stageIdx] ?? stagePts[0];

  // 焦点框：overview = 所有阶段节点 bbox；stage = 该阶段节点 + 它的骨节 bbox。
  const box = useMemo(() => {
    const pts: Pt[] =
      level === "overview"
        ? stagePts
        : [sp, ...(roadmapStages[stageIdx]?.bones ?? []).map((_, i, arr) => bonePt(stageIdx, i, arr.length))];
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const minX = Math.min(...xs) - HW, maxX = Math.max(...xs) + HW;
    const minY = Math.min(...ys) - HH, maxY = Math.max(...ys) + HH;
    return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, w: maxX - minX, h: maxY - minY };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, stageIdx, stagePts, isMobile]);

  const transform = useMemo(() => {
    if (!vp.w || !vp.h) return "translate(0px,0px) scale(1)";
    const scale = Math.min(vp.w / (box.w * PAD), vp.h / (box.h * PAD));
    const tx = vp.w / 2 - scale * box.cx;
    const ty = vp.h / 2 - scale * box.cy;
    return `translate(${tx}px, ${ty}px) scale(${scale})`;
  }, [vp, box]);

  const href = (c: RoadmapCta) => (c.cat ? `${prefix}${c.href}` : c.href);
  const activeStage = roadmapStages[stageIdx];

  return (
    <section className="rg" aria-label="新手路线图">
      <div className="rg-bar">
        <div className="rg-title">新手路线图 · 从 0 到出金</div>
        {level !== "overview" && (
          <button type="button" className="rg-back" onClick={() => setLevel("overview")}>← 返回总览</button>
        )}
      </div>

      <div className="rg-viewport" ref={vpRef}>
        <div className="rg-world" style={{ transform, transformOrigin: "0 0" }}>
          <svg className="rg-wires" width={2000} height={1400} viewBox="0 0 2000 1400" aria-hidden="true">
            {/* 主脊 */}
            {isMobile ? (
              <line className="rg-spine-line" x1={stagePts[0].x} y1={stagePts[0].y} x2={sp.x} y2={stagePts[stagePts.length - 1].y} />
            ) : (
              <line className="rg-spine-line" x1={stagePts[0].x} y1={stagePts[0].y > 500 ? 500 : 500} x2={stagePts[stagePts.length - 1].x} y2={500} />
            )}
            {stagePts.map((p, i) => (
              <line key={i} className="rg-stem-line"
                x1={isMobile ? stagePts[0].x : p.x} y1={isMobile ? p.y : 500}
                x2={p.x} y2={p.y} />
            ))}
            {level === "stage" && (activeStage?.bones ?? []).map((_, i, arr) => {
              const bp = bonePt(stageIdx, i, arr.length);
              return <line key={i} className="rg-bone-line" x1={sp.x} y1={sp.y} x2={bp.x} y2={bp.y} />;
            })}
          </svg>

          {/* 阶段节点 */}
          {roadmapStages.map((s, i) => {
            const p = stagePts[i];
            const active = level === "stage" && s.id === stageId;
            const dim = level === "stage" && s.id !== stageId;
            return (
              <button
                key={s.id}
                type="button"
                className={`rg-stage ${active ? "is-active" : ""} ${dim ? "is-dim" : ""}`}
                style={{ left: p.x, top: p.y }}
                onClick={() => { setStageId(s.id); setLevel("stage"); }}
                aria-current={active ? "true" : undefined}
              >
                <span className="rg-stage-num">{i + 1}</span>
                <span className="rg-stage-title">{s.title}</span>
                {level === "overview" && <span className="rg-stage-hint">{s.bones.length} 项 ›</span>}
              </button>
            );
          })}

          {/* 焦点阶段的骨节 */}
          {level === "stage" && activeStage?.bones.map((b: RoadmapBone, i, arr) => {
            const bp = bonePt(stageIdx, i, arr.length);
            const style = { left: bp.x, top: bp.y, animationDelay: `${i * 70}ms` } as React.CSSProperties;
            if (b.kind === "guide") {
              const g = guides.find((x) => x.slug === b.slug);
              if (!g) return null;
              return (
                <button key={`${stageId}-${i}`} type="button" className="rg-bone rg-bone-guide" style={style}
                  onClick={() => setOpenSlug(b.slug)}>
                  <span className="rg-bone-tag">攻略</span>
                  <span className="rg-bone-title">{g.title}</span>
                  <span className="rg-bone-open">大白话 + 导图 →</span>
                </button>
              );
            }
            return (
              <div key={`${stageId}-${i}`} className="rg-bone rg-bone-point" style={style}>
                <span className="rg-bone-title">{b.label}</span>
                <span className="rg-bone-action">{b.action}</span>
              </div>
            );
          })}
        </div>

        {/* 固定层（不缩放）：总览提示 / 阶段的收益句 + CTA */}
        {level === "overview" ? (
          <div className="rg-hint">点任意一步，钻进去看你能得到什么 👆</div>
        ) : (
          <div className="rg-foot">
            <div className="rg-foot-gain"><strong>{activeStage.title}</strong> · {activeStage.gain}</div>
            {activeStage.ctas && activeStage.ctas.length > 0 && (
              <div className="rg-foot-ctas">
                {activeStage.ctas.map((c) => (
                  <Link key={c.href} href={href(c)} className={`rg-cta ${c.ghost ? "ghost" : ""}`}>{c.label} →</Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {openSlug && <GuideMapOverlay slug={openSlug} onClose={() => setOpenSlug(null)} />}
    </section>
  );
}
