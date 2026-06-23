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
        <h3 className="text-lg font-semibold text-zinc-100 mb-6">Investment Scorecard</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#a1a1aa', fontSize: 11 }}
                />
                <Radar
                  dataKey="value"
                  stroke="#818cf8"
                  fill="#818cf8"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-2">
              <ScoreGauge score={avgScore} size={80} label="Overall Score" />
            </div>
          </div>

          {/* Bar Chart */}
          <div>
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
                    backgroundColor: '#1a1a24',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fafafa',
                  }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={getScoreColor(entry.score)} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Individual gauges */}
            <div className="flex justify-around mt-4">
              {barData.map((item) => (
                <ScoreGauge key={item.name} score={item.score} size={56} showValue={true} />
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
