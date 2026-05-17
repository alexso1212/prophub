import { Link } from "wouter";
import { PAYOUTS, totalTrackedPayouts, totalPayoutCount } from "../data/payouts";
import { getFirmPayoutProofs, hasProof, aggregateForFirm, formatDateZh, waitingTimeZh, SNAPSHOT_DATE } from "../data/payoutProofs";
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
        <div className="popular-card" style={{ background: "linear-gradient(135deg, rgba(192,132,252,0.08), rgba(168,85,247,0.04))" }}>
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

      <div className="section-title" style={{ marginTop: 8, marginBottom: 12, fontSize: 16 }}>
        <CoinsIcon size={16} className="icon" /> 公司维度·公开聚合
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

      <div className="section-title" style={{ marginTop: 36, marginBottom: 12, fontSize: 16 }}>
        <CoinsIcon size={16} className="icon" /> 近 30 天出金证明 · 逐笔记录
      </div>
      <p style={{ color: "var(--text-dim)", marginBottom: 12, maxWidth: 760, fontSize: 13 }}>
        每家公司展示：（1）源追踪页 1 张真实截图（点击跳转原始页面核验）；
        （2）6 条逐笔出金记录：到账日期 / 金额 / 账户规模 / 收益率 / 等候时间，每条均带「追踪页 ↗」链接；
        （3）该公司官方公布的出金方式列表（公司级，适用于全部记录，附官方核验链接）。
        数据快照抓取于 {SNAPSHOT_DATE}；未来更新需重新抓取源追踪页，而非在本地编造数字。
        没有公开追踪来源的公司一律显示「暂无近 30 天记录」。
      </p>
      {(() => {
        const snap = Date.parse(SNAPSHOT_DATE + "T00:00:00Z");
        const ageDays = Math.floor((Date.now() - snap) / (24 * 60 * 60 * 1000));
        if (ageDays > 30) {
          return (
            <div style={{
              padding: "8px 12px",
              marginBottom: 16,
              borderRadius: 6,
              background: "rgba(255, 196, 0, 0.08)",
              border: "1px solid rgba(255, 196, 0, 0.35)",
              color: "#ffc400",
              fontSize: 12,
              maxWidth: 760,
            }}>
              ⚠ 数据快照已过期 {ageDays} 天（&gt; 30 天），请重新抓取源追踪页以保证记录新鲜度。
            </div>
          );
        }
        return null;
      })()}

      <div style={{ display: "grid", gap: 16 }}>
        {firms.map(f => {
          const has = hasProof(f.slug);
          const proofs = has ? getFirmPayoutProofs(f.slug) : undefined;
          const agg = aggregateForFirm(f.slug);
          return (
            <div key={f.slug} className="popular-card" style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <Link href={`${prefix}/prop-firms/${f.slug}`} className="firm-logo-sm">
                  <FirmLogo src={f.logo} alt={f.name} />
                </Link>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`${prefix}/prop-firms/${f.slug}`} className="firm-name-link" style={{ fontWeight: 600 }}>
                    {f.name}
                  </Link>
                  {getBrandZh(f.slug) && <div className="brand-zh-sub">{getBrandZh(f.slug)}</div>}
                </div>
                {agg && (
                  <div style={{ textAlign: "right", fontSize: 12, color: "var(--text-dim)" }}>
                    <div>近 30 天累计 <span style={{ color: "var(--orange)", fontWeight: 700 }}>${agg.total.toLocaleString()}</span></div>
                    <div>{agg.count.toLocaleString()} 笔 · 最大 ${agg.largest.toLocaleString()} · 中位 {medianZh(agg.median)}</div>
                  </div>
                )}
              </div>

              {proofs ? (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 320px) 1fr", gap: 16, marginBottom: 12, alignItems: "start" }} className="proof-grid">
                    <a
                      href={proofs.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`点击查看源追踪页：${proofs.sourceUrl}`}
                      style={{ display: "block", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", background: "#000" }}
                    >
                      <img
                        src={proofs.screenshotPath}
                        alt={`${f.name} Prophub 出金追踪页快照（${SNAPSHOT_DATE}）`}
                        loading="lazy"
                        style={{ display: "block", width: "100%", height: "auto" }}
                      />
                      <div style={{ padding: "6px 10px", fontSize: 11, color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
                        源追踪页快照 · {SNAPSHOT_DATE} · 点击核验 ↗
                      </div>
                    </a>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
                        官方公布的出金方式（适用于全部记录）
                        <a
                          href={proofs.methodsSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ marginLeft: 6, color: "var(--orange)", textDecoration: "none" }}
                          title={proofs.methodsSourceUrl}
                        >核验源 ↗</a>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {proofs.payoutMethods.map(m => (
                          <span key={m} style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: "rgba(192,132,252,0.08)",
                            border: "1px solid rgba(192,132,252,0.25)",
                            color: "var(--orange)",
                            fontSize: 12,
                            whiteSpace: "nowrap",
                          }}>{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="table-wrap">
                    <table className="firms-table" style={{ fontSize: 13 }}>
                      <thead>
                        <tr>
                          <th>到账日期</th>
                          <th>金额</th>
                          <th>账户规模</th>
                          <th>本期收益率</th>
                          <th>到账等待</th>
                          <th>来源</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proofs.records.map((r, idx) => (
                          <tr key={idx}>
                            <td style={{ fontFamily: "monospace", whiteSpace: "nowrap" }}>{formatDateZh(r.date)}</td>
                            <td style={{ color: "var(--orange)", fontWeight: 700 }}>${r.amount.toLocaleString()}</td>
                            <td style={{ color: "var(--text-dim)" }}>${r.accountSize.toLocaleString()}</td>
                            <td>{r.returnPct.toFixed(2)}%</td>
                            <td style={{ color: "var(--text-dim)" }}>{waitingTimeZh(r.waitingTime)}</td>
                            <td>
                              <a
                                href={proofs.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: 12, color: "var(--text-dim)", textDecoration: "none", whiteSpace: "nowrap" }}
                                title={proofs.sourceUrl}
                              >
                                追踪页 ↗
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-muted)" }}>
                    全部记录抓自源站公开追踪页：
                    <a
                      href={proofs.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--orange)", marginLeft: 4, wordBreak: "break-all" }}
                    >{proofs.sourceUrl} ↗</a>
                  </div>
                </>
              ) : (
                <div style={{
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px dashed var(--border)",
                  borderRadius: 8,
                  color: "var(--text-dim)",
                  fontSize: 13,
                }}>
                  暂无近 30 天出金记录（未接入真实公开数据源，不展示伪造数据）
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
