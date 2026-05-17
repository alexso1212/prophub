export function TopBar() {
  return (
    <div className="min-h-screen bg-[#0a0613] text-white font-sans p-6">
      {/* Expanded inline filter bar */}
      <div className="rounded-2xl border border-white/10 bg-[#13101f] p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">筛选</span>
            <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[12px] text-white/60">重置</button>
            <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[12px] text-white/60">↑ 收起</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <Field label="资产类别">
            <div className="flex gap-1.5">
              <MiniChip active>期货</MiniChip><MiniChip>外汇</MiniChip><MiniChip>加密</MiniChip>
            </div>
          </Field>

          <Field label="最低评分">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => (
                <span key={n} className={n <= 4 ? "text-orange-400" : "text-white/20"}>★</span>
              ))}
              <span className="ml-2 text-[11px] text-white/60 font-semibold">4+</span>
            </div>
          </Field>

          <Field label="最大资金">
            <div className="flex gap-1.5 flex-wrap">
              <MiniChip>25K</MiniChip><MiniChip>50K</MiniChip><MiniChip active>100K</MiniChip><MiniChip>150K</MiniChip>
            </div>
          </Field>

          <Field label="国家">
            <select className="w-full text-[12px] bg-white/[0.03] border border-white/10 rounded-lg px-2 py-1.5 text-white">
              <option>🇺🇸 美国 (1)</option>
            </select>
          </Field>

          <Field label="平台">
            <select className="w-full text-[12px] bg-white/[0.03] border border-white/10 rounded-lg px-2 py-1.5 text-white">
              <option>全部 (8)</option>
            </select>
          </Field>

          <Field label="显示">
            <div className="flex flex-col gap-1 text-[11px] text-white/70">
              <label className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm border border-white/20" /> 仅新公司</label>
              <label className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-500 grid place-items-center text-[8px]">✓</span> 仅有优惠</label>
            </div>
          </Field>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-white/40 mr-1">已选：</span>
          <TagChip>美国</TagChip>
          <TagChip>评分 4+</TagChip>
          <TagChip>$100K+</TagChip>
          <TagChip>仅有优惠</TagChip>
        </div>
      </div>

      {/* Sort row */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">人气 ↑</span>
        <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">最新</span>
        <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">评分</span>
        <span className="ml-auto text-[11px] text-white/40">5 家公司符合条件</span>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        {["Lucid Trading","Tradeify","Alpha Futures","My Funded Futures","Top One Futures"].map((n,i) => (
          <div key={n} className={`flex items-center gap-3 px-4 py-3 text-sm ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
            <div className="w-7 h-7 rounded-full bg-white/10" />
            <div className="flex-1">{n}</div>
            <div className="text-orange-300">4.{6 + i % 2}</div>
            <div className="text-white/60">🇺🇸 美国</div>
            <div className="text-white/60">$750K</div>
            <div className="text-pink-300 text-[12px]">40% 折扣</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">{label}</div>
      {children}
    </div>
  );
}

function MiniChip({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <button
      className={`px-2 py-1 rounded-md text-[11px] border ${
        active
          ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white border-transparent"
          : "bg-white/[0.03] border-white/10 text-white/60"
      }`}
    >
      {children}
    </button>
  );
}

function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/70">
      {children} <span className="text-white/40">×</span>
    </span>
  );
}
