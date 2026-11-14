import { memo, useEffect, useRef } from 'react';

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Star {
  nx: number;
  ny: number;
  r: number;
  color: string;
  baseAlpha: number;
  speed: number;
  phase: number;
}

const STAR_COLORS = ['#E6E9F2', '#E6E9F2', '#E6E9F2', '#B7C8EA', '#FDE68A', '#C7D2FE'];

/**
 * Lightweight single-canvas starfield on a flat #070A12 background.
 * Zero DOM star nodes, zero CSS gradients, zero blur.
 */
export const StarField = memo(function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const rand = mulberry32(1977);
    const stars: Star[] = Array.from({ length: 140 }, () => ({
      nx: rand(),
      ny: rand(),
      r: rand() < 0.82 ? 0.8 + rand() * 0.6 : 1.5 + rand() * 0.7,
      color: STAR_COLORS[Math.floor(rand() * STAR_COLORS.length)],
      baseAlpha: 0.25 + rand() * 0.55,
      speed: 0.6 + rand() * 1.4,
      phase: rand() * Math.PI * 2,
    }));

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let rafId = 0;

    const drawFrame = (timeMs: number) => {
      ctx.fillStyle = '#070A12';
      ctx.fillRect(0, 0, width, height);

      const t = timeMs * 0.001;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const alpha = reducedMotion
          ? s.baseAlpha
          : s.baseAlpha + Math.sin(t * s.speed + s.phase) * 0.22;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.nx * width, s.ny * height, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(performance.now());
    };

    resize();
    window.addEventListener('resize', resize);

    if (!reducedMotion) {
      let lastDraw = 0;
      const tick = (now: number) => {
        // ~24 fps is plenty for subtle star twinkle and keeps GPU idle
        if (now - lastDraw >= 42) {
          lastDraw = now;
          drawFrame(now);
        }
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
    />
  );
});
