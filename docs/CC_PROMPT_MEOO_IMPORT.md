# Claude Code Handoff Prompt: Meoo Prop Firm Navigation Import

你正在接手 `alexso1212/prophub` 仓库中的 Meoo 导出项目。

## 当前任务

接手并工程化 `artifacts/meoo-propfirm-nav/`，这是一个 Meoo 生成的中文 Futures Prop Firm 导航站。目标不是照搬竞品文案，而是做一个可维护、可上线、合规边界清晰的中文 prop firm 平台库。

## 用户目标

用户想要一个类似“冒险岛 / Propfirmvip”体验的网站：

- 每个按钮点击都有真实页面或明确反馈
- 平台卡片可以进入平台详情
- 平台详情可以访问官网
- 有平台库、规则对比、新手路径、知识树、软件教程、出金流程、风险披露
- 视觉和交互可以保留 Meoo 的完成度，但数据和路由要由代码稳定维护

## 重要边界

- 不要复制竞品整段文案、图片、规则图、折扣码或社群链接
- 不要写“稳赚、包过、稳定出金、低风险高回报”等承诺
- 不要提供喊单、带单、代操、代付、代 KYC、规避风控教程
- 官网链接优先走 `officialUrl`
- 如果使用 affiliate 链接，必须先显示返佣披露
- 平台规则和中国用户支持状态必须标注“待核验 / 最后核验日期”

## 当前项目状态

目录：`artifacts/meoo-propfirm-nav/`

技术栈：

- React 18
- TypeScript
- Webpack
- Tailwind CSS
- React Router BrowserRouter
- Framer Motion
- lucide-react

已经做过的修复：

- 补上缺失路由：`/home`、`/firms`、`/rules`、`/compare`、`/guides`、`/software`、`/software/:slug`、`/payments`、`/payouts`
- 平台列表卡片已改为可点击进入 `/firms/:slug`
- 平台详情页“访问官网”已改为使用 `officialUrl`
- `SoftwareGuide.tsx` 类型错误已修复
- Webpack 资源路径已改为根路径 `/bundle.js`，避免直接访问 `/firms/:slug` 白屏
- monorepo 内 React 18 类型和 Tailwind 3 构建已做隔离，避免被根项目 React 19 / Tailwind 4 影响
- `pnpm --filter @prophub/meoo-propfirm-nav run typecheck` 通过
- `pnpm --filter @prophub/meoo-propfirm-nav run build` 通过，但仍有非阻塞 bundle size warning

## 需要继续做的事

1. 启动并人工点测全站：
   - `/`
   - `/firms`
   - `/firms/:slug`
   - `/platforms`
   - `/rules`
   - `/guides`
   - `/guides/:slug`
   - `/knowledge`
   - `/software`
   - `/software-guide`
   - `/payout`
   - `/disclosure`

2. 修所有空链接、404 和“点击没反应”的入口。

3. 统一路由命名：
   - 平台库建议保留 `/firms`
   - 规则对比建议保留 `/rules`
   - 软件列表建议保留 `/software`
   - 软件交互流程建议保留 `/software-guide`
   - 出金流程建议保留 `/payout`

4. 核验 `src/data/firms.ts`：
   - 官网链接是否真实
   - `sourceUrls` 是否能访问
   - 不要把 affiliate 链接伪装成官网
   - 中国用户支持状态不要写得过于肯定

5. 改善平台详情页：
   - 增加“官方链接”“规则来源”“返佣披露”“风险标签”
   - 对 affiliate 按钮加确认弹窗或跳转到 disclosure

6. 做全站合规文案：
   - 页面底部统一风险提示
   - 平台详情页顶部风险提示
   - 跳转平台开户前显示披露

7. 如果要上线，优先处理：
   - SEO title/description
   - robots.txt
   - sitemap
   - OpenGraph
   - bundle splitting

## 验证命令

在 `artifacts/meoo-propfirm-nav/` 下运行：

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run build
pnpm run dev
```

如果在 monorepo 根目录验证：

```bash
pnpm install --frozen-lockfile
pnpm --filter ./artifacts/meoo-propfirm-nav run typecheck
pnpm --filter ./artifacts/meoo-propfirm-nav run build
```

## 当前优先级

第一优先级不是重做视觉，而是保证“所有用户能看到的入口都能点、点进去有内容、外链语义正确、风险披露明确”。
