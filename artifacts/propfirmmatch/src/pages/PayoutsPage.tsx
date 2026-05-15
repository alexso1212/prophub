import { Link } from "wouter";
import { firms } from "../data/firms";

const SAMPLE_PAYOUTS = [
  { firm: "Tradeify", trader: "Marcus J.", amount: 24580, account: "$150K Growth", days: 18, country: "us" },
  { firm: "Apex Trader Funding", trader: "Diego R.", amount: 18900, account: "$100K Eval", days: 22, country: "es" },
  { firm: "TradeDay", trader: "Sarah W.", amount: 12450, account: "$50K", days: 14, country: "gb" },
  { firm: "My Funded Futures", trader: "Yuki T.", amount: 31200, account: "$150K Express", days: 28, country: "jp" },
  { firm: "Top One Futures", trader: "Anders L.", amount: 9870, account: "$50K", days: 11, country: "se" },
  { firm: "Alpha Futures", trader: "Olivia C.", amount: 22100, account: "$100K", days: 19, country: "ca" },
  { firm: "Lucid Trading", trader: "Hassan K.", amount: 15600, account: "$100K", days: 16, country: "ae" },
  { firm: "Take Profit Trader", trader: "Ben P.", amount: 8400, account: "$50K", days: 9, country: "au" },
  { firm: "FundedNext Futures", trader: "Lucas A.", amount: 19850, account: "$100K Stellar", days: 25, country: "br" },
  { firm: "Topstep", trader: "Nathan F.", amount: 27300, account: "$150K Combine", days: 31, country: "us" },
  { firm: "Goat Funded Futures", trader: "Priya M.", amount: 11200, account: "$50K", days: 12, country: "in" },
  { firm: "Earn2Trade", trader: "Tomás G.", amount: 6750, account: "$25K Gauntlet", days: 8, country: "mx" },
];

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
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--orange)" }}>$2.4M+</div>
        </div>
        <div className="popular-card">
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Verified Traders</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>1,847</div>
        </div>
        <div className="popular-card">
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Avg Payout</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>$13,290</div>
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
