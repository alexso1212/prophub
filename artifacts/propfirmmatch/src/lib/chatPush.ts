/**
 * Web Push helpers for the community chat.
 *
 * Flow:
 *  1. User enables notifications -> we ask the browser for permission,
 *     register the service worker, subscribe via PushManager, and POST
 *     the subscription to the API server.
 *  2. The API server stores it in-memory and, when Stream Chat fires a
 *     `message.new` webhook for a DM or @mention, sends a Web Push.
 *  3. The service worker shows a desktop notification; clicking it focuses
 *     (or opens) the community page.
 */

const STORAGE_KEY = "prophub-chat-push-pref"; // 'on' | 'off'
const SW_PATH = "/chat-sw.js";

export function isWebPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function getStoredPushPref(): "on" | "off" | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "on" || v === "off" ? v : null;
  } catch {
    return null;
  }
}

export function setStoredPushPref(v: "on" | "off"): void {
  try {
    localStorage.setItem(STORAGE_KEY, v);
  } catch {
    /* ignore */
  }
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export async function registerChatServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isWebPushSupported()) return null;
  try {
    return await navigator.serviceWorker.register(SW_PATH, { scope: "/" });
  } catch {
    return null;
  }
}

async function fetchVapidKey(): Promise<string | null> {
  try {
    const r = await fetch("/api/chat/push/vapid-public-key", {
      credentials: "include",
    });
    if (!r.ok) return null;
    const j = (await r.json()) as { key?: string };
    return j.key || null;
  } catch {
    return null;
  }
}

export async function enableChatPush(): Promise<
  { ok: true } | { ok: false; reason: string }
> {
  if (!isWebPushSupported()) {
    return { ok: false, reason: "当前浏览器不支持桌面通知" };
  }
  const perm = await Notification.requestPermission();
  if (perm !== "granted") {
    return { ok: false, reason: "你拒绝了桌面通知权限" };
  }
  const reg = await registerChatServiceWorker();
  if (!reg) return { ok: false, reason: "无法注册通知服务" };
  await navigator.serviceWorker.ready;

  const vapid = await fetchVapidKey();
  if (!vapid) return { ok: false, reason: "服务端未配置推送" };

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    try {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapid).buffer as ArrayBuffer,
      });
    } catch (err) {
      return {
        ok: false,
        reason: (err as Error)?.message || "订阅推送失败",
      };
    }
  }

  try {
    const res = await fetch("/api/chat/push/subscribe", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: sub.toJSON() }),
    });
    if (!res.ok) return { ok: false, reason: "保存订阅失败" };
  } catch {
    return { ok: false, reason: "网络异常" };
  }

  setStoredPushPref("on");
  return { ok: true };
}

export async function disableChatPush(): Promise<void> {
  setStoredPushPref("off");
  if (!isWebPushSupported()) return;
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      const endpoint = sub.endpoint;
      try {
        await sub.unsubscribe();
      } catch {
        /* ignore */
      }
      try {
        await fetch("/api/chat/push/unsubscribe", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint }),
        });
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* ignore */
  }
}

/**
 * Silently re-POST the existing PushSubscription to the API server on
 * sign-in. This recovers from server restarts (in-memory store loss) or
 * a new browser session reusing a previously-granted subscription, so
 * users do not have to manually re-enable notifications.
 */
export async function resyncChatPushSubscription(): Promise<void> {
  if (!isWebPushSupported()) return;
  if (getStoredPushPref() !== "on") return;
  if (Notification.permission !== "granted") return;
  try {
    const reg =
      (await navigator.serviceWorker.getRegistration()) ||
      (await registerChatServiceWorker());
    if (!reg) return;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    await fetch("/api/chat/push/subscribe", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: sub.toJSON() }),
    });
  } catch {
    /* ignore */
  }
}

export async function getChatPushStatus(): Promise<{
  supported: boolean;
  permission: NotificationPermission | "unsupported";
  subscribed: boolean;
}> {
  if (!isWebPushSupported()) {
    return { supported: false, permission: "unsupported", subscribed: false };
  }
  const permission = Notification.permission;
  let subscribed = false;
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = await reg?.pushManager.getSubscription();
    subscribed = Boolean(sub);
  } catch {
    /* ignore */
  }
  return { supported: true, permission, subscribed };
}

/**
 * Foreground fallback: while the tab is open but hidden (minimized, other
 * tab focused), Stream pushes the new-message event to the client over its
 * websocket. We display a desktop notification via the registered SW so
 * the user gets the same UX as the closed-tab Web Push path.
 */
export async function showForegroundNotification(payload: {
  title: string;
  body: string;
  tag?: string;
  url?: string;
  channelCid?: string | null;
}): Promise<void> {
  if (!isWebPushSupported()) return;
  if (Notification.permission !== "granted") return;
  if (getStoredPushPref() !== "on") return;
  try {
    const reg =
      (await navigator.serviceWorker.getRegistration()) ||
      (await registerChatServiceWorker());
    if (!reg) return;
    await reg.showNotification(payload.title, {
      body: payload.body,
      icon: "/prophub-logo.svg",
      badge: "/favicon.svg",
      tag: payload.tag || "prophub-chat",
      data: {
        url: payload.url || "/community",
        channelCid: payload.channelCid || null,
      },
    } as NotificationOptions);
  } catch {
    /* ignore */
  }
}
