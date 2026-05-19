import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/expo";
import {
  StreamChat,
  type Channel as StreamChannel,
  type User as StreamUser,
} from "stream-chat";
import { usePushNotifications } from "./usePushNotifications";

export type ChannelDescriptor = { id: string; name: string };

export type CommunityChatState = {
  client: StreamChat | null;
  supportUserId: string;
  channels: ChannelDescriptor[];
  loading: boolean;
  error: string | null;
};

const API_BASE = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : "";

type TokenResponse = {
  apiKey: string;
  userId: string;
  token: string;
  supportUserId: string;
  channels: ChannelDescriptor[];
};

/**
 * Connects the signed-in Clerk user to Stream Chat using the same
 * /api/chat/token endpoint as the web app. Returns a singleton-style
 * client; disconnects on sign-out / unmount.
 */
export function useCommunityChat(): CommunityChatState {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [supportUserId, setSupportUserId] = useState("support");
  const [channels, setChannels] = useState<ChannelDescriptor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn || !user) {
      setClient(null);
      setError(null);
      return;
    }
    let cancelled = false;
    let connected: StreamChat | null = null;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const displayName =
          user.fullName ||
          user.username ||
          user.primaryEmailAddress?.emailAddress ||
          "用户";
        const image = user.imageUrl;

        const sessionToken = await getToken();
        if (!sessionToken) throw new Error("无法获取登录凭证");

        const res = await fetch(`${API_BASE}/api/chat/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ name: displayName, image }),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as {
            message?: string;
          };
          throw new Error(
            body.message || `获取聊天 token 失败 (${res.status})`,
          );
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
        connected = c;
        setClient(c);
        setSupportUserId(data.supportUserId || "support");
        setChannels(data.channels || []);
      } catch (err) {
        if (!cancelled) {
          setError((err as Error)?.message || "聊天连接失败");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      setClient(null);
      if (connected) {
        connected.disconnectUser().catch(() => undefined);
      }
    };
  }, [isSignedIn, user, getToken]);

  // Side-effect: once the chat user is connected, register this device's
  // Expo push token with Stream so background push notifications work.
  usePushNotifications(client);

  return { client, supportUserId, channels, loading, error };
}

export type { StreamChannel, StreamUser };
