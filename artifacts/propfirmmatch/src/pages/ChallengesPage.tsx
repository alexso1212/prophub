import { useMemo, useState } from "react";
import { Link } from "wouter";
import { firms } from "../data/firms";

export default function ChallengesPage() {
  const [size, setSize] = useState<"all"|"25"|"50"|"100"|"150">("all");
  const [step, setStep] = useState<"all"|"1-step"|"2-step"|"instant">("all");

  const all = useMemo(() => {
    const out: { firmName: string; firmSlug: string; logo: string; name: string; price: string; original?: string }[] = [];
    for (const f of firms) {
      for (const c of f.challenges || []) {
        out.push({ firmName: f.name, firmSlug: f.slug, logo: f.logo, ...c });
      }
    }
    return out;
  }, []);

  const filtered = useMemo(() => all.filter(c => {
    const n = c.name.toLowerCase();
    if (size !== "all" && !n.includes(`${size}k`)) return false;
    if (step === "1-step" && !n.includes("1-step") && !n.includes("1 step")) return false;
    if (step === "2-step" && !n.includes("2-step") && !n.includes("2 step")) return false;
    if (step === "instant" && !n.includes("instant")) return false;
    return true;
  }), [all, size, step]);

  return (
    <main className="container">
      <div className="section-title">Compare All Challenges</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 18, maxWidth: 720 }}>
        Every funded challenge across {firms.length} prop firms — {all.length} programs in total. Filter by account size and program type.
      </p>

      <div className="filter-bar" style={{ flexWrap: "wrap" }}>
        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>Size:</span>
        {(["all","25","50","100","150"] as const).map(s => (
          <button key={s} className={`filter-pill ${size===s?"active":""}`} onClick={() => setSize(s)}>
            {s === "all" ? "All Sizes" : `$${s}K`}
          </button>
        ))}
        <span style={{ color: "var(--text-muted)", fontSize: 12, marginLeft: 12 }}>Type:</span>
        {(["all","1-step","2-step","instant"] as const).map(s => (
          <button key={s} className={`filter-pill ${step===s?"active":""}`} onClick={() => setStep(s)}>
            {s === "all" ? "All Types" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="firms-count">Challenges <span className="num">{filtered.length}</span></div>

      <div className="table-wrap">
        <table className="firms-table">
          <thead>
            <tr>
              <th>Firm</th>
              <th>Challenge</th>
              <th>Was</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 200).map((c, i) => (
              <tr key={i}>
                <td>
                  <div className="cell-firm">
                    <Link href={`/futures/prop-firms/${c.firmSlug}`} className="firm-logo-sm">
                      <img src={c.logo} alt={c.firmName} />
                    </Link>
                    <Link href={`/futures/prop-firms/${c.firmSlug}`} className="firm-name-link">{c.firmName}</Link>
                  </div>
                </td>
                <td>{c.name}</td>
                <td><span style={{ color: "var(--text-muted)", textDecoration: "line-through" }}>{c.original || ""}</span></td>
                <td style={{ color: "var(--orange)", fontWeight: 700 }}>{c.price}</td>
                <td><Link href={`/futures/prop-firms/${c.firmSlug}`} className="btn-firm">Firm</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 200 && <div className="view-more"><button>Showing first 200 of {filtered.length}</button></div>}
      </div>
    </main>
  );
}
