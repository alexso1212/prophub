import { LearnLayout, ConceptMap, TimelineFlow } from '../../components/learn';
import { AlertTriangle } from 'lucide-react';

const stages = [
  {
    id: 'stage1',
    label: '第一阶段',
    title: '免费模拟',
    duration: '2-4 周',
    cost: '$0',
    description: '熟悉平台和规则，零风险摸底',
    actions: [
      '注册 Tradovate 免费模拟账户',
      '练习期货基础操作',
      '了解合约规格和保证金',
    ],
    accent: 'violet' as const,
  },
  {
    id: 'stage2',
    label: '第二阶段',
    title: '小账户试水',
    duration: '1-2 个月',
    cost: '$50 – $150',
    description: '体验真实挑战环境，做好损失全部报名费的准备',
    actions: [
      'Purdia $49 Micro 账户',
      'Alpha Futures $99 Basic 账户',
      '严守风控，培养纪律',
    ],
    accent: 'violet' as const,
  },
  {
    id: 'stage3',
    label: '第三阶段',
    title: '标准账户',
    duration: '3 个月起',
    cost: '$150 – $350',
    description: '通过挑战，获得真实资金账户',
    actions: [
      'Topstep $165/月',
      'Lucid Trading $149 起',
      '稳定交易频率，建立长期复盘',
    ],
    accent: 'emerald' as const,
  },
];

const riskNodes = [
  {
    id: 'bear',
    label: '只投可承受损失的资金',
    description: '永远不要投入身家',
    color: 'rose' as const,
  },
  {
    id: 'learn',
    label: '先学习，再实战',
    description: '基础没打好就上桌等于送钱',
    color: 'violet' as const,
  },
  {
    id: 'review',
    label: '记录复盘',
    description: '每笔交易都写日志',
    color: 'violet' as const,
  },
  {
    id: 'noscam',
    label: '不要追逐"包过"承诺',
    description: '稳赚承诺一律拉黑',
    color: 'violet' as const,
  },
];

export default function LowCostPath() {
  return (
    <LearnLayout
      title="低成本试错路径"
      subtitle="3 阶段 · 从免费模拟到资金账户"
      category="路径指南"
      accentColor="emerald"
    >
      {/* 区块 1: Hero 介绍段落 */}
      <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto text-center">
        Prop Firm 不是快速致富的捷径。这条路径告诉你
        <span className="text-white font-semibold">从 $0 到 funded account 应该怎么走</span>，
        每一步的成本、目标、时间都摊开。
      </p>

      {/* 区块 2: 3 阶段路径 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-emerald-400 uppercase tracking-widest font-semibold">路径</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">
            3 阶段 · 从 $0 到 funded
          </h2>
        </div>
        <TimelineFlow stages={stages} />
      </section>

      {/* 区块 3: 4 条铁律 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-emerald-400 uppercase tracking-widest font-semibold">原则</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">4 条铁律</h2>
        </div>
        <ConceptMap
          center={{ label: '风险控制铁律', sublabel: '不可逾越的底线' }}
          nodes={riskNodes}
        />
      </section>

      {/* 区块 4: 时间预期 + 重要提示 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-emerald-400 uppercase tracking-widest font-semibold">期望管理</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">
            时间预期 + 心态准备
          </h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 mb-6">
          <h3 className="text-white font-semibold text-lg mb-6">时间预期</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-400" />
              <span className="text-zinc-300 text-base leading-relaxed">
                <span className="text-white font-medium">学习阶段</span>：1-3 个月
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-400" />
              <span className="text-zinc-300 text-base leading-relaxed">
                <span className="text-white font-medium">通过挑战</span>：因人而异，可能需要多次尝试
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-400" />
              <span className="text-zinc-300 text-base leading-relaxed">
                <span className="text-white font-medium">稳定盈利</span>：6-12 个月或更长
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-rose-500/5 border border-rose-500/30 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center mt-0.5">
              <AlertTriangle size={20} className="text-rose-400" />
            </div>
            <div>
              <h3 className="text-rose-300 font-semibold text-base mb-2">重要提示</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                <span className="text-white font-semibold">Prop Firm 不是快速致富的捷径</span>。
                它是一份需要认真对待的专业活动，把它当兼职甚至主业来对待，不要把它当彩票买。
              </p>
            </div>
          </div>
        </div>
      </section>
    </LearnLayout>
  );
}
