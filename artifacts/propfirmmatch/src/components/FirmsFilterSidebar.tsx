import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import type { Firm } from "../data/firms";
import { countryZh } from "../data/i18nZh";
import {
  activeFilterCount,
  EMPTY_FILTERS,
  uniqueCountries,
  uniquePlatforms,
  type FirmFilters,
} from "../hooks/useFirmFilters";
import { useCategory, CATEGORY_META, type Category } from "../contexts/CategoryContext";
import { CloseIcon, StarIcon, HeartIcon } from "./icons";

const ASSET_CLASSES: { value: Category; label: string }[] = [
  { value: "futures", label: "期货" },
  { value: "forex", label: "外汇" },
  { value: "crypto", label: "加密" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  firms: Firm[];
  value: FirmFilters;
  onApply: (next: FirmFilters) => void;
}

const TIERS = [
  { value: 25, label: "$25K+" },
  { value: 50, label: "$50K+" },
  { value: 100, label: "$100K+" },
  { value: 150, label: "$150K+" },
  { value: 500, label: "$500K+" },
];

export default function FirmsFilterSidebar({ open, onClose, firms, value, onApply }: Props) {
  const [draft, setDraft] = useState<FirmFilters>(value);
  const category = useCategory();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const countries = useMemo(() => uniqueCountries(firms), [firms]);
  const platforms = useMemo(() => uniquePlatforms(firms), [firms]);

  const toggleIn = (key: "countries" | "platforms", v: string) =>
    setDraft(d => {
      const arr = d[key];
      const next = arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
      return { ...d, [key]: next };
    });

  const count = activeFilterCount(draft);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`firm-filter-overlay ${open ? "is-open" : ""}`}
      onClick={onClose}
      aria-hidden={!open}
    >
      <aside
        className={`firm-filter-panel ${open ? "is-open" : ""}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="筛选公司"
      >
        <header className="firm-filter-head">
          <h3>筛选</h3>
          <button
            type="button"
            className="firm-filter-close"
            aria-label="关闭筛选"
            onClick={onClose}
          >
            <CloseIcon size={16} />
          </button>
        </header>

        <div className="firm-filter-body">
          <section className="ff-group">
            <h4>资产类别</h4>
            <div className="ff-chips">
              {ASSET_CLASSES.map(a => (
                <button
                  key={a.value}
                  type="button"
                  className={`ff-chip ${category === a.value ? "is-active" : ""}`}
                  onClick={() => {
                    if (a.value === category) return;
                    onClose();
                    setLocation(CATEGORY_META[a.value].pathPrefix);
                  }}
                  aria-pressed={category === a.value}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <p className="ff-hint">切换到其他资产类别会跳转到对应的公司列表页。</p>
          </section>

          <section className="ff-group">
            <h4>显示</h4>
            <label className="ff-check">
              <input
                type="checkbox"
                checked={draft.showNew}
                onChange={e => setDraft(d => ({ ...d, showNew: e.target.checked }))}
              />
              <span>仅显示新公司</span>
            </label>
            <label className="ff-check">
              <input
                type="checkbox"
                checked={draft.showPromo}
                onChange={e => setDraft(d => ({ ...d, showPromo: e.target.checked }))}
              />
              <span>仅显示有优惠</span>
            </label>
            <label className="ff-check">
              <input
                type="checkbox"
                checked={draft.showFav}
                onChange={e => setDraft(d => ({ ...d, showFav: e.target.checked }))}
              />
              <span><HeartIcon size={12} /> 仅显示我的收藏</span>
            </label>
          </section>

          <section className="ff-group">
            <h4>最低评分</h4>
            <div className="ff-stars">
              {[5, 4, 3, 2, 1].map(n => (
                <button
                  key={n}
                  type="button"
                  className={`ff-star-btn ${draft.minRating === n ? "is-active" : ""}`}
                  onClick={() =>
                    setDraft(d => ({ ...d, minRating: d.minRating === n ? 0 : n }))
                  }
                  aria-pressed={draft.minRating === n}
                >
                  {Array.from({ length: n }).map((_, i) => (
                    <StarIcon key={i} size={12} />
                  ))}
                  <span className="ff-star-label">{n}+</span>
                </button>
              ))}
            </div>
          </section>

          <section className="ff-group">
            <h4>最大资金</h4>
            <div className="ff-chips">
              {TIERS.map(t => (
                <button
                  key={t.value}
                  type="button"
                  className={`ff-chip ${draft.maxTier === t.value ? "is-active" : ""}`}
                  onClick={() =>
                    setDraft(d => ({ ...d, maxTier: d.maxTier === t.value ? 0 : t.value }))
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          <section className="ff-group">
            <h4>国家 / 地区 <span className="ff-count">{draft.countries.length || ""}</span></h4>
            <div className="ff-chips">
              {countries.map(c => (
                <button
                  key={c.code}
                  type="button"
                  className={`ff-chip ${draft.countries.includes(c.code) ? "is-active" : ""}`}
                  onClick={() => toggleIn("countries", c.code)}
                >
                  <img
                    src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                    alt=""
                    className="ff-flag"
                  />
                  {countryZh(c.code, c.label)}
                </button>
              ))}
            </div>
          </section>

          <section className="ff-group">
            <h4>交易平台 <span className="ff-count">{draft.platforms.length || ""}</span></h4>
            <div className="ff-chips">
              {platforms.map(p => (
                <button
                  key={p.key}
                  type="button"
                  className={`ff-chip ${draft.platforms.includes(p.key) ? "is-active" : ""}`}
                  onClick={() => toggleIn("platforms", p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <footer className="firm-filter-foot">
          <button
            type="button"
            className="ff-btn ff-btn-ghost"
            onClick={() => setDraft({ ...EMPTY_FILTERS, sort: draft.sort })}
          >
            重置
          </button>
          <button
            type="button"
            className="ff-btn ff-btn-primary"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            {count > 0 ? `应用 ${count} 个筛选` : "应用"}
          </button>
        </footer>
      </aside>
    </div>,
    document.body
  );
}
