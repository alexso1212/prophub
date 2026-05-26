import { useEffect, useRef, useState } from "react";
import type { Job } from "../data/jobs";

interface Props {
  job: Job;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export default function JobApplyModal({ job, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState("");
  const [pitch, setPitch] = useState("");
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
    if (!name.trim()) return setError("请填写姓名");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("请输入有效的邮箱地址");
    if (!/^https?:\/\/\S+/i.test(resume.trim())) return setError("请粘贴可访问的简历链接（http / https）");
    setSubmitting(true);
    window.setTimeout(() => {
      onSuccess(email.trim());
      setSubmitting(false);
    }, 500);
  }

  return (
    <div className="gw-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="apply-title" onClick={onClose}>
      <div className="gw-modal apply-modal" onClick={e => e.stopPropagation()}>
        <button className="gw-modal-close" onClick={onClose} aria-label="关闭">×</button>
        <div className="gw-modal-tag">投递简历</div>
        <h3 id="apply-title" className="gw-modal-title">{job.title}</h3>
        <div className="gw-modal-prize">{job.team} · {job.location} · {job.type}</div>
        <form onSubmit={submit} noValidate>
          <label className="gw-modal-label" htmlFor="apply-name">姓名</label>
          <input id="apply-name" ref={inputRef} className="gw-modal-input" value={name} onChange={e => setName(e.target.value)} placeholder="张三" autoComplete="name" />

          <label className="gw-modal-label" htmlFor="apply-email">邮箱</label>
          <input id="apply-email" className="gw-modal-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />

          <label className="gw-modal-label" htmlFor="apply-resume">简历链接</label>
          <input id="apply-resume" className="gw-modal-input" value={resume} onChange={e => setResume(e.target.value)} placeholder="https://… (Notion / Google Docs / 个人主页均可)" />

          <label className="gw-modal-label" htmlFor="apply-pitch">一句话自我介绍（可选）</label>
          <textarea id="apply-pitch" className="gw-modal-input apply-textarea" value={pitch} onChange={e => setPitch(e.target.value)} placeholder="比如：5 年 React，主导过 50 万 DAU 产品的前端架构。" rows={3} />

          {error && <div className="gw-modal-error">{error}</div>}
          <div className="gw-modal-actions">
            <button type="button" className="gw-btn-ghost" onClick={onClose}>取消</button>
            <button type="submit" className="gw-btn-primary" disabled={submitting}>
              {submitting ? "提交中…" : "确认投递"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
