'use client';

import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; }[] = [];
    const gridLines: { x1: number; y1: number; x2: number; y2: number; opacity: number; phase: number; }[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function initGridLines() {
      gridLines.length = 0;
      const spacing = 80;
      for (let x = 0; x < canvas!.width; x += spacing) {
        gridLines.push({
          x1: x, y1: 0, x2: x, y2: canvas!.height,
          opacity: 0.03, phase: Math.random() * Math.PI * 2,
        });
      }
      for (let y = 0; y < canvas!.height; y += spacing) {
        gridLines.push({
          x1: 0, y1: y, x2: canvas!.width, y2: y,
          opacity: 0.03, phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function drawGraph(time: number) {
      if (!ctx || !canvas) return;
      // Financial graph line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 1.5;
      const baseY = canvas.height * 0.6;
      for (let x = 0; x < canvas.width; x += 2) {
        const y = baseY +
          Math.sin(x * 0.008 + time * 0.001) * 40 +
          Math.sin(x * 0.015 + time * 0.002) * 25 +
          Math.sin(x * 0.003 + time * 0.0005) * 60;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Second graph line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 2) {
        const y = baseY + 30 +
          Math.sin(x * 0.006 + time * 0.0015 + 2) * 35 +
          Math.cos(x * 0.012 + time * 0.001) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    function animate(time: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      for (const line of gridLines) {
        const pulse = Math.sin(time * 0.001 + line.phase) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(99, 102, 241, ${line.opacity * (0.5 + pulse * 0.5)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
      }

      // Draw financial graph
      drawGraph(time);

      // Draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${p.opacity})`;
        ctx.fill();
      }

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(129, 140, 248, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    initGridLines();
    animationId = requestAnimationFrame(animate);

    window.addEventListener('resize', () => {
      resize();
      initGridLines();
    });

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}
