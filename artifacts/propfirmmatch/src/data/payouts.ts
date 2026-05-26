// Per-firm payout aggregates SCRAPED from
// https://propfirmmatch.com/futures/payouts
// Source: clone-data/page-payouts.md, top 15 table rows at lines ~304-318
// (ATFunded row at line 319 is intentionally excluded; same set the source
// surfaces in its primary ranking). Source columns mapped 1:1.
export interface FirmPayoutAggregate {
  name: string;
  slug: string;       // source slug; may differ from local firms.ts slug
  url?: string;       // canonical source URL
  total: number;      // total tracked payouts USD
  count: number;      // number of payouts
  largest: number;    // largest single payout USD
  avg: number;        // average payout size USD
  median: string;     // median time to payout (human-readable)
}

export const PAYOUTS: FirmPayoutAggregate[] = [
  {
    "name": "FundingPips",
    "url": "https://propfirmmatch.com/prop-firms/funding-pips",
    "slug": "funding-pips",
    "total": 14039306,
    "count": 13173,
    "largest": 53895,
    "avg": 1066,
    "median": "about 4 hours"
  },
  {
    "name": "FundedNext",
    "url": "https://propfirmmatch.com/prop-firms/fundednext",
    "slug": "fundednext",
    "total": 5796444,
    "count": 9274,
    "largest": 20042,
    "avg": 625,
    "median": "6 minutes"
  },
  {
    "name": "FundedNext Futures",
    "url": "https://propfirmmatch.com/futures/prop-firms/fundednext-futures",
    "slug": "fundednext-futures",
    "total": 5353472,
    "count": 3656,
    "largest": 16400,
    "avg": 1464,
    "median": "about 3 hours"
  },
  {
    "name": "Goat Funded Trader",
    "url": "https://propfirmmatch.com/prop-firms/goat-funded-trader",
    "slug": "goat-funded-trader",
    "total": 1429777,
    "count": 3151,
    "largest": 10000,
    "avg": 454,
    "median": "2 days"
  },
  {
    "name": "Funded Futures Family",
    "url": "https://propfirmmatch.com/futures/prop-firms/funded-futures-family",
    "slug": "funded-futures-family",
    "total": 1049956,
    "count": 636,
    "largest": 3600,
    "avg": 1651,
    "median": "1 day"
  },
  {
    "name": "Top One Futures",
    "url": "https://propfirmmatch.com/futures/prop-firms/top-one-futures",
    "slug": "top-one-futures",
    "total": 864555,
    "count": 689,
    "largest": 5600,
    "avg": 1255,
    "median": "about 8 hours"
  },
  {
    "name": "E8 Markets",
    "url": "https://propfirmmatch.com/prop-firms/e8-markets",
    "slug": "e8-markets",
    "total": 852593,
    "count": 294,
    "largest": 70848,
    "avg": 2900,
    "median": "about 10 hours"
  },
  {
    "name": "BrightFunded",
    "url": "https://propfirmmatch.com/prop-firms/brightfunded",
    "slug": "brightfunded",
    "total": 639378,
    "count": 386,
    "largest": 19272,
    "avg": 1656,
    "median": "about 16 hours"
  },
  {
    "name": "E8 Futures",
    "url": "https://propfirmmatch.com/futures/prop-firms/e8-futures",
    "slug": "e8-futures",
    "total": 506831,
    "count": 387,
    "largest": 4040,
    "avg": 1310,
    "median": "about 19 hours"
  },
  {
    "name": "Crypto Fund Trader",
    "url": "https://propfirmmatch.com/prop-firms/crypto-fund-trader",
    "slug": "crypto-fund-trader",
    "total": 406301,
    "count": 325,
    "largest": 17100,
    "avg": 1250,
    "median": "about 16 hours"
  },
  {
    "name": "Blueberry Funded",
    "url": "https://propfirmmatch.com/prop-firms/blueberry-funded",
    "slug": "blueberry-funded",
    "total": 397816,
    "count": 796,
    "largest": 13771,
    "avg": 500,
    "median": "about 20 hours"
  },
  {
    "name": "Finotive Funding",
    "url": "https://propfirmmatch.com/prop-firms/finotive-funding",
    "slug": "finotive-funding",
    "total": 324091,
    "count": 999,
    "largest": 4972,
    "avg": 324,
    "median": "less than a minute"
  },
  {
    "name": "Hantec Trader",
    "url": "https://propfirmmatch.com/prop-firms/hantec-trader",
    "slug": "hantec-trader",
    "total": 221663,
    "count": 164,
    "largest": 11110,
    "avg": 1352,
    "median": "about 14 hours"
  },
  {
    "name": "Top One Trader",
    "url": "https://propfirmmatch.com/prop-firms/top-one-trader",
    "slug": "top-one-trader",
    "total": 197664,
    "count": 151,
    "largest": 7200,
    "avg": 1309,
    "median": "about 5 hours"
  },
  {
    "name": "FundedElite",
    "url": "https://propfirmmatch.com/prop-firms/fundedelite",
    "slug": "fundedelite",
    "total": 142976,
    "count": 320,
    "largest": 5485,
    "avg": 447,
    "median": "about 23 hours"
  }
];

export const totalTrackedPayouts = PAYOUTS.reduce((a,b)=>a+b.total,0);
export const totalPayoutCount    = PAYOUTS.reduce((a,b)=>a+b.count,0);

export function payoutsForFirm(firmName: string): FirmPayoutAggregate | undefined {
  return PAYOUTS.find(p => p.name === firmName || p.slug === firmName);
}
