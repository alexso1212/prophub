# Threat Model

## Project Overview

This project is a pnpm workspace for Prop Firm Match: a public web app (`artifacts/propfirmmatch`), an Express API (`artifacts/api-server`), shared DB/API packages (`lib/*`), and a mobile artifact (`artifacts/mobile`). The production-facing surfaces are the public comparison site, the Express API that serves news/reviews/admin data, and the standalone mobile preview server. The mockup sandbox is development-only and should not be treated as a production surface.

## Assets

- **Admin-controlled affiliate configuration** — affiliate URLs, promo codes, discount labels, and related commercial configuration in `firm_overrides`. Unauthorized changes can redirect users to attacker-controlled destinations and alter business-critical monetization flows.
- **User accounts and sessions** — Clerk-backed sessions used for review submission and admin access. Compromise allows account impersonation and unauthorized data changes.
- **User-generated reviews** — public review text plus associated account metadata in `firm_reviews`. Abuse can deface public content or expose user-linked data.
- **Service secrets and third-party access** — database credentials, Clerk secret key, and Anthropic integration credentials. Exposure would allow direct backend or third-party service abuse.
- **Mobile preview/deep-link metadata** — the standalone mobile landing page builds deep links and QR codes from request metadata. Tampering here can misdirect users opening the mobile preview.

## Trust Boundaries

- **Browser/mobile client to Express API** — all request data is untrusted. Authenticated and admin-only operations must be enforced server-side.
- **Express API to PostgreSQL** — the API has direct read/write access to persistent review and override data.
- **Express API to Clerk** — the API trusts Clerk-authenticated identity and session claims for user/admin decisions.
- **Express API to external services** — public routes call Bilibili and Anthropic; these integrations must not become SSRF, cost-amplification, or data-leak channels.
- **Public to authenticated to admin surfaces** — most pages and several API routes are public, review mutation is authenticated, and firm override management is admin-only.
- **Proxy/edge headers to app logic** — forwarded host/proto headers influence Clerk proxying and the mobile landing page’s generated URLs; these headers must only be trusted when supplied by the deployment edge.

## Scan Anchors

- **Production entry points:** `artifacts/api-server/src/app.ts`, `artifacts/api-server/src/routes/*`, `artifacts/propfirmmatch/src/App.tsx`, `artifacts/mobile/server/serve.js`
- **Highest-risk areas:** `artifacts/api-server/src/routes/firmsOverrides.ts`, `artifacts/api-server/src/routes/firmReviews.ts`, `artifacts/api-server/src/middlewares/clerkProxyMiddleware.ts`, `artifacts/mobile/server/serve.js`
- **Public surfaces:** `/api/news`, `/api/live/bilibili`, `/api/firms-overrides`, `/api/firms/:slug/reviews`, most web pages
- **Authenticated/admin surfaces:** review mutation endpoints and `/api/admin/firms*`
- **Usually dev-only / ignore unless proven reachable:** `artifacts/mockup-sandbox/**`, `artifacts/mobile/scripts/**`, repository task files, clone data, attached assets

## Threat Categories

### Spoofing

The application relies on Clerk for user identity and uses that identity for both review ownership and admin access. Protected routes MUST reject unauthenticated callers, and admin routes MUST fail closed when admin allowlists or role configuration are missing or malformed.

### Tampering

Authenticated users can create reviews, while admins can change commercial override data that influences promo codes and outbound destinations. The server MUST validate and authorize every mutation, and admin-only fields MUST not be writable by ordinary signed-in users.

### Information Disclosure

Public routes expose review data and site content. Responses MUST avoid leaking unnecessary account identifiers, secrets, session material, or internal error details; logs MUST continue redacting auth headers and cookies.

### Denial of Service

Public routes call external services and can trigger expensive work such as translation or remote status fetches. These routes MUST keep bounded input sizes, use timeouts/caching, and avoid unauthenticated abuse paths that could materially degrade service or create unbounded third-party cost.

### Elevation of Privilege

The main privilege boundary is between public users, authenticated users, and site admins. Any misconfiguration that causes admin routes to default to broad authenticated access would let attackers alter site-wide outbound links and promo data, so admin enforcement MUST be explicit and fail closed.
