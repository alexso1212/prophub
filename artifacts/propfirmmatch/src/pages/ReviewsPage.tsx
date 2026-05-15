import { Link } from "wouter";
import { firms } from "../data/firms";

export default function ReviewsPage() {
  const sorted = [...firms].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  return (
    <main className="container">
      <div className="section-title">⭐ 自营公司用户评价</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        来自真实签约交易员的已验证评价。一站浏览全部 {firms.length} 家自营公司的星级分布。
      </p>

      <div style={{ display: "grid", gap: 14 }}>
        {sorted.map(f => {
          const total = f.reviewsBreakdown?.reduce((a, b) => a + b.count, 0) || f.totalReviews || 0;
          return (
            <Link key={f.slug} href={`/futures/prop-firms/${f.slug}`} className="review-row-card">
              <div className="firm-logo-sm" style={{ width: 56, height: 56 }}>
                <img src={f.logo} alt={f.name} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{f.name}</div>
                <div style={{ color: "var(--text-dim)", fontSize: 12 }}>
                  {f.country} · 经营 {f.yearsInOperation} 年 · {f.dateCreated || ""}
                </div>
              </div>
              <div style={{ textAlign: "center", minWidth: 80 }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "var(--orange)" }}>{f.rating ?? "—"}</div>
                <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{total || f.reviews} 条评价</div>
              </div>
              {f.reviewsBreakdown && (
                <div className="review-bars" style={{ minWidth: 200, flex: "0 0 200px" }}>
                  {f.reviewsBreakdown.map(b => (
                    <div key={b.stars} className="bar-row">
                      <span className="star">{b.stars}★</span>
                      <div className="bar-track"><div className="bar-fill" style={{ width: `${total ? (b.count / total) * 100 : 0}%` }} /></div>
                      <span style={{ color: "var(--text-dim)" }}>{b.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
