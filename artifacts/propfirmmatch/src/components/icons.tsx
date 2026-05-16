import type { ReactNode } from "react";

export interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

function Svg({ size = 16, children, className, style, color, onClick }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color ?? "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </svg>
  );
}

export function SparkleIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" fill="currentColor" stroke="none" />
      <path d="M19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14z" fill="currentColor" stroke="none" />
    </Svg>
  );
}
export function TrophyIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7 4h10v2h3v3a4 4 0 0 1-4 4h-.18A5 5 0 0 1 13 16.9V19h3v2H8v-2h3v-2.1A5 5 0 0 1 7.18 13H7a4 4 0 0 1-4-4V6h3V4Zm-2 4v1a2 2 0 0 0 2 2V8H5Zm12 0v3a2 2 0 0 0 2-2V8h-2Z" fill="currentColor" stroke="none" />
    </Svg>
  );
}
export function GiftIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M5 12v9h14v-9" />
      <path d="M12 8v13" />
      <path d="M12 8s-2-5-5-5a2.5 2.5 0 0 0 0 5h5z" />
      <path d="M12 8s2-5 5-5a2.5 2.5 0 0 1 0 5h-5z" />
    </Svg>
  );
}
export function HeartIcon({ filled = false, ...p }: IconProps & { filled?: boolean }) {
  return (
    <Svg {...p}>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={filled ? "currentColor" : "none"}
      />
    </Svg>
  );
}
export function SettingsIcon(p: IconProps) {
  return (
    <Svg size={p.size ?? 14} {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.3l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.7 7l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </Svg>
  );
}
export function SearchIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </Svg>
  );
}
export function BookIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 4h11a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4z" />
      <path d="M4 16a4 4 0 0 1 4-4h11" />
    </Svg>
  );
}
export function NewsIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="4" width="14" height="16" rx="1.5" />
      <path d="M17 8h3v9a3 3 0 0 1-3 3" />
      <path d="M6 8h7M6 12h7M6 16h4" />
    </Svg>
  );
}
export function BriefcaseIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </Svg>
  );
}
export function CoinsIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <ellipse cx="9" cy="7" rx="6" ry="3" />
      <path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3V7" />
      <path d="M3 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
      <ellipse cx="17" cy="13" rx="4" ry="2" />
      <path d="M13 13v4c0 1.1 1.8 2 4 2s4-.9 4-2v-4" />
    </Svg>
  );
}
export function FlameIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 2s4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 1-3s-3 2-3 6a6 6 0 1 0 12 0c0-5-6-11-6-11z" fill="currentColor" stroke="none" />
    </Svg>
  );
}
export function ClipboardIcon(p: IconProps) {
  return (
    <Svg size={p.size ?? 14} {...p}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 10h6M9 14h6M9 18h4" />
    </Svg>
  );
}
export function StarIcon({ filled = true, ...p }: IconProps & { filled?: boolean }) {
  return (
    <Svg {...p}>
      <path
        d="M12 2.5l3 6.2 6.8 1-4.9 4.8 1.2 6.8L12 18l-6.1 3.3 1.2-6.8L2.2 9.7l6.8-1L12 2.5z"
        fill={filled ? "currentColor" : "none"}
      />
    </Svg>
  );
}

export function StarRow({ rating, size = 12, className }: { rating: number; size?: number; className?: string }) {
  const full = Math.round(rating);
  return (
    <span className={`star-row ${className ?? ""}`} aria-label={`${rating} 星`}>
      {[1, 2, 3, 4, 5].map(n => (
        <StarIcon key={n} size={size} filled={n <= full} />
      ))}
    </span>
  );
}
export function TvIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="2" y="5" width="20" height="13" rx="2" />
      <path d="M8 21h8" />
      <path d="M10 9l5 3-5 3z" fill="currentColor" />
    </Svg>
  );
}
export function ChartIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3 17l5-6 4 4 6-9" />
      <path d="M14 6h6v6" />
    </Svg>
  );
}
export function DollarSwapIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3 8h13l-3-3" />
      <path d="M21 16H8l3 3" />
    </Svg>
  );
}
export function BitcoinIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 7v10M11 7v10M8 9h6.5a2.5 2.5 0 0 1 0 5H8M8 12h6.5a2.5 2.5 0 0 1 0 5H8" strokeWidth="1.6" />
    </Svg>
  );
}
export function ArrowLeftIcon(p: IconProps) {
  return (
    <Svg size={p.size ?? 18} {...p}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </Svg>
  );
}
export function CheckIcon(p: IconProps) {
  return (
    <Svg size={p.size ?? 14} {...p}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Svg>
  );
}
export function CloseIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}
export function PlayIcon(p: IconProps) {
  return (
    <Svg size={p.size ?? 24} {...p}>
      <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" opacity="0.18" />
      <path d="M10 8.5v7l6-3.5z" fill="currentColor" stroke="none" />
    </Svg>
  );
}
export function PromoIcon(p: IconProps) {
  return (
    <Svg size={p.size ?? 14} {...p}>
      <path d="M20.6 11.4l-9-9A2 2 0 0 0 10.2 2H4a2 2 0 0 0-2 2v6.2a2 2 0 0 0 .6 1.4l9 9a2 2 0 0 0 2.8 0l6.2-6.2a2 2 0 0 0 0-2.8z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
    </Svg>
  );
}
export function ChevronRightIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M9 6l6 6-6 6" />
    </Svg>
  );
}
export function ChevronDownIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  );
}
export function LightbulbIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z" />
    </Svg>
  );
}
export function WalletIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3 7a2 2 0 0 1 2-2h12v4" />
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <circle cx="17" cy="13.5" r="1.4" fill="currentColor" />
    </Svg>
  );
}
export function HandshakeIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3 13l4-4 3 3 4-4 4 4 3-3" />
      <path d="M9 14l2 2 3-3 3 3" />
    </Svg>
  );
}
export function ShieldIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </Svg>
  );
}
export function BalanceIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3v18M5 21h14" />
      <path d="M12 6l-6 2 3 6a3 3 0 0 0 6 0l3-6-6-2z" />
    </Svg>
  );
}
export function PinIcon(p: IconProps) {
  return (
    <Svg size={p.size ?? 14} {...p}>
      <path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </Svg>
  );
}
