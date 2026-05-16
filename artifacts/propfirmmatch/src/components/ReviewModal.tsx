import { useEffect, useState } from "react";
import { useUser } from "@clerk/react";
import { StarIcon } from "./icons";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export interface UserReview {
  id: number;
  slug: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  slug: string;
  firmName: string;
  open: boolean;
  onClose: () => void;
  existing: UserReview | null;
  onSaved: (review: UserReview) => void;
  onDeleted: (id: number) => void;
}

export default function ReviewModal({ slug, firmName, open, onClose, existing, onSaved, onDeleted }: Props) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    if (open) {
      setRating(existing?.rating ?? 5);
      setTitle(existing?.title ?? "");
      setBody(existing?.body ?? "");
      setError(null);
    }
  }, [open, existing]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const trimmedTitle = title.trim();
  const trimmedBody = body.trim();
  const valid =
    rating >= 1 && rating <= 5 &&
    trimmedTitle.length >= 2 && trimmedTitle.length <= 120 &&
    trimmedBody.length >= 20 && trimmedBody.length <= 4000;

  const submit = async () => {
    if (!valid || saving) return;
    setSaving(true);
    setError(null);
    try {
      const url = existing
        ? `${API_BASE}/api/firms/${slug}/reviews/${existing.id}`
        : `${API_BASE}/api/firms/${slug}/reviews`;
      const res = await fetch(url, {
        method: existing ? "PATCH" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, title: trimmedTitle, body: trimmedBody }),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg?.error || "提交失败，请稍后重试");
      }
      const saved: UserReview = await res.json();
      onSaved(saved);
      onClose();
    } catch (e: any) {
      setError(e?.message || "提交失败");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!existing || saving) return;
    if (!confirm("确定要删除这条评价吗？")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/firms/${slug}/reviews/${existing.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("删除失败");
      onDeleted(existing.id);
      onClose();
    } catch (e: any) {
      setError(e?.message || "删除失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="review-modal-backdrop" onClick={onClose}>
      <div className="review-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <div className="rm-head">
          <h3>{existing ? "编辑你的评价" : "为 " + firmName + " 写一条评价"}</h3>
          <button className="rm-close" onClick={onClose} aria-label="关闭">×</button>
        </div>

        <div className="rm-body">
          <label className="rm-label">星级评分</label>
          <div className="rm-stars" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                className={`rm-star${(hover || rating) >= n ? " is-on" : ""}`}
                onMouseEnter={() => setHover(n)}
                onClick={() => setRating(n)}
                aria-label={`${n} 星`}
              ><StarIcon size={20} filled={(hover || rating) >= n} /></button>
            ))}
            <span className="rm-rating-num">{rating}/5</span>
          </div>

          <label className="rm-label" htmlFor="rm-title">标题</label>
          <input
            id="rm-title"
            className="rm-input"
            value={title}
            maxLength={120}
            placeholder="一句话总结你的体验"
            onChange={e => setTitle(e.target.value)}
          />

          <label className="rm-label" htmlFor="rm-body">详细评价（至少 20 字）</label>
          <textarea
            id="rm-body"
            className="rm-textarea"
            value={body}
            maxLength={4000}
            rows={6}
            placeholder="分享你与该公司交易的真实感受：规则合理度、客户服务、出金速度等"
            onChange={e => setBody(e.target.value)}
          />
          <div className="rm-counter">{trimmedBody.length} / 4000</div>

          {error && <div className="rm-error">{error}</div>}
        </div>

        <div className="rm-foot">
          {existing && (
            <button type="button" className="rm-btn rm-danger" onClick={remove} disabled={saving}>
              删除
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button type="button" className="rm-btn rm-ghost" onClick={onClose} disabled={saving}>
            取消
          </button>
          <button type="button" className="rm-btn rm-primary" onClick={submit} disabled={!valid || saving}>
            {saving ? "保存中…" : existing ? "更新" : "提交"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface TriggerProps {
  slug: string;
  firmName: string;
  className?: string;
  onReviewsChanged?: () => void;
}

export function ReviewButton(props: TriggerProps) {
  const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
  if (!clerkEnabled) return null;
  return <ReviewButtonInner {...props} />;
}

function ReviewButtonInner({ slug, firmName, className, onReviewsChanged }: TriggerProps) {
  const { isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const [existing, setExisting] = useState<UserReview | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMine = async () => {
    if (!isSignedIn) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/firms/${slug}/reviews/mine`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setExisting(data);
      }
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (isSignedIn) fetchMine();
    else setExisting(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, slug]);

  const handleClick = async () => {
    if (!isSignedIn) {
      const here = window.location.pathname + window.location.search;
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      window.location.href = `${base}/sign-in?redirect=${encodeURIComponent(here)}`;
      return;
    }
    await fetchMine();
    setOpen(true);
  };

  return (
    <>
      <button type="button" className={className ?? "btn-outline"} onClick={handleClick} disabled={loading}>
        {existing ? "编辑评价" : "写一条评价"}
      </button>
      <ReviewModal
        slug={slug}
        firmName={firmName}
        open={open}
        onClose={() => setOpen(false)}
        existing={existing}
        onSaved={(r) => { setExisting(r); onReviewsChanged?.(); }}
        onDeleted={() => { setExisting(null); onReviewsChanged?.(); }}
      />
    </>
  );
}
