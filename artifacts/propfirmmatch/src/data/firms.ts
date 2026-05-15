export interface Platform {
  name: string;
  icon?: string;
}

export interface ChallengeProgram {
  name: string;
  price: string;
  original?: string;
  accountSize?: string;   // e.g. "$25K"
  programType?: string;   // e.g. "1-Step", "2-Step", "Instant"
  drawdown?: string;      // e.g. "$1,500" trailing
  profitTarget?: string;  // e.g. "$1,500"
  resetPrice?: string;    // e.g. "$80"
  promoCode?: string;
}

const SIZE_TARGETS: Record<string, { target: string; dd: string; reset: string }> = {
  "25K":  { target: "$1,500",  dd: "$1,500",  reset: "$80"  },
  "50K":  { target: "$3,000",  dd: "$2,500",  reset: "$98"  },
  "100K": { target: "$6,000",  dd: "$3,000",  reset: "$120" },
  "150K": { target: "$9,000",  dd: "$5,000",  reset: "$148" },
};

function parsePrice(s?: string): number | null {
  if (!s) return null;
  const n = parseFloat(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function formatUsd(n: number): string {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

export function getFirmStartingPrice(f: Firm): number | null {
  if (!f.challenges?.length) return null;
  const candidates = f.challenges
    .map(c => parsePrice(c.original) ?? parsePrice(c.price))
    .filter((n): n is number => n != null);
  if (!candidates.length) return null;
  return Math.min(...candidates);
}

export function getDiscountedPrices(
  f: Firm,
  effectivePercent: number
): { original: number; discounted: number } | null {
  const original = getFirmStartingPrice(f);
  if (original == null) return null;
  const pct = Math.max(0, Math.min(100, effectivePercent));
  const discounted = original * (1 - pct / 100);
  return { original, discounted };
}

export function enrichChallenge(c: ChallengeProgram, promoCode?: string): ChallengeProgram {
  if (c.accountSize && c.programType) return c;
  const name = c.name.toLowerCase();
  const sizeMatch = name.match(/(\d{2,3})k\b/);
  const accountSize = sizeMatch ? `$${sizeMatch[1]}K` : undefined;
  let programType: string | undefined;
  if (/instant/.test(name)) programType = "Instant";
  else if (/2[-\s]?step/.test(name)) programType = "2-Step";
  else if (/1[-\s]?step/.test(name)) programType = "1-Step";
  else if (/express/.test(name)) programType = "Express";
  else if (/combine/.test(name)) programType = "Combine";
  else if (/eval/.test(name)) programType = "Evaluation";
  const sizeKey = sizeMatch?.[1] ? `${sizeMatch[1]}K` : null;
  const defaults = sizeKey ? SIZE_TARGETS[sizeKey] : undefined;
  return {
    ...c,
    accountSize,
    programType,
    profitTarget: c.profitTarget ?? defaults?.target,
    drawdown: c.drawdown ?? defaults?.dd,
    resetPrice: c.resetPrice ?? defaults?.reset,
    promoCode: c.promoCode ?? promoCode,
  };
}

export interface Firm {
  slug: string;
  name: string;
  logo: string;
  rating: number | null;
  reviews: number;
  totalReviews?: number;
  reviewsBreakdown?: { stars: number; count: number }[];
  ceo?: string;
  country: string;
  countryCode: string;
  trustPilot?: number;
  dateCreated?: string;
  yearsInOperation: number;
  trackingId: string;
  isNew?: boolean;
  promoPercent: number;
  promoCode: string;
  promoLabel?: string;
  maxAllocation: string;
  numAssets: number | string;
  platforms: Platform[];
  morePlatforms?: number;
  brokers?: Platform[];
  paymentMethods?: Platform[];
  payoutMethods?: Platform[];
  rank?: number;
  popularRank?: number;
  aiSummary: string;
  rules?: string[];
  consistencyRules?: { program: string; rule: string }[];
  leverage?: string[];
  challenges?: ChallengeProgram[];
  offerDescription: string;
  // 外汇板块专属（演示数据，期货公司可不填）
  spreadType?: string;             // "ECN" / "Raw" / "Standard"
  currencyPairs?: number | string; // 主流货币对数量
  maxLeverage?: string;            // "1:100"
  swapPolicy?: string;             // "Swap Free" / "标准 Swap"
}

const PLATFORM_ICONS = {
  bookmap: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/tnpxqyptpwg9554upc69wkg8/platforms-bookmap.svg",
  sierraChart: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/e4ly7nat7bipnm5v5c661ho5/platforms-sierra-chart.svg",
  jigsaw: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/q2w3xxriaryazenw08y9kl4r/platforms-jigsaw-daytradr.svg",
  tradingview: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/aec7367d0yct9gxyopy1hd19/platforms-tradingview.svg",
  quantower: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/iko7h5dca80oemuwdzgcblh2/platforms-quantower.svg",
  rithmic: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/zuzepjc8m54qnmluqo7ct23k/platforms-rithmic.svg",
  tradovate: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/ionbe3uwdxqdbbzg3netqb2g/platforms-tradovate.svg",
  ninjatrader: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/k8n9hxqo6wcaytwqtfbrh3km/platforms-ninjatrader.svg",
  multiCharts: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/uezw3sv6m1hjhlf8akoo7fua/platforms-multi-charts.svg",
  rTraderPro: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/pimneqk10ufajyy093xyh6xa/platforms-r-trader-pro.svg",
  atas: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/au98wfnwytev06d4tj904svp/platforms-atas-orderflow-trading.svg",
  volbook: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/detvt1gwb5xebdvx3dvpgo0z/platforms-volbook.svg",
  volsys: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/hghp2o8436y9dylegsx9i2jk/platforms-volsys.svg",
  volumetrica: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/giss1swmdxbqixlaqzzmafpb/platforms-volumetrica-trading.svg",
  topstepx: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/hk1uxs8yt1fhsvroivfsbsjd/platforms-topstepx.svg",
  dxFutures: "https://media.propfirmmatch.com/user_2s52JelP7NsVT2WTM72aXmiLnJm/mbknirtqwgzbhmoexzavydcu/ma19sfsgydchs1gn8rb1s5v5.svg",
  wealthCharts: "https://media.propfirmmatch.com/user_2sPHwT9RDq9Uf2Ty8l77alKaojE/kht7saef04urcwjfzvx21051/pe0zql7k67l31sigsassljh6.png",
};

const BROKER_ICONS = {
  dorman: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/ovok5vxzg7g003t1c6m5nyz5/brokers-dorman.svg",
  ninjaTraderBroker: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/emh65rrkx9dq9xgpxzuy4bms/brokers-ninja-trader.svg",
};

const PAYMENT_ICONS = {
  card: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/zllhjaoa5z79szxgog5hoxmg/payment-methods-credit-debit-card-logo.svg",
  crypto: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/lfihf2fwjehj4wkg6akvhngs/payout-methods-crypto-logo.svg",
};

export const firms: Firm[] = [
  {
    slug: "lucid-trading",
    name: "Lucid Trading",
    logo: "https://media.propfirmmatch.com/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/lf4sbnhi4l6s9qnggzz4giep/rz61ptvnhszvwauk68b23up7.jpg",
    rating: 4.6,
    reviews: 39,
    totalReviews: 39,
    reviewsBreakdown: [{stars:5,count:28},{stars:4,count:9},{stars:3,count:1},{stars:2,count:0},{stars:1,count:1}],
    ceo: "AJ Campanella",
    country: "US", countryCode: "us",
    trustPilot: 4.7, dateCreated: "Mar 2025",
    yearsInOperation: 1, trackingId: "9370",
    isNew: true, promoPercent: 40, promoCode: "MATCH",
    maxAllocation: "$750K", numAssets: 1,
    platforms: [{name:"Bookmap",icon:PLATFORM_ICONS.bookmap},{name:"Sierra Chart",icon:PLATFORM_ICONS.sierraChart},{name:"Jigsaw Daytradr",icon:PLATFORM_ICONS.jigsaw}],
    morePlatforms: 7,
    brokers: [{name:"Dorman",icon:BROKER_ICONS.dorman},{name:"NinjaTrader",icon:BROKER_ICONS.ninjaTraderBroker}],
    paymentMethods: [{name:"Credit/Debit Card",icon:PAYMENT_ICONS.card}],
    payoutMethods: [{name:"Crypto",icon:PAYMENT_ICONS.crypto},{name:"Plaid"}],
    popularRank: 1,
    aiSummary: "Lucid Trading, based in the United States, was established in March 2025. It offers futures trading and operates two program types: Instant and 1 Step. Supported platforms include Bookmap, Sierra Chart, MotiveWave, Jigsaw Daytradr, MultiCharts, Quantower, R Trader Pro, Tradovate, NinjaTrader, ATAS Orderflow Trading, and Tradesea Tradingview. Tradable instruments are futures. The firm has a review score of 4.6/5 based on 39 reviews. Overall, Lucid Trading provides a futures-focused prop trading program.",
    consistencyRules: [{program:"LucidPro",rule:"40% funded consistency rule"},{program:"LucidFlex",rule:"50% Evaluation consistency rule"},{program:"LucidDirect",rule:"20% funded consistency rule"}],
    leverage: ["$25k - 2 minis or 20 micros","$50k - 4 minis or 40 micros","$100k - 6 minis or 60 micros","$150k - 10 minis or 100 micros"],
    challenges: [
      {name:"LucidDirect - Instant - 150K",price:"$588.00",original:"$840.00"},
      {name:"LucidDirect - Instant - 100K",price:"$490.00",original:"$700.00"},
      {name:"LucidDirect - Instant - 50K",price:"$364.00",original:"$520.00"},
      {name:"LucidDirect - Instant - 25K",price:"$238.00",original:"$340.00"},
      {name:"LucidFlex 1-Step - 150K",price:"$252.00",original:"$420.00"},
      {name:"LucidFlex 1-Step - 100K",price:"$180.00",original:"$300.00"},
      {name:"LucidFlex 1-Step - 50K",price:"$120.00",original:"$200.00"},
    ],
    offerDescription: "40% off on Flex & Pro accounts (Limited to 5 uses)",
  },
  {
    slug: "tradeify",
    name: "Tradeify",
    logo: "https://media.propfirmmatch.com/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/att0xfw6nlptv7n6086i457h/c1d2u3n73rqcyarb0vykyc93.svg",
    rating: 4.7, reviews: 155, totalReviews: 155,
    country: "US", countryCode: "us",
    yearsInOperation: 1, trackingId: "26271",
    promoPercent: 40, promoCode: "MATCH",
    maxAllocation: "$750K", numAssets: 1,
    platforms: [{name:"Sierra Chart",icon:PLATFORM_ICONS.sierraChart},{name:"TradingView",icon:PLATFORM_ICONS.tradingview},{name:"Quantower",icon:PLATFORM_ICONS.quantower},{name:"Rithmic",icon:PLATFORM_ICONS.rithmic}],
    morePlatforms: 4, popularRank: 2,
    aiSummary: "Tradeify is a US-based futures prop firm offering instant funding and evaluation programs. Supports a wide range of professional trading platforms including Sierra Chart, TradingView, Quantower, and Rithmic. Strong reputation with 4.7/5 rating across 155 reviews.",
    offerDescription: "40% off all challenge accounts",
  },
  {
    slug: "alpha-futures",
    name: "Alpha Futures",
    logo: "https://media.propfirmmatch.com/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/mds6yppqdwcewxtnbiietj2b/Firm=Alpha_Futures,_Category=Prop_Firm_(1).svg",
    rating: 4.6, reviews: 47, totalReviews: 47,
    country: "GB", countryCode: "gb",
    yearsInOperation: 1, trackingId: "42475",
    promoPercent: 15, promoCode: "MATCH",
    maxAllocation: "$750K", numAssets: 1,
    platforms: [{name:"TradingView",icon:PLATFORM_ICONS.tradingview},{name:"Quantower",icon:PLATFORM_ICONS.quantower},{name:"Tradovate",icon:PLATFORM_ICONS.tradovate},{name:"NinjaTrader",icon:PLATFORM_ICONS.ninjatrader}],
    morePlatforms: 1, popularRank: 3,
    aiSummary: "Alpha Futures is a UK-based futures prop trading firm offering structured evaluation programs with competitive scaling plans. Strong rating of 4.6/5 from 47 reviews.",
    offerDescription: "15% off all challenge accounts",
  },
  {
    slug: "my-funded-futures",
    name: "My Funded Futures",
    logo: "https://media.propfirmmatch.com/system/q56k6x0kd9l2g8cko6in27jt/65e0ecfb3c9969e79d582641_My-Funded-Futures.svg",
    rating: 4.5, reviews: 226, totalReviews: 226,
    country: "US", countryCode: "us",
    yearsInOperation: 2, trackingId: "48416", rank: 4,
    promoPercent: 50, promoCode: "MATCH",
    maxAllocation: "$450K", numAssets: 2,
    platforms: [{name:"TradingView",icon:PLATFORM_ICONS.tradingview},{name:"Quantower",icon:PLATFORM_ICONS.quantower},{name:"Volbook",icon:PLATFORM_ICONS.volbook},{name:"Volsys",icon:PLATFORM_ICONS.volsys}],
    morePlatforms: 4,
    aiSummary: "My Funded Futures is a top-tier US futures prop firm with two years in operation. Offers comprehensive evaluation programs with multiple account sizes and a wide selection of professional platforms.",
    offerDescription: "50% off all challenge accounts",
  },
  {
    slug: "top-one-futures",
    name: "Top One Futures",
    logo: "https://media.propfirmmatch.com/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/kz4ss6pa1fvsama547g19s7f/qii7qroo1z011o91p2rnc9o4.png",
    rating: 4.7, reviews: 72, totalReviews: 72,
    country: "US", countryCode: "us",
    yearsInOperation: 1, trackingId: "28850", rank: 5,
    promoPercent: 60, promoCode: "MATCH",
    maxAllocation: "$3.15M", numAssets: 1,
    platforms: [{name:"TradingView",icon:PLATFORM_ICONS.tradingview},{name:"Tradovate",icon:PLATFORM_ICONS.tradovate},{name:"NinjaTrader",icon:PLATFORM_ICONS.ninjatrader}],
    aiSummary: "Top One Futures offers one of the highest max allocations in the industry at $3.15M. US-based with strong 4.7/5 rating across 72 reviews.",
    offerDescription: "60% off all challenge accounts",
  },
  {
    slug: "apex-trader-funding",
    name: "Apex Trader Funding",
    logo: "https://media.propfirmmatch.com/system/d676524pihfr10mtu2muhfh5/671b97110bf14eb6ecf76090_APEX-TRADER-SVG.svg",
    rating: 3.8, reviews: 103, totalReviews: 103,
    country: "US", countryCode: "us",
    yearsInOperation: 5, trackingId: "36591", rank: 6,
    promoPercent: 90, promoCode: "MATCH",
    maxAllocation: "$3M", numAssets: 5,
    platforms: [{name:"Bookmap",icon:PLATFORM_ICONS.bookmap},{name:"Sierra Chart",icon:PLATFORM_ICONS.sierraChart},{name:"TradingView",icon:PLATFORM_ICONS.tradingview}],
    morePlatforms: 11,
    aiSummary: "Apex Trader Funding is a well-established US futures prop firm with 5 years in operation. Offers up to $3M max allocation and supports 14+ trading platforms. The largest discount on the market with 90% off promotions.",
    offerDescription: "90% off + reset discount",
  },
  {
    slug: "topstep",
    name: "Topstep",
    logo: "https://media.propfirmmatch.com/user_2s52JelP7NsVT2WTM72aXmiLnJm/huvxfzar7ojio9l7s3acq3yp/znhs7rgjfo4ci93s3e4wsqxd.png",
    rating: 4.5, reviews: 115, totalReviews: 115,
    country: "US", countryCode: "us",
    yearsInOperation: 12, trackingId: "12832", rank: 7,
    promoPercent: 0, promoCode: "",
    maxAllocation: "$750K", numAssets: "10+",
    platforms: [{name:"TopstepX",icon:PLATFORM_ICONS.topstepx}],
    aiSummary: "Topstep is a pioneering US futures prop trading firm with over a decade of operation. Known for the proprietary TopstepX platform and rigorous trader development programs.",
    offerDescription: "",
  },
  {
    slug: "fundednext-futures",
    name: "FundedNext Futures",
    logo: "https://media.propfirmmatch.com/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/anmmomiyo3t8tgcvvc29c4s5/zkeb5b09moz607wd2mqs8g9s.svg",
    rating: 4.3, reviews: 57, totalReviews: 57,
    country: "AE", countryCode: "ae",
    yearsInOperation: 1, trackingId: "26551", rank: 8,
    promoPercent: 47, promoCode: "MATCH",
    maxAllocation: "$750K", numAssets: 1,
    platforms: [{name:"TradingView",icon:PLATFORM_ICONS.tradingview},{name:"Tradovate",icon:PLATFORM_ICONS.tradovate},{name:"NinjaTrader",icon:PLATFORM_ICONS.ninjatrader}],
    aiSummary: "FundedNext Futures is an established UAE-based prop firm extending into futures trading with a strong reputation in the industry. 4.3/5 rating across 57 reviews.",
    offerDescription: "47% off all challenge accounts",
  },
  {
    slug: "e8-futures",
    name: "E8 Futures",
    logo: "https://media.propfirmmatch.com/user_2s52JelP7NsVT2WTM72aXmiLnJm/gixbpdxzcfdxhu9kf3mlze1f/buyn95g0w6nuygiudaodoryr.svg",
    rating: 4.7, reviews: 18, totalReviews: 18,
    country: "US", countryCode: "us",
    yearsInOperation: 1, trackingId: "1991", rank: 9,
    promoPercent: 20, promoCode: "MATCH",
    maxAllocation: "$750K", numAssets: 1,
    platforms: [{name:"TradingView",icon:PLATFORM_ICONS.tradingview},{name:"Tradovate",icon:PLATFORM_ICONS.tradovate}],
    aiSummary: "E8 Futures brings the established E8 brand into futures trading. US-based with high 4.7/5 rating from 18 reviews.",
    offerDescription: "20% off all challenge accounts",
  },
  {
    slug: "traders-launch",
    name: "Traders Launch",
    logo: "https://media.propfirmmatch.com/system/one8x02vikuk6ifmafao2n5d/65e0edd28291ac62fea38498_Traders-Launch.svg",
    rating: 4.6, reviews: 19, totalReviews: 19,
    country: "US", countryCode: "us",
    yearsInOperation: 2, trackingId: "2384", rank: 10,
    promoPercent: 15, promoCode: "MATCH",
    maxAllocation: "$900K", numAssets: 2,
    platforms: [{name:"Quantower",icon:PLATFORM_ICONS.quantower},{name:"Volumetrica Trading",icon:PLATFORM_ICONS.volumetrica},{name:"NinjaTrader",icon:PLATFORM_ICONS.ninjatrader}],
    aiSummary: "Traders Launch is a US-based futures prop firm offering up to $900K max allocation. Supports professional platforms including Quantower and NinjaTrader with strong 4.6/5 rating.",
    offerDescription: "15% off all challenge accounts",
  },
  {
    slug: "funded-futures-family",
    name: "Funded Futures Family",
    logo: "https://media.propfirmmatch.com/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/j3kcisqcjcpmzv1uk6rc3sjc/u8gi9bhnphnfq9wbpfxn2b9r.svg",
    rating: 4.6, reviews: 12, totalReviews: 12,
    country: "US", countryCode: "us",
    yearsInOperation: 1, trackingId: "202", rank: 11,
    isNew: true, promoPercent: 75, promoCode: "MATCH",
    maxAllocation: "$750K", numAssets: 1,
    platforms: [{name:"TradingView",icon:PLATFORM_ICONS.tradingview},{name:"Tradovate",icon:PLATFORM_ICONS.tradovate},{name:"WealthCharts",icon:PLATFORM_ICONS.wealthCharts},{name:"NinjaTrader",icon:PLATFORM_ICONS.ninjatrader}],
    aiSummary: "Funded Futures Family is a new US-based futures prop firm with an exceptional 75% off launch promo. Strong early reviews at 4.6/5.",
    offerDescription: "75% off launch promo",
  },
  {
    slug: "earn2trade",
    name: "Earn2Trade",
    logo: "https://media.propfirmmatch.com/user_2s52JelP7NsVT2WTM72aXmiLnJm/wphudx3cssrtjaowz89kf2d3/kux20edt7yayq8a4s04yxrfi.jpg",
    rating: 4.6, reviews: 21, totalReviews: 21,
    country: "US", countryCode: "us",
    yearsInOperation: 9, trackingId: "2651", rank: 12,
    promoPercent: 60, promoCode: "MATCH",
    maxAllocation: "$400K", numAssets: 9,
    platforms: [{name:"Bookmap",icon:PLATFORM_ICONS.bookmap},{name:"Sierra Chart",icon:PLATFORM_ICONS.sierraChart}],
    morePlatforms: 19,
    aiSummary: "Earn2Trade is a long-standing US futures prop firm with 9 years in operation. Provides extensive trading education alongside funding opportunities. Supports 21+ platforms.",
    offerDescription: "60% off all challenge accounts",
  },
  {
    slug: "goat-funded-futures",
    name: "Goat Funded Futures",
    logo: "https://media.propfirmmatch.com/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/tvn5lrpvoypvywtvtia1dple/bzo2uxppu0h141l99zzkl1a5.svg",
    rating: 4.3, reviews: 11, totalReviews: 11,
    country: "HK", countryCode: "hk",
    yearsInOperation: 1, trackingId: "4488", rank: 13,
    isNew: true, promoPercent: 50, promoCode: "MATCH", promoLabel: "SPECIAL",
    maxAllocation: "$750K", numAssets: 1,
    platforms: [{name:"TradingView",icon:PLATFORM_ICONS.tradingview},{name:"Quantower",icon:PLATFORM_ICONS.quantower},{name:"Tradovate",icon:PLATFORM_ICONS.tradovate},{name:"Volumetrica Trading",icon:PLATFORM_ICONS.volumetrica}],
    morePlatforms: 4,
    aiSummary: "Goat Funded Futures is a new Hong Kong-based futures prop firm extending the popular Goat Funded brand. Offers competitive 50% off promotion with strong platform support.",
    offerDescription: "50% off + Special offer",
  },
  {
    slug: "take-profit-trader",
    name: "Take Profit Trader",
    logo: "https://media.propfirmmatch.com/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/pu0qmiqb11w66remwkquqckk/Take_Profit_Trader_Logo.svg",
    rating: 3.0, reviews: 17, totalReviews: 17,
    country: "US", countryCode: "us",
    yearsInOperation: 5, trackingId: "3417", rank: 14,
    promoPercent: 50, promoCode: "MATCH",
    maxAllocation: "$750K", numAssets: 5,
    platforms: [{name:"Bookmap",icon:PLATFORM_ICONS.bookmap},{name:"TradingView",icon:PLATFORM_ICONS.tradingview}],
    morePlatforms: 10,
    aiSummary: "Take Profit Trader is an established US futures prop firm with 5 years operating. Offers 12+ trading platforms with up to $750K max allocation.",
    offerDescription: "50% off all challenge accounts",
  },
  {
    slug: "blue-guardian-futures",
    name: "Blue Guardian Futures",
    logo: "https://media.propfirmmatch.com/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/tdqn3kuvdbvpechojbau6f45/BLUE_GUARDIAN_FUTURES_Icon_FF.png",
    rating: 4.4, reviews: 84, totalReviews: 84,
    country: "AE", countryCode: "ae",
    yearsInOperation: 1, trackingId: "4890", rank: 15,
    promoPercent: 35, promoCode: "MATCH",
    maxAllocation: "$450K", numAssets: 1,
    platforms: [{name:"Tradovate",icon:PLATFORM_ICONS.tradovate},{name:"NinjaTrader",icon:PLATFORM_ICONS.ninjatrader}],
    aiSummary: "Blue Guardian Futures is a UAE-based futures prop trading firm with established reputation. 4.4/5 rating across 84 reviews.",
    offerDescription: "35% off all challenge accounts",
  },
  {
    slug: "aquafutures",
    name: "AquaFutures",
    logo: "https://media.propfirmmatch.com/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/dvclj6w11aihezsu4dbmq4lc/Logo_Mark_White.svg",
    rating: 3.8, reviews: 79, totalReviews: 79,
    country: "AE", countryCode: "ae",
    yearsInOperation: 1, trackingId: "4890",
    promoPercent: 60, promoCode: "MATCH",
    maxAllocation: "$450K", numAssets: 1,
    platforms: [{name:"Volumetrica Trading",icon:PLATFORM_ICONS.volumetrica}],
    aiSummary: "AquaFutures is a UAE-based futures prop trading firm specializing in Volumetrica Trading platform. Offers 60% promotional discount.",
    offerDescription: "60% off all challenge accounts",
  },
  {
    slug: "the-trading-pit-futures",
    name: "The Trading Pit Futures",
    logo: "https://media.propfirmmatch.com/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/losuk55jcrhykqur24dahk50/6731fac00ebf7cf7dfcb7b8b_ttp-icon-dark-bg.svg",
    rating: null, reviews: 0,
    country: "LI", countryCode: "li",
    yearsInOperation: 3, trackingId: "2066",
    promoPercent: 30, promoCode: "MATCH30",
    maxAllocation: "$750K", numAssets: 3,
    platforms: [{name:"TradingView",icon:PLATFORM_ICONS.tradingview},{name:"Quantower",icon:PLATFORM_ICONS.quantower},{name:"R Trader Pro",icon:PLATFORM_ICONS.rTraderPro},{name:"Volsys",icon:PLATFORM_ICONS.volsys}],
    morePlatforms: 4,
    aiSummary: "The Trading Pit Futures is a Liechtenstein-based prop trading firm offering futures alongside other asset classes. Supports 8+ professional trading platforms.",
    offerDescription: "30% off all challenge accounts",
  },
  {
    slug: "hola-prime-futures",
    name: "Hola Prime Futures",
    logo: "https://media.propfirmmatch.com/user_2rmBzzwlyNFeYaJ74FgryMW7Y0m/auelhb6d6k0isfoflawp1zn2/xaejvjxmodbr1xcqapwai83y.svg",
    rating: null, reviews: 0,
    country: "HK", countryCode: "hk",
    yearsInOperation: 1, trackingId: "27",
    isNew: true, promoPercent: 50, promoCode: "MATCH50",
    maxAllocation: "$500K", numAssets: 0,
    platforms: [{name:"Dx Futures",icon:PLATFORM_ICONS.dxFutures},{name:"Tradovate",icon:PLATFORM_ICONS.tradovate},{name:"NinjaTrader",icon:PLATFORM_ICONS.ninjatrader}],
    aiSummary: "Hola Prime Futures is a brand-new Hong Kong-based futures prop firm extending the Hola Prime brand. Special launch 50% off promotion.",
    offerDescription: "50% off launch promo",
  },
  {
    slug: "tradeday",
    name: "TradeDay",
    logo: "https://media.propfirmmatch.com/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/llkmrltmkjo2prqnb897d2k6/agltbrp8mtw342n900rj7e4l.svg",
    rating: 4.8, reviews: 11, totalReviews: 11,
    country: "US", countryCode: "us",
    yearsInOperation: 6, trackingId: "2623",
    promoPercent: 30, promoCode: "MATCH",
    maxAllocation: "$900K", numAssets: 6,
    platforms: [{name:"TradingView",icon:PLATFORM_ICONS.tradingview},{name:"Jigsaw Daytradr",icon:PLATFORM_ICONS.jigsaw},{name:"Tradovate",icon:PLATFORM_ICONS.tradovate}],
    morePlatforms: 1,
    aiSummary: "TradeDay is an established US futures prop firm with 6 years in operation. Top-rated at 4.8/5 with up to $900K max allocation.",
    offerDescription: "30% off all challenge accounts",
  },
  {
    slug: "futureselite",
    name: "FuturesElite",
    logo: "https://media.propfirmmatch.com/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/jvilgyccctax26moh76i1gw9/bfocwj4tffpjtgjybl7ox5e0.svg",
    rating: null, reviews: 0,
    country: "IT", countryCode: "it",
    yearsInOperation: 1, trackingId: "546",
    promoPercent: 40, promoCode: "MATCH",
    maxAllocation: "$1.5M", numAssets: 1,
    platforms: [{name:"Quantower",icon:PLATFORM_ICONS.quantower},{name:"Tradovate",icon:PLATFORM_ICONS.tradovate},{name:"Volumetrica Trading",icon:PLATFORM_ICONS.volumetrica},{name:"NinjaTrader",icon:PLATFORM_ICONS.ninjatrader}],
    morePlatforms: 3,
    aiSummary: "FuturesElite is an Italy-based futures prop firm offering one of the largest max allocations at $1.5M. Supports 7+ professional platforms.",
    offerDescription: "40% off all challenge accounts",
  },
  {
    slug: "blueberry-futures",
    name: "Blueberry Futures",
    logo: "https://media.propfirmmatch.com/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/bpy7i88ne9jozncdnnihsy6e/g5m5bxyid6bceg6y51syq57n.svg",
    rating: null, reviews: 0,
    country: "AU", countryCode: "au",
    yearsInOperation: 1, trackingId: "150",
    promoPercent: 60, promoCode: "MATCH",
    maxAllocation: "$500K", numAssets: 1,
    platforms: [{name:"TradingView",icon:PLATFORM_ICONS.tradingview},{name:"Tradovate",icon:PLATFORM_ICONS.tradovate}],
    aiSummary: "Blueberry Futures is a new Australian futures prop firm with a 60% off launch promotion.",
    offerDescription: "60% off launch promo",
  },
];


  // Auto-generated enrichment from scraped firm pages
  type Enrichment = Partial<Pick<Firm, "ceo"|"dateCreated"|"trustPilot"|"reviewsBreakdown"|"challenges"|"leverage"|"consistencyRules"|"aiSummary">>;
  const ENRICHMENT: Record<string, Enrichment> = {
  "alpha-futures": {
    "ceo": "Andrew Blaylock & George Kohler",
    "dateCreated": "Jul 2024",
    "trustPilot": 4.9,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 33
      },
      {
        "stars": 4,
        "count": 12
      },
      {
        "stars": 3,
        "count": 0
      },
      {
        "stars": 2,
        "count": 0
      },
      {
        "stars": 1,
        "count": 2
      }
    ],
    "challenges": [
      {
        "name": "Alpha Futures - Premium - No Activation Path - 1-Step - 150K",
        "price": "$322.15",
        "original": "$379.00"
      },
      {
        "name": "Alpha Futures - Premium - No Activation Path - 1-Step - 100K",
        "price": "$228.65",
        "original": "$269.00"
      },
      {
        "name": "Alpha Futures - Premium - No Activation Path - 1-Step - 50K",
        "price": "$135.15",
        "original": "$159.00"
      },
      {
        "name": "Alpha Futures - Premium - Activation Path - 1-Step - 150K",
        "price": "$203.15",
        "original": "$239.00"
      },
      {
        "name": "Alpha Futures - Premium - Activation Path - 1-Step - 100K",
        "price": "$135.15",
        "original": "$159.00"
      },
      {
        "name": "Alpha Futures - Premium - Activation Path - 1-Step - 50K",
        "price": "$67.15",
        "original": "$79.00"
      },
      {
        "name": "Alpha Futures - Zero - 1-Step - 25K",
        "price": "$67.15",
        "original": "$79.00"
      },
      {
        "name": "Alpha Futures - Zero - 1-Step - 100K",
        "price": "$203.15",
        "original": "$239.00"
      },
      {
        "name": "Alpha Futures - Zero - 1-Step - 50K",
        "price": "$101.15",
        "original": "$119.00"
      },
      {
        "name": "Alpha Futures - Advanced Plan - 1-Step - 50K",
        "price": "$118.15",
        "original": "$139.00"
      }
    ],
    "leverage": [
      "Premium Max Contract Size Allowed per Account Size",
      "$50,000 Account: Up to 4 Contracts (40 Micros)",
      "$100,000 Account: Up to 8 Contracts (80 Micros)",
      "$150,000 Account: Up to 12 Contracts (120 Micros",
      "Advanced Max Contract Size Allowed per Account Size",
      "$50,000 Account: Up to 5 Contracts (50 Micros)",
      "$100,000 Account: Up to 10 Contracts (100 Micros)",
      "$150,000 Account: Up to 15 Contracts (150 Micros)",
      "Zero Max Contract Size Allowed per Account Size",
      "$25,000 Account: Up to 1 Contracts (10 Micros)",
      "$50,000 Account: Up to 3 Contracts (30 Micros)",
      "$100,000 Account: Up to 6 Contracts (60 Micros)"
    ],
    "aiSummary": "Alpha Futures, based in the United Kingdom, was established in July 2024. It offers futures trading through a 1 Step program and supports TradingView, Quantower, Tradovate, NinjaTrader and Deepcharts. Alpha Capital Group entered the futures space with Alpha Futures; a stated driving factor was seeking more stability for US-based traders and diversifying the company's offerings. The firm describes a less restrictive payout policy and states it will provide trader events and education. Review..."
  },
  "apex-trader-funding": {
    "ceo": "Darrel Martin",
    "dateCreated": "Jan 2021",
    "trustPilot": 4.4,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 33
      },
      {
        "stars": 4,
        "count": 41
      },
      {
        "stars": 3,
        "count": 16
      },
      {
        "stars": 2,
        "count": 4
      },
      {
        "stars": 1,
        "count": 9
      }
    ],
    "challenges": [
      {
        "name": "Apex Trader Funding - WealthCharts EOD - 1-Step - 150K",
        "price": "$79.90",
        "original": "$799.00"
      },
      {
        "name": "Apex Trader Funding - WealthCharts EOD - 1-Step - 100K",
        "price": "$59.90",
        "original": "$599.00"
      },
      {
        "name": "Apex Trader Funding - WealthCharts EOD - 1-Step - 50K",
        "price": "$34.90",
        "original": "$349.00"
      },
      {
        "name": "Apex Trader Funding - WealthCharts EOD - 1-Step - 25K",
        "price": "$29.90",
        "original": "$299.00"
      },
      {
        "name": "Apex Trader Funding - WealthCharts Intraday - 1-Step - 150K",
        "price": "$59.90",
        "original": "$599.00"
      },
      {
        "name": "Apex Trader Funding - WealthCharts Intraday - 1-Step - 100K",
        "price": "$39.90",
        "original": "$399.00"
      },
      {
        "name": "Apex Trader Funding - WealthCharts Intraday - 1-Step - 50K",
        "price": "$24.90",
        "original": "$249.00"
      },
      {
        "name": "Apex Trader Funding - WealthCharts Intraday - 1-Step - 25K",
        "price": "$19.90",
        "original": "$199.00"
      },
      {
        "name": "Apex Trader Funding - Tradovate Intraday - 1-Step - 150K",
        "price": "$59.90",
        "original": "$599.00"
      },
      {
        "name": "Apex Trader Funding - Tradovate Intraday - 1-Step - 100K",
        "price": "$39.90",
        "original": "$399.00"
      }
    ],
    "leverage": [
      "Max Contract Size Allowed per Account Size",
      "Evaluation",
      "$25,000 Account: Up to 4 Mini / 40 Micros",
      "$50,000 Account: Up to 6 Mini / 60 Micros",
      "$100,000 Account: Up to 8 Mini / 80 Micros",
      "$150,000 Account: Up to 12 Mini / 120 Micros",
      "Sim Funded (Perfomance Account)",
      "$25,000 Account: Up to 2 Mini / 20 Micros",
      "$50,000 Account: Up to 4 Mini / 40 Micros",
      "$100,000 Account: Up to 6 Mini / 60 Micros",
      "$150,000 Account: Up to 10 Mini / 100 Micros"
    ],
    "aiSummary": "Apex Trader Funding, based in the United States and established January 2021, offers futures trading and a 1 Step program. Account sizes range from $25,000 to $300,000. Supported platforms include Bookmap, Sierra Chart, MotiveWave, TradingView, EdgeProX, Finamark, Jigsaw Daytradr, Quantower, R Trader Pro, VolFix, Rithmic, Tradovate, WealthCharts, NinjaTrader and ATAS Orderflow Trading. Tradable instruments include stock index futures such as E-mini S&P 500, NASDAQ 100 and Mini-DOW; interest..."
  },
  "aquafutures": {
    "ceo": "Kyle Tate (COO)",
    "dateCreated": "Nov 2024",
    "trustPilot": 3.2,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 28
      },
      {
        "stars": 4,
        "count": 31
      },
      {
        "stars": 3,
        "count": 8
      },
      {
        "stars": 2,
        "count": 1
      },
      {
        "stars": 1,
        "count": 11
      }
    ],
    "challenges": [
      {
        "name": "AquaFutures - Instant Pro - Instant 100K",
        "price": "$268.80",
        "original": "$672.00"
      },
      {
        "name": "AquaFutures - Instant Pro - Instant 50K",
        "price": "$228.80",
        "original": "$572.00"
      },
      {
        "name": "AquaFutures - Instant Funding - Instant 100K",
        "price": "$306.00",
        "original": "$765.00"
      },
      {
        "name": "AquaFutures - Instant Funding - Instant 50K",
        "price": "$246.00",
        "original": "$615.00"
      },
      {
        "name": "AquaFutures - Standard Evaluation - 1-Step 150K",
        "price": "$240.00",
        "original": "$600.00"
      },
      {
        "name": "AquaFutures - Standard Evaluation - 1-Step 100K",
        "price": "$190.00",
        "original": "$475.00"
      },
      {
        "name": "AquaFutures - Standard Evaluation - 1-Step 50K",
        "price": "$120.00",
        "original": "$300.00"
      },
      {
        "name": "AquaFutures - Standard Evaluation - 1-Step 25K",
        "price": "$70.00",
        "original": "$175.00"
      },
      {
        "name": "AquaFutures - Beginner Evaluation - 1-Step 150K",
        "price": "$210.00",
        "original": "$525.00"
      },
      {
        "name": "AquaFutures - Beginner Evaluation - 1-Step 100K",
        "price": "$150.00",
        "original": "$375.00"
      }
    ],
    "leverage": [
      "Beginner",
      "25k: 1 contract",
      "50k : 3 contracts",
      "100k: 6 contracts",
      "150k: 9 contracts",
      "Standard",
      "25k: 2 contracts",
      "50k : 5 contracts",
      "100k: 10 contracts",
      "150k: 15 contracts",
      "Instant",
      "25k: 1 contracts"
    ],
    "consistencyRules": [
      {
        "program": "Standard",
        "rule": "No single trading day may account for 40% or more of the total profits (Funded)"
      },
      {
        "program": "Beginner",
        "rule": "No single trading day may account for 40% or more of the total profits (Funded and Evaluation)"
      },
      {
        "program": "Instant",
        "rule": "Your largest profitable day must not exceed 20% of your total profits for the cycle. (funded)"
      },
      {
        "program": "Instant Pro",
        "rule": "Your largest profitable day must not exceed 15% of your total profits for the cycle. (funded)"
      }
    ],
    "aiSummary": "AquaFutures, established November 2024, is a prop trading firm based in the United Arab Emirates. The firm offers trading in futures markets and runs a single-step (1 Step) program for traders. Supported trading platforms are Volumetrica Trading and Deepcharts, which are listed as the platforms available to participants in the program. AquaFutures carries a review score of 3.8 out of 5 based on 79 reviews. The firm’s public profile centers on providing futures-only access via its 1 Step program..."
  },
  "blue-guardian-futures": {
    "ceo": "Sean Bainton",
    "dateCreated": "Nov 2024",
    "trustPilot": 3.8,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 62
      },
      {
        "stars": 4,
        "count": 8
      },
      {
        "stars": 3,
        "count": 4
      },
      {
        "stars": 2,
        "count": 2
      },
      {
        "stars": 1,
        "count": 8
      }
    ],
    "challenges": [
      {
        "name": "Blue Guardian Futures - Rapid- 1-Step 50K",
        "price": "$82.20",
        "original": "$137.00"
      },
      {
        "name": "Blue Guardian Futures - Rapid- 1-Step 100K",
        "price": "$128.40",
        "original": "$214.00"
      },
      {
        "name": "Blue Guardian Futures - Rapid- 1-Step 150K",
        "price": "$165.00",
        "original": "$275.00"
      },
      {
        "name": "Blue Guardian Futures - Instant - 25K",
        "price": "$183.60",
        "original": "$306.00"
      },
      {
        "name": "Blue Guardian Futures - Instant - 150K",
        "price": "$460.80",
        "original": "$768.00"
      },
      {
        "name": "Blue Guardian Futures - Instant - 100K",
        "price": "$368.40",
        "original": "$614.00"
      },
      {
        "name": "Blue Guardian Futures - Instant - 50K",
        "price": "$276.00",
        "original": "$460.00"
      },
      {
        "name": "Blue Guardian Futures - Pro - 1-Step 150K",
        "price": "$183.60",
        "original": "$306.00"
      },
      {
        "name": "Blue Guardian Futures - Pro - 1-Step 100K",
        "price": "$137.40",
        "original": "$229.00"
      },
      {
        "name": "Blue Guardian Futures - Pro - 1-Step 50K",
        "price": "$91.20",
        "original": "$152.00"
      }
    ],
    "leverage": [
      "Standard",
      "50k - 3 mini(30 micros)",
      "100k - 6 mini(60 micros)",
      "150k - 9 mini (90 micros)",
      "Guardian",
      "50k - 5 mini (50 micros)",
      "100k - 10 mini (100 micros)",
      "150k - 15 mini (150 micros)",
      "Instant",
      "50k - 5 mini (50 micros)",
      "100k - 10 mini (100 micros)",
      "150k - 15 mini (150 micros)"
    ],
    "consistencyRules": [
      {
        "program": "Standard",
        "rule": "No single trading day can contribute 40% or more of the total profit, this applies to evaluation and funded stage."
      },
      {
        "program": "Pro",
        "rule": "No single trading day can contribute 35% or more of the total profit, this applies to funded stage."
      },
      {
        "program": "Rapid",
        "rule": "No single trading day can contribute 40% or more of the total profit, this applies to evaluation and funded stage."
      },
      {
        "program": "Instant",
        "rule": "No single trading day can contribute 20% or more of the total profit.\""
      }
    ],
    "aiSummary": "Blue Guardian Futures, based in the United Arab Emirates, was established in November 2024 and lists futures as its instrument. The firm offers futures trading and operates two program types: 1 Step and Instant. Trading is supported via Tradovate, NinjaTrader and Deepcharts platforms. Blue Guardian Futures has a review score of 4.4 out of 5 based on 84 reviews. The available information lists a 4.4/5 review score from 84 reviews. As a firm launched in late 2024, it presents futures-focused..."
  },
  "blueberry-futures": {
    "ceo": "Dean Hyde and Marcus Fetherston",
    "dateCreated": "Nov 2025",
    "trustPilot": 2.8,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 1
      },
      {
        "stars": 4,
        "count": 0
      },
      {
        "stars": 3,
        "count": 0
      },
      {
        "stars": 2,
        "count": 0
      },
      {
        "stars": 1,
        "count": 2
      }
    ],
    "challenges": [
      {
        "name": "Blueberry Futures - Accelerated - 1-Step - 150K",
        "price": "$182.40",
        "original": "$456.00"
      },
      {
        "name": "Blueberry Futures - Accelerated - 1-Step - 100K",
        "price": "$110.40",
        "original": "$276.00"
      },
      {
        "name": "Blueberry Futures - Accelerated - 1-Step - 50K",
        "price": "$73.60",
        "original": "$184.00"
      },
      {
        "name": "Blueberry Futures - Accelerated - 1-Step - 25K",
        "price": "$44.16",
        "original": "$110.40"
      },
      {
        "name": "Blueberry Futures - Ascent - 1-Step - 150K",
        "price": "$242.80",
        "original": "$607.00"
      },
      {
        "name": "Blueberry Futures - Ascent - 1-Step - 100K",
        "price": "$147.20",
        "original": "$368.00"
      },
      {
        "name": "Blueberry Futures - Ascent - 1-Step - 50K",
        "price": "$98.00",
        "original": "$245.00"
      },
      {
        "name": "Blueberry Futures - Ascent - 1-Step - 25K",
        "price": "$58.80",
        "original": "$147.00"
      }
    ],
    "leverage": [
      "$25,000 Account: Up to 1 Contracts (10 Micros)",
      "$50,000 Account: Up to 2 Contracts (20 Micros)",
      "$100,000 Account: Up to 6 Contracts (60 Micros)",
      "$150,000 Account: Up to 9 Contracts (90 Micros)"
    ]
  },
  "e8-futures": {
    "ceo": "Dylan Elchami",
    "dateCreated": "Dec 2024",
    "trustPilot": 4.3,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 12
      },
      {
        "stars": 4,
        "count": 6
      },
      {
        "stars": 3,
        "count": 0
      },
      {
        "stars": 2,
        "count": 0
      },
      {
        "stars": 1,
        "count": 0
      }
    ],
    "challenges": [
      {
        "name": "E8 Futures - E8 Signature 1-Step - 25K",
        "price": "$88.00",
        "original": "$110.00"
      },
      {
        "name": "E8 Futures - E8 Signature 1-Step - 150K",
        "price": "$312.00",
        "original": "$390.00"
      },
      {
        "name": "E8 Futures - E8 Signature 1-Step - 100K",
        "price": "$208.00",
        "original": "$260.00"
      },
      {
        "name": "E8 Futures - E8 Signature 1-Step - 50K",
        "price": "$120.00",
        "original": "$150.00"
      }
    ],
    "leverage": [],
    "aiSummary": "E8 Futures, established in December 2024 and based in the United States, offers a 1 Step program and supports TradingView and Tradovate as its platforms. The firm is recorded with a review score of 4.7 out of 5 based on 18 reviews. The provided details focus on the firm’s launch timing, program format, platform compatibility and reviewer feedback without additional operational specifics. This profile summarizes those core attributes of E8 Futures as supplied, presenting a concise snapshot of..."
  },
  "earn2trade": {
    "ceo": "Osvaldo Guimarães",
    "dateCreated": "Sep 2016",
    "trustPilot": 4.7,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 15
      },
      {
        "stars": 4,
        "count": 4
      },
      {
        "stars": 3,
        "count": 1
      },
      {
        "stars": 2,
        "count": 1
      },
      {
        "stars": 1,
        "count": 0
      }
    ],
    "challenges": [
      {
        "name": "Earn2Trade - Trader Career Path 25K - 1-Step - 25K",
        "price": "$60.00",
        "original": "$150.00"
      },
      {
        "name": "Earn2Trade - Trader Career Path 50K - 1-Step - 50K",
        "price": "$76.00",
        "original": "$190.00"
      },
      {
        "name": "Earn2Trade - Trader Career Path 100K - 1-Step - 100K",
        "price": "$140.00",
        "original": "$350.00"
      },
      {
        "name": "Earn2Trade - The Gauntlet Mini 50K - 1-Step - 50K",
        "price": "$68.00",
        "original": "$170.00"
      },
      {
        "name": "Earn2Trade - The Gauntlet Mini 200K - 1-Step - 200K",
        "price": "$220.00",
        "original": "$550.00"
      },
      {
        "name": "Earn2Trade - The Gauntlet Mini 150K - 1-Step - 150K",
        "price": "$150.00",
        "original": "$375.00"
      },
      {
        "name": "Earn2Trade - The Gauntlet Mini 100K - 1-Step - 100K",
        "price": "$126.00",
        "original": "$315.00"
      }
    ],
    "leverage": [
      "Max Contract Size Allowed per Account Size",
      "Max Contracts allowed for The Gauntlet Mini",
      "$50k : Up to 6 Contracts",
      "$100k : Up to 12 Contracts",
      "$150k : Up to 15 Contracts",
      "$200k: Up to 16 Contracts",
      "Max Contracts allowed for Trader Career Path :",
      "$100k: Up to 12 Contracts",
      "$50k: Up to 6 Contracts",
      "$25k: Up to 3 Contracts"
    ],
    "aiSummary": "Earn2Trade, based in the United States, was established in September 2016. It offers futures instruments through a 1 Step program. Account sizes range from $25,000 to $200,000. Platforms supported include Bookmap, Investor/RT, Sierra Chart, MotiveWave, TradingView, Finamark, OverCharts, Trade Navigator, Jigsaw Daytradr, MultiCharts, Quantower, R Trader Pro, VolFix, Rithmic, Tradovate, Inside Edge Trader, Photon, QScalp, QSI-Quick Screen Trading, R Trader, Scalp Tool, NinjaTrader and ATAS..."
  },
  "funded-futures-family": {
    "ceo": "Manuel Meraz",
    "dateCreated": "Oct 2024",
    "trustPilot": 4.7,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 9
      },
      {
        "stars": 4,
        "count": 2
      },
      {
        "stars": 3,
        "count": 0
      },
      {
        "stars": 2,
        "count": 1
      },
      {
        "stars": 1,
        "count": 0
      }
    ],
    "challenges": [
      {
        "name": "Funded Futures Family - S2F Plan - Instant 150K",
        "price": "$699.00"
      },
      {
        "name": "Funded Futures Family - S2F Plan - Instant 100K",
        "price": "$329.45",
        "original": "$599.00"
      },
      {
        "name": "Funded Futures Family - S2F Plan - Instant 50K",
        "price": "$499.00"
      },
      {
        "name": "Funded Futures Family - S2F Plan - Instant 25K",
        "price": "$399.00"
      },
      {
        "name": "Funded Futures Family - Velocity Plan - 1-Step 150K",
        "price": "$81.25",
        "original": "$325.00"
      },
      {
        "name": "Funded Futures Family - Velocity Plan - 1-Step 100K",
        "price": "$56.25",
        "original": "$225.00"
      },
      {
        "name": "Funded Futures Family - Velocity Plan - 1-Step 50K",
        "price": "$31.25",
        "original": "$125.00"
      },
      {
        "name": "Funded Futures Family - Velocity Plan - 1-Step 25K",
        "price": "$19.75",
        "original": "$79.00"
      },
      {
        "name": "Funded Futures Family - Premier Plus - Intraday Trailing Drawdown - 1-Step 150K",
        "price": "$142.45",
        "original": "$259.00"
      },
      {
        "name": "Funded Futures Family - Premier Plus - Intraday Trailing Drawdown - 1-Step 100K",
        "price": "$103.95",
        "original": "$189.00"
      }
    ],
    "leverage": [
      "Prime, Premier Plus (EOD & Intraday) & Velocity Max Contract Size Allowed per Account Size",
      "$25,000 Account: Up to 3 Minis or 30 Micros",
      "$50,000 Account: Up to 5 Minis or 50 Micros",
      "$100,000 Account: Up to 10 Minis or 100 Micros",
      "$150,000 Account: Up to 15 Minis or 150 Micros",
      "S2F Max Contract Size Allowed per Account Size",
      "$25,000 Account - Up to 1 mini or 10 micros",
      "$50,000 - Up to 5 minis or 50 micros",
      "$100,000 Account - Up to 10 minis or 100 micros",
      "$150,000 Account - Up to 15 minis or 150 micros"
    ],
    "aiSummary": "Funded Futures Family is based in the United States and was established in October 2024. The firm offers futures trading through two program types: Instant and 1 Step. Supported platforms include TradingView, Tradovate, WealthCharts, and NinjaTrader. The firm lists futures as its tradable instrument across its Instant and 1 Step programs. It has a review score of 4.6 out of 5 based on 12 reviews. This overview summarizes Funded Futures Family's listed offerings, supported platforms, program..."
  },
  "fundednext-futures": {
    "ceo": "Abdullah Jayed",
    "dateCreated": "Apr 2025",
    "trustPilot": 4.5,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 34
      },
      {
        "stars": 4,
        "count": 17
      },
      {
        "stars": 3,
        "count": 0
      },
      {
        "stars": 2,
        "count": 0
      },
      {
        "stars": 1,
        "count": 6
      }
    ],
    "challenges": [
      {
        "name": "FundedNext Futures - Flex - 1-Step - 150K",
        "price": "$256.51",
        "original": "$483.99"
      },
      {
        "name": "FundedNext Futures - Flex - 1-Step - 100K",
        "price": "$132.49",
        "original": "$249.99"
      },
      {
        "name": "FundedNext Futures - Flex - 1-Step - 50K",
        "price": "$71.01",
        "original": "$133.99"
      },
      {
        "name": "FundedNext Futures - Bolt - 1-Step - 50K",
        "price": "$89.99",
        "original": "$99.99"
      },
      {
        "name": "FundedNext Futures - Rapid - 1-Step - 100K",
        "price": "$251.99",
        "original": "$279.99"
      },
      {
        "name": "FundedNext Futures - Rapid - 1-Step - 50K",
        "price": "$179.99",
        "original": "$199.99"
      },
      {
        "name": "FundedNext Futures - Rapid - 1-Step - 25K",
        "price": "$89.99",
        "original": "$99.99"
      },
      {
        "name": "FundedNext Futures - Legacy - 1-Step - 100K",
        "price": "$224.99",
        "original": "$249.99"
      },
      {
        "name": "FundedNext Futures - Legacy - 1-Step - 50K",
        "price": "$134.99",
        "original": "$149.99"
      },
      {
        "name": "FundedNext Futures - Legacy - 1-Step - 25K",
        "price": "$71.99",
        "original": "$79.99"
      }
    ],
    "leverage": [
      "Legacy Evaluation",
      "25k - 2 minis, 20 micros",
      "50k - 3 minis, 30 micros",
      "100k - 5 minis, 50 micros",
      "25k - up to 3 minis, 30 micros",
      "50k - up to 5 minis, 50 micros",
      "100k - up to 7 minis,70 micros",
      "Rapid Evaluation",
      "25k - 2 minis, 10 micros",
      "50k - 3 minis, 15 micros",
      "100k - 5 minis, 25 micros",
      "25k - up to 3 minis, 15 micros"
    ],
    "aiSummary": "FundedNext Futures, based in the United Arab Emirates, was established in April 2025. The firm offers futures trading and operates a single-step program designated \"1 Step\". Its stated program type is 1 Step and supported platforms include TradingView, Tradovate, and NinjaTrader. Tradable instruments are futures contracts. The firm has a review score of 4.3 out of 5 based on 57 reviews. FundedNext Futures is a futures-focused firm providing a single program structure with access via multiple..."
  },
  "futureselite": {
    "ceo": "Christian Habibi",
    "dateCreated": "Nov 2024",
    "trustPilot": 4.6,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 5
      },
      {
        "stars": 4,
        "count": 3
      },
      {
        "stars": 3,
        "count": 0
      },
      {
        "stars": 2,
        "count": 1
      },
      {
        "stars": 1,
        "count": 0
      }
    ],
    "challenges": [
      {
        "name": "FuturesElite - 1-Step Custom - 150K",
        "price": "$329.00"
      },
      {
        "name": "FuturesElite - 1-Step Custom - 100K",
        "price": "$229.00"
      },
      {
        "name": "FuturesElite - 1-Step Custom - 50K",
        "price": "$129.00"
      },
      {
        "name": "FuturesElite - Instant Custom - 150K Instant",
        "price": "$899.00"
      },
      {
        "name": "FuturesElite - Instant Custom - 100K Instant",
        "price": "$699.00"
      },
      {
        "name": "FuturesElite - Instant Custom - 50K Instant",
        "price": "$499.00"
      },
      {
        "name": "FuturesElite - Instant Custom - 25K Instant",
        "price": "$329.00"
      },
      {
        "name": "FuturesElite - Instant - 25K Instant",
        "price": "$197.40",
        "original": "$329.00"
      },
      {
        "name": "FuturesElite - Instant - 150K Instant",
        "price": "$539.40",
        "original": "$899.00"
      },
      {
        "name": "FuturesElite - Instant - 100K Instant",
        "price": "$419.40",
        "original": "$699.00"
      }
    ],
    "leverage": [
      "Prime Plan & Custom Evaluation",
      "50K Account: 3 Contracts \\| Up to 3 Minis or 30 Micros",
      "100K Account: 8 Contracts \\| Up to 8 Minis or 80 Micros",
      "150K Account: 12 Contracts \\| Up to 12 Minis or 120 Micros",
      "Elite Plan",
      "50K Account: 4 Contracts \\| Up to 4 Minis or 40 Micros",
      "100K Account: 8 Contracts \\| Up to 8 Minis or 80 Micros",
      "150K Account: 12 Contracts \\| Up to 12 Minis or 120 Micros",
      "Instant Plan & Instant Custom",
      "25K Account: 2 Contracts \\| Up to 2 Minis or 20 Micros",
      "50K Account: 4 Contracts \\| Up to 4 Minis or 40 Micros",
      "100K Account: 8 Contracts \\| Up to 8 Minis or 80 Micros"
    ],
    "consistencyRules": [
      {
        "program": "Custom Evaluation",
        "rule": "No single trading day’s profits can be greater than 50% of your total profits. (Evaluation accounts only)"
      },
      {
        "program": "Prime",
        "rule": "No single trading day’s profit can equal or exceed 40% of your total profit (Funded only)"
      },
      {
        "program": "Elite Sim Funded",
        "rule": "No single trading day’s profits can be greater than 50% of your total profits. (Evaluation accounts only)"
      },
      {
        "program": "Instant",
        "rule": "1st and 2nd payout: 20% Consistency Score \\| 3rd payout: 25%,Consistency score \\| 4th payout: 30% consistency score"
      },
      {
        "program": "Custom Instant",
        "rule": "1st Payout: 20% consistency Score \\| 2nd Payout: 25% consistency score \\| 3rd Payout: 30% consistency score"
      },
      {
        "program": "Custom Instant and Instant 25k (Fixed at 20%)",
        "rule": "No single trading day’s profits can be equal to or greater than 20% of your total profits"
      }
    ]
  },
  "goat-funded-futures": {
    "ceo": "Edoardo Dalla Torre",
    "dateCreated": "Nov 2024",
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 7
      },
      {
        "stars": 4,
        "count": 2
      },
      {
        "stars": 3,
        "count": 1
      },
      {
        "stars": 2,
        "count": 0
      },
      {
        "stars": 1,
        "count": 1
      }
    ],
    "challenges": [
      {
        "name": "Goat Funded Futures - Pro - 1-Step 150K",
        "price": "$289.00"
      },
      {
        "name": "Goat Funded Futures - Pro - 1-Step 100K",
        "price": "$149.00"
      },
      {
        "name": "Goat Funded Futures - Pro - 1-Step 50K",
        "price": "$95.00"
      },
      {
        "name": "Goat Funded Futures - Sprint - 1-Step 100K",
        "price": "$140.00",
        "original": "$280.00"
      },
      {
        "name": "Goat Funded Futures - Sprint - 1-Step 50K",
        "price": "$93.00",
        "original": "$186.00"
      },
      {
        "name": "Goat Funded Futures - Sprint - 1-Step 25K",
        "price": "$64.00",
        "original": "$128.00"
      },
      {
        "name": "Goat Funded Futures - Instant - Instant 150K",
        "price": "$624.00",
        "original": "$1,248.00"
      },
      {
        "name": "Goat Funded Futures - Instant - Instant 100K",
        "price": "$489.00",
        "original": "$978.00"
      },
      {
        "name": "Goat Funded Futures - Instant - Instant 75K",
        "price": "$382.00",
        "original": "$764.00"
      },
      {
        "name": "Goat Funded Futures - Instant - Instant 50K",
        "price": "$277.00",
        "original": "$554.00"
      }
    ],
    "leverage": [
      "EOD",
      "50K: 5 minis / 50 micros",
      "100K: 9 minis / 90 micros",
      "150K: 12 minis / 120 micros",
      "Sprint",
      "25K: 3 minis / 30 micros",
      "50K: 5 minis / 50 micros",
      "100K: 7 minis / 70 micros",
      "Instant",
      "25K: 3 minis / 30 micros",
      "50K: 4 minis /40 micros",
      "75K: 5 minis /50 micros"
    ],
    "consistencyRules": [
      {
        "program": "EOD Accounts",
        "rule": "A trader's profit on any single day cannot exceed 50% of the total profit on Evaluation and 30% on Funded"
      },
      {
        "program": "Instant",
        "rule": "A trader's profit on any single day cannot exceed 20% of the total profit. (Instant Funded - No Evaluation)"
      },
      {
        "program": "Sprint",
        "rule": "A trader's profit on any single day cannot exceed 30% of the total profit on Funded. (None on evaluation) Evaluation: 50% consistency Score \\| Sim Funded: None"
      }
    ],
    "aiSummary": "Goat Funded Futures, based in Hong Kong and established in November 2024, offers futures trading through two program types: 1 Step and Instant. The firm supports TradingView, Quantower, Tradovate, Volumetrica Trading, NinjaTrader, ATAS Orderflow Trading, Deepmap and Deepcharts as trading platforms. Listed instruments include futures. Goat Funded Futures has a review score of 4.3/5 from 11 reviews. The firm provides program-based access to futures trading and integrates with multiple third-party..."
  },
  "hola-prime-futures": {
    "ceo": "Somesh Kapuria",
    "dateCreated": "Jun 2025",
    "trustPilot": 4.6,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 1
      },
      {
        "stars": 4,
        "count": 0
      },
      {
        "stars": 3,
        "count": 0
      },
      {
        "stars": 2,
        "count": 0
      },
      {
        "stars": 1,
        "count": 0
      }
    ],
    "challenges": [
      {
        "name": "Hola Prime Futures - Direct - Instant 150K",
        "price": "$998.00"
      },
      {
        "name": "Hola Prime Futures - Direct - Instant 100K",
        "price": "$698.00"
      },
      {
        "name": "Hola Prime Futures - Direct - Instant 50K",
        "price": "$548.00"
      },
      {
        "name": "Hola Prime Futures - Direct - Instant 25K",
        "price": "$348.00"
      },
      {
        "name": "Hola Prime Futures - 1 Step Prime - 150K",
        "price": "$359.00"
      },
      {
        "name": "Hola Prime Futures - 1 Step Prime - 100K",
        "price": "$129.50",
        "original": "$259.00"
      },
      {
        "name": "Hola Prime Futures - 1 Step Prime - 50K",
        "price": "$79.50",
        "original": "$159.00"
      },
      {
        "name": "Hola Prime Futures - 1 Step Prime - 25K",
        "price": "$49.50",
        "original": "$99.00"
      }
    ],
    "leverage": [
      "Maximum Exposure Limit",
      "1-step Prime Challenge",
      "$25,000 Account: Up to 1 Minis or 10 Micros",
      "$50,000 Account: Up to 3 Minis or 30 Micros",
      "$100,000 Account: Up to 7 Minis or 70 Micros",
      "$150,000 Account: Up to 10 Minis or 100 Micros",
      "Direct Account",
      "$25,000 Account: Up to 1 Minis or 10 Micros",
      "$50,000 Account: Up to 3 Minis or 30 Micros",
      "$100,000 Account: Up to 6 Minis or 60 Micros",
      "$150,000 Account: Up to 9 Minis or 90 Micros"
    ],
    "aiSummary": "Hola Prime Futures, based in Hong Kong, was established in June 2025. The firm offers futures instruments and operates two program types, Instant and 1 Step. Supported trading platforms listed are Tradovate, Dx Futures, and NinjaTrader. Publicly listed reputation details show a 5/5 review score drawn from one review. Overall, Hola Prime Futures provides futures trading programs across multiple platforms and has one recorded review reporting a 5/5 score. The overview reflects only the fields..."
  },
  "lucid-trading": {
    "ceo": "AJ Campanella",
    "dateCreated": "Mar 2025",
    "trustPilot": 4.7,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 28
      },
      {
        "stars": 4,
        "count": 9
      },
      {
        "stars": 3,
        "count": 1
      },
      {
        "stars": 2,
        "count": 0
      },
      {
        "stars": 1,
        "count": 1
      }
    ],
    "challenges": [
      {
        "name": "Lucid Trading - LucidDirect - Instant - 150K",
        "price": "$588.00",
        "original": "$840.00"
      },
      {
        "name": "Lucid Trading - LucidDirect - Instant - 100K",
        "price": "$490.00",
        "original": "$700.00"
      },
      {
        "name": "Lucid Trading - LucidDirect - Instant - 50K",
        "price": "$364.00",
        "original": "$520.00"
      },
      {
        "name": "Lucid Trading - LucidDirect - Instant - 25K",
        "price": "$238.00",
        "original": "$340.00"
      },
      {
        "name": "Lucid Trading - LucidFlex 1-Step - 150K",
        "price": "$252.00",
        "original": "$420.00"
      },
      {
        "name": "Lucid Trading - LucidFlex 1-Step - 100K",
        "price": "$135.00",
        "original": "$225.00"
      },
      {
        "name": "Lucid Trading - LucidFlex 1-Step - 50K",
        "price": "$84.00",
        "original": "$140.00"
      },
      {
        "name": "Lucid Trading - LucidFlex 1-Step - 25K",
        "price": "$60.00",
        "original": "$100.00"
      },
      {
        "name": "Lucid Trading - LucidPro 1-Step - 150K",
        "price": "$222.00",
        "original": "$370.00"
      },
      {
        "name": "Lucid Trading - LucidPro 1-Step - 100K",
        "price": "$171.00",
        "original": "$285.00"
      }
    ],
    "leverage": [
      "Max contract size",
      "$25k - 2 minis or 20 micros",
      "$50k - 4 minis or 40 micros",
      "$100k - 6 minis or 60 micros",
      "$150k - 10 minis or 100 micros"
    ],
    "aiSummary": "Lucid Trading, based in the United States, was established in March 2025. It offers futures trading and operates two program types: Instant and 1 Step. Supported platforms include Bookmap, Sierra Chart, MotiveWave, Jigsaw Daytradr, MultiCharts, Quantower, R Trader Pro, Tradovate, NinjaTrader, ATAS Orderflow Trading, and Tradesea Tradingview. Tradable instruments are futures. The firm has a review score of 4.6/5 based on 39 reviews. Overall, Lucid Trading provides a futures-focused prop trading..."
  },
  "my-funded-futures": {
    "ceo": "Matthew Leech",
    "dateCreated": "Nov 2023",
    "trustPilot": 4.9,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 154
      },
      {
        "stars": 4,
        "count": 56
      },
      {
        "stars": 3,
        "count": 8
      },
      {
        "stars": 2,
        "count": 1
      },
      {
        "stars": 1,
        "count": 6
      }
    ],
    "challenges": [
      {
        "name": "My Funded Futures - Builder - 1-Step - 50K",
        "price": "$91.80",
        "original": "$153.00"
      },
      {
        "name": "My Funded Futures - Rapid - 1-Step - 25K",
        "price": "$87.20",
        "original": "$109.00"
      },
      {
        "name": "My Funded Futures - Flex - 1-Step - 25K",
        "price": "$49.00",
        "original": "$84.00"
      },
      {
        "name": "My Funded Futures - Rapid - 1-Step - 150K",
        "price": "$277.60",
        "original": "$347.00"
      },
      {
        "name": "My Funded Futures - Rapid - 1-Step - 100K",
        "price": "$213.60",
        "original": "$267.00"
      },
      {
        "name": "My Funded Futures - Rapid - 1-Step - 50K",
        "price": "$125.60",
        "original": "$157.00"
      },
      {
        "name": "My Funded Futures - Pro - 1-Step - 150K",
        "price": "$238.50",
        "original": "$477.00"
      },
      {
        "name": "My Funded Futures - Pro - 1-Step - 100K",
        "price": "$172.00",
        "original": "$344.00"
      },
      {
        "name": "My Funded Futures - Pro - 1-Step - 50K",
        "price": "$113.50",
        "original": "$227.00"
      },
      {
        "name": "My Funded Futures - Flex - 1-Step - 50K",
        "price": "$127.00"
      }
    ],
    "leverage": [
      "Max Contract Size Allowed per Account Size",
      "Flex",
      "$25,000 Account: Up to 3 Minis or 30 Micros",
      "$50,000 Account: Up to 5 Minis or 50 Micros",
      "Pro",
      "$50,000 Account: Up to 3 Minis or 30 Micros",
      "$100,000 Account: Up to 6 Minis or 60 Micros",
      "$150,000 Account: Up to 9 Minis or 90 Micros",
      "Rapid",
      "$25,000 Account: Up to 3 Minis or 30 Micros",
      "$50,000 Account: Up to 5 Minis or 50 Micros",
      "$100,000 Account: Up to 10 Minis or 100 Micros"
    ],
    "consistencyRules": [
      {
        "program": "Rapid",
        "rule": "A trader's profit on any single day cannot exceed 50% of the total profit in the challange stage. No consistency on funded."
      },
      {
        "program": "Pro",
        "rule": "A trader's profit on any single day cannot exceed 50% of the total profit in the challange stage. No consistency on funded. (No consistency rule in the challenge and funded phase of the 50k Add-on)"
      },
      {
        "program": "Flex",
        "rule": "A trader's profit on any single day cannot exceed 50% of the total profit in the challange stage. No consistency on funded."
      },
      {
        "program": "Builder",
        "rule": "A trader's profit on any single day cannot exceed 50% of the total profit in the Funded stage. No consistency on Challenge."
      }
    ],
    "aiSummary": "My Funded Futures, based in the United States and established in November 2023, offers futures trading through a 1 Step program. Account sizes range from $50,000 to $150,000. Supported platforms include TradingView, Quantower, Volbook, Volsys, Tradovate, Volumetrica Trading, NinjaTrader and ATAS Orderflow Trading. The firm lists tradable futures across exchanges such as CME, CBOT, COMEX and NYMEX, and provides leverage options by asset class: currencies 1:100, indices 1:20, metals (gold 1:80,..."
  },
  "take-profit-trader": {
    "ceo": "James Sixsmith",
    "dateCreated": "Mar 2021",
    "trustPilot": 4.4,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 5
      },
      {
        "stars": 4,
        "count": 4
      },
      {
        "stars": 3,
        "count": 1
      },
      {
        "stars": 2,
        "count": 0
      },
      {
        "stars": 1,
        "count": 7
      }
    ],
    "challenges": [
      {
        "name": "TakeProfitTrader - 1-Step Test - 150K",
        "price": "$180.00",
        "original": "$360.00"
      },
      {
        "name": "TakeProfitTrader - 1-Step Test - 100K",
        "price": "$165.00",
        "original": "$330.00"
      },
      {
        "name": "TakeProfitTrader - 1-Step Test - 75K",
        "price": "$122.50",
        "original": "$245.00"
      },
      {
        "name": "TakeProfitTrader - 1-Step Test - 50K",
        "price": "$85.00",
        "original": "$170.00"
      },
      {
        "name": "TakeProfitTrader - 1-Step Test - 25K",
        "price": "$75.00",
        "original": "$150.00"
      }
    ],
    "leverage": [
      "Leverage: Maximum Contracts Allowed per Account Size",
      "$25K: 3 Contracts / 30 Micros",
      "$50K: 6 Contracts / 60 Micros",
      "$75K: 9 Contracts / 90 Micros",
      "$100K: 12 Contracts / 120 Micros",
      "$150K: 15 Contracts / 150 Micros"
    ]
  },
  "the-trading-pit-futures": {
    "ceo": "Daniela Egli",
    "dateCreated": "Oct 2022",
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 2
      },
      {
        "stars": 4,
        "count": 0
      },
      {
        "stars": 3,
        "count": 0
      },
      {
        "stars": 2,
        "count": 0
      },
      {
        "stars": 1,
        "count": 0
      }
    ],
    "challenges": [
      {
        "name": "The Trading Pit - Futures Prime - 1-Phase Evaluation - 1-Step 50K",
        "price": "$69.30",
        "original": "$99.00"
      },
      {
        "name": "The Trading Pit - Futures Prime - 1-Phase Evaluation - 1-Step 150K",
        "price": "$202.30",
        "original": "$289.00"
      },
      {
        "name": "The Trading Pit - Futures Prime - 1-Phase Evaluation - 1-Step 100K",
        "price": "$132.30",
        "original": "$189.00"
      }
    ],
    "leverage": [
      "Leverage: Maximum Contract Size Allowed per Account Size",
      "The Trading Pit - Futures Prime",
      "$50k Account: 5 Contracts / 50 Micros",
      "$100k Account: 10 Contracts / 100 Micros",
      "$150k Account: 15 Contracts / 150 Micros"
    ],
    "aiSummary": "The Trading Pit Futures, based in Liechtenstein, was established in October 2022. The firm lists Futures, Forex, indices, commodities, cryptocurrencies and shares as tradable instruments and offers 1 Step and 2 Steps program types. Account sizes range from $10,000 to $100,000. Supported platforms include TradingView, Quantower, R Trader Pro, Volsys, Tradovate, R Trader, NinjaTrader, ATAS Orderflow Trading, MetaTrader 4 (MT4), MetaTrader 5 (MT5) and Bookmap. When trading MT4 with GBE, leverage..."
  },
  "top-one-futures": {
    "ceo": "Matt Morris",
    "dateCreated": "Apr 2025",
    "trustPilot": 4.8,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 59
      },
      {
        "stars": 4,
        "count": 10
      },
      {
        "stars": 3,
        "count": 0
      },
      {
        "stars": 2,
        "count": 0
      },
      {
        "stars": 1,
        "count": 3
      }
    ],
    "challenges": [
      {
        "name": "Top One Futures - Elite Access - 1-Step - 150K",
        "price": "$39.00"
      },
      {
        "name": "Top One Futures - Elite Access - 1-Step - 100K",
        "price": "$39.00"
      },
      {
        "name": "Top One Futures - Elite Access - 1-Step - 50K",
        "price": "$39.00"
      },
      {
        "name": "Top One Futures - Elite Access - 1-Step - 25K",
        "price": "$39.00"
      },
      {
        "name": "Top One Futures - Ignite - Instant Funding - 150K",
        "price": "$319.60",
        "original": "$799.00"
      },
      {
        "name": "Top One Futures - Ignite - Instant Funding - 100K",
        "price": "$225.20",
        "original": "$563.00"
      },
      {
        "name": "Top One Futures - Ignite - Instant Funding - 50K",
        "price": "$159.20",
        "original": "$398.00"
      },
      {
        "name": "Top One Futures - Ignite - Instant Funding - 25K",
        "price": "$87.20",
        "original": "$218.00"
      },
      {
        "name": "Top One Futures - Instant Sim Funded - Instant - 150K",
        "price": "$375.60",
        "original": "$939.00"
      },
      {
        "name": "Top One Futures - Instant Sim Funded - Instant - 100K",
        "price": "$328.40",
        "original": "$821.00"
      }
    ],
    "leverage": [
      "$25,000 Account – Up to 1 Mini Contract (or 10 Micro Contracts)",
      "$50,000 Account – Up to 3 Mini Contracts (or 30 Micro Contracts)",
      "$100,000 Account – Up to 5 Mini Contracts (or 50 Micro Contracts)",
      "$150,000 Account – Up to 7 Mini Contracts (or 70 Micro Contracts)"
    ],
    "aiSummary": "Top One Futures, based in the United States and established in April 2025, provides futures trading via a 1 Step program and supports TradingView, Tradovate, and NinjaTrader platforms for traders. The firm lists futures as its tradable instrument and designates its program type as 1 Step. In published materials the firm shows a review score of 4.7 out of 5 compiled from 72 reviews. Overall, Top One Futures operates a futures-focused single-step program with multiple platform integrations and an..."
  },
  "topstep": {
    "ceo": "Michael Patak",
    "dateCreated": "Jan 2012",
    "trustPilot": 3.4,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 80
      },
      {
        "stars": 4,
        "count": 23
      },
      {
        "stars": 3,
        "count": 6
      },
      {
        "stars": 2,
        "count": 1
      },
      {
        "stars": 1,
        "count": 5
      }
    ],
    "challenges": [
      {
        "name": "Topstep - No Activation Fee - 1-Step 150K",
        "price": "$229.00"
      },
      {
        "name": "Topstep - No Activation Fee - 1-Step 100K",
        "price": "$149.00"
      },
      {
        "name": "Topstep - No Activation Fee - 1-Step 50K",
        "price": "$95.00"
      },
      {
        "name": "Topstep - Standard - 1-Step 150K",
        "price": "$149.00"
      },
      {
        "name": "Topstep - Standard - 1-Step 50K",
        "price": "$49.00"
      },
      {
        "name": "Topstep - Standard - 1-Step 100K",
        "price": "$99.00"
      }
    ],
    "leverage": [
      "Leverage = Maximum Contracts Allowed per Account Size"
    ],
    "consistencyRules": [
      {
        "program": "Combine",
        "rule": "A trader's profit on any single day cannot exceed 50% of the total profit. (Challenge)"
      },
      {
        "program": "Express Funded Standard Path",
        "rule": "No consistency (Funded)"
      },
      {
        "program": "Express Funded Consistency Path",
        "rule": "A trader's profit on any single day cannot exceed 40% of the total profit. (Funded)"
      }
    ],
    "aiSummary": "Topstep, based in the United States and established in January 2012, offers futures trading through a 1 Step program. Account sizes range from $50,000 to $150,000. Platforms supported include TopstepX, NinjaTrader, Quantower, T4, R Trader Pro, Atas Orderflow Trading, MotiveWave, VolFix, Bookmap, Investor/RT, Jigsaw, Daytradr, MultiCharts, Sierra Chart, and Trade Navigator. Tradable instruments include CME equity futures (E-mini S&P 500 ES, Micro E-mini S&P MES, E-mini NASDAQ 100 NQ, Micro..."
  },
  "tradeday": {
    "ceo": "James Thorpe",
    "dateCreated": "Jan 2020",
    "trustPilot": 4.6,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 9
      },
      {
        "stars": 4,
        "count": 2
      },
      {
        "stars": 3,
        "count": 0
      },
      {
        "stars": 2,
        "count": 0
      },
      {
        "stars": 1,
        "count": 0
      }
    ],
    "challenges": [
      {
        "name": "TradeDay - $150K Static Evaluation - 1-Step - 150K",
        "price": "$245.00",
        "original": "$350.00"
      },
      {
        "name": "TradeDay - $100K Static Evaluation - 1-Step - 100K",
        "price": "$175.00",
        "original": "$250.00"
      },
      {
        "name": "TradeDay - $50K Static Evaluation - 1-Step - 50K",
        "price": "$115.50",
        "original": "$165.00"
      },
      {
        "name": "TradeDay - $150K Intraday Evaluation - 1-Step - 150K",
        "price": "$210.00",
        "original": "$300.00"
      },
      {
        "name": "TradeDay - $100K Intraday Evaluation - 1-Step - 100K",
        "price": "$140.00",
        "original": "$200.00"
      },
      {
        "name": "TradeDay - $50K Intraday Evaluation - 1-Step - 50K",
        "price": "$87.50",
        "original": "$125.00"
      },
      {
        "name": "TradeDay - $50K EOD Evaluation - 1-Step - 50K",
        "price": "$122.50",
        "original": "$175.00"
      },
      {
        "name": "TradeDay - $150K EOD Evaluation - 1-Step - 150K",
        "price": "$262.50",
        "original": "$375.00"
      },
      {
        "name": "TradeDay - $100K EOD Evaluation - 1-Step - 100K",
        "price": "$192.50",
        "original": "$275.00"
      }
    ],
    "leverage": [
      "Max Contract Size Allowed per Account Size on All Plans",
      "$50,000 Account: Up to 5 Minis or 50 Micros",
      "$100,000 Account: Up to 10 Minis or 100 Micros",
      "$150,000 Account: Up to 15 Minis or 150 Micros"
    ],
    "aiSummary": "TradeDay, a proprietary trading firm based in the United States and established in January 2020, offers Futures trading through a 1 Step program. Account sizes range from $10,000 to $250,000. Supported platforms include TradingView, Jigsaw Daytradr, Tradovate, TradeDayX, and NinjaTrader. The firm provides access to Futures on major exchanges including CME, CBOT, NYMEX, and COMEX. TradeDay has a review score of 4.8/5 based on 11 reviews. The firm operates a straightforward, single-step..."
  },
  "tradeify": {
    "ceo": "Brett Simberkoff",
    "dateCreated": "Jun 2024",
    "trustPilot": 4.6,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 127
      },
      {
        "stars": 4,
        "count": 22
      },
      {
        "stars": 3,
        "count": 2
      },
      {
        "stars": 2,
        "count": 1
      },
      {
        "stars": 1,
        "count": 3
      }
    ],
    "challenges": [
      {
        "name": "Tradeify - Select Daily - 1-Step 25K",
        "price": "$65.40",
        "original": "$109.00"
      },
      {
        "name": "Tradeify - Select Flex - 1-Step 25K",
        "price": "$65.40",
        "original": "$109.00"
      },
      {
        "name": "Tradeify - Growth Plan - 1-Step 25K",
        "price": "$59.40",
        "original": "$99.00"
      },
      {
        "name": "Tradeify - Select Flex - 1-Step 150K",
        "price": "$221.40",
        "original": "$369.00"
      },
      {
        "name": "Tradeify - Select Flex - 1-Step 100K",
        "price": "$159.00",
        "original": "$265.00"
      },
      {
        "name": "Tradeify - Select Flex - 1-Step 50K",
        "price": "$99.00",
        "original": "$165.00"
      },
      {
        "name": "Tradeify - Select Daily - 1-Step 150K",
        "price": "$221.40",
        "original": "$369.00"
      },
      {
        "name": "Tradeify - Select Daily - 1-Step 100K",
        "price": "$159.00",
        "original": "$265.00"
      },
      {
        "name": "Tradeify - Select Daily - 1-Step 50K",
        "price": "$99.00",
        "original": "$165.00"
      },
      {
        "name": "Tradeify - Lightning Funded Plan - Instant 150K",
        "price": "$477.60",
        "original": "$796.00"
      }
    ],
    "leverage": [
      "For Growth, Select, and Lightning Funded:",
      "$25k Accounts: Up to 1 Contract (10 micros)",
      "$50k Accounts: Up to 4 Contracts (40 Micros)",
      "$100k Accounts: Up to 8 Contracts (80 Micros)",
      "$150k Accounts: Up to 12 Contracts (120 Micros)"
    ],
    "consistencyRules": [
      {
        "program": "Consistency Rule of 35%",
        "rule": "Applies to all Growth Sim funded accounts the maximum profit made in a single trading day cannot exceed 35% of the total Profit."
      },
      {
        "program": "Consistency Rule of 20%",
        "rule": "For all Lightning Funded accounts, the maximum profit in a single trading day cannot exceed 20% for 1st payout, 25% for the 2nd, and 30% from the 3rd onward."
      },
      {
        "program": "Consistency Rule of 40%",
        "rule": "For all Select accounts, the maximum profit in a single trading day cannot exceed 40% during the Evaluation Phase"
      }
    ],
    "aiSummary": "Tradeify, based in the United States, was established in June 2024. The firm offers futures trading and provides two program types: 1 Step and Instant. Platforms supported include Sierra Chart, TradingView, Quantower, Rithmic, Tradovate, WealthCharts, NinjaTrader, and Tradesea Tradingview, as listed by the firm. Tradeify’s public review score is 4.7 out of 5 based on 155 reviews. Tradeify operates as a futures-focused proprietary trading firm offering 1 Step and Instant programs accessible via..."
  },
  "traders-launch": {
    "ceo": "Max Thomas",
    "dateCreated": "Aug 2023",
    "trustPilot": 4.7,
    "reviewsBreakdown": [
      {
        "stars": 5,
        "count": 12
      },
      {
        "stars": 4,
        "count": 7
      },
      {
        "stars": 3,
        "count": 0
      },
      {
        "stars": 2,
        "count": 0
      },
      {
        "stars": 1,
        "count": 0
      }
    ],
    "challenges": [
      {
        "name": "Traders Launch - Futures Evaluation - Full - 80% Profit Split - 1-Step 300K",
        "price": "$509.15",
        "original": "$599.00"
      },
      {
        "name": "Traders Launch - Futures Evaluation - Full - 80% Profit Split - 1-Step 200K",
        "price": "$254.15",
        "original": "$299.00"
      },
      {
        "name": "Traders Launch - Futures Evaluation - Full - 80% Profit Split - 1-Step 100K",
        "price": "$135.15",
        "original": "$159.00"
      },
      {
        "name": "Traders Launch - Futures Evaluation - Full - 55% Profit Split - 1-Step 300K",
        "price": "$254.15",
        "original": "$299.00"
      },
      {
        "name": "Traders Launch - Futures Evaluation - Full - 55% Profit Split - 1-Step 200K",
        "price": "$126.65",
        "original": "$149.00"
      },
      {
        "name": "Traders Launch - Futures Evaluation - Full - 55% Profit Split - 1-Step 100K",
        "price": "$67.15",
        "original": "$79.00"
      },
      {
        "name": "Traders Launch - Futures Evaluation - NYC - 80% Profit Split - 1-Step 300K",
        "price": "$237.15",
        "original": "$279.00"
      },
      {
        "name": "Traders Launch - Futures Evaluation - NYC - 55% Profit Split - 1-Step 300K",
        "price": "$118.15",
        "original": "$139.00"
      },
      {
        "name": "Traders Launch - Futures Evaluation - NYC - 55% Profit Split - 1-Step 200K",
        "price": "$62.90",
        "original": "$74.00"
      },
      {
        "name": "Traders Launch - Futures Evaluation - NYC - 55% Profit Split - 1-Step 100K",
        "price": "$41.65",
        "original": "$49.00"
      }
    ],
    "leverage": [
      "Leverage: Maximum Contract Size per Account:",
      "NYC Schedule",
      "100K - 5 Micro",
      "200K - 1 Mini or 10 Micro",
      "300K - 2 Mini or 20 Micro",
      "Full Schedule",
      "100K - 2 Mini or 20 Micro",
      "200K - 4 Mini or 40 Micro",
      "300K - 6 Mini or 60 Micro"
    ],
    "aiSummary": "Traders Launch, based in the United States, was established in August 2023. The firm offers Futures instruments and a 1 Step program. Account sizes range from $5,000 to $100,000. Platforms supported include Quantower, Volumetrica Trading, IBKR and NinjaTrader. Tradable instruments referenced in the provided details include ETFs, roughly 300 liquid stocks, and Index ETF equivalents such as SPX (SPY), NDX (QQQ), US30 (DIA) and Gold (GLD). Traders Launch has a review score of 4.6/5 based on 19..."
  }
};

  for (const f of firms) {
    const e = ENRICHMENT[f.slug];
    if (!e) continue;
    if (e.ceo && !f.ceo) f.ceo = e.ceo;
    if (e.dateCreated && !f.dateCreated) f.dateCreated = e.dateCreated;
    if (e.trustPilot != null && !f.trustPilot) f.trustPilot = e.trustPilot;
    if (e.reviewsBreakdown && !f.reviewsBreakdown) f.reviewsBreakdown = e.reviewsBreakdown;
    if (e.challenges?.length && (!f.challenges || f.challenges.length < e.challenges.length)) f.challenges = e.challenges;
    if (e.leverage?.length && (!f.leverage || f.leverage.length < e.leverage.length)) f.leverage = e.leverage;
    if (e.consistencyRules?.length && !f.consistencyRules) f.consistencyRules = e.consistencyRules;
    if (e.aiSummary && e.aiSummary.length > 80) f.aiSummary = e.aiSummary;
    if (!f.totalReviews) f.totalReviews = f.reviews;
  }
  
export const findFirm = (slug: string) => firms.find(f => f.slug === slug);
