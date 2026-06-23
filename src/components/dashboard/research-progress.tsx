'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, AlertCircle, Building2, TrendingUp, Newspaper, MessageSquare, ShieldAlert, Award } from 'lucide-react';
import { RESEARCH_STEPS } from '@/lib/types';

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Newspaper: <Newspaper className="w-4 h-4" />,
  MessageSquare: <MessageSquare className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  Award: <Award className="w-4 h-4" />,
};

interface ResearchProgressProps {
  currentStep: string;
  completedSteps: string[];
  error: string | null;
}

export function ResearchProgress({ currentStep, completedSteps, error }: ResearchProgressProps) {
  return (
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
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="step-line"
          >
            <div className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-300 ${
              isCurrent ? 'bg-indigo-500/10 border border-indigo-500/20' :
              isCompleted ? 'bg-emerald-500/5' : 'opacity-40'
            }`}>
              {/* Status icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isCompleted ? 'bg-emerald-500/20 text-emerald-400' :
                isCurrent ? 'bg-indigo-500/20 text-indigo-400' :
                'bg-zinc-800 text-zinc-500'
              }`}>
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : isCurrent ? (
                    <motion.div
                      key="loading"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
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

              {/* Label */}
              <span className={`text-sm font-medium ${
                isCompleted ? 'text-emerald-400' :
                isCurrent ? 'text-indigo-300' :
                'text-zinc-500'
              }`}>
                {step.label}
              </span>

              {/* Status badge */}
              {isCurrent && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="ml-auto text-xs text-indigo-400 font-mono"
                >
                  Processing...
                </motion.span>
              )}
              {isCompleted && (
                <span className="ml-auto text-xs text-emerald-500/60">Done</span>
              )}
              {isPending && (
                <span className="ml-auto text-xs text-zinc-600">Pending</span>
              )}
            </div>
          </motion.div>
        );
      })}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 mt-4"
        >
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-300">{error}</span>
        </motion.div>
      )}
    </div>
  );
}
