import { Link } from "wouter";
import { findFirmZh } from "../data/firms.zh";
import { getBrandZh } from "../data/brandZh";
import { useCategoryFirms, useCategoryMeta } from "../contexts/CategoryContext";
import FirmLogo from "../components/FirmLogo";
import { SparkleIcon, StarRow } from "../components/icons";

export default function OffersPage() {
  const meta = useCategoryMeta();
  const firms = useCategoryFirms();
  const offers = firms.filter(f => f.promoPercent > 0).sort((a, b) => b.promoPercent - a.promoPercent);

  return (
    <main className="container">
      <div className="section-title"><SparkleIcon size={18} className="icon" /> {meta.label}专属优惠</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        浏览全部 {firms.length} 家入选自营公司的现行优惠活动，结账时输入下方优惠码即可享受折扣。
      </p>
      <div className="offers-carousel">
        {offers.map(f => {
          const zh = findFirmZh(f.slug);
          const desc = zh?.offerDescriptionZh || f.offerDescription;
          return (
            <Link
              key={f.slug}
              href={`/go/${f.slug}`}
              className="offer-card"
              title="跳转到官网 + 自动复制优惠码"
            >
              {f.isNew && <span className="offer-new-pill">新</span>}
              <div className="offer-logo"><FirmLogo src={f.logo} alt={f.name} /></div>
              <div className="offer-name">{f.name}{getBrandZh(f.slug) && <span className="brand-zh-sub">{getBrandZh(f.slug)}</span>}</div>
              <div className="offer-rating">
                {f.rating ? <><StarRow rating={f.rating} className="stars" /> <span>{f.rating}</span></> : <span>评价不足 10 条</span>}
              </div>
              <div className="offer-discount">{f.promoPercent}% 折扣</div>
              <div className="offer-code">优惠码 <strong>{f.promoCode}</strong></div>
              {desc && <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>{desc.slice(0, 50)}{desc.length > 50 && "…"}</div>}
            </Link>
          );
        })}
        {offers.length === 0 && (
          <div style={{ color: "var(--text-dim)", padding: 24 }}>{meta.label}板块当前没有进行中的优惠活动。</div>
        )}
      </div>
    </main>
  );
}
