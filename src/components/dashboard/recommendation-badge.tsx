'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { getRecommendationClass } from '@/lib/utils';
import type { Recommendation } from '@/lib/types';

interface RecommendationBadgeProps {
  recommendation: Recommendation;
  confidence: number;
  size?: 'sm' | 'lg';
}

export function RecommendationBadge({ recommendation, confidence, size = 'lg' }: RecommendationBadgeProps) {
  const badgeClass = getRecommendationClass(recommendation);
  const isLarge = size === 'lg';
  const colorMap = {
    INVEST: { text: 'text-emerald-400', bar: 'bg-emerald-400', glow: 'rgba(52,211,153,0.2)' },
    HOLD: { text: 'text-amber-400', bar: 'bg-amber-400', glow: 'rgba(251,191,36,0.2)' },
    PASS: { text: 'text-rose-400', bar: 'bg-rose-400', glow: 'rgba(244,63,94,0.2)' },
  };
  const colors = colorMap[recommendation] || colorMap.HOLD;

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="flex flex-col items-center gap-3"
    >
      {/* Glowing halo */}
      <div className="relative">
        <motion.div
          className="absolute -inset-3 rounded-2xl"
          style={{ background: `radial-gradient(circle, ${colors.glow}, transparent 70%)` }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className={`${badgeClass} ${isLarge ? 'px-8 py-4' : 'px-4 py-2'} rounded-xl font-bold tracking-wider ${isLarge ? 'text-2xl' : 'text-sm'} relative font-[family-name:var(--font-outfit)]`}>
          {recommendation}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500 uppercase tracking-wide">Confidence</span>
        <div className="flex items-center gap-1.5">
          <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full ${colors.bar}`}
              style={{ boxShadow: `0 0 8px ${colors.glow}` }}
            />
          </div>
          <motion.span
            className={`text-sm font-mono font-bold ${colors.text}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {confidence}%
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
