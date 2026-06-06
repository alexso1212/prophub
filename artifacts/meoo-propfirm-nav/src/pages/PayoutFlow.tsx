import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wallet, CreditCard, Globe, Bitcoin, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';

const payoutMethods = [
  { id: 'wise', name: 'Wise', icon: Globe, color: 'from-violet-400 to-violet-600', description: '适合中国用户，手续费低，支持多币种', requirements: ['护照或身份证', '地址证明', '与 Prop Firm 姓名一致'], pros: ['手续费低', '到账快', '支持人民币', '操作简单'], cons: ['需要 KYC', '首次设置较繁琐'], steps: ['注册 Wise 账户并完成 KYC', '获取美元账户信息', '在 Prop Firm 后台添加 Wise', '提交出金申请', '等待审核', '资金到达后提现'] },
  { id: 'rise', name: 'Rise', icon: CreditCard, color: 'from-violet-500 to-violet-700', description: '专为自由职业者和交易员设计的支付平台', requirements: ['身份证明', '地址证明'], pros: ['专为出金设计', '支持多平台', '费率透明'], cons: ['知名度较低', '部分地区受限'], steps: ['注册 Rise 账户', '完成身份验证', '获取账户信息', '在 Prop Firm 添加出金方式', '申请出金', '资金到账后提现'] },
  { id: 'crypto', name: '加密货币', icon: Bitcoin, color: 'from-violet-300 to-violet-500', description: 'USDT 等稳定币出金，速度快但波动风险', requirements: ['加密货币钱包', '了解基本操作'], pros: ['速度快', '24/7 可用', '隐私性好'], cons: ['价格波动风险', '需要额外兑换', '操作复杂'], steps: ['准备加密货币钱包', '获取钱包地址', '在 Prop Firm 选择加密出金', '提交钱包地址', '等待审核和转账', '在交易所出售换成法币'] }
];

export default function PayoutFlow() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'steps' | 'pros' | 'requirements'>('steps');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#13131f] to-[#1a1a2e] relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/20 blur-[120px] pointer-events-none" />

      <div className="pt-8 pb-12 px-4 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-violet-500/20 border border-violet-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-violet-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">出金方式</h2>
            <p className="text-zinc-400">选择适合你的出金路径，提前了解流程</p>
          </div>

          {!selectedMethod ? (
            <div className="space-y-4">
              {payoutMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <motion.button key={method.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => setSelectedMethod(method.id)} className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-left hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg">{method.name}</h3>
                        <p className="text-zinc-300 text-sm mt-1">{method.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {method.pros.slice(0, 2).map((pro, i) => <span key={i} className="text-xs text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-1 rounded-full">{pro}</span>)}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-500" />
                    </div>
                  </motion.button>
                );
              })}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6 p-4 bg-violet-500/5 border border-violet-500/30 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-zinc-300">
                  <p className="font-medium mb-1 text-white">重要提示</p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    <li>已完成 KYC 验证</li>
                    <li>出金账户姓名与 Prop Firm 注册姓名完全一致</li>
                    <li>已达到最低出金门槛</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <button onClick={() => setSelectedMethod(null)} className="mb-6 text-zinc-400 hover:text-zinc-300 text-sm flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                返回选择
              </button>
              {(() => {
                const method = payoutMethods.find(m => m.id === selectedMethod)!;
                const Icon = method.icon;
                return (
                  <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-md`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-xl">{method.name}</h3>
                          <p className="text-zinc-400 text-sm">{method.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex border-b border-white/10">
                      {[{ id: 'steps', label: '操作步骤' }, { id: 'requirements', label: '所需材料' }, { id: 'pros', label: '优缺点' }].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-violet-300 border-b-2 border-violet-500' : 'text-zinc-500 hover:text-zinc-300'}`}>{tab.label}</button>
                      ))}
                    </div>
                    <div className="p-6">
                      {activeTab === 'steps' && (
                        <div className="space-y-4">
                          {method.steps.map((step, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 flex items-center justify-center text-xs font-medium flex-shrink-0">{index + 1}</div>
                              <p className="text-zinc-300 text-sm">{step}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {activeTab === 'requirements' && (
                        <div className="space-y-2">
                          {method.requirements.map((req, index) => (
                            <div key={index} className="flex items-center gap-2 p-3 bg-white/[0.04] rounded-lg">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              <span className="text-zinc-300 text-sm">{req}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {activeTab === 'pros' && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-emerald-300 mb-2">优点</h4>
                            <div className="flex flex-wrap gap-2">
                              {method.pros.map((pro, index) => <span key={index} className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm rounded-full">{pro}</span>)}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-rose-300 mb-2">缺点</h4>
                            <div className="flex flex-wrap gap-2">
                              {method.cons.map((con, index) => <span key={index} className="px-3 py-1 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm rounded-full">{con}</span>)}
                            </div>
                          </div>
                        </div>
                      )}
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
