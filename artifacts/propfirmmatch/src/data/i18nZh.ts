export const COUNTRY_ZH: Record<string, string> = {
  AE: "阿联酋",
  AU: "澳大利亚",
  GB: "英国",
  HK: "中国香港",
  IT: "意大利",
  LI: "列支敦士登",
  US: "美国",
};

export function countryZh(code: string, fallback?: string): string {
  return COUNTRY_ZH[code] || fallback || code;
}

export function medianZh(s: string): string {
  if (!s) return s;
  let out = s
    .replace(/\babout\s+/gi, "约 ")
    .replace(/\bover\s+/gi, "超过 ")
    .replace(/\bless than\s+/gi, "不到 ")
    .replace(/\bnearly\s+/gi, "近 ")
    .replace(/(\d+)\s*hours?\b/gi, "$1 小时")
    .replace(/(\d+)\s*days?\b/gi, "$1 天")
    .replace(/(\d+)\s*minutes?\b/gi, "$1 分钟")
    .replace(/(\d+)\s*weeks?\b/gi, "$1 周")
    .replace(/\bN\/A\b/gi, "暂无")
    .replace(/\bnone\b/gi, "暂无");
  return out;
}

const BRAND_TOKENS_PRESERVE = [
  "FundedNext", "My Funded Futures", "Funded Futures Family", "Goat Funded Futures",
  "Take Profit Trader", "Topstep", "TopOne Futures", "Top One Futures",
  "Lucid Trading", "LucidDirect", "Tradeify", "TradeDay", "Earn2Trade",
  "Apex Trader Funding", "Alpha Futures", "Aquafutures", "Blueberry Futures",
  "Blue Guardian Futures", "E8 Futures", "FutureSelite", "Hola Prime Futures",
  "The Trading Pit", "Traders Launch", "FundingPips",
];

export function programZh(name: string): string {
  if (!name) return name;
  const placeholders: string[] = [];
  let working = name;
  for (const brand of BRAND_TOKENS_PRESERVE) {
    const re = new RegExp(brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    working = working.replace(re, () => {
      const token = `\u0001${placeholders.length}\u0001`;
      placeholders.push(brand);
      return token;
    });
  }
  working = working
    .replace(/\b1-?Step\b/gi, "一阶段")
    .replace(/\b2-?Step\b/gi, "两阶段")
    .replace(/\b3-?Step\b/gi, "三阶段")
    .replace(/\bInstant\b/gi, "即时入金")
    .replace(/\bEvaluation\b/gi, "评估")
    .replace(/\bExpress\b/gi, "极速")
    .replace(/\bCombine\b/gi, "组合")
    .replace(/\bAccount\b/gi, "账户")
    .replace(/\bPlan\b/gi, "方案")
    .replace(/\bChallenge\b/gi, "挑战赛")
    .replace(/\bPro\b/gi, "专业版")
    .replace(/\bStandard\b/gi, "标准版");
  return working.replace(/\u0001(\d+)\u0001/g, (_m, i) => placeholders[Number(i)]);
}
