import { useState } from "react";
import MarkdownLite from "./MarkdownLite";
import { guides } from "../data/guides";
import { guideMaps } from "../data/guideMaps";
import "../styles/roadmap.css";

/**
 * 攻略浮层：一句比喻 + 迷你导图节点（原则 B），可展开完整图文。
 * 鱼骨图和「查我的平台」共用。不跳转。
 */
export default function GuideMapOverlay({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [showFull, setShowFull] = useState(false);
  const guide = guides.find((g) => g.slug === slug);
  const gmap = guideMaps[slug];
  if (!guide || !gmap) return null;

  return (
    <div className="rm-gmap-overlay" onClick={onClose}>
      <div className="rm-gmap-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="rm-gmap-close" onClick={onClose} aria-label="关闭">×</button>
        <div className="rm-gmap-kicker">一句话先懂</div>
        <div className="rm-gmap-title">{guide.title}</div>
        <p className="rm-gmap-analogy">{gmap.analogy}</p>

        <div className="rm-gmap-nodes">
          {gmap.nodes.map((n, k) => (
            <div key={k} className="rm-gmap-node">
              <span className="rm-gmap-node-dot" aria-hidden="true" />
              <div>
                <div className="rm-gmap-node-label">{n.label}</div>
                <div className="rm-gmap-node-action">{n.action}</div>
              </div>
            </div>
          ))}
        </div>

        {gmap.redline && <div className="rm-gmap-redline">⚠ {gmap.redline}</div>}
        {gmap.tip && <div className="rm-gmap-tip">💡 {gmap.tip}</div>}

        <button type="button" className="rm-gmap-more" onClick={() => setShowFull((v) => !v)}>
          {showFull ? "收起完整图文 ▲" : "想看更细？展开完整图文 ▾"}
        </button>
        {showFull && (
          <div className="rm-gmap-full">
            <MarkdownLite source={guide.body} />
          </div>
        )}

        <div className="rm-gmap-disclaimer">
          仅供学习，不构成投资建议，不保证收益或出金；规则/费用以上游官网最新说明为准。
        </div>
      </div>
    </div>
  );
}
