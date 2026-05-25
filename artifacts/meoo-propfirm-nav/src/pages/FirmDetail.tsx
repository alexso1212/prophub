import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, AlertTriangle, CheckCircle, XCircle, Globe, CreditCard, Shield } from 'lucide-react';
import type { Firm } from '../types';

interface FirmDetailProps {
  firms: Firm[];
}

const FirmDetail: React.FC<FirmDetailProps> = ({ firms }) => {
  const { slug } = useParams<{ slug: string }>();
  const firm = firms.find(f => f.slug === slug);

  if (!firm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#13131f] to-[#1a1a2e] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">平台未找到</h1>
          <Link to="/firms" className="text-violet-300 hover:text-violet-200 font-medium">
            返回平台列表
          </Link>
        </div>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300';
      case 'medium': return 'bg-violet-500/15 border border-violet-500/30 text-violet-300';
      case 'high': return 'bg-rose-500/15 border border-rose-500/30 text-rose-300';
      default: return 'bg-white/5 border border-white/10 text-zinc-400';
    }
  };

  const getCnStatusColor = (status: string) => {
    switch (status) {
      case 'supported': return 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300';
      case 'restricted': return 'bg-rose-500/15 border border-rose-500/30 text-rose-300';
      default: return 'bg-white/5 border border-white/10 text-zinc-400';
    }
  };

  const getCnStatusText = (status: string) => {
    switch (status) {
      case 'supported': return '支持中国用户';
      case 'restricted': return '限制中国用户';
      default: return '状态未知';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#13131f] to-[#1a1a2e] relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/20 blur-[120px] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/firms"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-violet-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回平台列表
          </Link>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-6">
              <img
                src={firm.logoUrl}
                alt={firm.name}
                className="w-20 h-20 rounded-xl bg-white/5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-semibold bg-gradient-to-r from-white via-violet-100 to-violet-200 bg-clip-text text-transparent">{firm.name}</h1>
                  <span className={`px-2.5 py-1 rounded-lg text-sm font-medium ${getCnStatusColor(firm.cnUserStatus)}`}>
                    {getCnStatusText(firm.cnUserStatus)}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-sm font-medium ${getRiskColor(firm.riskLevel)}`}>
                    风险: {firm.riskLevel === 'low' ? '低' : firm.riskLevel === 'medium' ? '中' : '高'}
                  </span>
                </div>
                <p className="text-zinc-300 mb-4">{firm.summary}</p>
                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <span>评分: {firm.rating}/5.0</span>
                  <span>最后核验: {firm.lastVerifiedAt}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href={firm.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-violet-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                >
                  访问官网
                  <ExternalLink className="w-4 h-4" />
                </a>
                {firm.affiliateUrl && (
                  <Link
                    to="/disclosure"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-lg font-medium hover:bg-rose-500/15 transition-all duration-200"
                  >
                    返佣披露
                    <AlertTriangle className="w-4 h-4" />
                  </Link>
                )}
                {firm.couponCode && (
                  <span className="px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-lg text-sm font-medium text-center">
                    优惠码: {firm.couponCode}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-rose-500/5 border border-rose-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-rose-300 mb-1">风险提示</h3>
                <p className="text-rose-200/80 text-sm">
                  Prop Firm 挑战账户不是投资建议，不保证收益或出金。挑战失败会损失报名费。
                  本站可能通过链接或折扣码获得佣金。
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-violet-300" />
                支持软件
              </h3>
              <div className="flex flex-wrap gap-2">
                {firm.supportedPlatforms.map(platform => (
                  <span key={platform} className="px-3 py-1 bg-white/5 border border-white/10 text-zinc-300 rounded-lg text-sm">
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-violet-300" />
                支付方式
              </h3>
              <div className="flex flex-wrap gap-2">
                {firm.paymentMethods.map(method => (
                  <span key={method} className="px-3 py-1 bg-white/5 border border-white/10 text-zinc-300 rounded-lg text-sm">
                    {method}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-300" />
                KYC 要求
              </h3>
              <p className="text-zinc-300 text-sm">{firm.kycRequirements}</p>
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">账户类型</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.06]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-violet-300/70 uppercase tracking-wide">账户</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-violet-300/70 uppercase tracking-wide">规模</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-violet-300/70 uppercase tracking-wide">费用</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-violet-300/70 uppercase tracking-wide">利润目标</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-violet-300/70 uppercase tracking-wide">最大回撤</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-violet-300/70 uppercase tracking-wide">分成</th>
                  </tr>
                </thead>
                <tbody>
                  {firm.accountTypes.map((account, idx) => (
                    <tr key={account.id} className={`border-b border-white/5 hover:bg-violet-500/5 transition-colors ${idx % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                      <td className="py-3 px-4 font-medium text-white">{account.name}</td>
                      <td className="py-3 px-4 text-zinc-200">${account.accountSize.toLocaleString()}</td>
                      <td className="py-3 px-4 text-zinc-200">${account.fee}</td>
                      <td className="py-3 px-4 text-zinc-200">${account.profitTarget.toLocaleString()}</td>
                      <td className="py-3 px-4 text-zinc-200">${account.maxDrawdown.toLocaleString()}</td>
                      <td className="py-3 px-4 text-zinc-200">{account.payoutSplit}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">适合人群</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  适合
                </h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• 有期货交易经验的交易员</li>
                  <li>• 能够遵守严格风险管理规则</li>
                  <li>• 寻求资金杠杆的交易者</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-400" />
                  不适合
                </h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li>• 无交易经验的新手</li>
                  <li>• 无法承受报名费损失</li>
                  <li>• 期望快速致富的心态</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">官方来源</h2>
            <ul className="space-y-2">
              {firm.sourceUrls.map((url, index) => (
                <li key={index}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-300 hover:text-violet-200 text-sm flex items-center gap-2 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FirmDetail;
