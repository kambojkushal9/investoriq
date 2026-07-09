'use client';

import { motion } from 'framer-motion';

interface AIOrbProps {
  size?: number;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function AIOrb({ size = 120, className = '', intensity = 'medium' }: AIOrbProps) {
  const intensityMap = {
    low: { scale: [1, 1.02, 1], opacity: [0.5, 0.7, 0.5] },
    medium: { scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6] },
    high: { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] },
  };

  const anim = intensityMap[intensity];

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)',
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1), transparent 70%)',
        }}
        animate={{ scale: [1.1, 1.5, 1.1], opacity: [0.2, 0.05, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Main orb */}
      <motion.div
        className="absolute rounded-full ai-orb"
        style={{
          inset: '15%',
          background: `
            radial-gradient(circle at 35% 35%,
              rgba(129, 140, 248, 0.8),
              rgba(99, 102, 241, 0.6) 30%,
              rgba(6, 182, 212, 0.4) 60%,
              rgba(52, 211, 153, 0.2) 80%,
              transparent
            )
          `,
        }}
        animate={anim}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Inner rotating gradient */}
      <motion.div
        className="absolute rounded-full ai-orb-inner"
        style={{
          inset: '25%',
          background: `
            conic-gradient(
              from 0deg,
              rgba(129, 140, 248, 0.6),
              rgba(6, 182, 212, 0.4),
              rgba(52, 211, 153, 0.3),
              rgba(129, 140, 248, 0.6)
            )
          `,
          filter: 'blur(8px)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      {/* Center bright spot */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: '35%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4), rgba(129, 140, 248, 0.2), transparent)',
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
