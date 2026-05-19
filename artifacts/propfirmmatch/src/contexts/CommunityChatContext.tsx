import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useUser } from "@clerk/react";
import { StreamChat } from "stream-chat";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_FILES_PER_MESSAGE = 4;
const UNREAD_EVENT = "prophub-chat-unread";

type TokenResponse = {
  apiKey: string;
  userId: string;
  token: string;
  supportUserId: string;
};

type CommunityChatValue = {
  client: StreamChat | null;
  supportUserId: string;
  error: string | null;
};

const Ctx = createContext<CommunityChatValue>({
  client: null,
  supportUserId: "support",
  error: null,
});

function dispatchUnread(count: number) {
  try {
    window.dispatchEvent(new CustomEvent<number>(UNREAD_EVENT, { detail: count }));
  } catch {
    /* noop */
  }
}

/**
 * App-level Stream chat provider. Connects ONCE when the user signs in and
 * stays connected across page navigations so the navbar unread badge keeps
 * updating even when the user is not on /community.
 */
export function CommunityChatProvider({ children }: { children: ReactNode }) {
  const { user, isSignedIn } = useUser();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [supportUserId, setSupportUserId] = useState<string>("support");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn || !user) {
      setClient(null);
      dispatchUnread(0);
      return;
    }
    let cancelled = false;
    let connected: StreamChat | null = null;

    (async () => {
      try {
        const displayName =
          user.fullName ||
          user.username ||
          user.primaryEmailAddress?.emailAddress ||
          "用户";
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
            /* best-effort */
          }
        });

        await c.connectUser({ id: data.userId, name: displayName, image }, data.token);
        if (cancelled) {
          await c.disconnectUser();
          return;
        }
        connected = c;
        setClient(c);
        setSupportUserId(data.supportUserId || "support");

        const update = (count: number) => dispatchUnread(count);
        const onEvent = (e: { total_unread_count?: number }) => {
          if (typeof e?.total_unread_count === "number") {
            update(e.total_unread_count);
          } else {
            const fromUser = (c.user as { total_unread_count?: number } | undefined)
              ?.total_unread_count;
            if (typeof fromUser === "number") update(fromUser);
          }
        };
        // Seed initial value
        const initial = (c.user as { total_unread_count?: number } | undefined)
          ?.total_unread_count;
        if (typeof initial === "number") update(initial);
        c.on("notification.message_new", onEvent);
        c.on("notification.mark_read", onEvent);
        c.on("message.new", onEvent);
        c.on("message.read", onEvent);
      } catch (err) {
        if (!cancelled) setError((err as Error)?.message || "聊天连接失败");
      }
    })();

    return () => {
      cancelled = true;
      dispatchUnread(0);
      if (connected) {
        connected.disconnectUser().catch(() => undefined);
      }
      setClient(null);
    };
  }, [isSignedIn, user]);

  return (
    <Ctx.Provider value={{ client, supportUserId, error }}>{children}</Ctx.Provider>
  );
}

export function useCommunityChat() {
  return useContext(Ctx);
}
