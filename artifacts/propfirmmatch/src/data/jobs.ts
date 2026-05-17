export type JobType = "全职" | "兼职" | "实习";

export interface Job {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: JobType;
  skills: string[];
  postedAt: string;
  summary: string;
  body: string;
}

export const JOBS: Job[] = [
  {
    slug: "senior-frontend-engineer",
    title: "高级前端工程师 (React / Next.js)",
    team: "工程团队",
    location: "Remote – Global",
    type: "全职",
    skills: ["React", "TypeScript", "Next.js", "性能优化", "可访问性"],
    postedAt: "2026-05-12",
    summary: "主导 propfirmmatch 主站的前端架构演进，负责性能、可访问性与组件体系。",
    body: `## 关于团队
工程团队 18 人，全部远程，覆盖 7 个时区。前端用 React + TypeScript + Vite，后端 Node + Postgres。我们重视代码评审、可观测性和小步发布。

## 你将做什么
- 主导主站新版页面（行情、抽奖、教程）的前端架构
- 把首屏 LCP 从当前 2.6s 优化到 < 1.5s
- 建立组件库的可访问性基线（键盘、对比度、焦点环）
- Review 5–8 位工程师的 PR，给出可落地的反馈

## 我们在找谁
- 5 年以上 React 经验，至少独立负责过一个 ≥ 50 个页面的产品
- 熟悉性能分析（Chrome DevTools, Lighthouse, web-vitals）
- 写过自己引以为豪的组件库或设计系统
- 能用清晰的中文/英文写技术文档

## 加分项
- 有交易、金融或量化背景
- 维护过开源前端项目
- 会一点动效（Framer Motion / GSAP）

## 福利
- 100% 远程，工时按结果而非打卡
- 季度学习预算 USD 1,500
- 每年两次全员线下集结（曼谷、里斯本）
- 期权 + 项目奖金`,
  },
  {
    slug: "backend-engineer-node",
    title: "后端工程师 (Node.js / PostgreSQL)",
    team: "工程团队",
    location: "Remote – APAC",
    type: "全职",
    skills: ["Node.js", "PostgreSQL", "Redis", "REST", "可观测性"],
    postedAt: "2026-05-10",
    summary: "维护和扩展我们的 API 服务，支持公司、点评、出金记录等核心数据。",
    body: `## 关于团队
后端 6 人小组，主语言 TypeScript + Node。数据库 Postgres 14，缓存 Redis，部署在自管 K8s 集群上。我们坚持「先看监控再改代码」。

## 你将做什么
- 设计公司 / 点评 / 出金记录的领域模型
- 把热点接口的 P99 从 380ms 降到 < 120ms
- 搭建数据回填与一致性校验任务
- 与前端、商务一起打磨投放跟踪与归因

## 我们在找谁
- 3 年以上 Node + 关系型数据库经验
- 熟悉索引设计、慢查询分析、连接池调优
- 写过端到端可观测（日志 / 指标 / 链路）的服务
- 喜欢从数据出发做技术决策

## 加分项
- 用过 Go / Rust 写过生产服务
- 熟悉 OpenTelemetry / Prometheus / Grafana
- 有过反爬虫或数据校验经验

## 福利
- 远程优先，APAC 同事每月有线下 meetup 预算
- 季度学习预算 USD 1,500
- 性能机配置津贴
- 期权`,
  },
  {
    slug: "fullstack-growth-engineer",
    title: "增长工程师 (Fullstack)",
    team: "增长团队",
    location: "Remote – Global",
    type: "全职",
    skills: ["A/B Testing", "Analytics", "React", "Node.js", "SEO"],
    postedAt: "2026-05-08",
    summary: "从注册到首笔点击的全链路实验官，跑 A/B、写落地页、改注册流。",
    body: `## 关于团队
增长团队是产品+工程+市场的小型作战单位，4 人。我们每两周一个实验周期，KPI 是注册数与合作公司点击转化。

## 你将做什么
- 主导每月 4–6 个 A/B 实验（落地页、CTA、注册流）
- 写出关键事件埋点规范并保证数据质量
- 与设计共同迭代 hero、定价、对比页
- 跟踪 SEO 关键词排名并提出页面改造方案

## 我们在找谁
- 3 年以上 fullstack 经验，能独立交付一个落地页
- 熟悉至少一种实验平台（Statsig / GrowthBook / 自研）
- 看得懂留存曲线、漏斗、归因模型
- 文案不错，能写出像样的中文标题

## 加分项
- 做过 SEO 项目并拿到过结果
- 用过 PostHog / Mixpanel / Amplitude
- 写过自己的 newsletter 或个人项目

## 福利
- 远程优先，工作与实验全透明
- 学习预算 + 工具订阅可报销
- 每季度结算 1 次实验奖金`,
  },
  {
    slug: "product-designer",
    title: "产品设计师 (UI/UX)",
    team: "设计团队",
    location: "Remote – Global",
    type: "全职",
    skills: ["Figma", "设计系统", "信息架构", "原型动效"],
    postedAt: "2026-05-06",
    summary: "和 PM/工程一起打磨 propfirmmatch 的体验，建立和迭代设计系统。",
    body: `## 关于团队
设计团队 3 人，每周一次评审会，每两周一次跨职能同步。所有设计资源开放给工程团队，争议用真实用户访谈而非主观打分。

## 你将做什么
- 主导挑战赛对比、公司详情、教程中心的视觉与交互
- 把现有 Figma 库迁移成可被工程直接消费的 token 系统
- 每月组织 2 场用户访谈，输出可执行的设计 brief
- 与品牌一起更新 landing page

## 我们在找谁
- 4 年以上互联网产品设计经验，作品集请附 2 个完整案例
- 熟悉 Figma Components + Variables
- 会做轻量原型动效（Figma Smart Animate / Principle）
- 重视可访问性

## 加分项
- 有金融 / 加密 / 数据产品经验
- 会写 CSS，能与工程精确沟通
- 有过设计 OKR 的经验

## 福利
- 100% 远程
- 季度学习预算 USD 1,500
- 设备津贴 USD 2,000`,
  },
  {
    slug: "bd-manager-prop-firms",
    title: "商务拓展经理 (Prop Firms 方向)",
    team: "商务团队",
    location: "Remote – EMEA",
    type: "全职",
    skills: ["BD", "合作谈判", "数据分析", "英文沟通"],
    postedAt: "2026-05-04",
    summary: "对接全球 prop firms，谈联合优惠 / 抽奖 / 联合营销，扩展供给侧。",
    body: `## 关于团队
商务团队 5 人，覆盖 NA / EMEA / APAC。我们与 80+ prop firm 有合作，目标是把这个数字扩到 200+。

## 你将做什么
- 主导 EMEA 区 prop firm 商务对接
- 谈联合优惠、抽奖赞助、独家折扣
- 维护合作伙伴季度复盘
- 与市场一起策划联合活动

## 我们在找谁
- 3 年以上 B2B BD 经验，有海外客户对接经验
- 商务英语流利，能独立主持电话会议
- 数据敏感，会用 SQL / 表格分析合作效果
- 自驱、愿意接受跨时区会议

## 加分项
- 有 prop firm / 经纪商 / 交易平台行业经验
- 会西班牙语 / 法语 / 德语
- 在欧洲已有可立刻动用的 prop firm 资源

## 福利
- 远程优先，差旅可报销
- 季度合作奖金
- 学习预算`,
  },
  {
    slug: "zh-community-manager",
    title: "中文社区运营",
    team: "运营团队",
    location: "Remote – Greater China",
    type: "全职",
    skills: ["社区运营", "内容选题", "B 站", "小红书", "Discord"],
    postedAt: "2026-05-02",
    summary: "经营 propfirmmatch 的中文社区，做选题、写稿、回评论、做活动。",
    body: `## 关于团队
内容与社区团队 4 人，与设计、市场、商务紧密协作。中文是主战场，目标是把月活社区用户从 1.2 万做到 5 万。

## 你将做什么
- 每月策划 8–12 篇中文教程 / 行业评测
- 经营 B 站、小红书、微信公众号、Discord 中文区
- 每月主持 2 场线上活动（直播 / 圆桌）
- 整理用户问答，回流到产品 / 教程

## 我们在找谁
- 2 年以上中文社区运营经验
- 自己有持续运营的小红书 / B 站账号
- 写得了 1500 字以上中文长文
- 对 prop firm / 交易话题真感兴趣

## 加分项
- 有交易经验或考过 prop firm
- 会 Premiere / 剪映 做短视频
- 英语阅读流畅

## 福利
- 远程，工时灵活
- 每月内容预算 + 设备津贴
- 季度内容奖金`,
  },
  {
    slug: "qa-engineer",
    title: "QA / 测试工程师",
    team: "工程团队",
    location: "Remote – APAC",
    type: "全职",
    skills: ["Playwright", "测试设计", "自动化", "可观测性"],
    postedAt: "2026-04-28",
    summary: "搭建 propfirmmatch 的端到端测试体系，让发布安心。",
    body: `## 关于团队
工程团队没有专职 QA，目前的端到端测试由工程师轮值。我们希望这个位置成为质量的引擎，而不是看门人。

## 你将做什么
- 设计核心流程（注册 / 投递 / 报名 / 出金跳转）的端到端用例
- 把端到端覆盖率从 30% 做到 70%
- 写出可读、可调试的 Playwright 用例
- 在 CI 中接入截图回归与稳定性监控

## 我们在找谁
- 3 年以上自动化测试经验
- 熟悉 Playwright / Cypress 之一
- 会写脚本分析 flakiness
- 能与工程师平等对话

## 加分项
- 用过性能或可访问性自动化工具
- 有 chaos / 灰度发布经验

## 福利
- 100% 远程
- 设备津贴 + 学习预算
- 工时弹性`,
  },
  {
    slug: "data-analyst-intern",
    title: "数据分析实习生",
    team: "数据团队",
    location: "Remote – Greater China",
    type: "实习",
    skills: ["SQL", "Python", "数据可视化", "AB 分析"],
    postedAt: "2026-04-22",
    summary: "支持产品、增长、商务三个团队的数据需求，每周 3 天起。",
    body: `## 关于团队
数据团队 2 人，业务方包括产品、增长、商务。我们用 Postgres + Metabase，数据栈不复杂，但要求口径精确。

## 你将做什么
- 取数、做看板、跑 A/B 显著性
- 整理常用指标口径并写文档
- 协助清洗合作公司返回的归因数据
- 参与每周数据评审会

## 我们在找谁
- 计算机 / 统计 / 经济相关专业在读
- SQL 熟练（能写窗口函数）
- Python 数据分析栈（pandas + matplotlib / plotly）
- 每周可投入 ≥ 24 小时

## 加分项
- 做过 Kaggle / 比赛 / 个人数据项目
- 接触过 A/B testing 框架
- 中英文写作清晰

## 福利
- 远程，工时灵活
- 实习津贴 RMB 4,000–6,000 / 月
- 表现优秀者优先转正`,
  },
  {
    slug: "content-writer-zh",
    title: "中文内容作者 (兼职)",
    team: "运营团队",
    location: "Remote – Greater China",
    type: "兼职",
    skills: ["中文写作", "选题", "SEO", "金融常识"],
    postedAt: "2026-04-15",
    summary: "为教程中心稳定供稿，每月 4–6 篇 1200 字以上长文。",
    body: `## 关于团队
和「中文社区运营」并肩作战，文稿先由社区运营 review，再由我审稿后发布。

## 你将做什么
- 每月交付 4–6 篇 1200 字以上的中文长文
- 跟踪 SEO 关键词并在写作时落点
- 接受 1 轮反馈打磨稿件

## 我们在找谁
- 至少 1 年互联网内容写作经验
- 熟悉至少一个细分领域（交易 / 加密 / 金融 / 自媒体）
- 中文表达干净、有节奏

## 加分项
- 有自己的 newsletter / 公众号
- 能配简单插画 / 图表

## 福利
- 远程，按稿付费 RMB 800–1500 / 篇
- 表现优秀者签长期约稿合同`,
  },
];

export function getJob(slug: string): Job | undefined {
  return JOBS.find(j => j.slug === slug);
}

export function getJobsSorted(): Job[] {
  return [...JOBS].sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}
