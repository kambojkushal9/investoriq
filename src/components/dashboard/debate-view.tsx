'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { TrendingUp, TrendingDown, Crown } from 'lucide-react';
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
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-zinc-100 font-[family-name:var(--font-outfit)]">AI Debate Mode</h3>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>CIO Analysis</span>
          </div>
        </div>
        <p className="text-xs text-zinc-500 mb-6">Bull vs Bear arguments from our AI analysts</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* VS Divider */}
          <div className="hidden md:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex-col items-center justify-center z-10">
            <div className="w-px h-full bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
            <div className="absolute top-1/2 -translate-y-1/2">
              <motion.span
                className="vs-glow text-xl font-bold text-zinc-400 bg-[#07070a] px-2 py-1 rounded-lg font-[family-name:var(--font-outfit)]"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                VS
              </motion.span>
            </div>
          </div>

          {/* Bull Side */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-emerald-500/20">
              <motion.div
                className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/20"
                animate={{ boxShadow: ['0 0 0 rgba(52,211,153,0)', '0 0 15px rgba(52,211,153,0.15)', '0 0 0 rgba(52,211,153,0)'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </motion.div>
              <div>
                <h4 className="font-semibold text-emerald-400 text-sm">Bull Case</h4>
                <p className="text-xs text-emerald-500/60">Reasons to invest</p>
              </div>
            </div>
            {bullCase.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 200 }}
                className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 hover:bg-emerald-500/8 transition-colors"
              >
                <p className="text-sm font-medium text-emerald-300 mb-1.5">{point.argument}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{point.evidence}</p>
              </motion.div>
            ))}
          </div>

          {/* Bear Side */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-rose-500/20">
              <motion.div
                className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center border border-rose-500/20"
                animate={{ boxShadow: ['0 0 0 rgba(244,63,94,0)', '0 0 15px rgba(244,63,94,0.15)', '0 0 0 rgba(244,63,94,0)'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <TrendingDown className="w-4 h-4 text-rose-400" />
              </motion.div>
              <div>
                <h4 className="font-semibold text-rose-400 text-sm">Bear Case</h4>
                <p className="text-xs text-rose-500/60">Reasons for caution</p>
              </div>
            </div>
            {bearCase.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 200 }}
                className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 hover:bg-rose-500/8 transition-colors"
              >
                <p className="text-sm font-medium text-rose-300 mb-1.5">{point.argument}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{point.evidence}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
