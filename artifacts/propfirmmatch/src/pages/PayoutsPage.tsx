import { Link } from "wouter";
import { firms } from "../data/firms";
import { payouts as SAMPLE_PAYOUTS } from "../data/payouts";

const totalPayouts = SAMPLE_PAYOUTS.reduce((a, b) => a + b.amount, 0);
const avgPayout = Math.round(totalPayouts / SAMPLE_PAYOUTS.length);

export default function PayoutsPage() {
  return (
    <main className="container">
      <div className="section-title">💰 Verified Payouts</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        Recent verified payout reports submitted by funded traders. Updated daily as new proof of withdrawal is approved.
      </p>

      <div className="popular-row" style={{ marginBottom: 30 }}>
        <div className="popular-card" style={{ background: "linear-gradient(135deg, rgba(255,106,61,0.08), rgba(168,85,247,0.04))" }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Total Payouts (30d)</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--orange)" }}>${totalPayouts.toLocaleString()}</div>
        </div>
        <div className="popular-card">
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Verified Payouts</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{SAMPLE_PAYOUTS.length}</div>
        </div>
        <div className="popular-card">
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Avg Payout</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>${avgPayout.toLocaleString()}</div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="firms-table">
          <thead>
            <tr>
              <th>Trader</th>
              <th>Country</th>
              <th>Firm</th>
              <th>Account</th>
              <th>Days to Payout</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_PAYOUTS.map((p, i) => {
              const f = firms.find(x => x.name === p.firm);
              return (
                <tr key={i}>
                  <td>{p.trader}</td>
                  <td>
                    <div className="country-cell">
                      <img src={`https://flagcdn.com/w80/${p.country}.png`} alt={p.country.toUpperCase()} />
                      <span style={{ textTransform: "uppercase", fontSize: 12 }}>{p.country}</span>
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
                    ) : p.firm}
                  </td>
                  <td>{p.account}</td>
                  <td>{p.days}d</td>
                  <td style={{ color: "var(--orange)", fontWeight: 700 }}>${p.amount.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
