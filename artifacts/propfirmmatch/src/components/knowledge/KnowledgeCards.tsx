import { useState, useMemo } from "react";
import { KNOW_CARDS } from "../../data/knowledgeGraph";

const CATS = ["全部", "规则", "费用", "出金", "策略", "术语"] as const;

export default function KnowledgeCards() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("全部");
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [favs, setFavs] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem("kg_card_favs") || "{}");
    } catch {
      return {};
    }
  });

  const toggleFav = (id: string) => {
    setFavs((f) => {
      const next = { ...f, [id]: !f[id] };
      try {
        localStorage.setItem("kg_card_favs", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const list = useMemo(
    () => (cat === "全部" ? KNOW_CARDS : KNOW_CARDS.filter((c) => c.category === cat)),
    [cat],
  );

  return (
    <div className="kg-cards-wrap">
      <div className="kg-card-filters">
        {CATS.map((c) => (
          <button
            key={c}
            className={`kg-chip ${cat === c ? "active" : ""}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
        <span style={{ color: "var(--text-dim)", fontSize: 12, marginLeft: "auto" }}>
          已收藏 {Object.values(favs).filter(Boolean).length} 张
        </span>
      </div>
      <div className="kg-cards-grid">
        {list.map((c) => {
          const isFlipped = !!flipped[c.id];
          return (
            <div
              key={c.id}
              className={`kg-card ${isFlipped ? "flipped" : ""}`}
              onClick={() => setFlipped((f) => ({ ...f, [c.id]: !f[c.id] }))}
            >
              <div className="kg-card-cat">{c.category}</div>
              <button
                type="button"
                className={`kg-fav ${favs[c.id] ? "on" : ""}`}
                aria-label="收藏"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFav(c.id);
                }}
              >
                {favs[c.id] ? "★" : "☆"}
              </button>
              <div className="kg-card-term">{c.term}</div>
              <div className="kg-card-short">{isFlipped ? c.body : c.short}</div>
              <div className="kg-card-flip-hint">{isFlipped ? "点击收起" : "点击展开详情"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
