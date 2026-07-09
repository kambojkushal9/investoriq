'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function AICore({ expanded = false }: { expanded?: boolean }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="relative flex items-center justify-center z-10"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: expanded ? 4 : 1, 
        opacity: expanded ? 0 : 1,
        x: mousePos.x,
        y: mousePos.y
      }}
      transition={{ 
        scale: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 1.2 },
        x: { type: 'spring', stiffness: 50, damping: 20 },
        y: { type: 'spring', stiffness: 50, damping: 20 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Core Glow */}
      <motion.div 
        className="absolute w-48 h-48 bg-indigo-500/30 rounded-full blur-2xl"
        animate={{ scale: isHovered ? 1.5 : [1, 1.2, 1], opacity: isHovered ? 0.6 : [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: isHovered ? 0 : Infinity, ease: "easeInOut" }}
      />

      {/* Rotating Rings */}
      <motion.div
        className="absolute w-56 h-56 rounded-full border border-indigo-400/20 border-l-indigo-400/60 border-r-indigo-400/60"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full border border-violet-400/10 border-t-violet-400/50 border-b-violet-400/50"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Inner Brain/Orb */}
      <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/40 to-violet-600/40 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden">
        {/* Inner energy */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"
          animate={{ y: ['100%', '-100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* AI Network Nodes inside */}
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-60">
          <motion.circle cx="50" cy="50" r="2" fill="white" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
          <motion.circle cx="30" cy="40" r="1.5" fill="white" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
          <motion.circle cx="70" cy="60" r="1.5" fill="white" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
          <motion.circle cx="60" cy="30" r="1.5" fill="white" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 1.5 }} />
          <path d="M50 50 L30 40 M50 50 L70 60 M50 50 L60 30" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        </svg>
      </div>
    </motion.div>
  );
}
