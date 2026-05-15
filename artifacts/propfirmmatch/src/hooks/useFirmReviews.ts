import { useCallback, useEffect, useState } from "react";
import type { UserReview } from "../components/ReviewModal";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export function useFirmReviews(slug: string | undefined) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/firms/${slug}/reviews`);
      if (res.ok) {
        const data: UserReview[] = await res.json();
        setReviews(data);
      }
    } catch {}
    finally { setLoading(false); }
  }, [slug]);

  useEffect(() => { refresh(); }, [refresh]);

  return { reviews, loading, refresh };
}

export function formatRelativeZh(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.round((Date.now() - then) / 1000);
  if (diff < 60) return "刚刚";
  const mins = Math.round(diff / 60);
  if (mins < 60) return `${mins} 分钟前`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} 小时前`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days} 天前`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} 个月前`;
  return `${Math.round(days / 365)} 年前`;
}
