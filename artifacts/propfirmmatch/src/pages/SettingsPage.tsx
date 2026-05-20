import { useEffect, useState } from "react";
import { useAuth, useClerk, useUser, Show } from "@clerk/react";
import { Link, Redirect } from "wouter";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type BlockedUser = {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  blockedAt: string;
};

export default function SettingsPage() {
  return (
    <>
      <Show when="signed-in">
        <SettingsInner />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function SettingsInner() {
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const clerk = useClerk();
  const [blocks, setBlocks] = useState<BlockedUser[] | null>(null);
  const [pushEnabled, setPushEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("notif:web-push") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch(`${API_BASE}/api/blocks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = (await res.json()) as { blocks: BlockedUser[] };
        if (!cancelled) setBlocks(data.blocks);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  async function unblock(userId: string) {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/blocks/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBlocks((cur) => cur?.filter((b) => b.userId !== userId) ?? null);
      }
    } catch {
      /* ignore */
    }
  }

  function togglePush() {
    const next = !pushEnabled;
    setPushEnabled(next);
    try {
      localStorage.setItem("notif:web-push", next ? "1" : "0");
      // Dispatch so other tabs / components can react.
      window.dispatchEvent(new CustomEvent("notif:web-push", { detail: next }));
    } catch {
      /* ignore */
    }
  }

  async function exportData() {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prophub-account-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("导出失败: " + (err as Error).message);
    }
  }

  async function deleteAccount() {
    const ok = window.confirm(
      "确定要注销账号吗?\n\n这会:\n· 删除你的登录凭证\n· 保留你发过的评价但显示为「已注销用户」\n\n该操作不可撤销。",
    );
    if (!ok) return;
    try {
      await clerkUser?.delete();
      // Clerk's user.delete triggers the server-side webhook which
      // soft-deletes the local row. After delete, Clerk clears the
      // session and the app re-renders signed-out.
      await clerk.signOut({ redirectUrl: "/" });
    } catch (err) {
      alert("注销失败: " + (err as Error).message);
    }
  }

  return (
    <div style={pageWrap}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/me" style={backLink}>← 返回个人主页</Link>
        <h1 style={h1}>账户设置</h1>
        <p style={muted}>管理通知、隐私和账号本身</p>
      </div>

      <section style={card}>
        <h2 style={h2}>通知</h2>
        <div style={row}>
          <div>
            <div style={rowTitle}>浏览器推送(社区新消息)</div>
            <div style={rowDesc}>关闭后,即使在其他标签也不会收到新消息提示音。</div>
          </div>
          <Toggle on={pushEnabled} onClick={togglePush} />
        </div>
        <div style={{ ...rowDesc, marginTop: 4 }}>
          手机端推送在手机 App 内单独管理。
        </div>
      </section>

      <section style={card}>
        <h2 style={h2}>登录与账号</h2>
        <div style={row}>
          <div>
            <div style={rowTitle}>邮箱 / 密码 / 第三方登录</div>
            <div style={rowDesc}>由 Clerk 管理。点右上角头像 → 管理账号。</div>
          </div>
          <button style={secondaryBtn} onClick={() => clerk.openUserProfile()}>
            打开
          </button>
        </div>
        <div style={row}>
          <div>
            <div style={rowTitle}>导出我的数据</div>
            <div style={rowDesc}>下载一份 JSON,包含本地档案。</div>
          </div>
          <button style={secondaryBtn} onClick={exportData}>下载</button>
        </div>
        <div style={row}>
          <div>
            <div style={rowTitle}>注销账号</div>
            <div style={rowDesc}>删除登录凭证,保留历史评价为「已注销用户」。</div>
          </div>
          <button style={dangerBtn} onClick={deleteAccount}>
            注销
          </button>
        </div>
      </section>

      <section style={card}>
        <h2 style={h2}>屏蔽列表 ({blocks?.length ?? 0})</h2>
        {blocks === null && <div style={muted}>加载中…</div>}
        {blocks && blocks.length === 0 && (
          <div style={muted}>还没屏蔽任何人。在别人的主页可以点「屏蔽」。</div>
        )}
        {blocks && blocks.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {blocks.map((b) => (
              <div key={b.userId} style={blockRow}>
                <Link href={`/u/${b.username}`} style={{ display: "flex", alignItems: "center", gap: 10, color: "#cbd5e1", textDecoration: "none" }}>
                  {b.avatarUrl ? (
                    <img src={b.avatarUrl} alt="" style={miniAvatar} />
                  ) : (
                    <div style={{ ...miniAvatar, ...miniAvatarFallback }}>
                      {b.displayName.slice(0, 1)}
                    </div>
                  )}
                  <div>
                    <div>{b.displayName}</div>
                    <div style={{ ...muted, fontSize: 12 }}>@{b.username}</div>
                  </div>
                </Link>
                <button style={secondaryBtn} onClick={() => unblock(b.userId)}>
                  解除屏蔽
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        width: 44,
        height: 26,
        borderRadius: 999,
        background: on ? "#a855f7" : "#2d3748",
        border: 0,
        position: "relative",
        cursor: "pointer",
        transition: "background 120ms",
      }}
      aria-pressed={on}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 21 : 3,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 120ms",
        }}
      />
    </button>
  );
}

const pageWrap: React.CSSProperties = {
  maxWidth: 720, margin: "0 auto", padding: "32px 16px 80px", color: "#f1f5f9",
};
const h1: React.CSSProperties = { fontSize: 26, fontWeight: 700, margin: "8px 0 4px" };
const h2: React.CSSProperties = { fontSize: 16, fontWeight: 600, margin: "0 0 16px", color: "#e2e8f0" };
const muted: React.CSSProperties = { color: "#94a3b8", fontSize: 14 };
const card: React.CSSProperties = {
  background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 12,
  padding: 24, marginBottom: 16,
};
const row: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  gap: 16, padding: "12px 0", borderTop: "1px solid #2d3748",
};
const rowTitle: React.CSSProperties = { fontWeight: 500, color: "#f1f5f9", marginBottom: 2 };
const rowDesc: React.CSSProperties = { fontSize: 13, color: "#94a3b8" };
const backLink: React.CSSProperties = { color: "#94a3b8", fontSize: 13, textDecoration: "none" };
const secondaryBtn: React.CSSProperties = {
  padding: "6px 14px", background: "#0f1420", border: "1px solid #2d3748",
  color: "#cbd5e1", borderRadius: 6, fontSize: 13, cursor: "pointer",
};
const dangerBtn: React.CSSProperties = {
  padding: "6px 14px", background: "rgba(239,68,68,0.12)",
  border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5",
  borderRadius: 6, fontSize: 13, cursor: "pointer",
};
const blockRow: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "10px 12px", background: "#0f1420", borderRadius: 8,
};
const miniAvatar: React.CSSProperties = {
  width: 32, height: 32, borderRadius: "50%", objectFit: "cover",
};
const miniAvatarFallback: React.CSSProperties = {
  background: "linear-gradient(135deg, #a855f7, #6366f1)",
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "#fff", fontSize: 13, fontWeight: 600,
};
