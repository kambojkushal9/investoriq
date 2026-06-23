'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { AlertTriangle, Shield } from 'lucide-react';
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
          <h3 className="text-lg font-semibold text-zinc-100">Risk Assessment</h3>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50">
            <span className="text-xs text-zinc-400">Overall Risk:</span>
            <span className="text-sm font-bold" style={{ color: getScoreColor(100 - riskData.overallRiskScore) }}>
              {riskData.overallRiskScore}/100
            </span>
          </div>
        </div>
        <div className="space-y-4 mb-6">
          {riskData.categories.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-zinc-300">{cat.name}</span>
                <span className="text-sm font-mono font-bold" style={{ color: getScoreColor(100 - cat.score) }}>{cat.score}</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${cat.score}%` }} transition={{ duration: 0.8, delay: 0.7 + i * 0.1 }}
                  className="h-full rounded-full" style={{ backgroundColor: getScoreColor(100 - cat.score) }} />
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {cat.factors.map((f, j) => (
                  <span key={j} className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded">{f}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h4 className="text-sm font-semibold text-rose-400">Critical Risks</h4>
            </div>
            <ul className="space-y-1.5">
              {riskData.criticalRisks.map((risk, i) => (
                <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                  {risk}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-semibold text-emerald-400">Mitigating Factors</h4>
            </div>
            <ul className="space-y-1.5">
              {riskData.mitigatingFactors.map((f, i) => (
                <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
