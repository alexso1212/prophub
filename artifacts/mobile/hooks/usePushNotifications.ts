import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { router } from "expo-router";
import type { StreamChat } from "stream-chat";

/**
 * Foreground display policy: when the app is in foreground we still want
 * banners + sounds so the user notices a new message even while browsing
 * other tabs. The handler must be set ONCE at module scope (Expo docs).
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    // Legacy fields kept for older expo-notifications versions:
    shouldShowAlert: true,
  }) as Notifications.NotificationBehavior,
});

async function ensurePermission(): Promise<boolean> {
  if (!Device.isDevice) return false; // simulators/web cannot receive push
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  if (existing.canAskAgain === false) return false;
  const next = await Notifications.requestPermissionsAsync();
  return next.granted;
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("messages", {
    name: "新消息",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#7C3AED",
  });
}

/**
 * Open the community tab and (optionally) deep-link to a specific channel.
 * Stream's push payload includes the channel CID in `data.cid` (format
 * "type:id"). We forward both parts as URL params; the community screen
 * reads them and auto-opens that channel.
 */
function handleNotificationTap(response: Notifications.NotificationResponse): void {
  const data = (response.notification.request.content.data || {}) as Record<string, unknown>;
  const cid = typeof data.cid === "string" ? data.cid : undefined;
  const channelType = typeof data.channel_type === "string" ? data.channel_type : undefined;
  const channelId = typeof data.channel_id === "string" ? data.channel_id : undefined;

  let type = channelType;
  let id = channelId;
  if (!type || !id) {
    if (cid && cid.includes(":")) {
      const [t, ...rest] = cid.split(":");
      type = t;
      id = rest.join(":");
    }
  }

  try {
    if (type && id) {
      router.push({
        pathname: "/(tabs)/community",
        params: { channelType: type, channelId: id },
      });
    } else {
      router.push("/(tabs)/community");
    }
  } catch {
    /* navigation may not be ready on cold start; expo-router will retry */
  }
}

/**
 * Registers a native push token (APNs on iOS, FCM on Android) with Stream
 * so the backend will fan out push notifications to this device whenever
 * the user receives a new message they aren't actively reading (app
 * backgrounded or another channel open).
 *
 * IMPORTANT: we use `getDevicePushTokenAsync()` (native APNs/FCM token),
 * NOT `getExpoPushTokenAsync()` (Expo relay token). Stream's PushProvider
 * type is `'apn' | 'firebase' | 'huawei' | 'xiaomi'` — Stream talks to
 * APN / Firebase directly and does not currently support the Expo push
 * relay as a first-class provider. The task brief mentioned "Expo push
 * token" but the supported integration shape is native tokens; behaviour
 * is equivalent from the user's perspective.
 *
 * Stream Dashboard setup required (one-time, by the project owner):
 *   - iOS:     enable "APN" provider, upload .p8 + key id + team id.
 *   - Android: enable "Firebase" provider, upload FCM service account
 *              JSON (the same FCM project used by the EAS Android build).
 * See https://getstream.io/chat/docs/sdk/expo/push/overview/.
 */
export function usePushNotifications(client: StreamChat | null): void {
  const registeredTokenRef = useRef<string | null>(null);
  const tapSubRef = useRef<Notifications.EventSubscription | null>(null);
  const fgSubRef = useRef<Notifications.EventSubscription | null>(null);

  // Tap-to-open + cold start handling (independent of chat client lifecycle)
  useEffect(() => {
    tapSubRef.current = Notifications.addNotificationResponseReceivedListener(
      handleNotificationTap,
    );
    Notifications.getLastNotificationResponseAsync().then((resp) => {
      if (resp) handleNotificationTap(resp);
    });
    // Foreground arrivals: handler above already shows the banner, but we
    // also subscribe so additional UI work (e.g. inbox refresh) could hook in.
    fgSubRef.current = Notifications.addNotificationReceivedListener(() => {
      /* noop placeholder; banner is shown by the notification handler */
    });
    return () => {
      tapSubRef.current?.remove();
      fgSubRef.current?.remove();
      tapSubRef.current = null;
      fgSubRef.current = null;
    };
  }, []);

  // Register the native push token with Stream after the chat user connects.
  useEffect(() => {
    if (!client || !client.userID) return;
    let cancelled = false;

    (async () => {
      try {
        const ok = await ensurePermission();
        if (!ok) {
          if (__DEV__) console.warn("[push] permission denied or unavailable");
          return;
        }
        await ensureAndroidChannel();

        // Native device token: Stream → APN (iOS) / Firebase (Android).
        const tokenRes = await Notifications.getDevicePushTokenAsync();
        const token = String(tokenRes?.data || "");
        if (cancelled || !token) return;
        if (registeredTokenRef.current === token) return;

        const provider: "apn" | "firebase" =
          Platform.OS === "ios" ? "apn" : "firebase";
        await client.addDevice(token, provider, client.userID!);
        registeredTokenRef.current = token;
        if (__DEV__) console.log("[push] registered with Stream", { provider });
      } catch (err) {
        // Best-effort: never crash the chat over push setup failures, but
        // surface in dev so the team can diagnose Dashboard / cert issues.
        if (__DEV__) console.warn("[push] registration failed", err);
      }
    })();

    return () => {
      cancelled = true;
      const token = registeredTokenRef.current;
      if (token && client && client.userID) {
        client.removeDevice(token).catch(() => undefined);
      }
      registeredTokenRef.current = null;
    };
  }, [client]);
}
