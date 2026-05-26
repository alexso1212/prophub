import colors, { type Palette } from "@/constants/colors";
import { useThemeMode } from "@/hooks/useTheme";

/**
 * Returns the design tokens for the currently active theme.
 *
 * Theme selection comes from the in-app ThemeProvider (设置 page),
 * which persists the user's choice to AsyncStorage and falls back to
 * the system appearance when set to "跟随系统".
 */
export function useColors(): Palette & { radius: number } {
  const { resolved } = useThemeMode();
  const palette =
    resolved === "hc"
      ? colors.hc
      : resolved === "light"
        ? colors.light
        : colors.dark;
  return { ...palette, radius: colors.radius };
}
