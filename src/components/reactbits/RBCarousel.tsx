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
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

function RBCarouselCard({
  item, index, itemWidth, round, trackItemOffset, x, transition
}: {
  item: RBCarouselItem; index: number; itemWidth: number; round: boolean;
  trackItemOffset: number; x: any; transition: any;
}) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const rotateY = useTransform(x, range, [90, 0, -90], { clamp: false });

  return (
    <motion.div
      className={`relative shrink-0 flex flex-col ${
        round
          ? 'items-center justify-center text-center bg-slate-950 border-0'
          : 'items-start justify-between bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl'
      } overflow-hidden cursor-grab active:cursor-grabbing`}
      style={{
        width: itemWidth,
        height: round ? itemWidth : '100%',
        rotateY,
        ...(round && { borderRadius: '50%' }),
      }}
      transition={transition}
    >
      <div className={round ? 'p-0 m-0' : 'mb-4 p-5'}>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
          {item.icon}
        </span>
      </div>
      <div className={round ? 'px-1' : 'px-5 pb-5'}>
        <div className="text-white text-sm font-extrabold mb-1">{item.title}</div>
        <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  );
}

export default function RBCarousel({
  items,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
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
    const animation = x.set(-effectiveIndex * trackItemOffset);
  }, [effectiveIndex, trackItemOffset, isResetting]);

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
        x.jump(-0 * trackItemOffset);
        setCurrentIndex(0);
        setTimeout(() => setIsResetting(false), 50);
      }, 500);
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
      if (loop && currentIndex === 0) {
        // wrap to last
      }
      setCurrentIndex(Math.max(currentIndex - 1, 0));
    }
  };

  return (
    <div
      className="relative overflow-hidden"
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

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? 'w-8 bg-emerald-500 shadow-md shadow-emerald-500/50'
                : 'w-2 bg-slate-600 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
