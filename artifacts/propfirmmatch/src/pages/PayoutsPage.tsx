import { Link } from "wouter";
import { PAYOUTS, totalTrackedPayouts, totalPayoutCount } from "../data/payouts";
import { getBrandZh } from "../data/brandZh";
import { medianZh } from "../data/i18nZh";
import { useCategory, useCategoryFirms, useCategoryMeta } from "../contexts/CategoryContext";
import FirmLogo from "../components/FirmLogo";
import { CoinsIcon } from "../components/icons";

const avgAcrossFirms = Math.round(totalTrackedPayouts / totalPayoutCount);

export default function PayoutsPage() {
  const category = useCategory();
  const meta = useCategoryMeta();
  const firms = useCategoryFirms();
  const prefix = `/${category}`;

  // 期货板块用真实出金数据；外汇/加密板块没有真实出金，按演示形式输出空表
  const isFutures = category === "futures";
  const rows = isFutures ? PAYOUTS : [];

  return (
    <main className="container">
      <div className="section-title"><CoinsIcon size={18} className="icon" /> 自营公司出金记录</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        {isFutures
          ? <>覆盖 {PAYOUTS.length} 家自营公司的出金数据汇总 —— 累计出金额度、出金笔数、最大单笔金额、平均出金额以及到账时间中位数，全部来自源站公司维度的出金记录。</>
          : <>{meta.label}板块出金数据正在接入中。下方为页面结构演示，真实出金记录将在数据接入后展示。</>}
      </p>

      <div className="popular-row" style={{ marginBottom: 30 }}>
        <div className="popular-card" style={{ background: "linear-gradient(135deg, rgba(255,106,61,0.08), rgba(168,85,247,0.04))" }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>累计出金额度</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--orange)" }}>${isFutures ? totalTrackedPayouts.toLocaleString() : "—"}</div>
        </div>
        <div className="popular-card">
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>累计出金笔数</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{isFutures ? totalPayoutCount.toLocaleString() : "—"}</div>
        </div>
        <div className="popular-card">
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>平均出金（全部公司）</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>${isFutures ? avgAcrossFirms.toLocaleString() : "—"}</div>
        </div>
      </div>

      <div className="table-scroll-hint" aria-hidden="true">← 左右滑动查看更多 →</div>
      <div className="table-wrap">
        <table className="firms-table">
          <thead>
            <tr>
              <th className="firm-col">排名</th>
              <th className="firm-col firm-col-2">公司</th>
              <th>累计出金</th>
              <th>出金笔数</th>
              <th>最大单笔</th>
              <th>平均金额</th>
              <th>到账时间中位</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => {
              const f = firms.find(x => x.slug === p.slug || x.name === p.name);
              return (
                <tr key={p.slug}>
                  <td className="firm-col"><span className="rank-num">{i + 1}</span></td>
                  <td className="firm-col firm-col-2">
                    {f ? (
                      <div className="cell-firm">
                        <Link href={`${prefix}/prop-firms/${f.slug}`} className="firm-logo-sm">
                          <FirmLogo src={f.logo} alt={f.name} />
                        </Link>
                        <div>
                          <Link href={`${prefix}/prop-firms/${f.slug}`} className="firm-name-link">{f.name}</Link>
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
            {rows.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--text-dim)", padding: 32 }}>
                {meta.label}板块出金数据演示中，公司维度数据接入中。
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
