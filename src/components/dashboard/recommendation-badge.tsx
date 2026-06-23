'use client';

import { motion } from 'framer-motion';
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

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="flex flex-col items-center gap-3"
    >
      <div className={`${badgeClass} ${isLarge ? 'px-8 py-4' : 'px-4 py-2'} rounded-xl font-bold tracking-wider ${isLarge ? 'text-2xl' : 'text-sm'}`}>
        {recommendation}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500 uppercase tracking-wide">Confidence</span>
        <div className="flex items-center gap-1.5">
          <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className={`h-full rounded-full ${
                recommendation === 'INVEST' ? 'bg-emerald-400' :
                recommendation === 'HOLD' ? 'bg-amber-400' : 'bg-rose-400'
              }`}
            />
          </div>
          <span className={`text-sm font-mono font-bold ${
            recommendation === 'INVEST' ? 'text-emerald-400' :
            recommendation === 'HOLD' ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {confidence}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
