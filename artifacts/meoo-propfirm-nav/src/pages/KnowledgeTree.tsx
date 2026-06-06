import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, Scale, Clock, Shield, ChevronDown, ChevronUp } from 'lucide-react';

const knowledgeNodes = [
  {
    id: 'basics',
    title: '基础概念',
    icon: BookOpen,
    color: 'from-violet-400 to-violet-600',
    description: '了解 Prop Firm 的基本运作模式',
    children: [
      { id: 'what-is', title: '什么是 Prop Firm', slug: 'what-is-futures-prop-firm', desc: '期货自营交易公司的运作原理' },
      { id: 'account-types', title: '账户类型区别', slug: 'account-types', desc: '评估账户 vs 资金账户 vs 免考账户' },
      { id: 'vs-cfd', title: '与 CFD Prop Firm 区别', slug: 'vs-cfd', desc: '期货和差价合约的不同' }
    ]
  },
  {
    id: 'rules',
    title: '核心规则',
    icon: Scale,
    color: 'from-violet-500 to-violet-700',
    description: '掌握必须通过的关键规则',
    children: [
      { id: 'drawdown', title: '回撤规则详解', slug: 'drawdown-rules', desc: 'EOD、TDD、静态、追踪回撤' },
      { id: 'consistency', title: '一致性规则', slug: 'consistency-rule', desc: '为什么有这个规则，如何避免违规' },
      { id: 'intraday', title: '日内平仓要求', slug: 'intraday-liquidation', desc: '为什么必须日内平仓' }
    ]
  },
  {
    id: 'process',
    title: '流程指南',
    icon: Clock,
    color: 'from-violet-300 to-violet-500',
    description: '从注册到出金的完整流程',
    children: [
      { id: 'kyc', title: 'KYC 认证流程', slug: 'kyc-guide', desc: '身份验证和地址证明' },
      { id: 'low-cost', title: '低成本试错路径', slug: 'low-cost-path', desc: '新手如何以最小成本开始' }
    ]
  },
  {
    id: 'risks',
    title: '风险提示',
    icon: Shield,
    color: 'from-rose-400 to-rose-600',
    description: '了解潜在风险和避坑指南',
    children: [
      { id: 'common-mistakes', title: '新手常见错误', slug: 'common-mistakes', desc: '避免这些坑，提高通过率' },
      { id: 'red-flags', title: '平台红旗信号', slug: 'red-flags', desc: '哪些平台需要谨慎' }
    ]
  }
];

export default function KnowledgeTree() {
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['basics']);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#13131f] to-[#1a1a2e] relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/20 blur-[120px] pointer-events-none" />

      <div className="pt-8 pb-12 px-4 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-violet-500/20 border border-violet-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-violet-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">知识体系</h2>
            <p className="text-zinc-400">点击展开各主题，系统学习 Prop Firm 知识</p>
          </div>

          <div className="space-y-4">
            {knowledgeNodes.map((node, index) => {
              const Icon = node.icon;
              const isExpanded = expandedNodes.includes(node.id);
              return (
                <motion.div key={node.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                  <button onClick={() => toggleNode(node.id)} className="w-full p-5 flex items-center justify-between hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${node.color} flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{node.title}</h3>
                        <p className="text-zinc-400 text-sm">{node.description}</p>
                      </div>
                    </div>
                    <div className="text-zinc-500">{isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="border-t border-white/10">
                        <div className="p-4 space-y-2">
                          {node.children.map((child, childIndex) => (
                            <motion.div key={child.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: childIndex * 0.05 }}>
                              <Link to={`/guides/${child.slug}`}>
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.04] transition-colors group">
                                  <div>
                                    <div className="font-medium text-zinc-300 group-hover:text-white">{child.title}</div>
                                    <div className="text-zinc-500 text-sm">{child.desc}</div>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-violet-300" />
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
