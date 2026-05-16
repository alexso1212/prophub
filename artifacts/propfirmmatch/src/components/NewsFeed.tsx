import { useEffect, useState } from "react";
import { Link } from "wouter";

export interface NewsItem {
  id: string;
  publishedAt: string;
  sourceLabel: string;
  category: "forex" | "futures" | "indices" | "crypto";
  tickers: string[];
  titleZh: string;
  summaryZh: string;
  takeawaysZh: string[];
  originalUrl: string;
}

export const CATEGORY_LABEL: Record<NewsItem["category"], string> = {
  forex: "外汇",
  futures: "期货",
  indices: "股指",
  crypto: "加密",
};

export function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  return `${d} 天前`;
}

export function NewsCard({ n }: { n: NewsItem }) {
  return (
    <article className={`news-card cat-${n.category}`}>
      <header className="nc-head">
        <span className={`cat-badge cat-${n.category}`}>{CATEGORY_LABEL[n.category]}</span>
        <span className="nc-time">{relTime(n.publishedAt)}</span>
        <span className="nc-source">· {n.sourceLabel}</span>
        {n.tickers.length > 0 && (
          <span className="nc-tickers">
            {n.tickers.slice(0, 3).map(t => <span key={t} className="ticker-chip">{t}</span>)}
          </span>
        )}
      </header>
      <h3 className="nc-title">{n.titleZh}</h3>
      <p className="nc-summary">{n.summaryZh}</p>
      <ul className="nc-takeaways">
        {n.takeawaysZh.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
      <a href={n.originalUrl} target="_blank" rel="noreferrer noopener" className="nc-source-link">
        查看原文 →
      </a>
    </article>
  );
}

export default function NewsFeed({ limit = 8 }: { limit?: number }) {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/news?limit=${limit}`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((data: { items: NewsItem[] }) => { if (!cancelled) setItems(data.items); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [limit]);

  return (
    <section className="news-feed">
      <div className="news-feed-head">
        <h2><span className="news-feed-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="14" height="16" rx="1.5"/><path d="M17 8h3v9a3 3 0 0 1-3 3"/><path d="M6 8h7M6 12h7M6 16h4"/></svg></span> 实时金融快讯</h2>
        <Link href="/futures/news" className="news-more">查看全部 →</Link>
      </div>

      {items === null && !error && (
        <div className="news-loading">新闻加载中…</div>
      )}
      {error && (
        <div className="news-error">新闻暂时无法加载，稍后再试。</div>
      )}
      {items && items.length === 0 && (
        <div className="news-loading">暂无新闻。</div>
      )}

      {items && items.length > 0 && (
        <div className="news-row">
          {items.map(n => <NewsCard key={n.id} n={n} />)}
        </div>
      )}
    </section>
  );
}
