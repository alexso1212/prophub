import { Link } from "wouter";
import { useMemo, useState } from "react";
import { firms, Firm } from "../data/firms";
import NewsFeed from "../components/NewsFeed";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return <span className="stars">{"★".repeat(full)}{"☆".repeat(5 - full)}</span>;
}

function OfferCard({ f }: { f: Firm }) {
  return (
    <Link href={`/futures/prop-firms/${f.slug}`} className="offer-card">
      {f.isNew && <span className="offer-new-pill">new</span>}
      <div className="offer-logo"><img src={f.logo} alt={f.name} /></div>
      <div className="offer-name">{f.name}</div>
      <div className="offer-rating">
        {f.rating ? <><Stars rating={f.rating} /> <span>{f.rating}</span></> : <span>Less than 10 reviews</span>}
      </div>
      {f.promoPercent > 0 && (
        <>
          <div className="offer-discount">{f.promoPercent}% OFF</div>
          <div className="offer-code">Code <strong>{f.promoCode}</strong></div>
        </>
      )}
    </Link>
  );
}

function PopularCard({ f, place }: { f: Firm; place: 1 | 2 | 3 }) {
  const trophy = place === 1 ? "🥇" : place === 2 ? "🥈" : "🥉";
  return (
    <div className="popular-card">
      <div className="trophy">{trophy}</div>
      <Link href={`/futures/prop-firms/${f.slug}`}>
        <div className="logo-wrap"><img src={f.logo} alt={f.name} /></div>
        <div className="name">{f.name}</div>
      </Link>
      <div className="meta">
        {f.rating && <span>★ {f.rating}</span>}
        <span>{f.reviews} reviews</span>
      </div>
      {f.promoPercent > 0 && <div className="discount">{f.promoPercent}% OFF — {f.promoCode}</div>}
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
      {f.morePlatforms ? <span className="platform-more">+ {f.morePlatforms}</span> : null}
    </div>
  );
}

export default function HomePage() {
  const [filter, setFilter] = useState<"popular" | "new" | "all" | "favorite">("all");
  const [favorites] = useState<string[]>([]);

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
        <span className="icon">✨</span> Exclusive May Futures Offers
      </div>
      <div className="offers-carousel">
        {firms.filter(f => f.promoPercent > 0).slice(0, 8).map(f => <OfferCard key={f.slug} f={f} />)}
      </div>

      <div className="section-title" style={{ marginTop: 50 }}>
        Most Popular Futures Prop Firms <span style={{ background: "var(--orange)", padding: "2px 8px", borderRadius: 4, fontSize: 11, marginLeft: 8 }}>FUTURES</span>
      </div>
      <div className="popular-row">
        {top3.map((f, i) => <PopularCard key={f.slug} f={f} place={(i + 1) as 1 | 2 | 3} />)}
      </div>

      <div className="filter-bar">
        <button className="filter-pill">⚙ Filter</button>
        <button className={`filter-pill ${filter === "popular" ? "active" : ""}`} onClick={() => setFilter("popular")}>Popular</button>
        <button className={`filter-pill ${filter === "favorite" ? "active" : ""}`} onClick={() => setFilter("favorite")}>♡ Favorite {favorites.length}/3</button>
        <button className={`filter-pill ${filter === "new" ? "active" : ""}`} onClick={() => setFilter("new")}>New</button>
        <button className={`filter-pill ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
        <span className="live-tag">Live Data updated 1 min ago</span>
      </div>

      <div className="firms-count">
        All Futures Prop Firms <span className="num">{sorted.length}</span>
      </div>

      <div className="table-wrap">
        <table className="firms-table">
          <thead>
            <tr>
              <th>Firm</th>
              <th>Rank/Reviews</th>
              <th>Country</th>
              <th>Years</th>
              <th>Assets</th>
              <th>Platforms</th>
              <th>Max Allocation</th>
              <th>Promo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((f, idx) => (
              <tr key={f.slug}>
                <td>
                  <div className="cell-firm">
                    {idx < 15 && <span className="rank-num">{idx + 1}</span>}
                    <Link href={`/futures/prop-firms/${f.slug}`} className="firm-logo-sm">
                      {f.isNew && <span className="new-tag-overlay">new</span>}
                      <img src={f.logo} alt={f.name} />
                    </Link>
                    <div>
                      <Link href={`/futures/prop-firms/${f.slug}`} className="firm-name-link">{f.name}</Link>
                      <div className="firm-id">{f.trackingId}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="rating-cell">
                    {f.rating ? (
                      <><span className="num">{f.rating}</span><span className="reviews">{f.reviews} reviews</span></>
                    ) : (
                      <span className="reviews">Less than<br />10 reviews</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="country-cell">
                    <img src={`https://flagcdn.com/w80/${f.countryCode}.png`} alt={f.country} />
                    <span>{f.country}</span>
                  </div>
                </td>
                <td>{f.yearsInOperation}</td>
                <td>{f.numAssets}</td>
                <td><PlatformIcons f={f} /></td>
                <td style={{ fontWeight: 600 }}>{f.maxAllocation}</td>
                <td>
                  {f.promoPercent > 0 ? (
                    <div className="promo-cell">
                      <span className="promo-discount">{f.promoPercent}% OFF</span>
                      <span className="promo-code">{f.promoCode}</span>
                    </div>
                  ) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                </td>
                <td><Link href={`/futures/prop-firms/${f.slug}`} className="btn-firm">Firm</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="view-more"><button>View More</button></div>
      </div>

      <p className="page-footer-text">
        This page gives you access to accurate, up-to-date details on all prop firms listed on <a href="#">Prop Firm Match</a> to help you find the firm that fits your trading style. Compare ratings, number of reviews, firms' location, years in operation, trading platforms, supported assets, and max allocation. Select any firm to explore its rules, exclusive offers, and verified trader feedback.
      </p>
    </main>
  );
}
