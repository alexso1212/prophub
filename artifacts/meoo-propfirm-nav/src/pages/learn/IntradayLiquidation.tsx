import { Moon } from 'lucide-react';
import { LearnLayout, CompareCards, FlowSteps } from '../../components/learn';

export default function IntradayLiquidation() {
  return (
    <LearnLayout
      title="日内平仓要求"
      subtitle="为什么收盘前必须清仓，以及如何安排交易节奏"
      category="核心规则"
      accentColor="violet"
    >
      {/* 区块 1: Hero */}
      <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto text-center">
        绝大多数 Futures Prop Firm 要求交易员在<span className="text-white font-semibold">收盘前平仓所有头寸</span>。
        不是为了为难你，而是平台保护自身和你的双重风控。
      </p>

      {/* 区块 2: 两大原因 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-semibold">原因</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">为什么必须日内平仓</h2>
        </div>
        <CompareCards
          layout="side-by-side"
          columns={[
            {
              id: 'risk',
              title: '风险控制',
              subtitle: '保护双方资金安全',
              icon: '🛡️',
              accent: 'rose',
              items: [
                { label: '风险点', value: '避免隔夜跳空' },
                { label: '风险点', value: '防止重大新闻事件冲击' },
                { label: '风险点', value: '保护平台和你的本金' },
              ],
            },
            {
              id: 'cost',
              title: '运营成本',
              subtitle: '降低保证金占用',
              icon: '💵',
              accent: 'violet',
              items: [
                { label: '原因', value: '隔夜持仓需更高保证金' },
                { label: '原因', value: '降低平台资金占用成本' },
              ],
            },
          ]}
        />
      </section>

      {/* 区块 3: 例外情况 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-semibold">例外</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">允许隔夜的平台</h2>
        </div>
        <div className="bg-violet-500/5 border border-violet-500/30 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center mt-0.5">
              <Moon size={20} className="text-violet-400" />
            </div>
            <div>
              <h3 className="text-violet-300 font-semibold text-base mb-3">
                <strong>少数平台允许隔夜持仓</strong>，但通常有附加要求
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-violet-400" />
                  更高的账户规模
                </li>
                <li className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-violet-400" />
                  额外的保证金要求
                </li>
                <li className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-violet-400" />
                  限制持仓品种
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 区块 4: 实战节奏 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-semibold">实战</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">3 步搭好你的交易节奏</h2>
        </div>
        <FlowSteps
          steps={[
            {
              id: 'plan',
              title: '规划交易时间',
              description: '收盘前 1 小时停止开新仓',
              detail: [
                '美东时间 16:00 是常见结算点',
                '提前 60 分钟进入"只平仓"模式',
                '不要试图最后 15 分钟搏一把',
              ],
              accent: 'violet',
            },
            {
              id: 'alert',
              title: '设置提醒',
              description: '用平台或软件自动提醒',
              detail: [
                'Tradovate / NinjaTrader 都支持时间提醒',
                '手机加一个 15:00 钟，给自己缓冲',
              ],
              accent: 'violet',
            },
            {
              id: 'window',
              title: '选择合适的交易时段',
              description: '专注流动性最好的时段',
              detail: [
                '美股开盘后 1 小时（22:30-23:30 北京时间）流动性最佳',
                '亚洲时段流动性差，慎入',
                '欧美重叠时段（21:00-23:00 北京）波动加机会多',
              ],
              accent: 'violet',
            },
          ]}
        />
      </section>
    </LearnLayout>
  );
}
