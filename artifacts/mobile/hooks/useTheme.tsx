import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Appearance } from "react-native";

export type ThemeMode = "light" | "dark" | "system" | "hc";
export type ResolvedTheme = "light" | "dark" | "hc";

const STORAGE_KEY = "pfm.theme.v1";

type ThemeContextValue = {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (m: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark",
  resolved: "dark",
  setMode: () => {},
});

function readSystemScheme(): "light" | "dark" {
  return Appearance.getColorScheme() === "light" ? "light" : "dark";
}

function resolve(mode: ThemeMode, system: "light" | "dark"): ResolvedTheme {
  return mode === "system" ? system : mode;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to dark to match the previous mobile look until we read storage.
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [system, setSystem] = useState<"light" | "dark">(readSystemScheme);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        if (
          raw === "light" ||
          raw === "dark" ||
          raw === "system" ||
          raw === "hc"
        ) {
          setModeState(raw);
        }
      })
      .catch(() => {});

    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystem(colorScheme === "light" ? "light" : "dark");
    });
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const resolved = resolve(mode, system);

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
