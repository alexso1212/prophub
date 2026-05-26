/**
 * Outbound-fetch safety helpers.
 *
 * Server-side fetches that follow user/admin-supplied URLs (link-health
 * checks, offer scraping) must not become SSRF vectors. Two guards live
 * here so every caller agrees on the rules:
 *
 *   - `isHttpUrl`        — scheme allowlist (http/https only). Use this for
 *                          values we *render or redirect to* (affiliate URLs)
 *                          to block `javascript:` / `data:` payloads.
 *   - `isPublicHttpUrl`  — scheme allowlist PLUS a private/loopback/link-local
 *                          host blocklist. Use this for values we *fetch*.
 *   - `fetchFollowingRedirects` — manual redirect follower that re-checks
 *                          `isPublicHttpUrl` on every hop, closing the
 *                          "public URL 302s to 169.254.169.254" bypass that
 *                          `redirect: "follow"` leaves open.
 */

export function isHttpUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function isPublicHttpUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      /^(0|10|127|169\.254|172\.(1[6-9]|2\d|3[0-1])|192\.168)\./.test(host) ||
      host === "::1" ||
      host.startsWith("[fc") ||
      host.startsWith("[fd") ||
      host.startsWith("[fe80")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Fetch `url`, following up to `maxRedirects` redirects, validating that
 * every hop (including the initial URL and each Location target) is a
 * public http(s) URL. Throws if a non-public host appears anywhere in the
 * chain. The returned Response's `url` reflects the final hop, so callers
 * can apply ref/domain checks against the true destination.
 */
export async function fetchFollowingRedirects(
  url: string,
  init: RequestInit = {},
  maxRedirects = 5,
): Promise<Response> {
  let current = url;
  for (let hop = 0; hop <= maxRedirects; hop++) {
    if (!isPublicHttpUrl(current)) {
      throw new Error(`Blocked non-public URL in redirect chain: ${current}`);
    }
    const resp = await fetch(current, { ...init, redirect: "manual" });
    if (resp.status >= 300 && resp.status < 400) {
      const location = resp.headers.get("location");
      if (location) {
        current = new URL(location, current).toString();
        continue;
      }
    }
    return resp;
  }
  throw new Error("Too many redirects");
}
