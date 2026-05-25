import { LearnLayout, ConceptMap, CompareCards } from '../../components/learn';
import { AlertTriangle, Coins, Target, Shield, TrendingUp, DollarSign } from 'lucide-react';

export default function WhatIsPropFirm() {
  return (
    <LearnLayout
      title="什么是 Futures Prop Firm"
      subtitle="为交易员提供真实资金账户的期货自营交易公司"
      category="基础概念"
      accentColor="violet"
    >
      {/* 区块 1: Hero 介绍段落 */}
      <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto text-center">
        Futures Prop Firm（期货自营交易公司）是一种为交易员提供资金账户的服务商。
        你不需要投入大量本金，而是通过支付挑战费用来获得一个评估账户——
        通过考验后，平台用<span className="text-white font-semibold">真实资金</span>支持你交易，你拿走大部分利润。
      </p>

      {/* 区块 2: ConceptMap 核心逻辑 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-semibold">Section</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">核心逻辑</h2>
        </div>
        <ConceptMap
          center={{ label: 'Prop Firm 交易', sublabel: '核心模型' }}
          nodes={[
            {
              id: 'fee',
              label: '支付挑战费',
              description: '一次性报名费，获得评估资格',
              icon: DollarSign,
              color: 'violet',
            },
            {
              id: 'sim',
              label: '模拟账户交易',
              description: '在仿真环境中验证策略',
              icon: TrendingUp,
              color: 'violet',
            },
            {
              id: 'goal',
              label: '达成盈利目标',
              description: '满足平台设定的盈利要求',
              icon: Target,
              color: 'violet',
            },
            {
              id: 'funded',
              label: '获得真实资金',
              description: '通过评估后平台注资',
              icon: Coins,
              color: 'emerald',
            },
            {
              id: 'split',
              label: '70–100% 利润分成',
              description: '你保留大部分收益',
              icon: DollarSign,
              color: 'violet',
            },
            {
              id: 'risk',
              label: '亏损平台承担',
              description: '失败仅损失报名费',
              icon: Shield,
              color: 'rose',
            },
          ]}
        />
      </section>

      {/* 区块 3: CompareCards 双账户阶段 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-semibold">Section</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">两个账户阶段</h2>
        </div>
        <CompareCards
          layout="side-by-side"
          columns={[
            {
              id: 'eval',
              title: '评估账户',
              subtitle: 'Evaluation Account',
              icon: '🎯',
              accent: 'violet',
              items: [
                { label: '环境', value: '模拟交易' },
                { label: '目标', value: '达成盈利目标' },
                { label: '约束', value: '遵守回撤规则' },
                { label: '约束', value: '满足一致性要求' },
                { label: '通过后', value: '解锁资金账户' },
              ],
            },
            {
              id: 'funded',
              title: '资金账户',
              subtitle: 'Funded Account',
              icon: '💰',
              accent: 'emerald',
              items: [
                { label: '环境', value: '真实资金' },
                { label: '本金来源', value: '平台提供' },
                { label: '利润分成', value: '70% – 100%' },
                { label: '亏损', value: '由平台承担' },
              ],
            },
          ]}
        />
      </section>

      {/* 区块 4: CompareCards Futures vs CFD */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-semibold">Section</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">Futures vs CFD</h2>
          <p className="text-zinc-400 mt-3 text-base max-w-2xl">两种 Prop Firm 模式的核心差异</p>
        </div>
        <CompareCards
          layout="side-by-side"
          columns={[
            {
              id: 'futures',
              title: 'Futures Prop Firm',
              icon: '📈',
              accent: 'violet',
              items: [
                { label: '交易标的', value: '期货合约' },
                { label: '监管', value: 'CFTC / NFA' },
                { label: '平台', value: 'Tradovate / Rithmic' },
                { label: '成本', value: '通常更低' },
              ],
            },
            {
              id: 'cfd',
              title: 'CFD Prop Firm',
              icon: '💱',
              accent: 'violet',
              items: [
                { label: '交易标的', value: '差价合约' },
                { label: '监管', value: '相对宽松' },
                { label: '平台', value: 'MT4 / MT5' },
                { label: '成本', value: '点差成本' },
              ],
            },
          ]}
        />
      </section>

      {/* 区块 5: 风险须知 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-rose-400 uppercase tracking-widest font-semibold">Section</span>
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
                  Prop Firm 挑战账户不是投资建议，不保证收益或出金。
                </li>
                <li className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-rose-400" />
                  挑战失败会损失全部报名费，请仅投入可承受损失的金额。
                </li>
                <li className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-rose-400" />
                  期货交易涉及重大风险，可能导致本金全部损失。
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </LearnLayout>
  );
}
