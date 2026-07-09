'use client';

import { useEffect, useState, useCallback } from 'react';

interface CounterNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  format?: 'currency' | 'percent' | 'number' | 'compact';
}

export function CounterNumber({
  value,
  duration = 1200,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  format,
}: CounterNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  const formatValue = useCallback((val: number) => {
    if (format === 'currency') {
      if (Math.abs(val) >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
      if (Math.abs(val) >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
      if (Math.abs(val) >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
      return `$${val.toFixed(2)}`;
    }
    if (format === 'percent') return `${val.toFixed(1)}%`;
    if (format === 'compact') {
      if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
      if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`;
    }
    return val.toFixed(decimals);
  }, [format, decimals]);

  useEffect(() => {
    let startTime: number;
    let animationId: number;
    const startValue = displayValue;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (value - startValue) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{formatValue(displayValue)}{suffix}
    </span>
  );
}
