'use client';

import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ScoreGauge } from '@/components/shared/score-gauge';
import { GlassCard } from '@/components/shared/glass-card';
import type { InvestmentScores } from '@/lib/types';
import { getScoreColor } from '@/lib/utils';

interface ScoreCardProps {
  scores: InvestmentScores;
}

export function ScoreCard({ scores }: ScoreCardProps) {
  const radarData = [
    { subject: 'Financial\nHealth', value: scores.financialHealth, fullMark: 100 },
    { subject: 'Growth\nPotential', value: scores.growthPotential, fullMark: 100 },
    { subject: 'Competitive\nMoat', value: scores.competitiveMoat, fullMark: 100 },
    { subject: 'Market\nSentiment', value: scores.marketSentiment, fullMark: 100 },
    { subject: 'Risk\nProfile', value: scores.riskProfile, fullMark: 100 },
  ];

  const barData = [
    { name: 'Financial Health', score: scores.financialHealth },
    { name: 'Growth Potential', score: scores.growthPotential },
    { name: 'Competitive Moat', score: scores.competitiveMoat },
    { name: 'Market Sentiment', score: scores.marketSentiment },
    { name: 'Risk Profile', score: scores.riskProfile },
  ];

  const avgScore = Math.round(
    (scores.financialHealth + scores.growthPotential + scores.competitiveMoat +
     scores.marketSentiment + scores.riskProfile) / 5
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-zinc-100 font-[family-name:var(--font-outfit)]">Investment Scorecard</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Overall</span>
            <motion.span
              className="text-lg font-bold font-mono"
              style={{ color: getScoreColor(avgScore) }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              {avgScore}
            </motion.span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="w-full"
            >
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#a1a1aa', fontSize: 11 }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="#818cf8"
                    fill="url(#radarGradient)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
            <div className="mt-2">
              <ScoreGauge score={avgScore} size={80} label="Overall Score" />
            </div>
          </div>

          {/* Bar Chart + Gauges */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fill: '#a1a1aa', fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#13131d',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fafafa',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={18} animationDuration={1200} animationEasing="ease-out">
                    {barData.map((entry, index) => (
                      <Cell key={index} fill={getScoreColor(entry.score)} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Individual gauges */}
            <div className="flex justify-around mt-4">
              {barData.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                >
                  <ScoreGauge score={item.score} size={52} showValue={true} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
