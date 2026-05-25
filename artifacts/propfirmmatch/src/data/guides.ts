// 攻略文章数据——从内容知识库 (content-knowledge-base/knowledge-base.json) 提取。
// body 为 Markdown，用 <MarkdownLite> 渲染。平台规则/费用以上游官网最新说明为准。

export type GuideCategory = "beginner" | "roadmap" | "software" | "payout" | "payment";

export interface Guide {
  id: string;
  title: string;
  slug: string;
  category: GuideCategory;
  difficulty: "beginner" | "intermediate" | "advanced";
  summary: string;
  body: string;
  relatedFirms: string[];
  sourceUrls: string[];
  lastUpdatedAt: string;
}

export const guides: Guide[] = [
  {
    "id": "1",
    "title": "什么是 Futures Prop Firm",
    "slug": "what-is-futures-prop-firm",
    "category": "beginner",
    "difficulty": "beginner",
    "summary": "全面介绍期货自营交易公司的运作模式和盈利逻辑",
    "body": "\n## 什么是 Futures Prop Firm\n\nFutures Prop Firm（期货自营交易公司）是一种为交易员提供资金账户的服务商。与传统期货交易不同，你不需要投入大量本金，而是通过支付挑战费用来获得一个评估账户。\n\n### 核心概念\n\n**评估账户 (Evaluation Account)**\n- 你需要在模拟环境中完成特定的盈利目标\n- 同时遵守回撤规则和一致性要求\n- 通过评估后获得真实资金账户\n\n**资金账户 (Funded Account)**\n- 通过评估后，平台提供真实交易资金\n- 你保留大部分利润（通常70%-100%）\n- 亏损由平台承担\n\n### 与 CFD Prop Firm 的区别\n\n| 维度 | Futures Prop Firm | CFD Prop Firm |\n|------|-------------------|---------------|\n| 交易标的 | 期货合约 | 差价合约 |\n| 监管 | 受CFTC/NFA监管 | 监管较宽松 |\n| 平台 | Tradovate, Rithmic 等 | MT4/MT5 |\n| 成本 | 通常更低 | 点差成本 |\n\n### 风险提示\n\nProp Firm 挑战账户不是投资建议，不保证收益或出金。挑战失败会损失报名费。\n    ",
    "relatedFirms": [
      "1",
      "2",
      "4",
      "5"
    ],
    "sourceUrls": [
      "https://www.cftc.gov/"
    ],
    "lastUpdatedAt": "2026-05-10"
  },
  {
    "id": "2",
    "title": "回撤规则详解",
    "slug": "drawdown-rules",
    "category": "beginner",
    "difficulty": "beginner",
    "summary": "EOD、TDD、静态回撤、追踪回撤的区别和应对策略",
    "body": "\n## 回撤规则详解\n\n回撤规则是 Prop Firm 评估中最重要的风险控制指标。理解不同类型的回撤机制对通过挑战至关重要。\n\n### EOD (End of Day) 回撤\n\n**定义**: 基于每日收盘权益计算的最大回撤\n\n**特点**:\n- 日内浮亏不触发回撤限制\n- 只有收盘后权益低于阈值才会触发\n- 适合日内交易策略\n\n**示例**:\n账户规模 $50,000，EOD 回撤 $2,500\n- 日内权益可跌至 $45,000\n- 收盘权益必须 ≥ $47,500\n\n### TDD (Trailing Daily Drawdown) 日内回撤\n\n**定义**: 基于日内最高权益的实时回撤限制\n\n**特点**:\n- 实时计算，触及即违规\n- 通常跟随最高权益点移动\n- 风险更严格\n\n### 静态回撤 (Static Drawdown)\n\n**定义**: 固定初始权益的回撤限制，不随盈利增加\n\n**示例**:\n初始 $50,000，静态回撤 $2,500\n- 无论盈利多少，回撤线固定在 $47,500\n- 盈利到 $55,000 后，回撤线仍在 $47,500\n\n### 追踪回撤 (Trailing Drawdown)\n\n**定义**: 回撤线随最高权益点移动\n\n**示例**:\n初始 $50,000，追踪回撤 $2,500\n- 盈利到 $55,000 后，回撤线移至 $52,500\n- 回撤空间始终保持 $2,500\n\n### 应对策略\n\n1. **了解你的回撤类型** - 不同平台规则差异很大\n2. **设置硬止损** - 永远不要无止损交易\n3. **分散风险** - 单笔交易风险控制在1-2%\n4. **避开高波动时段** - 新闻发布前后谨慎交易\n    ",
    "relatedFirms": [
      "1",
      "2",
      "4",
      "5",
      "10"
    ],
    "sourceUrls": [],
    "lastUpdatedAt": "2026-05-08"
  },
  {
    "id": "3",
    "title": "一致性规则解析",
    "slug": "consistency-rule",
    "category": "beginner",
    "difficulty": "intermediate",
    "summary": "为什么 Prop Firm 要求交易一致性，如何避免违规",
    "body": "\n## 一致性规则解析\n\n一致性规则（Consistency Rule）是 Prop Firm 用来筛选\"赌徒\"和\"交易员\"的重要机制。\n\n### 什么是一致性规则\n\n平台要求你的盈利不能过度集中在少数几笔交易中。通常要求：\n- 单笔盈利不超过总盈利的 30%-50%\n- 或每日盈利不超过总盈利的 40%\n\n### 为什么有这个规则\n\n1. **风险控制** - 防止靠运气通过挑战\n2. **可持续性** - 确保交易策略可复制\n3. **筛选机制** - 淘汰过度冒险的交易员\n\n### 如何避免违规\n\n**分散交易**:\n- 不要重仓博一把\n- 分批建仓，分批平仓\n- 保持交易频率稳定\n\n**记录分析**:\n- 每日检查盈利分布\n- 使用交易日志追踪一致性指标\n- 及时调整策略\n\n### 例外情况\n\n部分平台如 Alpha Futures、Apex 等不设置一致性规则，适合有成熟策略的交易员。\n    ",
    "relatedFirms": [
      "3",
      "10"
    ],
    "sourceUrls": [],
    "lastUpdatedAt": "2026-05-09"
  },
  {
    "id": "4",
    "title": "日内平仓要求",
    "slug": "intraday-liquidation",
    "category": "beginner",
    "difficulty": "beginner",
    "summary": "为什么大多数 Prop Firm 要求日内平仓",
    "body": "\n## 日内平仓要求\n\n绝大多数 Futures Prop Firm 要求交易员在收盘前平仓所有头寸。\n\n### 原因分析\n\n**风险控制**:\n- 避免隔夜跳空风险\n- 防止重大新闻事件导致巨额亏损\n- 保护平台资金安全\n\n**运营成本**:\n- 隔夜持仓需要额外保证金\n- 降低平台资金占用成本\n\n### 例外情况\n\n少数平台允许隔夜持仓，但通常有额外要求：\n- 更高的账户规模\n- 额外的保证金要求\n- 限制持仓品种\n\n### 应对策略\n\n1. **规划交易时间** - 在收盘前1小时停止开新仓\n2. **设置提醒** - 使用平台或软件提醒功能\n3. **选择合适时段** - 专注流动性最好的交易时段\n    ",
    "relatedFirms": [
      "1",
      "2",
      "4",
      "7"
    ],
    "sourceUrls": [],
    "lastUpdatedAt": "2026-05-07"
  },
  {
    "id": "5",
    "title": "KYC 流程指南",
    "slug": "kyc-guide",
    "category": "beginner",
    "difficulty": "beginner",
    "summary": "Prop Firm 身份验证流程和注意事项",
    "body": "\n## KYC 流程指南\n\nKYC (Know Your Customer) 是出金前的必要步骤，了解流程可以避免不必要的延误。\n\n### 常见要求\n\n**身份证明**:\n- 护照或身份证扫描件\n- 需要清晰显示姓名、照片、有效期\n\n**地址证明**:\n- 水电账单、银行对账单\n- 需显示姓名和地址，3个月内开具\n\n**支付验证**:\n- 部分平台要求验证支付方式\n- 信用卡/银行账户对账单\n\n### 中国用户特别提示\n\n**证件选择**:\n- 护照通常比身份证更容易通过\n- 确保所有信息清晰可读\n\n**地址证明**:\n- 信用卡账单（如有）\n- 水电费电子账单\n- 部分平台接受中文文件\n\n**常见问题**:\n- 姓名拼音不一致\n- 地址翻译问题\n- 文件格式不符合要求\n\n### 最佳实践\n\n1. **提前准备** - 注册时就准备好所有文件\n2. **高清扫描** - 确保文件清晰、完整\n3. **及时响应** - 平台要求补充材料时尽快处理\n    ",
    "relatedFirms": [
      "2",
      "4",
      "7"
    ],
    "sourceUrls": [],
    "lastUpdatedAt": "2026-05-11"
  },
  {
    "id": "6",
    "title": "低成本试错路径",
    "slug": "low-cost-path",
    "category": "roadmap",
    "difficulty": "beginner",
    "summary": "新手如何以最小成本探索 Prop Firm 交易",
    "body": "\n## 低成本试错路径\n\n对于刚接触 Prop Firm 的新手，建议按以下路径逐步探索。\n\n### 第一阶段：免费模拟 (0成本)\n\n**目标**: 熟悉平台和规则\n\n**行动**:\n- 注册 Tradovate 免费模拟账户\n- 练习期货基础操作\n- 了解合约规格和保证金要求\n\n**时间**: 2-4 周\n\n### 第二阶段：小账户试水 ($50-150)\n\n**推荐平台**:\n- Purdia ($49 Micro账户)\n- Alpha Futures ($99 Basic账户)\n\n**目标**: 体验真实挑战环境\n\n**注意**: 做好损失全部报名费的准备\n\n### 第三阶段：标准账户 ($150-350)\n\n**推荐平台**:\n- Topstep ($165/月)\n- Lucid Trading ($149 起)\n\n**目标**: 通过挑战获得资金账户\n\n### 风险控制原则\n\n1. **永远不要投入无法承受损失的资金**\n2. **先学习，再实战**\n3. **记录每笔交易，复盘总结**\n4. **不要追逐\"包过\"承诺**\n\n### 时间预期\n\n- 学习阶段: 1-3 个月\n- 通过挑战: 因人而异，可能需要多次尝试\n- 稳定盈利: 6-12 个月或更长\n\n**重要提示**: Prop Firm 不是快速致富的捷径，而是需要认真对待的专业活动。\n    ",
    "relatedFirms": [
      "3",
      "8",
      "4",
      "1"
    ],
    "sourceUrls": [],
    "lastUpdatedAt": "2026-05-10"
  },
  {
    "id": "7",
    "title": "Tradovate 使用教程",
    "slug": "tradovate-guide",
    "category": "software",
    "difficulty": "beginner",
    "summary": "最常用的 Prop Firm 交易平台 Tradovate 入门指南",
    "body": "\n## Tradovate 使用教程\n\nTradovate 是目前支持最多 Prop Firm 的交易平台，基于网页，无需安装。\n\n### 注册与登录\n\n1. 访问 tradovate.com\n2. 使用 Prop Firm 提供的登录凭据\n3. 首次登录需要设置 2FA\n\n### 界面布局\n\n**主要区域**:\n- 左侧: 报价列表和持仓\n- 中间: 图表区域\n- 右侧: 订单簿和成交记录\n- 底部: 账户信息和订单状态\n\n### 基础操作\n\n**下单**:\n- 点击图表右侧价格快速下单\n- 或使用订单面板精确设置\n- 支持市价单、限价单、止损单\n\n**图表设置**:\n- 支持多种图表类型 (K线、线形、面积)\n- 可添加技术指标\n- 支持多时间周期切换\n\n### 常用快捷键\n\n- Ctrl+T: 新建图表\n- Ctrl+F: 查找合约\n- Delete: 取消选中订单\n- Esc: 关闭弹窗\n\n### 常见问题\n\n**连接问题**:\n- 检查网络连接\n- 清除浏览器缓存\n- 尝试使用 Chrome 浏览器\n\n**数据延迟**:\n- 确保订阅了正确的数据流\n- 刷新页面重新连接\n\n### 进阶功能\n\n- 工作区保存\n- 多屏幕支持\n- API 交易接口\n    ",
    "relatedFirms": [
      "1",
      "2",
      "4",
      "7",
      "8",
      "10"
    ],
    "sourceUrls": [
      "https://tradovate.com/help"
    ],
    "lastUpdatedAt": "2026-05-12"
  },
  {
    "id": "8",
    "title": "Rithmic 连接指南",
    "slug": "rithmic-guide",
    "category": "software",
    "difficulty": "intermediate",
    "summary": "专业级交易数据平台 Rithmic 的配置和使用",
    "body": "\n## Rithmic 连接指南\n\nRithmic 提供专业级交易数据和执行服务，被多家 Prop Firm 采用。\n\n### 什么是 Rithmic\n\nRithmic 是期货行业的数据/交易基础设施提供商，提供：\n- 低延迟市场数据\n- 订单路由和执行\n- 多平台支持\n\n### 注册流程\n\n1. 通过 Prop Firm 获取 Rithmic 账户\n2. 下载 Rithmic 客户端或连接第三方软件\n3. 签署数据使用协议\n\n### 支持的软件\n\n- NinjaTrader\n- Quantower\n- ATAS\n- 自定义 API 应用\n\n### 连接配置\n\n**NinjaTrader**:\n1. 打开 NinjaTrader\n2. 选择 Connections > Configure\n3. 添加 Rithmic 连接\n4. 输入账户信息\n\n**Quantower**:\n1. 打开 Quantower\n2. 点击 Connections\n3. 选择 Rithmic\n4. 输入登录信息\n\n### 数据订阅\n\nRithmic 提供不同级别的数据订阅：\n- 基础数据 (免费)\n- 完整市场深度 (付费)\n- 历史数据 (额外付费)\n\n### 故障排查\n\n**连接失败**:\n- 检查账户状态\n- 确认数据订阅有效\n- 检查防火墙设置\n\n**数据延迟**:\n- 切换数据服务器\n- 检查网络质量\n- 联系 Prop Firm 支持\n    ",
    "relatedFirms": [
      "1",
      "2",
      "5",
      "9"
    ],
    "sourceUrls": [
      "https://rithmic.com/"
    ],
    "lastUpdatedAt": "2026-05-11"
  },
  {
    "id": "9",
    "title": "Wise 出金教程",
    "slug": "wise-payout",
    "category": "payout",
    "difficulty": "intermediate",
    "summary": "使用 Wise 接收 Prop Firm 出金的完整流程",
    "body": "\n## Wise 出金教程\n\nWise (原 TransferWise) 是许多 Prop Firm 支持的出金方式，适合中国用户。\n\n### 注册 Wise\n\n1. 访问 wise.com\n2. 使用邮箱注册账户\n3. 完成身份验证 (KYC)\n4. 获取美元账户信息\n\n### 获取账户信息\n\n**美元账户详情**:\n- Account Holder Name\n- Account Number\n- Routing Number (ACH)\n- Bank Name\n\n**重要**: 确保姓名与 Prop Firm 账户完全一致\n\n### 在 Prop Firm 添加出金方式\n\n1. 登录 Prop Firm 后台\n2. 找到 Payout/Withdrawal 选项\n3. 选择 Bank Transfer / ACH\n4. 输入 Wise 账户信息\n\n### 出金流程\n\n1. 达到最低出金门槛\n2. 提交出金申请\n3. 等待审核 (通常1-3工作日)\n4. 资金到达 Wise 账户\n\n### 费用说明\n\n**Wise 费用**:\n- 接收 ACH: 通常免费\n- 货币转换: 约 0.5%\n- 提现到国内银行: 固定费用 + 汇率差\n\n### 注意事项\n\n1. **姓名一致** - 必须与 Prop Firm 注册姓名完全一致\n2. **账户验证** - 确保 Wise 账户已完成验证\n3. **税务表格** - 部分平台需要 W-8BEN 表格\n4. **出金周期** - 了解平台的出金处理时间\n\n### 替代方案\n\n如果 Wise 不可用，可考虑：\n- Rise\n- Plane\n- Workmarket\n- 加密货币出金\n    ",
    "relatedFirms": [
      "2",
      "5",
      "10"
    ],
    "sourceUrls": [
      "https://wise.com/help/"
    ],
    "lastUpdatedAt": "2026-05-10"
  },
  {
    "id": "10",
    "title": "W-8BEN 表格填写指南",
    "slug": "w8-form-guide",
    "category": "payment",
    "difficulty": "intermediate",
    "summary": "非美国税务居民如何填写 W-8BEN 表格",
    "body": "\n## W-8BEN 表格填写指南\n\nW-8BEN 是美国国税局 (IRS) 的税务表格，用于证明你是非美国税务居民。\n\n### 为什么需要填写\n\n- 避免被预扣 30% 的美国税款\n- 符合中美税收协定 (如有)\n- 是出金的必要步骤\n\n### 填写步骤\n\n**Part I: Identification of Beneficial Owner**\n\n1. **Name** - 填写护照上的英文姓名\n2. **Country of Citizenship** - China\n3. **Permanent Residence Address** - 中国地址，用拼音\n4. **Mailing Address** - 可与上面相同\n5. **U.S. TIN** - 留空 (非美国居民没有)\n6. **Foreign TIN** - 中国身份证号\n7. **Reference Numbers** - 留空\n8. **Date of Birth** - 格式: MM-DD-YYYY\n\n**Part II: Claim of Tax Treaty Benefits**\n\n1. **Claiming treaty benefits?** - 勾选 Yes\n2. **Country** - China\n3. **Treaty Article** - 通常填写 \"Article 14\" (独立个人劳务)\n\n**Part III: Certification**\n\n- 签名\n- 填写日期\n\n### 提交方式\n\n**电子提交** (推荐):\n- 部分平台支持在线填写\n- 电子签名即可\n\n**纸质提交**:\n- 打印表格\n- 手写签名 (必须手写)\n- 扫描或拍照上传\n\n### 常见问题\n\n**有效期**:\n- 表格有效期 3 年\n- 信息变更需要重新提交\n\n**拒绝原因**:\n- 签名不是手写\n- 信息不完整\n- 地址格式不正确\n\n### 注意事项\n\n1. **如实填写** - 虚假信息可能导致法律问题\n2. **保留副本** - 保存提交的记录\n3. **及时更新** - 信息变更时重新提交\n    ",
    "relatedFirms": [
      "2",
      "4",
      "10"
    ],
    "sourceUrls": [
      "https://www.irs.gov/forms-pubs/about-form-w-8ben"
    ],
    "lastUpdatedAt": "2026-05-09"
  }
];
