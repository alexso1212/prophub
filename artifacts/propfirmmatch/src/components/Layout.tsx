import { Link, useLocation } from "wouter";
import { ReactNode, useEffect, useState, FormEvent } from "react";
import type { Category } from "../contexts/CategoryContext";
import {
  SparkleIcon, SearchIcon, BookIcon, GiftIcon, TvIcon, HeartIcon,
  ChartIcon, BitcoinIcon,
} from "./icons";
import SupportWidget from "./SupportWidget";
import { useBilibiliLiveStatus } from "../hooks/useBilibiliLiveStatus";

const BILIBILI_ROOM_ID = "1874453448";

function buildNav(cat: Category) {
  const p = `/${cat}`;
  return [
    { to: `${p}/all-prop-firms`,        label: "首页" },
    { to: `${p}/exclusive-offers`,      label: "限时优惠" },
    { to: `${p}/prop-firm-challenges`,  label: "挑战赛" },
    { to: `${p}/best-sellers`,          label: "热销榜" },
    { to: `${p}/prop-firm-reviews`,     label: "用户评价" },
    { to: `${p}/favorite-firms`,        label: "我的收藏" },
    { to: `${p}/prop-firm-rules`,       label: "规则手册" },
    { to: `${p}/payouts`,               label: "出金记录" },
    { to: `${p}/payouts-leaderboard`,   label: "出金排行" },
    { to: `${p}/brokers`,               label: "合作经纪" },
    { to: `${p}/news`,                  label: "行业新闻" },
  ];
}

const LIVE_TEXT: Record<Category, string> = {
  futures: "直播间正在交易期货",
  forex: "直播间正在交易外汇",
  crypto: "直播间正在交易加密",
};

export default function Layout({ children }: { children: ReactNode }) {
  const [path, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [supportOpen, setSupportOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); setDrawerOpen(false); setSupportOpen(false); }, [path]);

  const submitSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setLocation(`/search?q=${encodeURIComponent(q)}`);
  };

  const activeCategory: Category =
    path.startsWith("/forex") ? "forex"
    : path.startsWith("/crypto") ? "crypto"
    : "futures";

  const NAV = buildNav(activeCategory);
  const homePath = `/${activeCategory}/all-prop-firms`;
  const liveInfo = useBilibiliLiveStatus(BILIBILI_ROOM_ID);
  const isLive = liveInfo.status === "live";
  const isRerun = liveInfo.status === "rerun";

  const isActive = (to: string) => {
    if (to === homePath) return path === to || path === "/" || path === `/${activeCategory}`;
    return path === to;
  };

  return (
    <>
      <div className="top-bar">
        <SparkleIcon size={14} />
        <span>新一期抽奖活动上线 →</span>
        <Link className="check-now" href={`/${activeCategory}/giveaways`}>立即查看</Link>
      </div>

      <div
        className="live-bar"
        style={!isLive ? { background: "#1f2937", color: "#cbd5e1" } : undefined}
      >
        <span
          className="live-pill"
          style={
            isLive
              ? undefined
              : {
                  background: isRerun ? "#475569" : "#334155",
                  color: "#e2e8f0",
                }
          }
        >
          {isLive ? (
            <>
              <span className="live-dot" />LIVE
            </>
          ) : isRerun ? (
            "轮播"
          ) : liveInfo.status === "loading" ? (
            "···"
          ) : (
            "未开播"
          )}
        </span>
        <span className="live-msg">
          {isLive
            ? `${LIVE_TEXT[activeCategory]} · 主持人正在解读盘面`
            : isRerun
              ? `${LIVE_TEXT[activeCategory]} · 当前为往期回放轮播`
              : liveInfo.status === "loading"
                ? "正在获取直播状态…"
                : `主播暂未开播 · ${LIVE_TEXT[activeCategory].replace("正在交易", "")}频道`}
        </span>
        <Link className="live-cta" href={`/${activeCategory}/live`}>
          {isLive ? "立即观看" : isRerun ? "进入回放" : "关注开播"}
        </Link>
      </div>

      <header className="header">
        <Link href={homePath} className="logo" aria-label="Prophub · PF 群英 首页">
          <img src="/prophub-logo.svg" alt="" className="logo-img" aria-hidden="true" />
          <span className="logo-text">Prophub<span className="logo-sub">PF 群英 · 自营公司大全</span></span>
        </Link>

        <button
          className="hamburger"
          aria-label="切换导航"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(o => !o)}
        >
          <span /><span /><span />
        </button>

        <form className="search" onSubmit={submitSearch} role="search">
          <button
            type="submit"
            aria-label="搜索"
            style={{ background: "none", border: 0, padding: 0, cursor: "pointer", color: "inherit", display: "inline-flex", alignItems: "center" }}
          ><SearchIcon size={16} /></button>
          <label htmlFor="site-search" className="sr-only" style={{position:"absolute",left:-9999}}>搜索自营公司</label>
          <input
            id="site-search"
            placeholder="搜索公司、平台、优惠码"
            aria-label="搜索自营公司"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="tabs-pill">
          <Link href="/forex/all-prop-firms" className={`tab ${activeCategory === "forex" ? "active" : ""}`}>外汇</Link>
          <Link href="/futures/all-prop-firms" className={`tab ${activeCategory === "futures" ? "active" : ""}`}>期货</Link>
          <Link href="/crypto/all-prop-firms" className={`tab ${activeCategory === "crypto" ? "active" : ""}`}>加密<span className="badge-new">新</span></Link>
        </div>

        <div className="header-right">
          <Link className="btn-pill hide-on-mobile" href="/careers"><span className="dot" />招聘中</Link>
          <Link className="btn-pill hide-on-mobile" href="/tutorials"><BookIcon size={14} /> 教程</Link>
          <Link href="/sign-in" className="btn-pill hide-on-mobile">登录</Link>
          <Link href="/sign-up" className="btn-pill primary">注册</Link>
          <button
            type="button"
            className="header-drawer-toggle"
            aria-label="打开菜单"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(o => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* mobile underline tab strip duplicated for ≤768 */}
      <div className="cat-tabs-mobile" aria-hidden={false}>
        <Link href="/forex/all-prop-firms" className={activeCategory === "forex" ? "active" : ""}>外汇</Link>
        <Link href="/futures/all-prop-firms" className={activeCategory === "futures" ? "active" : ""}>期货</Link>
        <Link href="/crypto/all-prop-firms" className={activeCategory === "crypto" ? "active" : ""}>
          加密<span className="badge-new" style={{ marginLeft: 4 }}>新</span>
        </Link>
      </div>

      {drawerOpen && (
        <>
          <div className="drawer-mask" onClick={() => setDrawerOpen(false)} />
          <aside className="side-drawer" aria-label="更多菜单">
            <div className="side-drawer-head">
              <img src="/prophub-logo.svg" alt="" className="logo-img" aria-hidden="true" />
              <span style={{ fontWeight: 700 }}>Prophub · PF 群英</span>
              <button
                className="side-drawer-close"
                aria-label="关闭"
                onClick={() => setDrawerOpen(false)}
              >×</button>
            </div>
            <Link className="drawer-link" href="/sign-in">登录账户</Link>
            <Link className="drawer-link" href="/careers"><span className="dot" />招聘中</Link>
            <Link className="drawer-link" href="/tutorials"><BookIcon size={14} /> 教程</Link>
            <Link className="drawer-link" href={`/${activeCategory}/giveaways`}><GiftIcon size={14} /> 免费抽奖</Link>
            <Link className="drawer-link" href={`/${activeCategory}/live`}><TvIcon size={14} /> 直播间</Link>
            <Link className="drawer-link" href={`/${activeCategory}/favorite-firms`}><HeartIcon size={14} /> 我的收藏</Link>
            <div className="drawer-section">板块</div>
            <Link className="drawer-link" href="/forex/all-prop-firms">外汇</Link>
            <Link className="drawer-link" href="/futures/all-prop-firms">期货</Link>
            <Link className="drawer-link" href="/crypto/all-prop-firms">加密 <span className="badge-new" style={{ marginLeft: 4 }}>新</span></Link>
          </aside>
        </>
      )}

      <nav className={`subnav ${mobileOpen ? "open" : ""}`} aria-label="主导航">
        {NAV.map(n => (
          <Link key={n.to} href={n.to} className={isActive(n.to) ? "active" : ""}>
            {n.label}
          </Link>
        ))}
      </nav>

      {activeCategory !== "futures" && (
        <div className="demo-banner" role="status">
          <span style={{ display: "inline-flex", verticalAlign: "-3px", marginRight: 4 }}>
            {activeCategory === "forex" ? <ChartIcon size={14} /> : <BitcoinIcon size={14} />}
          </span>
          {activeCategory === "forex" ? "外汇" : "加密"}版本目前为
          <strong style={{ margin: "0 4px", color: "var(--orange)" }}>演示数据</strong>
          ，数据持续接入中，结构与功能与期货版完全一致。
        </div>
      )}

      {children}

      <button
        type="button"
        className={`fab-help ${supportOpen ? "active" : ""}`}
        aria-label={supportOpen ? "关闭客服" : "打开客服"}
        aria-expanded={supportOpen}
        title="需要帮助？"
        onClick={() => setSupportOpen(o => !o)}
      >
        {supportOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        )}
        {!supportOpen && <span className="fab-help-hint" aria-hidden>需要帮助？</span>}
      </button>
      {supportOpen && <SupportWidget onClose={() => setSupportOpen(false)} />}

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <div className="logo" style={{ marginBottom: 14 }}>
              <img src="/prophub-logo.svg" alt="" className="logo-img" aria-hidden="true" />
              <span>Prophub · PF 群英</span>
            </div>
            <p style={{ color: "var(--text-dim)", fontSize: 13, lineHeight: 1.6 }}>
              最值得信赖的自营交易公司导航站。一站对比挑战赛、阅读真实评价，找到适合你交易风格的合作公司。
            </p>
          </div>
          <div className="footer-col">
            <h4>自营公司</h4>
            <Link href={`/${activeCategory}/all-prop-firms`}>全部公司</Link>
            <Link href={`/${activeCategory}/best-sellers`}>热销榜</Link>
            <Link href={`/${activeCategory}/exclusive-offers`}>限时优惠</Link>
            <Link href={`/${activeCategory}/prop-firm-challenges`}>挑战赛</Link>
            <Link href={`/${activeCategory}/payouts`}>出金记录</Link>
          </div>
          <div className="footer-col">
            <h4>资源中心</h4>
            <Link href={`/${activeCategory}/prop-firm-reviews`}>用户评价</Link>
            <Link href={`/${activeCategory}/prop-firm-rules`}>规则手册</Link>
            <Link href={`/${activeCategory}/brokers`}>合作经纪</Link>
            <Link href={`/${activeCategory}/payouts-leaderboard`}>出金排行</Link>
            <Link href={`/${activeCategory}/favorite-firms`}>我的收藏</Link>
          </div>
          <div className="footer-col">
            <h4>关于我们</h4>
            <a href="https://twitter.com/propfirmmatch" target="_blank" rel="noreferrer">Twitter</a>
            <a href="https://www.instagram.com/propfirmmatch" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.youtube.com/@propfirmmatch" target="_blank" rel="noreferrer">YouTube</a>
            <a href="https://www.linkedin.com/company/prop-firm-match/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} Prophub · PF 群英 · 保留所有权利</div>
      </footer>
    </>
  );
}
