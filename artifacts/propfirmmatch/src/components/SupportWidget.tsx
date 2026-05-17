import { useEffect, useState, FormEvent, ReactNode } from "react";
import { FAQS, FAQ_GROUPS, type FaqItem } from "../data/faq";

type Tab = "faq" | "message" | "community";
const MSG_KEY = "pfm.support.messages.v1";

interface Msg { name: string; email: string; body: string; at: string }

function readMsgs(): Msg[] {
  try { return JSON.parse(localStorage.getItem(MSG_KEY) || "[]"); } catch { return []; }
}
function writeMsgs(list: Msg[]) {
  try { localStorage.setItem(MSG_KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

const TwitterIcon = (): ReactNode => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>
);
const YouTubeIcon = (): ReactNode => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" /></svg>
);
const TelegramIcon = (): ReactNode => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19l-9.49 5.99-4.1-1.28c-.88-.27-.89-.88.2-1.31l16-6.17c.73-.34 1.42.18 1.14 1.31l-2.72 12.83c-.19.92-.74 1.14-1.5.71L13.7 15.4l-1.99 1.93c-.23.23-.42.42-.83.42l-.1-.1Z" /></svg>
);
const WechatIcon = (): ReactNode => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8.69 3C4.65 3 1.37 5.63 1.37 8.87c0 1.81 1 3.42 2.6 4.51l-.65 1.96 2.28-1.14c.81.16 1.46.32 2.27.32.21 0 .42-.01.63-.03a4.94 4.94 0 0 1-.23-1.49c0-3.07 2.96-5.57 6.62-5.57.24 0 .47.02.71.04C14.95 5 12.07 3 8.69 3Zm-2.93 4.07a.89.89 0 1 1 0-1.78.89.89 0 0 1 0 1.78Zm5.86 0a.89.89 0 1 1 0-1.78.89.89 0 0 1 0 1.78Zm4.13 1.99c-3.4 0-6.18 2.31-6.18 5.16 0 2.86 2.78 5.17 6.18 5.17.67 0 1.34-.13 1.97-.27l1.86.94-.5-1.6c1.36-.92 2.21-2.32 2.21-3.91 0-2.85-2.78-5.49-5.54-5.49Zm-1.97 3.55a.74.74 0 1 1 0-1.48.74.74 0 0 1 0 1.48Zm3.92 0a.74.74 0 1 1 0-1.48.74.74 0 0 1 0 1.48Z" /></svg>
);

const COMMUNITIES: Array<{
  id: string; name: string; desc: string; btn: string; href: string; color: string; icon: () => ReactNode;
}> = [
  { id: "twitter",  name: "Twitter",  desc: "实时行业快讯与公司更新",   btn: "去关注",     href: "https://twitter.com/propfirmmatch",        color: "#1da1f2", icon: TwitterIcon },
  { id: "youtube",  name: "YouTube",  desc: "每周教程视频与公司测评",   btn: "去订阅",     href: "https://www.youtube.com/@propfirmmatch",   color: "#ff0000", icon: YouTubeIcon },
  { id: "telegram", name: "Telegram", desc: "中文交流群，发限时优惠码", btn: "加入群组",   href: "https://t.me/propfirmmatch",                color: "#229ed9", icon: TelegramIcon },
  { id: "wechat",   name: "微信群",   desc: "扫码加客服微信拉中文群",   btn: "查看二维码", href: "#wechat",                                    color: "#07c160", icon: WechatIcon },
];

interface Props { onClose: () => void }

export default function SupportWidget({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>("faq");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [group, setGroup] = useState<FaqItem["group"]>("入门");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("请填写姓名");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("请输入有效的邮箱地址");
    if (body.trim().length < 5) return setError("请把问题写得详细一点（至少 5 个字）");
    const msg: Msg = { name: name.trim(), email: email.trim(), body: body.trim(), at: new Date().toISOString() };
    writeMsgs([msg, ...readMsgs()].slice(0, 50));
    setName(""); setEmail(""); setBody("");
    setToast("我们 24 小时内回复你");
    window.setTimeout(() => setToast(null), 3800);
  }

  const filtered = FAQS.filter(f => f.group === group);

  return (
    <>
      <div className="support-backdrop" onClick={onClose} aria-hidden />
      <div className="support-panel" role="dialog" aria-modal="true" aria-label="客服支持">
        <header className="support-head">
          <div>
            <div className="support-title">需要帮助？</div>
            <div className="support-sub">10 秒读完常见问题，或留言给我们</div>
          </div>
          <button type="button" className="support-close" onClick={onClose} aria-label="关闭">×</button>
        </header>

        <nav className="support-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "faq"}       className={tab === "faq" ? "active" : ""}       onClick={() => setTab("faq")}>常见问题</button>
          <button type="button" role="tab" aria-selected={tab === "message"}   className={tab === "message" ? "active" : ""}   onClick={() => setTab("message")}>留言</button>
          <button type="button" role="tab" aria-selected={tab === "community"} className={tab === "community" ? "active" : ""} onClick={() => setTab("community")}>社区</button>
        </nav>

        <div className="support-body">
          {tab === "faq" && (
            <>
              <div className="support-groups">
                {FAQ_GROUPS.map(g => (
                  <button
                    key={g}
                    type="button"
                    className={`support-group ${g === group ? "active" : ""}`}
                    onClick={() => { setGroup(g); setOpenFaq(0); }}
                  >{g}</button>
                ))}
              </div>
              <ul className="support-faq-list">
                {filtered.map((f, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <li key={f.q} className={`support-faq ${isOpen ? "open" : ""}`}>
                      <button
                        type="button"
                        className="support-faq-q"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                      >
                        <span>{f.q}</span>
                        <span className="support-faq-caret">{isOpen ? "−" : "+"}</span>
                      </button>
                      {isOpen && <div className="support-faq-a">{f.a}</div>}
                    </li>
                  );
                })}
              </ul>
              <div className="support-faq-tip">
                没找到答案？切到「留言」标签直接告诉我们。
              </div>
            </>
          )}

          {tab === "message" && (
            <form className="support-form" onSubmit={submit} noValidate>
              <label className="support-label" htmlFor="sup-name">姓名</label>
              <input id="sup-name" className="support-input" value={name} onChange={e => setName(e.target.value)} placeholder="张三" autoComplete="name" />

              <label className="support-label" htmlFor="sup-email">邮箱</label>
              <input id="sup-email" className="support-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />

              <label className="support-label" htmlFor="sup-body">你的问题</label>
              <textarea id="sup-body" className="support-input support-textarea" value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="比如：FTMO 二阶段触发了 5% 回撤，能不能重置？" />

              {error && <div className="support-error">{error}</div>}
              <button type="submit" className="support-submit">提交留言</button>
              <div className="support-form-tip">留言会临时保存在本地，方便你之后复查。</div>
            </form>
          )}

          {tab === "community" && (
            <div className="support-community">
              {COMMUNITIES.map(c => {
                const Icon = c.icon;
                return (
                  <div key={c.id} className="support-comm-card">
                    <div className="support-comm-icon" style={{ background: c.color }}><Icon /></div>
                    <div className="support-comm-info">
                      <div className="support-comm-name">{c.name}</div>
                      <div className="support-comm-desc">{c.desc}</div>
                    </div>
                    <a className="support-comm-btn" href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{c.btn}</a>
                  </div>
                );
              })}
              <div className="support-faq-tip">
                所有官方账号均以 <strong>@propfirmmatch</strong> 开头，谨防仿冒。
              </div>
            </div>
          )}
        </div>
      </div>
      {toast && <div className="gw-toast" role="status">{toast}</div>}
    </>
  );
}
