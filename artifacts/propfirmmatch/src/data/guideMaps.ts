// 攻略的「比喻 + 迷你思维导图」表达（原则 B）。
// 不再给小白一堵长文：一句大白话比喻 + 几个「你要做什么」节点 + 一条红线提醒。
// 与 guides.ts 的 slug 对应；想看原文细节的仍可展开 guides.ts 的 body。

export interface GuideMapNode {
  label: string;   // 这一步/这一点是什么
  action: string;  // 你要做什么 / 你能得到什么
}

export interface GuideMap {
  analogy: string;        // 一句比喻
  nodes: GuideMapNode[];  // 迷你导图节点
  redline?: string;       // ⚠ 红线/风险
  tip?: string;           // 小贴士
}

export const guideMaps: Record<string, GuideMap> = {
  "what-is-futures-prop-firm": {
    analogy: "像餐厅出钱出锅、你出厨艺——菜卖出去，利润分你大头，亏了算店里的。",
    nodes: [
      { label: "交一笔报名费", action: "买到一个「考试账户」，不用自己掏交易本金" },
      { label: "在模拟环境达标", action: "完成盈利目标、别踩规则" },
      { label: "通过后拿真实资金", action: "公司出钱你操盘，利润 80%–90% 归你" },
    ],
    redline: "不保证赚钱；考不过只损失报名费，亏的不是你的本金。",
  },
  "drawdown-rules": {
    analogy: "回撤线就是游戏血条——掉到红线，直接 Game Over，报名费不退。",
    nodes: [
      { label: "EOD 日终", action: "按每天收盘算血量：日内可浮亏，收盘前拉回就行" },
      { label: "TDD 实时", action: "实时算、碰到就死：全程别让浮亏超线" },
      { label: "静态", action: "血线固定：赚再多红线不动" },
      { label: "追踪", action: "赢了血线跟着抬：别大幅回吐利润" },
    ],
    redline: "签约前先查清你这家是哪种回撤；每笔单先挂硬止损。",
  },
  "consistency-rule": {
    analogy: "不能靠一把梭哈通关——得细水长流，像考试不能只有一题满分其余空白。",
    nodes: [
      { label: "单笔别太肥", action: "单笔盈利通常要 ≤ 总盈利的 30%–50%" },
      { label: "分批进出", action: "别重仓博一把，分批建仓分批止盈" },
      { label: "稳定频率", action: "每天交易笔数别忽多忽少，指标自然达标" },
    ],
    tip: "部分平台（如 Alpha、Apex）不设一致性规则，适合有成熟策略的人。",
  },
  "intraday-liquidation": {
    analogy: "别把仓位留过夜——怕半夜出大新闻暴雷，平台和你都受伤。",
    nodes: [
      { label: "收盘前清仓", action: "美东 16:00 前平掉所有头寸" },
      { label: "提前收手", action: "收盘前 1 小时就停开新仓，别最后搏一把" },
      { label: "挑好时段", action: "专注流动性最好的时段，设个提醒" },
    ],
  },
  "kyc-guide": {
    analogy: "出金前的「实名安检」——先证明「你是你」，才放你拿钱。",
    nodes: [
      { label: "备三样材料", action: "身份证明 + 地址证明 + （部分）支付证明" },
      { label: "中国用户提示", action: "护照通常比身份证好过；姓名拼音和平台注册一致" },
      { label: "提前准备", action: "注册时就扫描好，别等出金时才手忙脚乱" },
    ],
    redline: "姓名/地址不一致是最常见的被卡原因。",
  },
  "low-cost-path": {
    analogy: "先打新手村再上大号——一上来别冲大账户。",
    nodes: [
      { label: "① 免费模拟", action: "用 Tradovate 免费练手，熟悉规则（0 成本）" },
      { label: "② 小号试水", action: "$49–$99 的小账户体验真实考核环境" },
      { label: "③ 标准号冲", action: "$150–$350 正式挑战拿资金账户" },
    ],
    redline: "只投亏得起的钱；不要追「包过 / 稳赚」承诺。",
  },
  "tradovate-guide": {
    analogy: "网页版交易软件，打开就能用、免安装——新手最常用的入门工具。",
    nodes: [
      { label: "注册 + 2FA", action: "用平台给的凭据登录，首次设二次验证" },
      { label: "认识界面", action: "左报价 · 中图表 · 右订单簿 · 底账户" },
      { label: "先练模拟", action: "把市价/限价/止损单练熟再上真号" },
    ],
  },
  "rithmic-guide": {
    analogy: "它不是界面，是底层的「数据高速路」——配合 NinjaTrader 等软件用。",
    nodes: [
      { label: "拿账号", action: "通过 Prop Firm 获取 Rithmic 账户" },
      { label: "接到软件", action: "在 NinjaTrader / Quantower 里配置 Rithmic 连接" },
      { label: "排查连接", action: "连不上先查账户状态、数据订阅、防火墙" },
    ],
  },
  "wise-payout": {
    analogy: "Wise 是个能收美元的「国际钱包」——到账快、费率低，特别适合国内。",
    nodes: [
      { label: "注册 + KYC", action: "拿到你的美元收款账号信息" },
      { label: "填进平台后台", action: "选 Bank Transfer/ACH，姓名必须完全一致" },
      { label: "等待到账", action: "通常 1–3 个工作日，汇率走中间价" },
    ],
    tip: "用不了 Wise 可考虑 Rise 或加密（USDT）。",
  },
  "w8-form-guide": {
    analogy: "一张表，跟美国税局说「我不是美国人」——不填会被白扣 30% 税。",
    nodes: [
      { label: "Part I 个人信息", action: "护照英文名 + 中国地址（拼音）+ 身份证号" },
      { label: "Part II 协定优惠", action: "勾 Yes，国家填 China、Article 14" },
      { label: "Part III 签字", action: "手写签名 + 当天日期" },
    ],
    tip: "表格有效期 3 年，信息变了要重交。",
  },
};
