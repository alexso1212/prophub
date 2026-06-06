import { AlertTriangle } from 'lucide-react';
import { LearnLayout, ConceptMap, CompareCards, FlowSteps } from '../../components/learn';

export default function DrawdownRules() {
  return (
    <LearnLayout
      title="回撤规则详解"
      subtitle="EOD / TDD / 静态 / 追踪，4 种回撤机制对比"
      category="核心规则"
      accentColor="violet"
    >
      {/* 区块 1: Hero 导语 */}
      <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto text-center">
        回撤规则是 Prop Firm 评估中<span className="text-white font-semibold">最重要</span>的风险控制指标。
        理解 4 种回撤机制，决定你能否通过挑战。
      </p>

      {/* 区块 2: ConceptMap 放射对照 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-semibold">Section · 一句话总览</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">4 种回撤类型</h2>
        </div>
        <ConceptMap
          center={{ label: '最大回撤限制', sublabel: '核心约束' }}
          nodes={[
            {
              id: 'eod',
              label: 'EOD（日终回撤）',
              description: '基于每日收盘权益',
              color: 'violet',
            },
            {
              id: 'tdd',
              label: 'TDD（日内回撤）',
              description: '实时计算，触及即违规',
              color: 'rose',
            },
            {
              id: 'static',
              label: '静态回撤',
              description: '固定初始权益，不随盈利变化',
              color: 'violet',
            },
            {
              id: 'trailing',
              label: '追踪回撤',
              description: '随最高权益移动',
              color: 'violet',
            },
          ]}
        />
      </section>

      {/* 区块 3: CompareCards 4 列对比 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-semibold">Section · 详细对比</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">逐项细看</h2>
        </div>
        <CompareCards
          layout="grid"
          columns={[
            {
              id: 'eod',
              title: 'EOD 回撤',
              subtitle: 'End of Day · 日终',
              icon: '🌙',
              accent: 'violet',
              items: [
                { label: '定义', value: '基于每日收盘权益' },
                { label: '触发', value: '收盘后权益低于阈值' },
                { label: '示例', value: '$50K 账户，回撤 $2.5K，日内可跌至 $45K，收盘需 ≥ $47.5K' },
                { label: '适合', value: '日内交易策略' },
              ],
            },
            {
              id: 'tdd',
              title: 'TDD 回撤',
              subtitle: 'Trailing Daily · 日内',
              icon: '⚡',
              accent: 'rose',
              items: [
                { label: '定义', value: '基于日内最高权益的实时回撤' },
                { label: '触发', value: '日内权益跌幅超限即违规' },
                { label: '示例', value: '跟随最高权益点移动，最严格' },
                { label: '适合', value: '保守策略，严控浮亏' },
              ],
            },
            {
              id: 'static',
              title: '静态回撤',
              subtitle: 'Static',
              icon: '⚓',
              accent: 'violet',
              items: [
                { label: '定义', value: '固定初始权益的回撤限制' },
                { label: '触发', value: '权益跌破固定线' },
                { label: '示例', value: '$50K 初始，回撤 $2.5K，盈利后回撤线仍在 $47.5K' },
                { label: '适合', value: '盈利后宽容度增加' },
              ],
            },
            {
              id: 'trailing',
              title: '追踪回撤',
              subtitle: 'Trailing',
              icon: '🎯',
              accent: 'violet',
              items: [
                { label: '定义', value: '回撤线随最高权益移动' },
                { label: '触发', value: '回撤空间始终保持固定' },
                { label: '示例', value: '盈利到 $55K，回撤线移至 $52.5K，永远保留 $2.5K 空间' },
                { label: '适合', value: '需稳定持续盈利' },
              ],
            },
          ]}
        />
      </section>

      {/* 区块 4: FlowSteps 应对策略 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-semibold">Section · 实战</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">4 步应对策略</h2>
        </div>
        <FlowSteps
          numbered={true}
          steps={[
            {
              id: 'know',
              title: '了解你的回撤类型',
              description: '不同平台规则差异巨大，签约前必查',
              detail: [
                '查看官方规则文档',
                '比较 EOD vs TDD vs Trailing 的具体阈值',
                '注意"激活后"是否改变规则',
              ],
              accent: 'violet',
            },
            {
              id: 'stop',
              title: '设置硬止损',
              description: '永远不要无止损交易',
              detail: [
                '每笔单立刻挂止损',
                '止损位由账户回撤反推',
                '不允许"心理止损"',
              ],
              accent: 'rose',
            },
            {
              id: 'risk',
              title: '分散风险',
              description: '单笔交易风险控制在 1-2%',
              detail: [
                '总风险敞口拆分',
                '不要 all-in 一笔',
                '记录每日已用风险额度',
              ],
              accent: 'violet',
            },
            {
              id: 'time',
              title: '避开高波动时段',
              description: '新闻发布前后谨慎交易',
              detail: [
                'NFP、FOMC、CPI 前后 30 分钟避免开仓',
                'CME 收盘前 15 分钟减仓',
                '主力合约切换时段降低杠杆',
              ],
              accent: 'violet',
            },
          ]}
        />
      </section>

      {/* 区块 5: 风险须知 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-rose-400 uppercase tracking-widest font-semibold">Section · 提醒</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">风险须知</h2>
        </div>
        <div className="bg-rose-500/5 border border-rose-500/30 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center mt-0.5">
              <AlertTriangle size={20} className="text-rose-400" />
            </div>
            <div>
              <h3 className="text-rose-300 font-semibold text-base mb-3">重要风险提示</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-rose-400" />
                  回撤规则一旦触发即终止评估，报名费不予退还。
                </li>
                <li className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-rose-400" />
                  本文示例为简化数值，请以平台官方规则为准。
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </LearnLayout>
  );
}
