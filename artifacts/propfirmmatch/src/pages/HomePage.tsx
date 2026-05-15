import { Link } from "wouter";
import { useMemo, useState } from "react";
import { firms, Firm } from "../data/firms";
import { findFirmZh } from "../data/firms.zh";
import { getBrandZh } from "../data/brandZh";
import { countryZh } from "../data/i18nZh";
import NewsFeed from "../components/NewsFeed";
import { useFirmsOverrides } from "../contexts/FirmsOverridesContext";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return <span className="stars">{"★".repeat(full)}{"☆".repeat(5 - full)}</span>;
}

function CtaButton({ f, overrideUrl, className, children }: {
  f: Firm;
  overrideUrl?: string | null;
  className?: string;
  children: React.ReactNode;
}) {
  if (overrideUrl) {
    return (
      <a href={overrideUrl} target="_blank" rel="noopener sponsored nofollow" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={`/futures/prop-firms/${f.slug}`} className={className}>
      {children}
    </Link>
  );
}

function OfferCard({ f }: { f: Firm }) {
  const zh = findFirmZh(f.slug);
  const overrides = useFirmsOverrides();
  const ov = overrides[f.slug];
  const promoCode = ov?.promoCode ?? f.promoCode;
  const promoPercent = ov?.discountPercent ?? ov?.promoPercent ?? f.promoPercent;
  const affiliateUrl = ov?.affiliateUrl;

  return (
    <CtaButton f={f} overrideUrl={affiliateUrl} className="offer-card">
      {f.isNew && <span className="offer-new-pill">新</span>}
      <div className="offer-logo"><img src={f.logo} alt={f.name} /></div>
      <div className="offer-name">{f.name}{getBrandZh(f.slug) && <span className="brand-zh-sub">{getBrandZh(f.slug)}</span>}</div>
      <div className="offer-rating">
        {f.rating ? <><Stars rating={f.rating} /> <span>{f.rating}</span></> : <span>评价不足 10 条</span>}
      </div>
      {promoPercent > 0 && (
        <>
          <div className="offer-discount">{promoPercent}% 折扣</div>
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

function PopularCard({ f, place }: { f: Firm; place: 1 | 2 | 3 }) {
  const overrides = useFirmsOverrides();
  const ov = overrides[f.slug];
  const promoCode = ov?.promoCode ?? f.promoCode;
  const promoPercent = ov?.discountPercent ?? ov?.promoPercent ?? f.promoPercent;
  const trophy = place === 1 ? "🥇" : place === 2 ? "🥈" : "🥉";
  return (
    <div className="popular-card">
      <div className="trophy">{trophy}</div>
      <Link href={`/futures/prop-firms/${f.slug}`}>
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
  return (
    <div className="platforms-cell">
      {f.platforms.slice(0, 4).map((p, i) => (
        <span key={i} className="platform-icon" title={p.name}>
          {p.icon ? <img src={p.icon} alt={p.name} /> : <span style={{fontSize:9}}>{p.name.slice(0,2)}</span>}
        </span>
      ))}
      {f.morePlatforms ? <span className="platform-more">+{f.morePlatforms}</span> : null}
    </div>
  );
}

export default function HomePage() {
  const [filter, setFilter] = useState<"popular" | "new" | "all" | "favorite">("all");
  const [favorites] = useState<string[]>([]);
  const overrides = useFirmsOverrides();

  const sorted = useMemo(() => {
    const arr = [...firms];
    if (filter === "new") return arr.filter(f => f.isNew);
    if (filter === "favorite") return arr.filter(f => favorites.includes(f.slug));
    if (filter === "popular") return arr.sort((a, b) => (a.rank ?? a.popularRank ?? 99) - (b.rank ?? b.popularRank ?? 99));
    return arr;
  }, [filter, favorites]);

  const top3 = [...firms].sort((a, b) => (a.popularRank ?? 99) - (b.popularRank ?? 99)).slice(0, 3);

  return (
    <main className="container">
      <NewsFeed limit={8} />

      <div className="section-title">
        <span className="icon">✨</span> 本月期货专属优惠
      </div>
      <div className="offers-carousel">
        {firms.filter(f => {
          const ov = overrides[f.slug];
          const pct = ov?.discountPercent ?? ov?.promoPercent ?? f.promoPercent;
          return pct > 0;
        }).slice(0, 8).map(f => <OfferCard key={f.slug} f={f} />)}
      </div>

      <div className="section-title" style={{ marginTop: 50 }}>
        最受欢迎的期货自营公司 <span style={{ background: "var(--orange)", padding: "2px 8px", borderRadius: 4, fontSize: 11, marginLeft: 8 }}>期货</span>
      </div>
      <div className="popular-row">
        {top3.map((f, i) => <PopularCard key={f.slug} f={f} place={(i + 1) as 1 | 2 | 3} />)}
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
        全部期货自营公司 <span className="num">{sorted.length}</span>
      </div>

      <div className="table-wrap">
        <table className="firms-table">
          <thead>
            <tr>
              <th>公司</th>
              <th>评分 / 评价</th>
              <th>国家</th>
              <th>经营年数</th>
              <th>品种数</th>
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
              const affiliateUrl = ov?.affiliateUrl;
              return (
                <tr key={f.slug}>
                  <td>
                    <div className="cell-firm">
                      {idx < 15 && <span className="rank-num">{idx + 1}</span>}
                      <Link href={`/futures/prop-firms/${f.slug}`} className="firm-logo-sm">
                        {f.isNew && <span className="new-tag-overlay">新</span>}
                        <img src={f.logo} alt={f.name} />
                      </Link>
                      <div>
                        <Link href={`/futures/prop-firms/${f.slug}`} className="firm-name-link">{f.name}</Link>
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
                        <span className="reviews">少于<br />10 条评价</span>
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
                  <td>{f.numAssets}</td>
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
                    {affiliateUrl ? (
                      <a href={affiliateUrl} target="_blank" rel="noopener sponsored nofollow" className="btn-firm">Firm</a>
                    ) : (
                      <Link href={`/futures/prop-firms/${f.slug}`} className="btn-firm">详情</Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="view-more"><button>查看更多</button></div>
      </div>

      <p className="page-footer-text">
        本页汇总 <a href="#">Prop Firm Match</a> 收录的全部自营公司最新数据，便于你快速找到适合自己交易风格的合作伙伴。可对比评分、评价数、注册地、经营年数、交易平台、可交易品种和最大资金额度，点击任意公司即可查看完整规则、专属优惠和真实交易员反馈。
      </p>
    </main>
  );
}
