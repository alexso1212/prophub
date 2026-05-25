import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Filter, X, Globe, CreditCard, Monitor, TrendingDown } from 'lucide-react';
import { firmsData, platforms, drawdownTypes, feeTypes } from '../data/firms';
import type { Firm, FilterState } from '../types';

const cnStatusOptions = [
  { value: 'supported', label: '支持', color: 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' },
  { value: 'restricted', label: '受限', color: 'bg-rose-500/15 border border-rose-500/30 text-rose-300' },
  { value: 'unknown', label: '未知', color: 'bg-white/5 border border-white/10 text-zinc-400' }
];

const riskColors = {
  low: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  medium: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  high: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
};

export default function FirmsList() {
  const [filters, setFilters] = useState<FilterState>({
    cnUserStatus: [],
    feeType: [],
    platforms: [],
    drawdownType: []
  });

  const filteredFirms = useMemo(() => {
    return firmsData.filter((firm: Firm) => {
      if (filters.cnUserStatus.length > 0 && !filters.cnUserStatus.includes(firm.cnUserStatus)) return false;
      if (filters.platforms.length > 0 && !filters.platforms.some(p => firm.supportedPlatforms.includes(p))) return false;
      if (filters.feeType.length > 0 && !firm.accountTypes.some(a => filters.feeType.includes(a.feeType))) return false;
      if (filters.drawdownType.length > 0 && !firm.accountTypes.some(a => filters.drawdownType.includes(a.drawdownType))) return false;
      return true;
    });
  }, [filters]);

  const hasActiveFilters = filters.cnUserStatus.length > 0 || filters.feeType.length > 0 || filters.platforms.length > 0 || filters.drawdownType.length > 0;

  const clearFilters = () => setFilters({ cnUserStatus: [], feeType: [], platforms: [], drawdownType: [] });

  const toggleFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const current = prev[key] as string[];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#13131f] to-[#1a1a2e] relative overflow-hidden">
      {/* Top glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/20 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-20 relative z-10">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-xs font-medium tracking-wide uppercase text-violet-300">
            平台库
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-100 to-violet-200 mt-6">
            Prop Firm 平台
          </h1>
          <p className="text-lg text-zinc-400 mt-4 max-w-2xl mx-auto">
            对比 {firmsData.length} 家期货自营交易公司
          </p>
        </div>

        {/* Filter panel */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-violet-300/70" />
            <span className="text-sm font-medium text-zinc-300">筛选</span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1 px-3 py-1.5 text-xs rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 transition-colors duration-150"
              >
                <X className="w-3 h-3" />
                清空筛选
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Globe className="w-3.5 h-3.5 text-violet-300/70" />
                <span className="text-xs font-medium text-violet-300/70 uppercase tracking-wide">中国用户</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cnStatusOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => toggleFilter('cnUserStatus', opt.value)}
                    className={`px-2.5 py-1 text-xs rounded-full transition-all duration-150 ${
                      filters.cnUserStatus.includes(opt.value)
                        ? 'bg-gradient-to-r from-violet-500/80 to-violet-700/80 border border-violet-400/50 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                        : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <CreditCard className="w-3.5 h-3.5 text-violet-300/70" />
                <span className="text-xs font-medium text-violet-300/70 uppercase tracking-wide">费用模式</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {feeTypes.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => toggleFilter('feeType', opt.value)}
                    className={`px-2.5 py-1 text-xs rounded-full transition-all duration-150 ${
                      filters.feeType.includes(opt.value)
                        ? 'bg-gradient-to-r from-violet-500/80 to-violet-700/80 border border-violet-400/50 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                        : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Monitor className="w-3.5 h-3.5 text-violet-300/70" />
                <span className="text-xs font-medium text-violet-300/70 uppercase tracking-wide">交易软件</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {platforms.slice(0, 5).map(p => (
                  <button
                    key={p}
                    onClick={() => toggleFilter('platforms', p)}
                    className={`px-2.5 py-1 text-xs rounded-full transition-all duration-150 ${
                      filters.platforms.includes(p)
                        ? 'bg-gradient-to-r from-violet-500/80 to-violet-700/80 border border-violet-400/50 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                        : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingDown className="w-3.5 h-3.5 text-violet-300/70" />
                <span className="text-xs font-medium text-violet-300/70 uppercase tracking-wide">回撤类型</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {drawdownTypes.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => toggleFilter('drawdownType', opt.value)}
                    className={`px-2.5 py-1 text-xs rounded-full transition-all duration-150 ${
                      filters.drawdownType.includes(opt.value)
                        ? 'bg-gradient-to-r from-violet-500/80 to-violet-700/80 border border-violet-400/50 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                        : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-violet-300/60 mb-4">
          共 {filteredFirms.length} 个平台
        </div>

        {filteredFirms.length === 0 && (
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center justify-center py-16 text-center">
            <span className="text-sm text-zinc-500">没有符合筛选条件的平台，试试调整筛选项</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFirms.map((firm: Firm, idx: number) => (
            <motion.div
              key={firm.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
            >
              <Link
                to={`/firms/${firm.slug}`}
                className="block bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-all duration-200 cursor-pointer group"
              >
                <div className="p-4">
                  <div className="flex items-start gap-2.5 mb-3">
                    <img src={firm.logoUrl} alt={firm.name} className="w-9 h-9 rounded-lg bg-white/5" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-200 group-hover:to-violet-300 transition-all">
                        {firm.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                          cnStatusOptions.find(s => s.value === firm.cnUserStatus)?.color || 'bg-white/5 border border-white/10 text-zinc-400'
                        }`}>
                          {cnStatusOptions.find(s => s.value === firm.cnUserStatus)?.label}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${riskColors[firm.riskLevel]}`}>
                          {firm.riskLevel === 'low' ? '低风险' : firm.riskLevel === 'medium' ? '中风险' : '高风险'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
                    {firm.summary}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {firm.supportedPlatforms.slice(0, 3).map(p => (
                      <span key={p} className="text-[10px] px-1.5 py-0.5 bg-white/5 border border-white/10 text-zinc-400 rounded-full">
                        {p}
                      </span>
                    ))}
                    {firm.supportedPlatforms.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-white/5 border border-white/10 text-zinc-400 rounded-full">
                        +{firm.supportedPlatforms.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-zinc-300">{firm.rating}</span>
                      <span className="text-[10px] text-zinc-500">/5</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      更新 {firm.lastVerifiedAt.slice(5)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
