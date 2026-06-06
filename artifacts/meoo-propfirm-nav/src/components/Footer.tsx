import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a14] border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">关于本站</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              中文 Prop Firm 规则导航站，提供平台对比、规则解析和入门指南。帮助交易员做出明智选择。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">快速导航</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-zinc-500 text-sm hover:text-violet-300 transition-colors duration-200">首页</Link></li>
              <li><Link to="/firms" className="text-zinc-500 text-sm hover:text-violet-300 transition-colors duration-200">平台库</Link></li>
              <li><Link to="/compare" className="text-zinc-500 text-sm hover:text-violet-300 transition-colors duration-200">规则对比</Link></li>
              <li><Link to="/guides" className="text-zinc-500 text-sm hover:text-violet-300 transition-colors duration-200">新手指南</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">资源</h3>
            <ul className="space-y-2">
              <li><Link to="/software" className="text-zinc-500 text-sm hover:text-violet-300 transition-colors duration-200">软件教程</Link></li>
              <li><Link to="/payout" className="text-zinc-500 text-sm hover:text-violet-300 transition-colors duration-200">支付指南</Link></li>
              <li><Link to="/payout" className="text-zinc-500 text-sm hover:text-violet-300 transition-colors duration-200">出金教程</Link></li>
              <li><Link to="/disclosure" className="text-zinc-500 text-sm hover:text-violet-300 transition-colors duration-200">风险披露</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">社群</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-zinc-500 hover:text-violet-300 transition-colors duration-200" aria-label="Discord" aria-disabled="true">
                <i className="fab fa-discord text-xl"></i>
              </a>
              <a href="#" className="text-zinc-500 hover:text-violet-300 transition-colors duration-200" aria-label="Telegram" aria-disabled="true">
                <i className="fab fa-telegram text-xl"></i>
              </a>
              <a href="#" className="text-zinc-500 hover:text-violet-300 transition-colors duration-200" aria-label="Twitter">
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="bg-rose-500/5 border border-rose-500/30 rounded-2xl backdrop-blur-xl p-4 mb-6">
            <h4 className="text-sm font-semibold text-rose-300 mb-2 flex items-center">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              风险提示
            </h4>
            <p className="text-rose-200/80 text-xs leading-relaxed">
              Prop Firm 挑战账户不是投资建议，不保证收益或出金。挑战失败会损失报名费。交易期货涉及重大风险，可能导致本金全部损失。请确保您充分理解相关风险。
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl p-4 mb-6">
            <h4 className="text-sm font-semibold text-violet-300 mb-2 flex items-center">
              <i className="fas fa-info-circle mr-2"></i>
              返佣披露
            </h4>
            <p className="text-zinc-300 text-xs leading-relaxed">
              本站可能通过部分平台的推荐链接或折扣码获得佣金。这不会影响您的费用，但会支持我们持续更新内容。我们承诺所有评价基于独立调研，不受佣金影响。
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-zinc-500 text-xs">
            <p>&copy; {currentYear} Prop Firm 中文导航. 保留所有权利.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/disclosure" className="hover:text-violet-300 transition-colors duration-200">关于我们</Link>
              <Link to="/disclosure" className="hover:text-violet-300 transition-colors duration-200">免责声明</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
