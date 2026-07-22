import React, { useRef, useCallback, useEffect, useState } from 'react';

export interface ChromaItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
}

export interface ChromaGridProps {
  items: ChromaItem[];
  className?: string;
}

export default function ChromaGrid({ items, className = '' }: ChromaGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={rootRef}
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 ${className}`}
      style={{
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
      } as React.CSSProperties}
    >
      {items.map((item, i) => (
        <a
          key={i}
          href={item.url || '#'}
          target={item.url ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="group relative flex flex-col items-center rounded-2xl p-4 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 overflow-hidden"
          style={{
            background: item.gradient || `linear-gradient(145deg, ${item.borderColor || '#10b981'}22, #0f172a)`,
            border: `1px solid ${item.borderColor || '#10b981'}40`,
          }}
        >
          {/* Chroma glow effect on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
            style={{
              background: `radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), ${item.borderColor || '#10b981'}30, transparent 60%)`,
            }}
          />

          {/* Avatar */}
          <div
            className="relative w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 shadow-lg"
            style={{
              ringColor: item.borderColor || '#10b981',
              boxShadow: `0 0 20px ${item.borderColor || '#10b981'}40`,
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <h4 className="text-sm font-extrabold text-white text-center">{item.title}</h4>
          <p className="text-xs text-slate-400 text-center mt-0.5">{item.subtitle}</p>
          {item.handle && (
            <span
              className="text-[10px] font-mono mt-1.5 font-bold"
              style={{ color: item.borderColor || '#10b981' }}
            >
              {item.handle}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
