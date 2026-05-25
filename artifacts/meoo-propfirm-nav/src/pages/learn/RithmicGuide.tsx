import { LearnLayout, CompareCards } from '../../components/learn';

const softwareCards = [
  {
    emoji: '🎯',
    title: 'NinjaTrader',
    bullets: ['桌面应用', '强大的图表', '自动化策略'],
  },
  {
    emoji: '📊',
    title: 'Quantower',
    bullets: ['多资产交易', '现代化 UI', '多 broker'],
  },
  {
    emoji: '📈',
    title: 'ATAS',
    bullets: ['订单流分析', 'Footprint 图表', '量化交易'],
  },
];

export default function RithmicGuide() {
  return (
    <LearnLayout
      title="Rithmic 连接指南"
      subtitle="专业级期货数据 / 执行服务的配置教程"
      category="软件教程"
      accentColor="violet"
    >
      {/* 区块 1: Hero */}
      <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto text-center">
        Rithmic 是期货行业的<span className="text-white font-semibold">低延迟数据和执行基础设施</span>，被多家 Prop Firm 采用。它本身不是界面软件，而是底层数据服务。
      </p>

      {/* 区块 2: Rithmic 是什么 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-semibold">基础</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">Rithmic 是什么</h2>
        </div>
        <div className="bg-white/5 border border-cyan-500/30 rounded-2xl p-8 md:p-10">
          <h3 className="text-white font-semibold text-lg mb-6">Rithmic 提供什么</h3>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">⚡</span>
              <p className="text-zinc-300 leading-relaxed">
                <span className="text-white font-semibold">低延迟市场数据</span> — 行业级标准，毫秒级
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🔀</span>
              <p className="text-zinc-300 leading-relaxed">
                <span className="text-white font-semibold">订单路由和执行</span> — 直连 CME 等交易所
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🧩</span>
              <p className="text-zinc-300 leading-relaxed">
                <span className="text-white font-semibold">多平台支持</span> — 可对接 NinjaTrader / Quantower / ATAS / 自定义 API
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 区块 3: 支持的软件 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-semibold">生态</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">支持的软件</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {softwareCards.map((card) => (
            <div
              key={card.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="text-3xl mb-3">{card.emoji}</div>
              <h3 className="text-white font-semibold text-base mb-3">{card.title}</h3>
              <ul className="space-y-1.5">
                {card.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-zinc-400">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-cyan-500/30 border border-cyan-500/40" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-zinc-500 text-sm mt-4 text-center">此外还支持自定义 API 应用接入</p>
      </section>

      {/* 区块 4: 连接配置 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-semibold">实操</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">连接配置</h2>
        </div>
        <CompareCards
          layout="side-by-side"
          columns={[
            {
              id: 'nt',
              title: 'NinjaTrader',
              subtitle: '桌面端配置',
              icon: '🎯',
              accent: 'violet',
              items: [
                { label: '步骤 1', value: '打开 Connections > Configure' },
                { label: '步骤 2', value: '添加 Rithmic 连接' },
                { label: '步骤 3', value: '输入账户信息' },
                { label: '步骤 4', value: '测试连接 → 开始交易' },
              ],
            },
            {
              id: 'qt',
              title: 'Quantower',
              subtitle: '现代化平台',
              icon: '📊',
              accent: 'violet',
              items: [
                { label: '步骤 1', value: '打开 Connections' },
                { label: '步骤 2', value: '选择 Rithmic' },
                { label: '步骤 3', value: '输入登录信息' },
                { label: '步骤 4', value: '测试连接 → 开始交易' },
              ],
            },
          ]}
        />
      </section>

      {/* 区块 5: 故障排查 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-semibold">排障</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">故障排查</h2>
        </div>
        <CompareCards
          layout="side-by-side"
          columns={[
            {
              id: 'fail',
              title: '连接失败',
              icon: '⚠️',
              accent: 'rose',
              items: [
                { label: '检查', value: '账户状态是否激活' },
                { label: '检查', value: '数据订阅是否有效' },
                { label: '检查', value: '防火墙是否拦截' },
              ],
            },
            {
              id: 'delay',
              title: '数据延迟',
              icon: '🐢',
              accent: 'violet',
              items: [
                { label: '尝试', value: '切换数据服务器' },
                { label: '检查', value: '网络质量' },
                { label: '联系', value: 'Prop Firm 技术支持' },
              ],
            },
          ]}
        />
      </section>
    </LearnLayout>
  );
}
