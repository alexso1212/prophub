import { Sparkles } from 'lucide-react';
import { LearnLayout, ConceptMap, CompareCards, FlowSteps } from '../../components/learn';

export default function ConsistencyRule() {
  return (
    <LearnLayout
      title="一致性规则解析"
      subtitle="为什么平台要求交易一致性，以及如何避免违规"
      category="核心规则"
      accentColor="violet"
    >
      {/* 区块 1: Hero 导语 */}
      <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto text-center">
        一致性规则（Consistency Rule）是 Prop Firm 用来<span className="text-white font-semibold">筛选"赌徒"和"交易员"</span>的重要机制。
        理解它，你就知道为什么"靠一笔大单通过挑战"行不通。
      </p>

      {/* 区块 2: 规则形式 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-semibold">规则形式</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">两种常见的一致性约束</h2>
        </div>
        <CompareCards
          layout="side-by-side"
          columns={[
            {
              id: 'single',
              title: '单笔规则',
              subtitle: 'Per-Trade Limit',
              icon: '📊',
              accent: 'violet',
              items: [
                { label: '阈值', value: '单笔盈利 ≤ 总盈利 30–50%' },
                { label: '含义', value: '不能靠一笔大单通过挑战' },
              ],
            },
            {
              id: 'daily',
              title: '单日规则',
              subtitle: 'Per-Day Limit',
              icon: '📅',
              accent: 'violet',
              items: [
                { label: '阈值', value: '单日盈利 ≤ 总盈利 40%' },
                { label: '含义', value: '不能在一个交易日内大爆发' },
              ],
            },
          ]}
        />
      </section>

      {/* 区块 3: 设计动机 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-semibold">设计动机</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">为什么 Prop Firm 要这个规则</h2>
        </div>
        <ConceptMap
          center={{ label: '为什么存在', sublabel: '一致性规则' }}
          nodes={[
            {
              id: 'risk',
              label: '风险控制',
              description: '防止靠运气通过挑战',
              color: 'rose',
            },
            {
              id: 'sustainable',
              label: '可持续性',
              description: '确保策略可复制',
              color: 'emerald',
            },
            {
              id: 'filter',
              label: '筛选机制',
              description: '淘汰过度冒险的交易员',
              color: 'violet',
            },
          ]}
        />
      </section>

      {/* 区块 4: 实战 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-semibold">实战</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">4 步避免违规</h2>
        </div>
        <FlowSteps
          steps={[
            {
              id: 'split',
              title: '分批建仓',
              description: '不要重仓博一把',
              detail: ['同方向分 2-3 次进场', '减少单笔成败的极端结果'],
              accent: 'violet',
            },
            {
              id: 'exit',
              title: '分批平仓',
              description: '盈利分批兑现',
              detail: ['到目标后部分止盈', '剩余仓位移止损保利', '降低单笔利润占比'],
              accent: 'violet',
            },
            {
              id: 'freq',
              title: '保持交易频率稳定',
              description: '每日交易笔数不要忽多忽少',
              detail: ['每日 3-5 笔比"赌一笔"健康得多', '稳定频率让一致性指标自然达标'],
              accent: 'violet',
            },
            {
              id: 'log',
              title: '记录每日盈利分布',
              description: '用日志追踪一致性指标',
              detail: ['每周复盘单笔/单日占比', '发现某笔过大要主动减少后续仓位'],
              accent: 'violet',
            },
          ]}
        />
      </section>

      {/* 区块 5: 例外 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-emerald-400 uppercase tracking-widest font-semibold">例外</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">哪些平台不设一致性规则</h2>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mt-0.5">
              <Sparkles size={20} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-emerald-300 font-semibold text-base mb-3">不设一致性规则的平台</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                适合有成熟策略、回撤管理过硬的交易员。代表平台：
                <span className="text-white font-semibold"> Alpha Futures、Apex Trader Funding</span>。
                这类平台不限制单笔或单日盈利占比，策略灵活度更高，但对整体风控要求同样严格。
              </p>
            </div>
          </div>
        </div>
      </section>
    </LearnLayout>
  );
}
