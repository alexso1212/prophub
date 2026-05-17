import { useRoute, Link, useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { findFirmAnyCategory } from "../contexts/CategoryContext";
import { getBrandZh } from "../data/brandZh";

const COUNTDOWN_SECONDS = 3;
const CLICKS_KEY = "pfm.outbound.clicks";

type ClickLog = { slug: string; at: number; promoCode: string; affiliateUrl: string };

function logClick(entry: ClickLog) {
  try {
    const raw = localStorage.getItem(CLICKS_KEY);
    const list: ClickLog[] = raw ? JSON.parse(raw) : [];
    list.unshift(entry);
    localStorage.setItem(CLICKS_KEY, JSON.stringify(list.slice(0, 500)));
  } catch {
    /* ignore quota / privacy mode */
  }
}

async function copyCode(code: string): Promise<boolean> {
  if (!code) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(code);
      return true;
    }
  } catch { /* fall through */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = code;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function GoPage() {
  const [, params] = useRoute("/go/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug ?? "";
  const found = findFirmAnyCategory(slug);
  const firm = found?.firm;
  const category = found?.category ?? "futures";
  const brandZh = firm ? getBrandZh(firm.slug) : "";
  const detailHref = firm ? `/${category}/prop-firms/${firm.slug}` : `/${category}/all-prop-firms`;
  const hasLink = !!firm?.affiliateUrl;
  const promoCode = firm?.promoCode ?? "";

  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [cancelled, setCancelled] = useState(false);
  const [copied, setCopied] = useState<"ok" | "fail" | null>(null);
  const jumpedRef = useRef(false);

  const jump = () => {
    if (jumpedRef.current || !firm?.affiliateUrl) return;
    jumpedRef.current = true;
    logClick({ slug: firm.slug, at: Date.now(), promoCode, affiliateUrl: firm.affiliateUrl });
    window.location.assign(firm.affiliateUrl);
  };

  // Copy promo code on mount
  useEffect(() => {
    if (!hasLink || !promoCode) return;
    copyCode(promoCode).then(ok => setCopied(ok ? "ok" : "fail"));
  }, [hasLink, promoCode]);

  // Countdown timer
  useEffect(() => {
    if (!hasLink || cancelled) return;
    if (seconds <= 0) { jump(); return; }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, cancelled, hasLink]);

  if (!firm) {
    return (
      <main className="container" style={{ maxWidth: 560 }}>
        <div className="go-card">
          <div className="go-title">未找到该公司</div>
          <p className="go-sub">请检查链接是否正确，或返回首页浏览全部公司。</p>
          <div className="go-actions">
            <Link href="/futures/all-prop-firms" className="btn-buy">浏览全部公司</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 560 }}>
      <div className="go-card">
        <div className="go-logo">
          <img src={firm.logo} alt={firm.name} />
        </div>
        <div className="go-title">
          {hasLink ? "正在前往" : "暂未开通合作通道"}
          {" "}
          <span className="go-brand">{brandZh || firm.name}</span>
          {hasLink ? " 官网" : ""}
        </div>

        {hasLink ? (
          <>
            <div className="go-countdown">
              <span className="go-num">{Math.max(seconds, 0)}</span>
              <span className="go-unit">秒</span>
              <span className="go-tip">{cancelled ? "已取消自动跳转" : "后自动跳转"}</span>
            </div>

            {promoCode && (
              <>
                <div className="go-code-label">你的专属优惠码</div>
                <div className="go-code-box">{promoCode}</div>
                <div className={`go-copy-toast ${copied === "ok" ? "ok" : copied === "fail" ? "fail" : ""}`}>
                  {copied === "ok" && "✓ 已自动复制到剪贴板，结账时直接粘贴即可"}
                  {copied === "fail" && "复制失败，请长按上方优惠码手动复制"}
                  {copied === null && "正在复制优惠码…"}
                </div>
              </>
            )}

            <div className="go-actions">
              <button type="button" className="btn-buy" onClick={() => { setCancelled(true); jump(); }}>
                立即跳转
              </button>
              {!cancelled ? (
                <button type="button" className="btn-pill" onClick={() => setCancelled(true)}>
                  取消自动跳转
                </button>
              ) : (
                <button type="button" className="btn-pill" onClick={() => navigate(detailHref)}>
                  返回公司详情
                </button>
              )}
            </div>
            <p className="go-foot">
              跳转后请认准 <strong>{new URL(firm.affiliateUrl!).hostname}</strong>，结账时使用上面的优惠码享受折扣。
            </p>
          </>
        ) : (
          <>
            <p className="go-sub">
              {firm.name} 的合作链接正在维护中。我们建议你先返回详情页查看完整规则、用户评价和出金记录，稍后再来购买。
            </p>
            <div className="go-actions">
              <Link href={detailHref} className="btn-buy">查看公司详情</Link>
              <Link href={`/${category}/all-prop-firms`} className="btn-pill">浏览同类公司</Link>
            </div>
            {promoCode && (
              <div className="go-code-box" style={{ marginTop: 16 }}>{promoCode}</div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
