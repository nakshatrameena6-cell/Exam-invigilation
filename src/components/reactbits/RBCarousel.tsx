import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import React from 'react';

export interface RBCarouselItem {
  title: string;
  description: string;
  id: number;
  icon: React.ReactNode;
}

export interface RBCarouselProps {
  items: RBCarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 220, damping: 24 };

function RBCarouselCard({
  item, index, itemWidth, round, trackItemOffset, x, transition
}: {
  item: RBCarouselItem; index: number; itemWidth: number; round: boolean;
  trackItemOffset: number; x: any; transition: any;
}) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const rotateY = useTransform(x, range, [22, 0, -22], { clamp: true });
  const scale = useTransform(x, range, [0.94, 1, 0.94], { clamp: true });

  return (
    <motion.div
      key={`${item?.id ?? index}-${index}`}
      className={`relative shrink-0 flex flex-col justify-between p-5 ${
        round
          ? 'items-center justify-center text-center bg-slate-950 border-0'
          : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md rounded-2xl'
      } overflow-hidden cursor-grab active:cursor-grabbing select-none h-44`}
      style={{
        width: itemWidth,
        rotateY,
        scale,
        ...(round && { borderRadius: '50%', height: itemWidth }),
      }}
      transition={transition}
    >
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20 text-white">
            {item.icon}
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            SecureX AI
          </span>
        </div>
        <h4 className="text-slate-900 dark:text-white text-base font-extrabold mb-1 tracking-tight">
          {item.title}
        </h4>
        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400">
        <span>FEATURE #{item.id}</span>
        <span className="text-emerald-500 font-bold">ACTIVE</span>
      </div>
    </motion.div>
  );
}

export default function RBCarousel({
  items,
  baseWidth = 280,
  autoplay = true,
  autoplayDelay = 3500,
  pauseOnHover = true,
  loop = true,
  round = false,
}: RBCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const itemWidth = baseWidth;
  const trackItemOffset = itemWidth + GAP;

  const carouselItems = useMemo(() => {
    if (loop) return [...items, items[0]];
    return items;
  }, [items, loop]);

  const effectiveIndex = useMemo(() => {
    if (loop && currentIndex === carouselItems.length - 1) return 0;
    return currentIndex;
  }, [currentIndex, carouselItems.length, loop]);

  useEffect(() => {
    if (isResetting) return;
    x.set(-effectiveIndex * trackItemOffset);
  }, [effectiveIndex, trackItemOffset, isResetting, x]);

  useEffect(() => {
    if (!autoplay) return;
    if (pauseOnHover && isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= items.length - 1) {
          if (loop) return prev + 1;
          return 0;
        }
        return prev + 1;
      });
    }, autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, loop, items.length, pauseOnHover]);

  useEffect(() => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setTimeout(() => {
        setIsResetting(true);
        x.jump(0);
        setCurrentIndex(0);
        setTimeout(() => setIsResetting(false), 50);
      }, 400);
    }
  }, [currentIndex, carouselItems.length, loop, trackItemOffset, x]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (loop && currentIndex === items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(Math.min(currentIndex + 1, items.length - 1));
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setCurrentIndex(Math.max(currentIndex - 1, 0));
    }
  };

  return (
    <div
      className="relative overflow-hidden w-full py-2"
      style={{ perspective: '1000px' }}
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flex"
        drag="x"
        style={{ x, gap: `${GAP}px` }}
        onDragEnd={handleDragEnd}
        dragConstraints={{
          left: -(carouselItems.length - 1) * trackItemOffset,
          right: 0,
        }}
        animate={isResetting ? undefined : { x: -currentIndex * trackItemOffset }}
        transition={SPRING_OPTIONS}
      >
        {carouselItems.map((item, index) => (
          <RBCarouselCard
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            round={round}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={SPRING_OPTIONS}
          />
        ))}
      </motion.div>

      {/* Dots Indicator */}
      <div className="flex justify-center items-center gap-2 mt-5">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? 'w-8 bg-emerald-500 shadow-md shadow-emerald-500/40'
                : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
