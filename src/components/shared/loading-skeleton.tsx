'use client';

import { cn } from '@/lib/utils';

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return <div className={cn('skeleton-v2', className)} />;
}

export function ResearchSkeleton() {
  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <LoadingSkeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LoadingSkeleton className="h-32" />
        <LoadingSkeleton className="h-32" />
        <LoadingSkeleton className="h-32" />
      </div>
      <LoadingSkeleton className="h-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LoadingSkeleton className="h-48" />
        <LoadingSkeleton className="h-48" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-3">
      <LoadingSkeleton className="h-5 w-32" />
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-3/4" />
    </div>
  );
}

// AI Thinking skeleton with pulse effect
export function AIThinkingSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center animate-breathe">
          <div className="w-4 h-4 rounded-full bg-indigo-400/60" />
        </div>
        <div className="space-y-1.5 flex-1">
          <LoadingSkeleton className="h-4 w-40" />
          <LoadingSkeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <LoadingSkeleton className="h-3 w-full" />
        <LoadingSkeleton className="h-3 w-5/6" />
        <LoadingSkeleton className="h-3 w-4/6" />
      </div>
    </div>
  );
}
