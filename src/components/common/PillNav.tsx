import { motion } from 'framer-motion';

export interface PillTab {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

interface PillNavProps {
  tabs: PillTab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function PillNav({ tabs, activeId, onChange, className = '' }: PillNavProps) {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-2xl bg-secondary-bg/60 dark:bg-slate-800/80 p-1 border border-olive/20 dark:border-slate-700/60 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors focus:outline-none ${
              isActive
                ? 'text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="pillNavActive"
                className="absolute inset-0 bg-primary dark:bg-emerald-700 rounded-xl shadow-xs"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
