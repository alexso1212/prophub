import React, { createContext, useContext, useEffect, useState } from "react";
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

const DEFAULT_STATE: CommunityChatState = {
  client: null,
  supportUserId: "support",
  channels: [],
  loading: false,
  error: null,
};

const CommunityChatContext = createContext<CommunityChatState>(DEFAULT_STATE);

/**
 * Internal hook (not exported). Owns the Stream client lifecycle. Mounted
 * exactly once at the app root via CommunityChatProvider so the chat
 * connection — and push-token registration — stays live across tabs and
 * is initialised at app launch (not when /community is first opened).
 */
function useStreamConnection(): CommunityChatState {
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

  return { client, supportUserId, channels, loading, error };
}

/**
 * Root-level provider. Mount at app start (in _layout.tsx) so the chat
 * connection and push-notification bootstrap run as soon as the user is
 * signed in — not when they first open the Community tab.
 */
export function CommunityChatProvider({ children }: { children: React.ReactNode }) {
  const state = useStreamConnection();
  // Push permission, device registration, tap-to-deeplink: all wired at
  // root so notifications work regardless of which tab is currently active.
  usePushNotifications(state.client);
  return (
    <CommunityChatContext.Provider value={state}>
      {children}
    </CommunityChatContext.Provider>
  );
}

/** Consume the app-level chat state (use inside the Community screen). */
export function useCommunityChat(): CommunityChatState {
  return useContext(CommunityChatContext);
}

export type { StreamChannel, StreamUser };
