import { useMemo, useState } from "react";
import { Link } from "wouter";
import { firms } from "../data/firms";
import { getBrandZh } from "../data/brandZh";
import { programZh } from "../data/i18nZh";

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

  const stepLabel: Record<string, string> = { "all": "全部类型", "1-step": "一阶段", "2-step": "两阶段", "instant": "即时入金" };

  return (
    <main className="container">
      <div className="section-title">挑战赛全比对</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 18, maxWidth: 720 }}>
        覆盖 {firms.length} 家自营公司的全部签约挑战 —— 共 {all.length} 套方案。可按账户规模与项目类型筛选。
      </p>

      <div className="filter-bar" style={{ flexWrap: "wrap" }}>
        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>账户规模：</span>
        {(["all","25","50","100","150"] as const).map(s => (
          <button key={s} className={`filter-pill ${size===s?"active":""}`} onClick={() => setSize(s)}>
            {s === "all" ? "全部规模" : `$${s}K`}
          </button>
        ))}
        <span style={{ color: "var(--text-muted)", fontSize: 12, marginLeft: 12 }}>项目类型：</span>
        {(["all","1-step","2-step","instant"] as const).map(s => (
          <button key={s} className={`filter-pill ${step===s?"active":""}`} onClick={() => setStep(s)}>
            {stepLabel[s]}
          </button>
        ))}
      </div>

      <div className="firms-count">挑战赛 <span className="num">{filtered.length}</span></div>

      <div className="table-wrap">
        <table className="firms-table">
          <thead>
            <tr>
              <th>公司</th>
              <th>挑战赛方案</th>
              <th>原价</th>
              <th>现价</th>
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
                    <div>
                      <Link href={`/futures/prop-firms/${c.firmSlug}`} className="firm-name-link">{c.firmName}</Link>
                      {getBrandZh(c.firmSlug) && <div className="brand-zh-sub">{getBrandZh(c.firmSlug)}</div>}
                    </div>
                  </div>
                </td>
                <td>{programZh(c.name)}</td>
                <td><span style={{ color: "var(--text-muted)", textDecoration: "line-through" }}>{c.original || ""}</span></td>
                <td style={{ color: "var(--orange)", fontWeight: 700 }}>{c.price}</td>
                <td><Link href={`/futures/prop-firms/${c.firmSlug}`} className="btn-firm">详情</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 200 && (
          <div className="view-more">
            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
              已显示前 200 / 共 {filtered.length}
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
