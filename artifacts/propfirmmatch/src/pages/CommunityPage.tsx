import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Redirect } from "wouter";
import { Show, useUser } from "@clerk/react";
import {
  StreamChat,
  type Channel as StreamChannel,
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

type TokenResponse = {
  apiKey: string;
  userId: string;
  token: string;
  supportUserId: string;
};

function useStreamConnection() {
  const { user } = useUser();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<TokenResponse | null>(null);

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
        setMeta(data);
      } catch (err) {
        if (!cancelled) {
          setError((err as Error)?.message || "聊天连接失败");
        }
      }
    })();

    return () => {
      cancelled = true;
      if (connectedClient) {
        connectedClient.disconnectUser().catch(() => undefined);
      }
      setClient(null);
    };
  }, [user]);

  return { client, error, meta };
}

function UnreadTitleBadge() {
  const { client } = useChatContext();
  useEffect(() => {
    if (!client) return;
    const original = document.title.replace(/^\(\d+\)\s*/, "");
    const update = (count: number) => {
      document.title = count > 0 ? `(${count}) ${original}` : original;
    };
    const computeTotal = () => {
      const channels = Object.values(client.activeChannels || {});
      let total = 0;
      for (const ch of channels) {
        total += ch.countUnread();
      }
      update(total);
    };
    computeTotal();
    const handler = () => computeTotal();
    client.on("notification.message_new", handler);
    client.on("message.new", handler);
    client.on("notification.mark_read", handler);
    client.on("message.read", handler);
    return () => {
      client.off("notification.message_new", handler);
      client.off("message.new", handler);
      client.off("notification.mark_read", handler);
      client.off("message.read", handler);
      document.title = original;
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
          ? { name: { $autocomplete: term } }
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
          placeholder="按昵称搜索用户…"
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
                还没有私聊，点击「新私聊」搜索用户开始对话。
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
  const { client, setActiveChannel } = useChatContext();

  const pickUser = async (u: StreamUser) => {
    if (!client?.userID) return;
    const ch = client.channel("messaging", {
      members: [client.userID, u.id],
    });
    await ch.watch();
    setActiveChannel(ch);
    setDmOpen(false);
  };

  return (
    <>
      <UnreadTitleBadge />
      <div className="pf-chat-layout">
        <ChannelsSidebar supportUserId={supportUserId} onOpenDm={() => setDmOpen(true)} />
        <main className="pf-chat-main">
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
      <div className="pf-chat-header-meta">{memberCount} 位成员</div>
    </header>
  );
}

function CommunityShell() {
  const { client, error } = useStreamConnection();

  if (error) {
    return (
      <div className="pf-chat-status">
        <h2>聊天暂时不可用</h2>
        <p>{error}</p>
        <p className="pf-chat-status-hint">
          请稍后再试。如果反复出现，请联系站务。
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
      <ChatBody supportUserId="support" />
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
      <p>账号系统暂未启用，社区聊天功能尚不可用。</p>
    </div>
  );
}
