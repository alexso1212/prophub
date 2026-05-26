# Prop Firm Match（中文版）—— 产品架构与改造 PRD

> 本文档供另一个 AI / 工程师快速理解 `artifacts/propfirmmatch` 的整体设计、信息架构、数据流与商业流程，并指出当前 UX 痛点与改造方向。

## 0. 一句话定位

一个面向中文交易员的 **自营交易公司（Prop Firm）对比 + 折扣聚合** 站点，对标原版 `propfirmmatch.com`。核心商业模式：**affiliate（点击带优惠码跳转到合作公司 → 用户结账 → 我们拿返佣）**。

## 1. 目标用户与核心场景

| 用户类型 | 主要诉求 | 当前满足度 |
|---|---|---|
| 想买挑战赛的新手 | 哪家便宜、靠谱、出金快 | ★★★★☆ |
| 已经在做的老手 | 哪家最新优惠码、最大资金、规则差异 | ★★★☆☆ |
| 来回比价的薅羊毛党 | 折扣榜、限时活动 | ★★★★☆ |
| 流失/未注册访客 | 没什么日常回访理由 | ★☆☆☆☆（核心痛点）|

**北极星指标**：affiliate 点击数（`/go/:slug` → 真实跳转 → 转化）。

## 2. 信息架构（Sitemap）

```
/                                根路由 → 默认重定向到 /futures
/sign-in, /sign-up               Clerk 登录注册
/search                          全站搜索结果

/:cat                            分类首页（cat ∈ forex|futures|crypto）
  ├─ /all-prop-firms             同上（SEO 别名）
  ├─ /prop-firms/:slug           公司详情页（FirmPage）
  ├─ /exclusive-offers, /offers  本月优惠汇总
  ├─ /prop-firm-challenges       挑战赛对比
  ├─ /best-sellers               热销榜（金银铜 podium）
  ├─ /prop-firm-reviews          用户评价聚合
  ├─ /favorite-firms             我的收藏（localStorage，最多 3 个）
  ├─ /prop-firm-rules            规则手册
  ├─ /payouts                    出金记录（带截图证明）
  ├─ /payouts-leaderboard        出金排行
  ├─ /brokers                    合作经纪
  ├─ /news                       行业新闻（API 拉取 + 翻译）
  ├─ /giveaways                  抽奖活动
  └─ /live                       B站直播间嵌入

/go/:slug                        affiliate 中转（自动复制优惠码 + 0.8s 后跳转）
/careers, /careers/:slug         招聘
/tutorials, /tutorials/:slug     新手教程
/admin/firms                     后台（覆写 affiliateUrl / 优惠码 / 折扣）
```

## 3. 全局布局 (`components/Layout.tsx`)

从上到下：

1. **顶部活动条** — 抽奖活动 banner，链接到 `/:cat/giveaways`
2. **LIVE 直播条** — 显示 B 站直播状态（live / 轮播 / 未开播），动态从 `/api/live/bilibili?roomId=1874453448` 拉
3. **Header** — Logo / 搜索框 / 分类切换（外汇·期货·加密）/ 招聘中 / 教程 / 登录 / 注册 / 移动端汉堡
4. **主导航 tab** — 横向滚动 10 个标签（首页 / 限时优惠 / 挑战赛 / 热销榜 / 用户评价 / 我的收藏 / 规则手册 / 出金记录 / 出金排行 / 合作经纪 / 行业新闻）
5. **移动端抽屉** — 复制以上所有入口

## 4. 首页（`HomePage.tsx`）渲染顺序

| # | 区块 | 用途 | 数据来源 |
|---|---|---|---|
| 1 | Onboarding 思维导图 | 首次访问自动播放演示，介绍"我是谁 / 怎么用" | `onboardingCopy.ts` |
| 2 | Hero 大标题 + 4 信任徽章（200+ / 1000+ / 10500+ / 4M+） | 一眼说清产品定位 | 静态 |
| 3 | 本月专属优惠 横向轮播（8 张卡） | 把折扣最猛的公司前置 | `firms.ts` + overrides |
| 4 | 最受欢迎 Top-3 podium（金银铜奖杯） | 主力转化卡 | `firms.popularRank` |
| 5 | 筛选条 | 筛选 / 人气 / 收藏 / 新上线 / 全部 + "数据 1 分钟前更新" | `useFirmFilters` |
| 6 | 全部公司表格（桌面 9 列 / 手机 sticky-left + 横滑右栏） | 主对比表，行点击 → FirmPage，Firm 按钮 → `/go/:slug` | firms + overrides |
| 7 | 行业新闻 6 条 | 增加内容深度 | `/api/news` |

## 5. 数据层（`src/data/`，全静态）

| 文件 | 内容 |
|---|---|
| `firms.ts` | 主数据：21 家期货公司的 `Firm[]`（rating, country, platforms, maxAllocation, promoCode/Percent, popularRank, affiliateUrl…） |
| `firms.zh.ts` | 中文描述、`offerDescriptionZh` |
| `firmsForex.ts` / `firmsCrypto.ts` | 外汇 / 加密分类（目前 demo 数据，**未填充**） |
| `brandZh.ts` | slug → 中文品牌名 |
| `i18nZh.ts` | 国家、分类等 UI 翻译 |
| `payoutProofs.json` | 15 家公司的出金证明聚合（金额 / 笔数 / 截图路径 / 方法） |
| `payoutProofs.ts` | 校验 + 派生统计（含 `SNAPSHOT_DATE` 锚定 30 天窗口） |
| `reviews.ts` / `leaderboard.ts` / `jobs.ts` / `tutorials.ts` / `faq.ts` | 各次级页的静态数据 |
| `onboardingCopy.ts` | 思维导图分支文案 |

## 6. 后端 API（`artifacts/api-server`）

**公开：**

- `GET /api/news` — 抓源 + 翻译后返回新闻列表
- `GET /api/live/bilibili?roomId=` — 代理 B 站 `Room/get_info`，30s 内存缓存
- `GET /api/firms-overrides` — 公开返回所有公司的 affiliateUrl / promoCode / discountPercent 覆写

**公司评价：**

- `GET    /api/firms/:slug/reviews`
- `POST   /api/firms/:slug/reviews` （需 Clerk）
- `DELETE /api/firms/:slug/reviews/:id`

**后台（需 Clerk 登录 + email 在 `ADMIN_EMAILS` 内，fail-closed）：**

- `GET   /api/admin/firms`
- `PATCH /api/admin/firms/:slug` — 不发新版本就能改链接 / 优惠码

## 7. 关键业务流

### 7.1 Affiliate 跳转（核心变现）

`点 Firm 按钮 / 优惠卡` → `/go/:slug` 中转页：

1. 取该公司 affiliateUrl（优先用 admin override）
2. 自动 `navigator.clipboard.writeText(promoCode)`
3. 顶部 toast「✓ 已自动复制，结账时直接粘贴」
4. 3 秒倒计时 + 写入 `localStorage.pfm.outbound.clicks` 埋点
5. `window.location.assign(outboundUrl)` 真实跳出

### 7.2 表格内"只复制不跳转"

表格优惠列的紫粉胶囊右边有独立复制小按钮（`PromoPill`）：`stopPropagation` 不触发跳转，1.6s 内图标变 ✓。

### 7.3 收藏（localStorage 限 3 个）

`useFavorites` hook + filter-bar 的"收藏 0/3"。

### 7.4 Onboarding 演示

首次访问自动播放分支动画 → 写 `pfm.onboarding.collapsed.v3=1`；记忆用户展开过的分支（inline + 全屏分别用 `expanded.v1` / `expanded.fs.v1`）；可"重播演示"重置。

## 8. 跨切关注点

- **CategoryContext** — 全站根据 URL 路径自动判断 `forex|futures|crypto`，过滤 firms
- **FirmsOverridesContext** — 应用启动时拉 `/api/firms-overrides`，所有用到的 firm 字段都先看 override
- **useFirmFilters** — 多参数筛选 + 排序
- **Clerk** — 整个 App 包在 `ClerkProvider`（无 key 时降级）
- **Bilibili 直播状态** — `useBilibiliLiveStatus` 模块级缓存，全站共享一个 fetch

## 9. 技术栈

- 前端：React + Vite + Wouter（轻量路由） + TypeScript
- 鉴权：Clerk（Replit 托管租户）
- 后端：Node + 自打包 ESM（Pino 日志）
- DB：Postgres（drizzle-kit migrations）
- 部署：Replit monorepo（pnpm workspace）

---

## 10. 现状 UX 痛点 + 改造方向

### 痛点 A：信息过载

当前 `/futures` 一进来就是：直播条 → 顶部活动条 → Header → 10 个 tab → 思维导图 → Hero → 优惠轮播 → Top-3 podium → 筛选条 → 21 行长表 → 新闻 6 条。视觉断层太多。

**改造方向：**

- 思维导图默认折叠（已有）+ 演示自动播放可关；首次访问后改成纯静态、不再占首屏
- 把 10 个 tab 收成 4 个主 tab（Firms / Challenges / Offers / Reviews），其它收进子菜单
- Top-3 podium 与首屏轮播二选一，避免重复"主推位"
- 表格默认折叠到 8 行 + "展开全部"，桌面行高调紧

### 痛点 B：没有日常使用钩子

用户买完一次挑战赛就走，不会每天回来。

**改造方向**（按价值排序）：

1. **优惠码每日刷新 + 倒计时** — "今日限时 / 还剩 4h 22m"，制造 FOMO
2. **价格异动提醒** — 收藏后某家公司降价 / 新优惠码上线发邮件或站内通知
3. **每日"今日推荐 1 家"** — 算法 / 编辑精选，落地页固定 URL 易转发
4. **挑战赛"我的进度"看板** — 让买了挑战赛的用户回站记录每日盈亏（强日活钩子）
5. **直播 + 社群** — B 站直播 + 微信群入口固定化，绑定"主播解读今日盘面"
6. **真实出金 feed** — 用 `payoutProofs` 做"5 分钟前 xxx 在 FundingPips 出金 $937"实时滚动条，强信任 + 强回访
7. **每周邮件简报** — 优惠汇总 + 出金排行变动 + 行业新闻 TOP3

### 痛点 C：无登录态价值

当前注册主要服务于评价 + admin。普通用户没什么理由登录。

**改造方向：**

- 收藏从 localStorage 升级到账号同步
- 解锁"高级筛选 / 历史价格曲线 / 我的优惠码记忆"
- 注册即送一次"专属优惠码"邮件

---

## 11. 改造优先级建议

| 优先级 | 改造 | 预期效果 |
|---|---|---|
| P0 | 实时出金 feed（payoutProofs 已有数据） | 一上线就增强信任 + 提高停留 |
| P0 | 收藏后价格异动邮件提醒 | 拉回访 |
| P1 | 顶部 10 tab → 4 主 tab + 子菜单 | 降低信息密度 |
| P1 | 优惠 FOMO 倒计时 | 提点击率 |
| P2 | "今日推荐 1 家" 单页 | 易传播 |
| P2 | 挑战赛进度看板（需新建数据模型） | 强日活 |
| P3 | 每周邮件简报 | 长期回访 |
