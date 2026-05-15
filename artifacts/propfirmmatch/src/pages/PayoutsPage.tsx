import { Link } from "wouter";
import { firms } from "../data/firms";
import { PAYOUTS, totalTrackedPayouts, totalPayoutCount } from "../data/payouts";
import { getBrandZh } from "../data/brandZh";
import { medianZh } from "../data/i18nZh";

const avgAcrossFirms = Math.round(totalTrackedPayouts / totalPayoutCount);

export default function PayoutsPage() {
  return (
    <main className="container">
      <div className="section-title">💰 自营公司出金记录</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        覆盖 {PAYOUTS.length} 家自营公司的出金数据汇总 —— 累计出金额度、出金笔数、最大单笔金额、平均出金额以及到账时间中位数，全部来自源站公司维度的出金记录。
      </p>

      <div className="popular-row" style={{ marginBottom: 30 }}>
        <div className="popular-card" style={{ background: "linear-gradient(135deg, rgba(255,106,61,0.08), rgba(168,85,247,0.04))" }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>累计出金额度</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--orange)" }}>${totalTrackedPayouts.toLocaleString()}</div>
        </div>
        <div className="popular-card">
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>累计出金笔数</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{totalPayoutCount.toLocaleString()}</div>
        </div>
        <div className="popular-card">
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>平均出金（全部公司）</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>${avgAcrossFirms.toLocaleString()}</div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="firms-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>公司</th>
              <th>累计出金</th>
              <th>出金笔数</th>
              <th>最大单笔</th>
              <th>平均金额</th>
              <th>到账时间中位</th>
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
                        <div>
                          <Link href={`/futures/prop-firms/${f.slug}`} className="firm-name-link">{f.name}</Link>
                          {getBrandZh(f.slug) && <div className="brand-zh-sub">{getBrandZh(f.slug)}</div>}
                        </div>
                      </div>
                    ) : <span>{p.name}</span>}
                  </td>
                  <td style={{ color: "var(--orange)", fontWeight: 700 }}>${p.total.toLocaleString()}</td>
                  <td>{p.count.toLocaleString()}</td>
                  <td>${p.largest.toLocaleString()}</td>
                  <td>${p.avg.toLocaleString()}</td>
                  <td style={{ color: "var(--text-dim)", fontSize: 12 }}>{medianZh(p.median)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
