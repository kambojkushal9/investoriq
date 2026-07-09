'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { AlertTriangle, Shield, Activity } from 'lucide-react';
import type { RiskAssessmentOutput } from '@/lib/types';
import { getScoreColor } from '@/lib/utils';

interface RiskMatrixProps {
  riskData: RiskAssessmentOutput;
}

export function RiskMatrix({ riskData }: RiskMatrixProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-zinc-100 font-[family-name:var(--font-outfit)]">Risk Assessment</h3>
          </div>
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/50 border border-white/5"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="text-xs text-zinc-400">Overall Risk</span>
            <motion.span
              className="text-lg font-bold font-mono"
              style={{ color: getScoreColor(100 - riskData.overallRiskScore) }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {riskData.overallRiskScore}
            </motion.span>
            <span className="text-xs text-zinc-600">/100</span>
          </motion.div>
        </div>

        <div className="space-y-5 mb-6">
          {riskData.categories.map((cat, i) => {
            const color = getScoreColor(100 - cat.score);
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-zinc-300">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <motion.span
                      className="text-sm font-mono font-bold"
                      style={{ color }}
                    >
                      {cat.score}
                    </motion.span>
                    {cat.score >= 70 && (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-xs text-rose-400"
                      >
                        ⚠
                      </motion.span>
                    )}
                  </div>
                </div>
                <div className="w-full h-2.5 bg-zinc-800/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.score}%` }}
                    transition={{ duration: 1, delay: 0.7 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full relative"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}40`,
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {cat.factors.map((f, j) => (
                    <motion.span
                      key={j}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + i * 0.1 + j * 0.05 }}
                      className="text-xs text-zinc-500 bg-zinc-800/50 px-2.5 py-1 rounded-lg border border-white/5"
                    >
                      {f}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <h4 className="text-sm font-semibold text-rose-400">Critical Risks</h4>
            </div>
            <ul className="space-y-2">
              {riskData.criticalRisks.map((risk, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + i * 0.08 }}
                  className="text-xs text-zinc-300 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                  {risk}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-sm font-semibold text-emerald-400">Mitigating Factors</h4>
            </div>
            <ul className="space-y-2">
              {riskData.mitigatingFactors.map((f, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.08 }}
                  className="text-xs text-zinc-300 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  {f}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
