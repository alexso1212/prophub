import { Link } from "wouter";
import { firms } from "../data/firms";
import { findFirmZh } from "../data/firms.zh";
import { getBrandZh } from "../data/brandZh";

export default function RulesPage() {
  return (
    <main className="container">
      <div className="section-title">📜 规则手册</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        一站对比各家自营公司的一致性规则、杠杆上限和项目限制。点击任意公司查看完整规则手册。
      </p>

      <div style={{ display: "grid", gap: 18 }}>
        {firms.map(f => {
          const zh = findFirmZh(f.slug);
          const consistency = zh?.consistencyRulesZh && zh.consistencyRulesZh.length > 0 ? zh.consistencyRulesZh : f.consistencyRules;
          const leverage = zh?.leverageZh && zh.leverageZh.length > 0 ? zh.leverageZh : f.leverage;
          return (
            <div key={f.slug} className="rule-card">
              <div className="rule-card-head">
                <Link href={`/futures/prop-firms/${f.slug}`} className="firm-logo-sm" style={{ width: 48, height: 48 }}>
                  <img src={f.logo} alt={f.name} />
                </Link>
                <div style={{ flex: 1 }}>
                  <Link href={`/futures/prop-firms/${f.slug}`} className="firm-name-link" style={{ fontSize: 16 }}>{f.name}</Link>{getBrandZh(f.slug) && <span className="brand-zh-inline">· {getBrandZh(f.slug)}</span>}
                  <div style={{ color: "var(--text-dim)", fontSize: 12 }}>
                    {f.country} · {f.dateCreated || `经营 ${f.yearsInOperation} 年`}
                    {f.trustPilot && ` · Trustpilot ${f.trustPilot}`}
                  </div>
                </div>
                <Link href={`/futures/prop-firms/${f.slug}`} className="btn-firm">完整规则</Link>
              </div>

              {consistency && consistency.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: ".04em", marginBottom: 6 }}>一致性规则</div>
                  <ul className="bullet-list" style={{ marginTop: 4 }}>
                    {consistency.slice(0, 3).map((c, i) => (
                      <li key={i}><strong style={{ color: "var(--text)" }}>{c.program}：</strong>{c.rule.slice(0, 220)}{c.rule.length > 220 && "…"}</li>
                    ))}
                  </ul>
                </div>
              )}

              {leverage && leverage.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: ".04em", marginBottom: 6 }}>杠杆与合约</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {leverage.slice(0, 4).map((l, i) => (
                      <span key={i} className="kv-chip" style={{ maxWidth: 320 }}>{l.slice(0, 80)}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
