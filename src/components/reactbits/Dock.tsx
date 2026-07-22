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

const springConfig = { mass: 0.1, stiffness: 180, damping: 14 };

function DockItem({
  children, onClick, mouseX, distance, magnification, baseItemSize, label, color
}: {
  children: React.ReactNode; onClick?: () => void; mouseX: MotionValue<number>;
  distance: number; magnification: number; baseItemSize: number; label?: string; color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return distance + 1;
    return val - (rect.left + rect.width / 2);
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, springConfig);

  const brandColor = color || '#10b981';

  return (
    <div className="relative flex flex-col items-center justify-end">
      {/* Tooltip Label */}
      <motion.div
        className="absolute -top-10 px-3 py-1 rounded-lg text-xs font-bold text-white shadow-md pointer-events-none font-sans z-30"
        style={{
          backgroundColor: brandColor,
          opacity: useTransform(isHovered, [0, 1], [0, 1]),
          y: useTransform(isHovered, [0, 1], [4, 0]),
          scale: useTransform(isHovered, [0, 1], [0.95, 1]),
        }}
      >
        {label}
      </motion.div>

      {/* Dock Button */}
      <motion.div
        ref={ref}
        style={{ width: size, height: size }}
        onHoverStart={() => isHovered.set(1)}
        onHoverEnd={() => isHovered.set(0)}
        onClick={onClick}
        className="flex items-center justify-center rounded-2xl cursor-pointer transition-colors shadow-md relative overflow-hidden group"
        role="button"
        tabIndex={0}
      >
        <div
          className="flex items-center justify-center w-full h-full rounded-2xl border transition-all duration-200"
          style={{
            backgroundColor: `${brandColor}18`,
            borderColor: `${brandColor}40`,
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default function Dock({
  items,
  className = '',
  distance = 120,
  baseItemSize = 46,
  magnification = 64,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="w-full flex justify-center py-2">
      <motion.div
        className={`inline-flex items-end gap-3.5 rounded-2xl border border-emerald-500/30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-5 py-3 shadow-glow ${className}`}
        onMouseMove={(e) => mouseX.set(e.clientX)}
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
    </div>
  );
}
