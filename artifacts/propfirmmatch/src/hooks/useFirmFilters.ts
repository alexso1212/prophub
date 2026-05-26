import { useCallback, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import type { Firm } from "../data/firms";

export type SortMode = "default" | "popular";

export interface FirmFilters {
  countries: string[];
  platforms: string[];
  minRating: number;
  maxTier: number;
  showNew: boolean;
  showPromo: boolean;
  showFav: boolean;
  sort: SortMode;
}

export const EMPTY_FILTERS: FirmFilters = {
  countries: [],
  platforms: [],
  minRating: 0,
  maxTier: 0,
  showNew: false,
  showPromo: false,
  showFav: false,
  sort: "default",
};

const PARAM_KEYS = [
  "country",
  "platform",
  "minRating",
  "maxTier",
  "showNew",
  "showPromo",
  "showFav",
  "sort",
] as const;

export function platformKey(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function parseList(v: string | null): string[] {
  if (!v) return [];
  return v
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

function parseFilters(search: string): FirmFilters {
  const p = new URLSearchParams(search);
  const minR = Number(p.get("minRating") || "0");
  const maxT = Number(p.get("maxTier") || "0");
  const sortRaw = p.get("sort");
  return {
    countries: parseList(p.get("country")).map(s => s.toUpperCase()),
    platforms: parseList(p.get("platform")).map(s => s.toLowerCase()),
    minRating: Number.isFinite(minR) && minR > 0 && minR <= 5 ? minR : 0,
    maxTier: Number.isFinite(maxT) && maxT > 0 ? maxT : 0,
    showNew: p.get("showNew") === "1",
    showPromo: p.get("showPromo") === "1",
    showFav: p.get("showFav") === "1",
    sort: sortRaw === "popular" ? "popular" : "default",
  };
}

function serializeFilters(f: FirmFilters, currentSearch: string): string {
  const p = new URLSearchParams(currentSearch);
  PARAM_KEYS.forEach(k => p.delete(k));
  if (f.countries.length) p.set("country", f.countries.join(","));
  if (f.platforms.length) p.set("platform", f.platforms.join(","));
  if (f.minRating > 0) p.set("minRating", String(f.minRating));
  if (f.maxTier > 0) p.set("maxTier", String(f.maxTier));
  if (f.showNew) p.set("showNew", "1");
  if (f.showPromo) p.set("showPromo", "1");
  if (f.showFav) p.set("showFav", "1");
  if (f.sort !== "default") p.set("sort", f.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function activeFilterCount(f: FirmFilters): number {
  let n = 0;
  if (f.countries.length) n += 1;
  if (f.platforms.length) n += 1;
  if (f.minRating > 0) n += 1;
  if (f.maxTier > 0) n += 1;
  if (f.showNew) n += 1;
  if (f.showPromo) n += 1;
  if (f.showFav) n += 1;
  return n;
}

// Parse "$750K", "$3.15M", "$3M" → number of thousands.
export function parseMaxAllocationK(s: string | undefined): number {
  if (!s) return 0;
  const m = s.trim().match(/\$?([\d.]+)\s*([KMkm])?/);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  if (!Number.isFinite(n)) return 0;
  const unit = (m[2] || "K").toUpperCase();
  return unit === "M" ? Math.round(n * 1000) : Math.round(n);
}

interface ApplyOpts {
  favorites: readonly string[];
  promoPercentFor: (slug: string) => number;
}

export function applyFilters(
  firms: Firm[],
  f: FirmFilters,
  opts: ApplyOpts
): Firm[] {
  let arr = firms.filter(firm => {
    if (f.countries.length) {
      const cc = (firm.countryCode || "").toUpperCase();
      if (!f.countries.includes(cc)) return false;
    }
    if (f.platforms.length) {
      const keys = (firm.platforms || []).map(p => platformKey(p.name));
      if (!f.platforms.some(k => keys.includes(k))) return false;
    }
    if (f.minRating > 0) {
      if (!firm.rating || firm.rating < f.minRating) return false;
    }
    if (f.maxTier > 0) {
      if (parseMaxAllocationK(firm.maxAllocation) < f.maxTier) return false;
    }
    if (f.showNew && !firm.isNew) return false;
    if (f.showPromo && opts.promoPercentFor(firm.slug) <= 0) return false;
    if (f.showFav && !opts.favorites.includes(firm.slug)) return false;
    return true;
  });
  if (f.sort === "popular") {
    arr = arr
      .slice()
      .sort(
        (a, b) =>
          (a.rank ?? a.popularRank ?? 99) - (b.rank ?? b.popularRank ?? 99)
      );
  }
  return arr;
}

export function uniqueCountries(firms: Firm[]): { code: string; label: string }[] {
  const map = new Map<string, string>();
  for (const f of firms) {
    const cc = (f.countryCode || "").toUpperCase();
    if (cc && !map.has(cc)) map.set(cc, f.country);
  }
  return Array.from(map.entries())
    .map(([code, label]) => ({ code, label }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

export function uniquePlatforms(firms: Firm[]): { key: string; label: string }[] {
  const map = new Map<string, string>();
  for (const f of firms) {
    for (const p of f.platforms || []) {
      const k = platformKey(p.name);
      if (k && !map.has(k)) map.set(k, p.name);
    }
  }
  return Array.from(map.entries())
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function useFirmFilters() {
  const search = useSearch();
  const [location, setLocation] = useLocation();

  const filters = useMemo(() => parseFilters(search), [search]);

  const setFilters = useCallback(
    (next: FirmFilters | ((prev: FirmFilters) => FirmFilters)) => {
      const current = parseFilters(window.location.search);
      const value = typeof next === "function" ? next(current) : next;
      const q = serializeFilters(value, window.location.search);
      const hash = window.location.hash || "";
      setLocation(location + q + hash, { replace: true });
    },
    [location, setLocation]
  );

  const reset = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, [setFilters]);

  return { filters, setFilters, reset, activeCount: activeFilterCount(filters) };
}
