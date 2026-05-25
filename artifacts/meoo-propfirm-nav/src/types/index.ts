export interface Firm {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  officialUrl: string;
  affiliateUrl?: string;
  couponCode?: string;
  cnUserStatus: 'supported' | 'restricted' | 'unknown';
  summary: string;
  rating: number;
  riskLevel: 'low' | 'medium' | 'high';
  supportedPlatforms: string[];
  paymentMethods: string[];
  kycRequirements: string;
  lastVerifiedAt: string;
  sourceUrls: string[];
  accountTypes: AccountType[];
}

export interface AccountType {
  id: string;
  firmId: string;
  name: string;
  accountSize: number;
  fee: number;
  feeType: 'one-time' | 'monthly' | 'activation';
  profitTarget: number;
  maxDrawdown: number;
  dailyLossLimit?: number;
  drawdownType: 'eod' | 'tdd' | 'static' | 'trailing';
  minTradingDays: number;
  consistencyRule: boolean;
  activationFee?: number;
  payoutSplit: number;
  payoutMinimum: number;
  payoutCap?: number;
  activeRequirement?: string;
}

export interface Guide {
  id: string;
  title: string;
  slug: string;
  category: 'beginner' | 'roadmap' | 'software' | 'payment' | 'payout';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  summary: string;
  body: string;
  relatedFirms: string[];
  sourceUrls: string[];
  lastUpdatedAt: string;
}

export interface FilterState {
  cnUserStatus: string[];
  feeType: string[];
  platforms: string[];
  drawdownType: string[];
}

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export interface ComparisonColumn {
  key: string;
  label: string;
  width?: string;
}
