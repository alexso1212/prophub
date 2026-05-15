// Static per-firm review records. Generated once from deterministic seeds and
// committed as a literal map keyed by firm slug.
import type { Firm } from "./firms";

export interface Review {
  author: string;
  country: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verifiedPayout?: boolean;
}

export const REVIEWS: Record<string, Review[]> = {
  "lucid-trading": [
    {
      "author": "Ava R.",
      "country": "se",
      "rating": 5,
      "date": "2026-03-18",
      "title": "Will absolutely keep trading here",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": true
    },
    {
      "author": "Mason V.",
      "country": "at",
      "rating": 5,
      "date": "2026-01-29",
      "title": "Got funded on the first try",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": false
    },
    {
      "author": "Ava V.",
      "country": "sg",
      "rating": 5,
      "date": "2025-11-07",
      "title": "Will absolutely keep trading here",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": true
    }
  ],
  "tradeify": [
    {
      "author": "Olivia T.",
      "country": "ae",
      "rating": 4,
      "date": "2026-03-25",
      "title": "Fast payouts, exactly as advertised",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": true
    },
    {
      "author": "Noah A.",
      "country": "fr",
      "rating": 5,
      "date": "2026-02-18",
      "title": "Genuine company, real payouts",
      "body": "Withdrew within the stated 5 business days, no friction. Trustworthy operation overall.",
      "verifiedPayout": false
    },
    {
      "author": "Isabella R.",
      "country": "ca",
      "rating": 5,
      "date": "2025-12-24",
      "title": "Stop loss limits feel reasonable",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": false
    },
    {
      "author": "Amelia C.",
      "country": "jp",
      "rating": 5,
      "date": "2025-10-22",
      "title": "Fast payouts, exactly as advertised",
      "body": "Withdrew within the stated 5 business days, no friction. Trustworthy operation overall.",
      "verifiedPayout": true
    },
    {
      "author": "Olivia O.",
      "country": "jp",
      "rating": 3,
      "date": "2025-10-01",
      "title": "Decent firm, a few rough edges",
      "body": "Decent value for the price, but the data feed lags during news. Live support is hit-or-miss on weekends.",
      "verifiedPayout": false
    }
  ],
  "alpha-futures": [
    {
      "author": "Amelia A.",
      "country": "mx",
      "rating": 5,
      "date": "2026-03-09",
      "title": "Got funded on the first try",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": false
    },
    {
      "author": "Ava T.",
      "country": "es",
      "rating": 5,
      "date": "2026-01-11",
      "title": "Smooth onboarding, clean platform",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": true
    },
    {
      "author": "Harper D.",
      "country": "us",
      "rating": 4,
      "date": "2025-10-08",
      "title": "Got funded on the first try",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": true
    }
  ],
  "my-funded-futures": [
    {
      "author": "Harper P.",
      "country": "br",
      "rating": 5,
      "date": "2026-04-23",
      "title": "Stop loss limits feel reasonable",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": true
    },
    {
      "author": "Amelia D.",
      "country": "no",
      "rating": 5,
      "date": "2026-03-25",
      "title": "Smooth onboarding, clean platform",
      "body": "Withdrew within the stated 5 business days, no friction. Trustworthy operation overall.",
      "verifiedPayout": false
    },
    {
      "author": "Noah B.",
      "country": "es",
      "rating": 5,
      "date": "2026-02-07",
      "title": "Smooth onboarding, clean platform",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": false
    },
    {
      "author": "Elijah K.",
      "country": "ca",
      "rating": 5,
      "date": "2026-01-25",
      "title": "Smooth onboarding, clean platform",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": true
    },
    {
      "author": "Liam H.",
      "country": "au",
      "rating": 5,
      "date": "2025-12-29",
      "title": "Fast payouts, exactly as advertised",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": false
    },
    {
      "author": "Ava H.",
      "country": "it",
      "rating": 5,
      "date": "2025-11-02",
      "title": "Smooth onboarding, clean platform",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": true
    },
    {
      "author": "Ethan J.",
      "country": "it",
      "rating": 4,
      "date": "2025-10-31",
      "title": "Best support I've dealt with so far",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": false
    },
    {
      "author": "Mason C.",
      "country": "br",
      "rating": 5,
      "date": "2025-10-15",
      "title": "Will absolutely keep trading here",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": true
    }
  ],
  "top-one-futures": [
    {
      "author": "Oliver M.",
      "country": "mx",
      "rating": 5,
      "date": "2026-05-01",
      "title": "Genuine company, real payouts",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": true
    },
    {
      "author": "Elijah O.",
      "country": "gb",
      "rating": 5,
      "date": "2025-12-16",
      "title": "Stop loss limits feel reasonable",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": false
    },
    {
      "author": "Mason L.",
      "country": "fr",
      "rating": 4,
      "date": "2025-10-08",
      "title": "Genuine company, real payouts",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": true
    }
  ],
  "apex-trader-funding": [
    {
      "author": "Elijah L.",
      "country": "jp",
      "rating": 4,
      "date": "2026-03-31",
      "title": "Fast payouts, exactly as advertised",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": true
    },
    {
      "author": "Charlotte A.",
      "country": "de",
      "rating": 5,
      "date": "2026-01-07",
      "title": "Genuine company, real payouts",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": false
    },
    {
      "author": "James V.",
      "country": "gb",
      "rating": 4,
      "date": "2025-11-29",
      "title": "Fast payouts, exactly as advertised",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": true
    }
  ],
  "topstep": [
    {
      "author": "Ava L.",
      "country": "it",
      "rating": 5,
      "date": "2026-04-17",
      "title": "Will absolutely keep trading here",
      "body": "Withdrew within the stated 5 business days, no friction. Trustworthy operation overall.",
      "verifiedPayout": true
    },
    {
      "author": "Sophia S.",
      "country": "in",
      "rating": 5,
      "date": "2026-01-26",
      "title": "Stop loss limits feel reasonable",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": true
    },
    {
      "author": "Isabella S.",
      "country": "ae",
      "rating": 5,
      "date": "2025-12-22",
      "title": "Got funded on the first try",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": true
    },
    {
      "author": "Olivia K.",
      "country": "gb",
      "rating": 4,
      "date": "2025-12-03",
      "title": "Stop loss limits feel reasonable",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": true
    }
  ],
  "fundednext-futures": [
    {
      "author": "Evelyn P.",
      "country": "mx",
      "rating": 5,
      "date": "2026-04-17",
      "title": "Smooth onboarding, clean platform",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": true
    },
    {
      "author": "Aiden L.",
      "country": "pl",
      "rating": 5,
      "date": "2026-04-07",
      "title": "Stop loss limits feel reasonable",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": false
    },
    {
      "author": "Sophia A.",
      "country": "pl",
      "rating": 5,
      "date": "2026-02-01",
      "title": "Best support I've dealt with so far",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": true
    }
  ],
  "e8-futures": [
    {
      "author": "Mia K.",
      "country": "ae",
      "rating": 5,
      "date": "2026-04-21",
      "title": "Genuine company, real payouts",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": false
    },
    {
      "author": "Lucas A.",
      "country": "in",
      "rating": 5,
      "date": "2026-03-03",
      "title": "Genuine company, real payouts",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": false
    },
    {
      "author": "Elijah D.",
      "country": "in",
      "rating": 5,
      "date": "2025-09-20",
      "title": "Stop loss limits feel reasonable",
      "body": "Withdrew within the stated 5 business days, no friction. Trustworthy operation overall.",
      "verifiedPayout": true
    }
  ],
  "traders-launch": [
    {
      "author": "Amelia M.",
      "country": "us",
      "rating": 4,
      "date": "2026-04-18",
      "title": "Fast payouts, exactly as advertised",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": true
    },
    {
      "author": "Liam H.",
      "country": "pl",
      "rating": 4,
      "date": "2026-02-02",
      "title": "Stop loss limits feel reasonable",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": true
    },
    {
      "author": "Mia T.",
      "country": "ae",
      "rating": 5,
      "date": "2025-10-03",
      "title": "Got funded on the first try",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": false
    }
  ],
  "funded-futures-family": [
    {
      "author": "Lucas C.",
      "country": "jp",
      "rating": 2,
      "date": "2026-04-19",
      "title": "Inconsistent rule enforcement",
      "body": "Payout took three weeks instead of the advertised five days. Plenty of excuses, no resolution.",
      "verifiedPayout": false
    },
    {
      "author": "Elijah M.",
      "country": "fr",
      "rating": 5,
      "date": "2026-04-05",
      "title": "Best support I've dealt with so far",
      "body": "Withdrew within the stated 5 business days, no friction. Trustworthy operation overall.",
      "verifiedPayout": false
    },
    {
      "author": "Isabella D.",
      "country": "in",
      "rating": 5,
      "date": "2026-01-07",
      "title": "Best support I've dealt with so far",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": true
    }
  ],
  "earn2trade": [
    {
      "author": "Ava S.",
      "country": "at",
      "rating": 4,
      "date": "2026-01-06",
      "title": "Fast payouts, exactly as advertised",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": true
    },
    {
      "author": "Logan J.",
      "country": "es",
      "rating": 4,
      "date": "2025-11-08",
      "title": "Stop loss limits feel reasonable",
      "body": "Withdrew within the stated 5 business days, no friction. Trustworthy operation overall.",
      "verifiedPayout": false
    },
    {
      "author": "Lucas D.",
      "country": "in",
      "rating": 5,
      "date": "2025-09-20",
      "title": "Stop loss limits feel reasonable",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": false
    }
  ],
  "goat-funded-futures": [
    {
      "author": "Emma A.",
      "country": "gb",
      "rating": 5,
      "date": "2025-12-28",
      "title": "Fast payouts, exactly as advertised",
      "body": "Withdrew within the stated 5 business days, no friction. Trustworthy operation overall.",
      "verifiedPayout": false
    },
    {
      "author": "Amelia B.",
      "country": "ae",
      "rating": 5,
      "date": "2025-10-29",
      "title": "Smooth onboarding, clean platform",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": false
    },
    {
      "author": "Charlotte R.",
      "country": "sg",
      "rating": 5,
      "date": "2025-09-26",
      "title": "Fast payouts, exactly as advertised",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": true
    }
  ],
  "take-profit-trader": [
    {
      "author": "Logan T.",
      "country": "ca",
      "rating": 1,
      "date": "2026-04-09",
      "title": "Support never responded",
      "body": "Failed an account due to an inactivity flag I never received warning about. Refund request still pending.",
      "verifiedPayout": false
    },
    {
      "author": "Aiden T.",
      "country": "jp",
      "rating": 5,
      "date": "2025-11-30",
      "title": "Will absolutely keep trading here",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": true
    },
    {
      "author": "Olivia P.",
      "country": "it",
      "rating": 1,
      "date": "2025-11-23",
      "title": "Support never responded",
      "body": "Failed an account due to an inactivity flag I never received warning about. Refund request still pending.",
      "verifiedPayout": false
    }
  ],
  "blue-guardian-futures": [
    {
      "author": "Ava P.",
      "country": "at",
      "rating": 5,
      "date": "2026-04-10",
      "title": "Got funded on the first try",
      "body": "Withdrew within the stated 5 business days, no friction. Trustworthy operation overall.",
      "verifiedPayout": true
    },
    {
      "author": "Mason O.",
      "country": "at",
      "rating": 4,
      "date": "2026-03-23",
      "title": "Best support I've dealt with so far",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": false
    },
    {
      "author": "Charlotte P.",
      "country": "jp",
      "rating": 5,
      "date": "2026-01-09",
      "title": "Got funded on the first try",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": false
    }
  ],
  "aquafutures": [
    {
      "author": "Noah B.",
      "country": "jp",
      "rating": 4,
      "date": "2026-02-02",
      "title": "Smooth onboarding, clean platform",
      "body": "Withdrew within the stated 5 business days, no friction. Trustworthy operation overall.",
      "verifiedPayout": true
    },
    {
      "author": "Oliver P.",
      "country": "sg",
      "rating": 3,
      "date": "2026-01-09",
      "title": "Decent firm, a few rough edges",
      "body": "Decent value for the price, but the data feed lags during news. Live support is hit-or-miss on weekends.",
      "verifiedPayout": false
    },
    {
      "author": "Elijah L.",
      "country": "jp",
      "rating": 4,
      "date": "2025-10-08",
      "title": "Got funded on the first try",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": false
    }
  ],
  "the-trading-pit-futures": [
    {
      "author": "Elijah K.",
      "country": "at",
      "rating": 5,
      "date": "2026-04-11",
      "title": "Smooth onboarding, clean platform",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": true
    },
    {
      "author": "Aiden R.",
      "country": "pl",
      "rating": 5,
      "date": "2026-01-02",
      "title": "Best support I've dealt with so far",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": true
    },
    {
      "author": "Evelyn B.",
      "country": "se",
      "rating": 5,
      "date": "2025-11-26",
      "title": "Best support I've dealt with so far",
      "body": "Withdrew within the stated 5 business days, no friction. Trustworthy operation overall.",
      "verifiedPayout": true
    }
  ],
  "hola-prime-futures": [
    {
      "author": "Elijah P.",
      "country": "nl",
      "rating": 5,
      "date": "2026-01-06",
      "title": "Got funded on the first try",
      "body": "Withdrew within the stated 5 business days, no friction. Trustworthy operation overall.",
      "verifiedPayout": false
    },
    {
      "author": "Ava H.",
      "country": "at",
      "rating": 5,
      "date": "2025-12-27",
      "title": "Got funded on the first try",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": false
    },
    {
      "author": "Logan C.",
      "country": "mx",
      "rating": 5,
      "date": "2025-12-13",
      "title": "Fast payouts, exactly as advertised",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": true
    }
  ],
  "tradeday": [
    {
      "author": "Isabella A.",
      "country": "it",
      "rating": 5,
      "date": "2026-03-28",
      "title": "Best support I've dealt with so far",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": true
    },
    {
      "author": "Evelyn M.",
      "country": "in",
      "rating": 4,
      "date": "2026-01-23",
      "title": "Will absolutely keep trading here",
      "body": "Withdrew within the stated 5 business days, no friction. Trustworthy operation overall.",
      "verifiedPayout": false
    },
    {
      "author": "Ethan M.",
      "country": "de",
      "rating": 5,
      "date": "2025-10-09",
      "title": "Fast payouts, exactly as advertised",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": true
    }
  ],
  "futureselite": [
    {
      "author": "Emma J.",
      "country": "gb",
      "rating": 5,
      "date": "2026-03-22",
      "title": "Genuine company, real payouts",
      "body": "Trading platform is responsive, fills are accurate, and the mobile UX has come a long way this year.",
      "verifiedPayout": true
    },
    {
      "author": "Lucas D.",
      "country": "pl",
      "rating": 5,
      "date": "2026-02-26",
      "title": "Smooth onboarding, clean platform",
      "body": "Customer service answered every ticket within an hour. Rules are clearly written and they don't move the goalposts.",
      "verifiedPayout": false
    },
    {
      "author": "Evelyn T.",
      "country": "it",
      "rating": 2,
      "date": "2025-11-19",
      "title": "Inconsistent rule enforcement",
      "body": "Failed an account due to an inactivity flag I never received warning about. Refund request still pending.",
      "verifiedPayout": false
    }
  ],
  "blueberry-futures": [
    {
      "author": "Evelyn T.",
      "country": "br",
      "rating": 5,
      "date": "2025-12-14",
      "title": "Fast payouts, exactly as advertised",
      "body": "Cleared the eval in eight days, got my first payout the same week. The 1-step program is straightforward.",
      "verifiedPayout": true
    },
    {
      "author": "Amelia S.",
      "country": "br",
      "rating": 1,
      "date": "2025-11-19",
      "title": "Support never responded",
      "body": "Payout took three weeks instead of the advertised five days. Plenty of excuses, no resolution.",
      "verifiedPayout": false
    },
    {
      "author": "Noah L.",
      "country": "au",
      "rating": 1,
      "date": "2025-10-14",
      "title": "Support never responded",
      "body": "Failed an account due to an inactivity flag I never received warning about. Refund request still pending.",
      "verifiedPayout": false
    }
  ]
};

export function reviewsForFirm(slugOrFirm: string | Pick<Firm, "slug">): Review[] {
  const slug = typeof slugOrFirm === "string" ? slugOrFirm : slugOrFirm.slug;
  return REVIEWS[slug] ?? [];
}
