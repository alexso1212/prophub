import { useEffect, useState, useSyncExternalStore } from "react";

const KEY = "pfm-favorites";
const MAX = 3;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

let state: string[] = read();
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function write(next: string[]) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* noop */
  }
  emit();
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", e => {
    if (e.key === KEY) {
      state = read();
      emit();
    }
  });
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => state;
const getServerSnapshot = () => [] as string[];

export function useFavorites() {
  const favs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return {
    favs: hydrated ? favs : [],
    has: (slug: string) => (hydrated ? favs.includes(slug) : false),
    toggle: (slug: string) => {
      const cur = state;
      const next = cur.includes(slug)
        ? cur.filter(s => s !== slug)
        : [...cur, slug].slice(0, MAX);
      write(next);
    },
    remove: (slug: string) => write(state.filter(s => s !== slug)),
    max: MAX,
  };
}
