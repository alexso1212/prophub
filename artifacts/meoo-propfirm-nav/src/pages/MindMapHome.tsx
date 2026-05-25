import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sprout, Building2, BookOpen, Monitor, Wallet, AlertTriangle, ChevronRight } from 'lucide-react';

const rootNodes = [
  {
    id: 'beginner',
    label: '我是新手',
    subtitle: '从零开始了解',
    icon: Sprout,
    iconGradient: 'from-violet-400 to-violet-600',
    cardBg: 'bg-white/[0.04]',
    cardBorder: 'border-violet-500/20',
    cardHoverGlow: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]',
    textColor: 'text-violet-200',
    path: '/beginner',
    description: '第一次接触 Prop Firm？从这里开始了解基本概念'
  },
  {
    id: 'platforms',
    label: '我要选平台',
    subtitle: '找到最适合的',
    icon: Building2,
    iconGradient: 'from-violet-500 to-violet-700',
    cardBg: 'bg-white/[0.04]',
    cardBorder: 'border-violet-500/25',
    cardHoverGlow: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.35)]',
    textColor: 'text-violet-200',
    path: '/platforms',
    description: '根据你的需求和条件，筛选推荐最适合的平台'
  },
  {
    id: 'knowledge',
    label: '我要学规则',
    subtitle: '掌握核心知识',
    icon: BookOpen,
    iconGradient: 'from-violet-400 to-violet-600',
    cardBg: 'bg-white/[0.04]',
    cardBorder: 'border-violet-500/20',
    cardHoverGlow: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]',
    textColor: 'text-violet-200',
    path: '/knowledge',
    description: '深入理解回撤、一致性、日内平仓等关键规则'
  },
  {
    id: 'software',
    label: '我要配软件',
    subtitle: '连接交易平台',
    icon: Monitor,
    iconGradient: 'from-violet-500 to-violet-700',
    cardBg: 'bg-white/[0.04]',
    cardBorder: 'border-violet-500/25',
    cardHoverGlow: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.35)]',
    textColor: 'text-violet-200',
    path: '/software-guide',
    description: 'Tradovate、Rithmic 等平台连接配置教程'
  },
  {
    id: 'payout',
    label: '我要出金',
    subtitle: '资金回流指南',
    icon: Wallet,
    iconGradient: 'from-violet-400 to-violet-600',
    cardBg: 'bg-white/[0.04]',
    cardBorder: 'border-violet-500/20',
    cardHoverGlow: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]',
    textColor: 'text-violet-200',
    path: '/payout',
    description: 'Wise、Rise、加密货币等多种出金方式详解'
  }
];

type BreakpointConfig = {
  radius: number;
  nodeWidth: string;
  centerSize: string;
  isMobile: boolean;
};

function getBreakpointConfig(width: number): BreakpointConfig {
  if (width < 640) {
    return { radius: 140, nodeWidth: 'w-32', centerSize: 'w-24 h-24', isMobile: true };
  } else if (width < 1024) {
    return { radius: 220, nodeWidth: 'w-36', centerSize: 'w-28 h-28', isMobile: false };
  } else {
    return { radius: 280, nodeWidth: 'w-44', centerSize: 'w-32 h-32', isMobile: false };
  }
}

export default function MindMapHome() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [bpConfig, setBpConfig] = useState<BreakpointConfig>(() =>
    getBreakpointConfig(typeof window !== 'undefined' ? window.innerWidth : 1280)
  );

  useEffect(() => {
    const handleResize = () => setBpConfig(getBreakpointConfig(window.innerWidth));
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getNodePosition = (index: number, total: number) => {
    const angle = (index * 360) / total - 90;
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * bpConfig.radius,
      y: Math.sin(radian) * bpConfig.radius
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#13131f] to-[#1a1a2e] relative overflow-hidden">
      <div className="relative w-full min-h-screen flex items-center justify-center py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-700/15 rounded-full mix-blend-screen filter blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-violet-500/10 rounded-full opacity-20" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-violet-500/10 rounded-full opacity-20" />
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute top-8 left-0 right-0 text-center z-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-100 to-violet-200">Prop Firm 导航</h1>
          <p className="text-zinc-400 mt-2 text-sm">中文期货自营交易知识库</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
          <Link to="/disclosure" className="flex items-center gap-1.5 text-violet-300 hover:text-violet-200 text-xs sm:text-sm font-medium px-3 py-1.5 sm:px-4 sm:py-2 bg-violet-500/10 rounded-full border border-violet-500/30 backdrop-blur-xl transition-colors">
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            风险提示与免责声明
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          </Link>
        </motion.div>

        <div className="relative w-full max-w-4xl flex items-center justify-center"
          style={{ height: `${bpConfig.radius * 2 + 200}px` }}>
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="absolute z-20">
            <div className={`${bpConfig.centerSize} rounded-full bg-gradient-to-br from-violet-500 via-violet-600 to-violet-700 shadow-[0_0_60px_rgba(139,92,246,0.5)] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform`}>
              <div className="text-center">
                <div className="text-white font-bold text-base sm:text-lg">开始</div>
                <div className="text-violet-200 text-xs hidden sm:block">选择你的需求</div>
              </div>
            </div>
          </motion.div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {rootNodes.map((node, index) => {
              const pos = getNodePosition(index, rootNodes.length);
              return (
                <motion.line
                  key={`line-${node.id}`}
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${pos.x}px)`}
                  y2={`calc(50% + ${pos.y}px)`}
                  stroke={hoveredNode === node.id ? 'rgba(167,139,250,0.6)' : 'rgba(167,139,250,0.15)'}
                  strokeWidth={hoveredNode === node.id ? 3 : 2}
                  strokeDasharray="8 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              );
            })}
          </svg>

          {rootNodes.map((node, index) => {
            const pos = getNodePosition(index, rootNodes.length);
            const Icon = node.icon;
            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{ scale: 1, opacity: 1, x: pos.x, y: pos.y }}
                transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.3 + index * 0.1 }}
                className="absolute"
                onMouseEnter={() => !bpConfig.isMobile && setHoveredNode(node.id)}
                onMouseLeave={() => !bpConfig.isMobile && setHoveredNode(null)}
              >
                <Link to={node.path}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative group cursor-pointer ${node.cardBg} backdrop-blur-xl ${node.cardBorder} border-2 rounded-2xl shadow-lg ${node.cardHoverGlow} transition-all duration-300 ${bpConfig.nodeWidth} ${bpConfig.isMobile ? 'p-3' : 'p-5'}`}
                  >
                    <div className={`${bpConfig.isMobile ? 'w-8 h-8 mb-2' : 'w-12 h-12 mb-3'} rounded-xl bg-gradient-to-br ${node.iconGradient} flex items-center justify-center shadow-md`}>
                      <Icon className={`${bpConfig.isMobile ? 'w-4 h-4' : 'w-6 h-6'} text-white`} />
                    </div>
                    <h3 className={`font-bold ${bpConfig.isMobile ? 'text-xs' : 'text-base'} ${node.textColor}`}>{node.label}</h3>
                    {!bpConfig.isMobile && (
                      <p className="text-violet-300/70 text-xs mt-1">{node.subtitle}</p>
                    )}
                    <AnimatePresence>
                      {!bpConfig.isMobile && hoveredNode === node.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute -bottom-16 left-0 right-0 bg-violet-950/90 text-violet-100 border border-violet-500/30 backdrop-blur-xl text-xs p-2 rounded-lg shadow-lg whitespace-normal z-30"
                        >
                          {node.description}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
