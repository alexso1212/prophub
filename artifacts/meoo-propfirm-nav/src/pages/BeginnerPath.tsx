import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sprout, BookOpen, Building2, Monitor, Wallet, CheckCircle } from 'lucide-react';

const steps = [
  { id: 1, title: '了解基础概念', icon: BookOpen, color: 'from-violet-400 to-violet-600', desc: '什么是 Prop Firm？和 CFD 有什么区别？', action: { label: '开始学习', path: '/guides/what-is-futures-prop-firm' }, time: '5分钟' },
  { id: 2, title: '理解核心规则', icon: Sprout, color: 'from-violet-500 to-violet-700', desc: '回撤、一致性、日内平仓等关键规则', action: { label: '查看规则', path: '/knowledge' }, time: '10分钟' },
  { id: 3, title: '选择合适平台', icon: Building2, color: 'from-violet-300 to-violet-500', desc: '根据你的经验和预算，找到最适合的平台', action: { label: '去选平台', path: '/platforms' }, time: '5分钟' },
  { id: 4, title: '配置交易软件', icon: Monitor, color: 'from-violet-400 to-violet-600', desc: 'Tradovate 或 Rithmic 的连接教程', action: { label: '软件教程', path: '/software-guide' }, time: '15分钟' },
  { id: 5, title: '了解出金流程', icon: Wallet, color: 'from-violet-500 to-violet-700', desc: 'Wise、Rise 等出金方式提前了解', action: { label: '出金指南', path: '/payout' }, time: '10分钟' }
];

export default function BeginnerPath() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#13131f] to-[#1a1a2e] relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/20 blur-[120px] pointer-events-none" />

      <div className="pt-8 pb-12 px-4 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-violet-500/20 border border-violet-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sprout className="w-8 h-8 text-violet-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">新手学习路径</h2>
            <p className="text-zinc-400">按照以下步骤，系统掌握 Prop Firm 交易知识</p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-violet-500/30" />
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === steps.length - 1;
                return (
                  <motion.div key={step.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.15 }} className="relative flex gap-6">
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      {!isLast && <div className="absolute top-16 left-1/2 transform -translate-x-1/2"><div className="w-0.5 h-6 bg-violet-500/30" /></div>}
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-xs font-medium text-violet-400 uppercase tracking-wide">步骤 {step.id}</span>
                            <h3 className="font-bold text-white text-lg mt-1">{step.title}</h3>
                          </div>
                          <span className="text-xs text-zinc-400 bg-white/5 border border-white/10 px-2 py-1 rounded-full">{step.time}</span>
                        </div>
                        <p className="text-zinc-300 text-sm mb-4">{step.desc}</p>
                        <Link to={step.action.path} className="inline-flex items-center gap-2 text-sm font-medium text-violet-300 hover:text-violet-200 group">
                          {step.action.label}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              完成以上步骤后，你就可以开始实战了
            </div>
            <p className="text-zinc-500 text-sm mt-4">记住：Prop Firm 不是快速致富的捷径，需要认真对待</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
