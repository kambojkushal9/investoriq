'use client';

// ============================================
// AI Investment Copilot — Floating AI Orb
// ============================================

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useCopilot } from './copilot-provider';

export function CopilotOrb() {
  const { isOpen, setIsOpen, isStreaming, hasInsights } = useCopilot();

  if (isOpen) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 z-[90] group"
      aria-label="Open AI Copilot"
    >
      {/* Outer pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/30 to-cyan-500/30"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 0, 0.4],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Second ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20"
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Main orb */}
      <motion.div
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 border border-indigo-400/20"
        whileHover={{
          scale: 1.1,
          boxShadow: '0 0 40px rgba(99, 102, 241, 0.5), 0 0 80px rgba(6, 182, 212, 0.2)',
        }}
        whileTap={{ scale: 0.95 }}
        animate={isStreaming ? {
          boxShadow: [
            '0 0 20px rgba(99, 102, 241, 0.3)',
            '0 0 40px rgba(6, 182, 212, 0.4)',
            '0 0 20px rgba(99, 102, 241, 0.3)',
          ],
        } : {
          boxShadow: [
            '0 0 20px rgba(99, 102, 241, 0.2)',
            '0 0 30px rgba(99, 102, 241, 0.3)',
            '0 0 20px rgba(99, 102, 241, 0.2)',
          ],
        }}
        transition={{ duration: isStreaming ? 1 : 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Inner gradient */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/10 to-transparent" />

        {/* Icon */}
        <Sparkles className="w-6 h-6 text-white relative z-10" />

        {/* Glass reflection */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-3 rounded-full bg-white/20 blur-sm" />
      </motion.div>

      {/* Notification dot */}
      {hasInsights && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#07070a] flex items-center justify-center"
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-300"
            animate={{ scale: [1, 0.6, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 rounded-lg bg-zinc-800/90 border border-white/10 text-xs text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm">
        AI Copilot
        <div className="absolute top-full right-5 w-2 h-2 bg-zinc-800/90 border-r border-b border-white/10 transform rotate-45 -mt-1" />
      </div>
    </motion.button>
  );
}
