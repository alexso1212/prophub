import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Check, Building2, Wallet, Monitor, Globe } from 'lucide-react';
import { firmsData } from '../data/firms';

const questions = [
  {
    id: 'experience',
    question: '你的交易经验如何？',
    icon: Building2,
    options: [
      { value: 'newbie', label: '完全新手', desc: '第一次接触期货或 Prop Firm' },
      { value: 'some', label: '有一些经验', desc: '做过模拟盘或小额实盘' },
      { value: 'experienced', label: '经验丰富', desc: '有稳定交易策略，寻求资金' }
    ]
  },
  {
    id: 'budget',
    question: '你的预算范围？',
    icon: Wallet,
    options: [
      { value: 'low', label: '$50-150', desc: '想低成本试错' },
      { value: 'medium', label: '$150-350', desc: '标准预算' },
      { value: 'high', label: '$350+', desc: '追求大账户' }
    ]
  },
  {
    id: 'platform',
    question: '你偏好哪种交易软件？',
    icon: Monitor,
    options: [
      { value: 'tradovate', label: 'Tradovate', desc: '网页版，简单易用' },
      { value: 'rithmic', label: 'Rithmic', desc: '专业级，低延迟' },
      { value: 'ninjatrader', label: 'NinjaTrader', desc: '功能强大，桌面端' },
      { value: 'any', label: '都可以', desc: '没有特别偏好' }
    ]
  },
  {
    id: 'region',
    question: '你所在地区？',
    icon: Globe,
    options: [
      { value: 'cn', label: '中国大陆', desc: '需要支持中国用户' },
      { value: 'other', label: '其他地区', desc: '海外或港澳台' }
    ]
  }
];

export default function PlatformSelector() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentStep].id]: value };
    setAnswers(newAnswers);
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const getRecommendedFirms = () => {
    let filtered = [...firmsData];
    if (answers.region === 'cn') {
      filtered = filtered.filter(f => f.cnUserStatus === 'supported');
    }
    if (answers.budget === 'low') {
      filtered = filtered.filter(f => f.accountTypes.some(a => a.fee <= 150));
    } else if (answers.budget === 'high') {
      filtered = filtered.filter(f => f.accountTypes.some(a => a.accountSize >= 100000));
    }
    if (answers.platform && answers.platform !== 'any') {
      filtered = filtered.filter(f => f.supportedPlatforms.some(p => p.toLowerCase().includes(answers.platform)));
    }
    if (answers.experience === 'newbie') {
      filtered = filtered.filter(f => f.riskLevel === 'low');
    }
    return filtered.slice(0, 3);
  };

  const progress = ((currentStep + (showResults ? 1 : 0)) / (questions.length + 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#13131f] to-[#1a1a2e] relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/20 blur-[120px] pointer-events-none" />

      <div className="h-1 bg-white/10">
        <motion.div className="h-full bg-gradient-to-r from-violet-500 to-violet-400" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
      </div>

      <div className="pt-4 pb-12 px-4 relative">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-violet-500/20 border border-violet-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {(() => { const Icon = questions[currentStep].icon; return <Icon className="w-8 h-8 text-violet-300" />; })()}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{questions[currentStep].question}</h2>
                  <p className="text-zinc-400">选择最符合你情况的选项</p>
                </div>
                <div className="space-y-3">
                  {questions[currentStep].options.map((option, index) => (
                    <motion.button key={option.value} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => handleAnswer(option.value)} className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-left hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] transition-all group">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white text-lg">{option.label}</div>
                          <div className="text-zinc-400 text-sm mt-1">{option.desc}</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-violet-300 transition-colors" />
                      </div>
                    </motion.button>
                  ))}
                </div>
                {currentStep > 0 && (
                  <button onClick={() => setCurrentStep(currentStep - 1)} className="mt-6 text-zinc-400 hover:text-zinc-300 text-sm">← 返回上一题</button>
                )}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">为你推荐</h2>
                  <p className="text-zinc-400">基于你的选择，这些平台最适合你</p>
                </div>
                <div className="space-y-4">
                  {getRecommendedFirms().map((firm, index) => (
                    <motion.div key={firm.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15 }}>
                      <Link to={`/firms/${firm.slug}`}>
                        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] transition-all">
                          <div className="flex items-start gap-4">
                            <img src={firm.logoUrl} alt={firm.name} className="w-14 h-14 rounded-xl" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-white text-lg">{firm.name}</h3>
                                <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs rounded-full">{firm.rating}分</span>
                              </div>
                              <p className="text-zinc-300 text-sm mb-2">{firm.summary}</p>
                              <div className="flex flex-wrap gap-2">
                                {firm.supportedPlatforms.slice(0, 3).map(p => <span key={p} className="px-2 py-1 bg-white/5 border border-white/10 text-zinc-400 text-xs rounded">{p}</span>)}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-violet-300" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <button onClick={() => { setCurrentStep(0); setAnswers({}); setShowResults(false); }} className="text-violet-300 hover:text-violet-200 font-medium">重新选择条件</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
