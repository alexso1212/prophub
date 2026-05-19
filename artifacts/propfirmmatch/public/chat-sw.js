/* Prophub community web push service worker. */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: "Prophub 社区", body: event.data ? event.data.text() : "" };
  }
  const title = payload.title || "Prophub 社区";
  const options = {
    body: payload.body || "你有一条新消息",
    icon: payload.icon || "/prophub-logo.svg",
    badge: payload.badge || "/favicon.svg",
    tag: payload.tag || "prophub-chat",
    data: {
      url: payload.url || "/community",
      channelCid: payload.channelCid || null,
    },
    renotify: true,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const channelCid = (event.notification.data && event.notification.data.channelCid) || "";
  const baseUrl = (event.notification.data && event.notification.data.url) || "/community";
  const targetUrl = channelCid
    ? `${baseUrl}?cid=${encodeURIComponent(channelCid)}`
    : baseUrl;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const c of clients) {
        try {
          const u = new URL(c.url);
          if (u.pathname.includes("/community")) {
            c.focus();
            c.postMessage({
              type: "prophub-chat-open",
              channelCid: channelCid || null,
            });
            return;
          }
        } catch {
          /* ignore */
        }
      }
      return self.clients.openWindow(targetUrl);
    }),
  );
});
