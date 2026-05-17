import { useEffect, useRef, useState, FormEvent } from "react";
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

const COMMUNITIES = [
  { id: "twitter",  name: "Twitter",  desc: "实时行业快讯与公司更新", btn: "去关注", href: "https://twitter.com/propfirmmatch", color: "#1da1f2" },
  { id: "youtube",  name: "YouTube",  desc: "每周教程视频与公司测评",   btn: "去订阅", href: "https://www.youtube.com/@propfirmmatch", color: "#ff0000" },
  { id: "telegram", name: "Telegram", desc: "中文交流群，发限时优惠码", btn: "加入群组", href: "https://t.me/propfirmmatch", color: "#229ed9" },
  { id: "wechat",   name: "微信群",   desc: "扫码加客服微信拉中文群",   btn: "查看二维码", href: "#wechat", color: "#07c160" },
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
  const [sent, setSent] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

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
    setSent(true);
    setName(""); setEmail(""); setBody("");
    window.setTimeout(() => setSent(false), 4200);
  }

  const filtered = FAQS.filter(f => f.group === group);

  return (
    <>
      <div className="support-backdrop" onClick={onClose} aria-hidden />
      <div className="support-panel" role="dialog" aria-modal="true" aria-label="客服支持" ref={panelRef}>
        <header className="support-head">
          <div>
            <div className="support-title">需要帮助？</div>
            <div className="support-sub">10 秒读完常见问题，或留言给我们</div>
          </div>
          <button className="support-close" onClick={onClose} aria-label="关闭">×</button>
        </header>

        <nav className="support-tabs" role="tablist">
          <button role="tab" aria-selected={tab === "faq"}       className={tab === "faq" ? "active" : ""}       onClick={() => setTab("faq")}>常见问题</button>
          <button role="tab" aria-selected={tab === "message"}   className={tab === "message" ? "active" : ""}   onClick={() => setTab("message")}>留言</button>
          <button role="tab" aria-selected={tab === "community"} className={tab === "community" ? "active" : ""} onClick={() => setTab("community")}>社区</button>
        </nav>

        <div className="support-body">
          {tab === "faq" && (
            <>
              <div className="support-groups">
                {FAQ_GROUPS.map(g => (
                  <button
                    key={g}
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
              {sent && <div className="support-success">✓ 已收到，我们 24 小时内邮件回复你。</div>}

              <button type="submit" className="support-submit">提交留言</button>
              <div className="support-form-tip">留言会临时保存在本地，方便你之后复查。</div>
            </form>
          )}

          {tab === "community" && (
            <div className="support-community">
              {COMMUNITIES.map(c => (
                <div key={c.id} className="support-comm-card">
                  <div className="support-comm-icon" style={{ background: c.color }}>{c.name[0]}</div>
                  <div className="support-comm-info">
                    <div className="support-comm-name">{c.name}</div>
                    <div className="support-comm-desc">{c.desc}</div>
                  </div>
                  <a className="support-comm-btn" href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{c.btn}</a>
                </div>
              ))}
              <div className="support-faq-tip">
                所有官方账号均以 <strong>@propfirmmatch</strong> 开头，谨防仿冒。
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
