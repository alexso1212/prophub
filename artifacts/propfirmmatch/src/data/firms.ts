export interface Platform {
  name: string;
  icon?: string;
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
  challenges?: { name: string; price: string; original?: string }[];
  offerDescription: string;
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

export const findFirm = (slug: string) => firms.find(f => f.slug === slug);
