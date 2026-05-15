import { Link, useParams } from "wouter";
import { useState, useMemo } from "react";
import { findFirm, Firm, enrichChallenge } from "../data/firms";
import { findFirmZh } from "../data/firms.zh";
import { getBrandZh } from "../data/brandZh";
import { countryZh, medianZh, programZh } from "../data/i18nZh";
import { reviewsForFirm } from "../data/reviews";
import { payoutsForFirm } from "../data/payouts";
import { useFirmOverride } from "../contexts/FirmsOverridesContext";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return <span className="stars-row">{"★".repeat(full)}{"☆".repeat(5 - full)}</span>;
}

function ReviewBars({ f }: { f: Firm }) {
  const total = f.reviewsBreakdown?.reduce((a, b) => a + b.count, 0) || f.totalReviews || 1;
  const items = f.reviewsBreakdown || [
    { stars: 5, count: Math.round((f.totalReviews ?? 0) * 0.7) },
    { stars: 4, count: Math.round((f.totalReviews ?? 0) * 0.18) },
    { stars: 3, count: Math.round((f.totalReviews ?? 0) * 0.06) },
    { stars: 2, count: Math.round((f.totalReviews ?? 0) * 0.03) },
    { stars: 1, count: Math.round((f.totalReviews ?? 0) * 0.03) },
  ];
  return (
    <div className="review-bars">
      {items.map(b => (
        <div key={b.stars} className="bar-row">
          <span className="star">{b.stars}★</span>
          <div className="bar-track"><div className="bar-fill" style={{ width: `${(b.count / total) * 100}%` }} /></div>
          <span style={{ color: "var(--text-dim)" }}>{b.count}</span>
        </div>
      ))}
    </div>
  );
}

export default function FirmPage() {
  const { slug } = useParams();
  const f = findFirm(slug || "");
  const zh = f ? findFirmZh(f.slug) : undefined;
  const override = useFirmOverride(slug || "");
  const [tab, setTab] = useState<"overview" | "challenges" | "reviews" | "offers" | "payouts">("overview");
  const enrichedChallenges = useMemo(
    () => (f?.challenges ?? []).map(c => enrichChallenge(c, f?.promoCode)),
    [f]
  );
  const reviewAgg  = useMemo(() => f ? reviewsForFirm(f.slug) : undefined, [f]);
  const payoutAgg  = useMemo(() => f ? (payoutsForFirm(f.slug) ?? payoutsForFirm(f.name)) : undefined, [f]);

  if (!f) {
    return (
      <main className="simple-page">
        <h1>未找到该公司</h1>
        <p>你查找的自营公司不存在。</p>
        <Link href="/" className="btn-buy" style={{ display: "inline-block", marginTop: 20 }}>返回全部公司</Link>
      </main>
    );
  }

  const summaryZh = zh?.aiSummaryZh && zh.aiSummaryZh.length > 20 ? zh.aiSummaryZh : f.aiSummary;
  const offerDescZh = zh?.offerDescriptionZh || f.offerDescription;
  const leverageZh = zh?.leverageZh && zh.leverageZh.length > 0 ? zh.leverageZh : f.leverage;
  const consistencyZh = zh?.consistencyRulesZh && zh.consistencyRulesZh.length > 0 ? zh.consistencyRulesZh : f.consistencyRules;

  const affiliateUrl = override?.affiliateUrl;
  const promoCode = override?.promoCode ?? f.promoCode;
  const promoPercent = override?.discountPercent ?? override?.promoPercent ?? f.promoPercent;
  const promoLabel = override?.promoLabel ?? f.promoLabel;

  const BuyButton = ({ className }: { className?: string }) => {
    if (affiliateUrl) {
      return (
        <a href={affiliateUrl} target="_blank" rel="noopener sponsored nofollow" className={className ?? "btn-buy"}>
          立即购买
        </a>
      );
    }
    return <button className={className ?? "btn-buy"}>立即购买</button>;
  };

  return (
    <main className="container">
      <div className="detail-top">
        <Link href="/" className="back-btn">←</Link>
        <div className="firm-pill">
          <img src={f.logo} alt={f.name} />
          <span>{f.name}</span>
          <span style={{ color: "var(--text-dim)" }}>▾</span>
        </div>
        <button className="fav-pill">♡ 加入收藏</button>
        <div className="detail-actions">
          <button className="btn-outline">写一条评价</button>
          <BuyButton />
        </div>
      </div>

      <div className="detail-hero">
        <div className="hero-logo">
          {f.isNew && <span className="new-tag-overlay">新</span>}
          <img src={f.logo} alt={f.name} />
        </div>
        <div className="hero-info">
          <h1>{f.name}{getBrandZh(f.slug) && <span className="brand-zh-inline" style={{ fontSize: 16, color: "var(--text-dim)", fontWeight: 400, marginLeft: 10 }}>· {getBrandZh(f.slug)}</span>}</h1>
          <div className="hero-likes">♡ {f.trackingId}</div>
          <div className="hero-meta">
            {f.ceo && <div className="item"><div className="label">创始人</div><div className="val">{f.ceo}</div></div>}
            <div className="item"><div className="label">注册地</div>
              <div className="val"><img src={`https://flagcdn.com/w80/${f.countryCode}.png`} alt="" /> {countryZh(f.countryCode?.toUpperCase() || "", f.country)}</div>
            </div>
            {f.trustPilot && <div className="item"><div className="label">Trustpilot 评分</div><div className="val">{f.trustPilot}</div></div>}
            {f.dateCreated && <div className="item"><div className="label">成立时间</div><div className="val">{f.dateCreated}</div></div>}
            <div className="item"><div className="label">经营年数</div><div className="val">{f.yearsInOperation} 年</div></div>
          </div>
        </div>
        {f.rating && (
          <div className="review-box">
            <div>
              <div className="big">{f.rating}</div>
              <Stars rating={f.rating} />
              <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
                共 <span style={{ color: "var(--orange)" }}>{f.totalReviews}</span> 条评价
              </div>
            </div>
            <ReviewBars f={f} />
          </div>
        )}
      </div>

      {promoPercent > 0 && (
        <div className="offer-banner">
          <div className="left">
            <span className="badge">🔥 限时优惠</span>
            <span className="pct">{promoPercent}% 折扣</span>
          </div>
          <div className="firm-mini">
            <div className="firm-logo-sm" style={{ width: 40, height: 40 }}>
              {f.isNew && <span className="new-tag-overlay">新</span>}
              <img src={f.logo} alt="" />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{f.name}</div>
              {f.rating && <div style={{ fontSize: 11, color: "var(--text-dim)" }}>★ {f.rating}（{f.reviews}）</div>}
            </div>
          </div>
          <div className="desc">{offerDescZh}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {promoLabel && <span className="code-pill" style={{ background: "rgba(168,85,247,0.15)", color: "var(--purple)" }}>{promoLabel}</span>}
            <div className="code-pill">优惠码 <strong>{promoCode} 📋</strong></div>
          </div>
        </div>
      )}

      <div className="detail-tabs">
        <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>概览</button>
        <button className={tab === "challenges" ? "active" : ""} onClick={() => setTab("challenges")}>
          挑战赛 <span className="count-pill">{f.challenges?.length ?? 12}</span>
        </button>
        <button className={tab === "reviews" ? "active" : ""} onClick={() => setTab("reviews")}>
          用户评价 <span className="count-pill">{f.reviews}</span>
        </button>
        <button className={tab === "offers" ? "active" : ""} onClick={() => setTab("offers")}>
          专属优惠 <span className="count-pill">{promoPercent > 0 ? 2 : 0}</span>
        </button>
        <button className={tab === "payouts" ? "active" : ""} onClick={() => setTab("payouts")}>
          出金记录 <span className="count-pill" style={{ background: "rgba(168,85,247,0.15)", color: "var(--purple)" }}>新</span>
        </button>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>{f.name} 期货自营公司详情</h2>
      <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0 24px" }} />

      <div className="detail-grid">
        <aside className="detail-side">
          <a href="#firm-overview" className="active">公司概览</a>
          <a href="#instruments">交易品种</a>
          <a href="#leverage">杠杆与合约</a>
          <a href="#consistency">一致性规则</a>
          <a href="#rules">公司规则</a>
          <a href="#challenges-section">挑战赛列表</a>
        </aside>

        <div>
          {tab === "overview" && (
            <>
              <div className="ai-summary-card">
                <span className="ai-tag">✨ AI 简介</span>
                <h3>{f.name} 公司速览</h3>
                <p>{summaryZh.slice(0, 380)}{summaryZh.length > 380 && "…"}</p>
                <button className="show-more-btn">查看更多 ▾</button>
              </div>

              <section className="detail-section" id="firm-overview">
                <h2>公司概览</h2>
                {f.brokers && (
                  <div className="kv-block">
                    <div className="k">合作经纪：</div>
                    <div className="v">
                      {f.brokers.map((b, i) => (
                        <span key={i} className="kv-chip">{b.icon && <img src={b.icon} alt="" />}{b.name}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="kv-block">
                  <div className="k">交易平台：</div>
                  <div className="v">
                    {f.platforms.map((p, i) => (
                      <span key={i} className="kv-chip">{p.icon && <img src={p.icon} alt="" />}{p.name}</span>
                    ))}
                  </div>
                </div>
                {f.paymentMethods && (
                  <div className="kv-block">
                    <div className="k">支付方式：</div>
                    <div className="v">
                      {f.paymentMethods.map((p, i) => (
                        <span key={i} className="kv-chip">{p.icon && <img src={p.icon} alt="" />}{p.name}</span>
                      ))}
                    </div>
                  </div>
                )}
                {f.payoutMethods && (
                  <div className="kv-block">
                    <div className="k">出金方式：</div>
                    <div className="v">
                      {f.payoutMethods.map((p, i) => (
                        <span key={i} className="kv-chip">{p.icon && <img src={p.icon} alt="" />}{p.name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <section className="detail-section" id="instruments">
                <h2>交易品种</h2>
                <div className="kv-block"><div className="k">品种类型：</div><div className="v"><span className="kv-chip">期货</span></div></div>
                <div className="kv-block"><div className="k">可交易资产：</div><div className="v"><span className="kv-chip">期货</span></div></div>
              </section>

              {leverageZh && leverageZh.length > 0 && (
                <section className="detail-section" id="leverage">
                  <h2>杠杆与合约</h2>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>各档位最大合约手数</div>
                  <ul className="bullet-list">
                    {leverageZh.map((l, i) => <li key={i}>{l}</li>)}
                  </ul>
                </section>
              )}

              {consistencyZh && consistencyZh.length > 0 && (
                <section className="detail-section" id="consistency">
                  <h2>一致性规则</h2>
                  {consistencyZh.map((c, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{c.program}</div>
                      <ul className="bullet-list"><li>{c.rule}</li></ul>
                    </div>
                  ))}
                </section>
              )}

              <section className="detail-section" id="rules">
                <h2>公司规则</h2>
                <p style={{ color: "var(--text-dim)" }}>
                  完整规则请以 {f.name} 官方页面为准。{f.name} 沿用业内通行的自营交易规则，包括一致性要求、禁止行为（高频、对冲、套利等）以及账户长时间未交易的处理方式。
                </p>
              </section>

              {f.challenges && (
                <section className="detail-section" id="challenges-section">
                  <h2>挑战赛列表</h2>
                  {f.challenges.map((c, i) => (
                    <div key={i} className="challenge-row">
                      {affiliateUrl ? (
                        <a href={affiliateUrl} target="_blank" rel="noopener sponsored nofollow" className="name">
                          {programZh(c.name.startsWith(f.name) ? c.name : `${f.name} - ${c.name}`)}
                        </a>
                      ) : (
                        <a href="#" className="name">{programZh(c.name.startsWith(f.name) ? c.name : `${f.name} - ${c.name}`)}</a>
                      )}
                      {c.original && <span className="original">{c.original}</span>}
                      <span className="price">{c.price}</span>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}

          {tab === "challenges" && (
            <section className="detail-section" style={{ borderTop: "none", marginTop: 0, paddingTop: 0 }}>
              <h2>{f.name} 挑战赛</h2>
              {enrichedChallenges.length > 0 ? (
                <div className="challenge-grid">
                  {enrichedChallenges.map((c, i) => (
                    <div key={i} className="challenge-card">
                      <div className="cc-head">
                        <div className="cc-title">
                          {affiliateUrl ? (
                            <a href={affiliateUrl} target="_blank" rel="noopener sponsored nofollow" style={{color:"inherit",textDecoration:"none"}}>
                              {programZh(c.name.startsWith(f.name) ? c.name : `${f.name} - ${c.name}`)}
                            </a>
                          ) : (
                            programZh(c.name.startsWith(f.name) ? c.name : `${f.name} - ${c.name}`)
                          )}
                        </div>
                        <div className="cc-prices">
                          {c.original && <span className="original">{c.original}</span>}
                          <span className="price">{c.price}</span>
                        </div>
                      </div>
                      <div className="cc-grid">
                        <div><label>账户规模</label><span>{c.accountSize ?? "—"}</span></div>
                        <div><label>项目类型</label><span>{c.programType ? programZh(c.programType) : "—"}</span></div>
                        <div><label>盈利目标</label><span>{c.profitTarget ?? "—"}</span></div>
                        <div><label>最大回撤</label><span>{c.drawdown ?? "—"}</span></div>
                        <div><label>重置费用</label><span>{c.resetPrice ?? "—"}</span></div>
                        <div><label>优惠码</label><span>{c.promoCode ?? "—"}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "var(--text-dim)" }}>{f.name} 暂未上架挑战赛。</p>
              )}
            </section>
          )}

          {tab === "reviews" && (
            <section className="detail-section" style={{ borderTop: "none", marginTop: 0, paddingTop: 0 }}>
              <h2>{f.name} 用户评价（{f.reviews}）</h2>
              {reviewAgg ? (
                <>
                  <p style={{ color: "var(--text-dim)" }}>
                    来自 {reviewAgg.reviewCount} 名交易员、覆盖 {reviewAgg.accountsTracked.toLocaleString()} 个跟踪账户的真实分项评分。综合评分 <strong style={{ color: "var(--orange)" }}>{reviewAgg.overall.toFixed(1)}/5</strong>。
                  </p>
                  <div className="review-cats">
                    {[
                      { label: "规则合理度", v: reviewAgg.rules },
                      { label: "客户服务",   v: reviewAgg.customerCare },
                      { label: "易用性",     v: reviewAgg.friendliness },
                      { label: "出金体验",   v: reviewAgg.payoutProcess },
                    ].map(c => (
                      <div key={c.label} className="cat-row">
                        <span className="cat-label">{c.label}</span>
                        <div className="bar-track"><div className="bar-fill" style={{ width: `${(c.v / 5) * 100}%` }} /></div>
                        <span className="cat-val">{c.v.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                  {f.reviewsBreakdown && f.reviewsBreakdown.length === 5 && (
                    <>
                      <h3 style={{ marginTop: 24, fontSize: 16 }}>星级分布</h3>
                      <ReviewBars f={f} />
                    </>
                  )}
                </>
              ) : (
                <p style={{ color: "var(--text-dim)" }}>
                  {f.reviews > 0
                    ? `${f.name} 共有 ${f.reviews} 条已验证评价，平均评分 ${f.rating}/5。`
                    : `${f.name} 评价不足 10 条，欢迎成为首批留下评价的交易员。`}
                </p>
              )}
            </section>
          )}

          {tab === "offers" && (
            <section className="detail-section" style={{ borderTop: "none", marginTop: 0, paddingTop: 0 }}>
              <h2>{f.name} 专属优惠</h2>
              {promoPercent > 0 ? (
                <div className="offer-row active">
                  <div className="of-pct">{promoPercent}% 折扣</div>
                  <div className="of-body">
                    <div className="of-desc">{offerDescZh}</div>
                    <div className="of-meta">活动进行中 · 结账时输入优惠码</div>
                  </div>
                  <div className="of-code">优惠码 <strong>{promoCode}</strong></div>
                  <span className="of-status active">进行中</span>
                </div>
              ) : (
                <p style={{ color: "var(--text-dim)" }}>{f.name} 当前暂无优惠活动。</p>
              )}
            </section>
          )}

          {tab === "payouts" && (
            <section className="detail-section" style={{ borderTop: "none", marginTop: 0, paddingTop: 0 }}>
              <h2>{f.name} 出金记录</h2>
              {payoutAgg ? (
                <div className="payout-stats">
                  <div className="ps-card"><label>累计出金额度</label><span style={{ color: "var(--orange)" }}>${payoutAgg.total.toLocaleString()}</span></div>
                  <div className="ps-card"><label>出金笔数</label><span>{payoutAgg.count.toLocaleString()}</span></div>
                  <div className="ps-card"><label>最大单笔出金</label><span>${payoutAgg.largest.toLocaleString()}</span></div>
                  <div className="ps-card"><label>平均出金额</label><span>${payoutAgg.avg.toLocaleString()}</span></div>
                  <div className="ps-card ps-wide"><label>到账时间中位数</label><span>{medianZh(payoutAgg.median)}</span></div>
                </div>
              ) : (
                <p style={{ color: "var(--text-dim)" }}>
                  暂未追踪到 {f.name} 在源站的出金记录。
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
