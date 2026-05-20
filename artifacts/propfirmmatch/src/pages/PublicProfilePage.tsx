import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { useAuth, useUser, Show } from "@clerk/react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type PublicUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  role: "user" | "mod" | "admin";
  createdAt: string;
};

type ReviewSummary = {
  id: number;
  slug: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
};

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = (params.username || "").toLowerCase();
  const [data, setData] = useState<{ user: PublicUser; reviews: ReviewSummary[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState<boolean | null>(null); // null = unknown / not signed in
  const [busy, setBusy] = useState(false);
  const { getToken } = useAuth();
  const { user: me } = useUser();

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    setData(null);
    setError(null);
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(username)}`);
        if (res.status === 404) throw new Error("用户不存在");
        if (!res.ok) throw new Error(`加载失败 (${res.status})`);
        const json = (await res.json()) as { user: PublicUser; reviews: ReviewSummary[] };
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError((err as Error)?.message || "加载失败");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [username]);

  // Look up whether viewer has already blocked this user.
  useEffect(() => {
    if (!data || !me) { setBlocked(null); return; }
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch(`${API_BASE}/api/blocks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const json = (await res.json()) as { blocks: Array<{ userId: string }> };
        if (!cancelled) {
          setBlocked(json.blocks.some((b) => b.userId === data.user.id));
        }
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [data, me, getToken]);

  async function toggleBlock() {
    if (!data) return;
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("请先登录");
      const method = blocked ? "DELETE" : "POST";
      const res = await fetch(`${API_BASE}/api/blocks/${data.user.id}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("操作失败");
      setBlocked(!blocked);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <div style={pageWrap}>
        <h1 style={h1}>找不到这个用户</h1>
        <p style={muted}>{error}</p>
        <Link href="/" style={linkBtn}>返回首页</Link>
      </div>
    );
  }
  if (!data) {
    return (
      <div style={pageWrap}>
        <p style={muted}>加载中…</p>
      </div>
    );
  }

  const { user, reviews } = data;
  const memberSince = new Date(user.createdAt).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
  });

  return (
    <div style={pageWrap}>
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" style={avatarStyle} />
          ) : (
            <div style={{ ...avatarStyle, ...avatarFallback }}>
              {user.displayName.slice(0, 1)}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={h1}>
              {user.displayName}
              {user.role !== "user" && (
                <span style={roleBadge}>{user.role === "admin" ? "管理员" : "版主"}</span>
              )}
            </h1>
            <div style={muted}>@{user.username}</div>
            {user.location && (
              <div style={{ ...muted, marginTop: 4 }}>📍 {user.location}</div>
            )}
            <div style={{ ...muted, marginTop: 4, fontSize: 13 }}>
              {memberSince} 加入
            </div>
          </div>
        </div>
        {user.bio && <p style={bioBox}>{user.bio}</p>}

        <Show when="signed-in">
          {me && me.id !== user.id && (
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button
                onClick={toggleBlock}
                disabled={busy || blocked === null}
                style={blocked ? secondaryBtn : dangerBtn}
              >
                {blocked === null ? "…" : blocked ? "解除屏蔽" : "屏蔽此人"}
              </button>
            </div>
          )}
        </Show>
      </div>

      <h2 style={h2}>
        发过的评价 <span style={muted}>({reviews.length})</span>
      </h2>
      {reviews.length === 0 ? (
        <p style={muted}>还没发过评价。</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reviews.map((r) => (
            <Link key={r.id} href={`/futures/prop-firms/${r.slug}`} style={reviewCard}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <strong>{r.title}</strong>
                <span style={{ color: "#f5b50a" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
              </div>
              <div style={{ ...muted, fontSize: 13, marginBottom: 6 }}>
                @ {r.slug} · {new Date(r.createdAt).toLocaleDateString("zh-CN")}
              </div>
              <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.5 }}>
                {r.body.length > 220 ? `${r.body.slice(0, 220)}…` : r.body}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const pageWrap: React.CSSProperties = {
  maxWidth: 720,
  margin: "0 auto",
  padding: "32px 16px 80px",
  color: "#f1f5f9",
};
const card: React.CSSProperties = {
  background: "#1a1f2e",
  border: "1px solid #2d3748",
  borderRadius: 12,
  padding: 24,
  marginBottom: 24,
};
const reviewCard: React.CSSProperties = {
  display: "block",
  background: "#1a1f2e",
  border: "1px solid #2d3748",
  borderRadius: 10,
  padding: 16,
  color: "#f1f5f9",
  textDecoration: "none",
};
const h1: React.CSSProperties = { fontSize: 24, fontWeight: 700, margin: "0 0 4px" };
const h2: React.CSSProperties = { fontSize: 18, fontWeight: 600, margin: "0 0 12px" };
const muted: React.CSSProperties = { color: "#94a3b8", fontSize: 14 };
const avatarStyle: React.CSSProperties = {
  width: 80,
  height: 80,
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #2d3748",
};
const avatarFallback: React.CSSProperties = {
  background: "linear-gradient(135deg, #a855f7, #6366f1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 32,
  fontWeight: 600,
};
const roleBadge: React.CSSProperties = {
  marginLeft: 8,
  padding: "2px 8px",
  background: "rgba(168,85,247,0.18)",
  color: "#c084fc",
  borderRadius: 6,
  fontSize: 12,
  verticalAlign: "middle",
};
const bioBox: React.CSSProperties = {
  marginTop: 16,
  padding: 14,
  background: "#0f1420",
  borderRadius: 8,
  color: "#cbd5e1",
  lineHeight: 1.6,
  whiteSpace: "pre-wrap",
};
const secondaryBtn: React.CSSProperties = {
  padding: "6px 14px", background: "#0f1420", border: "1px solid #2d3748",
  color: "#cbd5e1", borderRadius: 6, fontSize: 13, cursor: "pointer",
};
const dangerBtn: React.CSSProperties = {
  padding: "6px 14px", background: "rgba(239,68,68,0.12)",
  border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5",
  borderRadius: 6, fontSize: 13, cursor: "pointer",
};
const linkBtn: React.CSSProperties = {
  display: "inline-block",
  marginTop: 12,
  padding: "8px 16px",
  background: "#1a1f2e",
  border: "1px solid #2d3748",
  borderRadius: 8,
  color: "#cbd5e1",
  textDecoration: "none",
};
