import { motion } from 'framer-motion';
import { AlertTriangle, Shield, RefreshCw, ExternalLink } from 'lucide-react';

export default function Disclosure() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#13131f] to-[#1a1a2e] relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/20 blur-[120px] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-white via-violet-100 to-violet-200 bg-clip-text text-transparent mb-4">
            风险披露与免责声明
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            在使用本站服务前，请仔细阅读以下重要信息
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-rose-500/5 border border-rose-500/30 rounded-2xl backdrop-blur-xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-rose-500/20 border border-rose-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-rose-200 mb-2">交易风险提示</h2>
              <div className="text-rose-200/80 text-sm space-y-2">
                <p>期货交易涉及高风险，可能导致您损失全部本金。</p>
                <p>Prop Firm 挑战账户不是投资建议，不保证收益或出金。</p>
                <p>挑战失败将损失报名费，请只用可承受损失的资金参与。</p>
                <p>过往表现不代表未来结果，市场条件可能随时变化。</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-violet-500/20 border border-violet-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-5 h-5 text-violet-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">返佣披露</h2>
              <p className="text-zinc-300 text-sm mb-3">
                本站可能通过以下方式获得收益：
              </p>
              <ul className="text-zinc-300 text-sm space-y-1 list-disc list-inside">
                <li>部分平台链接包含联盟营销代码，用户通过链接注册可能产生佣金</li>
                <li>部分折扣码为联盟专属代码，使用可能为本站带来收益</li>
                <li>平台展示顺序可能受合作关系影响，但评分和评价保持独立客观</li>
              </ul>
              <p className="text-zinc-500 text-xs mt-4">
                本披露最后更新：2026年5月13日
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-violet-500/20 border border-violet-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-violet-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">免责声明</h2>
              <div className="text-zinc-300 text-sm space-y-2">
                <p>
                  本站提供的所有信息仅供参考，不构成投资建议、交易建议或任何专业建议。
                </p>
                <p>
                  我们不保证信息的准确性、完整性或及时性。平台规则可能随时变更，请以官方信息为准。
                </p>
                <p>
                  用户应自行承担使用本站信息的风险，我们不对任何损失承担责任。
                </p>
                <p>
                  本站不提供喊单、带单、代操服务，也不承诺"包过"或"稳赚"。
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">数据更新说明</h2>
              <div className="text-zinc-300 text-sm space-y-2">
                <p>
                  我们努力保持平台信息的准确性，每个平台详情页都标注了最后核验日期。
                </p>
                <p>
                  由于平台规则可能随时变更，建议用户在做出决策前：
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>直接访问平台官网确认最新规则</li>
                  <li>查看平台的官方文档和FAQ</li>
                  <li>联系平台客服获取准确信息</li>
                </ul>
                <p className="mt-3">
                  如发现信息有误或过时，欢迎通过纠错入口反馈，我们会尽快核实更新。
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-zinc-500 text-sm">
            继续使用本站即表示您已阅读并理解上述披露内容
          </p>
        </motion.div>
      </div>
    </div>
  );
}
