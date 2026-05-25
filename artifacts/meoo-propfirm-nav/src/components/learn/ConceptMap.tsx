import { useEffect, useState, useId } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

type AccentColor = 'violet' | 'emerald' | 'rose' | 'zinc';

// Legacy colors accepted from node props but normalized internally
function normalizeColor(c?: string): AccentColor {
  if (c === 'cyan' || c === 'fuchsia' || c === 'amber') return 'violet';
  if (c === 'emerald' || c === 'rose' || c === 'zinc') return c as AccentColor;
  return 'violet';
}

interface ConceptNode {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  color?: string; // accepts legacy colors; normalized internally
}

interface ConceptMapProps {
  center: { label: string; sublabel?: string };
  nodes: ConceptNode[];
}

const accentMap: Record<AccentColor, { bg: string; border: string; text: string; glow: string }> = {
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/30',  text: 'text-violet-300',  glow: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300', glow: 'hover:shadow-[0_0_40px_rgba(52,211,153,0.4)]' },
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/30',    text: 'text-rose-300',    glow: 'hover:shadow-[0_0_40px_rgba(251,113,133,0.4)]' },
  zinc:    { bg: 'bg-zinc-500/10',    border: 'border-zinc-500/30',    text: 'text-zinc-300',    glow: 'hover:shadow-[0_0_40px_rgba(161,161,170,0.4)]' },
};

const defaultColors: AccentColor[] = ['violet', 'violet', 'emerald', 'violet', 'rose', 'violet'];

const GRID_THRESHOLD = 6;

export default function ConceptMap({ center, nodes }: ConceptMapProps) {
  const [radius, setRadius] = useState(220);
  const gradientId = useId().replace(/:/g, '');

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 640) setRadius(140);
      else if (w < 1024) setRadius(220);
      else setRadius(280);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const useGrid = nodes.length > GRID_THRESHOLD;

  // Radial layout positions
  const positions = nodes.map((_, i) => {
    const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });

  const svgSize = (radius + 120) * 2;
  const center2d = svgSize / 2;

  if (useGrid) {
    return (
      <div className="w-full">
        {/* Center */}
        <motion.div
          className="mx-auto mb-8 w-40 h-40 rounded-full bg-gradient-to-br from-violet-500 via-violet-600 to-violet-700 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.5)] cursor-default"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
          <span className="text-white font-bold text-base text-center px-3 leading-tight">{center.label}</span>
          {center.sublabel && <span className="text-white/70 text-xs mt-1">{center.sublabel}</span>}
        </motion.div>

        {/* Grid nodes */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {nodes.map((node, i) => {
            const colorKey = normalizeColor(node.color ?? defaultColors[i % defaultColors.length]);
            const a = accentMap[colorKey];
            const Icon = node.icon;
            return (
              <motion.div
                key={node.id}
                className={`p-5 rounded-2xl border backdrop-blur-xl bg-white/5 ${a.border} cursor-default transition-all duration-300 ${a.glow}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18, delay: i * 0.07 }}
                whileHover={{ scale: 1.03 }}
              >
                {Icon && (
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${a.bg}`}>
                    <Icon size={18} className={a.text} />
                  </div>
                )}
                <div className={`text-base font-semibold ${a.text}`}>{node.label}</div>
                {node.description && <p className="mt-1 text-zinc-400 text-sm leading-relaxed">{node.description}</p>}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative" style={{ width: svgSize, maxWidth: '100%' }}>
        {/* SVG lines */}
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="absolute inset-0 pointer-events-none"
          style={{ maxWidth: '100%' }}
        >
          <defs>
            <linearGradient id={`lg-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {positions.map((pos, i) => {
            const x2 = center2d + pos.x;
            const y2 = center2d + pos.y;
            // Cubic bezier with slight curve
            const mx = (center2d + x2) / 2;
            const my = (center2d + y2) / 2 - 30;
            return (
              <motion.path
                key={nodes[i].id}
                d={`M ${center2d} ${center2d} Q ${mx} ${my} ${x2} ${y2}`}
                fill="none"
                stroke={`url(#lg-${gradientId})`}
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            );
          })}
        </svg>

        {/* Center node */}
        <motion.div
          className="absolute z-10 flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-violet-600 to-violet-700 shadow-[0_0_60px_rgba(139,92,246,0.5)] cursor-default"
          style={{
            width: 112,
            height: 112,
            left: center2d - 56,
            top: center2d - 56,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
          <span className="text-white font-bold text-sm text-center px-2 leading-tight">{center.label}</span>
          {center.sublabel && <span className="text-white/70 text-xs mt-0.5">{center.sublabel}</span>}
        </motion.div>

        {/* Outer nodes */}
        {nodes.map((node, i) => {
          const colorKey = normalizeColor(node.color ?? defaultColors[i % defaultColors.length]);
          const a = accentMap[colorKey];
          const Icon = node.icon;
          const pos = positions[i];
          const nodeW = 128;
          const nodeH = node.description ? 110 : 72;

          return (
            <motion.div
              key={node.id}
              className={`absolute z-10 p-3 rounded-2xl border backdrop-blur-xl bg-white/5 ${a.border} cursor-default transition-all duration-300 ${a.glow}`}
              style={{
                width: nodeW,
                left: center2d + pos.x - nodeW / 2,
                top: center2d + pos.y - nodeH / 2,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.3 + i * 0.08 }}
              whileHover={{ scale: 1.08 }}
            >
              {Icon && (
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 ${a.bg}`}>
                  <Icon size={14} className={a.text} />
                </div>
              )}
              <div className={`text-xs font-semibold leading-tight ${a.text}`}>{node.label}</div>
              {node.description && (
                <p className="mt-1 text-zinc-500 text-[10px] leading-snug">{node.description}</p>
              )}
            </motion.div>
          );
        })}

        {/* Spacer to size container */}
        <div style={{ height: svgSize, maxWidth: '100%' }} />
      </div>
    </div>
  );
}
