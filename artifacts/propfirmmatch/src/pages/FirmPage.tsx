import { Link, useParams } from "wouter";
import { useState } from "react";
import { findFirm, Firm } from "../data/firms";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return <span className="stars-row">{"★".repeat(full)}{"☆".repeat(5 - full)}</span>;
}

function ReviewBars({ f }: { f: Firm }) {
  const total = f.reviewsBreakdown?.reduce((a, b) => a + b.count, 0) || f.totalReviews || 1;
  const items = f.reviewsBreakdown || [
    { stars: 5, count: Math.round((f.totalReviews ?? 0) * 0.7) },
    { stars: 4, count: Math.round((f.totalReviews ?? 0) * 0.18) },
    { stars: 3, count: Math.round((f.totalReviews ?? 0) * 0.06) },
    { stars: 2, count: Math.round((f.totalReviews ?? 0) * 0.03) },
    { stars: 1, count: Math.round((f.totalReviews ?? 0) * 0.03) },
  ];
  return (
    <div className="review-bars">
      {items.map(b => (
        <div key={b.stars} className="bar-row">
          <span className="star">{b.stars}★</span>
          <div className="bar-track"><div className="bar-fill" style={{ width: `${(b.count / total) * 100}%` }} /></div>
          <span style={{ color: "var(--text-dim)" }}>{b.count}</span>
        </div>
      ))}
    </div>
  );
}

export default function FirmPage() {
  const { slug } = useParams();
  const f = findFirm(slug || "");
  const [tab, setTab] = useState<"overview" | "challenges" | "reviews" | "offers" | "payouts">("overview");

  if (!f) {
    return (
      <main className="simple-page">
        <h1>Firm not found</h1>
        <p>The firm you're looking for doesn't exist.</p>
        <Link href="/" className="btn-buy" style={{ display: "inline-block", marginTop: 20 }}>Back to all firms</Link>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="detail-top">
        <Link href="/" className="back-btn">←</Link>
        <div className="firm-pill">
          <img src={f.logo} alt={f.name} />
          <span>{f.name}</span>
          <span style={{ color: "var(--text-dim)" }}>▾</span>
        </div>
        <button className="fav-pill">♡ Set as Favorite</button>
        <div className="detail-actions">
          <button className="btn-outline">Leave a Review</button>
          <button className="btn-buy">Buy</button>
        </div>
      </div>

      <div className="detail-hero">
        <div className="hero-logo">
          {f.isNew && <span className="new-tag-overlay">NEW</span>}
          <img src={f.logo} alt={f.name} />
        </div>
        <div className="hero-info">
          <h1>{f.name}</h1>
          <div className="hero-likes">♡ {f.trackingId}</div>
          <div className="hero-meta">
            {f.ceo && <div className="item"><div className="label">CEO</div><div className="val">{f.ceo}</div></div>}
            <div className="item"><div className="label">Country</div>
              <div className="val"><img src={`https://flagcdn.com/w80/${f.countryCode}.png`} alt="" /> {f.country}</div>
            </div>
            {f.trustPilot && <div className="item"><div className="label">Trust Pilot</div><div className="val">{f.trustPilot}</div></div>}
            {f.dateCreated && <div className="item"><div className="label">Date Created</div><div className="val">{f.dateCreated}</div></div>}
            <div className="item"><div className="label">Years in Operation</div><div className="val">{f.yearsInOperation}</div></div>
          </div>
        </div>
        {f.rating && (
          <div className="review-box">
            <div>
              <div className="big">{f.rating}</div>
              <Stars rating={f.rating} />
              <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
                <span style={{ color: "var(--orange)" }}>{f.totalReviews}</span> total reviews
              </div>
            </div>
            <ReviewBars f={f} />
          </div>
        )}
      </div>

      {f.promoPercent > 0 && (
        <div className="offer-banner">
          <div className="left">
            <span className="badge">🔥 NEW OFFER</span>
            <span className="pct">{f.promoPercent}% OFF</span>
          </div>
          <div className="firm-mini">
            <div className="firm-logo-sm" style={{ width: 40, height: 40 }}>
              {f.isNew && <span className="new-tag-overlay">new</span>}
              <img src={f.logo} alt="" />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{f.name}</div>
              {f.rating && <div style={{ fontSize: 11, color: "var(--text-dim)" }}>★ {f.rating} ({f.reviews})</div>}
            </div>
          </div>
          <div className="desc">{f.offerDescription}</div>
          <div className="code-pill">Code <strong>{f.promoCode} 📋</strong></div>
        </div>
      )}

      <div className="detail-tabs">
        <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>Overview</button>
        <button className={tab === "challenges" ? "active" : ""} onClick={() => setTab("challenges")}>
          Challenges <span className="count-pill">{f.challenges?.length ?? 12}</span>
        </button>
        <button className={tab === "reviews" ? "active" : ""} onClick={() => setTab("reviews")}>
          Reviews <span className="count-pill">{f.reviews}</span>
        </button>
        <button className={tab === "offers" ? "active" : ""} onClick={() => setTab("offers")}>
          Offers <span className="count-pill">{f.promoPercent > 0 ? 2 : 0}</span>
        </button>
        <button className={tab === "payouts" ? "active" : ""} onClick={() => setTab("payouts")}>
          Payouts <span className="count-pill" style={{ background: "rgba(168,85,247,0.15)", color: "var(--purple)" }}>New</span>
        </button>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>{f.name} Futures Prop Firm Details</h2>
      <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0 24px" }} />

      <div className="detail-grid">
        <aside className="detail-side">
          <a href="#firm-overview" className="active">Firm Overview</a>
          <a href="#instruments">Instruments and Assets</a>
          <a href="#leverage">Leverage</a>
          <a href="#consistency">Consistency Rules</a>
          <a href="#rules">Firm Rules</a>
          <a href="#challenges-section">Challenges</a>
        </aside>

        <div>
          {tab === "overview" && (
            <>
              <div className="ai-summary-card">
                <span className="ai-tag">✨ AI Summary</span>
                <h3>{f.name} Firm AI Summary</h3>
                <p>{f.aiSummary.slice(0, 380)}{f.aiSummary.length > 380 && "..."}</p>
                <button className="show-more-btn">Show More ▾</button>
              </div>

              <section className="detail-section" id="firm-overview">
                <h2>Firm Overview</h2>
                {f.brokers && (
                  <div className="kv-block">
                    <div className="k">Broker:</div>
                    <div className="v">
                      {f.brokers.map((b, i) => (
                        <span key={i} className="kv-chip">{b.icon && <img src={b.icon} alt="" />}{b.name}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="kv-block">
                  <div className="k">Platform:</div>
                  <div className="v">
                    {f.platforms.map((p, i) => (
                      <span key={i} className="kv-chip">{p.icon && <img src={p.icon} alt="" />}{p.name}</span>
                    ))}
                  </div>
                </div>
                {f.paymentMethods && (
                  <div className="kv-block">
                    <div className="k">Payment Methods:</div>
                    <div className="v">
                      {f.paymentMethods.map((p, i) => (
                        <span key={i} className="kv-chip">{p.icon && <img src={p.icon} alt="" />}{p.name}</span>
                      ))}
                    </div>
                  </div>
                )}
                {f.payoutMethods && (
                  <div className="kv-block">
                    <div className="k">Payout Methods:</div>
                    <div className="v">
                      {f.payoutMethods.map((p, i) => (
                        <span key={i} className="kv-chip">{p.icon && <img src={p.icon} alt="" />}{p.name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <section className="detail-section" id="instruments">
                <h2>Instruments and Assets</h2>
                <div className="kv-block"><div className="k">Type of Instruments:</div><div className="v"><span className="kv-chip">Futures</span></div></div>
                <div className="kv-block"><div className="k">Assets:</div><div className="v"><span className="kv-chip">Futures</span></div></div>
              </section>

              {f.leverage && (
                <section className="detail-section" id="leverage">
                  <h2>Leverage</h2>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Max contract size</div>
                  <ul className="bullet-list">
                    {f.leverage.map((l, i) => <li key={i}>{l}</li>)}
                  </ul>
                </section>
              )}

              {f.consistencyRules && (
                <section className="detail-section" id="consistency">
                  <h2>Consistency Rules</h2>
                  {f.consistencyRules.map((c, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{c.program}</div>
                      <ul className="bullet-list"><li>{c.rule}</li></ul>
                    </div>
                  ))}
                </section>
              )}

              <section className="detail-section" id="rules">
                <h2>Firm Rules</h2>
                <p style={{ color: "var(--text-dim)" }}>
                  See the full rule book on the official {f.name} site. {f.name} maintains standard prop trading rules including consistency requirements, prohibited practices (HFT, hedging, arbitrage), and inactivity policies.
                </p>
              </section>

              {f.challenges && (
                <section className="detail-section" id="challenges-section">
                  <h2>Challenges</h2>
                  {f.challenges.map((c, i) => (
                    <div key={i} className="challenge-row">
                      <span className="name">{c.name.startsWith(f.name) ? c.name : `${f.name} - ${c.name}`}</span>
                      {c.original && <span className="original">{c.original}</span>}
                      <span className="price">{c.price}</span>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}

          {tab === "challenges" && (
            <section className="detail-section" style={{ borderTop: "none", marginTop: 0, paddingTop: 0 }}>
              <h2>{f.name} Challenges</h2>
              {(f.challenges && f.challenges.length > 0 ? f.challenges : []).map((c, i) => (
                <div key={i} className="challenge-row">
                  <span className="name">{c.name.startsWith(f.name) ? c.name : `${f.name} - ${c.name}`}</span>
                  {c.original && <span className="original">{c.original}</span>}
                  <span className="price">{c.price}</span>
                </div>
              ))}
              {(!f.challenges || f.challenges.length === 0) && (
                <p style={{ color: "var(--text-dim)" }}>No challenges listed for {f.name} yet.</p>
              )}
            </section>
          )}

          {tab === "reviews" && (
            <section className="detail-section" style={{ borderTop: "none", marginTop: 0, paddingTop: 0 }}>
              <h2>{f.name} Reviews ({f.reviews})</h2>
              <p style={{ color: "var(--text-dim)" }}>
                {f.reviews > 0
                  ? `${f.name} has ${f.reviews} verified reviews with an average rating of ${f.rating}/5. Login to leave your own review.`
                  : `${f.name} has fewer than 10 reviews. Be among the first to leave one.`}
              </p>
            </section>
          )}

          {tab === "offers" && (
            <section className="detail-section" style={{ borderTop: "none", marginTop: 0, paddingTop: 0 }}>
              <h2>{f.name} Offers</h2>
              {f.promoPercent > 0 ? (
                <div className="offer-banner" style={{ margin: 0 }}>
                  <div className="left">
                    <span className="badge">🔥 NEW OFFER</span>
                    <span className="pct">{f.promoPercent}% OFF</span>
                  </div>
                  <div className="desc">{f.offerDescription}</div>
                  <div className="code-pill">Code <strong>{f.promoCode}</strong></div>
                </div>
              ) : <p style={{ color: "var(--text-dim)" }}>No active offers right now.</p>}
            </section>
          )}

          {tab === "payouts" && (
            <section className="detail-section" style={{ borderTop: "none", marginTop: 0, paddingTop: 0 }}>
              <h2>{f.name} Payouts</h2>
              <p style={{ color: "var(--text-dim)" }}>
                Verified payout reports from real {f.name} traders. Payout data is updated as traders submit proof of withdrawal.
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
