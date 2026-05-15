// Static per-firm offer history. Generated once from a deterministic schedule and
// committed as a literal map keyed by firm slug. Active promo (if any) is appended
// dynamically from firms.ts so admin promo edits stay editable in one place.
import { firms, type Firm } from "./firms";

export interface Offer {
  code: string;
  percent: number;
  description: string;
  startDate: string;
  endDate?: string;
  status: "active" | "expired";
}

export const OFFER_HISTORY: Record<string, Offer[]> = {
  "lucid-trading": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "tradeify": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "alpha-futures": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "my-funded-futures": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "top-one-futures": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "apex-trader-funding": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "topstep": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "fundednext-futures": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "e8-futures": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "traders-launch": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "funded-futures-family": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "earn2trade": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "goat-funded-futures": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "take-profit-trader": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "blue-guardian-futures": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "aquafutures": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "the-trading-pit-futures": [
    {
      "code": "MATCH30",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH30",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH30",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "hola-prime-futures": [
    {
      "code": "MATCH50",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH50",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH50",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "tradeday": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "futureselite": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ],
  "blueberry-futures": [
    {
      "code": "MATCH",
      "percent": 25,
      "description": "Spring promo — 25% off all evaluations",
      "startDate": "2026-02-28",
      "endDate": "2026-03-14",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 40,
      "description": "Easter weekend flash discount",
      "startDate": "2026-01-16",
      "endDate": "2026-01-23",
      "status": "expired"
    },
    {
      "code": "MATCH",
      "percent": 30,
      "description": "Q1 onboarding promo",
      "startDate": "2025-10-24",
      "endDate": "2025-11-14",
      "status": "expired"
    }
  ]
};

export function offersForFirm(slugOrFirm: string | Pick<Firm, "slug">): Offer[] {
  const slug = typeof slugOrFirm === "string" ? slugOrFirm : slugOrFirm.slug;
  const f = firms.find(x => x.slug === slug);
  const out: Offer[] = [];
  if (f && f.promoPercent > 0 && f.promoCode) {
    out.push({
      code: f.promoCode,
      percent: f.promoPercent,
      description: f.offerDescription,
      startDate: "2026-05-01",
      status: "active",
    });
  }
  for (const past of OFFER_HISTORY[slug] ?? []) out.push(past);
  return out;
}
