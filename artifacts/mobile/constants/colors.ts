const radius = 12;

const dark = {
  text: "#ffffff",
  tint: "#ff6a3d",

  background: "#0b0a14",
  foreground: "#ffffff",

  card: "#14112099",
  cardSolid: "#1a1730",
  cardForeground: "#ffffff",

  primary: "#ff6a3d",
  primaryForeground: "#ffffff",

  secondary: "#1a1730",
  secondaryForeground: "#ffffff",

  muted: "#1a1730",
  mutedForeground: "#a39db8",
  textMuted: "#6e6886",

  accent: "#a855f7",
  accentForeground: "#ffffff",

  destructive: "#ef4444",
  destructiveForeground: "#ffffff",

  border: "rgba(255,255,255,0.08)",
  cardBorder: "rgba(255,255,255,0.06)",
  input: "rgba(255,255,255,0.08)",

  orange: "#ff6a3d",
  orange2: "#ff8a5b",
  purple: "#a855f7",
  purple2: "#7b3ff2",
  pink: "#ff4f9a",
  green: "#10b981",
  star: "#fbbf24",

  // Surface overlays used for layered cards / hover states
  surface: "rgba(255,255,255,0.04)",
  surfaceStrong: "rgba(255,255,255,0.08)",
  surfaceMuted: "rgba(255,255,255,0.025)",
  surfaceSubtle: "rgba(255,255,255,0.02)",
  surfaceCollapsed: "rgba(255,255,255,0.03)",

  overlay: "rgba(8,6,16,0.78)",
  modalSurface: "#100c1a",
  tipSurface: "#221b35",

  accentSoftBg: "rgba(255,106,61,0.12)",
  accentSoftBgStrong: "rgba(255,106,61,0.18)",
  accentSoftBgWeak: "rgba(255,106,61,0.10)",
  accentSoftBorder: "rgba(255,106,61,0.45)",

  purpleSoftBg: "rgba(168,85,247,0.10)",
  purpleSoftBorder: "rgba(168,85,247,0.45)",

  logoBg: "rgba(255,255,255,0.06)",
  trunk: "rgba(255,255,255,0.14)",
  leafBorder: "rgba(255,255,255,0.08)",

  introGradient: ["rgba(255,106,61,0.18)", "rgba(168,85,247,0.18)"] as [string, string],
};

const light: typeof dark = {
  text: "#1a1535",
  tint: "#7c3aed",

  background: "#f6f5fb",
  foreground: "#1a1535",

  card: "#ffffffcc",
  cardSolid: "#ffffff",
  cardForeground: "#1a1535",

  primary: "#7c3aed",
  primaryForeground: "#ffffff",

  secondary: "#f0eef7",
  secondaryForeground: "#1a1535",

  muted: "#f0eef7",
  mutedForeground: "#4b4566",
  textMuted: "#6b6688",

  accent: "#7c3aed",
  accentForeground: "#ffffff",

  destructive: "#dc2626",
  destructiveForeground: "#ffffff",

  border: "rgba(15,12,40,0.10)",
  cardBorder: "rgba(15,12,40,0.08)",
  input: "rgba(15,12,40,0.08)",

  // In light theme the brand uses purple in place of the dark-only orange.
  orange: "#7c3aed",
  orange2: "#6d28d9",
  purple: "#7c3aed",
  purple2: "#5b21b6",
  pink: "#a855f7",
  green: "#047857",
  star: "#d97706",

  surface: "rgba(15,12,40,0.04)",
  surfaceStrong: "rgba(15,12,40,0.08)",
  surfaceMuted: "rgba(15,12,40,0.025)",
  surfaceSubtle: "rgba(15,12,40,0.02)",
  surfaceCollapsed: "rgba(15,12,40,0.03)",

  overlay: "rgba(15,12,40,0.45)",
  modalSurface: "#ffffff",
  tipSurface: "#f4f1fb",

  accentSoftBg: "rgba(124,58,237,0.12)",
  accentSoftBgStrong: "rgba(124,58,237,0.18)",
  accentSoftBgWeak: "rgba(124,58,237,0.08)",
  accentSoftBorder: "rgba(124,58,237,0.45)",

  purpleSoftBg: "rgba(124,58,237,0.10)",
  purpleSoftBorder: "rgba(124,58,237,0.45)",

  logoBg: "rgba(15,12,40,0.04)",
  trunk: "rgba(15,12,40,0.14)",
  leafBorder: "rgba(15,12,40,0.08)",

  introGradient: ["rgba(124,58,237,0.14)", "rgba(168,85,247,0.14)"] as [string, string],
};

const colors = { light, dark, radius };

export type Palette = typeof dark;
export default colors;
