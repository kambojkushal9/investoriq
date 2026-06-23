'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { ArrowUp, ArrowDown, Shield, Lightbulb } from 'lucide-react';
import type { SWOTAnalysis as SWOTType } from '@/lib/types';

interface SWOTAnalysisProps {
  swot: SWOTType;
}

export function SWOTAnalysis({ swot }: SWOTAnalysisProps) {
  const quadrants = [
    {
      title: 'Strengths',
      items: swot.strengths,
      icon: <ArrowUp className="w-4 h-4" />,
      color: 'emerald',
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15',
    },
    {
      title: 'Weaknesses',
      items: swot.weaknesses,
      icon: <ArrowDown className="w-4 h-4" />,
      color: 'rose',
      bg: 'bg-rose-500/5',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      iconBg: 'bg-rose-500/15',
    },
    {
      title: 'Opportunities',
      items: swot.opportunities,
      icon: <Lightbulb className="w-4 h-4" />,
      color: 'indigo',
      bg: 'bg-indigo-500/5',
      border: 'border-indigo-500/20',
      text: 'text-indigo-400',
      iconBg: 'bg-indigo-500/15',
    },
    {
      title: 'Threats',
      items: swot.threats,
      icon: <Shield className="w-4 h-4" />,
      color: 'amber',
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      iconBg: 'bg-amber-500/15',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">SWOT Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quadrants.map((quad, i) => (
            <motion.div
              key={quad.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={`${quad.bg} ${quad.border} border rounded-xl p-4`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`${quad.iconBg} ${quad.text} w-7 h-7 rounded-lg flex items-center justify-center`}>
                  {quad.icon}
                </div>
                <h4 className={`font-semibold text-sm ${quad.text}`}>{quad.title}</h4>
              </div>
              <ul className="space-y-2">
                {quad.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2">
                    <span className={`${quad.text} mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-current`} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
