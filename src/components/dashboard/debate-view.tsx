'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { DebatePoint } from '@/lib/types';

interface DebateViewProps {
  bullCase: DebatePoint[];
  bearCase: DebatePoint[];
}

export function DebateView({ bullCase, bearCase }: DebateViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-zinc-100 mb-2">AI Debate Mode</h3>
        <p className="text-xs text-zinc-500 mb-6">Bull vs Bear arguments from our AI analysts</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bull Side */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-emerald-500/20">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-400">Bull Case</h4>
                <p className="text-xs text-emerald-500/60">Reasons to invest</p>
              </div>
            </div>
            {bullCase.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3"
              >
                <p className="text-sm font-medium text-emerald-300 mb-1">{point.argument}</p>
                <p className="text-xs text-zinc-400">{point.evidence}</p>
              </motion.div>
            ))}
          </div>

          {/* Bear Side */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-rose-500/20">
              <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-rose-400" />
              </div>
              <div>
                <h4 className="font-semibold text-rose-400">Bear Case</h4>
                <p className="text-xs text-rose-500/60">Reasons for caution</p>
              </div>
            </div>
            {bearCase.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="bg-rose-500/5 border border-rose-500/10 rounded-lg p-3"
              >
                <p className="text-sm font-medium text-rose-300 mb-1">{point.argument}</p>
                <p className="text-xs text-zinc-400">{point.evidence}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
