'use client';

import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'brand' | 'emerald' | 'rose' | 'amber' | 'none';
  onClick?: () => void;
}

export function GlassCard({ children, className, hover = false, glow = 'none', onClick }: GlassCardProps) {
  const glowMap = {
    brand: 'hover:shadow-[0_0_60px_rgba(99,102,241,0.15)]',
    emerald: 'hover:shadow-[0_0_40px_rgba(52,211,153,0.12)]',
    rose: 'hover:shadow-[0_0_40px_rgba(244,63,94,0.12)]',
    amber: 'hover:shadow-[0_0_40px_rgba(251,191,36,0.12)]',
    none: '',
  };

  return (
    <div
      className={cn(
        'glass-card',
        hover && 'glass-card-hover cursor-pointer',
        hover && glowMap[glow],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
