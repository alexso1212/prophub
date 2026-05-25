import { useMemo, useState } from "react";
import { Link } from "wouter";
import GuideMapOverlay from "./GuideMapOverlay";
import {
  pfPlatforms,
  DRAWDOWN_LABEL,
  type PfPlatform,
} from "../data/pfPlatforms";
import "../styles/myPlatform.css";

/**
 * 「查我的平台」——拦截已经在别家做的人：查这家好不好、怎么过关，
 * 再露出我们的优惠码 + 福利（实盘直播 / 参赛资格）。
 * 体检与过关攻略都由平台规则字段自动组装。不承诺收益/包过。
 */

const CN_LABEL: Record<string, string> = {
  supported: "支持中国用户",
  restricted: "中国用户受限 / 需谨慎",
  unknown: "中国用户状态未知",
};

function assess(p: PfPlatform) {
  const tts = p.accountTypes;
  const hasTdd = tts.some((a) => a.drawdownType === "tdd" || a.drawdownType === "trailing");
  const hasConsistency = tts.some((a) => a.consistencyRule);
  const maxMinDays = Math.max(0, ...tts.map((a) => a.minTradingDays || 0));
  const minFee = Math.min(...tts.map((a) => a.fee || 9999));
  const maxSplit = Math.max(0, ...tts.map((a) => a.payoutSplit || 0));
  const minPayout = Math.min(...tts.map((a) => a.payoutMinimum || 99999));

  let dScore = 0;
  if (hasTdd) dScore++;
  if (hasConsistency) dScore++;
  if (maxMinDays >= 7) dScore++;
  if (p.riskLevel === "high") dScore++;
  const difficulty = dScore >= 2 ? "高" : dScore === 1 ? "中" : "低";

  let nf = 0;
  if (p.cnUserStatus === "supported") nf++;
  if (p.riskLevel === "low") nf++;
  if (minFee <= 150) nf++;
  if (!hasConsistency) nf++;
  const newbie = nf >= 3 ? "高" : nf >= 2 ? "中" : "低";

  let payout = maxSplit >= 90 && minPayout <= 500 ? "好" : maxSplit >= 80 ? "中上" : "中";
  if (/快速出金|稳定的出金|出金记录|出金著称/.test(p.summary)) payout = "好";

  const pros: string[] = [];
  const cons: string[] = [];
  if (!hasConsistency) pros.push("规则灵活：无一致性规则");
  if (tts.some((a) => a.drawdownType === "static")) pros.push("回撤宽松：有静态回撤档");
  if (maxSplit >= 90) pros.push(`高分成：最高 ${maxSplit}%`);
  if (p.paymentMethods.some((m) => /支付宝|微信/.test(m))) pros.push("付款方便：支持支付宝 / 微信");
  if (p.cnUserStatus === "supported") pros.push("支持中国用户");
  if (hasTdd) cons.push("回撤较严：含实时 / 追踪回撤");
  if (hasConsistency) cons.push("有一致性规则：不能靠一把大单");
  if (p.cnUserStatus === "restricted") cons.push("中国用户可能受限");
  if (maxMinDays >= 7) cons.push(`最少要交易 ${maxMinDays} 天`);

  return { difficulty, newbie, payout, pros, cons };
}

interface PassLine { text: string; slug?: string }

function passGuide(p: PfPlatform): PassLine[] {
  const a = p.accountTypes[0];
  const lines: PassLine[] = [];
  if (a) {
    const dd: Record<string, string> = {
      eod: "按收盘价算回撤：日内可浮亏，收盘前拉回就行",
      tdd: "实时回撤：别让浮亏瞬间超线，全程盯紧",
      static: "静态回撤：红线固定，赚再多也不动",
      trailing: "追踪回撤：盈利后红线上移，别大幅回吐",
    };
    lines.push({ text: `回撤类型是「${DRAWDOWN_LABEL[a.drawdownType]}」——${dd[a.drawdownType]}`, slug: "drawdown-rules" });
    lines.push(
      a.consistencyRule
        ? { text: "有一致性规则：别靠一把大单，分批进出、稳定发挥", slug: "consistency-rule" }
        : { text: "无一致性规则：策略更灵活，但风控别松", slug: "consistency-rule" },
    );
    lines.push({ text: "记得收盘前平仓，别留隔夜仓", slug: "intraday-liquidation" });
    if (a.minTradingDays) lines.push({ text: `至少要交易 ${a.minTradingDays} 个交易日才能出金（以 ${a.name} 账户为例）` });
    lines.push({ text: `目标 $${a.profitTarget.toLocaleString()}、最大回撤 $${a.maxDrawdown.toLocaleString()}——每笔单先挂硬止损` });
  }
  return lines;
}

export default function MyPlatform({ prefix }: { prefix: string }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [showJoin, setShowJoin] = useState(false);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    return k ? pfPlatforms.filter((p) => p.name.toLowerCase().includes(k) || p.slug.includes(k)) : pfPlatforms;
  }, [q]);

  const p = sel ? pfPlatforms.find((x) => x.slug === sel) ?? null : null;
  const a = p ? assess(p) : null;
  const lines = p ? passGuide(p) : [];

  const gc = (v: string) => (v === "低" ? "lo" : v === "中" ? "mid" : v === "好" || v === "中上" ? "good" : "hi");

  const copyCode = async (code: string) => {
    try { await navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* ignore */ }
  };

  return (
    <section className="mp" aria-label="查我的平台">
      <div className="mp-head">
        <h2 className="mp-title">查我的平台</h2>
        <p className="mp-sub">正在别家做？查查它好不好、你这家怎么过关——还能领我们的专属福利。</p>
        <input
          className="mp-search"
          placeholder="搜索你正在用的平台，例如 Apex、Topstep…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="mp-chips">
          {filtered.map((x) => (
            <button
              key={x.slug}
              type="button"
              className={`mp-chip ${sel === x.slug ? "is-active" : ""}`}
              onClick={() => { setSel(x.slug); setShowJoin(false); }}
            >
              {x.name}
            </button>
          ))}
          {filtered.length === 0 && <span className="mp-empty">没找到这家？它可能还没收录，先看 <Link href={`${prefix}/all-prop-firms`}>全部公司</Link>。</span>}
        </div>
      </div>

      {p && a && (
        <div className="mp-detail">
          {/* 体检卡 */}
          <div className="mp-card">
            <div className="mp-card-top">
              <div className="mp-name">{p.name}{p.rating != null && <span className="mp-rating">★ {p.rating}</span>}</div>
              <span className="mp-cn">{CN_LABEL[p.cnUserStatus]}</span>
            </div>
            <p className="mp-summary">{p.summary}</p>
            <div className="mp-gauges">
              <div className="mp-gauge"><span>新手友好度</span><strong className={`mp-g ${gc(a.newbie)}`}>{a.newbie}</strong></div>
              <div className="mp-gauge"><span>考核难度</span><strong className={`mp-g ${gc(a.difficulty)}`}>{a.difficulty}</strong></div>
              <div className="mp-gauge"><span>出金口碑</span><strong className={`mp-g ${gc(a.payout)}`}>{a.payout}</strong></div>
            </div>
            <div className="mp-proscons">
              <ul className="mp-pros">{a.pros.map((s, i) => <li key={i}>✓ {s}</li>)}</ul>
              <ul className="mp-cons">{a.cons.map((s, i) => <li key={i}>· {s}</li>)}</ul>
            </div>
            <div className="mp-verify">最后核验 {p.lastVerifiedAt || "—"}·规则/费用/地区限制以上游官网最新说明为准</div>
          </div>

          {/* 针对该平台的过关攻略 */}
          <div className="mp-card">
            <div className="mp-block-title">在「{p.name}」怎么过关</div>
            <ul className="mp-pass">
              {lines.map((l, i) => (
                <li key={i} className={l.slug ? "is-link" : ""}>
                  {l.slug ? (
                    <button type="button" onClick={() => setOpenSlug(l.slug!)}>{l.text} <span className="mp-pass-go">看图解 →</span></button>
                  ) : (
                    <span>{l.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* 我们的优惠码 + 福利 */}
          <div className="mp-card mp-offer">
            {p.couponCode ? (
              <>
                <div className="mp-block-title">用我们的码，不只是省钱</div>
                <div className="mp-perks">
                  <div className="mp-perk">🎥 实盘直播：跟着主播解读盘面</div>
                  <div className="mp-perk">🏆 参赛资格：冠军最多可获 <strong>10 个 50K</strong> PF 账号</div>
                </div>
                <div className="mp-code-row">
                  <span className="mp-code-label">专属优惠码</span>
                  <code className="mp-code">{p.couponCode}</code>
                  <button type="button" className="mp-copy" onClick={() => copyCode(p.couponCode!)}>{copied ? "已复制 ✓" : "复制"}</button>
                </div>
                <div className="mp-offer-ctas">
                  {(p.affiliateUrl || p.officialUrl) && (
                    <a className="mp-cta" href={p.affiliateUrl || p.officialUrl!} target="_blank" rel="noreferrer nofollow sponsored">
                      去 {p.name} 用这个码 →
                    </a>
                  )}
                  <button type="button" className="mp-cta ghost" onClick={() => setShowJoin((v) => !v)}>
                    我要参赛 / 领直播模板
                  </button>
                </div>
                <div className="mp-rebate">含返佣链接，使用可能为本站带来佣金，不影响你的费用。下次报名 / 开新账户时填我们的码即可。</div>
              </>
            ) : (
              <>
                <div className="mp-block-title">这家我们暂未拿到专属码</div>
                <p className="mp-summary">先收藏关注；想要更划算、且能参赛 + 看实盘直播，可以看看下面已合作的公司。</p>
                <Link className="mp-cta" href={`${prefix}/exclusive-offers`}>看有专属码的公司 →</Link>
              </>
            )}

            {showJoin && (
              <div className="mp-join">
                <div className="mp-join-title">参赛 & 领实盘直播模板 · 怎么做</div>
                <ol className="mp-join-steps">
                  <li>报名时填写我们的优惠码 <code>{p.couponCode}</code></li>
                  <li>保存你的支付截图（含优惠码那一栏）</li>
                  <li>上传到本站核验（上传通道即将上线）</li>
                  <li>核验通过 → 获得参赛资格 + 实盘直播模板</li>
                </ol>
                <div className="mp-join-rule">
                  比赛要点：冠军最多可获 10 个 50K PF 账号；需使用我们的优惠码报名；名额、截止与评选标准以官方公告为准。本活动不构成投资建议，不保证收益或出金。
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {openSlug && <GuideMapOverlay slug={openSlug} onClose={() => setOpenSlug(null)} />}
    </section>
  );
}
