import { useCallback, useEffect, useRef, useState } from 'react';
import type { MiniGameProps } from './LunarCraterCruiserGame';
import { MiniGameResultOverlay } from './MiniGameResultOverlay';
import { isSpriteReady, loadCanvasSprite, prepareHiDPIFrame, setupHiDPICanvas } from './spriteLoader';

const SPRITE_PROBE = '/minigames/deep space/pioner/pioneer_jupiter_separate_transparent_pngs/01_pioneer_10_probe.png';
const SPRITE_JUPITER = '/minigames/deep space/pioner/pioneer_jupiter_separate_transparent_pngs/02_jupiter.png';

const W = 840;
const H = 340;
const JUPITER = { x: 430, y: 170, r: 42 };
const GATE = { x: 785, y: 55, w: 34, h: 110 };
const START = { x: 75, y: 235 };

export function JupiterGravitySlingshotGame({
  accentColor,
  alreadyCompleted,
  onWin,
  onBackToHub,
}: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(-18);
  const [speed, setSpeed] = useState(4.2);
  const [flying, setFlying] = useState(false);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [assetsReady, setAssetsReady] = useState(0);
  const [note, setNote] = useState('Aim near Jupiter’s gravity well so it slingshots Pioneer 10 through the Exit Gate!');

  const wonCalledRef = useRef(false);
  const animRef = useRef(0);
  const jupiterImgRef = useRef<HTMLImageElement | null>(null);
  const probeImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const onSpriteLoad = () => setAssetsReady((n) => n + 1);
    const jup = loadCanvasSprite(SPRITE_JUPITER, onSpriteLoad);
    const probe = loadCanvasSprite(SPRITE_PROBE, onSpriteLoad);
    jupiterImgRef.current = jup;
    probeImgRef.current = probe;
    return () => {
      jup.onload = null;
      probe.onload = null;
    };
  }, []);

  const drawStaticScene = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      trail: Array<{ x: number; y: number }>,
      probe: { x: number; y: number },
      headingRad = (angle * Math.PI) / 180,
    ) => {
      prepareHiDPIFrame(ctx);
      ctx.fillStyle = '#070A12';
      ctx.fillRect(0, 0, W, H);

      // Stars
      ctx.fillStyle = '#CBD5E1';
      for (let i = 0; i < 32; i++) {
        ctx.fillRect((i * 89) % W, (i * 59) % H, 1.8, 1.8);
      }

      // Gravity well rings
      ctx.strokeStyle = '#334155';
      ctx.setLineDash([4, 6]);
      for (const rad of [85, 130, 175]) {
        ctx.beginPath();
        ctx.arc(JUPITER.x, JUPITER.y, rad, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Jupiter
      if (isSpriteReady(jupiterImgRef.current)) {
        ctx.drawImage(
          jupiterImgRef.current,
          JUPITER.x - JUPITER.r - 4,
          JUPITER.y - JUPITER.r - 4,
          (JUPITER.r + 4) * 2,
          (JUPITER.r + 4) * 2,
        );
      } else {
        ctx.beginPath();
        ctx.arc(JUPITER.x, JUPITER.y, JUPITER.r, 0, Math.PI * 2);
        ctx.fillStyle = '#C27848';
        ctx.fill();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#9A512E';
        ctx.fillRect(JUPITER.x - 36, JUPITER.y - 12, 72, 7);
        ctx.fillRect(JUPITER.x - 34, JUPITER.y + 8, 68, 6);
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.ellipse(JUPITER.x + 12, JUPITER.y + 11, 9, 5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('JUPITER GRAVITY WELL', JUPITER.x, JUPITER.y + JUPITER.r + 18);

      // Deep Space Exit Gate
      ctx.fillStyle = '#0F2420';
      ctx.strokeStyle = '#34D399';
      ctx.lineWidth = 2.5;
      ctx.fillRect(GATE.x, GATE.y, GATE.w, GATE.h);
      ctx.strokeRect(GATE.x, GATE.y, GATE.w, GATE.h);
      ctx.fillStyle = '#34D399';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('EXIT GATE', GATE.x - 2, GATE.y - 10);
      ctx.fillText('ALDEBARAN →', GATE.x - 10, GATE.y + GATE.h + 16);

      // Aim vector preview when idle
      if (trail.length === 0) {
        const rad = (angle * Math.PI) / 180;
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(START.x, START.y);
        ctx.lineTo(START.x + Math.cos(rad) * speed * 26, START.y + Math.sin(rad) * speed * 26);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Trajectory trail
      if (trail.length > 1) {
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.stroke();
      }

      // Pioneer 10 Probe (rotated along velocity vector)
      if (isSpriteReady(probeImgRef.current)) {
        ctx.save();
        ctx.translate(probe.x, probe.y);
        ctx.rotate(headingRad + Math.PI / 2);
        ctx.drawImage(probeImgRef.current, -18, -18, 36, 36);
        ctx.restore();
      } else {
        ctx.fillStyle = '#F8FAFC';
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(probe.x, probe.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    },
    [angle, speed],
  );

  // Redraw preview when sliders move or sprites finish loading
  useEffect(() => {
    if (flying || status !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDPICanvas(canvas, W, H);
    if (ctx) {
      drawStaticScene(ctx, [], START);
    }
  }, [angle, speed, flying, status, drawStaticScene, assetsReady]);

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleFire = () => {
    if (flying || status !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDPICanvas(canvas, W, H);
    if (!ctx) return;

    setFlying(true);
    setNote('Pioneer 10 en route to Jupiter...');

    const rad = (angle * Math.PI) / 180;
    let x = START.x;
    let y = START.y;
    let vx = Math.cos(rad) * speed;
    let vy = Math.sin(rad) * speed;
    const trail: Array<{ x: number; y: number }> = [{ x, y }];
    const GM = 1950;

    const tick = () => {
      const dx = JUPITER.x - x;
      const dy = JUPITER.y - y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      if (dist <= JUPITER.r + 5) {
        drawStaticScene(ctx, trail, { x, y }, Math.atan2(vy, vx));
        setFlying(false);
        setNote('Pioneer 10 plunged into Jupiter! Aim slightly higher or faster.');
        setStatus('lost');
        return;
      }

      const accel = GM / Math.max(900, distSq);
      vx += (dx / dist) * accel;
      vy += (dy / dist) * accel;
      x += vx;
      y += vy;
      trail.push({ x, y });

      drawStaticScene(ctx, trail, { x, y }, Math.atan2(vy, vx));

      if (x >= GATE.x && x <= GATE.x + GATE.w && y >= GATE.y && y <= GATE.y + GATE.h) {
        setFlying(false);
        setStatus('won');
        if (!wonCalledRef.current) {
          wonCalledRef.current = true;
          onWin();
        }
        return;
      }

      if (x < -30 || x > W + 30 || y < -30 || y > H + 30) {
        setFlying(false);
        setNote('Missed the Deep Space Exit Gate! Adjust angle & speed and try again.');
        setStatus('lost');
        return;
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
  };

  const handleRetry = () => {
    cancelAnimationFrame(animRef.current);
    setFlying(false);
    setStatus('playing');
    setNote('Adjust Launch Angle and Speed, then fire thrusters!');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-[#0E1320] px-3.5 py-2">
        <p className="font-sans text-xs font-semibold text-ink">
          Objective: Use Jupiter’s gravity well to slingshot Pioneer 10 through the Deep Space Exit Gate!
        </p>
        <span className="font-mono text-xs font-bold text-emerald-300">
          TARGET: ALDEBARAN GATE
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-line bg-[#070A12]">
        <canvas ref={canvasRef} width={W} height={H} className="block h-auto w-full" />

        {status !== 'playing' && (
          <MiniGameResultOverlay
            status={status}
            title={status === 'won' ? 'Interstellar Slingshot Achieved!' : 'Trajectory Missed'}
            summary={
              status === 'won'
                ? 'Jupiter’s gravity whipped Pioneer 10 faster than ever—bound for interstellar space!'
                : note
            }
            accentColor={accentColor}
            alreadyCompleted={alreadyCompleted}
            onRetry={handleRetry}
            onBackToHub={onBackToHub}
          />
        )}
      </div>

      <div className="grid gap-3 rounded-lg border border-line bg-[#0E1320] p-3 sm:grid-cols-3 sm:items-center">
        <label className="space-y-1 font-mono text-xs text-ink">
          <span>LAUNCH ANGLE: {angle}°</span>
          <input
            type="range"
            min={-45}
            max={45}
            step={1}
            disabled={flying}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </label>

        <label className="space-y-1 font-mono text-xs text-ink">
          <span>LAUNCH SPEED: {speed.toFixed(1)}</span>
          <input
            type="range"
            min={2.4}
            max={5.2}
            step={0.1}
            disabled={flying}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-sky-400"
          />
        </label>

        <button
          type="button"
          disabled={flying || status !== 'playing'}
          onClick={handleFire}
          className="rounded-lg px-4 py-2.5 font-sans text-sm font-bold text-space disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          {flying ? 'IN FLIGHT...' : 'FIRE THRUSTERS'}
        </button>
      </div>
    </div>
  );
}
