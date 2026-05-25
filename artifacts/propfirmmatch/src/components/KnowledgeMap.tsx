import { useRef, useState } from "react";
import { Link } from "wouter";
import MarkdownLite from "./MarkdownLite";
import { guides, type Guide } from "../data/guides";
import "../styles/knowledgeMap.css";

/**
 * 可缩放科幻思维导图——首页主体。无路由跳转：点分支节点用 transform 聚焦缩放
 * "钻进去"，分支内是攻略叶子，点叶子原地放大成阅读面板。所有攻略
 * (content-knowledge-base) 都挂在这张图上。
 */

interface Cta { label: string; href: string; cat?: boolean; ghost?: boolean }
interface Branch {
  id: string;
  tag: string;
  label: string;
  sub: string;
  guideSlugs: string[];
  ctas?: Cta[];
}

const BRANCHES: Branch[] = [
  {
    id: "understand", tag: "START", label: "我是新手", sub: "先搞懂这是什么",
    guideSlugs: ["what-is-futures-prop-firm"],
    ctas: [{ label: "60 秒测我适不适合", href: "/knowledge/decision" }],
  },
  {
    id: "choose", tag: "SELECT", label: "我要选平台", sub: "低成本试错 · 对比挑一家",
    guideSlugs: ["low-cost-path"],
    ctas: [
      { label: "对比全部公司", href: "/all-prop-firms", cat: true },
      { label: "60 秒测一测", href: "/knowledge/decision", ghost: true },
    ],
  },
  {
    id: "rules", tag: "RULES", label: "我要学规则", sub: "回撤 / 一致性 / 日内平仓",
    guideSlugs: ["drawdown-rules", "consistency-rule", "intraday-liquidation"],
  },
  {
    id: "software", tag: "SOFTWARE", label: "我要配软件", sub: "Tradovate / Rithmic",
    guideSlugs: ["tradovate-guide", "rithmic-guide"],
    ctas: [{ label: "更多软件教程", href: "/tutorials" }],
  },
  {
    id: "payout", tag: "PAYOUT", label: "我要出金", sub: "KYC / Wise / W-8BEN",
    guideSlugs: ["kyc-guide", "wise-payout", "w8-form-guide"],
    ctas: [{ label: "看真实出金记录", href: "/payouts", cat: true }],
  },
];

const DIFF_ZH: Record<string, string> = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "高级",
};

// 放射布局：5 个分支均匀分布在椭圆上，顶部起顺时针。
function layout(n: number) {
  const Rx = 42, Ry = 40;
  return Array.from({ length: n }, (_, i) => {
    const a = (-90 + (360 / n) * i) * (Math.PI / 180);
    return { x: 50 + Rx * Math.cos(a), y: 50 + Ry * Math.sin(a) };
  });
}

export default function KnowledgeMap({ prefix }: { prefix: string }) {
  const [view, setView] = useState<string>("overview");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const vpRef = useRef<HTMLDivElement>(null);

  const bySlug = (s: string): Guide | undefined => guides.find((g) => g.slug === s);
  const hrefOf = (c: Cta) => (c.cat ? `${prefix}${c.href}` : c.href);
  const openGuide = openSlug ? bySlug(openSlug) : undefined;
  const pos = layout(BRANCHES.length);

  const enterBranch = (b: Branch, e: React.MouseEvent) => {
    const vp = vpRef.current?.getBoundingClientRect();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (vp) {
      setOrigin({
        x: ((r.left + r.width / 2 - vp.left) / vp.width) * 100,
        y: ((r.top + r.height / 2 - vp.top) / vp.height) * 100,
      });
    }
    setOpenSlug(null);
    setView(b.id);
  };

  // 「下一篇」：同分支内循环到下一篇攻略，制造连续阅读。
  const nextSlug = (() => {
    if (!openSlug) return null;
    const b = BRANCHES.find((br) => br.guideSlugs.includes(openSlug));
    if (!b || b.guideSlugs.length < 2) return null;
    const i = b.guideSlugs.indexOf(openSlug);
    return b.guideSlugs[(i + 1) % b.guideSlugs.length];
  })();

  return (
    <>
      <div className="kmap-viewport" ref={vpRef}>
        {view !== "overview" && (
          <button type="button" className="kmap-back" onClick={() => setView("overview")}>
            ← 返回总览
          </button>
        )}

        {/* 总览层 */}
        <div
          className={`kmap-layer kmap-overview ${view !== "overview" ? "is-hidden" : ""}`}
          style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
          aria-hidden={view !== "overview"}
        >
          <div className="kmap-canvas">
            <svg className="kmap-wires" viewBox="0 0 100 100" preserveAspectRatio="none">
              {pos.map((p, i) => (
                <line key={i} className="kmap-wire" x1={50} y1={50} x2={p.x} y2={p.y} />
              ))}
            </svg>
            <div className="kmap-root">
              <div>
                <div className="kmap-root-title">Prop Firm 知识图谱</div>
                <div className="kmap-root-sub">从 0 到出金 · 点节点钻进去</div>
              </div>
            </div>
            {BRANCHES.map((b, i) => (
              <button
                key={b.id}
                type="button"
                className="kmap-node"
                style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%` }}
                onClick={(e) => enterBranch(b, e)}
              >
                <span className="kmap-node-tag">{b.tag}</span>
                <span className="kmap-node-label">{b.label}</span>
                <span className="kmap-node-sub">{b.sub}</span>
                <span className="kmap-node-count">{b.guideSlugs.length} 篇 ›</span>
              </button>
            ))}
          </div>
        </div>

        {/* 分支详情层 */}
        {BRANCHES.map((b) => (
          <div
            key={b.id}
            className={`kmap-layer kmap-branch ${view === b.id ? "is-active" : ""}`}
            aria-hidden={view !== b.id}
          >
            {view === b.id && (
              <div className="kmap-branch-inner">
                <div className="kmap-branch-head">
                  <div className="kmap-branch-tag">{b.tag}</div>
                  <div className="kmap-branch-title">{b.label}</div>
                  <div className="kmap-branch-sub">{b.sub}</div>
                </div>
                <div className="kmap-leaves">
                  {b.guideSlugs.map((s) => {
                    const g = bySlug(s);
                    if (!g) return null;
                    return (
                      <button key={s} type="button" className="kmap-leaf" onClick={() => setOpenSlug(s)}>
                        <span className="kmap-leaf-diff">{DIFF_ZH[g.difficulty] ?? g.difficulty}</span>
                        <div className="kmap-leaf-title">{g.title}</div>
                        <div className="kmap-leaf-sum">{g.summary}</div>
                        <div className="kmap-leaf-open">展开阅读 →</div>
                      </button>
                    );
                  })}
                </div>
                {b.ctas && (
                  <div className="kmap-ctas">
                    {b.ctas.map((c) => (
                      <Link key={c.href} href={hrefOf(c)} className={`kmap-cta ${c.ghost ? "ghost" : ""}`}>
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* 阅读层：节点放大成内容，无跳转 */}
        {openGuide && (
          <div className="kmap-reading" onClick={() => setOpenSlug(null)}>
            <div className="kmap-reading-card" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="kmap-reading-close" onClick={() => setOpenSlug(null)} aria-label="关闭">
                ×
              </button>
              <div className="kmap-reading-meta">
                <span className="kmap-leaf-diff">{DIFF_ZH[openGuide.difficulty] ?? openGuide.difficulty}</span>
                {openGuide.lastUpdatedAt && (
                  <span className="kmap-reading-updated">更新 {openGuide.lastUpdatedAt}</span>
                )}
              </div>
              <div className="kmap-reading-title">{openGuide.title}</div>
              <div className="kmap-reading-body">
                <MarkdownLite source={openGuide.body} />
              </div>
              <div className="kmap-disclaimer">
                本文仅供学习，不构成投资建议，不保证收益或出金；挑战失败会损失报名费。平台规则、费用、地区限制以上游官网最新说明为准。本站部分链接为返佣链接，使用可能为本站带来佣金。
              </div>
              {nextSlug && (
                <div className="kmap-related">
                  <button type="button" className="kmap-next" onClick={() => setOpenSlug(nextSlug)}>
                    下一篇：{bySlug(nextSlug)?.title} →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="kmap-foot">
        <span>期货交易高风险，可能损失全部本金；本站不提供喊单/带单/代操/代付/代 KYC。</span>
        <Link href={`${prefix}/all-prop-firms`} className="kmap-cta ghost">查看全部公司 →</Link>
      </div>
    </>
  );
}
