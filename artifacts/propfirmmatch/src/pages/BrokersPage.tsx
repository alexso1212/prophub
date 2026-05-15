import { useMemo } from "react";
import { Link } from "wouter";
import { getBrandZh } from "../data/brandZh";
import { useCategory, useCategoryFirms, useCategoryMeta } from "../contexts/CategoryContext";

export default function BrokersPage() {
  const category = useCategory();
  const meta = useCategoryMeta();
  const firms = useCategoryFirms();
  const prefix = `/${category}`;

  // 外汇没有清算经纪概念，按交易平台聚合更直观
  const isForex = category === "forex";
  const titleEmoji = isForex ? "🛰️" : "🏦";
  const titleText = isForex ? "交易平台" : "合作经纪";
  const subText = isForex
    ? "各家外汇 prop firm 接入的主流交易平台一览（MT4/MT5/cTrader/DXTrade 等）。"
    : "各家自营公司背后的清算经纪、行情数据与执行平台一览。";

  const brokers = useMemo(() => {
    const map = new Map<string, { name: string; icon?: string; firms: { slug: string; name: string; logo: string }[] }>();
    for (const f of firms) {
      const list = isForex ? (f.platforms || []) : (f.brokers || []);
      for (const b of list) {
        const key = b.name;
        if (!map.has(key)) map.set(key, { name: b.name, icon: b.icon, firms: [] });
        map.get(key)!.firms.push({ slug: f.slug, name: f.name, logo: f.logo });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.firms.length - a.firms.length);
  }, [firms, isForex]);

  return (
    <main className="container">
      <div className="section-title">{titleEmoji} {titleText}</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>{subText}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {brokers.map(b => (
          <div key={b.name} className="rule-card">
            <div className="rule-card-head">
              <div className="firm-logo-sm" style={{ width: 48, height: 48 }}>
                {b.icon ? <img src={b.icon} alt={b.name} /> : <span style={{ fontSize: 18, fontWeight: 700 }}>{b.name.slice(0, 2)}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{b.name}</div>
                <div style={{ color: "var(--text-dim)", fontSize: 12 }}>{b.firms.length} 家公司在使用</div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {b.firms.map(f => (
                <Link key={f.slug} href={`${prefix}/prop-firms/${f.slug}`} className="kv-chip">
                  <img src={f.logo} alt={f.name} style={{ width: 16, height: 16, objectFit: "contain" }} />
                  <span>
                    {f.name}
                    {getBrandZh(f.slug) && <span className="brand-zh-inline" style={{ marginLeft: 4 }}>· {getBrandZh(f.slug)}</span>}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
        {brokers.length === 0 && (
          <div style={{ color: "var(--text-dim)", padding: 20, textAlign: "center" }}>{meta.label}板块暂无{titleText}数据。</div>
        )}
      </div>
    </main>
  );
}
