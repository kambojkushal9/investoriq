'use client';

// ============================================
// AI Investment Copilot — Side Panel
// ============================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, Sparkles, MessageSquare, Lightbulb, Zap,
  Trash2, Eye, ChevronDown, Brain,
} from 'lucide-react';
import { useCopilot } from './copilot-provider';
import { CopilotMessageBubble } from './copilot-message';
import { CopilotInsights } from './copilot-insights';
import { QUICK_ACTIONS, EXPLAIN_MODE_LABELS } from '@/lib/copilot/types';
import type { ExplainMode } from '@/lib/copilot/types';

const TABS = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'actions', label: 'Actions', icon: Zap },
] as const;

type TabId = typeof TABS[number]['id'];

export function CopilotPanel() {
  const {
    isOpen, setIsOpen,
    messages, isStreaming,
    context, explainMode, setExplainMode,
    sendMessage, explainScreen,
    clearConversation, hasInsights,
  } = useCopilot();

  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [input, setInput] = useState('');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, activeTab]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput('');
    setActiveTab('chat');
  };

  const handleSuggestionClick = (text: string) => {
    sendMessage(text);
    setActiveTab('chat');
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
    setActiveTab('chat');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[90] md:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-screen w-full md:w-[420px] z-[95] flex flex-col bg-[#0a0a10]/95 border-l border-white/5 backdrop-blur-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center border border-indigo-500/20">
                  <Brain className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-100 font-[family-name:var(--font-outfit)]">AI Copilot</h2>
                  <p className="text-[10px] text-zinc-500">
                    {context.activeCompany
                      ? `Analyzing ${context.activeCompany}`
                      : 'Ready to assist'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Explain Mode Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowModeDropdown(!showModeDropdown)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    {EXPLAIN_MODE_LABELS[explainMode]}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {showModeDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute top-full right-0 mt-1 w-48 py-1 bg-zinc-900/95 border border-white/10 rounded-xl shadow-2xl z-10 backdrop-blur-xl"
                      >
                        {(Object.entries(EXPLAIN_MODE_LABELS) as [ExplainMode, string][]).map(([mode, label]) => (
                          <button
                            key={mode}
                            onClick={() => { setExplainMode(mode); setShowModeDropdown(false); }}
                            className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                              explainMode === mode
                                ? 'text-indigo-300 bg-indigo-500/10'
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={clearConversation}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
                  title="Clear conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Explain This Screen button */}
            <div className="px-4 py-2 border-b border-white/5 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={explainScreen}
                disabled={isStreaming}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium hover:from-indigo-500/20 hover:to-cyan-500/20 transition-all disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Explain This Screen
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="flex px-4 pt-2 gap-1 border-b border-white/5 flex-shrink-0">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors rounded-t-lg ${
                    activeTab === tab.id
                      ? 'text-indigo-300 bg-indigo-500/5'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.id === 'insights' && hasInsights && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="copilot-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'chat' && (
                <div className="p-4 space-y-4">
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center mb-4 border border-indigo-500/20">
                          <Sparkles className="w-7 h-7 text-indigo-400" />
                        </div>
                      </motion.div>
                      <h3 className="text-sm font-semibold text-zinc-300 mb-1 font-[family-name:var(--font-outfit)]">
                        AI Copilot Ready
                      </h3>
                      <p className="text-[11px] text-zinc-500 max-w-[250px] leading-relaxed">
                        {context.activeCompany
                          ? `Ask me anything about ${context.activeCompany} — financials, risks, competitors, or investment thesis.`
                          : 'Research a company first, then I can analyze everything for you.'}
                      </p>
                    </motion.div>
                  )}
                  {messages.map(msg => (
                    <CopilotMessageBubble
                      key={msg.id}
                      message={msg}
                      onSuggestionClick={handleSuggestionClick}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="p-4">
                  <CopilotInsights researchState={context.researchState} />
                </div>
              )}

              {activeTab === 'actions' && (
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-3">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_ACTIONS.map((action, i) => (
                      <motion.button
                        key={action.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickAction(action.prompt)}
                        disabled={action.requiresResearch && !context.researchState?.recommendation}
                        className="p-3 rounded-xl bg-zinc-800/50 border border-white/5 text-left hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                      >
                        <span className="text-xs font-medium text-zinc-300 group-hover:text-indigo-300 transition-colors">{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                  {!context.researchState?.recommendation && (
                    <p className="text-[10px] text-zinc-600 mt-3 text-center">
                      Research a company to unlock quick actions
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/5 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={context.activeCompany ? `Ask about ${context.activeCompany}...` : 'Ask a question...'}
                  disabled={isStreaming}
                  className="flex-1 bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40 transition-colors disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isStreaming}
                  className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:opacity-40 flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
