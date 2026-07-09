'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, AlertCircle, Building2, TrendingUp, Newspaper, MessageSquare, ShieldAlert, Award } from 'lucide-react';
import { RESEARCH_STEPS } from '@/lib/types';
import { useEffect, useState } from 'react';

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Newspaper: <Newspaper className="w-4 h-4" />,
  MessageSquare: <MessageSquare className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  Award: <Award className="w-4 h-4" />,
};

const subMessages: Record<string, string[]> = {
  company_research: ['Scanning SEC filings...', 'Reading annual reports...', 'Analyzing business model...', 'Mapping competitive landscape...'],
  financial_analysis: ['Evaluating balance sheet...', 'Computing profitability ratios...', 'Analyzing cash flows...', 'Assessing valuation metrics...'],
  news_intelligence: ['Scanning news databases...', 'Analyzing media sentiment...', 'Identifying key themes...', 'Tracking developments...'],
  market_sentiment: ['Reading social media...', 'Checking Reddit forums...', 'Aggregating analyst opinions...', 'Computing sentiment score...'],
  risk_assessment: ['Evaluating market risk...', 'Assessing financial risk...', 'Checking regulatory exposure...', 'Computing risk scores...'],
  investment_committee: ['Reviewing all findings...', 'Debating bull vs bear...', 'Scoring investment factors...', 'Generating final thesis...'],
};

interface ResearchProgressProps {
  currentStep: string;
  completedSteps: string[];
  error: string | null;
}

export function ResearchProgress({ currentStep, completedSteps, error }: ResearchProgressProps) {
  const [subMessage, setSubMessage] = useState('');
  const totalSteps = RESEARCH_STEPS.length;
  const completedCount = completedSteps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  // Cycle through sub-messages for current step
  useEffect(() => {
    if (!currentStep || currentStep === 'complete') return;
    const messages = subMessages[currentStep] || [];
    if (messages.length === 0) return;

    let idx = 0;
    setSubMessage(messages[0]);
    const interval = setInterval(() => {
      idx = (idx + 1) % messages.length;
      setSubMessage(messages[idx]);
    }, 2500);

    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="space-y-4">
      {/* Overall progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs font-mono text-zinc-400 w-10 text-right">{progressPercent}%</span>
      </div>

      {/* Steps */}
      <div className="space-y-1">
        {RESEARCH_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isPending = !isCompleted && !isCurrent;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className="step-line"
            >
              <div className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-300 ${
                isCurrent ? 'bg-indigo-500/8 border border-indigo-500/20' :
                isCompleted ? 'bg-emerald-500/5 border border-transparent' :
                'opacity-35 border border-transparent'
              }`}>
                {/* Status icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isCompleted ? 'bg-emerald-500/20 text-emerald-400' :
                  isCurrent ? 'bg-indigo-500/20 text-indigo-400' :
                  'bg-zinc-800 text-zinc-500'
                }`}>
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    ) : isCurrent ? (
                      <motion.div
                        key="loading"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <div key="icon">
                        {iconMap[step.icon]}
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Label + sub-message */}
                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-medium block ${
                    isCompleted ? 'text-emerald-400' :
                    isCurrent ? 'text-indigo-300' :
                    'text-zinc-500'
                  }`}>
                    {step.label}
                  </span>
                  {isCurrent && subMessage && (
                    <motion.span
                      key={subMessage}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-zinc-500 block mt-0.5 font-mono"
                    >
                      {subMessage}
                    </motion.span>
                  )}
                </div>

                {/* Status badge */}
                {isCurrent && (
                  <div className="flex items-center gap-1.5 ml-auto">
                    <div className="flex gap-0.5">
                      <span className="typing-dot w-1 h-1 rounded-full bg-indigo-400" />
                      <span className="typing-dot w-1 h-1 rounded-full bg-indigo-400" />
                      <span className="typing-dot w-1 h-1 rounded-full bg-indigo-400" />
                    </div>
                  </div>
                )}
                {isCompleted && (
                  <span className="ml-auto text-xs text-emerald-500/60 font-mono">Done</span>
                )}
                {isPending && (
                  <span className="ml-auto text-xs text-zinc-600">Pending</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mt-4"
        >
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-300">{error}</span>
        </motion.div>
      )}
    </div>
  );
}
