import { LearnLayout, FlowSteps, CompareCards, ConceptMap } from '../../components/learn';

const steps = [
  {
    id: 'register',
    title: '注册 Wise',
    description: '访问 wise.com，邮箱注册',
    detail: ['完成身份验证（KYC）', '获取美元账户信息'],
    accent: 'violet' as const,
  },
  {
    id: 'getinfo',
    title: '获取账户信息',
    description: '在 Wise dashboard 找到美元接收账户详情',
    detail: [
      'Account Holder Name',
      'Account Number',
      'Routing Number (ACH)',
      'Bank Name',
      '⚠️ 姓名必须与 Prop Firm 完全一致',
    ],
    accent: 'violet' as const,
  },
  {
    id: 'addmethod',
    title: '在 Prop Firm 添加出金方式',
    description: '登录后台 → Payout / Withdrawal 选项',
    detail: [
      '选择 Bank Transfer / ACH',
      '输入 Wise 提供的账户信息',
      '保存并验证',
    ],
    accent: 'violet' as const,
  },
  {
    id: 'request',
    title: '提交出金申请',
    description: '达到最低出金门槛后申请',
    detail: ['首次出金可能需要额外验证', '保留申请截图'],
    accent: 'violet' as const,
  },
  {
    id: 'wait',
    title: '等待审核',
    description: '通常 1-3 个工作日',
    detail: ['审核期间不要重复申请', '关注邮件通知'],
    accent: 'violet' as const,
  },
  {
    id: 'received',
    title: '资金到账',
    description: 'Wise 账户收到 USD',
    detail: ['可保留 USD 或换汇', '提现到国内银行有汇率差'],
    accent: 'emerald' as const,
  },
];

const feeColumns = [
  {
    id: 'receive',
    title: '接收 ACH',
    subtitle: '入账费用',
    icon: '📥',
    accent: 'emerald' as const,
    items: [
      { label: '费用', value: '通常免费' },
      { label: '到账', value: '1-3 工作日' },
    ],
  },
  {
    id: 'convert',
    title: '货币转换',
    subtitle: 'USD → CNY',
    icon: '💱',
    accent: 'violet' as const,
    items: [
      { label: '费用', value: '约 0.5%' },
      { label: '汇率', value: 'Wise 中间价' },
      { label: '建议', value: '汇率好时再换' },
    ],
  },
  {
    id: 'withdraw',
    title: '提现到国内',
    subtitle: 'Wise → 银行',
    icon: '🏦',
    accent: 'violet' as const,
    items: [
      { label: '费用', value: '固定费用 + 汇率差' },
      { label: '到账', value: '通常 1-2 工作日' },
      { label: '注意', value: '受外汇额度限制' },
    ],
  },
];

const cautionNodes = [
  { id: 'name', label: '姓名一致', description: '与 Prop Firm 注册姓名完全一致', color: 'rose' as const },
  { id: 'verify', label: '账户验证', description: '确保 Wise 已完成 KYC', color: 'violet' as const },
  { id: 'tax', label: '税务表格', description: '部分平台需 W-8BEN', color: 'violet' as const },
  { id: 'cycle', label: '出金周期', description: '了解平台处理时间', color: 'violet' as const },
];

const alternatives = [
  { name: 'Rise', desc: '类似服务' },
  { name: 'Plane', desc: '新兴选项' },
  { name: 'Workmarket', desc: '自由职业者友好' },
  { name: '加密货币', desc: 'USDT 出金（速度快但需自换汇）' },
];

export default function WisePayout() {
  return (
    <LearnLayout
      title="Wise 出金教程"
      subtitle="从注册到资金到账的完整流程"
      category="出金指南"
      accentColor="emerald"
    >
      {/* 区块 1: Hero */}
      <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto text-center">
        Wise（原 TransferWise）是许多 Prop Firm 支持的出金方式，
        <span className="text-white font-semibold">特别适合中国用户</span>。
        手续费低，到账快，操作简单。
      </p>

      {/* 区块 2: 完整流程 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-emerald-400 uppercase tracking-widest font-semibold">流程</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">6 步完成首次出金</h2>
        </div>
        <FlowSteps steps={steps} />
      </section>

      {/* 区块 3: 费用说明 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-emerald-400 uppercase tracking-widest font-semibold">成本</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">费用拆解</h2>
        </div>
        <CompareCards layout="grid" columns={feeColumns} />
      </section>

      {/* 区块 4: 注意事项 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-emerald-400 uppercase tracking-widest font-semibold">细节</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">4 大注意事项</h2>
        </div>
        <ConceptMap
          center={{ label: '4 大注意', sublabel: '出金关键细节' }}
          nodes={cautionNodes}
        />
      </section>

      {/* 区块 5: 替代方案 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-semibold">备选</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">如果 Wise 不可用</h2>
        </div>
        <div className="bg-violet-500/5 border border-violet-500/30 rounded-2xl p-6 md:p-8">
          <p className="text-zinc-300 text-base mb-6">
            部分用户因地区或验证问题无法使用 Wise，可以考虑：
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {alternatives.map((alt) => (
              <div
                key={alt.name}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
              >
                <div className="text-white font-semibold text-sm mb-1">{alt.name}</div>
                <div className="text-zinc-400 text-xs leading-relaxed">{alt.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </LearnLayout>
  );
}
