import { useState } from "react";
import { Link } from "wouter";
import { firms } from "../data/firms";
import { leaderboard as TRADERS } from "../data/leaderboard";

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<"30d"|"90d"|"all">("30d");

  return (
    <main className="container">
      <div className="section-title">🏅 Trader Leaderboard</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 18, maxWidth: 720 }}>
        Top funded traders ranked by total verified payouts. Updated continuously as new payouts are approved.
      </p>

      <div className="filter-bar">
        {(["30d","90d","all"] as const).map(p => (
          <button key={p} className={`filter-pill ${period===p?"active":""}`} onClick={() => setPeriod(p)}>
            {p === "30d" ? "Last 30 Days" : p === "90d" ? "Last 90 Days" : "All Time"}
          </button>
        ))}
        <span className="live-tag">Live · updated 2 min ago</span>
      </div>

      <div className="popular-row" style={{ marginBottom: 30 }}>
        {TRADERS.slice(0,3).map((t, i) => {
          const f = firms.find(x => x.name === t.firm);
          const trophy = i===0 ? "🥇" : i===1 ? "🥈" : "🥉";
          return (
            <div key={t.name} className="popular-card">
              <div className="trophy">{trophy}</div>
              <div className="logo-wrap" style={{ background: "rgba(255,106,61,0.08)" }}>
                <img src={`https://flagcdn.com/w160/${t.country}.png`} alt="" style={{ width: 48, height: 32, objectFit: "cover", borderRadius: 4 }} />
              </div>
              <div className="name">{t.name}</div>
              <div className="meta">
                {f && <Link href={`/futures/prop-firms/${f.slug}`}>{f.name}</Link>}
              </div>
              <div className="discount" style={{ background: "var(--gradient-pp-2)", color: "white" }}>${t.payouts.toLocaleString()}</div>
            </div>
          );
        })}
      </div>

      <div className="table-wrap">
        <table className="firms-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Trader</th>
              <th>Country</th>
              <th>Firm</th>
              <th>Payouts</th>
              <th>Win Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {TRADERS.map((t, i) => {
              const f = firms.find(x => x.name === t.firm);
              return (
                <tr key={t.name}>
                  <td><span className="rank-num">{i+1}</span></td>
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td>
                    <div className="country-cell">
                      <img src={`https://flagcdn.com/w80/${t.country}.png`} alt={t.country.toUpperCase()} />
                      <span style={{ textTransform: "uppercase", fontSize: 12 }}>{t.country}</span>
                    </div>
                  </td>
                  <td>
                    {f ? (
                      <div className="cell-firm">
                        <Link href={`/futures/prop-firms/${f.slug}`} className="firm-logo-sm">
                          <img src={f.logo} alt={f.name} />
                        </Link>
                        <Link href={`/futures/prop-firms/${f.slug}`} className="firm-name-link">{f.name}</Link>
                      </div>
                    ) : t.firm}
                  </td>
                  <td>{t.count}</td>
                  <td>{t.win}%</td>
                  <td style={{ color: "var(--orange)", fontWeight: 700 }}>${t.payouts.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
