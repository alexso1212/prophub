import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

type AccentColor = 'violet' | 'emerald' | 'rose' | 'zinc';

// Legacy colors accepted from step props but normalized internally
function normalizeAccent(c?: string): AccentColor {
  if (c === 'cyan' || c === 'fuchsia' || c === 'amber') return 'violet';
  if (c === 'emerald' || c === 'rose' || c === 'zinc') return c as AccentColor;
  return 'violet';
}

interface FlowStep {
  id: string;
  title: string;
  description: string;
  detail?: string | string[];
  icon?: LucideIcon;
  accent?: string; // accepts legacy colors; normalized internally
}

interface FlowStepsProps {
  steps: FlowStep[];
  numbered?: boolean;
}

const accentMap: Record<AccentColor, { bg: string; border: string; text: string; iconBg: string; num: string }> = {
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/30',  text: 'text-violet-300',  iconBg: 'bg-violet-500/20',  num: 'from-violet-300 to-violet-500' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300', iconBg: 'bg-emerald-500/20', num: 'from-emerald-400 to-emerald-600' },
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/30',    text: 'text-rose-300',    iconBg: 'bg-rose-500/20',    num: 'from-rose-400 to-rose-600' },
  zinc:    { bg: 'bg-zinc-500/10',    border: 'border-zinc-500/30',    text: 'text-zinc-300',    iconBg: 'bg-zinc-500/20',    num: 'from-zinc-400 to-zinc-600' },
};

const defaultAccents: AccentColor[] = ['violet', 'violet', 'violet', 'emerald', 'violet', 'rose'];

function getDetails(detail: string | string[]): string[] {
  return Array.isArray(detail) ? detail : [detail];
}

export default function FlowSteps({ steps, numbered = true }: FlowStepsProps) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const colorKey = normalizeAccent(step.accent ?? defaultAccents[i % defaultAccents.length]);
        const a = accentMap[colorKey];
        const Icon = step.icon;
        const isLast = i === steps.length - 1;
        const details = step.detail ? getDetails(step.detail) : [];

        return (
          <motion.div
            key={step.id}
            className="flex gap-6 md:gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, delay: i * 0.15 }}
          >
            {/* Left column: number + connector line */}
            {numbered && (
              <div className="flex flex-col items-center flex-shrink-0" style={{ width: 60 }}>
                <div
                  className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b ${a.num} leading-none select-none`}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                {!isLast && (
                  <div className="flex-1 mt-2 w-px bg-gradient-to-b from-violet-500/40 to-transparent min-h-[48px]" />
                )}
              </div>
            )}

            {/* Right column: card */}
            <div className={`flex-1 mb-8 ${isLast ? '' : ''}`}>
              <div
                className={`p-6 md:p-8 rounded-2xl border backdrop-blur-xl bg-white/5 ${a.border} transition-all duration-300 hover:bg-white/[0.08] hover:shadow-[0_0_40px_rgba(139,92,246,0.25)]`}
              >
                {/* Card header */}
                <div className="flex items-start gap-3 mb-3">
                  {Icon && (
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${a.iconBg}`}>
                      <Icon size={20} className={a.text} />
                    </div>
                  )}
                  <h3 className={`text-base md:text-lg font-semibold ${a.text} leading-snug`}>{step.title}</h3>
                </div>

                {/* Description */}
                <p className="text-zinc-300 leading-relaxed text-sm md:text-base">{step.description}</p>

                {/* Detail bullets */}
                {details.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {details.map((d, di) => (
                      <li key={di} className="flex items-start gap-2 text-sm text-zinc-400">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.bg} border ${a.border}`} />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
