'use client';

import { useRef, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'brand' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'none';
  tilt?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = 'none',
  tilt = false,
  onClick,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const glowMap = {
    brand: 'hover:shadow-[0_0_60px_rgba(99,102,241,0.15)]',
    emerald: 'hover:shadow-[0_0_40px_rgba(52,211,153,0.12)]',
    rose: 'hover:shadow-[0_0_40px_rgba(244,63,94,0.12)]',
    amber: 'hover:shadow-[0_0_40px_rgba(251,191,36,0.12)]',
    cyan: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.12)]',
    none: '',
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!tilt || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -8;
      const rotateY = (x - 0.5) * 8;

      setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);

      // Update CSS variable for reflection
      cardRef.current.style.setProperty('--mouse-x', `${x * 100}%`);
      cardRef.current.style.setProperty('--mouse-y', `${y * 100}%`);
    },
    [tilt]
  );

  const handleMouseLeave = useCallback(() => {
    if (!tilt) return;
    setTransform('');
  }, [tilt]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'glass-card',
        hover && 'glass-card-hover cursor-pointer',
        hover && glowMap[glow],
        tilt && 'card-reflection',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        transform: transform || undefined,
        transition: transform ? 'transform 0.1s ease-out' : 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
