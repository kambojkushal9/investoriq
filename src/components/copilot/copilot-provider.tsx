'use client';

// ============================================
// AI Investment Copilot — React Context Provider
// ============================================

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { ResearchState } from '@/lib/types';
import type { CopilotMessage, CopilotContext, ExplainMode } from '@/lib/copilot/types';
import { generateId } from '@/lib/utils';

interface CopilotState {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  messages: CopilotMessage[];
  isStreaming: boolean;
  context: CopilotContext;
  explainMode: ExplainMode;
  setExplainMode: (mode: ExplainMode) => void;
  setResearchState: (state: ResearchState | null) => void;
  sendMessage: (text: string) => void;
  explainScreen: () => void;
  clearConversation: () => void;
  hasInsights: boolean;
}

const CopilotCtx = createContext<CopilotState | null>(null);

export function useCopilot() {
  const ctx = useContext(CopilotCtx);
  if (!ctx) throw new Error('useCopilot must be used within CopilotProvider');
  return ctx;
}

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [explainMode, setExplainMode] = useState<ExplainMode>('default');
  const [researchState, setResearchState] = useState<ResearchState | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Derive context
  const context: CopilotContext = {
    currentPage: pathname,
    activeCompany: researchState?.companyResearch?.name || researchState?.company || null,
    activeTicker: researchState?.ticker || null,
    researchState,
    explainMode,
  };

  const hasInsights = !!researchState?.recommendation;

  // Load messages from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('copilot_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setMessages(parsed.map((m: CopilotMessage) => ({ ...m, isStreaming: false })));
      }
    } catch { /* ignore */ }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        const toSave = messages.filter(m => !m.isStreaming).slice(-50);
        localStorage.setItem('copilot_messages', JSON.stringify(toSave));
      } catch { /* ignore */ }
    }
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (isStreaming || !text.trim()) return;

    // Abort any existing stream
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const userMsg: CopilotMessage = {
      id: generateId(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };

    const assistantId = generateId();
    const assistantMsg: CopilotMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    try {
      const history = messages.filter(m => !m.isStreaming).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context, history }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error('Copilot request failed');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === 'chunk') {
              fullContent += event.content;
              setMessages(prev =>
                prev.map(m => m.id === assistantId ? { ...m, content: fullContent } : m)
              );
            } else if (event.type === 'done') {
              // Parse suggestions from the end of the response
              let suggestions: string[] = [];
              let cleanContent = fullContent;
              const sugMatch = fullContent.match(/SUGGESTIONS:\s*(\[[\s\S]*\])\s*$/);
              if (sugMatch) {
                try {
                  suggestions = JSON.parse(sugMatch[1]);
                  cleanContent = fullContent.slice(0, sugMatch.index).trim();
                } catch { /* ignore parse errors */ }
              }
              setMessages(prev =>
                prev.map(m => m.id === assistantId ? { ...m, content: cleanContent, isStreaming: false, suggestions } : m)
              );
            } else if (event.type === 'error') {
              setMessages(prev =>
                prev.map(m => m.id === assistantId ? { ...m, content: `Error: ${event.content}`, isStreaming: false } : m)
              );
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: 'Sorry, I encountered an error. Please try again.', isStreaming: false } : m)
        );
      }
    } finally {
      setIsStreaming(false);
    }
  }, [isStreaming, messages, context]);

  const explainScreenFn = useCallback(async () => {
    if (isStreaming) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const userMsg: CopilotMessage = {
      id: generateId(),
      role: 'user',
      content: '🔍 Explain This Screen',
      timestamp: Date.now(),
    };

    const assistantId = generateId();
    const assistantMsg: CopilotMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);
    if (!isOpen) setIsOpen(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '', context, history: [], explainScreen: true }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error('Request failed');
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No stream');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === 'chunk') {
              fullContent += event.content;
              setMessages(prev =>
                prev.map(m => m.id === assistantId ? { ...m, content: fullContent } : m)
              );
            } else if (event.type === 'done') {
              let suggestions: string[] = [];
              let cleanContent = fullContent;
              const sugMatch = fullContent.match(/SUGGESTIONS:\s*(\[[\s\S]*\])\s*$/);
              if (sugMatch) {
                try { suggestions = JSON.parse(sugMatch[1]); cleanContent = fullContent.slice(0, sugMatch.index).trim(); } catch {}
              }
              setMessages(prev =>
                prev.map(m => m.id === assistantId ? { ...m, content: cleanContent, isStreaming: false, suggestions } : m)
              );
            } else if (event.type === 'error') {
              setMessages(prev =>
                prev.map(m => m.id === assistantId ? { ...m, content: `Error: ${event.content}`, isStreaming: false } : m)
              );
            }
          } catch {}
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: 'Sorry, I encountered an error.', isStreaming: false } : m)
        );
      }
    } finally {
      setIsStreaming(false);
    }
  }, [isStreaming, context, isOpen]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('copilot_messages');
  }, []);

  return (
    <CopilotCtx.Provider value={{
      isOpen, setIsOpen,
      messages, isStreaming,
      context, explainMode, setExplainMode,
      setResearchState,
      sendMessage, explainScreen: explainScreenFn,
      clearConversation, hasInsights,
    }}>
      {children}
    </CopilotCtx.Provider>
  );
}
