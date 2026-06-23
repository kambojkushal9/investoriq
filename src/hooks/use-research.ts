'use client';

import { useState, useCallback, useRef } from 'react';
import type { ResearchState, ResearchEvent } from '@/lib/types';

interface UseResearchReturn {
  isLoading: boolean;
  currentStep: string;
  completedSteps: string[];
  result: ResearchState | null;
  reportId: string | null;
  error: string | null;
  startResearch: (company: string) => void;
  reset: () => void;
}

export function useResearch(): UseResearchReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [result, setResult] = useState<ResearchState | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setIsLoading(false);
    setCurrentStep('');
    setCompletedSteps([]);
    setResult(null);
    setReportId(null);
    setError(null);
  }, []);

  const startResearch = useCallback(async (company: string) => {
    reset();
    setIsLoading(true);
    setCurrentStep('company_research');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Research failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setIsLoading(false);
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;

          try {
            const event: ResearchEvent & { data?: Record<string, unknown>; label?: string } = JSON.parse(line.slice(6));

            switch (event.type) {
              case 'step_start':
                setCurrentStep(event.step);
                break;

              case 'step_complete':
                setCompletedSteps(prev => {
                  if (!prev.includes(event.step)) return [...prev, event.step];
                  return prev;
                });
                // Auto-advance to next step
                break;

              case 'step_error':
                setError(event.error || 'An error occurred');
                break;

              case 'complete':
                if (event.data) {
                  setResult(event.data as unknown as ResearchState);
                  if ((event.data as Record<string, unknown>).reportId) {
                    setReportId((event.data as Record<string, string>).reportId);
                  }
                }
                setIsLoading(false);
                setCurrentStep('complete');
                break;
            }
          } catch {
            // Skip malformed events
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message || 'Research failed');
        setIsLoading(false);
      }
    }
  }, [reset]);

  return {
    isLoading,
    currentStep,
    completedSteps,
    result,
    reportId,
    error,
    startResearch,
    reset,
  };
}
