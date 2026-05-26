import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useCategory, findFirmAnyCategory } from "../contexts/CategoryContext";
import { getBrandZh } from "../data/brandZh";
import FirmLogo from "../components/FirmLogo";
import { GiftIcon } from "../components/icons";
import { GIVEAWAYS, getOngoing, getEnding, getEnded, type Giveaway, type GiveawayStatus } from "../data/giveaways";
import GiveawaySignupModal from "../components/GiveawaySignupModal";

const SIGNUP_KEY = "pfm.giveaways.signups.v1";

function readSignups(): Record<string, string> {
  try {
    const raw = localStorage.getItem(SIGNUP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function writeSignups(map: Record<string, string>) {
  try { localStorage.setItem(SIGNUP_KEY, JSON.stringify(map)); } catch { /* ignore */ }
}

function useCountdown(endsAt: string): string {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const ms = new Date(endsAt).getTime() - now;
  if (ms <= 0) return "已截止";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (d > 0) return `${d} 天 ${h} 时 ${m} 分`;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function useAnimatedNumber(target: number, durationMs = 900): number {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return n;
}

function statusBadgeClass(s: GiveawayStatus): string {
  if (s === "进行中") return "gw-badge gw-badge-live";
  if (s === "即将开奖") return "gw-badge gw-badge-soon";
  return "gw-badge gw-badge-end";
}

function StatusDot({ status }: { status: GiveawayStatus }) {
  return <span className={statusBadgeClass(status)}>{status === "进行中" && <span className="gw-pulse" />}{status}</span>;
}

interface CardProps {
  g: Giveaway;
  signedUp: boolean;
  onSignup: (g: Giveaway) => void;
}

function GiveawayCard({ g, signedUp, onSignup }: CardProps) {
  const sponsorRef = findFirmAnyCategory(g.sponsorSlug);
  const sponsor = sponsorRef?.firm;
  const sponsorCategory = sponsorRef?.category;
  const cosponsorRefs = (g.cosponsorSlugs ?? [])
    .map(s => findFirmAnyCategory(s))
    .filter((r): r is NonNullable<typeof r> => !!r);
  const sponsorZh = sponsor ? getBrandZh(sponsor.slug) : "";
  const countdown = useCountdown(g.endsAt);
  const entries = useAnimatedNumber(g.entries);
  const capPct = g.cap ? Math.min(100, Math.round((g.entries / g.cap) * 100)) : null;

  return (
    <article className="gw-card">
      <div className="gw-card-head">
        {sponsor && sponsorCategory && (
          <Link href={`/${sponsorCategory}/prop-firms/${sponsor.slug}`} className="firm-logo-sm gw-card-logo" aria-label={sponsor.name}>
            <FirmLogo src={sponsor.logo} alt={sponsor.name} />
          </Link>
        )}
        <div className="gw-card-headtext">
          <div className="gw-card-titlerow">
            <h3 className="gw-card-title">{g.title}</h3>
            <StatusDot status={g.status} />
          </div>
          <div className="gw-card-sponsor">
            由 {sponsor && sponsorCategory ? (
              <Link href={`/${sponsorCategory}/prop-firms/${sponsor.slug}`} className="firm-name-link">{sponsorZh || sponsor.name}</Link>
            ) : <span>合作公司</span>}
            {cosponsorRefs.map(({ firm, category }) => (
              <span key={firm.slug}> × <Link href={`/${category}/prop-firms/${firm.slug}`} className="firm-name-link">{getBrandZh(firm.slug) || firm.name}</Link></span>
            ))}
            {" "}赞助
          </div>
        </div>
      </div>

      <div className="gw-card-prize">
        <span className="gw-prize-label">奖品</span>
        <span className="gw-prize-text">{g.prize}</span>
        <span className="gw-prize-value">≈ ${g.prizeValueUsd.toLocaleString()}</span>
      </div>

      <div className="gw-card-meta">
        <div className="gw-meta-item">
          <span className="gw-meta-k">{g.status === "已结束" ? "开奖时间" : "开奖倒计时"}</span>
          <span className="gw-meta-v gw-countdown">{g.status === "已结束" ? g.endsAt.slice(0, 10) : countdown}</span>
        </div>
        <div className="gw-meta-item">
          <span className="gw-meta-k">报名人数</span>
          <span className="gw-meta-v">{entries.toLocaleString()} {g.cap && <small>/ {g.cap.toLocaleString()}</small>}</span>
        </div>
      </div>

      {capPct != null && (
        <div className="gw-progress" aria-label={`报名进度 ${capPct}%`}>
          <div className="gw-progress-bar" style={{ width: `${capPct}%` }} />
          <span className="gw-progress-text">报名进度 {capPct}%</span>
        </div>
      )}

      {g.status === "已结束" && g.winners && g.winners.length > 0 && (
        <div className="gw-winners">
          <div className="gw-winners-title">🏆 中奖名单</div>
          <ul className="gw-winners-list">
            {g.winners.map((w, i) => (
              <li key={i}>
                <span className="gw-winner-email">{w.maskedEmail}</span>
                {w.amount && <span className="gw-winner-prize"> — {w.amount}</span>}
                <span className="gw-winner-date">{w.date}</span>
              </li>
            ))}
          </ul>
          {g.proofUrl && (
            <details className="gw-proof">
              <summary>查看发奖凭证</summary>
              <img src={g.proofUrl} alt="发奖凭证截图" loading="lazy" />
            </details>
          )}
        </div>
      )}

      <div className="gw-card-foot">
        {g.status === "进行中" && (
          signedUp
            ? <button className="gw-btn-done" disabled>✓ 已报名</button>
            : <button className="gw-btn-join" onClick={() => onSignup(g)}>免费报名</button>
        )}
        {g.status === "即将开奖" && (
          signedUp
            ? <button className="gw-btn-done" disabled>✓ 已报名 · 等待开奖</button>
            : <span className="gw-foot-hint">报名已截止，敬请等待开奖通知</span>
        )}
        {g.status === "已结束" && <span className="gw-foot-hint">本期已结束 · 关注下一期</span>}
      </div>
    </article>
  );
}

function Section({ title, items, signups, onSignup }: {
  title: string;
  items: Giveaway[];
  signups: Record<string, string>;
  onSignup: (g: Giveaway) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section className="gw-section">
      <div className="gw-section-head">
        <h2 className="gw-section-title">{title}</h2>
        <span className="gw-section-count">{items.length} 期</span>
      </div>
      <div className="gw-grid">
        {items.map(g => <GiveawayCard key={g.id} g={g} signedUp={!!signups[g.id]} onSignup={onSignup} />)}
      </div>
    </section>
  );
}

export default function GiveawaysPage() {
  const category = useCategory();
  const [signups, setSignups] = useState<Record<string, string>>(() => readSignups());
  const [modalGiveaway, setModalGiveaway] = useState<Giveaway | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const matchesCat = (g: Giveaway) => g.category === "all" || g.category === category;
  const ongoing = useMemo(() => getOngoing().filter(matchesCat), [category]);
  const ending = useMemo(() => getEnding().filter(matchesCat), [category]);
  const ended = useMemo(() => getEnded().filter(matchesCat), [category]);

  const totalPrize = useMemo(
    () => GIVEAWAYS.filter(g => g.status !== "已结束").reduce((s, g) => s + g.prizeValueUsd, 0),
    []
  );

  function handleSignup(g: Giveaway) {
    setModalGiveaway(g);
  }

  function handleSignupSuccess(email: string) {
    if (!modalGiveaway) return;
    const next = { ...signups, [modalGiveaway.id]: email };
    setSignups(next);
    writeSignups(next);
    setToast(`报名成功！开奖后我们会发邮件到 ${email}`);
    setModalGiveaway(null);
    window.setTimeout(() => setToast(null), 3500);
  }

  return (
    <main className="container gw-page">
      <div className="section-title"><GiftIcon size={18} className="icon" /> 免费抽奖</div>
      <div className="gw-hero">
        <p className="gw-hero-desc">
          每周联合合作 prop firm 送出免费评估账户与挑战赛通行证。完成邮箱验证即获得抽奖号，开奖后通过邮件与站内信通知。
        </p>
        <div className="gw-hero-stats">
          <div><strong>{GIVEAWAYS.length}</strong><span>期已上线</span></div>
          <div><strong>${totalPrize.toLocaleString()}</strong><span>本月奖品总值</span></div>
          <div><strong>{GIVEAWAYS.reduce((s, g) => s + g.entries, 0).toLocaleString()}</strong><span>累计参与人次</span></div>
        </div>
      </div>

      {ongoing.length + ending.length + ended.length === 0 && (
        <div className="gw-empty">本板块当前暂无抽奖活动，下一期上线时会自动出现在这里。</div>
      )}
      <Section title="🟢 进行中" items={ongoing} signups={signups} onSignup={handleSignup} />
      <Section title="🟠 即将开奖" items={ending} signups={signups} onSignup={handleSignup} />
      <Section title="⚪ 已结束" items={ended} signups={signups} onSignup={handleSignup} />

      <div className="gw-rules">
        <strong>活动规则：</strong>
        每个邮箱仅可报名同一期一次；中奖结果开奖后 24 小时内邮件通知，并在本页「已结束」区块公示脱敏邮箱与发奖凭证。
        奖品由对应 prop firm 直接发放至中奖账户，Prophub 不收取任何手续费。
      </div>

      {modalGiveaway && (
        <GiveawaySignupModal
          giveaway={modalGiveaway}
          onClose={() => setModalGiveaway(null)}
          onSuccess={handleSignupSuccess}
        />
      )}
      {toast && <div className="gw-toast" role="status">{toast}</div>}
    </main>
  );
}
