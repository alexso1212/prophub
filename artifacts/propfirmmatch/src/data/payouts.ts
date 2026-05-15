// Static payouts dataset modeled after propfirmmatch.com /futures/payouts.
// Each row represents one verified payout submitted by a funded trader.
export interface PayoutEntry {
  trader: string;
  country: string;     // ISO-2
  firm: string;        // matches firms[].name
  account: string;     // e.g. "$150K Growth"
  amount: number;      // USD
  days: number;        // days from funding to payout
  date: string;        // ISO yyyy-mm-dd
  method?: string;     // payout method
}

export const payouts: PayoutEntry[] = [
  { trader: "Marcus J.",  country: "us", firm: "Tradeify",                 account: "$150K Growth",   amount: 24580, days: 18, date: "2026-05-12", method: "Plane" },
  { trader: "Diego R.",   country: "es", firm: "Apex Trader Funding",      account: "$100K Eval",     amount: 18900, days: 22, date: "2026-05-11", method: "WISE" },
  { trader: "Sarah W.",   country: "gb", firm: "TradeDay",                 account: "$50K",           amount: 12450, days: 14, date: "2026-05-10", method: "Bank" },
  { trader: "Yuki T.",    country: "jp", firm: "My Funded Futures",        account: "$150K Express",  amount: 31200, days: 28, date: "2026-05-10", method: "Crypto" },
  { trader: "Anders L.",  country: "se", firm: "Top One Futures",          account: "$50K",           amount:  9870, days: 11, date: "2026-05-09", method: "Riseworks" },
  { trader: "Olivia C.",  country: "ca", firm: "Alpha Futures",            account: "$100K",          amount: 22100, days: 19, date: "2026-05-09", method: "Plane" },
  { trader: "Hassan K.",  country: "ae", firm: "Lucid Trading",            account: "$100K",          amount: 15600, days: 16, date: "2026-05-08", method: "Crypto" },
  { trader: "Ben P.",     country: "au", firm: "Take Profit Trader",       account: "$50K",           amount:  8400, days:  9, date: "2026-05-08", method: "Bank" },
  { trader: "Lucas A.",   country: "br", firm: "FundedNext Futures",       account: "$100K Stellar",  amount: 19850, days: 25, date: "2026-05-07", method: "Crypto" },
  { trader: "Nathan F.",  country: "us", firm: "Topstep",                  account: "$150K Combine",  amount: 27300, days: 31, date: "2026-05-07", method: "Plane" },
  { trader: "Priya M.",   country: "in", firm: "Goat Funded Futures",      account: "$50K",           amount: 11200, days: 12, date: "2026-05-06", method: "Crypto" },
  { trader: "Tomás G.",   country: "mx", firm: "Earn2Trade",               account: "$25K Gauntlet",  amount:  6750, days:  8, date: "2026-05-06", method: "WISE" },
  { trader: "Léa R.",     country: "fr", firm: "FuturesElite",             account: "$100K",          amount: 14300, days: 17, date: "2026-05-05", method: "Bank" },
  { trader: "Hans M.",    country: "de", firm: "The Trading Pit Futures",  account: "$50K",           amount:  9200, days: 13, date: "2026-05-05", method: "Bank" },
  { trader: "Chen W.",    country: "sg", firm: "Hola Prime Futures",       account: "$100K",          amount: 13400, days: 15, date: "2026-05-04", method: "Crypto" },
  { trader: "Ravi P.",    country: "in", firm: "Funded Futures Family",    account: "$50K",           amount:  8900, days: 11, date: "2026-05-04", method: "Crypto" },
  { trader: "Emma K.",    country: "nl", firm: "E8 Futures",               account: "$100K",          amount: 16200, days: 19, date: "2026-05-03", method: "WISE" },
  { trader: "Jakub W.",   country: "pl", firm: "Blue Guardian Futures",    account: "$50K",           amount:  7800, days: 10, date: "2026-05-03", method: "Crypto" },
  { trader: "Sofia D.",   country: "it", firm: "AquaFutures",              account: "$100K",          amount: 12100, days: 14, date: "2026-05-02", method: "Bank" },
  { trader: "Liam S.",    country: "ie", firm: "Traders Launch",           account: "$50K",           amount:  9400, days: 12, date: "2026-05-02", method: "Bank" },
  { trader: "Aiko M.",    country: "jp", firm: "Blueberry Futures",        account: "$50K",           amount:  6200, days:  9, date: "2026-05-01", method: "Crypto" },
  { trader: "Mateo V.",   country: "ar", firm: "Tradeify",                 account: "$50K Lightning", amount:  7100, days: 10, date: "2026-05-01", method: "Plane" },
  { trader: "Noor H.",    country: "ae", firm: "My Funded Futures",        account: "$100K Express",  amount: 11500, days: 14, date: "2026-04-30", method: "Crypto" },
  { trader: "Pieter J.",  country: "za", firm: "Apex Trader Funding",      account: "$50K",           amount:  6800, days: 11, date: "2026-04-30", method: "WISE" },
  { trader: "Felix O.",   country: "no", firm: "TradeDay",                 account: "$100K",          amount: 13700, days: 16, date: "2026-04-29", method: "Bank" },
  { trader: "Mia C.",     country: "nz", firm: "Top One Futures",          account: "$50K",           amount:  7900, days: 10, date: "2026-04-29", method: "Riseworks" },
  { trader: "Kenji A.",   country: "jp", firm: "Lucid Trading",            account: "$50K",           amount:  6400, days:  9, date: "2026-04-28", method: "Crypto" },
  { trader: "Carla B.",   country: "pt", firm: "Topstep",                  account: "$50K Combine",   amount:  8100, days: 12, date: "2026-04-28", method: "Plane" },
  { trader: "Owen D.",    country: "us", firm: "Alpha Futures",            account: "$50K",           amount:  7300, days: 10, date: "2026-04-27", method: "Plane" },
  { trader: "Aleksandr V.", country: "ru", firm: "FundedNext Futures",     account: "$50K Stellar",   amount:  6900, days: 11, date: "2026-04-27", method: "Crypto" },
  { trader: "Bilal A.",   country: "tr", firm: "Goat Funded Futures",      account: "$25K",           amount:  4200, days:  7, date: "2026-04-26", method: "Crypto" },
  { trader: "Henrik G.",  country: "dk", firm: "Tradeify",                 account: "$25K Select",    amount:  3800, days:  6, date: "2026-04-26", method: "Plane" },
  { trader: "Pauline T.", country: "be", firm: "FuturesElite",             account: "$50K",           amount:  5900, days:  9, date: "2026-04-25", method: "Bank" },
  { trader: "Diego F.",   country: "co", firm: "Earn2Trade",               account: "$25K",           amount:  3400, days:  8, date: "2026-04-25", method: "WISE" },
  { trader: "Vikram S.",  country: "in", firm: "Funded Futures Family",    account: "$25K",           amount:  3100, days:  7, date: "2026-04-24", method: "Crypto" },
  { trader: "Karim H.",   country: "ma", firm: "Hola Prime Futures",       account: "$50K",           amount:  5600, days:  9, date: "2026-04-24", method: "Crypto" },
  { trader: "Joshua K.",  country: "us", firm: "Take Profit Trader",       account: "$25K",           amount:  3700, days:  8, date: "2026-04-23", method: "Bank" },
  { trader: "Daria L.",   country: "ua", firm: "AquaFutures",              account: "$25K",           amount:  2900, days:  7, date: "2026-04-23", method: "Crypto" },
  { trader: "Theo P.",    country: "gr", firm: "Blue Guardian Futures",    account: "$25K",           amount:  2700, days:  6, date: "2026-04-22", method: "Bank" },
  { trader: "Iris N.",    country: "fi", firm: "TradeDay",                 account: "$25K",           amount:  2500, days:  6, date: "2026-04-22", method: "Bank" },
];

export const payoutsForFirm = (firmName: string): PayoutEntry[] =>
  payouts.filter(p => p.firm === firmName);
