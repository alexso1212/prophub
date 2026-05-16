import { useState } from "react";

interface Props {
  src?: string;
  alt: string;
  className?: string;
}

export default function FirmLogo({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  if (showFallback) {
    const initials = (alt || "?")
      .replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, "")
      .slice(0, 2)
      .toUpperCase() || "?";
    return (
      <span className={`firm-logo-fallback ${className ?? ""}`} aria-label={alt}>
        {initials}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
