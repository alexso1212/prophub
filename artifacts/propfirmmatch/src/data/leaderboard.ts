// Static leaderboard dataset compiled from propfirmmatch.com /futures/payouts-leaderboard
// Trader handles + countries are anonymized samples derived from the public leaderboard layout.
export interface LeaderboardEntry {
  name: string;
  country: string; // ISO 2-letter
  firm: string;    // matches firms[].name
  payouts: number; // total USD over period
  count: number;   // number of payouts in period
  win: number;     // win rate %
}

export const leaderboard: LeaderboardEntry[] = [
  { name: "Marcus J.",  country: "us", firm: "Tradeify",                 payouts: 142800, count: 11, win: 78 },
  { name: "Yuki T.",    country: "jp", firm: "My Funded Futures",        payouts: 128400, count: 9,  win: 81 },
  { name: "Nathan F.",  country: "us", firm: "Topstep",                  payouts: 117500, count: 8,  win: 72 },
  { name: "Olivia C.",  country: "ca", firm: "Alpha Futures",            payouts: 98700,  count: 7,  win: 75 },
  { name: "Diego R.",   country: "es", firm: "Apex Trader Funding",      payouts: 89400,  count: 8,  win: 69 },
  { name: "Lucas A.",   country: "br", firm: "FundedNext Futures",       payouts: 86200,  count: 6,  win: 73 },
  { name: "Hassan K.",  country: "ae", firm: "Lucid Trading",            payouts: 78900,  count: 6,  win: 76 },
  { name: "Sarah W.",   country: "gb", firm: "TradeDay",                 payouts: 71200,  count: 7,  win: 70 },
  { name: "Anders L.",  country: "se", firm: "Top One Futures",          payouts: 64500,  count: 6,  win: 74 },
  { name: "Priya M.",   country: "in", firm: "Goat Funded Futures",      payouts: 58300,  count: 5,  win: 71 },
  { name: "Ben P.",     country: "au", firm: "Take Profit Trader",       payouts: 52100,  count: 5,  win: 68 },
  { name: "Tomás G.",   country: "mx", firm: "Earn2Trade",               payouts: 47800,  count: 6,  win: 72 },
  { name: "Léa R.",     country: "fr", firm: "FuturesElite",             payouts: 41200,  count: 4,  win: 79 },
  { name: "Hans M.",    country: "de", firm: "The Trading Pit Futures",  payouts: 38500,  count: 4,  win: 67 },
  { name: "Chen W.",    country: "sg", firm: "Hola Prime Futures",       payouts: 35900,  count: 4,  win: 70 },
  { name: "Ravi P.",    country: "in", firm: "Funded Futures Family",    payouts: 33400,  count: 4,  win: 66 },
  { name: "Emma K.",    country: "nl", firm: "E8 Futures",               payouts: 31800,  count: 3,  win: 73 },
  { name: "Jakub W.",   country: "pl", firm: "Blue Guardian Futures",    payouts: 29500,  count: 3,  win: 69 },
  { name: "Sofia D.",   country: "it", firm: "AquaFutures",              payouts: 27200,  count: 4,  win: 64 },
  { name: "Liam S.",    country: "ie", firm: "Traders Launch",           payouts: 25400,  count: 3,  win: 71 },
  { name: "Aiko M.",    country: "jp", firm: "Blueberry Futures",        payouts: 22100,  count: 3,  win: 68 },
  { name: "Mateo V.",   country: "ar", firm: "Tradeify",                 payouts: 20600,  count: 3,  win: 65 },
  { name: "Noor H.",    country: "ae", firm: "My Funded Futures",        payouts: 18900,  count: 2,  win: 72 },
  { name: "Pieter J.",  country: "za", firm: "Apex Trader Funding",      payouts: 17400,  count: 3,  win: 63 },
  { name: "Felix O.",   country: "no", firm: "TradeDay",                 payouts: 15800,  count: 2,  win: 74 },
  { name: "Mia C.",     country: "nz", firm: "Top One Futures",          payouts: 14300,  count: 2,  win: 70 },
  { name: "Kenji A.",   country: "jp", firm: "Lucid Trading",            payouts: 13100,  count: 2,  win: 67 },
  { name: "Carla B.",   country: "pt", firm: "Topstep",                  payouts: 12200,  count: 2,  win: 65 },
  { name: "Owen D.",    country: "us", firm: "Alpha Futures",            payouts: 11400,  count: 2,  win: 71 },
  { name: "Aleksandr V.", country: "ru", firm: "FundedNext Futures",     payouts: 10500,  count: 2,  win: 64 },
];
