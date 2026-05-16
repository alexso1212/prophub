export interface Leaf {
  text: string;
  tip?: string;
}

export interface Branch {
  label: string;
  leaves: Leaf[];
}

export interface OnboardingTree {
  root: string;
  branches: Branch[];
}

export const onboardingTree: OnboardingTree = {
  root: "全球 200+ 家自营交易公司，一站对比",
  branches: [
    {
      label: "这是什么",
      leaves: [
        { text: "用公司的资金交易", tip: "真实账户由公司出资" },
        { text: "你出策略和技术" },
        { text: "利润 80%–90% 归你", tip: "按合同比例打款" },
        { text: "公司抽 10%–20%", tip: "看你签的等级" },
      ],
    },
    {
      label: "怎么开始",
      leaves: [
        { text: "1. 报名考核", tip: "在公司官网付费报名" },
        { text: "2. 通过 7–30 天考核", tip: "盈利目标 + 不踩亏损线" },
        { text: "3. 拿真实账户操盘", tip: "电子合同 + 实盘交易" },
        { text: "4. 按月结算分成", tip: "USDT 或银行卡到账" },
      ],
    },
    {
      label: "怎么挑公司",
      leaves: [
        { text: "看报名费", tip: "$50–$1000 不等，看账户大小" },
        { text: "看考核规则", tip: "盈利目标 / 最大回撤 / 持仓时长" },
        { text: "看分成比例", tip: "通常 80%–90% 归你" },
        { text: "看出金记录", tip: "站内有近 30 天到账截图" },
      ],
    },
    {
      label: "我要花多少钱",
      leaves: [
        { text: "一次性报名费" },
        { text: "几十到几百美元" },
        { text: "不需要交易本金", tip: "你不用充值进账户" },
        { text: "考不过只损失报名费" },
      ],
    },
  ],
};
