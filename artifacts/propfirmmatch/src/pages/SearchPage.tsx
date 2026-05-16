import { Link, useLocation } from "wouter";
import { useMemo } from "react";
import { Firm, getDiscountedPrices, formatUsd } from "../data/firms";
import { findFirmZh } from "../data/firms.zh";
import { getBrandZh } from "../data/brandZh";
import { firmsForCategory, useCategory, type Category } from "../contexts/CategoryContext";
import FirmLogo from "../components/FirmLogo";
import { StarRow } from "../components/icons";

interface SearchHit {
  firm: Firm;
  category: Category;
}

function Stars({ rating }: { rating: number }) {
  return <StarRow rating={rating} className="stars" />;
}

function ResultCard({ hit }: { hit: SearchHit }) {
  const f = hit.firm;
  const zh = findFirmZh(f.slug);
  const catLabel = hit.category === "forex" ? "外汇" : hit.category === "crypto" ? "加密" : "期货";
  return (
    <Link href={`/${hit.category}/prop-firms/${f.slug}`} className="offer-card">
      {f.isNew && <span className="offer-new-pill">新</span>}
      <div className="offer-logo"><FirmLogo src={f.logo} alt={f.name} /></div>
      <div className="offer-name">
        {f.name}
        {getBrandZh(f.slug) && <span className="brand-zh-sub">{getBrandZh(f.slug)}</span>}
      </div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{catLabel}板块</div>
      <div className="offer-rating">
        {f.rating ? <><Stars rating={f.rating} /> <span>{f.rating}</span></> : <span>评价不足 10 条</span>}
      </div>
      {f.promoPercent > 0 && (
        <>
          <div className="offer-discount">{f.promoPercent}% 折扣</div>
          {(() => {
            const prices = getDiscountedPrices(f, f.promoPercent);
            return prices ? (
              <div className="offer-price-row">
                <span className="original">{formatUsd(prices.original)}</span>
                <span className="price">{formatUsd(prices.discounted)}</span>
              </div>
            ) : null;
          })()}
          <div className="offer-code">优惠码 <strong>{f.promoCode}</strong></div>
          {zh?.offerDescriptionZh && (
            <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
              {zh.offerDescriptionZh.slice(0, 40)}
            </div>
          )}
        </>
      )}
    </Link>
  );
}

export default function SearchPage() {
  const [path] = useLocation();
  const category = useCategory();
  const fallbackPrefix = `/${category}`;
  const query = useMemo(() => {
    const qs = typeof window !== "undefined" ? window.location.search : "";
    const params = new URLSearchParams(qs);
    return (params.get("q") ?? "").trim();
  }, [path]);

  const results = useMemo<SearchHit[]>(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    const hits: SearchHit[] = [];
    for (const cat of ["futures", "forex", "crypto"] as const) {
      for (const f of firmsForCategory(cat)) {
        const matches =
          f.name.toLowerCase().includes(q)
          || f.slug.toLowerCase().includes(q)
          || (() => { const b = getBrandZh(f.slug); return !!(b && b.includes(query)); })();
        if (matches) hits.push({ firm: f, category: cat });
      }
    }
    return hits;
  }, [query]);

  return (
    <main className="container">
      <div className="section-title">搜索结果</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 18, maxWidth: 720 }}>
        {query
          ? <>关键词 <strong style={{ color: "var(--text)" }}>"{query}"</strong> 共匹配到 {results.length} 家自营公司。</>
          : "请在顶部搜索框输入公司名称、拼音或中文品牌进行搜索。"}
      </p>

      {query && results.length === 0 && (
        <p style={{ color: "var(--text-muted)" }}>
          未找到匹配的公司。试试别的关键词，或返回 <Link href={`${fallbackPrefix}/all-prop-firms`} style={{ color: "var(--orange)" }}>全部公司</Link>。
        </p>
      )}

      {results.length > 0 && (
        <div className="offers-carousel">
          {results.map(h => <ResultCard key={`${h.category}-${h.firm.slug}`} hit={h} />)}
        </div>
      )}
    </main>
  );
}
