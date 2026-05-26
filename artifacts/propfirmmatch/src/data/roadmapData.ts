// 鱼骨图节点数据（原则 A：每个节点先说「你能得到什么 / 该做什么」，不堆信息）。
// 主刺 = 从 0 到出金的 6 个阶段；每刺点开后是 gain（你能得到什么）+ 若干 bones：
//   - point：行动点（label + action），直接告诉小白做什么
//   - guide：攻略叶子（slug 对应 guideMaps，点开是「比喻 + 迷你导图」）

export interface RoadmapCta {
  label: string;
  href: string;
  cat?: boolean;   // 分类相对路径，组件自动拼 /futures|/forex|/crypto
  ghost?: boolean;
}

export type RoadmapBone =
  | { kind: "point"; label: string; action: string }
  | { kind: "guide"; slug: string };

export interface RoadmapStage {
  id: string;
  title: string;   // 主刺节点（收益导向短句）
  gain: string;    // 点开后第一行：你能得到什么
  bones: RoadmapBone[];
  ctas?: RoadmapCta[];
}

export const roadmapStages: RoadmapStage[] = [
  {
    id: "understand",
    title: "看懂这门生意",
    gain: "3 分钟搞懂自营交易是什么、判断自己适不适合，不交冤枉钱。",
    bones: [
      { kind: "guide", slug: "what-is-futures-prop-firm" },
      { kind: "point", label: "我会亏多少？", action: "最多亏报名费——不用充交易本金，亏的不是你的钱" },
      { kind: "point", label: "本站怎么赚钱", action: "部分链接为返佣链接，使用可能给本站带来佣金（评价保持独立）" },
    ],
    ctas: [{ label: "60 秒测我适不适合", href: "/knowledge/decision" }],
  },
  {
    id: "choose",
    title: "挑对一家公司",
    gain: "帮你挑一家：便宜、靠谱、出金快、对新手友好的公司。",
    bones: [
      { kind: "guide", slug: "low-cost-path" },
      { kind: "point", label: "怎么挑", action: "看报名费、看考核规则、看分成、看真实出金记录" },
      { kind: "point", label: "已经在别家了？", action: "用「查我的平台」查它好不好、怎么过关，还能领我们的福利" },
    ],
    ctas: [
      { label: "对比全部公司", href: "/all-prop-firms", cat: true },
      { label: "60 秒测一测", href: "/knowledge/decision", ghost: true },
    ],
  },
  {
    id: "register",
    title: "开通账户还省钱",
    gain: "手把手开通账户，结账时用我们的优惠码省一笔。",
    bones: [
      { kind: "point", label: "先选账户大小", action: "新手从小账户起步：25K / 50K，别一上来冲大号" },
      { kind: "point", label: "怎么付款", action: "信用卡 / USDT / Wise，部分平台支持支付宝、微信" },
      { kind: "point", label: "用优惠码", action: "结账时粘贴我们的专属码，省 10%–90%（返佣披露）" },
    ],
    ctas: [{ label: "看本月专属优惠", href: "/exclusive-offers", cat: true }],
  },
  {
    id: "software",
    title: "5 步学会用软件",
    gain: "学会下单、止损、看盈亏，不再对着交易软件发懵。",
    bones: [
      { kind: "guide", slug: "tradovate-guide" },
      { kind: "guide", slug: "rithmic-guide" },
      { kind: "point", label: "下单基本功", action: "练熟市价/限价/止损单，会看实时盈亏和回撤数字" },
    ],
    ctas: [{ label: "更多软件教程", href: "/tutorials" }],
  },
  {
    id: "exam",
    title: "避开出局红线",
    gain: "看懂 3 条会让你直接出局的红线，把「靠运气」变成「稳定达标」。",
    bones: [
      { kind: "guide", slug: "drawdown-rules" },
      { kind: "guide", slug: "consistency-rule" },
      { kind: "guide", slug: "intraday-liquidation" },
    ],
    ctas: [{ label: "看各家规则对比", href: "/prop-firm-rules", cat: true }],
  },
  {
    id: "payout",
    title: "把钱安全拿回国内",
    gain: "认证、收款、税表一步步教，搞定 KYC 和首次出金。",
    bones: [
      { kind: "guide", slug: "kyc-guide" },
      { kind: "guide", slug: "wise-payout" },
      { kind: "guide", slug: "w8-form-guide" },
      { kind: "point", label: "出金门槛", action: "注意最低出金额、单次上限、出金周期（各家不同）" },
    ],
    ctas: [{ label: "看真实出金记录", href: "/payouts", cat: true }],
  },
];
