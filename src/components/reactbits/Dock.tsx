import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

export type DockItemData = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  color?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  baseItemSize?: number;
  magnification?: number;
};

const springConfig = { mass: 0.1, stiffness: 150, damping: 12 };

function DockItem({
  children, onClick, mouseX, distance, magnification, baseItemSize, label, color
}: {
  children: React.ReactNode; onClick?: () => void; mouseX: MotionValue<number>;
  distance: number; magnification: number; baseItemSize: number; label?: string; color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, springConfig);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onClick={onClick}
      className="relative flex items-center justify-center rounded-2xl cursor-pointer transition-colors"
      role="button"
      tabIndex={0}
    >
      <motion.div
        className="absolute -top-10 px-2.5 py-1 rounded-lg text-xs font-bold text-white whitespace-nowrap pointer-events-none"
        style={{
          backgroundColor: color || '#059669',
          opacity: useTransform(isHovered, [0, 1], [0, 1]),
          y: useTransform(isHovered, [0, 1], [4, 0]),
        }}
      >
        {label}
      </motion.div>
      <motion.div
        className="flex items-center justify-center w-full h-full rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg backdrop-blur-md"
        style={{
          backgroundColor: color ? `${color}15` : 'rgba(16, 185, 129, 0.08)',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Dock({
  items,
  className = '',
  distance = 140,
  baseItemSize = 50,
  magnification = 70,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      className={`flex items-end gap-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 py-3 shadow-xl ${className}`}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {items.map((item, i) => (
        <DockItem
          key={i}
          mouseX={mouseX}
          distance={distance}
          baseItemSize={baseItemSize}
          magnification={magnification}
          onClick={item.onClick}
          label={item.label}
          color={item.color}
        >
          {item.icon}
        </DockItem>
      ))}
    </motion.div>
  );
}
