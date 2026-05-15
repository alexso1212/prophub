import { Link } from "wouter";
import { firms } from "../data/firms";

export default function RulesPage() {
  return (
    <main className="container">
      <div className="section-title">📜 Prop Firm Rules</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        Compare consistency rules, leverage limits and program restrictions across every firm. Click into a firm for the full rulebook.
      </p>

      <div style={{ display: "grid", gap: 18 }}>
        {firms.map(f => (
          <div key={f.slug} className="rule-card">
            <div className="rule-card-head">
              <Link href={`/futures/prop-firms/${f.slug}`} className="firm-logo-sm" style={{ width: 48, height: 48 }}>
                <img src={f.logo} alt={f.name} />
              </Link>
              <div style={{ flex: 1 }}>
                <Link href={`/futures/prop-firms/${f.slug}`} className="firm-name-link" style={{ fontSize: 16 }}>{f.name}</Link>
                <div style={{ color: "var(--text-dim)", fontSize: 12 }}>
                  {f.country} · {f.dateCreated || `${f.yearsInOperation} yrs`}
                  {f.trustPilot && ` · TrustPilot ${f.trustPilot}`}
                </div>
              </div>
              <Link href={`/futures/prop-firms/${f.slug}`} className="btn-firm">Full Rules</Link>
            </div>

            {f.consistencyRules && f.consistencyRules.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 }}>Consistency Rules</div>
                <ul className="bullet-list" style={{ marginTop: 4 }}>
                  {f.consistencyRules.slice(0, 3).map((c, i) => (
                    <li key={i}><strong style={{ color: "var(--text)" }}>{c.program}:</strong> {c.rule.slice(0, 220)}{c.rule.length > 220 && "…"}</li>
                  ))}
                </ul>
              </div>
            )}

            {f.leverage && f.leverage.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 }}>Leverage / Contract Size</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {f.leverage.slice(0, 4).map((l, i) => (
                    <span key={i} className="kv-chip" style={{ maxWidth: 320 }}>{l.slice(0, 80)}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
