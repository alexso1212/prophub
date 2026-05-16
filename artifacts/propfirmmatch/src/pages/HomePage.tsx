import { Link } from "wouter";
import { useMemo, useState } from "react";
import { Firm, getDiscountedPrices, formatUsd } from "../data/firms";
import { findFirmZh } from "../data/firms.zh";
import { getBrandZh } from "../data/brandZh";
import { countryZh } from "../data/i18nZh";
import NewsFeed from "../components/NewsFeed";
import { useFirmsOverrides } from "../contexts/FirmsOverridesContext";
import { useCategory, useCategoryFirms, useCategoryMeta } from "../contexts/CategoryContext";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return <span className="stars">{"★".repeat(full)}{"☆".repeat(5 - full)}</span>;
}

function CtaButton({ f, className, children }: {
  f: Firm;
  overrideUrl?: string | null;
  className?: string;
  children: React.ReactNode;
  prefix: string;
}) {
  return (
    <Link href={`/go/${f.slug}`} className={className}>
      {children}
    </Link>
  );
}

function OfferCard({ f, prefix }: { f: Firm; prefix: string }) {
  const zh = findFirmZh(f.slug);
  const overrides = useFirmsOverrides();
  const ov = overrides[f.slug];
  const promoCode = ov?.promoCode ?? f.promoCode;
  const promoPercent = ov?.discountPercent ?? ov?.promoPercent ?? f.promoPercent;

  return (
    <CtaButton f={f} className="offer-card" prefix={prefix}>
      {f.isNew && <span className="offer-new-pill">新</span>}
      <div className="offer-logo"><img src={f.logo} alt={f.name} /></div>
      <div className="offer-name">{f.name}{getBrandZh(f.slug) && <span className="brand-zh-sub">{getBrandZh(f.slug)}</span>}</div>
      <div className="offer-rating">
        {f.rating ? <><Stars rating={f.rating} /> <span>{f.rating}</span></> : <span>评价不足 10 条</span>}
      </div>
      {promoPercent > 0 && (
        <>
          <div className="offer-discount">{promoPercent}% 折扣</div>
          {(() => {
            const prices = getDiscountedPrices(f, promoPercent);
            return prices ? (
              <div className="offer-price-row">
                <span className="original">{formatUsd(prices.original)}</span>
                <span className="price">{formatUsd(prices.discounted)}</span>
              </div>
            ) : null;
          })()}
          <div className="offer-code">优惠码 <strong>{promoCode}</strong></div>
          {zh?.offerDescriptionZh && (
            <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
              {zh.offerDescriptionZh.slice(0, 40)}
            </div>
          )}
        </>
      )}
    </CtaButton>
  );
}

function PopularCard({ f, place, prefix }: { f: Firm; place: 1 | 2 | 3; prefix: string }) {
  const overrides = useFirmsOverrides();
  const ov = overrides[f.slug];
  const promoCode = ov?.promoCode ?? f.promoCode;
  const promoPercent = ov?.discountPercent ?? ov?.promoPercent ?? f.promoPercent;
  const trophy = place === 1 ? "🥇" : place === 2 ? "🥈" : "🥉";
  return (
    <div className="popular-card">
      <div className="trophy">{trophy}</div>
      <Link href={`${prefix}/prop-firms/${f.slug}`}>
        <div className="logo-wrap"><img src={f.logo} alt={f.name} /></div>
        <div className="name">{f.name}{getBrandZh(f.slug) && <span className="brand-zh-sub">{getBrandZh(f.slug)}</span>}</div>
      </Link>
      <div className="meta">
        {f.rating && <span>★ {f.rating}</span>}
        <span>{f.reviews} 条评价</span>
      </div>
      {promoPercent > 0 && <div className="discount">{promoPercent}% 折扣 — {promoCode}</div>}
    </div>
  );
}

function PlatformIcons({ f }: { f: Firm }) {
  const more = (f.platforms.length > 4 ? f.platforms.length - 4 : 0) + (f.morePlatforms ?? 0);
  return (
    <div className="platforms-cell">
      {f.platforms.slice(0, 4).map((p, i) => (
        <span key={i} className="platform-icon" title={p.name}>
          {p.icon ? <img src={p.icon} alt={p.name} /> : <span style={{fontSize:9}}>{p.name.slice(0,2)}</span>}
        </span>
      ))}
      {more > 0 ? <span className="platform-more-pill">+{more}</span> : null}
    </div>
  );
}

function RankBadge({ place }: { place: number }) {
  if (place <= 3) {
    const cls = place === 1 ? "gold" : place === 2 ? "silver" : "bronze";
    return (
      <span className={`rank-trophy ${cls}`} aria-label={`第 ${place} 名`}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7 4h10v2h3v3a4 4 0 0 1-4 4h-.18A5 5 0 0 1 13 16.9V19h3v2H8v-2h3v-2.1A5 5 0 0 1 7.18 13H7a4 4 0 0 1-4-4V6h3V4Zm-2 4v1a2 2 0 0 0 2 2V8H5Zm12 0v3a2 2 0 0 0 2-2V8h-2Z"
          />
        </svg>
        <span className="rank-trophy-num">{place}</span>
      </span>
    );
  }
  return <span className="rank-num-circle">{place}</span>;
}

export default function HomePage() {
  const [filter, setFilter] = useState<"popular" | "new" | "all" | "favorite">("all");
  const [favorites] = useState<string[]>([]);
  const overrides = useFirmsOverrides();
  const category = useCategory();
  const meta = useCategoryMeta();
  const firms = useCategoryFirms();
  const prefix = `/${category}`;

  const sorted = useMemo(() => {
    const arr = [...firms];
    if (filter === "new") return arr.filter(f => f.isNew);
    if (filter === "favorite") return arr.filter(f => favorites.includes(f.slug));
    if (filter === "popular") return arr.sort((a, b) => (a.rank ?? a.popularRank ?? 99) - (b.rank ?? b.popularRank ?? 99));
    return arr;
  }, [filter, favorites, firms]);

  const top3 = useMemo(
    () => [...firms].sort((a, b) => (a.popularRank ?? 99) - (b.popularRank ?? 99)).slice(0, 3),
    [firms]
  );

  return (
    <main className="container">
      <div className="section-title">
        <span className="icon">✨</span> 本月{meta.label}专属优惠
      </div>
      <div className="offers-carousel">
        {firms.filter(f => {
          const ov = overrides[f.slug];
          const pct = ov?.discountPercent ?? ov?.promoPercent ?? f.promoPercent;
          return pct > 0;
        }).slice(0, 8).map(f => <OfferCard key={f.slug} f={f} prefix={prefix} />)}
      </div>

      <div className="section-title" style={{ marginTop: 50 }}>
        最受欢迎的{meta.label}自营公司 <span style={{ background: "var(--orange)", padding: "2px 8px", borderRadius: 4, fontSize: 11, marginLeft: 8 }}>{meta.shortLabel}</span>
      </div>
      <div className="popular-row">
        {top3.map((f, i) => <PopularCard key={f.slug} f={f} place={(i + 1) as 1 | 2 | 3} prefix={prefix} />)}
      </div>

      <div className="filter-bar">
        <button className="filter-pill">⚙ 筛选</button>
        <button className={`filter-pill ${filter === "popular" ? "active" : ""}`} onClick={() => setFilter("popular")}>人气</button>
        <button className={`filter-pill ${filter === "favorite" ? "active" : ""}`} onClick={() => setFilter("favorite")}>♡ 收藏 {favorites.length}/3</button>
        <button className={`filter-pill ${filter === "new" ? "active" : ""}`} onClick={() => setFilter("new")}>新上线</button>
        <button className={`filter-pill ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>全部</button>
        <span className="live-tag">数据 1 分钟前更新</span>
      </div>

      <div className="firms-count">
        全部{meta.label}自营公司 <span className="count-pill">{sorted.length}</span>
      </div>

      <div className="table-wrap firms-desktop">
        <div className="table-scroll-hint" aria-hidden="true">← 左右滑动查看更多 →</div>
        <table className="firms-table">
          <thead>
            <tr>
              <th>公司</th>
              <th>评分 / 评价</th>
              <th>国家</th>
              <th>经营年数</th>
              <th>{category === "forex" ? "货币对" : "品种数"}</th>
              <th>交易平台</th>
              <th>最大资金</th>
              <th>优惠</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((f, idx) => {
              const ov = overrides[f.slug];
              const promoCode = ov?.promoCode ?? f.promoCode;
              const promoPercent = ov?.discountPercent ?? ov?.promoPercent ?? f.promoPercent;
              const place = idx + 1;
              const rowClass = place === 1 ? "rank-row-1" : place === 2 ? "rank-row-2" : place === 3 ? "rank-row-3" : "";
              return (
                <tr key={f.slug} className={rowClass}>
                  <td className="firm-col">
                    <div className="cell-firm">
                      <RankBadge place={place} />
                      <Link href={`${prefix}/prop-firms/${f.slug}`} className={`firm-logo-sm ${place <= 3 ? `logo-rank-${place}` : ""}`}>
                        {f.isNew && <span className="new-ribbon">新</span>}
                        <img src={f.logo} alt={f.name} />
                      </Link>
                      <div>
                        <Link href={`${prefix}/prop-firms/${f.slug}`} className="firm-name-link">{f.name}</Link>
                        {getBrandZh(f.slug) && <div className="brand-zh-sub">{getBrandZh(f.slug)}</div>}
                        <div className="firm-id">{f.trackingId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="rating-cell">
                      {f.rating ? (
                        <><span className="num">{f.rating}</span><span className="reviews">{f.reviews} 条评价</span></>
                      ) : (
                        <span className="reviews">少于 10 条评价</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="country-cell">
                      <img src={`https://flagcdn.com/w80/${f.countryCode}.png`} alt={f.country} />
                      <span>{countryZh(f.countryCode?.toUpperCase() || "", f.country)}</span>
                    </div>
                  </td>
                  <td>{f.yearsInOperation} 年</td>
                  <td>{category === "forex" ? (f.currencyPairs ?? f.numAssets) : f.numAssets}</td>
                  <td><PlatformIcons f={f} /></td>
                  <td style={{ fontWeight: 600 }}>{f.maxAllocation}</td>
                  <td>
                    {promoPercent > 0 ? (
                      <div className="promo-cell">
                        <span className="promo-discount">{promoPercent}% 折扣</span>
                        <span className="promo-code">{promoCode}</span>
                      </div>
                    ) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                  </td>
                  <td>
                    <Link href={`/go/${f.slug}`} className="btn-firm">Firm</Link>
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: "center", color: "var(--text-dim)", padding: 32 }}>
                {meta.label}板块暂无符合条件的公司。
              </td></tr>
            )}
          </tbody>
        </table>
        <div className="view-more"><Link href={`${prefix}/all-prop-firms`} className="btn-firm">查看更多</Link></div>
      </div>

      {/* Mobile split view: left column scrolls with page; right column scrolls horizontally */}
      {sorted.length > 0 && (
      <div className="firms-mobile" aria-hidden={false}>
        <div className="firms-mobile-left">
          <div className="fm-header-spacer" />
          {sorted.map((f, idx) => {
            const place = idx + 1;
            const rowClass = place <= 3 ? `rank-row-${place}` : "";
            return (
              <div key={f.slug} className={`fm-row fm-left-row ${rowClass}`}>
                <RankBadge place={place} />
                <Link
                  href={`${prefix}/prop-firms/${f.slug}`}
                  className={`firm-logo-sm ${place <= 3 ? `logo-rank-${place}` : ""}`}
                >
                  {f.isNew && <span className="new-ribbon">新</span>}
                  <img src={f.logo} alt={f.name} />
                </Link>
                <div className="fm-firm-meta">
                  <Link href={`${prefix}/prop-firms/${f.slug}`} className="firm-name-link">{f.name}</Link>
                  {getBrandZh(f.slug) && <div className="brand-zh-sub">{getBrandZh(f.slug)}</div>}
                  <div className="firm-id">{f.trackingId}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="firms-mobile-right">
          <table className="firms-table-mobile">
            <thead>
              <tr>
                <th>评分</th>
                <th>国家</th>
                <th>年数</th>
                <th>{category === "forex" ? "货币对" : "品种"}</th>
                <th>平台</th>
                <th>最大资金</th>
                <th>优惠</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((f, idx) => {
                const ov = overrides[f.slug];
                const promoCode = ov?.promoCode ?? f.promoCode;
                const promoPercent = ov?.discountPercent ?? ov?.promoPercent ?? f.promoPercent;
                const place = idx + 1;
                const rowClass = place <= 3 ? `rank-row-${place}` : "";
                return (
                  <tr key={f.slug} className={`fm-row ${rowClass}`}>
                    <td>
                      <div className="rating-cell">
                        {f.rating ? (
                          <><span className="num">{f.rating}</span><span className="reviews">{f.reviews}</span></>
                        ) : <span className="reviews">&lt;10</span>}
                      </div>
                    </td>
                    <td>
                      <div className="country-cell">
                        <img src={`https://flagcdn.com/w80/${f.countryCode}.png`} alt={f.country} />
                      </div>
                    </td>
                    <td>{f.yearsInOperation}年</td>
                    <td>{category === "forex" ? (f.currencyPairs ?? f.numAssets) : f.numAssets}</td>
                    <td><PlatformIcons f={f} /></td>
                    <td style={{ fontWeight: 600 }}>{f.maxAllocation}</td>
                    <td>
                      {promoPercent > 0 ? (
                        <div className="promo-cell">
                          <span className="promo-discount">{promoPercent}%</span>
                          <span className="promo-code">{promoCode}</span>
                        </div>
                      ) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                    </td>
                    <td>
                      <Link href={`/go/${f.slug}`} className="btn-firm">Firm</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}
      {sorted.length === 0 && (
        <div className="firms-mobile-empty">{meta.label}板块暂无符合条件的公司。</div>
      )}
      {sorted.length > 0 && (
        <div className="view-more firms-mobile-more">
          <Link href={`${prefix}/all-prop-firms`} className="btn-firm">查看更多</Link>
        </div>
      )}

      <p className="page-footer-text">
        本页汇总 <span>Prop Firm Match</span> 收录的全部{meta.label}自营公司最新数据，便于你快速找到适合自己交易风格的合作伙伴。可对比评分、评价数、注册地、经营年数、交易平台、可交易品种和最大资金额度，点击任意公司即可查看完整规则、专属优惠和真实交易员反馈。
      </p>

      <NewsFeed limit={6} />
    </main>
  );
}
