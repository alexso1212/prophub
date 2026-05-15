import { Link, useLocation } from "wouter";
import { ReactNode, useEffect, useState } from "react";

const NAV = [
  { to: "/futures/all-prop-firms", label: "Home" },
  { to: "/futures/exclusive-offers", label: "Exclusive Offers" },
  { to: "/futures/prop-firm-challenges", label: "Challenges" },
  { to: "/futures/best-sellers", label: "Best Sellers" },
  { to: "/futures/prop-firm-reviews", label: "Reviews" },
  { to: "/futures/favorite-firms", label: "Favorite Firms" },
  { to: "/futures/prop-firm-rules", label: "Rules" },
  { to: "/futures/payouts", label: "Payouts" },
  { to: "/futures/payouts-leaderboard", label: "Trader Leaderboard" },
  { to: "/futures/brokers", label: "Brokers" },
  { to: "/futures/news", label: "新闻" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [path] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [path]);

  const isActive = (to: string) => {
    if (to === "/futures/all-prop-firms") return path === to || path === "/";
    return path === to;
  };

  return (
    <>
      <div className="top-bar">
        <span aria-hidden>✨</span>
        <span>New Giveaway Available →</span>
        <button className="check-now">Check Now</button>
      </div>

      <header className="header">
        <Link href="/futures/all-prop-firms" className="logo" aria-label="Prop Firm Match home">
          <span className="logo-mark">P</span>
          <span className="logo-text">Prop Firm Match</span>
        </Link>

        <button
          className="hamburger"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(o => !o)}
        >
          <span /><span /><span />
        </button>

        <div className="search">
          <span aria-hidden="true">🔍</span>
          <label htmlFor="site-search" className="sr-only" style={{position:"absolute",left:-9999}}>Search prop firms</label>
          <input id="site-search" placeholder="Search" aria-label="Search prop firms" />
        </div>

        <div className="tabs-pill">
          <button className="tab">Forex</button>
          <button className="tab active">Futures</button>
          <button className="tab">Crypto<span className="badge-new">NEW</span></button>
        </div>

        <div className="header-right">
          <button className="btn-pill"><span className="dot" />We're Hiring</button>
          <button className="btn-pill">📚 Tutorials</button>
          <button className="btn-pill">Log in</button>
          <button className="btn-pill primary">Sign Up</button>
        </div>
      </header>

      <nav className={`subnav ${mobileOpen ? "open" : ""}`} aria-label="Primary">
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
              The most trusted directory for prop trading firms. Compare offers, read verified reviews, and find the right firm for your trading style.
            </p>
          </div>
          <div className="footer-col">
            <h4>Prop Firms</h4>
            <Link href="/futures/all-prop-firms">All Prop Firms</Link>
            <Link href="/futures/best-sellers">Best Sellers</Link>
            <Link href="/futures/exclusive-offers">Exclusive Offers</Link>
            <Link href="/futures/prop-firm-challenges">Challenges</Link>
            <Link href="/futures/payouts">Payouts</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <Link href="/futures/prop-firm-reviews">Reviews</Link>
            <Link href="/futures/prop-firm-rules">Prop Firm Rules</Link>
            <Link href="/futures/brokers">Brokers</Link>
            <Link href="/futures/payouts-leaderboard">Trader Leaderboard</Link>
            <Link href="/futures/favorite-firms">Favorite Firms</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="https://twitter.com/propfirmmatch" target="_blank" rel="noreferrer">Twitter</a>
            <a href="https://www.instagram.com/propfirmmatch" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.youtube.com/@propfirmmatch" target="_blank" rel="noreferrer">YouTube</a>
            <a href="https://www.linkedin.com/company/prop-firm-match/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} Prop Firm Match. All rights reserved.</div>
      </footer>
    </>
  );
}
