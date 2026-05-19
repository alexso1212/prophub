import { useAuth } from "@clerk/expo";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type {
  Channel as StreamChannel,
  LocalMessage,
  User as StreamUser,
} from "stream-chat";

import {
  ArrowLeftIcon,
  PaperclipIcon,
  SendIcon,
} from "@/components/icons";
import { useColors } from "@/hooks/useColors";
import {
  useCommunityChat,
  type ChannelDescriptor,
} from "@/hooks/useCommunityChat";

const PUBLIC_CHANNEL_IDS = ["futures", "forex", "crypto", "announcements"];

type ChannelRow = {
  key: string;
  channel: StreamChannel;
  title: string;
  subtitle: string;
  unread: number;
  isOfficial: boolean;
  isDm: boolean;
};

const CLERK_CONFIGURED = Boolean(process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function CommunityScreen() {
  // When Clerk is not configured, ClerkProvider is not mounted (see _layout.tsx).
  // Calling useAuth() under those conditions would crash — short-circuit first.
  if (!CLERK_CONFIGURED) {
    return <NotConfiguredView />;
  }
  return <CommunityScreenInner />;
}

function NotConfiguredView() {
  const c = useColors();
  return (
    <View style={[styles.center, { backgroundColor: c.background, padding: 24 }]}>
      <Text style={[styles.title, { color: c.foreground }]}>社区聊天</Text>
      <Text style={[styles.muted, { color: c.mutedForeground, textAlign: "center", marginTop: 8 }]}>
        登录功能尚未启用,社区聊天暂不可用。{"\n"}
        管理员开启登录后即可使用。
      </Text>
    </View>
  );
}

function CommunityScreenInner() {
  const c = useColors();
  const { isSignedIn } = useAuth();
  const { client, supportUserId, channels, loading, error } = useCommunityChat();
  const [active, setActive] = useState<StreamChannel | null>(null);

  // Deep-link from a push notification tap (see usePushNotifications):
  // when the URL carries channelType + channelId, auto-open that channel.
  const params = useLocalSearchParams<{ channelType?: string; channelId?: string }>();
  const lastDeepLinkRef = useRef<string | null>(null);
  useEffect(() => {
    if (!client) return;
    const type = params.channelType;
    const id = params.channelId;
    if (!type || !id) return;
    const key = `${type}:${id}`;
    if (lastDeepLinkRef.current === key) return;
    lastDeepLinkRef.current = key;
    (async () => {
      try {
        const ch = client.channel(type, id);
        await ch.watch();
        setActive(ch);
      } catch {
        /* channel may not exist; ignore */
      }
    })();
  }, [client, params.channelType, params.channelId]);

  // Not signed in → friendly prompt.
  if (!isSignedIn) {
    return (
      <View style={[styles.center, { backgroundColor: c.background, padding: 24 }]}>
        <Text style={[styles.title, { color: c.foreground }]}>社区聊天</Text>
        <Text style={[styles.muted, { color: c.mutedForeground, textAlign: "center", marginTop: 8 }]}>
          请先登录以加入社区,与其他交易员交流。{"\n"}
          目前请使用 Web 端登录,登录后手机端会自动同步。
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: c.background, padding: 24 }]}>
        <Text style={[styles.title, { color: c.foreground }]}>聊天暂时不可用</Text>
        <Text style={[styles.muted, { color: c.mutedForeground, textAlign: "center", marginTop: 8 }]}>
          {error}
        </Text>
      </View>
    );
  }

  if (loading || !client) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ActivityIndicator color={c.primary} />
        <Text style={[styles.muted, { color: c.mutedForeground, marginTop: 12 }]}>
          正在接入社区聊天…
        </Text>
      </View>
    );
  }

  if (active) {
    return (
      <ChannelView
        channel={active}
        client={client}
        onBack={() => setActive(null)}
      />
    );
  }

  return (
    <ChannelListView
      client={client}
      seedChannels={channels}
      supportUserId={supportUserId}
      onPick={setActive}
    />
  );
}

function ChannelListView({
  client,
  seedChannels,
  supportUserId,
  onPick,
}: {
  client: NonNullable<ReturnType<typeof useCommunityChat>["client"]>;
  seedChannels: ChannelDescriptor[];
  supportUserId: string;
  onPick: (ch: StreamChannel) => void;
}) {
  const c = useColors();
  const [publicRows, setPublicRows] = useState<ChannelRow[]>([]);
  const [dmRows, setDmRows] = useState<ChannelRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newDmOpen, setNewDmOpen] = useState(false);

  const loadChannels = useCallback(async () => {
    if (!client.userID) return;
    setRefreshing(true);
    try {
      const ids =
        seedChannels.length > 0
          ? seedChannels.map((s) => s.id)
          : PUBLIC_CHANNEL_IDS;
      const pubs = await client.queryChannels(
        { type: "livestream", id: { $in: ids } },
        [{ created_at: 1 }],
        { state: true, watch: true, presence: false, limit: 30 },
      );
      const dms = await client.queryChannels(
        { type: "messaging", members: { $in: [client.userID] } },
        [{ last_message_at: -1 }],
        { state: true, watch: true, presence: false, limit: 30 },
      );
      setPublicRows(pubs.map((ch) => toRow(ch, client.userID!, supportUserId)));
      setDmRows(dms.map((ch) => toRow(ch, client.userID!, supportUserId)));
    } finally {
      setRefreshing(false);
    }
  }, [client, seedChannels, supportUserId]);

  useEffect(() => {
    loadChannels();
    const handler = () => loadChannels();
    client.on("message.new", handler);
    client.on("notification.added_to_channel", handler);
    client.on("notification.message_new", handler);
    return () => {
      client.off("message.new", handler);
      client.off("notification.added_to_channel", handler);
      client.off("notification.message_new", handler);
    };
  }, [client, loadChannels]);

  const openSupport = async () => {
    if (!client.userID) return;
    const ch = client.channel("messaging", {
      members: [client.userID, supportUserId],
    });
    await ch.watch();
    onPick(ch);
  };

  const handlePickUser = async (u: StreamUser) => {
    if (!client.userID) return;
    const ch = client.channel("messaging", {
      members: [client.userID, u.id],
    });
    await ch.watch();
    setNewDmOpen(false);
    onPick(ch);
  };

  return (
    <View style={[{ flex: 1, backgroundColor: c.background }]}>
      <FlatList
        data={[]}
        renderItem={null as never}
        keyExtractor={() => ""}
        refreshing={refreshing}
        onRefresh={loadChannels}
        ListHeaderComponent={
          <View>
            <SectionHeader label="公开频道" />
            {publicRows.length === 0 ? (
              <EmptyHint text="暂无公开频道,请稍后再试" />
            ) : (
              publicRows.map((row) => (
                <ChannelRowItem key={row.key} row={row} onPress={onPick} />
              ))
            )}

            <SectionHeader
              label="私聊"
              action={
                <TouchableOpacity onPress={() => setNewDmOpen(true)}>
                  <Text style={[styles.actionBtn, { color: c.primary }]}>
                    + 新私聊
                  </Text>
                </TouchableOpacity>
              }
            />
            {dmRows.length === 0 ? (
              <EmptyHint text="还没有私聊,点击「新私聊」搜索用户开始对话" />
            ) : (
              dmRows.map((row) => (
                <ChannelRowItem key={row.key} row={row} onPress={onPick} />
              ))
            )}

            <Pressable
              onPress={openSupport}
              style={[
                styles.supportBtn,
                { backgroundColor: c.primary, marginHorizontal: 16, marginTop: 16, marginBottom: 24 },
              ]}
            >
              <Text style={[styles.supportBtnText, { color: c.primaryForeground }]}>
                联系官方客服
              </Text>
            </Pressable>
          </View>
        }
      />

      <NewDmDialog
        open={newDmOpen}
        onClose={() => setNewDmOpen(false)}
        onPick={handlePickUser}
        client={client}
        supportUserId={supportUserId}
      />
    </View>
  );
}

function toRow(
  channel: StreamChannel,
  myId: string,
  supportUserId: string,
): ChannelRow {
  const data = (channel.data || {}) as {
    name?: string;
    official?: boolean;
  };
  const isDm = channel.type === "messaging";
  const members = channel.state.members || {};
  const otherId = isDm
    ? Object.keys(members).find((id) => id !== myId)
    : undefined;
  let title = data.name || channel.id || "频道";
  if (isDm && otherId) {
    title = members[otherId]?.user?.name || otherId;
  }
  const last = channel.state.messages[channel.state.messages.length - 1];
  const subtitle = lastMessageText(last);
  const unread =
    typeof channel.countUnread === "function" ? channel.countUnread() : 0;
  const isOfficial =
    Boolean(data.official) || (isDm && otherId === supportUserId);
  return {
    key: `${channel.type}:${channel.id || otherId || Math.random()}`,
    channel,
    title,
    subtitle,
    unread,
    isOfficial,
    isDm,
  };
}

function lastMessageText(msg?: LocalMessage): string {
  if (!msg) return "暂无消息";
  if (msg.deleted_at) return "该消息已删除";
  if (msg.text) return msg.text;
  const attachments = msg.attachments || [];
  if (attachments.some((a) => a?.type === "image")) return "[图片]";
  return "[消息]";
}

function SectionHeader({
  label,
  action,
}: {
  label: string;
  action?: React.ReactNode;
}) {
  const c = useColors();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionLabel, { color: c.mutedForeground }]}>
        {label}
      </Text>
      {action}
    </View>
  );
}

function EmptyHint({ text }: { text: string }) {
  const c = useColors();
  return (
    <Text style={[styles.empty, { color: c.mutedForeground }]}>{text}</Text>
  );
}

function ChannelRowItem({
  row,
  onPress,
}: {
  row: ChannelRow;
  onPress: (ch: StreamChannel) => void;
}) {
  const c = useColors();
  return (
    <Pressable
      onPress={() => onPress(row.channel)}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? c.cardSolid : "transparent",
          borderBottomColor: c.border,
        },
      ]}
    >
      <View
        style={[
          styles.avatar,
          { backgroundColor: row.isOfficial ? c.primary : c.cardSolid },
        ]}
      >
        <Text
          style={{
            color: row.isOfficial ? c.primaryForeground : c.foreground,
            fontFamily: "Inter_600SemiBold",
          }}
        >
          {(row.title || "?").slice(0, 1).toUpperCase()}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text
            numberOfLines={1}
            style={[styles.rowTitle, { color: c.foreground }]}
          >
            {row.title}
          </Text>
          {row.isOfficial && (
            <View
              style={[
                styles.officialPill,
                { backgroundColor: c.primary + "22", borderColor: c.primary },
              ]}
            >
              <Text style={[styles.officialPillText, { color: c.primary }]}>
                官方
              </Text>
            </View>
          )}
        </View>
        <Text
          numberOfLines={1}
          style={[styles.rowSub, { color: c.mutedForeground }]}
        >
          {row.subtitle}
        </Text>
      </View>
      {row.unread > 0 && (
        <View style={[styles.unreadBadge, { backgroundColor: c.primary }]}>
          <Text style={[styles.unreadText, { color: c.primaryForeground }]}>
            {row.unread > 99 ? "99+" : row.unread}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function NewDmDialog({
  open,
  onClose,
  onPick,
  client,
  supportUserId,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (u: StreamUser) => void;
  client: NonNullable<ReturnType<typeof useCommunityChat>["client"]>;
  supportUserId: string;
}) {
  const c = useColors();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<StreamUser[]>([]);

  useEffect(() => {
    if (!open) return;
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
        if (!cancelled) {
          setResults(r.users.filter((u) => u.id !== client.userID));
        }
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

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable
        style={[styles.modalMask, { backgroundColor: "rgba(0,0,0,0.45)" }]}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[styles.modalCard, { backgroundColor: c.background }]}
        >
          <View style={styles.modalHead}>
            <Text style={[styles.title, { color: c.foreground }]}>
              发起私聊
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.actionBtn, { color: c.mutedForeground }]}>
                关闭
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            autoFocus
            value={q}
            onChangeText={setQ}
            placeholder="按昵称或用户 ID 搜索…"
            placeholderTextColor={c.textMuted}
            style={[
              styles.input,
              {
                color: c.foreground,
                backgroundColor: c.cardSolid,
                borderColor: c.border,
              },
            ]}
          />
          <FlatList
            data={results}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(u) => u.id}
            ListEmptyComponent={
              <Text style={[styles.empty, { color: c.mutedForeground }]}>
                {loading ? "搜索中…" : "没有匹配的用户"}
              </Text>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onPick(item)}
                style={({ pressed }) => [
                  styles.userRow,
                  {
                    backgroundColor: pressed ? c.cardSolid : "transparent",
                  },
                ]}
              >
                {item.image ? (
                  <Image
                    source={{ uri: String(item.image) }}
                    style={styles.userAvatar}
                  />
                ) : (
                  <View
                    style={[
                      styles.userAvatar,
                      {
                        backgroundColor: c.cardSolid,
                        alignItems: "center",
                        justifyContent: "center",
                      },
                    ]}
                  >
                    <Text style={{ color: c.foreground }}>
                      {(item.name || item.id).slice(0, 1).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: c.foreground, fontFamily: "Inter_600SemiBold" }}>
                    {item.name || item.id}
                  </Text>
                  <Text style={{ color: c.mutedForeground, fontSize: 12 }}>
                    @{item.id}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// =============================================================================
// Channel view: message list + composer with image upload
// =============================================================================

function ChannelView({
  channel,
  client,
  onBack,
}: {
  channel: StreamChannel;
  client: NonNullable<ReturnType<typeof useCommunityChat>["client"]>;
  onBack: () => void;
}) {
  const c = useColors();
  const [messages, setMessages] = useState<LocalMessage[]>(
    [...(channel.state.messages || [])],
  );
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [reportTarget, setReportTarget] = useState<LocalMessage | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await channel.watch();
        await channel.markRead();
        if (mounted) setMessages([...channel.state.messages]);
      } catch {
        /* noop */
      }
    })();
    const handler = () => {
      if (!mounted) return;
      setMessages([...channel.state.messages]);
      channel.markRead().catch(() => undefined);
    };
    channel.on("message.new", handler);
    channel.on("message.updated", handler);
    channel.on("message.deleted", handler);
    return () => {
      mounted = false;
      channel.off("message.new", handler);
      channel.off("message.updated", handler);
      channel.off("message.deleted", handler);
    };
  }, [channel]);

  const headerTitle = useMemo(() => {
    const data = (channel.data || {}) as { name?: string };
    if (channel.type !== "messaging") return data.name || channel.id || "";
    const members = channel.state.members || {};
    const otherId = Object.keys(members).find((id) => id !== client.userID);
    if (otherId) return members[otherId]?.user?.name || otherId;
    return data.name || channel.id || "";
  }, [channel, client.userID]);

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await channel.sendMessage({ text });
      setDraft("");
    } catch {
      /* noop */
    } finally {
      setSending(false);
    }
  };

  const pickAndSendImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      base64: false,
    });
    if (res.canceled || !res.assets?.length) return;
    const asset = res.assets[0];
    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      return;
    }
    setSending(true);
    try {
      const fileName = asset.fileName || `upload-${Date.now()}.jpg`;
      const mimeType = asset.mimeType || "image/jpeg";
      // React Native's FormData accepts the {uri,name,type} shape; cast to satisfy DOM File typing.
      const file = {
        uri: asset.uri,
        name: fileName,
        type: mimeType,
      } as unknown as File;
      const uploaded = await channel.sendImage(file, fileName, mimeType);
      await channel.sendMessage({
        attachments: [
          {
            type: "image",
            image_url: uploaded.file,
            asset_url: uploaded.file,
          },
        ],
      });
    } catch {
      /* noop */
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: c.background }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <View style={[styles.chatHeader, { borderBottomColor: c.border }]}>
        <TouchableOpacity onPress={onBack} style={{ padding: 6 }}>
          <ArrowLeftIcon color={c.foreground} />
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={[styles.title, { color: c.foreground, marginLeft: 8 }]}
        >
          {headerTitle}
        </Text>
      </View>

      <FlatList
        data={messages}
        inverted
        keyExtractor={(m) => m.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12, gap: 8, flexDirection: "column-reverse" }}
        renderItem={({ item }) => (
          <MessageBubble
            msg={item}
            myId={client.userID || ""}
            onReport={() => setReportTarget(item)}
          />
        )}
        ListEmptyComponent={
          <View style={{ paddingVertical: 32, alignItems: "center" }}>
            <Text style={{ color: c.mutedForeground }}>暂无消息,来打个招呼吧</Text>
          </View>
        }
      />

      <ReportMessageModal
        target={reportTarget}
        myId={client.userID || ""}
        onClose={() => setReportTarget(null)}
        onSubmit={async (reason) => {
          const id = reportTarget?.id;
          if (!id) return;
          try {
            await client.flagMessage(id, reason ? { reason } : undefined);
            Alert.alert("已提交举报", "管理员会尽快在后台审核。感谢你的反馈!");
          } catch (err) {
            const m = (err as Error)?.message || "未知错误";
            if (/already.*flagged|duplicate/i.test(m)) {
              Alert.alert("提示", "你已经举报过这条消息了。");
            } else {
              Alert.alert("举报失败", m);
            }
          } finally {
            setReportTarget(null);
          }
        }}
      />

      <View
        style={[
          styles.composer,
          { borderTopColor: c.border, backgroundColor: c.background },
        ]}
      >
        <TouchableOpacity onPress={pickAndSendImage} disabled={sending} style={{ padding: 8 }}>
          <PaperclipIcon color={c.mutedForeground} />
        </TouchableOpacity>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="发条消息…"
          placeholderTextColor={c.textMuted}
          multiline
          style={[
            styles.composerInput,
            {
              color: c.foreground,
              backgroundColor: c.cardSolid,
              borderColor: c.border,
            },
          ]}
        />
        <TouchableOpacity
          onPress={send}
          disabled={sending || !draft.trim()}
          style={{ padding: 8, opacity: !draft.trim() ? 0.4 : 1 }}
        >
          <SendIcon color={c.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({
  msg,
  myId,
  onReport,
}: {
  msg: LocalMessage;
  myId: string;
  onReport: () => void;
}) {
  const c = useColors();
  const mine = msg.user?.id === myId;
  const attachments = msg.attachments || [];
  const imageAttachments = attachments.filter((a) => a?.type === "image");

  const handleLongPress = () => {
    if (mine) return; // can't report your own
    const buttons: Parameters<typeof Alert.alert>[2] = [
      { text: "举报这条消息", style: "destructive", onPress: onReport },
      { text: "取消", style: "cancel" },
    ];
    Alert.alert("操作", "选择对这条消息的操作", buttons);
  };

  return (
    <Pressable
      onLongPress={handleLongPress}
      delayLongPress={350}
      style={[
        styles.bubbleRow,
        { justifyContent: mine ? "flex-end" : "flex-start" },
      ]}
    >
      {!mine && (
        <View
          style={[styles.bubbleAvatar, { backgroundColor: c.cardSolid }]}
        >
          {msg.user?.image ? (
            <Image
              source={{ uri: String(msg.user.image) }}
              style={styles.bubbleAvatar}
            />
          ) : (
            <Text style={{ color: c.foreground, fontSize: 12 }}>
              {(msg.user?.name || msg.user?.id || "?").slice(0, 1).toUpperCase()}
            </Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: mine ? c.primary : c.cardSolid,
            borderColor: c.border,
          },
        ]}
      >
        {!mine && (
          <Text
            style={{
              color: c.mutedForeground,
              fontSize: 11,
              marginBottom: 2,
              fontFamily: "Inter_500Medium",
            }}
          >
            {msg.user?.name || msg.user?.id}
          </Text>
        )}
        {imageAttachments.map((a, i) => {
          const url = a.image_url || a.asset_url || a.thumb_url;
          if (!url) return null;
          return (
            <Image
              key={i}
              source={{ uri: String(url) }}
              style={styles.bubbleImage}
              resizeMode="cover"
            />
          );
        })}
        {!!msg.text && (
          <Text
            style={{
              color: mine ? c.primaryForeground : c.foreground,
              fontSize: 14,
            }}
          >
            {msg.text}
          </Text>
        )}
        {!mine && (
          <TouchableOpacity
            onPress={onReport}
            hitSlop={8}
            style={styles.reportBtn}
          >
            <Text style={[styles.reportBtnText, { color: c.mutedForeground }]}>
              举报
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );
}

function ReportMessageModal({
  target,
  myId,
  onClose,
  onSubmit,
}: {
  target: LocalMessage | null;
  myId: string;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void> | void;
}) {
  const c = useColors();
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (target) setReason("");
  }, [target]);

  const open = Boolean(target);
  const isMine = target?.user?.id === myId;
  const preview = (target?.text || "[图片或附件]").slice(0, 120);

  return (
    <Modal visible={open} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable
        style={[styles.modalMask, { backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 24 }]}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: c.background,
            borderRadius: 14,
            padding: 18,
            gap: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: c.border,
          }}
        >
          <Text style={[styles.title, { color: c.foreground }]}>举报这条消息</Text>
          {isMine ? (
            <Text style={{ color: c.mutedForeground }}>不能举报自己发的消息。</Text>
          ) : (
            <>
              <Text style={{ color: c.mutedForeground, fontSize: 13 }} numberOfLines={3}>
                内容预览:{preview}
              </Text>
              <TextInput
                value={reason}
                onChangeText={setReason}
                placeholder="可选:简单描述举报理由"
                placeholderTextColor={c.textMuted}
                multiline
                maxLength={200}
                style={[
                  styles.input,
                  {
                    color: c.foreground,
                    backgroundColor: c.cardSolid,
                    borderColor: c.border,
                    minHeight: 72,
                    textAlignVertical: "top",
                    marginBottom: 0,
                  },
                ]}
              />
            </>
          )}
          <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>
            <TouchableOpacity onPress={onClose} disabled={busy} style={{ padding: 10 }}>
              <Text style={{ color: c.mutedForeground, fontFamily: "Inter_600SemiBold" }}>
                取消
              </Text>
            </TouchableOpacity>
            {!isMine && (
              <TouchableOpacity
                onPress={async () => {
                  setBusy(true);
                  try {
                    await onSubmit(reason.trim().slice(0, 200));
                  } finally {
                    setBusy(false);
                  }
                }}
                disabled={busy}
                style={{
                  backgroundColor: c.primary,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  opacity: busy ? 0.6 : 1,
                }}
              >
                <Text style={{ color: c.primaryForeground, fontFamily: "Inter_600SemiBold" }}>
                  {busy ? "提交中…" : "提交举报"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontFamily: "Inter_700Bold" },
  muted: { fontSize: 14 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  actionBtn: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  empty: { paddingHorizontal: 16, paddingVertical: 12, fontSize: 13 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  rowSub: { fontSize: 13, marginTop: 2 },
  officialPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
  },
  officialPillText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  supportBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  supportBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  modalMask: { flex: 1, justifyContent: "flex-end" },
  modalCard: {
    height: "75%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  userAvatar: { width: 36, height: 36, borderRadius: 18 },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  composerInput: {
    flex: 1,
    minHeight: 38,
    maxHeight: 120,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  bubbleRow: { flexDirection: "row", alignItems: "flex-end", gap: 6 },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleImage: {
    width: 180,
    height: 180,
    borderRadius: 8,
    marginBottom: 4,
  },
  reportBtn: {
    alignSelf: "flex-end",
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  reportBtnText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});
