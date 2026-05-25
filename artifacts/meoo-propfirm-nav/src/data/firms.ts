import type { Firm } from '../types';

export const firmsData: Firm[] = [
  {
    id: '1',
    name: 'Lucid Trading',
    slug: 'lucid-trading',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=LT&backgroundColor=3b82f6',
    officialUrl: 'https://www.lucidtrading.com/',
    affiliateUrl: 'https://lucidtrading.com/ref',
    couponCode: 'LUCID20',
    cnUserStatus: 'supported',
    summary: '专注于期货自营交易，提供多种账户规模和灵活的回撤规则',
    rating: 4.5,
    riskLevel: 'medium',
    supportedPlatforms: ['Tradovate', 'Rithmic', 'NinjaTrader'],
    paymentMethods: ['信用卡', 'PayPal', '加密货币'],
    kycRequirements: '基础身份验证',
    lastVerifiedAt: '2026-05-10',
    sourceUrls: ['https://support.lucidtrading.com/en/'],
    accountTypes: [
      {
        id: 'lt-1',
        firmId: '1',
        name: 'Starter',
        accountSize: 50000,
        fee: 149,
        feeType: 'one-time',
        profitTarget: 3000,
        maxDrawdown: 2500,
        dailyLossLimit: 1500,
        drawdownType: 'eod',
        minTradingDays: 5,
        consistencyRule: true,
        payoutSplit: 80,
        payoutMinimum: 500
      },
      {
        id: 'lt-2',
        firmId: '1',
        name: 'Pro',
        accountSize: 150000,
        fee: 349,
        feeType: 'one-time',
        profitTarget: 9000,
        maxDrawdown: 7500,
        dailyLossLimit: 4500,
        drawdownType: 'eod',
        minTradingDays: 5,
        consistencyRule: true,
        payoutSplit: 85,
        payoutMinimum: 500
      }
    ]
  },
  {
    id: '2',
    name: 'FundedNext Futures',
    slug: 'fundednext-futures',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=FN&backgroundColor=10b981',
    officialUrl: 'https://futures.fundednext.com/',
    affiliateUrl: 'https://fundednext.com/futures/ref',
    couponCode: 'FNFUTURES',
    cnUserStatus: 'supported',
    summary: '知名外汇Prop Firm的期货分支，以稳定的出金记录著称',
    rating: 4.7,
    riskLevel: 'low',
    supportedPlatforms: ['Tradovate', 'Rithmic'],
    paymentMethods: ['信用卡', '加密货币', 'Wise'],
    kycRequirements: '标准KYC流程',
    lastVerifiedAt: '2026-05-12',
    sourceUrls: ['https://helpfutures.fundednext.com/en'],
    accountTypes: [
      {
        id: 'fn-1',
        firmId: '2',
        name: 'Evaluation',
        accountSize: 50000,
        fee: 199,
        feeType: 'one-time',
        profitTarget: 3500,
        maxDrawdown: 2500,
        dailyLossLimit: 1250,
        drawdownType: 'tdd',
        minTradingDays: 10,
        consistencyRule: true,
        activationFee: 149,
        payoutSplit: 80,
        payoutMinimum: 1000,
        payoutCap: 10000
      }
    ]
  },
  {
    id: '3',
    name: 'Alpha Futures',
    slug: 'alpha-futures',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=AF&backgroundColor=f59e0b',
    officialUrl: 'https://alpha-futures.com/',
    cnUserStatus: 'restricted',
    summary: '新兴平台，提供无一致性规则的灵活交易环境',
    rating: 4.2,
    riskLevel: 'medium',
    supportedPlatforms: ['Tradovate', 'ProjectX'],
    paymentMethods: ['信用卡', '加密货币'],
    kycRequirements: '简化KYC',
    lastVerifiedAt: '2026-05-08',
    sourceUrls: ['https://alpha-futures.com/'],
    accountTypes: [
      {
        id: 'af-1',
        firmId: '3',
        name: 'Basic',
        accountSize: 25000,
        fee: 99,
        feeType: 'one-time',
        profitTarget: 1500,
        maxDrawdown: 1500,
        drawdownType: 'static',
        minTradingDays: 3,
        consistencyRule: false,
        payoutSplit: 75,
        payoutMinimum: 250
      }
    ]
  },
  {
    id: '4',
    name: 'Topstep',
    slug: 'topstep',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=TS&backgroundColor=ef4444',
    officialUrl: 'https://www.topstep.com/topstep-prop/',
    affiliateUrl: 'https://topstep.com/ref',
    couponCode: 'TOPSTEP',
    cnUserStatus: 'supported',
    summary: '行业老牌平台，以严格的规则筛选和培养交易员闻名',
    rating: 4.6,
    riskLevel: 'low',
    supportedPlatforms: ['Tradovate', 'NinjaTrader', 'Quantower'],
    paymentMethods: ['信用卡', 'PayPal', '银行转账'],
    kycRequirements: '完整KYC',
    lastVerifiedAt: '2026-05-11',
    sourceUrls: ['https://www.topstep.com/topstep-prop/'],
    accountTypes: [
      {
        id: 'ts-1',
        firmId: '4',
        name: '50K',
        accountSize: 50000,
        fee: 165,
        feeType: 'monthly',
        profitTarget: 3000,
        maxDrawdown: 2000,
        dailyLossLimit: 1000,
        drawdownType: 'tdd',
        minTradingDays: 5,
        consistencyRule: true,
        payoutSplit: 90,
        payoutMinimum: 500
      }
    ]
  },
  {
    id: '5',
    name: 'Take Profit Trader',
    slug: 'take-profit-trader',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=TPT&backgroundColor=8b5cf6',
    officialUrl: 'https://takeprofittrader.com',
    cnUserStatus: 'supported',
    summary: '以高分成比例和快速出金流程著称',
    rating: 4.4,
    riskLevel: 'medium',
    supportedPlatforms: ['Tradovate', 'Rithmic'],
    paymentMethods: ['信用卡', '加密货币'],
    kycRequirements: '标准KYC',
    lastVerifiedAt: '2026-05-09',
    sourceUrls: ['https://takeprofittrader.com/faq'],
    accountTypes: [
      {
        id: 'tpt-1',
        firmId: '5',
        name: '25K',
        accountSize: 25000,
        fee: 129,
        feeType: 'one-time',
        profitTarget: 1500,
        maxDrawdown: 1500,
        drawdownType: 'trailing',
        minTradingDays: 3,
        consistencyRule: false,
        payoutSplit: 90,
        payoutMinimum: 500
      }
    ]
  },
  {
    id: '6',
    name: 'Tradeday',
    slug: 'tradeday',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=TD&backgroundColor=06b6d4',
    officialUrl: 'https://tradeday.com',
    cnUserStatus: 'unknown',
    summary: '提供免考直接 funded 账户的独特模式',
    rating: 4.0,
    riskLevel: 'high',
    supportedPlatforms: ['Tradovate'],
    paymentMethods: ['信用卡', '加密货币'],
    kycRequirements: '基础验证',
    lastVerifiedAt: '2026-05-05',
    sourceUrls: ['https://tradeday.com/terms'],
    accountTypes: [
      {
        id: 'td-1',
        firmId: '6',
        name: 'Instant',
        accountSize: 50000,
        fee: 499,
        feeType: 'activation',
        profitTarget: 0,
        maxDrawdown: 2500,
        drawdownType: 'static',
        minTradingDays: 0,
        consistencyRule: false,
        activationFee: 499,
        payoutSplit: 70,
        payoutMinimum: 1000
      }
    ]
  },
  {
    id: '7',
    name: 'Topone Futures',
    slug: 'topone-futures',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=TO&backgroundColor=ec4899',
    officialUrl: 'https://toponefutures.com',
    cnUserStatus: 'supported',
    summary: '亚洲用户友好型平台，支持中文客服',
    rating: 4.3,
    riskLevel: 'medium',
    supportedPlatforms: ['Tradovate', 'Rithmic', 'NinjaTrader'],
    paymentMethods: ['信用卡', '支付宝', '微信支付'],
    kycRequirements: '简化KYC',
    lastVerifiedAt: '2026-05-11',
    sourceUrls: ['https://toponefutures.com/cn'],
    accountTypes: [
      {
        id: 'to-1',
        firmId: '7',
        name: 'Standard',
        accountSize: 50000,
        fee: 179,
        feeType: 'one-time',
        profitTarget: 3000,
        maxDrawdown: 2500,
        dailyLossLimit: 1500,
        drawdownType: 'eod',
        minTradingDays: 5,
        consistencyRule: true,
        payoutSplit: 80,
        payoutMinimum: 500
      }
    ]
  },
  {
    id: '8',
    name: 'Purdia',
    slug: 'purdia',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=PU&backgroundColor=84cc16',
    officialUrl: 'https://purdia.com',
    cnUserStatus: 'supported',
    summary: '专注于小账户规模，适合新手入门',
    rating: 4.1,
    riskLevel: 'low',
    supportedPlatforms: ['Tradovate'],
    paymentMethods: ['信用卡', 'PayPal'],
    kycRequirements: '基础验证',
    lastVerifiedAt: '2026-05-07',
    sourceUrls: ['https://purdia.com/rules'],
    accountTypes: [
      {
        id: 'pu-1',
        firmId: '8',
        name: 'Micro',
        accountSize: 10000,
        fee: 49,
        feeType: 'one-time',
        profitTarget: 600,
        maxDrawdown: 500,
        drawdownType: 'static',
        minTradingDays: 3,
        consistencyRule: false,
        payoutSplit: 75,
        payoutMinimum: 100
      }
    ]
  },
  {
    id: '9',
    name: 'Tradeify',
    slug: 'tradeify',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=TR&backgroundColor=f97316',
    officialUrl: 'https://tradeify.io',
    cnUserStatus: 'restricted',
    summary: '提供多阶段评估和快速晋级通道',
    rating: 4.0,
    riskLevel: 'medium',
    supportedPlatforms: ['Rithmic', 'NinjaTrader'],
    paymentMethods: ['信用卡', '加密货币'],
    kycRequirements: '标准KYC',
    lastVerifiedAt: '2026-05-06',
    sourceUrls: ['https://tradeify.io/faq'],
    accountTypes: [
      {
        id: 'tr-1',
        firmId: '9',
        name: 'Phase 1',
        accountSize: 50000,
        fee: 199,
        feeType: 'one-time',
        profitTarget: 4000,
        maxDrawdown: 2500,
        dailyLossLimit: 1500,
        drawdownType: 'tdd',
        minTradingDays: 7,
        consistencyRule: true,
        payoutSplit: 80,
        payoutMinimum: 500
      }
    ]
  },
  {
    id: '10',
    name: 'Apex Trader Funding',
    slug: 'apex-trader-funding',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=AT&backgroundColor=6366f1',
    officialUrl: 'https://apextraderfunding.com',
    affiliateUrl: 'https://apextraderfunding.com/ref',
    couponCode: 'APEX',
    cnUserStatus: 'supported',
    summary: '老牌平台，以宽松的规则和稳定的运营著称',
    rating: 4.5,
    riskLevel: 'low',
    supportedPlatforms: ['Tradovate', 'NinjaTrader', 'Quantower'],
    paymentMethods: ['信用卡', 'PayPal', '加密货币'],
    kycRequirements: '基础验证',
    lastVerifiedAt: '2026-05-12',
    sourceUrls: ['https://apextraderfunding.com/rules'],
    accountTypes: [
      {
        id: 'at-1',
        firmId: '10',
        name: '50K',
        accountSize: 50000,
        fee: 147,
        feeType: 'monthly',
        profitTarget: 3000,
        maxDrawdown: 2500,
        drawdownType: 'trailing',
        minTradingDays: 7,
        consistencyRule: false,
        payoutSplit: 100,
        payoutMinimum: 1000
      }
    ]
  }
];

export const platforms = ['Tradovate', 'Rithmic', 'ProjectX', 'NinjaTrader', 'Quantower', 'Volumetrica', 'ATAS'];

export const drawdownTypes = [
  { value: 'eod', label: 'EOD (日终)' },
  { value: 'tdd', label: 'TDD (日内)' },
  { value: 'static', label: '静态' },
  { value: 'trailing', label: '追踪' }
];

export const feeTypes = [
  { value: 'one-time', label: '一次性' },
  { value: 'monthly', label: '月费' },
  { value: 'activation', label: '激活费' }
];
