import { useState } from "react";
import { Link } from "wouter";
import { useCategory } from "../contexts/CategoryContext";
import { BookIcon } from "../components/icons";
import { TUTORIALS, TUTORIAL_CATEGORIES, type Tutorial, type TutorialCategory } from "../data/tutorials";

const levelColor = (lv: Tutorial["level"]) =>
  lv === "新手" ? "#22c55e" : lv === "进阶" ? "var(--orange)" : "#a855f7";

export default function TutorialsPage() {
  const category = useCategory();
  const prefix = `/${category}`;
  const [filter, setFilter] = useState<TutorialCategory | "all">("all");

  const list = filter === "all" ? TUTORIALS : TUTORIALS.filter(t => t.category === filter);

  return (
    <main className="container">
      <div className="section-title"><BookIcon size={18} className="icon" /> 教程中心</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 18, maxWidth: 720 }}>
        从零基础到老手，覆盖 prop firm 全流程：挑选挑战赛、通关技巧、出金通道、平台对比。共 {TUTORIALS.length} 篇可读中文文章，持续更新中。
      </p>

      <div className="tut-filter-row">
        <button
          type="button"
          className={`tut-filter-chip ${filter === "all" ? "is-active" : ""}`}
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}
        >全部 <span className="tut-filter-count">{TUTORIALS.length}</span></button>
        {TUTORIAL_CATEGORIES.map(c => {
          const n = TUTORIALS.filter(t => t.category === c).length;
          return (
            <button
              key={c}
              type="button"
              className={`tut-filter-chip ${filter === c ? "is-active" : ""}`}
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >{c} <span className="tut-filter-count">{n}</span></button>
          );
        })}
      </div>

      <div className="tut-grid">
        {list.map(t => (
          <Link key={t.slug} href={`/tutorials/${t.slug}`} className="tut-card">
            <div className="tut-card-meta">
              <span className="tut-card-level" style={{ color: levelColor(t.level) }}>● {t.level}</span>
              <span className="tut-card-cat">{t.category}</span>
              <span className="tut-card-time">{t.minutes} 分钟</span>
            </div>
            <div className="tut-card-title">{t.title}</div>
            <div className="tut-card-excerpt">{t.excerpt}</div>
            <div className="tut-card-foot">
              <span className="tut-card-date">更新于 {t.updatedAt}</span>
              <span className="tut-card-cta">开始阅读 →</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="tut-cta-box">
        <div className="tut-cta-title">看完想找实战数据？</div>
        <div className="tut-cta-body">
          浏览 <Link href={`${prefix}/prop-firm-rules`} className="firm-name-link">规则手册</Link> 看每家公司的硬指标对比，或翻
          <Link href={`${prefix}/payouts`} className="firm-name-link"> 出金记录</Link> 看真实到账截图。
        </div>
      </div>
    </main>
  );
}
