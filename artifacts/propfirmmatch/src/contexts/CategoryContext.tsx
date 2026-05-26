import { createContext, useContext, ReactNode } from "react";
import { firms, type Firm } from "../data/firms";
import { firmsForex } from "../data/firmsForex";
import { firmsCrypto } from "../data/firmsCrypto";

export type Category = "forex" | "futures" | "crypto";

const CategoryCtx = createContext<Category>("futures");

export function CategoryProvider({ value, children }: { value: Category; children: ReactNode }) {
  return <CategoryCtx.Provider value={value}>{children}</CategoryCtx.Provider>;
}

export function useCategory(): Category {
  return useContext(CategoryCtx);
}

export function firmsForCategory(c: Category): Firm[] {
  if (c === "forex") return firmsForex;
  if (c === "crypto") return firmsCrypto;
  return firms;
}

export function useCategoryFirms(): Firm[] {
  return firmsForCategory(useCategory());
}

export function findFirmInCategory(slug: string, c: Category): Firm | undefined {
  return firmsForCategory(c).find(f => f.slug === slug);
}

export function findFirmAnyCategory(slug: string): { firm: Firm; category: Category } | undefined {
  for (const c of ["futures", "forex", "crypto"] as const) {
    const f = firmsForCategory(c).find(x => x.slug === slug);
    if (f) return { firm: f, category: c };
  }
  return undefined;
}

export interface CategoryMeta {
  label: string;          // "外汇" / "期货" / "加密"
  shortLabel: string;     // for badges
  icon: string;
  assetWord: string;      // "货币对" / "期货合约" / "加密资产"
  pathPrefix: string;     // "/forex" etc
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  forex:   { label: "外汇", shortLabel: "外汇", icon: "forex", assetWord: "货币对",   pathPrefix: "/forex" },
  futures: { label: "期货", shortLabel: "期货", icon: "futures", assetWord: "期货合约", pathPrefix: "/futures" },
  crypto:  { label: "加密", shortLabel: "加密", icon: "crypto",  assetWord: "加密资产", pathPrefix: "/crypto" },
};

export function useCategoryMeta(): CategoryMeta {
  return CATEGORY_META[useCategory()];
}
