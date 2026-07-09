'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getScoreColor } from '@/lib/utils';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
  showValue?: boolean;
}

export function ScoreGauge({ score, size = 120, label, showValue = true }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [displayValue, setDisplayValue] = useState(0);
  const strokeWidth = size > 80 ? 8 : 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(score);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 200);
    return () => clearTimeout(timer);
  }, [score]);

  // Animated counter
  useEffect(() => {
    let startTime: number;
    let animationId: number;
    const duration = 1200;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * score));
      if (progress < 1) animationId = requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 200);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationId);
    };
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow behind */}
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: strokeWidth,
            background: `radial-gradient(circle, ${color}15, transparent 70%)`,
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
          />
          {/* Score circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="score-gauge-ring"
            style={{
              filter: `drop-shadow(0 0 8px ${color}50)`,
            }}
          />
        </svg>

        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-bold font-mono"
              style={{
                color,
                fontSize: size > 80 ? '1.5rem' : size > 60 ? '1.125rem' : '0.875rem',
              }}
            >
              {displayValue}
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="text-xs text-zinc-400 text-center leading-tight">{label}</span>
      )}
    </div>
  );
}
