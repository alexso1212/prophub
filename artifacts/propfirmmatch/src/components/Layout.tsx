import { Link, useLocation } from "wouter";
import { ReactNode, useEffect, useState, FormEvent } from "react";

const NAV = [
  { to: "/futures/all-prop-firms", label: "首页" },
  { to: "/futures/exclusive-offers", label: "限时优惠" },
  { to: "/futures/prop-firm-challenges", label: "挑战赛" },
  { to: "/futures/best-sellers", label: "热销榜" },
  { to: "/futures/prop-firm-reviews", label: "用户评价" },
  { to: "/futures/favorite-firms", label: "我的收藏" },
  { to: "/futures/prop-firm-rules", label: "规则手册" },
  { to: "/futures/payouts", label: "出金记录" },
  { to: "/futures/payouts-leaderboard", label: "出金排行" },
  { to: "/futures/brokers", label: "合作经纪" },
  { to: "/futures/news", label: "行业新闻" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [path, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { setMobileOpen(false); }, [path]);

  const submitSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setLocation(`/search?q=${encodeURIComponent(q)}`);
  };

  const isActive = (to: string) => {
    if (to === "/futures/all-prop-firms") return path === to || path === "/";
    return path === to;
  };

  const activeCategory: "forex" | "futures" | "crypto" =
    path.startsWith("/forex") ? "forex"
    : path.startsWith("/crypto") ? "crypto"
    : "futures";

  return (
    <>
      <div className="top-bar">
        <span aria-hidden>✨</span>
        <span>新一期抽奖活动上线 →</span>
        <a
          className="check-now"
          href="https://propfirmmatch.com/futures/giveaways"
          target="_blank"
          rel="noreferrer"
        >立即查看</a>
      </div>

      <header className="header">
        <Link href="/futures/all-prop-firms" className="logo" aria-label="Prop Firm Match 首页">
          <span className="logo-mark">P</span>
          <span className="logo-text">Prop Firm Match<span className="logo-sub">自营公司大全</span></span>
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
            style={{ background: "none", border: 0, padding: 0, cursor: "pointer", color: "inherit" }}
          >🔍</button>
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
          <a className="btn-pill hide-on-mobile" href="https://propfirmmatch.com/careers" target="_blank" rel="noreferrer"><span className="dot" />招聘中</a>
          <a className="btn-pill hide-on-mobile" href="https://propfirmmatch.com/tutorials" target="_blank" rel="noreferrer">📚 教程</a>
          <Link href="/sign-in" className="btn-pill">登录</Link>
          <Link href="/sign-up" className="btn-pill primary">注册</Link>
        </div>
      </header>

      <nav className={`subnav ${mobileOpen ? "open" : ""}`} aria-label="主导航">
        {NAV.map(n => (
          <Link key={n.to} href={n.to} className={isActive(n.to) ? "active" : ""}>
            {n.label}
          </Link>
        ))}
      </nav>

      {children}

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <div className="logo" style={{ marginBottom: 14 }}>
              <span className="logo-mark">P</span>
              <span>Prop Firm Match</span>
            </div>
            <p style={{ color: "var(--text-dim)", fontSize: 13, lineHeight: 1.6 }}>
              最值得信赖的自营交易公司导航站。一站对比挑战赛、阅读真实评价，找到适合你交易风格的合作公司。
            </p>
          </div>
          <div className="footer-col">
            <h4>自营公司</h4>
            <Link href="/futures/all-prop-firms">全部公司</Link>
            <Link href="/futures/best-sellers">热销榜</Link>
            <Link href="/futures/exclusive-offers">限时优惠</Link>
            <Link href="/futures/prop-firm-challenges">挑战赛</Link>
            <Link href="/futures/payouts">出金记录</Link>
          </div>
          <div className="footer-col">
            <h4>资源中心</h4>
            <Link href="/futures/prop-firm-reviews">用户评价</Link>
            <Link href="/futures/prop-firm-rules">规则手册</Link>
            <Link href="/futures/brokers">合作经纪</Link>
            <Link href="/futures/payouts-leaderboard">出金排行</Link>
            <Link href="/futures/favorite-firms">我的收藏</Link>
          </div>
          <div className="footer-col">
            <h4>关于我们</h4>
            <a href="https://twitter.com/propfirmmatch" target="_blank" rel="noreferrer">Twitter</a>
            <a href="https://www.instagram.com/propfirmmatch" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.youtube.com/@propfirmmatch" target="_blank" rel="noreferrer">YouTube</a>
            <a href="https://www.linkedin.com/company/prop-firm-match/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} Prop Firm Match · 保留所有权利</div>
      </footer>
    </>
  );
}
