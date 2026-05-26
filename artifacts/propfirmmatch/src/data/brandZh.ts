export const BRAND_ZH: Record<string, string> = {
  "alpha-futures": "英国一阶段期货评估",
  "apex-trader-funding": "美国老牌期货签约平台",
  "aquafutures": "美国期货自营新秀",
  "blueberry-futures": "澳洲期货签约方案",
  "blue-guardian-futures": "外汇老牌进军期货",
  "e8-futures": "捷克跨市场签约平台",
  "earn2trade": "美国交易员训练营",
  "funded-futures-family": "美国家庭式期货社群",
  "fundednext-futures": "外汇龙头期货新线",
  "futureselite": "高门槛期货精英计划",
  "goat-funded-futures": "美国期货低门槛计划",
  "hola-prime-futures": "阿联酋期货评估平台",
  "lucid-trading": "美国 2025 新晋期货",
  "my-funded-futures": "美国零回撤期货平台",
  "take-profit-trader": "美国快速出金期货",
  "the-trading-pit-futures": "瑞士跨资产签约平台",
  "top-one-futures": "美国期货实时签约",
  "topstep": "美国期货行业开创者",
  "tradeday": "美国期货实盘签约",
  "tradeify": "美国创新期货评估",
  "traders-launch": "新加坡多平台签约",
};

export function getBrandZh(slug: string): string | undefined {
  return BRAND_ZH[slug];
}
