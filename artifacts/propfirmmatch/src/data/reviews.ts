// Per-firm review aggregates SCRAPED from
// https://propfirmmatch.com/futures/prop-firm-reviews
// (clone-data/page-prop-firm-reviews.md, lines 316-326).
// Captures the per-category ratings shown on the source listing page.
export interface FirmReviewAggregate {
  name: string;
  slug: string;
  accountsTracked: number;
  reviewCount: number;
  rules: number;            // "Rules" rating /5
  customerCare: number;
  friendliness: number;
  payoutProcess: number;
  overall: number;
}

export const REVIEWS: FirmReviewAggregate[] = [
  {
    "name": "Tradeify",
    "slug": "tradeify",
    "accountsTracked": 26279,
    "reviewCount": 155,
    "rules": 4.7,
    "customerCare": 4.8,
    "friendliness": 4.8,
    "payoutProcess": 4.8,
    "overall": 4.7
  },
  {
    "name": "Top One Futures",
    "slug": "top-one-futures",
    "accountsTracked": 28852,
    "reviewCount": 72,
    "rules": 4.6,
    "customerCare": 4.7,
    "friendliness": 4.8,
    "payoutProcess": 4.7,
    "overall": 4.7
  },
  {
    "name": "Alpha Futures",
    "slug": "alpha-futures",
    "accountsTracked": 42485,
    "reviewCount": 47,
    "rules": 4.4,
    "customerCare": 4.7,
    "friendliness": 4.6,
    "payoutProcess": 4.7,
    "overall": 4.6
  },
  {
    "name": "Lucid Trading",
    "slug": "lucid-trading",
    "accountsTracked": 9383,
    "reviewCount": 39,
    "rules": 4.4,
    "customerCare": 4.6,
    "friendliness": 4.8,
    "payoutProcess": 4.7,
    "overall": 4.6
  },
  {
    "name": "My Funded Futures",
    "slug": "my-funded-futures",
    "accountsTracked": 48428,
    "reviewCount": 226,
    "rules": 4.6,
    "customerCare": 4.6,
    "friendliness": 4.6,
    "payoutProcess": 4.6,
    "overall": 4.5
  },
  {
    "name": "Topstep",
    "slug": "topstep",
    "accountsTracked": 12832,
    "reviewCount": 115,
    "rules": 4.7,
    "customerCare": 4.6,
    "friendliness": 4.7,
    "payoutProcess": 4.5,
    "overall": 4.5
  },
  {
    "name": "Blue Guardian Futures",
    "slug": "blue-guardian-futures",
    "accountsTracked": 4890,
    "reviewCount": 84,
    "rules": 4.4,
    "customerCare": 4.3,
    "friendliness": 4.4,
    "payoutProcess": 4.3,
    "overall": 4.4
  },
  {
    "name": "FundedNext Futures",
    "slug": "fundednext-futures",
    "accountsTracked": 26552,
    "reviewCount": 57,
    "rules": 4.5,
    "customerCare": 4,
    "friendliness": 4.4,
    "payoutProcess": 4.5,
    "overall": 4.3
  },
  {
    "name": "Apex Trader Funding",
    "slug": "apex-trader-funding",
    "accountsTracked": 36598,
    "reviewCount": 103,
    "rules": 3.7,
    "customerCare": 4,
    "friendliness": 3.8,
    "payoutProcess": 4,
    "overall": 3.8
  },
  {
    "name": "AquaFutures",
    "slug": "aquafutures",
    "accountsTracked": 4890,
    "reviewCount": 79,
    "rules": 3.9,
    "customerCare": 4,
    "friendliness": 4.2,
    "payoutProcess": 3.8,
    "overall": 3.8
  }
];

export function reviewsForFirm(slugOrName: string): FirmReviewAggregate | undefined {
  return REVIEWS.find(r => r.slug === slugOrName || r.name === slugOrName);
}
