import { useEffect, useState } from "react";
import { Link } from "wouter";
import { firms } from "../data/firms";

const KEY = "pfm-favorites";

export default function FavoritesPage() {
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    try { setFavs(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { /* noop */ }
  }, []);

  const toggle = (slug: string) => {
    setFavs(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug].slice(0, 3);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  };

  const favFirms = firms.filter(f => favs.includes(f.slug));

  return (
    <main className="container">
      <div className="section-title">♡ Favorite Firms</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        Save up to 3 firms for quick comparison. Click the heart on any firm below to add or remove from your favorites.
      </p>

      {favFirms.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", border: "1px dashed var(--border)", borderRadius: 12, marginBottom: 30 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>♡</div>
          <div style={{ color: "var(--text-dim)" }}>No favorites yet — pick up to 3 below.</div>
        </div>
      ) : (
        <div className="popular-row" style={{ marginBottom: 30 }}>
          {favFirms.map((f, i) => (
            <div key={f.slug} className="popular-card">
              <div className="trophy">{["★","★","★"][i]}</div>
              <Link href={`/futures/prop-firms/${f.slug}`}>
                <div className="logo-wrap"><img src={f.logo} alt={f.name} /></div>
                <div className="name">{f.name}</div>
              </Link>
              <div className="meta">
                {f.rating && <span>★ {f.rating}</span>}
                <span>{f.reviews} reviews</span>
              </div>
              <button className="btn-outline" style={{ marginTop: 10 }} onClick={() => toggle(f.slug)}>Remove</button>
            </div>
          ))}
        </div>
      )}

      <div className="firms-count">All Firms <span className="num">{firms.length}</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {firms.map(f => {
          const on = favs.includes(f.slug);
          return (
            <div key={f.slug} className="offer-card">
              <button
                onClick={() => toggle(f.slug)}
                aria-label={on ? "Remove favorite" : "Add favorite"}
                style={{ position: "absolute", top: 10, right: 10, fontSize: 18, color: on ? "var(--orange)" : "var(--text-muted)" }}
              >
                {on ? "♥" : "♡"}
              </button>
              <Link href={`/futures/prop-firms/${f.slug}`}>
                <div className="offer-logo"><img src={f.logo} alt={f.name} /></div>
                <div className="offer-name">{f.name}</div>
                <div className="offer-rating">
                  {f.rating ? <span>★ {f.rating}</span> : <span>New</span>}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
