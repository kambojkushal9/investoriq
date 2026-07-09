'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { GitCompare, Sparkles, ArrowRight, Trophy } from 'lucide-react';
import { useResearch } from '@/hooks/use-research';
import { ResearchProgress } from '@/components/dashboard/research-progress';
import { RecommendationBadge } from '@/components/dashboard/recommendation-badge';
import { ScoreGauge } from '@/components/shared/score-gauge';
import type { ResearchState } from '@/lib/types';

export default function ComparePage() {
  const [companyA, setCompanyA] = useState('');
  const [companyB, setCompanyB] = useState('');
  const [resultA, setResultA] = useState<ResearchState | null>(null);
  const [resultB, setResultB] = useState<ResearchState | null>(null);
  const [phase, setPhase] = useState<'idle' | 'a' | 'b' | 'done'>('idle');
  const companyBRef = useRef(companyB);
  companyBRef.current = companyB;
  const researchA = useResearch();
  const researchB = useResearch();

  const startCompare = () => {
    if (!companyA.trim() || !companyB.trim()) return;
    setPhase('a'); setResultA(null); setResultB(null);
    researchA.startResearch(companyA);
  };

  useEffect(() => {
    if (phase === 'a' && researchA.result?.recommendation && !resultA) {
      setResultA(researchA.result); setPhase('b');
      researchB.startResearch(companyBRef.current);
    }
  }, [phase, researchA.result, resultA, researchB]);

  useEffect(() => {
    if (phase === 'b' && researchB.result?.recommendation && !resultB) {
      setResultB(researchB.result); setPhase('done');
    }
  }, [phase, researchB.result, resultB]);

  const score = (r: ResearchState) => {
    if (!r.recommendation?.scores) return 0;
    const s = r.recommendation.scores;
    return Math.round((s.financialHealth + s.growthPotential + s.competitiveMoat + s.marketSentiment + s.riskProfile) / 5);
  };

  const disabled = (phase !== 'idle' && phase !== 'done') || !companyA.trim() || !companyB.trim();

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 mb-1 font-[family-name:var(--font-outfit)]">
          <GitCompare className="w-6 h-6 text-cyan-400" /> Compare Companies
        </h1>
        <p className="text-sm text-zinc-500">Head-to-head AI analysis</p>
      </motion.div>

      <GlassCard className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1 block">Company A</label>
            <input type="text" value={companyA} onChange={e => setCompanyA(e.target.value)} placeholder="e.g., Apple"
              className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 input-premium focus:outline-none"
              disabled={phase !== 'idle' && phase !== 'done'} />
          </div>
          <span className="text-zinc-600 font-bold pb-3 text-lg vs-glow">vs</span>
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1 block">Company B</label>
            <input type="text" value={companyB} onChange={e => setCompanyB(e.target.value)} placeholder="e.g., Microsoft"
              className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 input-premium focus:outline-none"
              disabled={phase !== 'idle' && phase !== 'done'} />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={startCompare} disabled={disabled}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 disabled:opacity-40 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap shadow-lg shadow-indigo-500/15">
            <Sparkles className="w-4 h-4" /> Compare
          </motion.button>
        </div>
      </GlassCard>

      {(phase === 'a' || phase === 'b') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <GlassCard className={`p-5 ${phase === 'a' ? 'gradient-border-animated rounded-2xl' : ''}`}>
            <h3 className="font-semibold text-zinc-200 mb-3 text-sm">{companyA}</h3>
            {phase === 'a' ? <ResearchProgress currentStep={researchA.currentStep} completedSteps={researchA.completedSteps} error={researchA.error} />
              : <p className="text-xs text-emerald-400">✓ Complete</p>}
          </GlassCard>
          <GlassCard className={`p-5 ${phase === 'b' ? 'gradient-border-animated rounded-2xl' : ''}`}>
            <h3 className="font-semibold text-zinc-200 mb-3 text-sm">{companyB}</h3>
            {phase === 'b' ? <ResearchProgress currentStep={researchB.currentStep} completedSteps={researchB.completedSteps} error={researchB.error} />
              : phase === 'a' ? <p className="text-xs text-zinc-500">Waiting...</p>
              : <p className="text-xs text-emerald-400">✓ Complete</p>}
          </GlassCard>
        </div>
      )}

      {phase === 'done' && resultA && resultB && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{ r: resultA, n: companyA }, { r: resultB, n: companyB }].map(({ r, n }) => (
              <GlassCard key={n} className="p-6 text-center" tilt>
                <h3 className="font-semibold text-zinc-100 mb-4">{r.companyResearch?.name || n}</h3>
                {r.recommendation && <RecommendationBadge recommendation={r.recommendation.recommendation} confidence={r.recommendation.confidence} size="sm" />}
                <div className="mt-4"><ScoreGauge score={score(r)} size={90} label="Overall" /></div>
              </GlassCard>
            ))}
          </div>

          {resultA.recommendation?.scores && resultB.recommendation?.scores && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-5 font-[family-name:var(--font-outfit)]">Score Comparison</h3>
              <div className="space-y-5">
                {Object.entries(resultA.recommendation.scores).map(([key, vA]) => {
                  const vB = resultB.recommendation?.scores?.[key as keyof typeof resultB.recommendation.scores] || 0;
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-2">
                        <span className={vA > vB ? 'text-indigo-400 font-semibold' : 'text-zinc-400'}>{resultA.companyResearch?.name || companyA}: {vA}</span>
                        <span className="text-zinc-500">{label}</span>
                        <span className={vB > vA ? 'text-cyan-400 font-semibold' : 'text-zinc-400'}>{resultB.companyResearch?.name || companyB}: {vB}</span>
                      </div>
                      <div className="flex gap-1.5 h-2.5">
                        <div className="flex-1 bg-zinc-800/60 rounded-l-full overflow-hidden flex justify-end">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${vA}%` }} transition={{ duration: 1 }} className="bg-indigo-500 rounded-l-full" />
                        </div>
                        <div className="flex-1 bg-zinc-800/60 rounded-r-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${vB}%` }} transition={{ duration: 1 }} className="bg-cyan-500 rounded-r-full" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}
                className="mt-8 p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-center">
                <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <span className="text-sm text-zinc-400 block mb-1">Winner</span>
                <span className="text-xl font-bold gradient-text font-[family-name:var(--font-outfit)]">
                  {score(resultA) >= score(resultB) ? resultA.companyResearch?.name || companyA : resultB.companyResearch?.name || companyB}
                </span>
              </motion.div>
            </GlassCard>
          )}

          <div className="flex justify-center">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setPhase('idle'); researchA.reset(); researchB.reset(); setResultA(null); setResultB(null); }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800/50 border border-white/10 text-zinc-300 hover:text-zinc-100 transition-all">
              <ArrowRight className="w-4 h-4" /> Compare Again
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
