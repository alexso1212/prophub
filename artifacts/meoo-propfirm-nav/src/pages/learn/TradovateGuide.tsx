import { LearnLayout, FlowSteps, CompareCards } from '../../components/learn';

const features = [
  {
    emoji: '🌐',
    title: '网页端',
    bullets: ['无需安装', '跨平台', '自动更新'],
  },
  {
    emoji: '🎯',
    title: '多平台支持',
    bullets: ['Topstep', 'FundedNext', 'Lucid Trading', 'Apex Trader'],
  },
  {
    emoji: '🆓',
    title: '免费模拟',
    bullets: ['注册即用', '真实行情', '练习无成本'],
  },
];

const steps = [
  {
    id: 'register',
    title: '注册账户',
    description: '访问 tradovate.com 注册',
    detail: ['或使用 Prop Firm 提供的登录凭据', '免费账户即可练习'],
    accent: 'violet' as const,
  },
  {
    id: '2fa',
    title: '设置 2FA',
    description: '首次登录强制启用二次验证',
    detail: ['推荐 Google Authenticator', '保存好 backup codes'],
    accent: 'violet' as const,
  },
  {
    id: 'layout',
    title: '熟悉界面布局',
    description: '左侧报价 · 中间图表 · 右侧订单簿 · 底部账户',
    detail: ['工作区可自定义', '支持多屏幕'],
    accent: 'violet' as const,
  },
  {
    id: 'trade',
    title: '开始交易',
    description: '从模拟练习到真实下单',
    detail: ['先用模拟练熟下单流程', '熟悉市价/限价/止损单'],
    accent: 'emerald' as const,
  },
];

const shortcuts = [
  { keys: 'Ctrl + T', desc: '新建图表' },
  { keys: 'Ctrl + F', desc: '查找合约' },
  { keys: 'Delete', desc: '取消选中订单' },
  { keys: 'Esc', desc: '关闭弹窗' },
];

export default function TradovateGuide() {
  return (
    <LearnLayout
      title="Tradovate 使用教程"
      subtitle="最常用的 Prop Firm 网页交易平台"
      category="软件教程"
      accentColor="violet"
    >
      {/* 区块 1: Hero */}
      <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto text-center">
        Tradovate 是目前<span className="text-white font-semibold">支持最多 Prop Firm 的交易平台</span>，
        基于网页，无需安装，是新手最常用的入门工具。
      </p>

      {/* 区块 2: 核心特性 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-semibold">为什么用它</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">3 大核心特性</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="text-white font-semibold text-base mb-3">{f.title}</h3>
              <ul className="space-y-1.5">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-zinc-400">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-violet-500/30 border border-violet-500/40" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 区块 3: 4 步流程 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-semibold">上手</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">4 步开始交易</h2>
        </div>
        <FlowSteps steps={steps} />
      </section>

      {/* 区块 4: 快捷键 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-semibold">效率</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">常用快捷键</h2>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {shortcuts.map((s) => (
              <div
                key={s.keys}
                className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between"
              >
                <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-violet-300 font-mono text-sm">
                  {s.keys}
                </kbd>
                <span className="text-zinc-300 text-sm">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 区块 5: 常见问题 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-semibold">排障</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">常见问题</h2>
        </div>
        <CompareCards
          layout="side-by-side"
          columns={[
            {
              id: 'conn',
              title: '连接问题',
              icon: '🔌',
              accent: 'violet',
              items: [
                { label: '检查', value: '网络连接是否正常' },
                { label: '尝试', value: '清除浏览器缓存' },
                { label: '推荐', value: '使用 Chrome 浏览器' },
              ],
            },
            {
              id: 'delay',
              title: '数据延迟',
              icon: '⏱️',
              accent: 'violet',
              items: [
                { label: '确认', value: '订阅了正确的数据流' },
                { label: '操作', value: '刷新页面重新连接' },
                { label: '联系', value: '联系 Prop Firm 支持' },
              ],
            },
          ]}
        />
      </section>
    </LearnLayout>
  );
}
