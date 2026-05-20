import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { Link } from "wouter";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type AuditEntry = {
  id: number;
  actorId: string;
  actorName: string | null;
  actorUsername: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

const ACTION_LABELS: Record<string, string> = {
  "user.role_changed": "改角色",
  "user.banned": "封禁用户",
  "user.unbanned": "解除封禁",
  "review.deleted": "删除评价",
  "chat.message_deleted": "删除聊天消息",
};

const ACTION_COLORS: Record<string, string> = {
  "user.banned": "#fca5a5",
  "review.deleted": "#fca5a5",
  "chat.message_deleted": "#fca5a5",
  "user.unbanned": "#86efac",
  "user.role_changed": "#c084fc",
};

export default function AdminAuditPage() {
  const { getToken } = useAuth();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("登录已失效");
      const params = new URLSearchParams();
      if (actionFilter) params.set("action", actionFilter);
      params.set("limit", "200");
      const res = await fetch(`${API_BASE}/api/admin/audit?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`加载失败 (${res.status})`);
      const data = (await res.json()) as { entries: AuditEntry[] };
      setEntries(data.entries);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [getToken, actionFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div style={pageWrap}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={h1}>审计日志</h1>
          <p style={muted}>谁在何时改了什么——最近 200 条</p>
        </div>
        <Link href="/admin/users" style={linkBtn}>← 用户管理</Link>
      </div>

      <div style={{ display: "flex", gap: 8, margin: "16px 0", flexWrap: "wrap" }}>
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} style={input}>
          <option value="">全部操作</option>
          {Object.entries(ACTION_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button onClick={load} style={secondaryBtn}>刷新</button>
      </div>

      {error && <div style={errorBox}>{error}</div>}

      <div style={card}>
        <table style={table}>
          <thead>
            <tr style={{ background: "#0f1420" }}>
              <th style={th}>时间</th>
              <th style={th}>操作人</th>
              <th style={th}>操作</th>
              <th style={th}>对象</th>
              <th style={th}>详情</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} style={td}>加载中…</td></tr>}
            {!loading && entries.length === 0 && (
              <tr><td colSpan={5} style={{ ...td, textAlign: "center", color: "#64748b" }}>暂无记录</td></tr>
            )}
            {entries.map((e) => (
              <tr key={e.id} style={{ borderTop: "1px solid #2d3748" }}>
                <td style={td}>
                  <span style={muted}>{new Date(e.createdAt).toLocaleString("zh-CN")}</span>
                </td>
                <td style={td}>
                  {e.actorUsername ? (
                    <Link href={`/u/${e.actorUsername}`} style={{ color: "#cbd5e1", textDecoration: "none" }}>
                      {e.actorName || `@${e.actorUsername}`}
                    </Link>
                  ) : (
                    <span style={muted}>{e.actorId.slice(0, 12)}…</span>
                  )}
                </td>
                <td style={td}>
                  <span style={{ ...actionTag, color: ACTION_COLORS[e.action] || "#cbd5e1" }}>
                    {ACTION_LABELS[e.action] || e.action}
                  </span>
                </td>
                <td style={td}>
                  {e.targetType && e.targetId ? (
                    <span style={muted}>{e.targetType}:{e.targetId.slice(0, 14)}…</span>
                  ) : "—"}
                </td>
                <td style={td}>
                  {e.metadata && Object.keys(e.metadata).length > 0 ? (
                    <code style={meta}>{JSON.stringify(e.metadata)}</code>
                  ) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const pageWrap: React.CSSProperties = {
  maxWidth: 1200, margin: "0 auto", padding: "24px 16px 80px", color: "#f1f5f9",
};
const h1: React.CSSProperties = { fontSize: 24, fontWeight: 700, margin: "0 0 4px" };
const muted: React.CSSProperties = { color: "#94a3b8", fontSize: 13 };
const card: React.CSSProperties = {
  background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 12, overflow: "hidden",
};
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse" as const };
const th: React.CSSProperties = {
  textAlign: "left", padding: "10px 12px", fontSize: 12,
  fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" as const,
};
const td: React.CSSProperties = { padding: "10px 12px", fontSize: 13, verticalAlign: "top" };
const input: React.CSSProperties = {
  background: "#0f1420", border: "1px solid #2d3748", borderRadius: 8,
  padding: "8px 12px", color: "#f1f5f9", fontSize: 14,
};
const actionTag: React.CSSProperties = {
  padding: "2px 8px", background: "rgba(148,163,184,0.1)",
  borderRadius: 4, fontSize: 12, fontWeight: 500,
};
const meta: React.CSSProperties = {
  fontSize: 11, color: "#94a3b8", background: "#0f1420",
  padding: "2px 6px", borderRadius: 4, fontFamily: "ui-monospace, monospace",
  maxWidth: 400, display: "inline-block", overflow: "hidden",
  textOverflow: "ellipsis", whiteSpace: "nowrap",
};
const linkBtn: React.CSSProperties = {
  padding: "8px 14px", background: "#1a1f2e", border: "1px solid #2d3748",
  color: "#cbd5e1", borderRadius: 8, fontSize: 14, textDecoration: "none",
};
const secondaryBtn: React.CSSProperties = {
  padding: "8px 14px", background: "#0f1420", border: "1px solid #2d3748",
  color: "#cbd5e1", borderRadius: 8, fontSize: 14, cursor: "pointer",
};
const errorBox: React.CSSProperties = {
  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
  color: "#fca5a5", padding: 12, borderRadius: 8, marginBottom: 16,
};
