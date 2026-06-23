'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { GitCompare, Sparkles, ArrowRight } from 'lucide-react';
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

  const startCompare = async () => {
    if (!companyA.trim() || !companyB.trim()) return;
    setPhase('a');
    setResultA(null);
    setResultB(null);

    // Start research for A
    researchA.startResearch(companyA);
  };

  // Watch for A completion to start B
  useEffect(() => {
    if (phase === 'a' && researchA.result?.recommendation && !resultA) {
      setResultA(researchA.result);
      setPhase('b');
      researchB.startResearch(companyBRef.current);
    }
  }, [phase, researchA.result, resultA, researchB]);

  // Watch for B completion
  useEffect(() => {
    if (phase === 'b' && researchB.result?.recommendation && !resultB) {
      setResultB(researchB.result);
      setPhase('done');
    }
  }, [phase, researchB.result, resultB]);

  const getOverallScore = (r: ResearchState) => {
    if (!r.recommendation?.scores) return 0;
    const s = r.recommendation.scores;
    return Math.round((s.financialHealth + s.growthPotential + s.competitiveMoat + s.marketSentiment + s.riskProfile) / 5);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 mb-1">
          <GitCompare className="w-6 h-6 text-cyan-400" />
          Compare Companies
        </h1>
        <p className="text-sm text-zinc-500">Head-to-head AI analysis of two companies</p>
      </motion.div>

      {/* Input */}
      <GlassCard className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1 block">Company A</label>
            <input
              type="text" value={companyA} onChange={e => setCompanyA(e.target.value)}
              placeholder="e.g., Apple"
              className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
              disabled={phase !== 'idle' && phase !== 'done'}
            />
          </div>
          <span className="text-zinc-600 font-bold pb-3">vs</span>
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1 block">Company B</label>
            <input
              type="text" value={companyB} onChange={e => setCompanyB(e.target.value)}
              placeholder="e.g., Microsoft"
              className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
              disabled={phase !== 'idle' && phase !== 'done'}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={startCompare}
            disabled={(phase !== 'idle' && phase !== 'done') || !companyA.trim() || !companyB.trim()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" /> Compare
          </motion.button>
        </div>
      </GlassCard>

      {/* Progress */}
      {(phase === 'a' || phase === 'b') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <GlassCard className="p-5">
            <h3 className="font-semibold text-zinc-200 mb-3 text-sm">{companyA}</h3>
            {phase === 'a' ? (
              <ResearchProgress currentStep={researchA.currentStep} completedSteps={researchA.completedSteps} error={researchA.error} />
            ) : (
              <p className="text-xs text-emerald-400">✓ Complete</p>
            )}
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="font-semibold text-zinc-200 mb-3 text-sm">{companyB}</h3>
            {phase === 'b' ? (
              <ResearchProgress currentStep={researchB.currentStep} completedSteps={researchB.completedSteps} error={researchB.error} />
            ) : phase === 'a' ? (
              <p className="text-xs text-zinc-500">Waiting...</p>
            ) : (
              <p className="text-xs text-emerald-400">✓ Complete</p>
            )}
          </GlassCard>
        </div>
      )}

      {/* Results */}
      {phase === 'done' && resultA && resultB && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Side by side recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { result: resultA, name: companyA },
              { result: resultB, name: companyB },
            ].map((item) => (
              <GlassCard key={item.name} className="p-6 text-center">
                <h3 className="font-semibold text-zinc-100 mb-4">{item.result.companyResearch?.name || item.name}</h3>
                {item.result.recommendation && (
                  <RecommendationBadge recommendation={item.result.recommendation.recommendation} confidence={item.result.recommendation.confidence} size="sm" />
                )}
                <div className="mt-4">
                  <ScoreGauge score={getOverallScore(item.result)} size={80} label="Overall" />
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Score comparison */}
          {resultA.recommendation?.scores && resultB.recommendation?.scores && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Score Comparison</h3>
              <div className="space-y-4">
                {Object.entries(resultA.recommendation.scores).map(([key, valueA]) => {
                  const valueB = resultB.recommendation?.scores?.[key as keyof typeof resultB.recommendation.scores] || 0;
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                  const aWins = valueA > valueB;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={aWins ? 'text-indigo-400 font-medium' : 'text-zinc-400'}>{resultA.companyResearch?.name || companyA}: {valueA}</span>
                        <span className="text-zinc-500">{label}</span>
                        <span className={!aWins ? 'text-cyan-400 font-medium' : 'text-zinc-400'}>{resultB.companyResearch?.name || companyB}: {valueB}</span>
                      </div>
                      <div className="flex gap-1 h-2">
                        <div className="flex-1 bg-zinc-800 rounded-l-full overflow-hidden flex justify-end">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${valueA}%` }} transition={{ duration: 0.8 }}
                            className="bg-indigo-500 rounded-l-full" />
                        </div>
                        <div className="flex-1 bg-zinc-800 rounded-r-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${valueB}%` }} transition={{ duration: 0.8 }}
                            className="bg-cyan-500 rounded-r-full" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Winner */}
              <div className="mt-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-center">
                <span className="text-sm text-zinc-400">Winner: </span>
                <span className="text-lg font-bold gradient-text">
                  {getOverallScore(resultA) >= getOverallScore(resultB)
                    ? resultA.companyResearch?.name || companyA
                    : resultB.companyResearch?.name || companyB}
                </span>
              </div>
            </GlassCard>
          )}

          <div className="flex justify-center">
            <button onClick={() => { setPhase('idle'); researchA.reset(); researchB.reset(); setResultA(null); setResultB(null); }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800/50 border border-white/10 text-zinc-300 hover:text-zinc-100 transition-all">
              <ArrowRight className="w-4 h-4" /> Compare Again
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
