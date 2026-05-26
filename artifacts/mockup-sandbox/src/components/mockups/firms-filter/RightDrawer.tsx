export function RightDrawer() {
  return (
    <div className="min-h-screen bg-[#0a0613] text-white font-sans flex">
      {/* Dimmed table behind */}
      <div className="flex-1 p-6 opacity-40 pointer-events-none">
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span className="px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 inline-flex items-center gap-1.5">
            ⚙ 筛选 <span className="bg-white/25 text-[10px] font-bold rounded-full px-1.5">3</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">人气</span>
          <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">♡ 收藏 0/3</span>
          <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">新上线</span>
        </div>
        <div className="rounded-xl border border-white/10 overflow-hidden">
          {["Lucid Trading", "Tradeify", "Alpha Futures", "My Funded Futures"].map((n, i) => (
            <div key={n} className={`flex items-center gap-3 px-4 py-3 text-sm ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
              <div className="w-7 h-7 rounded-full bg-white/10" />
              <div className="flex-1">{n}</div>
              <div className="text-orange-300">4.{6 + i % 2}</div>
              <div className="text-white/60">$750K</div>
            </div>
          ))}
        </div>
      </div>

      {/* Drawer */}
      <aside className="w-[400px] bg-[#13101f] border-l border-white/10 shadow-[-12px_0_40px_rgba(0,0,0,0.5)] flex flex-col">
        <header className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="font-bold text-base">筛选</h3>
          <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 grid place-items-center text-white/60">×</button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          <Group title="资产类别">
            <div className="flex flex-wrap gap-1.5">
              <Chip active>期货</Chip><Chip>外汇</Chip><Chip>加密</Chip>
            </div>
            <p className="text-[11px] text-white/40 mt-2">切换会跳转到对应板块。</p>
          </Group>

          <Group title="显示">
            <Check>仅显示新公司</Check>
            <Check checked>仅显示有优惠</Check>
            <Check>♡ 仅显示我的收藏</Check>
          </Group>

          <Group title="最低评分">
            <div className="space-y-1.5">
              {[5,4,3,2,1].map(n => (
                <div key={n} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${n === 4 ? "border-orange-400/40 bg-orange-400/10 text-white" : "border-white/10 bg-white/[0.03] text-white/60"}`}>
                  {Array.from({length: n}).map((_, i) => <span key={i} className={n === 4 ? "text-orange-400" : "text-white/40"}>★</span>)}
                  <span className="ml-auto font-semibold">{n}+</span>
                </div>
              ))}
            </div>
          </Group>

          <Group title="最大资金">
            <div className="flex flex-wrap gap-1.5">
              <Chip>$25K+</Chip><Chip>$50K+</Chip><Chip active>$100K+</Chip><Chip>$150K+</Chip><Chip>$500K+</Chip>
            </div>
          </Group>

          <Group title="国家 / 地区" count={1}>
            <div className="flex flex-wrap gap-1.5">
              <Chip active>🇺🇸 美国</Chip><Chip>🇬🇧 英国</Chip><Chip>🇨🇦 加拿大</Chip><Chip>🇦🇺 澳大利亚</Chip>
            </div>
          </Group>

          <Group title="交易平台">
            <div className="flex flex-wrap gap-1.5">
              {["NinjaTrader","Tradovate","TradingView","Sierra Chart","Quantower","Rithmic","MT5","cTrader"].map(p => <Chip key={p}>{p}</Chip>)}
            </div>
          </Group>
        </div>

        <footer className="flex gap-2.5 px-5 py-3.5 border-t border-white/10 bg-[#13101f]">
          <button className="px-4 py-2.5 rounded-[10px] bg-white/5 border border-white/10 text-white/60 text-[13px] font-semibold w-24">重置</button>
          <button className="flex-1 px-4 py-2.5 rounded-[10px] bg-gradient-to-r from-pink-500 to-orange-500 text-white text-[13px] font-semibold">应用 3 个筛选</button>
        </footer>
      </aside>
    </div>
  );
}

function Group({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
        {title}
        {count ? <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{count}</span> : null}
      </h4>
      {children}
    </section>
  );
}

function Chip({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <button
      className={`px-2.5 py-1.5 rounded-full text-[12px] inline-flex items-center gap-1.5 border ${
        active
          ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white border-transparent"
          : "bg-white/[0.03] border-white/10 text-white/60"
      }`}
    >
      {children}
    </button>
  );
}

function Check({ checked, children }: { checked?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 text-[13px] text-white cursor-pointer">
      <span
        className={`w-4 h-4 rounded-[3px] grid place-items-center text-[10px] ${
          checked ? "bg-orange-500 text-white" : "bg-white/5 border border-white/20"
        }`}
      >
        {checked ? "✓" : ""}
      </span>
      {children}
    </label>
  );
}
