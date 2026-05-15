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

export function programZh(name: string): string {
  if (!name) return name;
  return name
    .replace(/\b1-?Step\b/gi, "一阶段")
    .replace(/\b2-?Step\b/gi, "两阶段")
    .replace(/\b3-?Step\b/gi, "三阶段")
    .replace(/\bInstant\b/gi, "即时入金")
    .replace(/\bEvaluation\b/gi, "评估")
    .replace(/\bChallenge\b/gi, "挑战赛")
    .replace(/\bFunded\b/gi, "签约");
}
