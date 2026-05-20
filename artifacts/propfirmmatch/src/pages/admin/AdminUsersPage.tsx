import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/react";
import { Link } from "wouter";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type AdminUser = {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  role: "user" | "mod" | "admin";
  createdAt: string;
  bannedAt: string | null;
  banReason: string | null;
  deletedAt: string | null;
};

type Status = "" | "active" | "banned" | "deleted";

export default function AdminUsersPage() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<Status>("");
  const [offset, setOffset] = useState(0);
  const LIMIT = 50;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("登录已失效");
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (role) params.set("role", role);
      if (status) params.set("status", status);
      params.set("limit", String(LIMIT));
      params.set("offset", String(offset));
      const res = await fetch(`${API_BASE}/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`加载失败 (${res.status})`);
      const data = (await res.json()) as { users: AdminUser[]; total: number };
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [getToken, q, role, status, offset]);

  useEffect(() => {
    load();
  }, [load]);

  async function patchUser(id: string, patch: Record<string, unknown>) {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patch),
      });
      const data = (await res.json().catch(() => ({}))) as {
        user?: AdminUser;
        message?: string;
      };
      if (!res.ok) {
        alert(data.message || "操作失败");
        return;
      }
      if (data.user) {
        setUsers((cur) => cur.map((u) => (u.id === id ? data.user! : u)));
      }
    } catch (err) {
      alert((err as Error).message);
    }
  }

  function changeRole(u: AdminUser, next: string) {
    if (next === u.role) return;
    if (!window.confirm(`确认把 @${u.username} 的角色改为「${labelOfRole(next)}」?`)) return;
    patchUser(u.id, { role: next });
  }

  function toggleBan(u: AdminUser) {
    if (u.bannedAt) {
      if (!window.confirm(`解除 @${u.username} 的封禁?`)) return;
      patchUser(u.id, { banned: false });
    } else {
      const reason = window.prompt(`封禁 @${u.username} 的原因(可留空):`, "");
      if (reason === null) return;
      patchUser(u.id, { banned: true, banReason: reason });
    }
  }

  return (
    <div style={pageWrap}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={h1}>用户管理</h1>
        <Link href="/admin/audit" style={linkBtn}>查看审计日志 →</Link>
      </div>

      <div style={filterRow}>
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOffset(0); }}
          placeholder="搜索用户名 / 昵称 / 邮箱"
          style={{ ...input, flex: 1 }}
        />
        <select value={role} onChange={(e) => { setRole(e.target.value); setOffset(0); }} style={input}>
          <option value="">全部角色</option>
          <option value="user">普通用户</option>
          <option value="mod">版主</option>
          <option value="admin">管理员</option>
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value as Status); setOffset(0); }} style={input}>
          <option value="">全部状态</option>
          <option value="active">正常</option>
          <option value="banned">已封禁</option>
          <option value="deleted">已注销</option>
        </select>
      </div>

      {error && <div style={errorBox}>{error}</div>}

      <div style={card}>
        <table style={table}>
          <thead>
            <tr style={{ background: "#0f1420" }}>
              <th style={th}>用户</th>
              <th style={th}>邮箱</th>
              <th style={th}>角色</th>
              <th style={th}>状态</th>
              <th style={th}>注册</th>
              <th style={th}>操作</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} style={td}>加载中…</td></tr>}
            {!loading && users.length === 0 && (
              <tr><td colSpan={6} style={{ ...td, textAlign: "center", color: "#64748b" }}>没有匹配的用户</td></tr>
            )}
            {users.map((u) => (
              <tr key={u.id} style={{ borderTop: "1px solid #2d3748" }}>
                <td style={td}>
                  <Link href={`/u/${u.username}`} style={{ color: "#cbd5e1", textDecoration: "none" }}>
                    <div style={{ fontWeight: 500 }}>{u.displayName}</div>
                    <div style={{ ...muted, fontSize: 12 }}>@{u.username}</div>
                  </Link>
                </td>
                <td style={td}><span style={muted}>{u.email ?? "—"}</span></td>
                <td style={td}>
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u, e.target.value)}
                    style={{ ...input, padding: "4px 8px", fontSize: 13 }}
                  >
                    <option value="user">普通用户</option>
                    <option value="mod">版主</option>
                    <option value="admin">管理员</option>
                  </select>
                </td>
                <td style={td}>
                  {u.deletedAt ? <span style={tagGray}>已注销</span>
                    : u.bannedAt ? <span style={tagDanger}>已封禁</span>
                    : <span style={tagOk}>正常</span>}
                  {u.banReason && (
                    <div style={{ ...muted, fontSize: 11, marginTop: 2 }} title={u.banReason}>
                      {u.banReason.slice(0, 30)}{u.banReason.length > 30 ? "…" : ""}
                    </div>
                  )}
                </td>
                <td style={td}>
                  <span style={muted}>{new Date(u.createdAt).toLocaleDateString("zh-CN")}</span>
                </td>
                <td style={td}>
                  <button style={u.bannedAt ? secondaryBtn : dangerBtn} onClick={() => toggleBan(u)}>
                    {u.bannedAt ? "解封" : "封禁"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, alignItems: "center" }}>
        <span style={muted}>共 {total} 人,显示 {offset + 1} - {Math.min(offset + LIMIT, total)}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - LIMIT))}
            style={{ ...secondaryBtn, opacity: offset === 0 ? 0.4 : 1 }}
          >上一页</button>
          <button
            disabled={offset + LIMIT >= total}
            onClick={() => setOffset(offset + LIMIT)}
            style={{ ...secondaryBtn, opacity: offset + LIMIT >= total ? 0.4 : 1 }}
          >下一页</button>
        </div>
      </div>
    </div>
  );
}

function labelOfRole(role: string): string {
  if (role === "admin") return "管理员";
  if (role === "mod") return "版主";
  return "普通用户";
}

const pageWrap: React.CSSProperties = {
  maxWidth: 1200, margin: "0 auto", padding: "24px 16px 80px", color: "#f1f5f9",
};
const h1: React.CSSProperties = { fontSize: 24, fontWeight: 700, margin: "0 0 16px" };
const muted: React.CSSProperties = { color: "#94a3b8", fontSize: 13 };
const filterRow: React.CSSProperties = {
  display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap",
};
const input: React.CSSProperties = {
  background: "#0f1420", border: "1px solid #2d3748", borderRadius: 8,
  padding: "8px 12px", color: "#f1f5f9", fontSize: 14,
};
const card: React.CSSProperties = {
  background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 12, overflow: "hidden",
};
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse" as const };
const th: React.CSSProperties = {
  textAlign: "left", padding: "10px 12px", fontSize: 12,
  fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" as const,
};
const td: React.CSSProperties = { padding: "10px 12px", fontSize: 14, verticalAlign: "top" };
const tagOk: React.CSSProperties = {
  padding: "2px 8px", background: "rgba(34,197,94,0.15)",
  color: "#86efac", borderRadius: 4, fontSize: 12,
};
const tagDanger: React.CSSProperties = {
  padding: "2px 8px", background: "rgba(239,68,68,0.15)",
  color: "#fca5a5", borderRadius: 4, fontSize: 12,
};
const tagGray: React.CSSProperties = {
  padding: "2px 8px", background: "rgba(148,163,184,0.15)",
  color: "#94a3b8", borderRadius: 4, fontSize: 12,
};
const secondaryBtn: React.CSSProperties = {
  padding: "5px 12px", background: "#0f1420", border: "1px solid #2d3748",
  color: "#cbd5e1", borderRadius: 6, fontSize: 13, cursor: "pointer",
};
const dangerBtn: React.CSSProperties = {
  padding: "5px 12px", background: "rgba(239,68,68,0.12)",
  border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5",
  borderRadius: 6, fontSize: 13, cursor: "pointer",
};
const linkBtn: React.CSSProperties = {
  padding: "8px 14px", background: "#1a1f2e", border: "1px solid #2d3748",
  color: "#cbd5e1", borderRadius: 8, fontSize: 14, textDecoration: "none",
};
const errorBox: React.CSSProperties = {
  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
  color: "#fca5a5", padding: 12, borderRadius: 8, marginBottom: 16,
};
