import { Link } from "wouter";
import { firms } from "../data/firms";
import { LEADERBOARD } from "../data/leaderboard";

export default function LeaderboardPage() {
  return (
    <main className="container">
      <div className="section-title">🏅 Prop Firm Payouts Leaderboard</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 18, maxWidth: 720 }}>
        Firms ranked by total tracked payouts, sourced from the public payouts table.
        The per-trader leaderboard at /futures/payouts-leaderboard requires a logged-in
        account on the source site, so this firm-level ranking is shown instead.
      </p>

      <div className="popular-row" style={{ marginBottom: 30 }}>
        {LEADERBOARD.slice(0, 3).map((t, i) => {
          const f = firms.find(x => x.slug === t.slug || x.name === t.name);
          const trophy = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
          return (
            <div key={t.slug} className="popular-card">
              <div className="trophy">{trophy}</div>
              {f && (
                <div className="logo-wrap">
                  <img src={f.logo} alt={f.name} style={{ width: 48, height: 48, objectFit: "contain" }} />
                </div>
              )}
              <div className="name">{t.name}</div>
              <div className="meta">
                {t.count.toLocaleString()} payouts · avg ${t.avg.toLocaleString()}
              </div>
              <div className="discount" style={{ background: "var(--gradient-pp-2)", color: "white" }}>
                ${t.total.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="table-wrap">
        <table className="firms-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Firm</th>
              <th>Total Payouts</th>
              <th>No. of Payouts</th>
              <th>Largest</th>
              <th>Average</th>
              <th>Median Time</th>
            </tr>
          </thead>
          <tbody>
            {LEADERBOARD.map((t, i) => {
              const f = firms.find(x => x.slug === t.slug || x.name === t.name);
              return (
                <tr key={t.slug}>
                  <td><span className="rank-num">{i + 1}</span></td>
                  <td>
                    {f ? (
                      <div className="cell-firm">
                        <Link href={`/futures/prop-firms/${f.slug}`} className="firm-logo-sm">
                          <img src={f.logo} alt={f.name} />
                        </Link>
                        <Link href={`/futures/prop-firms/${f.slug}`} className="firm-name-link">{f.name}</Link>
                      </div>
                    ) : <span>{t.name}</span>}
                  </td>
                  <td style={{ color: "var(--orange)", fontWeight: 700 }}>${t.total.toLocaleString()}</td>
                  <td>{t.count.toLocaleString()}</td>
                  <td>${t.largest.toLocaleString()}</td>
                  <td>${t.avg.toLocaleString()}</td>
                  <td style={{ color: "var(--text-dim)", fontSize: 12 }}>{t.median}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
