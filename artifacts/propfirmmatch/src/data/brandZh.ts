export const BRAND_ZH: Record<string, string> = {
  "alpha-futures": "阿尔法期货",
  "apex-trader-funding": "顶点交易员资金",
  "aquafutures": "蓝鲸期货",
  "blueberry-futures": "蓝莓期货",
  "blue-guardian-futures": "蓝盾期货",
  "e8-futures": "E8 期货",
  "earn2trade": "学交易",
  "funded-futures-family": "签约期货家族",
  "fundednext-futures": "FundedNext 期货",
  "futureselite": "期货精英",
  "goat-funded-futures": "GOAT 签约期货",
  "hola-prime-futures": "Hola Prime 期货",
  "lucid-trading": "明朗交易",
  "my-funded-futures": "我的签约期货",
  "take-profit-trader": "止盈交易员",
  "the-trading-pit-futures": "交易者擂台",
  "top-one-futures": "头号期货",
  "topstep": "Topstep 期货",
  "tradeday": "交易日",
  "tradeify": "Tradeify 期货",
  "traders-launch": "交易员启航",
};

export function getBrandZh(slug: string): string | undefined {
  return BRAND_ZH[slug];
}
