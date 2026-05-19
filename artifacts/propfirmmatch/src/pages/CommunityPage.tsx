import { useEffect, useMemo, useState } from "react";
import { Redirect } from "wouter";
import { Show, useUser } from "@clerk/react";
import {
  StreamChat,
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

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const PUBLIC_FILTERS: ChannelFilters = {
  type: "livestream",
  id: { $in: ["futures", "forex", "crypto", "announcements"] },
};

const publicSort: ChannelSort = [{ created_at: 1 }];

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_FILES_PER_MESSAGE = 4;
const UNREAD_EVENT = "prophub-chat-unread";

type TokenResponse = {
  apiKey: string;
  userId: string;
  token: string;
  supportUserId: string;
};

function dispatchUnread(count: number) {
  try {
    window.dispatchEvent(new CustomEvent<number>(UNREAD_EVENT, { detail: count }));
  } catch {
    /* noop */
  }
}

function useStreamConnection() {
  const { user } = useUser();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [supportUserId, setSupportUserId] = useState<string>("support");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    let connectedClient: StreamChat | null = null;

    (async () => {
      try {
        const displayName =
          user.fullName ||
          user.username ||
          user.primaryEmailAddress?.emailAddress ||
          `用户`;
        const image = user.imageUrl;

        const res = await fetch("/api/chat/token", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: displayName, image }),
        });

        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { message?: string };
          throw new Error(body.message || `获取聊天 token 失败 (${res.status})`);
        }
        const data = (await res.json()) as TokenResponse;
        if (cancelled) return;

        const c = StreamChat.getInstance(data.apiKey);

        // Configure attachment limits BEFORE composer instances are created.
        c.setMessageComposerSetupFunction(({ composer }) => {
          try {
            composer.attachmentManager.acceptedFiles = ACCEPTED_IMAGE_TYPES;
            composer.attachmentManager.maxNumberOfFilesPerMessage = MAX_FILES_PER_MESSAGE;
            composer.attachmentManager.fileUploadFilter = (file) => {
              const f = (file?.localMetadata as { file?: File } | undefined)?.file;
              if (!f || !(f instanceof File)) return true;
              if (f.size > MAX_UPLOAD_BYTES) {
                window.alert("图片不能超过 5 MB");
                return false;
              }
              if (f.type && !ACCEPTED_IMAGE_TYPES.includes(f.type)) {
                window.alert("仅支持 JPG / PNG / WEBP 格式");
                return false;
              }
              return true;
            };
          } catch {
            /* setup is best-effort */
          }
        });

        await c.connectUser(
          { id: data.userId, name: displayName, image },
          data.token,
        );
        if (cancelled) {
          await c.disconnectUser();
          return;
        }
        connectedClient = c;
        setClient(c);
        setSupportUserId(data.supportUserId || "support");
      } catch (err) {
        if (!cancelled) {
          setError((err as Error)?.message || "聊天连接失败");
        }
      }
    })();

    return () => {
      cancelled = true;
      dispatchUnread(0);
      if (connectedClient) {
        connectedClient.disconnectUser().catch(() => undefined);
      }
      setClient(null);
    };
  }, [user]);

  return { client, error, supportUserId };
}

function UnreadBroadcaster() {
  // Note: unread badge is scoped to while the /community page is mounted
  // because we connect/disconnect the Stream client there. Persistent
  // background unread (outside /community) is intentionally out of scope and
  // belongs to the Web Push follow-up task.
  const { client } = useChatContext();
  useEffect(() => {
    if (!client) return;
    const original = document.title.replace(/^\(\d+\)\s*/, "");
    const update = (count: number) => {
      document.title = count > 0 ? `(${count}) ${original}` : original;
      dispatchUnread(count);
    };

    // Prefer Stream's authoritative global unread counter (covers channels
    // that aren't currently watched), falling back to active-channel sum.
    const computeTotal = (eventCount?: number) => {
      if (typeof eventCount === "number") return update(eventCount);
      const fromUser = (client.user as { total_unread_count?: number } | undefined)
        ?.total_unread_count;
      if (typeof fromUser === "number") return update(fromUser);
      const channels = Object.values(client.activeChannels || {});
      let total = 0;
      for (const ch of channels) total += ch.countUnread();
      update(total);
    };

    computeTotal();
    const onEvent = (e: { total_unread_count?: number }) =>
      computeTotal(typeof e?.total_unread_count === "number" ? e.total_unread_count : undefined);
    client.on("notification.message_new", onEvent);
    client.on("notification.mark_read", onEvent);
    client.on("message.new", onEvent);
    client.on("message.read", onEvent);
    return () => {
      client.off("notification.message_new", onEvent);
      client.off("notification.mark_read", onEvent);
      client.off("message.new", onEvent);
      client.off("message.read", onEvent);
      document.title = original;
      dispatchUnread(0);
    };
  }, [client]);
  return null;
}

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

function ChatBody({ supportUserId }: { supportUserId: string }) {
  const [dmOpen, setDmOpen] = useState(false);
  const { client, channel, setActiveChannel } = useChatContext();

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
      <UnreadBroadcaster />
      <div className="pf-chat-layout">
        <ChannelsSidebar supportUserId={supportUserId} onOpenDm={() => setDmOpen(true)} />
        <main className="pf-chat-main" onClick={handleAvatarClick}>
          <Channel>
            <Window>
              <CustomChannelHeader />
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

function CustomChannelHeader() {
  const { channel } = useChatContext();
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
  const name = data?.name || channel.id;
  const isOfficial = Boolean(data?.official);
  const memberCount =
    (data?.member_count as number | undefined) ??
    Object.keys(channel.state.members || {}).length;
  return (
    <header className="pf-chat-header">
      <div className="pf-chat-header-title">
        <strong>{name}</strong>
        {isOfficial && <span className="pf-chat-official">官方</span>}
      </div>
      <div className="pf-chat-header-meta">
        <span>{memberCount} 位成员</span>
        <AdminModerationControls />
      </div>
    </header>
  );
}

function CommunityShell() {
  const { client, error, supportUserId } = useStreamConnection();

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
    <Chat client={client} theme="str-chat__theme-dark">
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
