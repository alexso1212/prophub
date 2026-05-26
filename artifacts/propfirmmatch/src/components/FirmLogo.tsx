import { useState, type CSSProperties } from "react";

interface Props {
  src?: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}

export default function FirmLogo({ src, alt, className, style }: Props) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  if (showFallback) {
    const initials = (alt || "?")
      .replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, "")
      .slice(0, 2)
      .toUpperCase() || "?";
    return (
      <span className={`firm-logo-fallback ${className ?? ""}`} aria-label={alt} style={style}>
        {initials}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
