import { Link } from "wouter";
import { firms } from "../data/firms";

export default function BestSellersPage() {
  const ranked = [...firms]
    .filter(f => f.popularRank)
    .sort((a, b) => (a.popularRank ?? 99) - (b.popularRank ?? 99));

  return (
    <main className="container">
      <div className="section-title">🏆 热销榜</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        本月交易员购买最多的挑战赛排行，按 Prop Firm Match 销售量排序。
      </p>
      <div className="popular-row" style={{ marginBottom: 24 }}>
        {ranked.slice(0, 3).map((f, i) => {
          const trophy = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
          return (
            <div key={f.slug} className="popular-card">
              <div className="trophy">{trophy}</div>
              <Link href={`/futures/prop-firms/${f.slug}`}>
                <div className="logo-wrap"><img src={f.logo} alt={f.name} /></div>
                <div className="name">{f.name}</div>
              </Link>
              <div className="meta">
                {f.rating && <span>★ {f.rating}</span>}
                <span>{f.reviews} 条评价</span>
              </div>
              {f.promoPercent > 0 && <div className="discount">{f.promoPercent}% 折扣 — {f.promoCode}</div>}
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
              <th>评分</th>
              <th>热门挑战</th>
              <th>价格</th>
              <th>优惠</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((f, i) => {
              const top = f.challenges?.[0];
              return (
                <tr key={f.slug}>
                  <td><span className="rank-num">{i + 1}</span></td>
                  <td>
                    <div className="cell-firm">
                      <Link href={`/futures/prop-firms/${f.slug}`} className="firm-logo-sm">
                        <img src={f.logo} alt={f.name} />
                      </Link>
                      <Link href={`/futures/prop-firms/${f.slug}`} className="firm-name-link">{f.name}</Link>
                    </div>
                  </td>
                  <td><span className="num">{f.rating ?? "—"}</span></td>
                  <td>{top?.name || "—"}</td>
                  <td style={{ color: "var(--orange)", fontWeight: 700 }}>{top?.price || "—"}</td>
                  <td>{f.promoPercent > 0 ? <span className="promo-discount">{f.promoPercent}% 折扣</span> : "—"}</td>
                  <td><Link href={`/futures/prop-firms/${f.slug}`} className="btn-firm">查看</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
