export type GiveawayStatus = "进行中" | "即将开奖" | "已结束";

export interface GiveawayWinner {
  maskedEmail: string;
  amount?: string;
  date: string;
}

export interface Giveaway {
  id: string;
  title: string;
  prize: string;
  prizeValueUsd: number;
  sponsorSlug: string;
  cosponsorSlugs?: string[];
  endsAt: string;
  entries: number;
  cap?: number;
  status: GiveawayStatus;
  winners?: GiveawayWinner[];
  proofUrl?: string;
  rules: string[];
  category: "futures" | "forex" | "crypto" | "all";
}

const today = "2026-05-17";

export const GIVEAWAYS: Giveaway[] = [
  {
    id: "g-2026-05-100k-topstep",
    title: "5 月 $100K 评估账户免费送",
    prize: "Topstep $100K Trading Combine ×3",
    prizeValueUsd: 165 * 3,
    sponsorSlug: "topstep",
    endsAt: "2026-05-31T16:00:00+08:00",
    entries: 18420,
    cap: 25000,
    status: "进行中",
    rules: [
      "完成邮箱验证即可获得 1 个抽奖号",
      "邀请 1 位好友注册可额外 +1 号（最多 5 号）",
      "5 月 31 日 16:00 北京时间公开开奖",
    ],
    category: "futures",
  },
  {
    id: "g-2026-05-fundednext-stellar",
    title: "FundedNext Stellar Lite 通行证",
    prize: "Stellar Lite $25K 评估 ×5",
    prizeValueUsd: 165 * 5,
    sponsorSlug: "fundednext-futures",
    endsAt: "2026-05-28T20:00:00+08:00",
    entries: 12044,
    cap: 20000,
    status: "进行中",
    rules: [
      "完成邮箱验证 + 加入官方 Discord",
      "已通过 FundedNext 任一阶段考核者获 2 倍号",
    ],
    category: "all",
  },
  {
    id: "g-2026-05-apex-weekend",
    title: "Apex 周末速通赛免费票",
    prize: "Apex $50K 评估 ×2",
    prizeValueUsd: 167 * 2,
    sponsorSlug: "apex-trader-funding",
    endsAt: "2026-05-24T22:00:00+08:00",
    entries: 7311,
    cap: 12000,
    status: "进行中",
    rules: [
      "需要确认已阅读 Apex 一致性规则",
      "中奖账户必须 14 天内激活，否则视为放弃",
    ],
    category: "futures",
  },
  {
    id: "g-2026-05-mffu-150k",
    title: "MFFU $150K Express 评估",
    prize: "My Funded Futures $150K Express ×1",
    prizeValueUsd: 297,
    sponsorSlug: "my-funded-futures",
    endsAt: "2026-05-30T21:00:00+08:00",
    entries: 9520,
    cap: 15000,
    status: "进行中",
    rules: [
      "限新用户报名（注册 MFFU 时间 < 30 天）",
      "中奖后 7 天内开始第一笔交易",
    ],
    category: "futures",
  },

  {
    id: "g-2026-05-tradeify-25k",
    title: "Tradeify Straight-To-Sim 通关券",
    prize: "Tradeify Straight-To-Sim $25K ×4",
    prizeValueUsd: 125 * 4,
    sponsorSlug: "tradeify",
    endsAt: "2026-05-19T20:00:00+08:00",
    entries: 15780,
    cap: 16000,
    status: "即将开奖",
    rules: [
      "已报名用户请关注邮箱通知",
      "开奖名单将在公示后 24 小时内发奖",
    ],
    category: "futures",
  },
  {
    id: "g-2026-05-alpha-futures-50k",
    title: "Alpha Futures $50K 评估通行证",
    prize: "Alpha Futures $50K Eval ×3",
    prizeValueUsd: 135 * 3,
    sponsorSlug: "alpha-futures",
    cosponsorSlugs: ["e8-futures"],
    endsAt: "2026-05-18T20:00:00+08:00",
    entries: 11209,
    cap: 12000,
    status: "即将开奖",
    rules: [
      "由 Alpha Futures × E8 联合赞助",
      "开奖名单将同步发布在两家官方 Discord",
    ],
    category: "all",
  },

  {
    id: "g-2026-04-mffu-april",
    title: "4 月感恩月抽奖",
    prize: "MFFU $150K Express ×1 + Apex $50K ×2",
    prizeValueUsd: 297 + 167 * 2,
    sponsorSlug: "my-funded-futures",
    cosponsorSlugs: ["apex-trader-funding"],
    endsAt: "2026-04-30T20:00:00+08:00",
    entries: 22100,
    cap: 22100,
    status: "已结束",
    winners: [
      { maskedEmail: "t****y@gmail.com", amount: "$150K Express", date: "2026-05-02" },
      { maskedEmail: "z****8@qq.com", amount: "$50K Apex", date: "2026-05-02" },
      { maskedEmail: "l****o@outlook.com", amount: "$50K Apex", date: "2026-05-02" },
    ],
    proofUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 240'><rect width='600' height='240' fill='%231a1a2e'/><text x='28' y='52' fill='%2322c55e' font-family='Inter,sans-serif' font-size='18' font-weight='700'>%E2%9C%93 4%E6%9C%88%E5%B9%B8%E8%BF%90%E8%80%85%E5%87%AD%E8%AF%81</text><text x='28' y='90' fill='%23ffffff' font-family='Inter,sans-serif' font-size='14'>t****y@gmail.com %E2%80%94 MFFU $150K Express</text><text x='28' y='118' fill='%23ffffff' font-family='Inter,sans-serif' font-size='14'>z****8@qq.com %E2%80%94 Apex $50K</text><text x='28' y='146' fill='%23ffffff' font-family='Inter,sans-serif' font-size='14'>l****o@outlook.com %E2%80%94 Apex $50K</text><text x='28' y='200' fill='%23a1a1aa' font-family='Inter,sans-serif' font-size='12'>%E5%8F%91%E5%A5%96%E6%97%B6%E9%97%B4%EF%BC%9A2026-05-02 %E2%80%A2 %E5%87%AD%E8%AF%81%E5%B7%B2%E5%85%AC%E7%A4%BA%E4%BA%8E%E5%AE%98%E6%96%B9 Discord</text></svg>",
    rules: ["开奖直播回放可在 B 站搜索“propfirmmatch 四月开奖”"],
    category: "all",
  },
  {
    id: "g-2026-04-topstep-quarterly",
    title: "Q1 季度 Topstep 大礼包",
    prize: "Topstep $150K Combine ×2",
    prizeValueUsd: 199 * 2,
    sponsorSlug: "topstep",
    endsAt: "2026-04-15T20:00:00+08:00",
    entries: 18900,
    cap: 18900,
    status: "已结束",
    winners: [
      { maskedEmail: "j****k@gmail.com", amount: "$150K Combine", date: "2026-04-17" },
      { maskedEmail: "w****m@163.com", amount: "$150K Combine", date: "2026-04-17" },
    ],
    proofUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 200'><rect width='600' height='200' fill='%231a1a2e'/><text x='28' y='52' fill='%2322c55e' font-family='Inter,sans-serif' font-size='18' font-weight='700'>%E2%9C%93 Q1 %E5%AD%A3%E5%BA%A6%E5%BC%80%E5%A5%96%E5%87%AD%E8%AF%81</text><text x='28' y='90' fill='%23ffffff' font-family='Inter,sans-serif' font-size='14'>j****k@gmail.com %E2%80%94 Topstep $150K Combine</text><text x='28' y='118' fill='%23ffffff' font-family='Inter,sans-serif' font-size='14'>w****m@163.com %E2%80%94 Topstep $150K Combine</text><text x='28' y='168' fill='%23a1a1aa' font-family='Inter,sans-serif' font-size='12'>%E5%8F%91%E5%A5%96%E6%97%B6%E9%97%B4%EF%BC%9A2026-04-17</text></svg>",
    rules: ["奖品已通过 Topstep 官方账户邮件直接发放"],
    category: "futures",
  },
];

export function getOngoing(): Giveaway[] {
  return GIVEAWAYS.filter(g => g.status === "进行中");
}
export function getEnding(): Giveaway[] {
  return GIVEAWAYS.filter(g => g.status === "即将开奖");
}
export function getEnded(): Giveaway[] {
  return GIVEAWAYS.filter(g => g.status === "已结束");
}

export function todayStr(): string {
  return today;
}
