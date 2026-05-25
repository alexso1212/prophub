import { useState } from "react";
import { Link } from "wouter";
import {
  roadmapStages,
  statusBuckets,
  type RoadmapLink,
} from "../data/roadmapData";
import "../styles/roadmap.css";

/**
 * 新手路线图（鱼骨图）。把"从完全不懂 → 出金到账"拆成 7 个阶段的主轴，
 * 让小白先自我定位（你在哪一步），再点任意阶段看"现在该干嘛"和深链。
 * 取代原先被埋在首页中部的小思维导图，作为首屏主入口。
 */
export default function NewbieRoadmap({ prefix }: { prefix: string }) {
  const [selected, setSelected] = useState<string>(roadmapStages[0].id);
  const [bucket, setBucket] = useState<string | null>(null);

  const href = (l: RoadmapLink) => (l.cat ? `${prefix}${l.href}` : l.href);

  const activeBucket = statusBuckets.find((b) => b.id === bucket) ?? null;
  const highlighted = new Set(activeBucket?.stages ?? []);
  const stage = roadmapStages.find((s) => s.id === selected) ?? roadmapStages[0];
  const stageIndex = roadmapStages.findIndex((s) => s.id === stage.id);

  return (
    <section className="rm" aria-label="新手路线图">
      <div className="rm-head">
        <h2 className="rm-title">新手路线图 · 从 0 到出金</h2>
        <p className="rm-sub">第一次来？先选一个你现在的状态，跟着走就行 👇</p>

        <div className="rm-status" role="tablist" aria-label="你现在在哪一步">
          {statusBuckets.map((b) => (
            <button
              key={b.id}
              type="button"
              role="tab"
              aria-selected={bucket === b.id}
              className={`rm-status-btn ${bucket === b.id ? "is-active" : ""}`}
              onClick={() => {
                setBucket(b.id);
                setSelected(b.focus);
              }}
            >
              {b.label}
            </button>
          ))}
        </div>

        {activeBucket && (
          <div className="rm-guidance" role="status">
            <span className="rm-guidance-label">现在该干嘛</span>
            <span className="rm-guidance-text">{activeBucket.guidance}</span>
            <Link href={href(activeBucket.cta)} className="rm-guidance-cta">
              {activeBucket.cta.label} →
            </Link>
          </div>
        )}
      </div>

      <div className="rm-track">
        <div className="rm-spine" aria-hidden="true" />
        <ol className="rm-stages" role="tablist" aria-label="路线图阶段">
          {roadmapStages.map((s, i) => {
            const isSel = s.id === selected;
            return (
              <li
                key={s.id}
                className={[
                  "rm-stage",
                  i % 2 === 0 ? "up" : "down",
                  isSel ? "is-selected" : "",
                  highlighted.has(s.id) ? "is-hi" : "",
                  s.pending ? "is-pending" : "",
                ]
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
                  <span className="rm-node-sub">{s.subtitle}</span>
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
            <div className="rm-detail-sub">{stage.subtitle}</div>
          </div>
        </div>

        <ul className="rm-bones">
          {stage.bones.map((b, j) => (
            <li key={j} className="rm-bone-item">
              <span className="rm-bone-text">{b.text}</span>
              {b.tip && <span className="rm-bone-tip">{b.tip}</span>}
            </li>
          ))}
        </ul>

        {stage.pending && (
          <div className="rm-pending-note">
            这一步内容完善中（国内出金细节即将补充）。
          </div>
        )}

        {stage.cta && (
          <Link href={href(stage.cta)} className="rm-detail-cta">
            {stage.cta.label} →
          </Link>
        )}
      </div>
    </section>
  );
}
