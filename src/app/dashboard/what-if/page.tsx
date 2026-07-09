'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { ScoreGauge } from '@/components/shared/score-gauge';
import { Sliders, TrendingUp, TrendingDown, RotateCcw, Zap } from 'lucide-react';

interface Factor {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  default: number;
  impact: number; // -1 to 1: how much this factor positively impacts investment
}

const factors: Factor[] = [
  { id: 'interest', label: 'Interest Rate', unit: '%', min: 0, max: 15, step: 0.25, default: 5.25, impact: -0.8 },
  { id: 'inflation', label: 'Inflation Rate', unit: '%', min: 0, max: 12, step: 0.1, default: 3.2, impact: -0.6 },
  { id: 'oil', label: 'Oil Price', unit: '$/bbl', min: 30, max: 150, step: 1, default: 75, impact: -0.3 },
  { id: 'gdp', label: 'GDP Growth', unit: '%', min: -5, max: 10, step: 0.1, default: 2.5, impact: 0.9 },
  { id: 'dollar', label: 'Dollar Index', unit: 'DXY', min: 80, max: 120, step: 0.5, default: 104, impact: -0.4 },
  { id: 'tax', label: 'Corporate Tax', unit: '%', min: 10, max: 40, step: 1, default: 21, impact: -0.5 },
];

export default function WhatIfPage() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(factors.map(f => [f.id, f.default]))
  );

  const updateValue = useCallback((id: string, val: number) => {
    setValues(prev => ({ ...prev, [id]: val }));
  }, []);

  const resetAll = useCallback(() => {
    setValues(Object.fromEntries(factors.map(f => [f.id, f.default])));
  }, []);

  // Compute overall impact score (0-100)
  const computeScore = useCallback(() => {
    let totalImpact = 0;
    for (const f of factors) {
      const current = values[f.id];
      const range = f.max - f.min;
      const normalized = (current - f.min) / range; // 0 to 1
      const deviation = normalized - ((f.default - f.min) / range);
      totalImpact += deviation * f.impact * 20;
    }
    return Math.max(0, Math.min(100, 50 + totalImpact));
  }, [values]);

  const overallScore = computeScore();
  const recommendation = overallScore >= 65 ? 'FAVORABLE' : overallScore >= 40 ? 'NEUTRAL' : 'UNFAVORABLE';
  const recColor = overallScore >= 65 ? 'text-emerald-400' : overallScore >= 40 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 mb-1 font-[family-name:var(--font-outfit)]">
          <Sliders className="w-6 h-6 text-violet-400" /> What-If Simulator
        </h1>
        <p className="text-sm text-zinc-500">Adjust macroeconomic factors and see how they impact investment outlook</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders */}
        <div className="lg:col-span-2 space-y-4">
          {factors.map((f, i) => {
            const current = values[f.id];
            const isAboveDefault = current > f.default;
            const changePercent = ((current - f.default) / f.default * 100);

            return (
              <motion.div key={f.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-zinc-200">{f.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-mono font-bold text-zinc-100">{current}{f.unit !== 'DXY' && f.unit !== '$/bbl' ? '' : ''}</span>
                      <span className="text-xs text-zinc-500">{f.unit}</span>
                      {current !== f.default && (
                        <span className={`text-xs font-mono ${isAboveDefault ? (f.impact < 0 ? 'text-rose-400' : 'text-emerald-400') : (f.impact < 0 ? 'text-emerald-400' : 'text-rose-400')}`}>
                          {isAboveDefault ? '▲' : '▼'} {Math.abs(changePercent).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    value={current}
                    onChange={(e) => updateValue(f.id, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                    style={{ accentColor: '#818cf8' }}
                  />
                  <div className="flex justify-between text-[10px] text-zinc-600 mt-1 font-mono">
                    <span>{f.min}{f.unit}</span>
                    <span className="text-zinc-500">Default: {f.default}</span>
                    <span>{f.max}{f.unit}</span>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800/50 border border-white/10 text-zinc-400 hover:text-zinc-200 transition-all text-sm"
          >
            <RotateCcw className="w-4 h-4" /> Reset to Defaults
          </motion.button>
        </div>

        {/* Impact Dashboard */}
        <div className="space-y-4">
          <GlassCard className="p-6 text-center">
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">Investment Climate</h3>
            <ScoreGauge score={overallScore} size={140} />
            <motion.p
              key={recommendation}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-lg font-bold mt-4 font-[family-name:var(--font-outfit)] ${recColor}`}
            >
              {recommendation}
            </motion.p>
            <p className="text-xs text-zinc-500 mt-1">Based on current macro conditions</p>
          </GlassCard>

          <GlassCard className="p-5">
            <h4 className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Impact Signals</h4>
            <div className="space-y-2">
              {factors.map(f => {
                const current = values[f.id];
                const deviation = current - f.default;
                const isPositive = (deviation > 0 && f.impact > 0) || (deviation < 0 && f.impact < 0);
                const isNeutral = Math.abs(deviation) < f.step * 2;
                return (
                  <div key={f.id} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">{f.label}</span>
                    <span className={isNeutral ? 'text-zinc-600' : isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                      {isNeutral ? '—' : isPositive ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">AI Note</h4>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              This simulator uses simplified macro-economic models. Real investment decisions should consider many more factors. Use this as a directional guide, not financial advice.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
