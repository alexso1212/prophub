// 知识图谱数据源（中文）。JSON 驱动便于后续 AI 自动维护。
// 三种形态：思维导图 (mindmap)、决策树 (decision)、卡片 (cards)。

export interface MindMapNode {
  id: string;
  label: string;
  summary?: string;
  children?: MindMapNode[];
}

export const MIND_MAP_ROOT: MindMapNode = {
  id: "root",
  label: "自营交易完整知识树",
  summary: "从了解到出金，玩转 prop firm 的全景图。",
  children: [
    {
      id: "what-is",
      label: "什么是自营交易？",
      summary: "用别人的钱交易，盈利按比例分成；考核通过才能拿到资金。",
      children: [
        { id: "history", label: "起源与发展", summary: "源自传统 prop trading 公司，近年线上化、规模化。" },
        { id: "ecosystem", label: "行业生态", summary: "供应方：自营公司；需求方：散户交易员；监管：多数为离岸。" },
      ],
    },
    {
      id: "account-types",
      label: "账户类型",
      summary: "按考核流程分四大类，决定了你要花的成本与时长。",
      children: [
        { id: "two-step", label: "两阶段（2-Step）", summary: "经典型：第一阶段难、第二阶段稳；最便宜但最慢。" },
        { id: "one-step", label: "一阶段（1-Step）", summary: "目标更低但回撤更严；适合稳健型。" },
        { id: "instant", label: "即时账号（Instant）", summary: "无考核直接交易，月费高、利润分成低，适合老手。" },
        { id: "express", label: "Express / 快速通道", summary: "目标更低、时间窗更短，适合短线交易员。" },
      ],
    },
    {
      id: "rules",
      label: "规则体系",
      summary: "踩到任何一条都直接出局，先记规则再下单。",
      children: [
        { id: "max-dd", label: "最大回撤", summary: "总账户从峰值的下跌上限，触及即爆仓。" },
        { id: "daily-dd", label: "单日亏损上限", summary: "每天权益下跌不能超过这条线，过线立即终止。" },
        { id: "consistency", label: "盈利一致性", summary: "单日盈利不能超过总盈利的 X%，逼你稳定不爆单。" },
        { id: "min-days", label: "最少交易日", summary: "必须分散在 N 天，禁止一天梭哈通过。" },
        { id: "news-rule", label: "新闻禁令", summary: "重大数据前后若干分钟内不可持仓。" },
      ],
    },
    {
      id: "payout",
      label: "出金流程",
      summary: "通过考核 → 签约 → 实盘交易 → 出金。",
      children: [
        { id: "first-payout", label: "首次出金", summary: "一般首笔 14–30 天起步，部分公司有最低盈利要求。" },
        { id: "split", label: "分成比例", summary: "主流 80%–90% 归交易员，少数 70% / 100%（前三笔）。" },
        { id: "methods", label: "出金方式", summary: "Crypto、Plaid、电汇、Wise；不同方式手续费 / 到账速度不同。" },
      ],
    },
    {
      id: "choose",
      label: "如何挑选",
      summary: "按交易风格 × 资金量 × 时间预算三选一。",
      children: [
        { id: "by-style", label: "按风格", summary: "日内 → Instant；波段 → 2-Step；新手 → 1-Step。" },
        { id: "by-budget", label: "按预算", summary: "<$200 选 25K/50K；$200–500 选 100K；>$500 选 150K+。" },
        { id: "by-time", label: "按时间", summary: "上班族 → 时间窗松的；全职 → 目标更激进的。" },
      ],
    },
  ],
};

// ---- 决策树：我该选哪种账号？----
export interface DecisionNode {
  id: string;
  question?: string;
  result?: {
    title: string;
    body: string;
    suggestSlug?: string; // 推荐 firm slug，跳转 affiliate
  };
  options?: { label: string; next: string }[];
}

export const DECISION_TREE: Record<string, DecisionNode> = {
  start: {
    id: "start",
    question: "你打算每天能盯盘多久？",
    options: [
      { label: "几乎全天可盯（4 小时+）", next: "fulltime" },
      { label: "下班后 1–2 小时", next: "parttime" },
      { label: "几乎没空，只能挂单观望", next: "passive" },
    ],
  },
  fulltime: {
    id: "fulltime",
    question: "你的初始预算？",
    options: [
      { label: "< $300", next: "ft-small" },
      { label: "$300 – $700", next: "ft-mid" },
      { label: "> $700", next: "ft-big" },
    ],
  },
  parttime: {
    id: "parttime",
    question: "你能承受 2 步考核的等待吗？",
    options: [
      { label: "可以慢慢来", next: "pt-2step" },
      { label: "想尽快上手", next: "pt-1step" },
    ],
  },
  passive: {
    id: "passive",
    result: {
      title: "建议：Instant 账号（即时签约）",
      body: "Instant 类账号无考核、月费支付，适合时间极少的用户。注意分成偏低、需要月月续费。",
      suggestSlug: "my-funded-futures",
    },
  },
  "ft-small": {
    id: "ft-small",
    result: {
      title: "建议：25K / 50K 两阶段账号",
      body: "预算紧、时间多 → 选 2-Step 小账号磨技术，单价低且通过率高。",
      suggestSlug: "apex-trader-funding",
    },
  },
  "ft-mid": {
    id: "ft-mid",
    result: {
      title: "建议：100K 一阶段账号",
      body: "中等预算 + 时间充裕 → 1-Step 100K 平衡了门槛与上限，过线后分成可观。",
      suggestSlug: "topstep",
    },
  },
  "ft-big": {
    id: "ft-big",
    result: {
      title: "建议：150K+ 多账号叠加",
      body: "预算充裕 → 同时挂多家 150K 账号分散风险；通过任一即可签实盘。",
      suggestSlug: "tradeday",
    },
  },
  "pt-2step": {
    id: "pt-2step",
    result: {
      title: "建议：50K 两阶段账号",
      body: "时间有限 + 心态稳 → 2-Step 50K 给足缓冲，按周做 2–3 笔即可。",
      suggestSlug: "topstep",
    },
  },
  "pt-1step": {
    id: "pt-1step",
    result: {
      title: "建议：50K 一阶段账号",
      body: "想短平快 → 1-Step 50K 一关定输赢，搭配严格止损执行。",
      suggestSlug: "goat-funded-futures",
    },
  },
};

// ---- 卡片式知识卡牌 ----
export interface KnowCard {
  id: string;
  term: string;
  category: "规则" | "费用" | "出金" | "策略" | "术语";
  short: string;
  body: string;
}

export const KNOW_CARDS: KnowCard[] = [
  { id: "c1", term: "最大回撤 (Max Drawdown)", category: "规则",
    short: "账户从峰值的允许跌幅。",
    body: "回撤分静态（永远以初始资金为参考）与移动（peak 每涨高一格抬升一格）。触及即爆仓，没有商量。" },
  { id: "c2", term: "单日亏损上限 (Daily Loss Limit)", category: "规则",
    short: "每天权益下跌的天花板。",
    body: "通常按「当日权益峰值 − 当前权益」或「前夜净值 − 当前净值」计算。过线即出局，不区分浮亏与已实现亏损。" },
  { id: "c3", term: "盈利一致性 (Consistency Rule)", category: "规则",
    short: "单日利润不可占总利润太大比例。",
    body: "典型阈值 30%–40%。逼交易员稳定下单，禁止「一天梭哈」获取大单利润。" },
  { id: "c4", term: "重置费 (Reset Fee)", category: "费用",
    short: "失败后用少量费用重置账号。",
    body: "通常为账号原价 1/3 左右；老账号重置常带额外折扣码。" },
  { id: "c5", term: "Activation Fee", category: "费用",
    short: "通过考核后激活实盘的费用。",
    body: "$80–$150 不等；少数公司前 X 个月免激活。" },
  { id: "c6", term: "分成比例 (Profit Split)", category: "出金",
    short: "交易员实拿利润的百分比。",
    body: "主流 80%–90% 归交易员；部分公司前 3 笔 100% 返还。" },
  { id: "c7", term: "首次出金锁定期", category: "出金",
    short: "签约后到第一笔出金的最短时间。",
    body: "通常 14–30 天，部分公司要求最少 N 个盈利交易日。" },
  { id: "c8", term: "Scaling Plan", category: "策略",
    short: "实盘后逐级扩容的资金计划。",
    body: "盈利 X% 后下一档自动放大本金 Y%；不同公司步进规则差异大。" },
  { id: "c9", term: "Trailing DD", category: "术语",
    short: "随峰值上移的浮动回撤线。",
    body: "权益越高、回撤线越上抬；一旦触及则永久退出。区别于固定 DD。" },
  { id: "c10", term: "EOD vs Intraday DD", category: "术语",
    short: "结算时点不同决定能否扛单。",
    body: "EOD 只看每日收盘价；Intraday 任何时刻浮亏过线即爆。" },
];
