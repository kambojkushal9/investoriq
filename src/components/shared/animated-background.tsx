'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

interface FloatingLabel {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  opacity: number;
  size: number;
}

const STOCK_LABELS = [
  '$198.45', '$875.12', '$412.78', '$176.89',
  '+2.34%', '-1.23%', '+5.67%', '-0.89%',
  'AAPL', 'NVDA', 'TSLA', 'MSFT',
  '52W H', 'P/E 28', 'EPS $6.4', 'MCap $3T',
];

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const labelsRef = useRef<FloatingLabel[]>([]);
  const animIdRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
    // Update CSS custom properties for spotlight
    document.documentElement.style.setProperty('--spotlight-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--spotlight-y', `${e.clientY}px`);
    document.documentElement.style.setProperty('--spotlight-opacity', '1');
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function initParticles() {
      particlesRef.current = [];
      const count = Math.min(50, Math.floor(canvas!.width * canvas!.height / 25000));
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.35 + 0.05,
          hue: Math.random() > 0.5 ? 245 : 185, // indigo or cyan
        });
      }
    }

    function initLabels() {
      labelsRef.current = [];
      for (let i = 0; i < 8; i++) {
        labelsRef.current.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          text: STOCK_LABELS[Math.floor(Math.random() * STOCK_LABELS.length)],
          opacity: Math.random() * 0.12 + 0.03,
          size: Math.random() * 2 + 9,
        });
      }
    }

    function drawGrid(time: number) {
      if (!ctx || !canvas) return;
      const spacing = 70;
      const pulseSpeed = 0.0005;

      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += spacing) {
        const pulse = Math.sin(time * pulseSpeed + x * 0.01) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.015 + pulse * 0.015})`;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += spacing) {
        const pulse = Math.sin(time * pulseSpeed + y * 0.01) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.015 + pulse * 0.015})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    function drawFinancialGraphs(time: number) {
      if (!ctx || !canvas) return;
      
      // Primary financial line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.12)';
      ctx.lineWidth = 1.5;
      const baseY = canvas.height * 0.55;
      for (let x = 0; x < canvas.width; x += 2) {
        const y = baseY +
          Math.sin(x * 0.008 + time * 0.0008) * 40 +
          Math.sin(x * 0.015 + time * 0.0015) * 25 +
          Math.sin(x * 0.003 + time * 0.0004) * 60;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Gradient fill below the line
      const gradient = ctx.createLinearGradient(0, baseY - 60, 0, baseY + 100);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.04)');
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Secondary line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.07)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 3) {
        const y = baseY + 30 +
          Math.sin(x * 0.006 + time * 0.001 + 2) * 35 +
          Math.cos(x * 0.012 + time * 0.0008) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    function drawCandlesticks(time: number) {
      if (!ctx || !canvas) return;
      const baseY = canvas.height * 0.3;
      const spacing = 30;
      const count = 12;
      const startX = canvas.width * 0.65;

      ctx.globalAlpha = 0.06;
      for (let i = 0; i < count; i++) {
        const x = startX + i * spacing;
        const open = baseY + Math.sin(i * 0.5 + time * 0.001) * 30;
        const close = open + (Math.sin(i * 0.7 + time * 0.0015) * 20);
        const high = Math.min(open, close) - Math.abs(Math.sin(i + time * 0.001)) * 15;
        const low = Math.max(open, close) + Math.abs(Math.cos(i + time * 0.001)) * 15;
        const bullish = close < open;

        // Wick
        ctx.strokeStyle = bullish ? '#34d399' : '#f43f5e';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, high);
        ctx.lineTo(x, low);
        ctx.stroke();

        // Body
        ctx.fillStyle = bullish ? '#34d399' : '#f43f5e';
        const bodyTop = Math.min(open, close);
        const bodyHeight = Math.abs(close - open);
        ctx.fillRect(x - 4, bodyTop, 8, Math.max(bodyHeight, 2));
      }
      ctx.globalAlpha = 1;
    }

    function animate(time: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid
      drawGrid(time);

      // Financial graphs
      drawFinancialGraphs(time);

      // Candlesticks
      drawCandlesticks(time);

      // Particles + connections
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Mouse influence
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.01;
          p.vx += dx * force;
          p.vy += dy * force;
          p.vx *= 0.99;
          p.vy *= 0.99;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const alpha = p.opacity + (dist < 200 ? (200 - dist) / 200 * 0.2 : 0);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 72%, ${alpha})`;
        ctx.fill();
      }

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            const lineAlpha = 0.05 * (1 - dist / 130);
            ctx.strokeStyle = `rgba(129, 140, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Floating stock labels
      for (const label of labelsRef.current) {
        label.x += label.vx;
        label.y += label.vy;
        if (label.x < -100) label.x = canvas.width + 50;
        if (label.x > canvas.width + 100) label.x = -50;
        if (label.y < -30) label.y = canvas.height + 20;
        if (label.y > canvas.height + 30) label.y = -20;

        ctx.font = `${label.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(129, 140, 248, ${label.opacity})`;
        ctx.fillText(label.text, label.x, label.y);
      }

      animIdRef.current = requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    initLabels();
    animIdRef.current = requestAnimationFrame(animate);

    window.addEventListener('resize', () => {
      resize();
      initParticles();
      initLabels();
    });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.85 }}
      />
      {/* Aurora blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>
    </>
  );
}
