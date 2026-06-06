import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { guidesData } from '../data/guides';
import type { Guide } from '../types';

const categories = [
  { value: 'all', label: '全部' },
  { value: 'beginner', label: '入门指南' },
  { value: 'roadmap', label: '路径指南' },
  { value: 'software', label: '软件教程' },
  { value: 'payment', label: '支付教程' },
  { value: 'payout', label: '出金教程' }
];

const categoryLabels: Record<string, string> = {
  beginner: '入门指南',
  roadmap: '路径指南',
  software: '软件教程',
  payment: '支付教程',
  payout: '出金教程'
};

const difficultyConfig: Record<string, { label: string; chip: string }> = {
  beginner: {
    label: '入门',
    chip: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
  },
  intermediate: {
    label: '进阶',
    chip: 'bg-violet-500/10 border border-violet-500/30 text-violet-300'
  },
  advanced: {
    label: '高级',
    chip: 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
  }
};

export default function Guides() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredGuides = activeCategory === 'all'
    ? guidesData
    : guidesData.filter((g: Guide) => g.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#13131f] to-[#1a1a2e] relative overflow-hidden">
      {/* Top glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/20 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-20 relative z-10">

        {/* Hero */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-xs font-medium tracking-wide uppercase text-violet-300">
            学习中心
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-100 to-violet-200 mt-6">
            新手指南
          </h1>
          <p className="text-lg text-zinc-400 mt-4 max-w-2xl mx-auto">
            从入门到精通，系统学习 Prop Firm 交易知识
          </p>
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-12 mb-16">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.value
                  ? 'bg-gradient-to-r from-violet-500/80 to-violet-700/80 border border-violet-400/50 text-white shadow-[0_0_30px_rgba(139,92,246,0.3)]'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGuides.map((guide: Guide, index: number) => {
            const difficulty = difficultyConfig[guide.difficulty] ?? difficultyConfig.beginner;
            const catLabel = categoryLabels[guide.category] ?? guide.category;
            return (
              <Link key={guide.id} to={`/guides/${guide.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-all cursor-pointer"
                >
                  {/* Category + difficulty */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold tracking-wider uppercase text-violet-400">
                      {catLabel}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficulty.chip}`}>
                      {difficulty.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-200 group-hover:to-violet-300 transition-all">
                    {guide.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-5">
                    {guide.summary}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-zinc-500">更新 {guide.lastUpdatedAt}</span>
                    <div className="flex items-center gap-1 text-sm text-violet-300 group-hover:text-violet-200 group-hover:translate-x-1 transition-all">
                      阅读
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3">还没找到答案？</h3>
          <p className="text-zinc-400 mb-6">回到首页思维导图，按你的需求路径探索</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-700 text-white font-medium rounded-full hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all"
          >
            返回 MindMap 首页
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
