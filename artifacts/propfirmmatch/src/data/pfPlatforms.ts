// 平台库——从 content-knowledge-base/knowledge-base.json 的 firmsData 提取。
// 用于「查我的平台」体检卡 + 自动过关攻略。规则/费用/地区/返佣链接均需人工核验，以上游官网最新说明为准。

export type CnStatus = "supported" | "restricted" | "unknown";
export type DrawdownType = "eod" | "tdd" | "static" | "trailing";
export type FeeType = "one-time" | "monthly" | "activation";

export interface PfAccountType {
  name: string; accountSize: number; fee: number; feeType: FeeType;
  profitTarget: number; maxDrawdown: number; dailyLossLimit: number | null;
  drawdownType: DrawdownType; minTradingDays: number; consistencyRule: boolean;
  payoutSplit: number; payoutMinimum: number;
}

export interface PfPlatform {
  name: string; slug: string; officialUrl: string | null; affiliateUrl: string | null;
  couponCode: string | null; cnUserStatus: CnStatus; summary: string; rating: number | null;
  riskLevel: "low" | "medium" | "high"; supportedPlatforms: string[]; paymentMethods: string[];
  kycRequirements: string; lastVerifiedAt: string; sourceUrls: string[]; accountTypes: PfAccountType[];
}

export const DRAWDOWN_LABEL: Record<DrawdownType, string> = { eod: "EOD 日终回撤", tdd: "TDD 实时回撤", static: "静态回撤", trailing: "追踪回撤" };
export const FEE_LABEL: Record<FeeType, string> = { "one-time": "一次性", monthly: "月费", activation: "激活费" };

export const pfPlatforms: PfPlatform[] = [
  {
    "name": "Lucid Trading",
    "slug": "lucid-trading",
    "officialUrl": "https://www.lucidtrading.com/",
    "affiliateUrl": "https://lucidtrading.com/ref",
    "couponCode": "LUCID20",
    "cnUserStatus": "supported",
    "summary": "专注于期货自营交易，提供多种账户规模和灵活的回撤规则",
    "rating": 4.5,
    "riskLevel": "medium",
    "supportedPlatforms": [
      "Tradovate",
      "Rithmic",
      "NinjaTrader"
    ],
    "paymentMethods": [
      "信用卡",
      "PayPal",
      "加密货币"
    ],
    "kycRequirements": "基础身份验证",
    "lastVerifiedAt": "2026-05-10",
    "sourceUrls": [
      "https://support.lucidtrading.com/en/"
    ],
    "accountTypes": [
      {
        "name": "Starter",
        "accountSize": 50000,
        "fee": 149,
        "feeType": "one-time",
        "profitTarget": 3000,
        "maxDrawdown": 2500,
        "dailyLossLimit": 1500,
        "drawdownType": "eod",
        "minTradingDays": 5,
        "consistencyRule": true,
        "payoutSplit": 80,
        "payoutMinimum": 500
      },
      {
        "name": "Pro",
        "accountSize": 150000,
        "fee": 349,
        "feeType": "one-time",
        "profitTarget": 9000,
        "maxDrawdown": 7500,
        "dailyLossLimit": 4500,
        "drawdownType": "eod",
        "minTradingDays": 5,
        "consistencyRule": true,
        "payoutSplit": 85,
        "payoutMinimum": 500
      }
    ]
  },
  {
    "name": "FundedNext Futures",
    "slug": "fundednext-futures",
    "officialUrl": "https://futures.fundednext.com/",
    "affiliateUrl": "https://fundednext.com/futures/ref",
    "couponCode": "FNFUTURES",
    "cnUserStatus": "supported",
    "summary": "知名外汇Prop Firm的期货分支，以稳定的出金记录著称",
    "rating": 4.7,
    "riskLevel": "low",
    "supportedPlatforms": [
      "Tradovate",
      "Rithmic"
    ],
    "paymentMethods": [
      "信用卡",
      "加密货币",
      "Wise"
    ],
    "kycRequirements": "标准KYC流程",
    "lastVerifiedAt": "2026-05-12",
    "sourceUrls": [
      "https://helpfutures.fundednext.com/en"
    ],
    "accountTypes": [
      {
        "name": "Evaluation",
        "accountSize": 50000,
        "fee": 199,
        "feeType": "one-time",
        "profitTarget": 3500,
        "maxDrawdown": 2500,
        "dailyLossLimit": 1250,
        "drawdownType": "tdd",
        "minTradingDays": 10,
        "consistencyRule": true,
        "payoutSplit": 80,
        "payoutMinimum": 1000
      }
    ]
  },
  {
    "name": "Alpha Futures",
    "slug": "alpha-futures",
    "officialUrl": "https://alpha-futures.com/",
    "affiliateUrl": null,
    "couponCode": null,
    "cnUserStatus": "restricted",
    "summary": "新兴平台，提供无一致性规则的灵活交易环境",
    "rating": 4.2,
    "riskLevel": "medium",
    "supportedPlatforms": [
      "Tradovate",
      "ProjectX"
    ],
    "paymentMethods": [
      "信用卡",
      "加密货币"
    ],
    "kycRequirements": "简化KYC",
    "lastVerifiedAt": "2026-05-08",
    "sourceUrls": [
      "https://alpha-futures.com/"
    ],
    "accountTypes": [
      {
        "name": "Basic",
        "accountSize": 25000,
        "fee": 99,
        "feeType": "one-time",
        "profitTarget": 1500,
        "maxDrawdown": 1500,
        "dailyLossLimit": null,
        "drawdownType": "static",
        "minTradingDays": 3,
        "consistencyRule": false,
        "payoutSplit": 75,
        "payoutMinimum": 250
      }
    ]
  },
  {
    "name": "Topstep",
    "slug": "topstep",
    "officialUrl": "https://www.topstep.com/topstep-prop/",
    "affiliateUrl": "https://topstep.com/ref",
    "couponCode": "TOPSTEP",
    "cnUserStatus": "supported",
    "summary": "行业老牌平台，以严格的规则筛选和培养交易员闻名",
    "rating": 4.6,
    "riskLevel": "low",
    "supportedPlatforms": [
      "Tradovate",
      "NinjaTrader",
      "Quantower"
    ],
    "paymentMethods": [
      "信用卡",
      "PayPal",
      "银行转账"
    ],
    "kycRequirements": "完整KYC",
    "lastVerifiedAt": "2026-05-11",
    "sourceUrls": [
      "https://www.topstep.com/topstep-prop/"
    ],
    "accountTypes": [
      {
        "name": "50K",
        "accountSize": 50000,
        "fee": 165,
        "feeType": "monthly",
        "profitTarget": 3000,
        "maxDrawdown": 2000,
        "dailyLossLimit": 1000,
        "drawdownType": "tdd",
        "minTradingDays": 5,
        "consistencyRule": true,
        "payoutSplit": 90,
        "payoutMinimum": 500
      }
    ]
  },
  {
    "name": "Take Profit Trader",
    "slug": "take-profit-trader",
    "officialUrl": "https://takeprofittrader.com",
    "affiliateUrl": null,
    "couponCode": null,
    "cnUserStatus": "supported",
    "summary": "以高分成比例和快速出金流程著称",
    "rating": 4.4,
    "riskLevel": "medium",
    "supportedPlatforms": [
      "Tradovate",
      "Rithmic"
    ],
    "paymentMethods": [
      "信用卡",
      "加密货币"
    ],
    "kycRequirements": "标准KYC",
    "lastVerifiedAt": "2026-05-09",
    "sourceUrls": [
      "https://takeprofittrader.com/faq"
    ],
    "accountTypes": [
      {
        "name": "25K",
        "accountSize": 25000,
        "fee": 129,
        "feeType": "one-time",
        "profitTarget": 1500,
        "maxDrawdown": 1500,
        "dailyLossLimit": null,
        "drawdownType": "trailing",
        "minTradingDays": 3,
        "consistencyRule": false,
        "payoutSplit": 90,
        "payoutMinimum": 500
      }
    ]
  },
  {
    "name": "Tradeday",
    "slug": "tradeday",
    "officialUrl": "https://tradeday.com",
    "affiliateUrl": null,
    "couponCode": null,
    "cnUserStatus": "unknown",
    "summary": "提供免考直接 funded 账户的独特模式",
    "rating": 4,
    "riskLevel": "high",
    "supportedPlatforms": [
      "Tradovate"
    ],
    "paymentMethods": [
      "信用卡",
      "加密货币"
    ],
    "kycRequirements": "基础验证",
    "lastVerifiedAt": "2026-05-05",
    "sourceUrls": [
      "https://tradeday.com/terms"
    ],
    "accountTypes": [
      {
        "name": "Instant",
        "accountSize": 50000,
        "fee": 499,
        "feeType": "activation",
        "profitTarget": 0,
        "maxDrawdown": 2500,
        "dailyLossLimit": null,
        "drawdownType": "static",
        "minTradingDays": 0,
        "consistencyRule": false,
        "payoutSplit": 70,
        "payoutMinimum": 1000
      }
    ]
  },
  {
    "name": "Topone Futures",
    "slug": "topone-futures",
    "officialUrl": "https://toponefutures.com",
    "affiliateUrl": null,
    "couponCode": null,
    "cnUserStatus": "supported",
    "summary": "亚洲用户友好型平台，支持中文客服",
    "rating": 4.3,
    "riskLevel": "medium",
    "supportedPlatforms": [
      "Tradovate",
      "Rithmic",
      "NinjaTrader"
    ],
    "paymentMethods": [
      "信用卡",
      "支付宝",
      "微信支付"
    ],
    "kycRequirements": "简化KYC",
    "lastVerifiedAt": "2026-05-11",
    "sourceUrls": [
      "https://toponefutures.com/cn"
    ],
    "accountTypes": [
      {
        "name": "Standard",
        "accountSize": 50000,
        "fee": 179,
        "feeType": "one-time",
        "profitTarget": 3000,
        "maxDrawdown": 2500,
        "dailyLossLimit": 1500,
        "drawdownType": "eod",
        "minTradingDays": 5,
        "consistencyRule": true,
        "payoutSplit": 80,
        "payoutMinimum": 500
      }
    ]
  },
  {
    "name": "Purdia",
    "slug": "purdia",
    "officialUrl": "https://purdia.com",
    "affiliateUrl": null,
    "couponCode": null,
    "cnUserStatus": "supported",
    "summary": "专注于小账户规模，适合新手入门",
    "rating": 4.1,
    "riskLevel": "low",
    "supportedPlatforms": [
      "Tradovate"
    ],
    "paymentMethods": [
      "信用卡",
      "PayPal"
    ],
    "kycRequirements": "基础验证",
    "lastVerifiedAt": "2026-05-07",
    "sourceUrls": [
      "https://purdia.com/rules"
    ],
    "accountTypes": [
      {
        "name": "Micro",
        "accountSize": 10000,
        "fee": 49,
        "feeType": "one-time",
        "profitTarget": 600,
        "maxDrawdown": 500,
        "dailyLossLimit": null,
        "drawdownType": "static",
        "minTradingDays": 3,
        "consistencyRule": false,
        "payoutSplit": 75,
        "payoutMinimum": 100
      }
    ]
  },
  {
    "name": "Tradeify",
    "slug": "tradeify",
    "officialUrl": "https://tradeify.io",
    "affiliateUrl": null,
    "couponCode": null,
    "cnUserStatus": "restricted",
    "summary": "提供多阶段评估和快速晋级通道",
    "rating": 4,
    "riskLevel": "medium",
    "supportedPlatforms": [
      "Rithmic",
      "NinjaTrader"
    ],
    "paymentMethods": [
      "信用卡",
      "加密货币"
    ],
    "kycRequirements": "标准KYC",
    "lastVerifiedAt": "2026-05-06",
    "sourceUrls": [
      "https://tradeify.io/faq"
    ],
    "accountTypes": [
      {
        "name": "Phase 1",
        "accountSize": 50000,
        "fee": 199,
        "feeType": "one-time",
        "profitTarget": 4000,
        "maxDrawdown": 2500,
        "dailyLossLimit": 1500,
        "drawdownType": "tdd",
        "minTradingDays": 7,
        "consistencyRule": true,
        "payoutSplit": 80,
        "payoutMinimum": 500
      }
    ]
  },
  {
    "name": "Apex Trader Funding",
    "slug": "apex-trader-funding",
    "officialUrl": "https://apextraderfunding.com",
    "affiliateUrl": "https://apextraderfunding.com/ref",
    "couponCode": "APEX",
    "cnUserStatus": "supported",
    "summary": "老牌平台，以宽松的规则和稳定的运营著称",
    "rating": 4.5,
    "riskLevel": "low",
    "supportedPlatforms": [
      "Tradovate",
      "NinjaTrader",
      "Quantower"
    ],
    "paymentMethods": [
      "信用卡",
      "PayPal",
      "加密货币"
    ],
    "kycRequirements": "基础验证",
    "lastVerifiedAt": "2026-05-12",
    "sourceUrls": [
      "https://apextraderfunding.com/rules"
    ],
    "accountTypes": [
      {
        "name": "50K",
        "accountSize": 50000,
        "fee": 147,
        "feeType": "monthly",
        "profitTarget": 3000,
        "maxDrawdown": 2500,
        "dailyLossLimit": null,
        "drawdownType": "trailing",
        "minTradingDays": 7,
        "consistencyRule": false,
        "payoutSplit": 100,
        "payoutMinimum": 1000
      }
    ]
  }
];
