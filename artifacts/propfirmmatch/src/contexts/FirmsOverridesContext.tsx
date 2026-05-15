import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface FirmOverride {
  slug: string;
  affiliateUrl: string | null;
  promoCode: string | null;
  promoPercent: number | null;
  promoLabel: string | null;
}

type OverridesMap = Record<string, FirmOverride>;

const FirmsOverridesContext = createContext<OverridesMap>({});

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export function FirmsOverridesProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<OverridesMap>({});

  useEffect(() => {
    fetch(`${API_BASE}/api/firms-overrides`)
      .then((r) => r.json())
      .then((data) => setOverrides(data))
      .catch(() => {});
  }, []);

  return (
    <FirmsOverridesContext.Provider value={overrides}>
      {children}
    </FirmsOverridesContext.Provider>
  );
}

export function useFirmsOverrides() {
  return useContext(FirmsOverridesContext);
}

export function useFirmOverride(slug: string): FirmOverride | undefined {
  const overrides = useContext(FirmsOverridesContext);
  return overrides[slug];
}
