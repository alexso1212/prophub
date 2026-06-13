# Prophub 内容迁移计划

## 目标

把 Prop Firm 导航站从“页面原型”升级为“结构化内容知识库”。当前重点不是 UI，而是把平台资料、攻略、软件教程、出金流程和风险披露整理进 Prophub。

## 内容模块

### 1. 平台库

来源：

```text
content/propfirm/knowledge-base/knowledge-base.json.firmsData
```

页面建议：

- `/firms`
- `/firms/[slug]`
- `/rules`

字段：

- 平台名称
- 官网链接
- 返佣链接
- 优惠码
- 中国用户状态
- 风险等级
- 支持软件
- 支付方式
- KYC 要求
- 最后核验日期
- 来源链接
- 账户类型
- 费用
- 利润目标
- 最大回撤
- 日损
- 回撤类型
- 最小交易日
- 一致性规则
- 分成比例
- 最低出金
- 单次出金上限

### 2. 攻略库

来源：

```text
content/propfirm/knowledge-base/knowledge-base.json.guidesData
```

页面建议：

- `/guides`
- `/guides/[slug]`

分类：

- beginner：新手指南
- roadmap：路径指南
- software：软件教程
- payment：支付教程
- payout：出金教程

### 3. 软件和出金流程

来源：

```text
content/propfirm/knowledge-base/04_software-payout-flows.md
content/propfirm/knowledge-base/raw-page-text/
```

内容包括：

- Tradovate
- Rithmic
- NinjaTrader
- Wise
- Rise
- 加密货币
- W8 表格
- KYC
- 低成本路径

### 4. 风险披露

来源：

```text
content/propfirm/knowledge-base/raw-page-text/pages__Disclosure.md
```

必须包含：

- 投资风险
- 平台风险
- 返佣披露
- 数据准确性说明
- 地区限制
- 用户责任

## 推荐执行顺序

1. 先把 `content-knowledge-base/` 放进仓库。
2. 新增一个 `content/propfirm/README.md`，说明来源和合规边界。
3. 做一个数据读取层，读取 `knowledge-base.json`。
4. 先接平台库和攻略库。
5. 再接软件教程、出金教程、风险披露。
6. 最后再做 SEO 和页面视觉。

## Claude 工作要求

- 不要凭空改平台规则。
- 不要把示例数据包装成已验证事实。
- 所有涉及费用、出金、地区支持的字段都要展示 `lastVerifiedAt`。
- 涉及返佣链接时，跳转前必须展示返佣披露。
- 任何平台排序都要说明排序依据。

