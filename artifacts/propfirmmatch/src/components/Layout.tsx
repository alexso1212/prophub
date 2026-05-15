import { Link, useLocation } from "wouter";
import { ReactNode } from "react";

const NAV = [
  { to: "/futures/all-prop-firms", label: "Home" },
  { to: "/futures/offers", label: "Offers" },
  { to: "/futures/challenges", label: "Challenges" },
  { to: "/futures/best-sellers", label: "Best Sellers" },
  { to: "/futures/reviews", label: "Reviews" },
  { to: "/futures/favorites", label: "Favorite Firms" },
  { to: "/futures/prop-firm-rules", label: "Prop Firm Rules" },
  { to: "/futures/payouts", label: "Payouts" },
  { to: "/futures/brokers", label: "Brokers" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [path] = useLocation();
  return (
    <>
      <div className="top-bar">
        <span>✨</span>
        <span>New Giveaway Available →</span>
        <button className="check-now">Check Now</button>
      </div>

      <header className="header">
        <Link href="/futures/all-prop-firms" className="logo" aria-label="Prop Firm Match home">
          <span className="logo-mark">P</span>
          <span>Prop Firm Match</span>
        </Link>
        <button className="apps-icon" aria-label="App menu">⊞</button>
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

      <nav className="subnav" aria-label="Primary">
        {NAV.map(n => {
          const isHome = n.to === "/futures/all-prop-firms";
          const active = path === n.to || (isHome && path === "/");
          return (
            <Link key={n.to} href={n.to} className={active ? "active" : ""}>
              {n.label}
            </Link>
          );
        })}
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
            <h4>Futures</h4>
            <a href="#">All Prop Firms</a>
            <a href="#">Best Sellers</a>
            <a href="#">Offers</a>
            <a href="#">Challenges</a>
            <a href="#">Payouts</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#">Tutorials</a>
            <a href="#">Reviews</a>
            <a href="#">Prop Firm Rules</a>
            <a href="#">Brokers</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} Prop Firm Match. All rights reserved.</div>
      </footer>
    </>
  );
}
