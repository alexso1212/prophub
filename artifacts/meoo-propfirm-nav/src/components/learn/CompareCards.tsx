import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

type AccentColor = 'emerald' | 'rose' | 'violet' | 'zinc';

// Legacy colors accepted from column props but normalized internally
function normalizeAccent(c?: string): AccentColor {
  if (c === 'cyan' || c === 'fuchsia' || c === 'amber') return 'violet';
  if (c === 'emerald' || c === 'rose' || c === 'zinc') return c as AccentColor;
  return 'violet';
}

interface CompareItem {
  label: string;
  value?: string;
}

interface CompareColumn {
  id: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon | string;
  accent: string; // accepts legacy colors; normalized internally
  items: CompareItem[];
}

interface CompareCardsProps {
  columns: CompareColumn[];
  layout?: 'grid' | 'side-by-side';
}

const accentMap: Record<AccentColor, {
  topBar: string;
  bg: string;
  border: string;
  text: string;
  iconBg: string;
  dot: string;
  valueBg: string;
}> = {
  emerald: {
    topBar: 'from-emerald-500 to-emerald-300',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
    iconBg: 'bg-emerald-500/20',
    dot: 'bg-emerald-400',
    valueBg: 'bg-emerald-500/10',
  },
  rose: {
    topBar: 'from-rose-500 to-rose-300',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-300',
    iconBg: 'bg-rose-500/20',
    dot: 'bg-rose-400',
    valueBg: 'bg-rose-500/10',
  },
  violet: {
    topBar: 'from-violet-500 to-violet-300',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-300',
    iconBg: 'bg-violet-500/20',
    dot: 'bg-violet-400',
    valueBg: 'bg-violet-500/10',
  },
  zinc: {
    topBar: 'from-zinc-500 to-zinc-300',
    bg: 'bg-zinc-500/10',
    border: 'border-zinc-500/30',
    text: 'text-zinc-300',
    iconBg: 'bg-zinc-500/20',
    dot: 'bg-zinc-400',
    valueBg: 'bg-zinc-500/10',
  },
};

function isString(v: LucideIcon | string): v is string {
  return typeof v === 'string';
}

export default function CompareCards({ columns, layout }: CompareCardsProps) {
  const resolvedLayout = layout ?? (columns.length <= 2 ? 'side-by-side' : 'grid');
  const gridClass = resolvedLayout === 'side-by-side'
    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  return (
    <div className={gridClass}>
      {columns.map((col, i) => {
        const a = accentMap[normalizeAccent(col.accent)];
        const Icon = col.icon;
        return (
          <motion.div
            key={col.id}
            className={`rounded-2xl border backdrop-blur-xl bg-white/5 ${a.border} overflow-hidden transition-all duration-300 hover:bg-white/[0.08] hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Top color bar */}
            <div className={`h-1 w-full bg-gradient-to-r ${a.topBar}`} />

            {/* Card header */}
            <div className="p-6 md:p-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                {Icon && (
                  isString(Icon) ? (
                    <span className="text-2xl">{Icon}</span>
                  ) : (
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.iconBg}`}>
                      <Icon size={20} className={a.text} />
                    </div>
                  )
                )}
                <div>
                  <h3 className={`text-base md:text-lg font-semibold ${a.text}`}>{col.title}</h3>
                  {col.subtitle && (
                    <p className="text-zinc-500 text-xs mt-0.5">{col.subtitle}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Items list */}
            <dl className="px-6 md:px-8 pb-6 md:pb-8 space-y-2">
              {col.items.map((item, j) => (
                <div key={j} className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.dot}`} />
                    <dt className="text-zinc-300 text-sm leading-relaxed">{item.label}</dt>
                  </div>
                  {item.value !== undefined && (
                    <dd className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${a.valueBg} ${a.text} border ${a.border}`}>
                      {item.value}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          </motion.div>
        );
      })}
    </div>
  );
}
