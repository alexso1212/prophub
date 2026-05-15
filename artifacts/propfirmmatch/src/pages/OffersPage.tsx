import { Link } from "wouter";
import { firms } from "../data/firms";
import { findFirmZh } from "../data/firms.zh";
import { getBrandZh } from "../data/brandZh";

export default function OffersPage() {
  const offers = firms.filter(f => f.promoPercent > 0).sort((a,b) => b.promoPercent - a.promoPercent);
  return (
    <main className="container">
      <div className="section-title"><span className="icon">✨</span> 期货专属优惠</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        浏览全部 {firms.length} 家入选自营公司的现行优惠活动，结账时输入下方优惠码即可享受折扣。
      </p>
      <div className="offers-carousel">
        {offers.map(f => {
          const zh = findFirmZh(f.slug);
          const desc = zh?.offerDescriptionZh || f.offerDescription;
          return (
            <Link key={f.slug} href={`/futures/prop-firms/${f.slug}`} className="offer-card">
              {f.isNew && <span className="offer-new-pill">新</span>}
              <div className="offer-logo"><img src={f.logo} alt={f.name} /></div>
              <div className="offer-name">{f.name}{getBrandZh(f.slug) && <span className="brand-zh-sub">{getBrandZh(f.slug)}</span>}</div>
              <div className="offer-rating">
                {f.rating ? <><span className="stars">{"★".repeat(Math.round(f.rating))}{"☆".repeat(5-Math.round(f.rating))}</span> <span>{f.rating}</span></> : <span>评价不足 10 条</span>}
              </div>
              <div className="offer-discount">{f.promoPercent}% 折扣</div>
              <div className="offer-code">优惠码 <strong>{f.promoCode}</strong></div>
              {desc && <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>{desc.slice(0, 50)}{desc.length > 50 && "…"}</div>}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
