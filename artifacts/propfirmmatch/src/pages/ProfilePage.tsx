import { useEffect, useRef, useState } from "react";
import { useUser, useAuth, UserButton, Show } from "@clerk/react";
import { Link, Redirect } from "wouter";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type Me = {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  role: "user" | "mod" | "admin";
  createdAt: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

export default function ProfilePage() {
  return (
    <>
      <Show when="signed-in">
        <ProfileEditor />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function ProfileEditor() {
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const [me, setMe] = useState<Me | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // form state
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const initialised = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("登录已失效,请刷新页面");
        const res = await fetch(`${API_BASE}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`加载失败 (${res.status})`);
        const data = (await res.json()) as { user: Me };
        if (cancelled) return;
        setMe(data.user);
        if (!initialised.current) {
          setUsername(data.user.username);
          setDisplayName(data.user.displayName);
          setBio(data.user.bio ?? "");
          setLocation(data.user.location ?? "");
          initialised.current = true;
        }
      } catch (err) {
        if (!cancelled) setLoadErr((err as Error)?.message || "加载失败");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "saving" });
    try {
      const token = await getToken();
      if (!token) throw new Error("登录已失效,请刷新页面");
      const res = await fetch(`${API_BASE}/api/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          displayName: displayName.trim(),
          bio: bio.trim(),
          location: location.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        user?: Me;
        message?: string;
      };
      if (!res.ok) throw new Error(data.message || `保存失败 (${res.status})`);
      if (data.user) setMe(data.user);
      setStatus({ kind: "saved" });
      setTimeout(() => setStatus({ kind: "idle" }), 2500);
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error)?.message || "保存失败" });
    }
  }

  if (loadErr) {
    return (
      <div style={pageWrap}>
        <h1 style={h1}>个人资料</h1>
        <div style={errorBox}>{loadErr}</div>
      </div>
    );
  }
  if (!me) {
    return (
      <div style={pageWrap}>
        <h1 style={h1}>个人资料</h1>
        <p style={muted}>加载中…</p>
      </div>
    );
  }

  const avatar = me.avatarUrl || clerkUser?.imageUrl;
  const memberSince = new Date(me.createdAt).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
  });

  return (
    <div style={pageWrap}>
      <div style={headerRow}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {avatar ? (
            <img src={avatar} alt="头像" style={avatarStyle} />
          ) : (
            <div style={{ ...avatarStyle, ...avatarFallback }}>
              {me.displayName.slice(0, 1)}
            </div>
          )}
          <div>
            <h1 style={h1}>{me.displayName}</h1>
            <div style={muted}>
              @{me.username}
              {me.role !== "user" && (
                <span style={roleBadge}>{me.role === "admin" ? "管理员" : "版主"}</span>
              )}
            </div>
            <div style={{ ...muted, fontSize: 13, marginTop: 4 }}>
              {memberSince} 加入 · {me.email ?? "未绑定邮箱"}
            </div>
          </div>
        </div>
        <div>
          <UserButton />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Link href={`/u/${me.username}`} style={linkBtn}>
          查看我的公开主页
        </Link>
        <Link href="/settings" style={linkBtn}>
          账户设置
        </Link>
      </div>

      <form onSubmit={handleSave} style={card}>
        <h2 style={h2}>编辑资料</h2>

        <label style={label}>
          <span style={labelText}>用户名(主页地址)</span>
          <div style={usernameRow}>
            <span style={atSign}>@</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ ...input, flex: 1 }}
              maxLength={24}
              autoComplete="off"
              spellCheck={false}
              placeholder="trader_chen"
            />
          </div>
          <span style={hint}>小写字母、数字、下划线,3-24 位。改名后老链接会失效。</span>
        </label>

        <label style={label}>
          <span style={labelText}>昵称</span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={input}
            maxLength={60}
            placeholder="陈交易员"
          />
        </label>

        <label style={label}>
          <span style={labelText}>所在地</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={input}
            maxLength={80}
            placeholder="上海"
          />
        </label>

        <label style={label}>
          <span style={labelText}>个人简介</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ ...input, minHeight: 100, resize: "vertical" }}
            maxLength={500}
            placeholder="一句话介绍自己,会显示在公开主页"
          />
          <span style={hint}>{bio.length} / 500</span>
        </label>

        <div style={hint}>头像跟着 Clerk 账号走,如需修改请点右上角头像 → 管理账号。</div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          <button
            type="submit"
            disabled={status.kind === "saving"}
            style={{
              ...primaryBtn,
              opacity: status.kind === "saving" ? 0.6 : 1,
              cursor: status.kind === "saving" ? "not-allowed" : "pointer",
            }}
          >
            {status.kind === "saving" ? "保存中…" : "保存"}
          </button>
          {status.kind === "saved" && <span style={{ color: "#22c55e" }}>✓ 已保存</span>}
          {status.kind === "error" && (
            <span style={{ color: "#ef4444" }}>{status.message}</span>
          )}
        </div>
      </form>
    </div>
  );
}

const pageWrap: React.CSSProperties = {
  maxWidth: 720,
  margin: "0 auto",
  padding: "32px 16px 80px",
  color: "#f1f5f9",
};
const headerRow: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
  marginBottom: 20,
};
const h1: React.CSSProperties = { fontSize: 26, fontWeight: 700, margin: 0 };
const h2: React.CSSProperties = { fontSize: 18, fontWeight: 600, margin: "0 0 16px" };
const muted: React.CSSProperties = { color: "#94a3b8", fontSize: 14 };
const avatarStyle: React.CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #2d3748",
};
const avatarFallback: React.CSSProperties = {
  background: "linear-gradient(135deg, #a855f7, #6366f1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 28,
  fontWeight: 600,
};
const roleBadge: React.CSSProperties = {
  marginLeft: 8,
  padding: "2px 8px",
  background: "rgba(168,85,247,0.18)",
  color: "#c084fc",
  borderRadius: 6,
  fontSize: 12,
};
const card: React.CSSProperties = {
  background: "#1a1f2e",
  border: "1px solid #2d3748",
  borderRadius: 12,
  padding: 24,
  display: "flex",
  flexDirection: "column",
  gap: 18,
};
const label: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6 };
const labelText: React.CSSProperties = { fontSize: 13, color: "#cbd5e1", fontWeight: 500 };
const input: React.CSSProperties = {
  background: "#0f1420",
  border: "1px solid #2d3748",
  borderRadius: 8,
  padding: "10px 12px",
  color: "#f1f5f9",
  fontSize: 15,
  fontFamily: "inherit",
};
const usernameRow: React.CSSProperties = {
  display: "flex",
  alignItems: "stretch",
  background: "#0f1420",
  border: "1px solid #2d3748",
  borderRadius: 8,
  overflow: "hidden",
};
const atSign: React.CSSProperties = {
  padding: "10px 12px",
  color: "#94a3b8",
  background: "#161b27",
  borderRight: "1px solid #2d3748",
};
const hint: React.CSSProperties = { fontSize: 12, color: "#64748b" };
const errorBox: React.CSSProperties = {
  background: "rgba(239,68,68,0.1)",
  border: "1px solid rgba(239,68,68,0.3)",
  color: "#fca5a5",
  padding: 16,
  borderRadius: 8,
};
const primaryBtn: React.CSSProperties = {
  background: "#a855f7",
  color: "#fff",
  border: 0,
  borderRadius: 8,
  padding: "10px 20px",
  fontSize: 15,
  fontWeight: 500,
};
const linkBtn: React.CSSProperties = {
  padding: "8px 16px",
  background: "#1a1f2e",
  border: "1px solid #2d3748",
  borderRadius: 8,
  color: "#cbd5e1",
  fontSize: 14,
  textDecoration: "none",
};
