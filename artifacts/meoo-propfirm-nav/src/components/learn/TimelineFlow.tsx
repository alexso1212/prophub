import { motion } from 'framer-motion';

type AccentColor = 'violet' | 'emerald' | 'rose' | 'zinc';

// Legacy colors accepted from stage props but normalized internally
function normalizeAccent(c?: string): AccentColor {
  if (c === 'cyan' || c === 'fuchsia' || c === 'amber') return 'violet';
  if (c === 'emerald' || c === 'rose' || c === 'zinc') return c as AccentColor;
  return 'violet';
}

interface TimelineStage {
  id: string;
  label: string;
  title: string;
  duration?: string;
  cost?: string;
  description: string;
  actions?: string[];
  accent?: string; // accepts legacy colors; normalized internally
}

interface TimelineFlowProps {
  stages: TimelineStage[];
}

const accentMap: Record<AccentColor, {
  bg: string;
  border: string;
  text: string;
  dot: string;
  labelBg: string;
  tagBg: string;
  tagText: string;
  tagBorder: string;
  shadow: string;
}> = {
  violet: {
    bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-300',
    dot: 'bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]',
    labelBg: 'bg-violet-500/20', tagBg: 'bg-violet-500/10', tagText: 'text-violet-300', tagBorder: 'border-violet-500/30',
    shadow: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.35)]',
  },
  emerald: {
    bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300',
    dot: 'bg-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.8)]',
    labelBg: 'bg-emerald-500/20', tagBg: 'bg-emerald-500/10', tagText: 'text-emerald-300', tagBorder: 'border-emerald-500/30',
    shadow: 'hover:shadow-[0_0_40px_rgba(52,211,153,0.35)]',
  },
  rose: {
    bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-300',
    dot: 'bg-rose-500 shadow-[0_0_12px_rgba(251,113,133,0.8)]',
    labelBg: 'bg-rose-500/20', tagBg: 'bg-rose-500/10', tagText: 'text-rose-300', tagBorder: 'border-rose-500/30',
    shadow: 'hover:shadow-[0_0_40px_rgba(251,113,133,0.35)]',
  },
  zinc: {
    bg: 'bg-zinc-500/10', border: 'border-zinc-500/30', text: 'text-zinc-300',
    dot: 'bg-zinc-500 shadow-[0_0_12px_rgba(161,161,170,0.8)]',
    labelBg: 'bg-zinc-500/20', tagBg: 'bg-zinc-500/10', tagText: 'text-zinc-300', tagBorder: 'border-zinc-500/30',
    shadow: 'hover:shadow-[0_0_40px_rgba(161,161,170,0.35)]',
  },
};

const defaultAccents: AccentColor[] = ['violet', 'violet', 'emerald', 'violet', 'rose', 'violet'];

export default function TimelineFlow({ stages }: TimelineFlowProps) {
  return (
    <>
      {/* Desktop: horizontal timeline */}
      <div className="hidden md:block">
        {/* Progress line + dots */}
        <div className="relative flex items-start justify-between mb-8">
          {/* Connecting line — unified violet */}
          <div className="absolute top-4 left-0 right-0 h-px bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500/0" />

          {/* Stage dots */}
          {stages.map((stage, i) => {
            const colorKey = normalizeAccent(stage.accent ?? defaultAccents[i % defaultAccents.length]);
            const a = accentMap[colorKey];
            return (
              <motion.div
                key={stage.id}
                className="relative z-10 flex flex-col items-center"
                style={{ flex: 1 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18, delay: i * 0.12 }}
              >
                <div className={`w-8 h-8 rounded-full ${a.dot} flex items-center justify-center`}>
                  <span className="w-2 h-2 rounded-full bg-white/90" />
                </div>
                <span className={`mt-2 text-xs font-semibold tracking-wider uppercase ${a.text} ${a.labelBg} px-2.5 py-1 rounded-full`}>
                  {stage.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Stage cards */}
        <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${stages.length}, 1fr)` }}>
          {stages.map((stage, i) => {
            const colorKey = normalizeAccent(stage.accent ?? defaultAccents[i % defaultAccents.length]);
            const a = accentMap[colorKey];
            return (
              <motion.div
                key={stage.id}
                className={`p-5 rounded-2xl border backdrop-blur-xl bg-white/5 ${a.border} transition-all duration-300 hover:bg-white/[0.08] ${a.shadow} cursor-default`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.2 + i * 0.12 }}
                whileHover={{ scale: 1.03, y: -4 }}
              >
                <h3 className={`text-base font-semibold ${a.text} mb-2`}>{stage.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">{stage.description}</p>

                {/* Actions */}
                {stage.actions && stage.actions.length > 0 && (
                  <ul className="space-y-1 mb-4">
                    {stage.actions.map((action, ai) => (
                      <li key={ai} className="flex items-start gap-1.5 text-xs text-zinc-500">
                        <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${a.bg} border ${a.border}`} />
                        {action}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {stage.duration && (
                    <span className={`text-xs px-2.5 py-1 rounded-full ${a.tagBg} ${a.tagText} border ${a.tagBorder}`}>
                      {stage.duration}
                    </span>
                  )}
                  {stage.cost && (
                    <span className={`text-xs px-2.5 py-1 rounded-full ${a.tagBg} ${a.tagText} border ${a.tagBorder}`}>
                      {stage.cost}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="md:hidden flex flex-col gap-0">
        {stages.map((stage, i) => {
          const colorKey = normalizeAccent(stage.accent ?? defaultAccents[i % defaultAccents.length]);
          const a = accentMap[colorKey];
          const isLast = i === stages.length - 1;

          return (
            <motion.div
              key={stage.id}
              className="flex gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 18, delay: i * 0.12 }}
            >
              {/* Left: dot + vertical line */}
              <div className="flex flex-col items-center flex-shrink-0" style={{ width: 32 }}>
                <div className={`w-8 h-8 rounded-full ${a.dot} flex items-center justify-center flex-shrink-0`}>
                  <span className="w-2 h-2 rounded-full bg-white/90" />
                </div>
                {!isLast && (
                  <div className="flex-1 mt-1 w-px bg-gradient-to-b from-violet-500/40 to-transparent min-h-[32px]" />
                )}
              </div>

              {/* Right: card */}
              <div className="flex-1 pb-6">
                <span className={`inline-block mb-2 text-xs font-semibold tracking-wider uppercase ${a.text} ${a.labelBg} px-2.5 py-1 rounded-full`}>
                  {stage.label}
                </span>
                <div className={`p-5 rounded-2xl border backdrop-blur-xl bg-white/5 ${a.border} transition-all duration-300 hover:bg-white/[0.08] ${a.shadow}`}>
                  <h3 className={`text-base font-semibold ${a.text} mb-2`}>{stage.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-3">{stage.description}</p>

                  {stage.actions && stage.actions.length > 0 && (
                    <ul className="space-y-1 mb-3">
                      {stage.actions.map((action, ai) => (
                        <li key={ai} className="flex items-start gap-1.5 text-xs text-zinc-500">
                          <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${a.bg} border ${a.border}`} />
                          {action}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {stage.duration && (
                      <span className={`text-xs px-2.5 py-1 rounded-full ${a.tagBg} ${a.tagText} border ${a.tagBorder}`}>
                        {stage.duration}
                      </span>
                    )}
                    {stage.cost && (
                      <span className={`text-xs px-2.5 py-1 rounded-full ${a.tagBg} ${a.tagText} border ${a.tagBorder}`}>
                        {stage.cost}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
