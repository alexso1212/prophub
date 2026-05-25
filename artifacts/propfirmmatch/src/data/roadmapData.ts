// 新手路线图（鱼骨图）数据。
//
// 主轴 = 从"完全没接触"到"出金到账"的 7 个阶段（鱼骨主刺）；
// 每个阶段下挂若干"小刺"（要点），可带 tip 与一个深链 CTA。
// "你在哪一步"用 statusBuckets 把用户自我定位映射到具体阶段，
// 给出"现在该干嘛"的一句话指引 + 主按钮。

export interface RoadmapLink {
  label: string;
  href: string;
  // true → 该链接是分类相对路径，组件会自动拼上 /futures|/forex|/crypto 前缀
  cat?: boolean;
}

export interface RoadmapBone {
  text: string;
  tip?: string;
}

export interface RoadmapStage {
  id: string;
  title: string;
  subtitle: string;
  bones: RoadmapBone[];
  cta?: RoadmapLink;
  // 标记尚未填充完整真实内容的阶段（如国内出金细节，待补）
  pending?: boolean;
}

export interface StatusBucket {
  id: string;
  label: string;
  // 命中的阶段 id（用于高亮）
  stages: string[];
  // 默认聚焦展开的阶段 id
  focus: string;
  guidance: string;
  cta: RoadmapLink;
}

export const roadmapStages: RoadmapStage[] = [
  {
    id: "understand",
    title: "了解自营交易",
    subtitle: "这是什么、适不适合我",
    bones: [
      { text: "用公司的资金交易，你只出策略和技术", tip: "真实账户由公司出资，你不用充本金" },
      { text: "利润 80%–90% 归你，公司抽 10%–20%", tip: "按你签约的等级分成" },
      { text: "考不过只损失报名费，亏的不是你的本金" },
    ],
    cta: { label: "60 秒测我适不适合", href: "/knowledge/decision" },
  },
  {
    id: "choose",
    title: "选一家公司",
    subtitle: "对比规则·点差·出金·折扣",
    bones: [
      { text: "看报名费：$50–$1000，按账户大小", tip: "账户越大、报名费越高" },
      { text: "看考核规则：盈利目标 / 最大回撤 / 持仓时长" },
      { text: "看分成比例：通常 80%–90% 归你" },
      { text: "看出金记录：站内有近 30 天到账截图", tip: "真实到账截图越多越靠谱" },
    ],
    cta: { label: "对比全部公司", href: "/all-prop-firms", cat: true },
  },
  {
    id: "register",
    title: "注册报名",
    subtitle: "在官网付费报名考核",
    bones: [
      { text: "先选账户大小：25K / 50K / 100K …" },
      { text: "用银行卡或 USDT 支付报名费" },
      { text: "结账时贴上优惠码，省 10%–90%", tip: "本站为多家公司提供专属优惠码" },
    ],
    cta: { label: "看本月专属优惠", href: "/exclusive-offers", cat: true },
  },
  {
    id: "platform",
    title: "装平台 · 学软件",
    subtitle: "下单、止损、看盈亏",
    bones: [
      { text: "认识平台：NinjaTrader / Tradovate / MT4·MT5 / Rithmic", tip: "不同公司支持不同平台，报名前先确认" },
      { text: "学会下单、设止损止盈" },
      { text: "学会看实时盈亏和回撤数字" },
    ],
    cta: { label: "看新手教程", href: "/tutorials" },
  },
  {
    id: "exam",
    title: "通过考核",
    subtitle: "达标规则别踩线",
    bones: [
      { text: "达到盈利目标金额" },
      { text: "别踩最大回撤线", tip: "分清「当日结算回撤(EOD)」和「实时回撤」" },
      { text: "满足最低交易天数 / 一致性规则" },
    ],
    cta: { label: "看规则手册", href: "/prop-firm-rules", cat: true },
  },
  {
    id: "live",
    title: "拿真实账户实盘",
    subtitle: "通过后正式操盘",
    bones: [
      { text: "签电子合同，拿到出资真实账户" },
      { text: "按公司规则稳定交易" },
      { text: "积累可分成的利润，准备出金" },
    ],
  },
  {
    id: "payout",
    title: "出金分成",
    subtitle: "国内用户重点 · 待完善",
    pending: true,
    bones: [
      { text: "出金方式：USDT / 银行卡 / 第三方（待补真实细节）" },
      { text: "首次出金条件 / 出金周期（待补）" },
      { text: "到账时间 / 手续费 / 汇率（待补）" },
      { text: "身份认证 KYC（待补）" },
    ],
    cta: { label: "看真实出金记录", href: "/payouts", cat: true },
  },
];

export const statusBuckets: StatusBucket[] = [
  {
    id: "new",
    label: "还没接触过",
    stages: ["understand", "choose"],
    focus: "understand",
    guidance: "先花 1 分钟搞懂「自营交易是什么」，再挑一家靠谱公司。",
    cta: { label: "测我适不适合", href: "/knowledge/decision" },
  },
  {
    id: "ready",
    label: "想报名买考核",
    stages: ["register"],
    focus: "register",
    guidance: "选好账户大小，结账时记得用优惠码省一笔。",
    cta: { label: "看本月优惠", href: "/exclusive-offers", cat: true },
  },
  {
    id: "exam",
    label: "正在考核中",
    stages: ["platform", "exam"],
    focus: "exam",
    guidance: "盯紧盈利目标和回撤线，先把规则手册看明白。",
    cta: { label: "看规则手册", href: "/prop-firm-rules", cat: true },
  },
  {
    id: "payout",
    label: "已通过 · 想出金",
    stages: ["live", "payout"],
    focus: "payout",
    guidance: "看看别人近 30 天的真实到账，了解出金方式与周期。",
    cta: { label: "看出金记录", href: "/payouts", cat: true },
  },
];
