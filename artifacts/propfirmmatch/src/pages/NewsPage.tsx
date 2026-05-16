import { useEffect, useMemo, useState } from "react";
import { NewsItem, NewsCard } from "../components/NewsFeed";
import { NewsIcon } from "../components/icons";

type Category = NewsItem["category"] | "all";

const TABS: { value: Category; label: string }[] = [
  { value: "all",     label: "全部" },
  { value: "forex",   label: "外汇" },
  { value: "futures", label: "期货" },
  { value: "indices", label: "股指" },
  { value: "crypto",  label: "加密" },
];

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<Category>("all");

  useEffect(() => {
    let cancelled = false;
    setItems(null); setError(false);
    const url = tab === "all" ? "/api/news?limit=30" : `/api/news?category=${tab}&limit=30`;
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((data: { items: NewsItem[] }) => { if (!cancelled) setItems(data.items); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [tab]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items?.length ?? 0 };
    if (items) for (const n of items) c[n.category] = (c[n.category] ?? 0) + 1;
    return c;
  }, [items]);

  return (
    <main className="container">
      <div className="section-title"><NewsIcon size={18} className="icon" /> 金融快讯中心</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 20, maxWidth: 720 }}>
        覆盖外汇、期货、股指、加密四大板块，原始英文快讯经 AI 重写为中文标题、摘要和三条要点，方便快速决策。
      </p>

      <div className="filter-bar">
        {TABS.map(t => (
          <button
            key={t.value}
            className={`filter-pill ${tab === t.value ? "active" : ""}`}
            onClick={() => setTab(t.value)}
          >
            {t.label}{tab === t.value && counts[t.value] !== undefined ? ` ${counts[t.value]}` : ""}
          </button>
        ))}
      </div>

      {items === null && !error && <div className="news-loading">新闻加载中…</div>}
      {error && <div className="news-error">新闻暂时无法加载，稍后再试。</div>}
      {items && items.length === 0 && <div className="news-loading">该分类暂无新闻。</div>}

      {items && items.length > 0 && (
        <div className="news-grid">
          {items.map(n => <NewsCard key={n.id} n={n} />)}
        </div>
      )}
    </main>
  );
}
