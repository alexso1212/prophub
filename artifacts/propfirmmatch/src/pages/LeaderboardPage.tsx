import { Link } from "wouter";
import { LEADERBOARD } from "../data/leaderboard";
import { getBrandZh } from "../data/brandZh";
import { medianZh } from "../data/i18nZh";
import { useCategory, useCategoryFirms, useCategoryMeta } from "../contexts/CategoryContext";
import FirmLogo from "../components/FirmLogo";
import { TrophyIcon } from "../components/icons";

export default function LeaderboardPage() {
  const category = useCategory();
  const meta = useCategoryMeta();
  const firms = useCategoryFirms();
  const prefix = `/${category}`;
  const isFutures = category === "futures";
  const rows = isFutures ? LEADERBOARD : [];

  return (
    <main className="container">
      <div className="section-title"><TrophyIcon size={18} className="icon" /> 自营公司出金排行</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 18, maxWidth: 720 }}>
        {isFutures
          ? <>按累计出金额度排序的自营公司榜单，数据来自公开出金记录表。源站 /futures/payouts-leaderboard 上的"个人交易员排行"需要登录账号才能访问，因此这里改为展示公司维度排行。</>
          : <>{meta.label}板块出金排行正在接入中，下方为页面结构演示。</>}
      </p>

      <div className="popular-row" style={{ marginBottom: 30 }}>
        {rows.slice(0, 3).map((t, i) => {
          const f = firms.find(x => x.slug === t.slug || x.name === t.name);
          const cls = i === 0 ? "gold" : i === 1 ? "silver" : "bronze";
          return (
            <div key={t.slug} className="popular-card">
              <div className={`trophy trophy-${cls}`} aria-label={`第 ${i + 1} 名`}>
                <TrophyIcon size={22} />
                <span className="trophy-num">{i + 1}</span>
              </div>
              {f && (
                <div className="logo-wrap">
                  <FirmLogo src={f.logo} alt={f.name} />
                </div>
              )}
              <div className="name">{t.name}{f && getBrandZh(f.slug) && <span className="brand-zh-sub">{getBrandZh(f.slug)}</span>}</div>
              <div className="meta">
                {t.count.toLocaleString()} 笔 · 平均 ${t.avg.toLocaleString()}
              </div>
              <div className="discount" style={{ background: "var(--gradient-pp-2)", color: "white" }}>
                ${t.total.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="table-wrap">
        <table className="firms-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>公司</th>
              <th>累计出金</th>
              <th>出金笔数</th>
              <th>最大单笔</th>
              <th>平均金额</th>
              <th>到账时间中位</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => {
              const f = firms.find(x => x.slug === t.slug || x.name === t.name);
              return (
                <tr key={t.slug}>
                  <td><span className="rank-num">{i + 1}</span></td>
                  <td>
                    {f ? (
                      <div className="cell-firm">
                        <Link href={`${prefix}/prop-firms/${f.slug}`} className="firm-logo-sm">
                          <img src={f.logo} alt={f.name} />
                        </Link>
                        <div>
                          <Link href={`${prefix}/prop-firms/${f.slug}`} className="firm-name-link">{f.name}</Link>
                          {getBrandZh(f.slug) && <div className="brand-zh-sub">{getBrandZh(f.slug)}</div>}
                        </div>
                      </div>
                    ) : <span>{t.name}</span>}
                  </td>
                  <td style={{ color: "var(--orange)", fontWeight: 700 }}>${t.total.toLocaleString()}</td>
                  <td>{t.count.toLocaleString()}</td>
                  <td>${t.largest.toLocaleString()}</td>
                  <td>${t.avg.toLocaleString()}</td>
                  <td style={{ color: "var(--text-dim)", fontSize: 12 }}>{medianZh(t.median)}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--text-dim)", padding: 32 }}>
                {meta.label}板块排行数据接入中。
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
