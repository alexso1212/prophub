import { useEffect, useRef, useState } from "react";
import type { Giveaway } from "../data/giveaways";

interface Props {
  giveaway: Giveaway;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export default function GiveawaySignupModal({ giveaway, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("请输入有效的邮箱地址");
      return;
    }
    if (!agree) {
      setError("请勾选同意活动条款");
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      onSuccess(trimmed);
      setSubmitting(false);
    }, 450);
  }

  return (
    <div className="gw-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="gw-modal-title" onClick={onClose}>
      <div className="gw-modal" onClick={e => e.stopPropagation()}>
        <button className="gw-modal-close" onClick={onClose} aria-label="关闭">×</button>
        <div className="gw-modal-tag">免费报名</div>
        <h3 id="gw-modal-title" className="gw-modal-title">{giveaway.title}</h3>
        <div className="gw-modal-prize">奖品：<strong>{giveaway.prize}</strong></div>
        <form onSubmit={submit} noValidate>
          <label className="gw-modal-label" htmlFor="gw-email">邮箱（用于开奖通知）</label>
          <input
            id="gw-email"
            ref={inputRef}
            className="gw-modal-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <label className="gw-modal-check">
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
            <span>我已阅读并同意活动规则，授权 propfirmmatch 在开奖后通过邮件联系我。</span>
          </label>
          <div className="gw-modal-rules">
            {giveaway.rules.slice(0, 3).map((r, i) => <div key={i}>· {r}</div>)}
          </div>
          {error && <div className="gw-modal-error">{error}</div>}
          <div className="gw-modal-actions">
            <button type="button" className="gw-btn-ghost" onClick={onClose}>取消</button>
            <button type="submit" className="gw-btn-primary" disabled={submitting}>
              {submitting ? "提交中…" : "确认报名"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
