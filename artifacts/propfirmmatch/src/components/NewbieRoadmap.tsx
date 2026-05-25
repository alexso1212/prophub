import { useState } from "react";
import { Link } from "wouter";
import GuideMapOverlay from "./GuideMapOverlay";
import { roadmapStages, type RoadmapCta } from "../data/roadmapData";
import { guides } from "../data/guides";
import "../styles/roadmap.css";

/**
 * 鱼骨图（思维导图的一种）。主刺 = 6 个阶段，节点文案是收益/行动导向（原则 A）。
 * 点主刺看「你能得到什么」+ 行动点/攻略叶子；点攻略叶子弹出「比喻 + 迷你导图」
 * （原则 B），想看细节再展开完整图文。全程不跳转（CTA 才跳页）。
 */
export default function NewbieRoadmap({ prefix }: { prefix: string }) {
  const [selected, setSelected] = useState<string>(roadmapStages[0].id);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const href = (c: RoadmapCta) => (c.cat ? `${prefix}${c.href}` : c.href);
  const stage = roadmapStages.find((s) => s.id === selected) ?? roadmapStages[0];
  const stageIndex = roadmapStages.findIndex((s) => s.id === stage.id);

  const openGuide = (slug: string) => setOpenSlug(slug);

  return (
    <section className="rm" aria-label="新手路线图">
      <div className="rm-head">
        <h2 className="rm-title">新手路线图 · 从 0 到出金</h2>
        <p className="rm-sub">不知道从哪开始？点亮路上的每一步，看你这一步能得到什么 👇</p>
      </div>

      <div className="rm-track">
        <div className="rm-spine" aria-hidden="true" />
        <ol className="rm-stages" role="tablist" aria-label="路线图阶段">
          {roadmapStages.map((s, i) => {
            const isSel = s.id === selected;
            return (
              <li
                key={s.id}
                className={["rm-stage", i % 2 === 0 ? "up" : "down", isSel ? "is-selected" : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="rm-stem" aria-hidden="true" />
                <button
                  type="button"
                  role="tab"
                  aria-selected={isSel}
                  className="rm-node"
                  onClick={() => setSelected(s.id)}
                >
                  <span className="rm-node-num">{i + 1}</span>
                  <span className="rm-node-title">{s.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rm-detail" role="tabpanel">
        <div className="rm-detail-head">
          <span className="rm-detail-num">{stageIndex + 1}</span>
          <div>
            <div className="rm-detail-title">{stage.title}</div>
            <div className="rm-detail-gain">{stage.gain}</div>
          </div>
        </div>

        <div className="rm-bones">
          {stage.bones.map((b, j) => {
            if (b.kind === "guide") {
              const g = guides.find((x) => x.slug === b.slug);
              if (!g) return null;
              return (
                <button key={j} type="button" className="rm-guide-card" onClick={() => openGuide(b.slug)}>
                  <div className="rm-guide-title">{g.title}</div>
                  <div className="rm-guide-sum">{g.summary}</div>
                  <div className="rm-guide-open">用大白话 + 导图讲给你听 →</div>
                </button>
              );
            }
            return (
              <div key={j} className="rm-bone-item">
                <span className="rm-bone-text">{b.label}</span>
                <span className="rm-bone-tip">{b.action}</span>
              </div>
            );
          })}
        </div>

        {stage.ctas && stage.ctas.length > 0 && (
          <div className="rm-ctas">
            {stage.ctas.map((c) => (
              <Link key={c.href} href={href(c)} className={`rm-detail-cta ${c.ghost ? "ghost" : ""}`}>
                {c.label} →
              </Link>
            ))}
          </div>
        )}
      </div>

      {openSlug && <GuideMapOverlay slug={openSlug} onClose={() => setOpenSlug(null)} />}
    </section>
  );
}
