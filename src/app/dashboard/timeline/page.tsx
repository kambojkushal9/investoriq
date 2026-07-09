'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { ScoreGauge } from '@/components/shared/score-gauge';
import { Timer, TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const timelineData = [
  {
    period: 'Today',
    label: 'Current State',
    confidence: 95,
    growth: 'Strong fundamentals with positive momentum across key metrics',
    risk: 'Near-term volatility from macroeconomic uncertainty',
    opportunity: 'AI-driven efficiency gains and market expansion',
    color: 'indigo',
  },
  {
    period: '3 Months',
    label: 'Short Term',
    confidence: 82,
    growth: 'Expected earnings growth driven by product cycle and demand',
    risk: 'Potential interest rate changes and regulatory developments',
    opportunity: 'New product launches and strategic partnerships',
    color: 'cyan',
  },
  {
    period: '6 Months',
    label: 'Medium Term',
    confidence: 70,
    growth: 'Revenue diversification and market share expansion',
    risk: 'Competitive pressure and margin compression risks',
    opportunity: 'International expansion and emerging market penetration',
    color: 'emerald',
  },
  {
    period: '1 Year',
    label: 'Long Term',
    confidence: 58,
    growth: 'Sustainable growth trajectory supported by R&D investment',
    risk: 'Technology disruption and shifting consumer preferences',
    opportunity: 'Platform ecosystem monetization and recurring revenue',
    color: 'amber',
  },
  {
    period: '3 Years',
    label: 'Extended',
    confidence: 35,
    growth: 'Industry transformation potential with paradigm shift possibilities',
    risk: 'Significant uncertainty in technology evolution and regulation',
    opportunity: 'Category creation and next-generation platform leadership',
    color: 'rose',
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', dot: 'bg-indigo-400' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', dot: 'bg-rose-400' },
};

export default function TimelinePage() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 mb-1 font-[family-name:var(--font-outfit)]">
          <Timer className="w-6 h-6 text-violet-400" /> AI Prediction Timeline
        </h1>
        <p className="text-sm text-zinc-500">Forward-looking analysis with decreasing confidence over time</p>
      </motion.div>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/30 via-cyan-500/20 via-emerald-500/15 via-amber-500/10 to-rose-500/5" />

        <div className="space-y-6">
          {timelineData.map((item, i) => {
            const c = colorMap[item.color];
            return (
              <motion.div
                key={item.period}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12, type: 'spring', stiffness: 150 }}
                className="relative pl-16 md:pl-20"
                style={{ opacity: 0.4 + (item.confidence / 100) * 0.6 }}
              >
                {/* Timeline dot */}
                <motion.div
                  className={`absolute left-4 md:left-6 top-6 w-4 h-4 rounded-full ${c.dot} border-4 border-[#07070a]`}
                  animate={i === 0 ? { scale: [1, 1.3, 1], boxShadow: ['0 0 0 rgba(129,140,248,0)', '0 0 12px rgba(129,140,248,0.4)', '0 0 0 rgba(129,140,248,0)'] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <GlassCard className={`p-6 ${c.border} border`} tilt>
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-lg font-bold ${c.text} font-[family-name:var(--font-outfit)]`}>{item.period}</span>
                        <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded">{item.label}</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-emerald-400">Growth</span>
                            <p className="text-sm text-zinc-400">{item.growth}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-amber-400">Risk</span>
                            <p className="text-sm text-zinc-400">{item.risk}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-cyan-400">Opportunity</span>
                            <p className="text-sm text-zinc-400">{item.opportunity}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <ScoreGauge score={item.confidence} size={80} label="Confidence" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-10 text-center">
        <p className="text-xs text-zinc-600 mb-4">Run a company analysis first to get personalized predictions</p>
        <Link href="/dashboard">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors">
            Start Research <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
