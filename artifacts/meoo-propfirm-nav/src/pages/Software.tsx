import { motion } from 'framer-motion';
import { Monitor, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { softwareList } from '../data/guides';

const difficultyLabels: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级'
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  intermediate: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
  advanced: 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
};

export default function Software() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#13131f] to-[#1a1a2e] relative overflow-hidden">
      {/* Top glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/20 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-100 to-violet-200 mb-4">
            交易软件教程
          </h1>
          <p className="text-base text-zinc-400 max-w-2xl mx-auto">
            主流 Prop Firm 支持的交易平台使用指南
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {softwareList.map((software, index) => (
            <motion.div
              key={software.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                to={`/software/${software.slug}`}
                className="block group bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-200 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-violet-500/20 border border-violet-500/30 rounded-lg flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-violet-300" />
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColors[software.difficulty]}`}>
                    {difficultyLabels[software.difficulty]}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {software.name}
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                  {software.description}
                </p>

                <div className="flex items-center text-sm text-violet-300 font-medium group-hover:translate-x-1 transition-transform duration-200">
                  查看教程
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
