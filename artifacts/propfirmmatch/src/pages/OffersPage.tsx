import { Link } from "wouter";
import { firms } from "../data/firms";

export default function OffersPage() {
  const offers = firms.filter(f => f.promoPercent > 0).sort((a,b) => b.promoPercent - a.promoPercent);
  return (
    <main className="container">
      <div className="section-title"><span className="icon">✨</span> Exclusive Futures Offers</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        Browse every active discount across all {firms.length} listed prop firms. Use the codes below at checkout to claim your savings.
      </p>
      <div className="offers-carousel">
        {offers.map(f => (
          <Link key={f.slug} href={`/futures/prop-firms/${f.slug}`} className="offer-card">
            {f.isNew && <span className="offer-new-pill">new</span>}
            <div className="offer-logo"><img src={f.logo} alt={f.name} /></div>
            <div className="offer-name">{f.name}</div>
            <div className="offer-rating">
              {f.rating ? <><span className="stars">{"★".repeat(Math.round(f.rating))}{"☆".repeat(5-Math.round(f.rating))}</span> <span>{f.rating}</span></> : <span>Less than 10 reviews</span>}
            </div>
            <div className="offer-discount">{f.promoPercent}% OFF</div>
            <div className="offer-code">Code <strong>{f.promoCode}</strong></div>
            {f.offerDescription && <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>{f.offerDescription.slice(0, 90)}{f.offerDescription.length > 90 && "…"}</div>}
          </Link>
        ))}
      </div>
    </main>
  );
}
