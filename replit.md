# Prop Firm Match (prophub)

中文向的自营交易公司 (prop firm) 对比 + 折扣聚合站点,核心商业模式为 affiliate 跳转返佣。源自 GitHub `alexso1212/prophub`,已克隆进当前工作区。

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API 服务 (port 8080, 路径 `/api`)
- `pnpm --filter @workspace/propfirmmatch run dev` — 主站 web 前端 (port 23593, 路径 `/`)
- `pnpm --filter @workspace/mobile run dev` — Expo 移动端 (port 18115, 路径 `/mobile/`)
- `pnpm --filter @workspace/mockup-sandbox run dev` — 设计画布 (port 8081, 路径 `/__mockup`)
- `pnpm run typecheck` — 全工作区 typecheck
- `pnpm run build` — typecheck + 构建所有包
- `pnpm --filter @workspace/api-spec run codegen` — 从 OpenAPI 规范重新生成 hooks 与 zod schema
- `pnpm --filter @workspace/db run push` — 推送 DB schema 变更 (仅开发环境)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7 + Tailwind 4 + wouter + TanStack Query
- Mobile: Expo (React Native)
- API: Express 5 + Drizzle ORM + PostgreSQL
- Auth: Clerk
- Chat: Stream
- AI: Anthropic (via Replit AI Integrations)
- 校验: Zod (`zod/v4`) + `drizzle-zod`
- API codegen: Orval (基于 OpenAPI)
- 构建: esbuild

## Artifacts

| Slug | Kind | 路径 | 说明 |
| --- | --- | --- | --- |
| `propfirmmatch` | web | `/` | 主站 (React + Vite) |
| `mobile` | mobile | `/mobile/` | Expo 移动端 |
| `api-server` | api | `/api` | Express 后端 |
| `mockup-sandbox` | design | `/__mockup` | UI 原型画布 |

## Required env / secrets

已配置:`DATABASE_URL`, `ADMIN_EMAILS`(shared)。

按需配置(根据要启用的功能):

- 认证: `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `CLERK_PROXY_URL`, `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, `EXPO_PUBLIC_CLERK_PROXY_URL`
- 聊天: `STREAM_API_KEY`, `STREAM_API_SECRET`
- AI: `AI_INTEGRATIONS_ANTHROPIC_API_KEY`, `AI_INTEGRATIONS_ANTHROPIC_BASE_URL`(Replit AI Integrations 自动提供)
- 推送通知: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`
- 链接健康监控: `LINK_HEALTH_ALERT_WEBHOOK`
- 其他可选: `SCHEDULER_DISABLED`, `SCRAPE_USE_PLAYWRIGHT`, `ADMIN_DEV_BYPASS`

## Where things live

- 产品需求文档:`docs/PRD.md`
- API 规范源:`lib/api-spec/openapi.yaml` → 生成 `lib/api-client-react/src/generated/`、`lib/api-zod/src/generated/`
- DB schema:`lib/db/src/schema/`
- Web 路由:`artifacts/propfirmmatch/src/pages/`
- API 路由:`artifacts/api-server/src/routes/`
- 抓取/数据导入:`clone-data/`、`artifacts/api-server/src/scrape/`(如有)

## Gotchas

- `mockup-sandbox` 当前在 `calendar.tsx` 和 `spinner.tsx` 上有 React 19 `Ref<T>` 类型不匹配的 typecheck 报错,是 prophub 原仓库带过来的预存问题,不影响运行。修复需要升级 shadcn 组件适配 React 19。
- `tsx` 文件的 React 类型报错来自 `@types/react@19.1.17` 与同名类型在 node_modules 中多次出现的版本漂移;只在 mockup-sandbox 子项目里出现。

## User preferences

_后续根据用户明确指令累积_

## Pointers

- 工作区结构与 TypeScript 设置:见 `pnpm-workspace` skill
- 威胁模型与安全考量:`threat_model.md`
