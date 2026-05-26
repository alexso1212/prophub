import { Link } from "wouter";
import type { ReactNode } from "react";
import { useCategory } from "../../contexts/CategoryContext";
import { findFirm } from "../../data/firms";

export function trackKgCta(track: string) {
  if (typeof window === "undefined") return;
  try {
    const key = "kg_cta_clicks";
    const cur = JSON.parse(localStorage.getItem(key) || "{}");
    cur[track] = (cur[track] ?? 0) + 1;
    localStorage.setItem(key, JSON.stringify(cur));
  } catch {
    /* ignore */
  }
}

interface TrackedLinkProps {
  href: string;
  track: string;
  className?: string;
  children: ReactNode;
}

export function TrackedLink({ href, track, className, children }: TrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      data-kg-track={track}
      onClick={() => trackKgCta(track)}
    >
      {children}
    </Link>
  );
}

interface Props {
  firmSlug: string;
  label?: string;
  track: string;
}

export default function Cta({ firmSlug, label, track }: Props) {
  const cat = useCategory();
  const firm = findFirm(firmSlug);
  if (!firm) return null;
  return (
    <TrackedLink
      href={`/${cat}/prop-firms/${firm.slug}`}
      track={track}
      className="kg-cta-btn"
    >
      {label ?? `去 ${firm.name} 用这个方案 →`}
    </TrackedLink>
  );
}
