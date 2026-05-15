import { Link } from "wouter";
import { firms } from "../data/firms";
import { PAYOUTS, totalTrackedPayouts, totalPayoutCount } from "../data/payouts";

const avgAcrossFirms = Math.round(totalTrackedPayouts / totalPayoutCount);

export default function PayoutsPage() {
  return (
    <main className="container">
      <div className="section-title">💰 Prop Firm Payouts Tracker</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        Tracked payout totals across {PAYOUTS.length} prop firms — total payouts, payout
        count, largest single payout, average size, and median time-to-payout. Compiled
        from the source firm-level payout records.
      </p>

      <div className="popular-row" style={{ marginBottom: 30 }}>
        <div className="popular-card" style={{ background: "linear-gradient(135deg, rgba(255,106,61,0.08), rgba(168,85,247,0.04))" }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Total Tracked Payouts</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--orange)" }}>${totalTrackedPayouts.toLocaleString()}</div>
        </div>
        <div className="popular-card">
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Total Payout Count</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{totalPayoutCount.toLocaleString()}</div>
        </div>
        <div className="popular-card">
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Avg Payout (all firms)</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>${avgAcrossFirms.toLocaleString()}</div>
        </div>
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
            {PAYOUTS.map((p, i) => {
              const f = firms.find(x => x.slug === p.slug || x.name === p.name);
              return (
                <tr key={p.slug}>
                  <td><span className="rank-num">{i+1}</span></td>
                  <td>
                    {f ? (
                      <div className="cell-firm">
                        <Link href={`/futures/prop-firms/${f.slug}`} className="firm-logo-sm">
                          <img src={f.logo} alt={f.name} />
                        </Link>
                        <Link href={`/futures/prop-firms/${f.slug}`} className="firm-name-link">{f.name}</Link>
                      </div>
                    ) : <span>{p.name}</span>}
                  </td>
                  <td style={{ color: "var(--orange)", fontWeight: 700 }}>${p.total.toLocaleString()}</td>
                  <td>{p.count.toLocaleString()}</td>
                  <td>${p.largest.toLocaleString()}</td>
                  <td>${p.avg.toLocaleString()}</td>
                  <td style={{ color: "var(--text-dim)", fontSize: 12 }}>{p.median}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
