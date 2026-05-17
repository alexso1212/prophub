import { useState, useMemo } from "react";
import Slider from "../Slider";
import { TrackedLink } from "../Cta";
import { useCategory, useCategoryFirms } from "../../../contexts/CategoryContext";
import { getFirmStartingPrice } from "../../../data/firms";

export default function FirmCompare() {
  const cat = useCategory();
  const firms = useCategoryFirms();
  const [selected, setSelected] = useState<string[]>(() =>
    firms.slice(0, 3).map((f) => f.slug),
  );
  const [capital, setCapital] = useState(500);
  const [winRateAssumption, setWinRateAssumption] = useState(55);

  const rows = useMemo(() => {
    return selected
      .map((slug) => firms.find((f) => f.slug === slug))
      .filter((f): f is NonNullable<typeof f> => !!f)
      .map((f) => {
        const price = getFirmStartingPrice(f) ?? 500;
        const attempts = price > 0 ? Math.floor(capital / price) : 0;
        // 粗略：胜率每高 1% → 通过率多 6%（封顶 95%）。
        const passRate = Math.min(95, Math.max(5, (winRateAssumption - 45) * 6));
        // 简化：每次成功预期回收 4 倍单价；本金买不起任何一次即回收为 0。
        const expected = attempts * (passRate / 100) * price * 4;
        return {
          slug: f.slug,
          name: f.name,
          price,
          attempts,
          passRate,
          expected,
        };
      });
  }, [selected, firms, capital, winRateAssumption]);

  const toggle = (slug: string) => {
    setSelected((s) =>
      s.includes(slug)
        ? s.filter((x) => x !== slug)
        : s.length >= 4 ? s : [...s, slug],
    );
  };

  return (
    <div className="kg-sim">
      <h2 className="kg-sim-title">⚖️ 多家公司对比器</h2>
      <p className="kg-sim-sub">同样本金、同样实力，看看不同公司的预期通过率与回收差距。最多对比 4 家。</p>

      <div className="kg-sim-controls">
        <Slider label="可投入本金" min={150} max={3000} step={50} value={capital} onChange={setCapital} format={(v) => `$${v}`} />
        <Slider label="预估胜率" min={45} max={75} value={winRateAssumption} onChange={setWinRateAssumption} format={(v) => `${v}%`} />
      </div>

      <div className="kg-firm-picker">
        {firms.slice(0, 12).map((f) => (
          <button
            key={f.slug}
            className={`kg-chip ${selected.includes(f.slug) ? "active" : ""}`}
            onClick={() => toggle(f.slug)}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="kg-sim-result table-wrap" style={{ marginTop: 16 }}>
        <table className="firms-table" style={{ fontSize: 13 }}>
          <thead>
            <tr>
              <th>公司</th>
              <th>起步单价</th>
              <th>本金可买几次</th>
              <th>预估通过率</th>
              <th>预期回收</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug}>
                <td><strong>{r.name}</strong></td>
                <td>${r.price.toFixed(0)}</td>
                <td>{r.attempts} 次</td>
                <td>{r.passRate.toFixed(0)}%</td>
                <td style={{ color: "var(--orange)" }}>${r.expected.toFixed(0)}</td>
                <td>
                  <TrackedLink
                    href={`/${cat}/prop-firms/${r.slug}`}
                    track="firm-compare"
                    className="kg-cta-btn"
                  >
                    去看 →
                  </TrackedLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
