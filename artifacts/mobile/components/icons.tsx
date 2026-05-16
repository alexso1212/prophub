import React from "react";
import Svg, {
  Circle,
  Ellipse,
  Path,
  Rect,
  type SvgProps,
} from "react-native-svg";

export type IconProps = {
  size?: number;
  color?: string;
  fillColor?: string;
  strokeWidth?: number;
  style?: SvgProps["style"];
};

function Base({
  size = 16,
  color = "currentColor",
  strokeWidth = 2,
  style,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {children}
    </Svg>
  );
}

export function SparkleIcon(p: IconProps) {
  const c = p.color ?? "currentColor";
  return (
    <Base {...p}>
      <Path
        d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z"
        fill={c}
        stroke="none"
      />
      <Path
        d="M19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14z"
        fill={c}
        stroke="none"
      />
    </Base>
  );
}

export function TrophyIcon(p: IconProps) {
  const c = p.color ?? "currentColor";
  return (
    <Base {...p}>
      <Path
        d="M7 4h10v2h3v3a4 4 0 0 1-4 4h-.18A5 5 0 0 1 13 16.9V19h3v2H8v-2h3v-2.1A5 5 0 0 1 7.18 13H7a4 4 0 0 1-4-4V6h3V4Zm-2 4v1a2 2 0 0 0 2 2V8H5Zm12 0v3a2 2 0 0 0 2-2V8h-2Z"
        fill={c}
        stroke="none"
      />
    </Base>
  );
}

export function GiftIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Rect x="3" y="8" width="18" height="4" rx="1" />
      <Path d="M5 12v9h14v-9" />
      <Path d="M12 8v13" />
      <Path d="M12 8s-2-5-5-5a2.5 2.5 0 0 0 0 5h5z" />
      <Path d="M12 8s2-5 5-5a2.5 2.5 0 0 1 0 5h-5z" />
    </Base>
  );
}

export function HeartIcon({
  filled = false,
  ...p
}: IconProps & { filled?: boolean }) {
  const c = p.color ?? "currentColor";
  return (
    <Base {...p}>
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={filled ? c : "none"}
      />
    </Base>
  );
}

export function SearchIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Circle cx="11" cy="11" r="7" />
      <Path d="M20 20l-3.5-3.5" />
    </Base>
  );
}

export function BookIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Path d="M4 4h11a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4z" />
      <Path d="M4 16a4 4 0 0 1 4-4h11" />
    </Base>
  );
}

export function NewsIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Rect x="3" y="4" width="14" height="16" rx="1.5" />
      <Path d="M17 8h3v9a3 3 0 0 1-3 3" />
      <Path d="M6 8h7M6 12h7M6 16h4" />
    </Base>
  );
}

export function BriefcaseIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Rect x="3" y="7" width="18" height="13" rx="2" />
      <Path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <Path d="M3 13h18" />
    </Base>
  );
}

export function CoinsIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Ellipse cx="9" cy="7" rx="6" ry="3" />
      <Path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3V7" />
      <Path d="M3 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
      <Ellipse cx="17" cy="13" rx="4" ry="2" />
      <Path d="M13 13v4c0 1.1 1.8 2 4 2s4-.9 4-2v-4" />
    </Base>
  );
}

export function FlameIcon(p: IconProps) {
  const c = p.color ?? "currentColor";
  return (
    <Base {...p}>
      <Path
        d="M12 2s4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 1-3s-3 2-3 6a6 6 0 1 0 12 0c0-5-6-11-6-11z"
        fill={c}
        stroke="none"
      />
    </Base>
  );
}

export function StarIcon({
  filled = true,
  ...p
}: IconProps & { filled?: boolean }) {
  const c = p.color ?? "currentColor";
  return (
    <Base {...p}>
      <Path
        d="M12 2.5l3 6.2 6.8 1-4.9 4.8 1.2 6.8L12 18l-6.1 3.3 1.2-6.8L2.2 9.7l6.8-1L12 2.5z"
        fill={filled ? c : "none"}
      />
    </Base>
  );
}

export function TvIcon(p: IconProps) {
  const c = p.color ?? "currentColor";
  return (
    <Base {...p}>
      <Rect x="2" y="5" width="20" height="13" rx="2" />
      <Path d="M8 21h8" />
      <Path d="M10 9l5 3-5 3z" fill={c} />
    </Base>
  );
}

export function ChartIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Path d="M3 17l5-6 4 4 6-9" />
      <Path d="M14 6h6v6" />
    </Base>
  );
}

export function BitcoinIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Circle cx="12" cy="12" r="10" />
      <Path
        d="M9 7v10M11 7v10M8 9h6.5a2.5 2.5 0 0 1 0 5H8M8 12h6.5a2.5 2.5 0 0 1 0 5H8"
        strokeWidth={1.6}
      />
    </Base>
  );
}

export function ArrowLeftIcon(p: IconProps) {
  return (
    <Base size={p.size ?? 18} {...p}>
      <Path d="M19 12H5M12 19l-7-7 7-7" />
    </Base>
  );
}

export function ArrowUpRightIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Path d="M7 17L17 7M9 7h8v8" />
    </Base>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <Base size={p.size ?? 14} {...p}>
      <Path d="M5 12.5l4.5 4.5L19 7.5" />
    </Base>
  );
}

export function CloseIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Path d="M6 6l12 12M18 6L6 18" />
    </Base>
  );
}

export function CopyIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Rect x="9" y="9" width="11" height="11" rx="2" />
      <Path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </Base>
  );
}

export function InboxIcon(p: IconProps) {
  return (
    <Base {...p}>
      <Path d="M3 13h4l2 3h6l2-3h4" />
      <Path d="M5 5h14l2 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6l2-8z" />
    </Base>
  );
}

export function StarRow({
  rating,
  size = 12,
  color,
}: {
  rating: number;
  size?: number;
  color?: string;
}) {
  const full = Math.round(rating);
  return (
    <React.Fragment>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} size={size} color={color} filled={n <= full} />
      ))}
    </React.Fragment>
  );
}

export const TROPHY_TINTS = {
  gold: { bg: "#3a2e0a", border: "#bf8a2e", text: "#fbd665" },
  silver: { bg: "#2a2d34", border: "#9aa3b2", text: "#dfe5f0" },
  bronze: { bg: "#3a221a", border: "#b56b3a", text: "#f0b489" },
} as const;
export type TrophyTier = keyof typeof TROPHY_TINTS;
