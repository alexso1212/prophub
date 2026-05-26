import { useCallback, useEffect, useState } from "react";
import AdminNav from "./AdminNav";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

interface FlagItem {
  messageId: string;
  messageText: string;
  messageType: string | null;
  messageDeletedAt: string | null;
  channelCid: string | null;
  authorId: string | null;
  authorName: string | null;
  reporterId: string | null;
  reporterName: string | null;
  createdAt: string | null;
}

interface Stats {
  newDmChannels24h: number;
  topReportedUsers: { userId: string; name: string | null; count: number }[];
  sampleDmChannels: { cid: string; memberCount: number | null; createdAt: string | null }[];
}

export default function AdminCommunityPage() {
  const [flags, setFlags] = useState<FlagItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fRes, sRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/chat/flags`, { credentials: "include" }),
        fetch(`${API_BASE}/api/admin/chat/stats`, { credentials: "include" }),
      ]);
      if (!fRes.ok) throw new Error(`举报列表 HTTP ${fRes.status}`);
      if (!sRes.ok) throw new Error(`统计接口 HTTP ${sRes.status}`);
      const fJson = await fRes.json();
      const sJson = await sRes.json();
      setFlags(fJson.flags ?? []);
      setStats(sJson);
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markBusy = (key: string, v: boolean) =>
    setBusy((prev) => ({ ...prev, [key]: v }));

  const deleteMessage = async (id: string) => {
    if (!confirm("确认硬删除这条消息？此操作不可撤销。")) return;
    markBusy(`del-${id}`, true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/chat/messages/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(`删除失败：${j.message ?? res.status}`);
      } else {
        await load();
      }
    } finally {
      markBusy(`del-${id}`, false);
    }
  };

  const banUser = async (userId: string, mode: "timeout" | "permanent") => {
    const reason = prompt(
      mode === "timeout" ? "临时禁言原因（可选）" : "永久封禁原因（可选）",
      "",
    );
    if (reason === null) return;
    const body =
      mode === "timeout"
        ? { timeoutMinutes: 60, reason }
        : { reason };
    markBusy(`ban-${userId}`, true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/chat/users/${userId}/ban`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(`封禁失败：${j.message ?? res.status}`);
      } else {
        alert(mode === "timeout" ? "已临时禁言 60 分钟" : "已永久封禁");
      }
    } finally {
      markBusy(`ban-${userId}`, false);
    }
  };

  const unbanUser = async (userId: string) => {
    markBusy(`unban-${userId}`, true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/chat/users/${userId}/unban`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(`解封失败：${j.message ?? res.status}`);
      } else {
        alert("已解封");
      }
    } finally {
      markBusy(`unban-${userId}`, false);
    }
  };

  return (
    <main className="container" style={{ paddingTop: 24 }}>
      <AdminNav />
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
        社区审核
      </h1>

      {error && <ErrorBox text={error} />}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <StatCard
          label="最近 24h 新增私聊"
          value={stats ? String(stats.newDmChannels24h) : "—"}
        />
        <StatCard
          label="待处理举报"
          value={String(
            flags.filter((f) => !f.messageDeletedAt).length,
          )}
        />
        <StatCard
          label="被举报最多用户"
          value={
            stats?.topReportedUsers?.[0]
              ? `${stats.topReportedUsers[0].name ?? stats.topReportedUsers[0].userId} · ${stats.topReportedUsers[0].count} 次`
              : "—"
          }
        />
      </div>

      {stats && stats.topReportedUsers.length > 0 && (
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 16,
            background: "var(--card-bg)",
            marginBottom: 20,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 10 }}>
            举报量 Top 用户
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            {stats.topReportedUsers.map((u) => (
              <div
                key={u.userId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 13,
                  padding: "6px 0",
                  borderBottom: "1px dashed var(--border)",
                }}
              >
                <span>
                  <strong>{u.name ?? u.userId}</strong>{" "}
                  <span style={{ color: "var(--text-dim)" }}>{u.userId}</span>
                </span>
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ color: "#ef4444", fontWeight: 600 }}>
                    {u.count} 次
                  </span>
                  <button
                    onClick={() => banUser(u.userId, "timeout")}
                    disabled={busy[`ban-${u.userId}`]}
                    style={btn("#eab308", "#000")}
                  >
                    禁言 60m
                  </button>
                  <button
                    onClick={() => banUser(u.userId, "permanent")}
                    disabled={busy[`ban-${u.userId}`]}
                    style={btn("#ef4444", "#fff")}
                  >
                    永久封禁
                  </button>
                  <button
                    onClick={() => unbanUser(u.userId)}
                    disabled={busy[`unban-${u.userId}`]}
                    style={btn("transparent", "var(--text)")}
                  >
                    解封
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 style={{ fontSize: 16, fontWeight: 700, margin: "8px 0 12px" }}>
        被举报的消息
      </h2>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>
          加载中…
        </div>
      ) : flags.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>
          🎉 当前没有被举报的消息。
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {flags.map((f) => (
            <div
              key={`${f.messageId}-${f.reporterId}-${f.createdAt}`}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 14,
                background: "var(--card-bg)",
                opacity: f.messageDeletedAt ? 0.55 : 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: 12,
                  color: "var(--text-dim)",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <span>
                  频道：<code>{f.channelCid ?? "—"}</code> · 发送者：
                  <strong style={{ color: "var(--text)" }}>
                    {f.authorName ?? f.authorId ?? "—"}
                  </strong>{" "}
                  ({f.authorId})
                </span>
                <span>
                  举报人：{f.reporterName ?? f.reporterId ?? "—"} ·{" "}
                  {f.createdAt ? new Date(f.createdAt).toLocaleString() : "—"}
                </span>
              </div>
              <div
                style={{
                  fontSize: 14,
                  padding: 10,
                  background: "rgba(0,0,0,0.25)",
                  borderRadius: 6,
                  marginBottom: 10,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {f.messageDeletedAt ? (
                  <em style={{ color: "var(--text-dim)" }}>
                    （消息已删除于 {new Date(f.messageDeletedAt).toLocaleString()}）
                  </em>
                ) : (
                  f.messageText || <em style={{ color: "var(--text-dim)" }}>（空文本 / 附件消息）</em>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => deleteMessage(f.messageId)}
                  disabled={busy[`del-${f.messageId}`] || !!f.messageDeletedAt}
                  style={btn("#ef4444", "#fff")}
                >
                  🗑 删除消息
                </button>
                {f.authorId && (
                  <>
                    <button
                      onClick={() => banUser(f.authorId!, "timeout")}
                      disabled={busy[`ban-${f.authorId}`]}
                      style={btn("#eab308", "#000")}
                    >
                      禁言 60 分钟
                    </button>
                    <button
                      onClick={() => banUser(f.authorId!, "permanent")}
                      disabled={busy[`ban-${f.authorId}`]}
                      style={btn("#a855f7", "#fff")}
                    >
                      永久封禁
                    </button>
                    <button
                      onClick={() => unbanUser(f.authorId!)}
                      disabled={busy[`unban-${f.authorId}`]}
                      style={btn("transparent", "var(--text)")}
                    >
                      解封
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <button onClick={load} style={btn("transparent", "var(--text)")}>
          ↻ 刷新
        </button>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 14,
        background: "var(--card-bg)",
      }}
    >
      <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function ErrorBox({ text }: { text: string }) {
  return (
    <div
      style={{
        background: "rgba(239,68,68,0.1)",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: 8,
        padding: "10px 16px",
        color: "#ef4444",
        marginBottom: 16,
      }}
    >
      {text}
    </div>
  );
}

function btn(bg: string, color: string): React.CSSProperties {
  return {
    background: bg,
    color,
    border: "1px solid var(--border)",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
  };
}
