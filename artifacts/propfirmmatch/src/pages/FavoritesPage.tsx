import { Link } from "wouter";
import { getBrandZh } from "../data/brandZh";
import { useFavorites } from "../store/favs";
import { useCategory, useCategoryFirms } from "../contexts/CategoryContext";
import FirmLogo from "../components/FirmLogo";
import { HeartIcon, StarIcon } from "../components/icons";

export default function FavoritesPage() {
  const category = useCategory();
  const firms = useCategoryFirms();
  const prefix = `/${category}`;
  const { favs, toggle } = useFavorites();
  const favFirms = firms.filter(f => favs.includes(f.slug));

  return (
    <main className="container">
      <div className="section-title"><HeartIcon size={18} className="icon" /> 我的收藏</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        最多收藏 3 家公司方便对比。点击下方公司卡片右上角的爱心即可加入或移除收藏。
      </p>

      {favFirms.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", border: "1px dashed var(--border)", borderRadius: 12, marginBottom: 30 }}>
          <div style={{ marginBottom: 8, color: "var(--text-muted)" }}><HeartIcon size={48} /></div>
          <div style={{ color: "var(--text-dim)" }}>还没有收藏 —— 在下方任选最多 3 家公司。</div>
        </div>
      ) : (
        <div className="popular-row" style={{ marginBottom: 30 }}>
          {favFirms.map((f, i) => (
            <div key={f.slug} className="popular-card">
              <div className="trophy"><StarIcon size={20} /></div>
              <Link href={`${prefix}/prop-firms/${f.slug}`}>
                <div className="logo-wrap"><FirmLogo src={f.logo} alt={f.name} /></div>
                <div className="name">{f.name}{getBrandZh(f.slug) && <span className="brand-zh-sub">{getBrandZh(f.slug)}</span>}</div>
              </Link>
              <div className="meta">
                {f.rating && <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><StarIcon size={11} /> {f.rating}</span>}
                <span>{f.reviews} 条评价</span>
              </div>
              <button className="btn-outline" style={{ marginTop: 10 }} onClick={() => toggle(f.slug)}>移除收藏</button>
            </div>
          ))}
        </div>
      )}

      <div className="firms-count">全部公司 <span className="num">{firms.length}</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {firms.map(f => {
          const on = favs.includes(f.slug);
          return (
            <div key={f.slug} className="offer-card">
              <button
                onClick={() => toggle(f.slug)}
                aria-label={on ? "移除收藏" : "加入收藏"}
                style={{ position: "absolute", top: 10, right: 10, color: on ? "var(--orange)" : "var(--text-muted)", display: "inline-flex" }}
              >
                <HeartIcon size={18} filled={on} />
              </button>
              <Link href={`${prefix}/prop-firms/${f.slug}`}>
                <div className="offer-logo"><FirmLogo src={f.logo} alt={f.name} /></div>
                <div className="offer-name">{f.name}{getBrandZh(f.slug) && <span className="brand-zh-sub">{getBrandZh(f.slug)}</span>}</div>
                <div className="offer-rating">
                  {f.rating ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><StarIcon size={11} /> {f.rating}</span> : <span>新上线</span>}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
