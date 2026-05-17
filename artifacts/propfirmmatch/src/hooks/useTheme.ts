import { useEffect, useState, useCallback } from "react";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "prophub-theme";

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  return "dark";
}

export function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  return mode;
}

export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(mode);
  document.documentElement.setAttribute("data-theme", resolved);
}

const THEME_EVENT = "prophub-theme-change";

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(() => getStoredTheme());

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    applyTheme(next);
    try {
      window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_EVENT, { detail: next }));
    } catch {}
  }, []);

  useEffect(() => {
    applyTheme(mode);
    const onExternalChange = (e: Event) => {
      const next = (e as CustomEvent<ThemeMode>).detail;
      if (next === "light" || next === "dark" || next === "system") {
        setModeState(next);
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = e.newValue;
      if (next === "light" || next === "dark" || next === "system") {
        setModeState(next);
      }
    };
    window.addEventListener(THEME_EVENT, onExternalChange);
    window.addEventListener("storage", onStorage);

    let cleanupMq: (() => void) | undefined;
    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: light)");
      const handler = () => applyTheme("system");
      if (mq.addEventListener) {
        mq.addEventListener("change", handler);
        cleanupMq = () => mq.removeEventListener("change", handler);
      } else if ((mq as MediaQueryList & { addListener?: (cb: () => void) => void }).addListener) {
        (mq as MediaQueryList & { addListener: (cb: () => void) => void }).addListener(handler);
        cleanupMq = () => (mq as MediaQueryList & { removeListener: (cb: () => void) => void }).removeListener(handler);
      }
    }

    return () => {
      window.removeEventListener(THEME_EVENT, onExternalChange);
      window.removeEventListener("storage", onStorage);
      cleanupMq?.();
    };
  }, [mode]);

  return { mode, setMode };
}
