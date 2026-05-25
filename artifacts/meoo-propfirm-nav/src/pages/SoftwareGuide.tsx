import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Monitor, ChevronRight, CheckCircle } from 'lucide-react';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

const softwareList = [
  { id: 'tradovate', name: 'Tradovate', difficulty: 'beginner' as Difficulty, description: '基于网页的交易平台，无需安装，支持多家 Prop Firm', features: ['网页端直接交易', '简洁直观的界面', '支持多家 Prop Firm', '免费模拟账户'], steps: ['访问 tradovate.com 注册账户', '使用 Prop Firm 提供的登录凭据', '首次登录设置 2FA 验证', '熟悉界面布局', '开始交易或练习'] },
  { id: 'rithmic', name: 'Rithmic', difficulty: 'intermediate' as Difficulty, description: '专业级数据服务，低延迟执行，适合有经验的交易员', features: ['低延迟市场数据', '专业级执行速度', '支持 NinjaTrader/Quantower', '稳定的连接'], steps: ['通过 Prop Firm 获取 Rithmic 账户', '下载 Rithmic 客户端', '签署数据使用协议', '配置连接参数', '测试连接并开始交易'] },
  { id: 'ninjatrader', name: 'NinjaTrader', difficulty: 'advanced' as Difficulty, description: '功能强大的桌面交易软件，适合专业交易员', features: ['强大的图表功能', '自动化交易支持', '丰富的技术指标', '深度市场数据'], steps: ['下载并安装 NinjaTrader', '配置 Rithmic 连接', '设置工作区和图表', '导入或创建策略', '连接并开始交易'] }
];

const difficultyLabels: Record<Difficulty, { label: string; color: string }> = {
  beginner: { label: '入门', color: 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' },
  intermediate: { label: '进阶', color: 'bg-violet-500/15 border border-violet-500/30 text-violet-300' },
  advanced: { label: '高级', color: 'bg-rose-500/15 border border-rose-500/30 text-rose-300' }
};

export default function SoftwareGuide() {
  const [selectedSoftware, setSelectedSoftware] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, number>>({});

  const toggleStep = (softwareId: string, stepIndex: number) => {
    setCompletedSteps(prev => ({ ...prev, [softwareId]: Math.max(prev[softwareId] || 0, stepIndex + 1) }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#13131f] to-[#1a1a2e] relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/20 blur-[120px] pointer-events-none" />

      <div className="pt-8 pb-12 px-4 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-violet-500/20 border border-violet-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-8 h-8 text-violet-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">交易软件配置</h2>
            <p className="text-zinc-400">选择你使用的平台，按步骤完成配置</p>
          </div>

          {!selectedSoftware ? (
            <div className="space-y-4">
              {softwareList.map((software, index) => (
                <motion.div key={software.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <button onClick={() => setSelectedSoftware(software.id)} className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-left hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-white text-lg">{software.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${difficultyLabels[software.difficulty].color}`}>{difficultyLabels[software.difficulty].label}</span>
                        </div>
                        <p className="text-zinc-300 text-sm mb-3">{software.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {software.features.map((feature, i) => <span key={i} className="text-xs text-zinc-400 bg-white/5 border border-white/10 px-2 py-1 rounded">{feature}</span>)}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-500" />
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <button onClick={() => setSelectedSoftware(null)} className="mb-6 text-zinc-400 hover:text-zinc-300 text-sm flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                返回选择
              </button>
              {(() => {
                const software = softwareList.find(s => s.id === selectedSoftware)!;
                const completed = completedSteps[software.id] || 0;
                const progress = (completed / software.steps.length) * 100;
                return (
                  <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-white text-xl">{software.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${difficultyLabels[software.difficulty].color}`}>{difficultyLabels[software.difficulty].label}</span>
                      </div>
                      <p className="text-zinc-300">{software.description}</p>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-zinc-400">配置进度</span>
                          <span className="font-medium text-violet-300">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full">
                          <div className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-semibold text-white mb-4">配置步骤</h4>
                      <div className="space-y-3">
                        {software.steps.map((step, index) => (
                          <motion.button key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} onClick={() => toggleStep(software.id, index)} className={`w-full flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left ${completed > index ? 'bg-violet-500/10 border-violet-500/40' : 'bg-white/[0.02] border-white/10 hover:border-violet-500/30'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${completed > index ? 'bg-violet-500' : 'bg-white/10'}`}>
                              {completed > index ? <CheckCircle className="w-4 h-4 text-white" /> : <span className="text-xs text-zinc-400 font-medium">{index + 1}</span>}
                            </div>
                            <span className={`text-sm ${completed > index ? 'text-violet-200' : 'text-zinc-300'}`}>{step}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
