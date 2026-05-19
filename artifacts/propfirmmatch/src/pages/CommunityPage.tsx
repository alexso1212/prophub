import { useEffect, useMemo, useState } from "react";
import { Redirect } from "wouter";
import { Show } from "@clerk/react";
import {
  type ChannelFilters,
  type ChannelSort,
  type User as StreamUser,
} from "stream-chat";
import {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  MessageComposer,
  Window,
  Thread,
  useChatContext,
} from "stream-chat-react";
import "stream-chat-react/css/index.css";
import "../styles/community.css";
import { useCommunityChat } from "../contexts/CommunityChatContext";
import {
  disableChatPush,
  enableChatPush,
  getChatPushStatus,
  getStoredPushPref,
  isWebPushSupported,
  setStoredPushPref,
} from "../lib/chatPush";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const PUBLIC_FILTERS: ChannelFilters = {
  type: "livestream",
  id: { $in: ["futures", "forex", "crypto", "announcements"] },
};

const publicSort: ChannelSort = [{ created_at: 1 }];

function NewDmDialog({
  open,
  onClose,
  onPick,
  supportUserId,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (user: StreamUser) => void;
  supportUserId: string;
}) {
  const { client } = useChatContext();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<StreamUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !client) return;
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const term = q.trim();
        const filter: Record<string, unknown> = term
          ? {
              $or: [
                { id: { $autocomplete: term } },
                { name: { $autocomplete: term } },
              ],
            }
          : { id: supportUserId };
        const r = await client.queryUsers(
          filter as Parameters<typeof client.queryUsers>[0],
          { name: 1 },
          { limit: 20 },
        );
        if (!cancelled) setResults(r.users.filter((u) => u.id !== client.userID));
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, open, client, supportUserId]);

  if (!open) return null;
  return (
    <div className="pf-chat-modal-mask" onClick={onClose}>
      <div className="pf-chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pf-chat-modal-head">
          <strong>发起私聊</strong>
          <button type="button" onClick={onClose} aria-label="关闭">×</button>
        </div>
        <input
          autoFocus
          className="pf-chat-search"
          placeholder="按昵称或用户 ID 搜索…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="pf-chat-userlist">
          {loading && <div className="pf-chat-empty">搜索中…</div>}
          {!loading && results.length === 0 && (
            <div className="pf-chat-empty">没有匹配的用户</div>
          )}
          {results.map((u) => (
            <button
              key={u.id}
              type="button"
              className="pf-chat-user-row"
              onClick={() => onPick(u)}
            >
              {u.image ? (
                <img src={String(u.image)} alt="" />
              ) : (
                <div className="pf-chat-avatar-fallback">
                  {(u.name || u.id).slice(0, 1)}
                </div>
              )}
              <div className="pf-chat-user-meta">
                <div className="pf-chat-user-name">
                  {u.name || u.id}
                  {(u as StreamUser & { official?: boolean }).official ? (
                    <span className="pf-chat-official">官方</span>
                  ) : null}
                </div>
                <div className="pf-chat-user-id">@{u.id}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChannelsSidebar({
  supportUserId,
  onOpenDm,
}: {
  supportUserId: string;
  onOpenDm: () => void;
}) {
  const { client, setActiveChannel } = useChatContext();
  const userId = client?.userID;

  const dmFilters: ChannelFilters = useMemo(
    () => ({
      type: "messaging",
      members: { $in: userId ? [userId] : [] },
    }),
    [userId],
  );

  const openSupport = async () => {
    if (!client || !userId) return;
    const ch = client.channel("messaging", {
      members: [userId, supportUserId],
    });
    await ch.watch();
    setActiveChannel(ch);
  };

  return (
    <aside className="pf-chat-sidebar">
      <NotificationSettings />
      <div className="pf-chat-sidebar-section">
        <div className="pf-chat-sidebar-title">公开频道</div>
        <ChannelList filters={PUBLIC_FILTERS} sort={publicSort} showChannelSearch={false} />
      </div>
      <div className="pf-chat-sidebar-section">
        <div className="pf-chat-sidebar-title pf-chat-row-actions">
          <span>私聊</span>
          <button type="button" className="pf-chat-mini-btn" onClick={onOpenDm}>
            + 新私聊
          </button>
        </div>
        {userId ? (
          <ChannelList
            filters={dmFilters}
            sort={{ last_message_at: -1 }}
            showChannelSearch={false}
            EmptyStateIndicator={() => (
              <div className="pf-chat-empty pf-chat-empty-pad">
                还没有私聊,点击「新私聊」搜索用户开始对话,
                或点击消息里别人的头像直接发起私聊。
              </div>
            )}
          />
        ) : null}
      </div>
      <button type="button" className="pf-chat-support-btn" onClick={openSupport}>
        联系官方客服
      </button>
    </aside>
  );
}

function NotificationSettings() {
  const supported = isWebPushSupported();
  const [status, setStatus] = useState<{
    permission: NotificationPermission | "unsupported";
    subscribed: boolean;
    pref: "on" | "off" | null;
  }>({ permission: "default", subscribed: false, pref: null });
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = async () => {
    const s = await getChatPushStatus();
    setStatus({
      permission: s.permission,
      subscribed: s.subscribed,
      pref: getStoredPushPref(),
    });
  };

  useEffect(() => {
    void refresh();
  }, []);

  const enabled = status.pref === "on" && status.subscribed && status.permission === "granted";
  const shouldPrompt =
    supported && status.pref === null && status.permission !== "denied";

  const onEnable = async () => {
    setBusy(true);
    setMsg(null);
    const r = await enableChatPush();
    setBusy(false);
    if (!r.ok) setMsg(r.reason);
    else setMsg("已开启桌面通知");
    await refresh();
  };

  const onDisable = async () => {
    setBusy(true);
    setMsg(null);
    await disableChatPush();
    setBusy(false);
    setMsg("已关闭桌面通知");
    await refresh();
  };

  const onDismissPrompt = () => {
    setStoredPushPref("off");
    void refresh();
  };

  if (!supported) return null;

  return (
    <div className="pf-chat-notify">
      {shouldPrompt && (
        <div className="pf-chat-notify-prompt">
          <span>开启桌面通知,关掉网页也能收到新私聊和 @ 提醒。</span>
          <div className="pf-chat-notify-prompt-actions">
            <button
              type="button"
              className="pf-chat-mini-btn"
              disabled={busy}
              onClick={onEnable}
            >
              开启
            </button>
            <button
              type="button"
              className="pf-chat-mini-btn pf-chat-notify-ghost"
              onClick={onDismissPrompt}
            >
              暂不
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        className="pf-chat-mod-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title="桌面通知设置"
      >
        {enabled ? "🔔 通知已开" : "🔕 通知未开"}
      </button>
      {open && (
        <div className="pf-chat-mod-panel">
          {status.permission === "denied" ? (
            <span className="pf-chat-mod-msg">
              浏览器已禁止本站通知,请在地址栏左侧的站点设置里允许通知后再试。
            </span>
          ) : enabled ? (
            <button
              type="button"
              className="pf-chat-mini-btn"
              disabled={busy}
              onClick={onDisable}
            >
              关闭桌面通知
            </button>
          ) : (
            <button
              type="button"
              className="pf-chat-mini-btn"
              disabled={busy}
              onClick={onEnable}
            >
              开启桌面通知
            </button>
          )}
          {msg && <span className="pf-chat-mod-msg">{msg}</span>}
        </div>
      )}
    </div>
  );
}

function useOpenChannelByCid() {
  const { client, setActiveChannel } = useChatContext();
  useEffect(() => {
    if (!client) return;

    const openByCid = async (cid: string) => {
      if (!cid || !cid.includes(":")) return;
      const [type, id] = cid.split(":");
      if (!type || !id) return;
      try {
        const list = await client.queryChannels(
          { cid: { $eq: cid } } as Parameters<typeof client.queryChannels>[0],
          {},
          { limit: 1, watch: true, state: true },
        );
        const ch = list[0] ?? client.channel(type, id);
        if (!list.length) await ch.watch();
        setActiveChannel(ch);
      } catch {
        /* ignore */
      }
    };

    // 1) Cold-open via ?cid=… in the URL
    try {
      const params = new URLSearchParams(window.location.search);
      const cid = params.get("cid");
      if (cid) {
        void openByCid(cid);
        params.delete("cid");
        const qs = params.toString();
        const next =
          window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
        window.history.replaceState({}, "", next);
      }
    } catch {
      /* ignore */
    }

    // 2) Already-open tab focused via service worker notificationclick
    const onSwMessage = (e: MessageEvent) => {
      const data = e.data as { type?: string; channelCid?: string | null };
      if (data?.type === "prophub-chat-open" && data.channelCid) {
        void openByCid(data.channelCid);
      }
    };
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", onSwMessage);
    }
    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", onSwMessage);
      }
    };
  }, [client, setActiveChannel]);
}

function ChatBody({ supportUserId }: { supportUserId: string }) {
  const [dmOpen, setDmOpen] = useState(false);
  const { client, channel, setActiveChannel } = useChatContext();
  useOpenChannelByCid();
  // Title sync mounted inside <Chat> so it has access to context.

  const pickUser = async (u: StreamUser) => {
    if (!client?.userID) return;
    const ch = client.channel("messaging", {
      members: [client.userID, u.id],
    });
    await ch.watch();
    setActiveChannel(ch);
    setDmOpen(false);
  };

  // DOM event delegation: clicking any message avatar opens a DM with that user.
  // Stream renders messages with `data-message-id` and avatars inside them; we
  // look up the message in channel state to get the author's user id.
  const handleAvatarClick = async (e: React.MouseEvent<HTMLElement>) => {
    if (!client || !client.userID || !channel) return;
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const avatar = target.closest(".str-chat__avatar");
    if (!avatar) return;
    const msgEl = avatar.closest<HTMLElement>("[data-message-id]");
    if (!msgEl) return;
    const messageId = msgEl.getAttribute("data-message-id");
    if (!messageId) return;
    const msg = channel.state.messages.find((m) => m.id === messageId);
    const otherId = msg?.user?.id;
    if (!otherId || otherId === client.userID) return;
    e.stopPropagation();
    const dm = client.channel("messaging", {
      members: [client.userID, otherId],
    });
    await dm.watch();
    setActiveChannel(dm);
  };

  return (
    <>
      <div className="pf-chat-layout">
        <ChannelsSidebar supportUserId={supportUserId} onOpenDm={() => setDmOpen(true)} />
        <main className="pf-chat-main" onClick={handleAvatarClick}>
          <Channel>
            <Window>
              <CustomChannelHeader supportUserId={supportUserId} />
              <MessageList />
              <MessageComposer />
            </Window>
            <Thread />
          </Channel>
        </main>
      </div>
      <NewDmDialog
        open={dmOpen}
        onClose={() => setDmOpen(false)}
        onPick={pickUser}
        supportUserId={supportUserId}
      />
    </>
  );
}

function AdminModerationControls() {
  const { client, channel } = useChatContext();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const role = client?.user?.role;
  const isAdmin = role === "admin" || role === "moderator";
  if (!isAdmin || !channel) return null;

  const submit = async (mode: "mute" | "ban") => {
    const id = target.trim();
    if (!id) return;
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "mute") {
        await client!.muteUser(id);
        setMsg(`已临时禁言 @${id}`);
      } else {
        await client!.banUser(id, {
          reason: "Prophub 社区违规",
          timeout: 60 * 24, // 24h
        });
        setMsg(`已踢出 @${id}(24 小时)`);
      }
      setTarget("");
    } catch (err) {
      setMsg(`操作失败:${(err as Error)?.message || "未知错误"}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pf-chat-mod">
      <button
        type="button"
        className="pf-chat-mod-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "收起客服工具" : "客服工具"}
      </button>
      {open && (
        <div className="pf-chat-mod-panel">
          <input
            placeholder="要处理的用户 ID"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="pf-chat-search"
            style={{ margin: 0 }}
          />
          <button
            type="button"
            className="pf-chat-mini-btn"
            disabled={busy || !target.trim()}
            onClick={() => submit("mute")}
          >
            禁言
          </button>
          <button
            type="button"
            className="pf-chat-mini-btn"
            style={{ background: "var(--orange)" }}
            disabled={busy || !target.trim()}
            onClick={() => submit("ban")}
          >
            踢出 24h
          </button>
          {msg && <span className="pf-chat-mod-msg">{msg}</span>}
        </div>
      )}
    </div>
  );
}

function CustomChannelHeader({ supportUserId }: { supportUserId: string }) {
  const { channel, client } = useChatContext();
  if (!channel) {
    return (
      <div className="pf-chat-header pf-chat-header-empty">
        请选择左侧频道或私聊开始交流
      </div>
    );
  }
  const data = channel.data as
    | (Record<string, unknown> & { name?: string; official?: boolean })
    | undefined;
  const memberMap = channel.state.members || {};
  const memberIds = Object.keys(memberMap);
  const isDmWithSupport =
    channel.type === "messaging" && memberIds.includes(supportUserId);
  // For DMs, show the OTHER user's name; otherwise fall back to channel name.
  let displayName = data?.name || channel.id || "";
  if (channel.type === "messaging" && client?.userID) {
    const other = memberIds.find((id) => id !== client.userID);
    if (other) {
      const m = memberMap[other];
      displayName = m?.user?.name || other;
    }
  }
  const isOfficial = Boolean(data?.official) || isDmWithSupport;
  const memberCount =
    (data?.member_count as number | undefined) ?? memberIds.length;
  return (
    <header className="pf-chat-header">
      <div className="pf-chat-header-title">
        <strong>{displayName}</strong>
        {isOfficial && <span className="pf-chat-official">官方</span>}
      </div>
      <div className="pf-chat-header-meta">
        <span>{memberCount} 位成员</span>
        <AdminModerationControls />
      </div>
    </header>
  );
}

function useDocumentTheme(): "str-chat__theme-dark" | "str-chat__theme-light" {
  const read = () => {
    if (typeof document === "undefined") return "str-chat__theme-dark" as const;
    const t = document.documentElement.getAttribute("data-theme");
    // Both dark and high-contrast use the dark Stream base; light maps to light.
    return t === "light"
      ? ("str-chat__theme-light" as const)
      : ("str-chat__theme-dark" as const);
  };
  const [theme, setTheme] = useState(read);
  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(read()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);
  return theme;
}

function CommunityShell() {
  const { client, error, supportUserId } = useCommunityChat();
  const streamTheme = useDocumentTheme();

  if (error) {
    return (
      <div className="pf-chat-status">
        <h2>聊天暂时不可用</h2>
        <p>{error}</p>
        <p className="pf-chat-status-hint">
          请稍后再试。如果反复出现,请联系站务。
        </p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="pf-chat-status">
        <div className="pf-chat-spinner" />
        <p>正在接入社区聊天…</p>
      </div>
    );
  }

  return (
    <Chat client={client} theme={streamTheme}>
      <ChatBody supportUserId={supportUserId} />
    </Chat>
  );
}

export default function CommunityPage() {
  return (
    <div className="pf-community-root">
      <Show when="signed-in">
        <CommunityShell />
      </Show>
      <Show when="signed-out">
        <Redirect to={`/sign-in?redirect_url=${encodeURIComponent(`${basePath}/community`)}`} />
      </Show>
    </div>
  );
}

export function CommunityPageNoAuth() {
  return (
    <div className="pf-chat-status">
      <h2>社区聊天需要登录</h2>
      <p>账号系统暂未启用,社区聊天功能尚不可用。</p>
    </div>
  );
}
