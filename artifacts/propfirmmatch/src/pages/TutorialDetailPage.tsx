import { useMemo } from "react";
import { Link, useRoute } from "wouter";
import { useCategory } from "../contexts/CategoryContext";
import { BookIcon, ArrowLeftIcon, ChevronRightIcon } from "../components/icons";
import { getTutorial, getRelated, getAdjacent, type Tutorial } from "../data/tutorials";
import MarkdownLite, { extractSections } from "../components/MarkdownLite";
import SimplePage from "./SimplePage";

const levelColor = (lv: Tutorial["level"]) =>
  lv === "新手" ? "#22c55e" : lv === "进阶" ? "var(--orange)" : "#a855f7";

export default function TutorialDetailPage() {
  const [, params] = useRoute("/tutorials/:slug");
  const category = useCategory();
  const prefix = `/${category}`;
  const slug = params?.slug ?? "";
  const tut = getTutorial(slug);

  const toc = useMemo(() => (tut ? extractSections(tut.body) : []), [tut]);
  if (!tut) {
    return <SimplePage title="教程未找到" body="抱歉，找不到这篇教程，可能链接已失效。返回教程中心继续浏览。" />;
  }

  const related = getRelated(slug, 3);
  const { prev, next } = getAdjacent(slug);

  return (
    <main className="container tut-detail-wrap">
      <Link href="/tutorials" className="tut-back-link">
        <ArrowLeftIcon size={14} /> 返回教程中心
      </Link>

      <article className="tut-article">
        <div className="tut-article-meta">
          <span className="tut-card-level" style={{ color: levelColor(tut.level) }}>● {tut.level}</span>
          <span className="tut-card-cat">{tut.category}</span>
          <span className="tut-card-time">{tut.minutes} 分钟阅读</span>
          <span className="tut-card-date">更新于 {tut.updatedAt}</span>
        </div>
        <h1 className="tut-article-title">{tut.title}</h1>
        <p className="tut-article-excerpt">{tut.excerpt}</p>

        <div className={`tut-layout ${toc.length > 2 ? "" : "no-toc"}`}>
          {toc.length > 2 && (
            <aside className="tut-toc">
              <div className="tut-toc-title"><BookIcon size={14} /> 目录</div>
              <ol className="tut-toc-list">
                {toc.map(s => (
                  <li key={s.id} className={s.level === 3 ? "tut-toc-sub" : ""}>
                    <a href={`#${s.id}`}>{s.text}</a>
                  </li>
                ))}
              </ol>
            </aside>
          )}
          <div className="tut-body-wrap">
            <MarkdownLite source={tut.body} />
          </div>
        </div>

        <nav className="tut-adjacent">
          {prev ? (
            <Link href={`/tutorials/${prev.slug}`} className="tut-adj-card tut-adj-prev">
              <span className="tut-adj-dir">← 上一篇</span>
              <span className="tut-adj-title">{prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/tutorials/${next.slug}`} className="tut-adj-card tut-adj-next">
              <span className="tut-adj-dir">下一篇 →</span>
              <span className="tut-adj-title">{next.title}</span>
            </Link>
          ) : <span />}
        </nav>

        {related.length > 0 && (
          <section className="tut-related">
            <div className="tut-related-title">同类阅读</div>
            <div className="tut-related-grid">
              {related.map(r => (
                <Link key={r.slug} href={`/tutorials/${r.slug}`} className="tut-related-card">
                  <div className="tut-related-cat">{r.category} · {r.minutes} 分钟</div>
                  <div className="tut-related-name">{r.title}</div>
                  <div className="tut-related-cta">阅读 <ChevronRightIcon size={12} /></div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="tut-cta-box" style={{ marginTop: 28 }}>
          <div className="tut-cta-title">看完想找实战数据？</div>
          <div className="tut-cta-body">
            浏览 <Link href={`${prefix}/prop-firm-rules`} className="firm-name-link">规则手册</Link> 看每家公司的硬指标对比，或翻
            <Link href={`${prefix}/payouts`} className="firm-name-link"> 出金记录</Link> 看真实到账截图。
          </div>
        </div>
      </article>
    </main>
  );
}
