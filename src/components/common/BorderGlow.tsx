import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BorderGlowProps {
  children: ReactNode;
  active?: boolean;
  color?: string;
  className?: string;
}

export function BorderGlow({
  children,
  active = true,
  color = '#3BB54A',
  className = '',
}: BorderGlowProps) {
  if (!active) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Outer animated glow halo */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl opacity-75 blur-sm transition-all duration-300"
        style={{ backgroundColor: color }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [0.995, 1.005, 0.995],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <div className="relative rounded-2xl bg-white dark:bg-slate-900">{children}</div>
    </div>
  );
}
