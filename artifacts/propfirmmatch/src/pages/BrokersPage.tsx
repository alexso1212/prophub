import { useMemo } from "react";
import { Link } from "wouter";
import { firms } from "../data/firms";

export default function BrokersPage() {
  const brokers = useMemo(() => {
    const map = new Map<string, { name: string; icon?: string; firms: { slug: string; name: string; logo: string }[] }>();
    for (const f of firms) {
      for (const b of f.brokers || []) {
        const key = b.name;
        if (!map.has(key)) map.set(key, { name: b.name, icon: b.icon, firms: [] });
        map.get(key)!.firms.push({ slug: f.slug, name: f.name, logo: f.logo });
      }
    }
    return Array.from(map.values()).sort((a,b) => b.firms.length - a.firms.length);
  }, []);

  return (
    <main className="container">
      <div className="section-title">🏦 Brokers</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        The brokers powering each prop firm. See which clearing brokers, data providers and execution platforms each firm uses.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {brokers.map(b => (
          <div key={b.name} className="rule-card">
            <div className="rule-card-head">
              <div className="firm-logo-sm" style={{ width: 48, height: 48 }}>
                {b.icon ? <img src={b.icon} alt={b.name} /> : <span style={{ fontSize: 18, fontWeight: 700 }}>{b.name.slice(0,2)}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{b.name}</div>
                <div style={{ color: "var(--text-dim)", fontSize: 12 }}>{b.firms.length} firm{b.firms.length>1?"s":""} use this broker</div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {b.firms.map(f => (
                <Link key={f.slug} href={`/futures/prop-firms/${f.slug}`} className="kv-chip">
                  <img src={f.logo} alt={f.name} style={{ width: 16, height: 16, objectFit: "contain" }} />
                  {f.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
        {brokers.length === 0 && (
          <div style={{ color: "var(--text-dim)", padding: 20, textAlign: "center" }}>No broker data available yet.</div>
        )}
      </div>
    </main>
  );
}
