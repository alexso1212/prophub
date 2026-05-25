import { useState, useMemo } from 'react';
import { firmsData } from '../data/firms';
import type { AccountType } from '../types';

interface ComparisonRow {
  firmName: string;
  account: AccountType;
}

export default function RulesComparison() {
  const [selectedFirms, setSelectedFirms] = useState<string[]>([]);

  const comparisonData: ComparisonRow[] = useMemo(() => {
    const firms = selectedFirms.length > 0
      ? firmsData.filter(f => selectedFirms.includes(f.id))
      : firmsData.slice(0, 5);
    return firms.flatMap(firm =>
      firm.accountTypes.map(account => ({
        firmName: firm.name,
        account
      }))
    );
  }, [selectedFirms]);

  const toggleFirm = (firmId: string) => {
    setSelectedFirms(prev =>
      prev.includes(firmId)
        ? prev.filter(id => id !== firmId)
        : [...prev, firmId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#13131f] to-[#1a1a2e] relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/20 blur-[120px] pointer-events-none" />
      <div className="px-3 py-4 relative">
        <div className="mb-4">
          <h1 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-white via-violet-100 to-violet-200 bg-clip-text text-transparent">规则对比</h1>
          <p className="text-xs text-zinc-400 mt-1">横向对比各平台账户规则</p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {firmsData.map(firm => (
            <button
              key={firm.id}
              onClick={() => toggleFirm(firm.id)}
              className={`px-2.5 py-1 text-xs rounded transition-colors duration-150 ${
                selectedFirms.includes(firm.id)
                  ? 'bg-gradient-to-r from-violet-500/80 to-violet-700/80 text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] border border-violet-400/50'
                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
              }`}
            >
              {firm.name}
            </button>
          ))}
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-white/[0.06] border-b border-white/10">
                  <th className="px-3 py-2 text-left font-medium text-violet-300/70 uppercase tracking-wide whitespace-nowrap">平台</th>
                  <th className="px-3 py-2 text-left font-medium text-violet-300/70 uppercase tracking-wide whitespace-nowrap">账户</th>
                  <th className="px-3 py-2 text-left font-medium text-violet-300/70 uppercase tracking-wide whitespace-nowrap">规模</th>
                  <th className="px-3 py-2 text-left font-medium text-violet-300/70 uppercase tracking-wide whitespace-nowrap">费用</th>
                  <th className="px-3 py-2 text-left font-medium text-violet-300/70 uppercase tracking-wide whitespace-nowrap">利润目标</th>
                  <th className="px-3 py-2 text-left font-medium text-violet-300/70 uppercase tracking-wide whitespace-nowrap">最大回撤</th>
                  <th className="px-3 py-2 text-left font-medium text-violet-300/70 uppercase tracking-wide whitespace-nowrap">日损</th>
                  <th className="px-3 py-2 text-left font-medium text-violet-300/70 uppercase tracking-wide whitespace-nowrap">回撤类型</th>
                  <th className="px-3 py-2 text-left font-medium text-violet-300/70 uppercase tracking-wide whitespace-nowrap">最小交易日</th>
                  <th className="px-3 py-2 text-left font-medium text-violet-300/70 uppercase tracking-wide whitespace-nowrap">一致性</th>
                  <th className="px-3 py-2 text-left font-medium text-violet-300/70 uppercase tracking-wide whitespace-nowrap">分成</th>
                  <th className="px-3 py-2 text-left font-medium text-violet-300/70 uppercase tracking-wide whitespace-nowrap">最低出金</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr
                    key={`${row.firmName}-${row.account.id}`}
                    className={`border-b border-white/5 transition-colors duration-150 hover:bg-violet-500/5 ${
                      idx % 2 === 0 ? 'bg-white/[0.02]' : 'bg-white/[0.04]'
                    }`}
                  >
                    <td className="px-3 py-2 whitespace-nowrap font-medium text-zinc-200">{row.firmName}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-zinc-200">{row.account.name}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-zinc-200">${row.account.accountSize.toLocaleString()}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-zinc-200">${row.account.fee}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-zinc-200">${row.account.profitTarget.toLocaleString()}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-zinc-200">${row.account.maxDrawdown.toLocaleString()}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-zinc-200">{row.account.dailyLossLimit ? `$${row.account.dailyLossLimit.toLocaleString()}` : '-'}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 rounded text-xs border ${
                        row.account.drawdownType === 'eod' ? 'bg-violet-500/15 text-violet-300 border-violet-500/30' :
                        row.account.drawdownType === 'tdd' ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' :
                        row.account.drawdownType === 'static' ? 'bg-white/5 text-zinc-300 border-white/10' :
                        'bg-violet-500/15 text-violet-200 border-violet-500/40'
                      }`}>
                        {row.account.drawdownType.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-zinc-200">{row.account.minTradingDays}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 rounded text-xs border ${
                        row.account.consistencyRule
                          ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {row.account.consistencyRule ? '是' : '否'}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-zinc-200">{row.account.payoutSplit}%</td>
                    <td className="px-3 py-2 whitespace-nowrap text-zinc-200">${row.account.payoutMinimum.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-xs text-zinc-500">
          <p>数据最后更新: 2026-05-12</p>
          <p className="mt-1">* 规则可能随时变化，请以官方最新公告为准</p>
        </div>
      </div>
    </div>
  );
}
