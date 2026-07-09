'use client';

// ============================================
// AI Investment Copilot — Message Component
// ============================================

import { motion } from 'framer-motion';
import { Sparkles, User } from 'lucide-react';
import type { CopilotMessage } from '@/lib/copilot/types';

interface CopilotMessageBubbleProps {
  message: CopilotMessage;
  onSuggestionClick?: (text: string) => void;
}

export function CopilotMessageBubble({ message, onSuggestionClick }: CopilotMessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
        isUser
          ? 'bg-zinc-800 border border-white/10'
          : 'bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/20'
      }`}>
        {isUser ? (
          <User className="w-3.5 h-3.5 text-zinc-400" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600/20 border border-indigo-500/20 text-zinc-200 rounded-tr-md'
            : 'bg-zinc-800/50 border border-white/5 text-zinc-300 rounded-tl-md'
        }`}>
          {/* Render markdown-lite: bold, headers, bullets */}
          <div className="copilot-prose">
            {message.content.split('\n').map((line, i) => {
              // Headers
              if (line.startsWith('### ')) return <h4 key={i} className="text-xs font-semibold text-zinc-200 mt-2 mb-1">{line.slice(4)}</h4>;
              if (line.startsWith('## ')) return <h3 key={i} className="text-sm font-semibold text-zinc-100 mt-3 mb-1">{line.slice(3)}</h3>;
              if (line.startsWith('# ')) return <h2 key={i} className="text-sm font-bold text-zinc-100 mt-3 mb-1">{line.slice(2)}</h2>;

              // Bullet points
              if (line.startsWith('- ') || line.startsWith('• ')) {
                return (
                  <div key={i} className="flex gap-1.5 ml-1 my-0.5">
                    <span className="text-indigo-400 mt-0.5 flex-shrink-0">•</span>
                    <span>{renderInlineFormatting(line.slice(2))}</span>
                  </div>
                );
              }

              // Numbered lists
              const numMatch = line.match(/^(\d+)\.\s/);
              if (numMatch) {
                return (
                  <div key={i} className="flex gap-1.5 ml-1 my-0.5">
                    <span className="text-indigo-400 font-mono text-xs mt-0.5 flex-shrink-0 w-4">{numMatch[1]}.</span>
                    <span>{renderInlineFormatting(line.slice(numMatch[0].length))}</span>
                  </div>
                );
              }

              // Empty lines
              if (!line.trim()) return <div key={i} className="h-2" />;

              // Regular text
              return <p key={i} className="my-0.5">{renderInlineFormatting(line)}</p>;
            })}
          </div>

          {/* Typing indicator */}
          {message.isStreaming && (
            <div className="flex gap-1 mt-1.5 items-center">
              <div className="typing-dot w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <div className="typing-dot w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <div className="typing-dot w-1.5 h-1.5 rounded-full bg-indigo-400" />
            </div>
          )}
        </div>

        {/* Suggestions */}
        {message.suggestions && message.suggestions.length > 0 && !message.isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-1.5 mt-2"
          >
            {message.suggestions.map((s, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSuggestionClick?.(s)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition-colors leading-tight"
              >
                {s}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Simple inline formatting: **bold**, *italic*, `code`
function renderInlineFormatting(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index)}</span>);
      }
      parts.push(<strong key={key++} className="font-semibold text-zinc-100">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      continue;
    }

    // Code
    const codeMatch = remaining.match(/`(.+?)`/);
    if (codeMatch && codeMatch.index !== undefined) {
      if (codeMatch.index > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, codeMatch.index)}</span>);
      }
      parts.push(<code key={key++} className="px-1 py-0.5 rounded bg-zinc-700/50 text-indigo-300 text-[11px] font-mono">{codeMatch[1]}</code>);
      remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
      continue;
    }

    // No more formatting
    parts.push(<span key={key++}>{remaining}</span>);
    break;
  }

  return <>{parts}</>;
}
