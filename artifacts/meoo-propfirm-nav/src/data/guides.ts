import type { Guide } from '../types';

export const guidesData: Guide[] = [
  {
    id: '1',
    title: '什么是 Futures Prop Firm',
    slug: 'what-is-futures-prop-firm',
    category: 'beginner',
    difficulty: 'beginner',
    summary: '全面介绍期货自营交易公司的运作模式和盈利逻辑',
    body: `
## 什么是 Futures Prop Firm

Futures Prop Firm（期货自营交易公司）是一种为交易员提供资金账户的服务商。与传统期货交易不同，你不需要投入大量本金，而是通过支付挑战费用来获得一个评估账户。

### 核心概念

**评估账户 (Evaluation Account)**
- 你需要在模拟环境中完成特定的盈利目标
- 同时遵守回撤规则和一致性要求
- 通过评估后获得真实资金账户

**资金账户 (Funded Account)**
- 通过评估后，平台提供真实交易资金
- 你保留大部分利润（通常70%-100%）
- 亏损由平台承担

### 与 CFD Prop Firm 的区别

| 维度 | Futures Prop Firm | CFD Prop Firm |
|------|-------------------|---------------|
| 交易标的 | 期货合约 | 差价合约 |
| 监管 | 受CFTC/NFA监管 | 监管较宽松 |
| 平台 | Tradovate, Rithmic 等 | MT4/MT5 |
| 成本 | 通常更低 | 点差成本 |

### 风险提示

Prop Firm 挑战账户不是投资建议，不保证收益或出金。挑战失败会损失报名费。
    `,
    relatedFirms: ['1', '2', '4', '5'],
    sourceUrls: ['https://www.cftc.gov/'],
    lastUpdatedAt: '2026-05-10'
  },
  {
    id: '2',
    title: '回撤规则详解',
    slug: 'drawdown-rules',
    category: 'beginner',
    difficulty: 'beginner',
    summary: 'EOD、TDD、静态回撤、追踪回撤的区别和应对策略',
    body: `
## 回撤规则详解

回撤规则是 Prop Firm 评估中最重要的风险控制指标。理解不同类型的回撤机制对通过挑战至关重要。

### EOD (End of Day) 回撤

**定义**: 基于每日收盘权益计算的最大回撤

**特点**:
- 日内浮亏不触发回撤限制
- 只有收盘后权益低于阈值才会触发
- 适合日内交易策略

**示例**:
账户规模 $50,000，EOD 回撤 $2,500
- 日内权益可跌至 $45,000
- 收盘权益必须 ≥ $47,500

### TDD (Trailing Daily Drawdown) 日内回撤

**定义**: 基于日内最高权益的实时回撤限制

**特点**:
- 实时计算，触及即违规
- 通常跟随最高权益点移动
- 风险更严格

### 静态回撤 (Static Drawdown)

**定义**: 固定初始权益的回撤限制，不随盈利增加

**示例**:
初始 $50,000，静态回撤 $2,500
- 无论盈利多少，回撤线固定在 $47,500
- 盈利到 $55,000 后，回撤线仍在 $47,500

### 追踪回撤 (Trailing Drawdown)

**定义**: 回撤线随最高权益点移动

**示例**:
初始 $50,000，追踪回撤 $2,500
- 盈利到 $55,000 后，回撤线移至 $52,500
- 回撤空间始终保持 $2,500

### 应对策略

1. **了解你的回撤类型** - 不同平台规则差异很大
2. **设置硬止损** - 永远不要无止损交易
3. **分散风险** - 单笔交易风险控制在1-2%
4. **避开高波动时段** - 新闻发布前后谨慎交易
    `,
    relatedFirms: ['1', '2', '4', '5', '10'],
    sourceUrls: [],
    lastUpdatedAt: '2026-05-08'
  },
  {
    id: '3',
    title: '一致性规则解析',
    slug: 'consistency-rule',
    category: 'beginner',
    difficulty: 'intermediate',
    summary: '为什么 Prop Firm 要求交易一致性，如何避免违规',
    body: `
## 一致性规则解析

一致性规则（Consistency Rule）是 Prop Firm 用来筛选"赌徒"和"交易员"的重要机制。

### 什么是一致性规则

平台要求你的盈利不能过度集中在少数几笔交易中。通常要求：
- 单笔盈利不超过总盈利的 30%-50%
- 或每日盈利不超过总盈利的 40%

### 为什么有这个规则

1. **风险控制** - 防止靠运气通过挑战
2. **可持续性** - 确保交易策略可复制
3. **筛选机制** - 淘汰过度冒险的交易员

### 如何避免违规

**分散交易**:
- 不要重仓博一把
- 分批建仓，分批平仓
- 保持交易频率稳定

**记录分析**:
- 每日检查盈利分布
- 使用交易日志追踪一致性指标
- 及时调整策略

### 例外情况

部分平台如 Alpha Futures、Apex 等不设置一致性规则，适合有成熟策略的交易员。
    `,
    relatedFirms: ['3', '10'],
    sourceUrls: [],
    lastUpdatedAt: '2026-05-09'
  },
  {
    id: '4',
    title: '日内平仓要求',
    slug: 'intraday-liquidation',
    category: 'beginner',
    difficulty: 'beginner',
    summary: '为什么大多数 Prop Firm 要求日内平仓',
    body: `
## 日内平仓要求

绝大多数 Futures Prop Firm 要求交易员在收盘前平仓所有头寸。

### 原因分析

**风险控制**:
- 避免隔夜跳空风险
- 防止重大新闻事件导致巨额亏损
- 保护平台资金安全

**运营成本**:
- 隔夜持仓需要额外保证金
- 降低平台资金占用成本

### 例外情况

少数平台允许隔夜持仓，但通常有额外要求：
- 更高的账户规模
- 额外的保证金要求
- 限制持仓品种

### 应对策略

1. **规划交易时间** - 在收盘前1小时停止开新仓
2. **设置提醒** - 使用平台或软件提醒功能
3. **选择合适时段** - 专注流动性最好的交易时段
    `,
    relatedFirms: ['1', '2', '4', '7'],
    sourceUrls: [],
    lastUpdatedAt: '2026-05-07'
  },
  {
    id: '5',
    title: 'KYC 流程指南',
    slug: 'kyc-guide',
    category: 'beginner',
    difficulty: 'beginner',
    summary: 'Prop Firm 身份验证流程和注意事项',
    body: `
## KYC 流程指南

KYC (Know Your Customer) 是出金前的必要步骤，了解流程可以避免不必要的延误。

### 常见要求

**身份证明**:
- 护照或身份证扫描件
- 需要清晰显示姓名、照片、有效期

**地址证明**:
- 水电账单、银行对账单
- 需显示姓名和地址，3个月内开具

**支付验证**:
- 部分平台要求验证支付方式
- 信用卡/银行账户对账单

### 中国用户特别提示

**证件选择**:
- 护照通常比身份证更容易通过
- 确保所有信息清晰可读

**地址证明**:
- 信用卡账单（如有）
- 水电费电子账单
- 部分平台接受中文文件

**常见问题**:
- 姓名拼音不一致
- 地址翻译问题
- 文件格式不符合要求

### 最佳实践

1. **提前准备** - 注册时就准备好所有文件
2. **高清扫描** - 确保文件清晰、完整
3. **及时响应** - 平台要求补充材料时尽快处理
    `,
    relatedFirms: ['2', '4', '7'],
    sourceUrls: [],
    lastUpdatedAt: '2026-05-11'
  },
  {
    id: '6',
    title: '低成本试错路径',
    slug: 'low-cost-path',
    category: 'roadmap',
    difficulty: 'beginner',
    summary: '新手如何以最小成本探索 Prop Firm 交易',
    body: `
## 低成本试错路径

对于刚接触 Prop Firm 的新手，建议按以下路径逐步探索。

### 第一阶段：免费模拟 (0成本)

**目标**: 熟悉平台和规则

**行动**:
- 注册 Tradovate 免费模拟账户
- 练习期货基础操作
- 了解合约规格和保证金要求

**时间**: 2-4 周

### 第二阶段：小账户试水 ($50-150)

**推荐平台**:
- Purdia ($49 Micro账户)
- Alpha Futures ($99 Basic账户)

**目标**: 体验真实挑战环境

**注意**: 做好损失全部报名费的准备

### 第三阶段：标准账户 ($150-350)

**推荐平台**:
- Topstep ($165/月)
- Lucid Trading ($149 起)

**目标**: 通过挑战获得资金账户

### 风险控制原则

1. **永远不要投入无法承受损失的资金**
2. **先学习，再实战**
3. **记录每笔交易，复盘总结**
4. **不要追逐"包过"承诺**

### 时间预期

- 学习阶段: 1-3 个月
- 通过挑战: 因人而异，可能需要多次尝试
- 稳定盈利: 6-12 个月或更长

**重要提示**: Prop Firm 不是快速致富的捷径，而是需要认真对待的专业活动。
    `,
    relatedFirms: ['3', '8', '4', '1'],
    sourceUrls: [],
    lastUpdatedAt: '2026-05-10'
  },
  {
    id: '7',
    title: 'Tradovate 使用教程',
    slug: 'tradovate-guide',
    category: 'software',
    difficulty: 'beginner',
    summary: '最常用的 Prop Firm 交易平台 Tradovate 入门指南',
    body: `
## Tradovate 使用教程

Tradovate 是目前支持最多 Prop Firm 的交易平台，基于网页，无需安装。

### 注册与登录

1. 访问 tradovate.com
2. 使用 Prop Firm 提供的登录凭据
3. 首次登录需要设置 2FA

### 界面布局

**主要区域**:
- 左侧: 报价列表和持仓
- 中间: 图表区域
- 右侧: 订单簿和成交记录
- 底部: 账户信息和订单状态

### 基础操作

**下单**:
- 点击图表右侧价格快速下单
- 或使用订单面板精确设置
- 支持市价单、限价单、止损单

**图表设置**:
- 支持多种图表类型 (K线、线形、面积)
- 可添加技术指标
- 支持多时间周期切换

### 常用快捷键

- Ctrl+T: 新建图表
- Ctrl+F: 查找合约
- Delete: 取消选中订单
- Esc: 关闭弹窗

### 常见问题

**连接问题**:
- 检查网络连接
- 清除浏览器缓存
- 尝试使用 Chrome 浏览器

**数据延迟**:
- 确保订阅了正确的数据流
- 刷新页面重新连接

### 进阶功能

- 工作区保存
- 多屏幕支持
- API 交易接口
    `,
    relatedFirms: ['1', '2', '4', '7', '8', '10'],
    sourceUrls: ['https://tradovate.com/help'],
    lastUpdatedAt: '2026-05-12'
  },
  {
    id: '8',
    title: 'Rithmic 连接指南',
    slug: 'rithmic-guide',
    category: 'software',
    difficulty: 'intermediate',
    summary: '专业级交易数据平台 Rithmic 的配置和使用',
    body: `
## Rithmic 连接指南

Rithmic 提供专业级交易数据和执行服务，被多家 Prop Firm 采用。

### 什么是 Rithmic

Rithmic 是期货行业的数据/交易基础设施提供商，提供：
- 低延迟市场数据
- 订单路由和执行
- 多平台支持

### 注册流程

1. 通过 Prop Firm 获取 Rithmic 账户
2. 下载 Rithmic 客户端或连接第三方软件
3. 签署数据使用协议

### 支持的软件

- NinjaTrader
- Quantower
- ATAS
- 自定义 API 应用

### 连接配置

**NinjaTrader**:
1. 打开 NinjaTrader
2. 选择 Connections > Configure
3. 添加 Rithmic 连接
4. 输入账户信息

**Quantower**:
1. 打开 Quantower
2. 点击 Connections
3. 选择 Rithmic
4. 输入登录信息

### 数据订阅

Rithmic 提供不同级别的数据订阅：
- 基础数据 (免费)
- 完整市场深度 (付费)
- 历史数据 (额外付费)

### 故障排查

**连接失败**:
- 检查账户状态
- 确认数据订阅有效
- 检查防火墙设置

**数据延迟**:
- 切换数据服务器
- 检查网络质量
- 联系 Prop Firm 支持
    `,
    relatedFirms: ['1', '2', '5', '9'],
    sourceUrls: ['https://rithmic.com/'],
    lastUpdatedAt: '2026-05-11'
  },
  {
    id: '9',
    title: 'Wise 出金教程',
    slug: 'wise-payout',
    category: 'payout',
    difficulty: 'intermediate',
    summary: '使用 Wise 接收 Prop Firm 出金的完整流程',
    body: `
## Wise 出金教程

Wise (原 TransferWise) 是许多 Prop Firm 支持的出金方式，适合中国用户。

### 注册 Wise

1. 访问 wise.com
2. 使用邮箱注册账户
3. 完成身份验证 (KYC)
4. 获取美元账户信息

### 获取账户信息

**美元账户详情**:
- Account Holder Name
- Account Number
- Routing Number (ACH)
- Bank Name

**重要**: 确保姓名与 Prop Firm 账户完全一致

### 在 Prop Firm 添加出金方式

1. 登录 Prop Firm 后台
2. 找到 Payout/Withdrawal 选项
3. 选择 Bank Transfer / ACH
4. 输入 Wise 账户信息

### 出金流程

1. 达到最低出金门槛
2. 提交出金申请
3. 等待审核 (通常1-3工作日)
4. 资金到达 Wise 账户

### 费用说明

**Wise 费用**:
- 接收 ACH: 通常免费
- 货币转换: 约 0.5%
- 提现到国内银行: 固定费用 + 汇率差

### 注意事项

1. **姓名一致** - 必须与 Prop Firm 注册姓名完全一致
2. **账户验证** - 确保 Wise 账户已完成验证
3. **税务表格** - 部分平台需要 W-8BEN 表格
4. **出金周期** - 了解平台的出金处理时间

### 替代方案

如果 Wise 不可用，可考虑：
- Rise
- Plane
- Workmarket
- 加密货币出金
    `,
    relatedFirms: ['2', '5', '10'],
    sourceUrls: ['https://wise.com/help/'],
    lastUpdatedAt: '2026-05-10'
  },
  {
    id: '10',
    title: 'W-8BEN 表格填写指南',
    slug: 'w8-form-guide',
    category: 'payment',
    difficulty: 'intermediate',
    summary: '非美国税务居民如何填写 W-8BEN 表格',
    body: `
## W-8BEN 表格填写指南

W-8BEN 是美国国税局 (IRS) 的税务表格，用于证明你是非美国税务居民。

### 为什么需要填写

- 避免被预扣 30% 的美国税款
- 符合中美税收协定 (如有)
- 是出金的必要步骤

### 填写步骤

**Part I: Identification of Beneficial Owner**

1. **Name** - 填写护照上的英文姓名
2. **Country of Citizenship** - China
3. **Permanent Residence Address** - 中国地址，用拼音
4. **Mailing Address** - 可与上面相同
5. **U.S. TIN** - 留空 (非美国居民没有)
6. **Foreign TIN** - 中国身份证号
7. **Reference Numbers** - 留空
8. **Date of Birth** - 格式: MM-DD-YYYY

**Part II: Claim of Tax Treaty Benefits**

1. **Claiming treaty benefits?** - 勾选 Yes
2. **Country** - China
3. **Treaty Article** - 通常填写 "Article 14" (独立个人劳务)

**Part III: Certification**

- 签名
- 填写日期

### 提交方式

**电子提交** (推荐):
- 部分平台支持在线填写
- 电子签名即可

**纸质提交**:
- 打印表格
- 手写签名 (必须手写)
- 扫描或拍照上传

### 常见问题

**有效期**:
- 表格有效期 3 年
- 信息变更需要重新提交

**拒绝原因**:
- 签名不是手写
- 信息不完整
- 地址格式不正确

### 注意事项

1. **如实填写** - 虚假信息可能导致法律问题
2. **保留副本** - 保存提交的记录
3. **及时更新** - 信息变更时重新提交
    `,
    relatedFirms: ['2', '4', '10'],
    sourceUrls: ['https://www.irs.gov/forms-pubs/about-form-w-8ben'],
    lastUpdatedAt: '2026-05-09'
  }
];

export const softwareList = [
  { name: 'Tradovate', slug: 'tradovate', description: '基于网页的交易平台，支持多家 Prop Firm', difficulty: 'beginner' },
  { name: 'Rithmic', slug: 'rithmic', description: '专业级数据服务，低延迟执行', difficulty: 'intermediate' },
  { name: 'ProjectX', slug: 'projectx', description: '新兴平台，简洁界面', difficulty: 'beginner' },
  { name: 'NinjaTrader', slug: 'ninjatrader', description: '功能强大的桌面交易软件', difficulty: 'advanced' },
  { name: 'Quantower', slug: 'quantower', description: '多资产交易平台，图表功能强大', difficulty: 'intermediate' },
  { name: 'Volumetrica', slug: 'volumetrica', description: '专注于成交量分析', difficulty: 'intermediate' },
  { name: 'ATAS', slug: 'atas', description: '订单流和成交量分析工具', difficulty: 'advanced' }
];
