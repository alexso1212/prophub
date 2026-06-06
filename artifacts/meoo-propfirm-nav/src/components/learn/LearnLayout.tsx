import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

type AccentColor = 'violet' | 'emerald' | 'rose' | 'zinc';

// Legacy colors accepted from callers but normalized internally
type AccentColorInput = AccentColor | 'cyan' | 'fuchsia' | 'amber';

function normalizeAccent(c?: string): AccentColor {
  if (c === 'cyan' || c === 'fuchsia' || c === 'amber') return 'violet';
  if (c === 'emerald' || c === 'rose' || c === 'zinc') return c as AccentColor;
  return 'violet';
}

interface LearnLayoutProps {
  title: string;
  subtitle?: string;
  category?: string;
  accentColor?: AccentColorInput;
  children: ReactNode;
}

const accentMap: Record<AccentColor, { tag: string; tagText: string; tagBorder: string }> = {
  violet: {
    tag: 'bg-violet-500/10',
    tagText: 'text-violet-300',
    tagBorder: 'border-violet-500/30',
  },
  emerald: {
    tag: 'bg-emerald-500/10',
    tagText: 'text-emerald-300',
    tagBorder: 'border-emerald-500/30',
  },
  rose: {
    tag: 'bg-rose-500/10',
    tagText: 'text-rose-300',
    tagBorder: 'border-rose-500/30',
  },
  zinc: {
    tag: 'bg-zinc-500/10',
    tagText: 'text-zinc-300',
    tagBorder: 'border-zinc-500/30',
  },
};

export default function LearnLayout({
  title,
  subtitle,
  category,
  accentColor = 'violet',
  children,
}: LearnLayoutProps) {
  const accent = accentMap[normalizeAccent(accentColor)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#13131f] to-[#1a1a2e] relative overflow-x-hidden">
      {/* Background glow — unified violet */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/20 blur-[120px] rounded-full" />

      {/* Back link */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-8">
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200 text-sm"
        >
          <ArrowLeft size={16} />
          返回指南列表
        </Link>
      </div>

      {/* Header section */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 pt-10 pb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      >
        {category && (
          <span
            className={`inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border ${accent.tag} ${accent.tagText} ${accent.tagBorder}`}
          >
            {category}
          </span>
        )}

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-100 to-violet-200 leading-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16">
        {children}
      </div>

      {/* Bottom back link */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-12 text-center">
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors duration-200 text-sm"
        >
          <ArrowLeft size={14} />
          返回指南列表
        </Link>
      </div>
    </div>
  );
}
