import { useCallback, useEffect, useRef, useState } from 'react';
import { MiniGameResultOverlay } from './MiniGameResultOverlay';
import { isSpriteReady, loadCanvasSprite, prepareHiDPIFrame, setupHiDPICanvas } from './spriteLoader';

const SPRITE_CAR = '/minigames/moon/apollo 15/car.png';
const SPRITE_CRATER = '/minigames/moon/apollo 15/crater.png';
const SPRITE_STONE = '/minigames/moon/apollo 15/stone.png';
const SPRITE_STATION = '/minigames/moon/apollo 15/station.png';
const SPRITE_LRV_SIDE = '/nasa/moon/Roving Vehicle/NASA_apollo_lunar_roving_vehicle.png';

export interface MiniGameProps {
  accentColor: string;
  alreadyCompleted: boolean;
  onWin: () => void;
  onBackToHub: () => void;
}

interface TrackItem {
  id: number;
  x: number;
  y: number;
  r: number;
  kind: 'crater' | 'boulder' | 'rock';
  label?: string;
  isGenesis?: boolean;
  collected?: boolean;
  cleared?: boolean;
}

interface TireTrack {
  x: number;
  y: number;
}

const W = 840;
const H = 360;
const TRACK_LEN = 3400;
const ROVER_SCREEN_Y = 285;
const VALLEY_LEFT = 90;
const VALLEY_RIGHT = W - 90;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function LunarCraterCruiserGame({
  accentColor,
  alreadyCompleted,
  onWin,
  onBackToHub,
}: MiniGameProps) {
  const [phase, setPhase] = useState<'unfold' | 'drive'>('unfold');
  const [deployPct, setDeployPct] = useState(0);
  const [autoDeploying, setAutoDeploying] = useState(false);

  const [rocksCollected, setRocksCollected] = useState(0);
  const [distanceLeft, setDistanceLeft] = useState(TRACK_LEN);
  const [stuckTapsLeft, setStuckTapsLeft] = useState(0);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [failNote, setFailNote] = useState('');
  const [runKey, setRunKey] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef({ left: false, right: false, boost: false });
  const stuckRef = useRef(0);
  const wonCalledRef = useRef(false);

  // Smooth Auto-Deploy animation for Stage 1
  useEffect(() => {
    if (!autoDeploying || phase !== 'unfold') return;
    let animId = 0;
    const step = () => {
      setDeployPct((prev) => {
        const next = Math.min(100, prev + 1.4);
        if (next >= 100) {
          setAutoDeploying(false);
        }
        return next;
      });
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [autoDeploying, phase]);

  const handleEscapeMash = useCallback(() => {
    if (stuckRef.current <= 0) return;
    stuckRef.current = Math.max(0, stuckRef.current - 1);
    setStuckTapsLeft(stuckRef.current);
  }, []);

  const handleRetryDrive = useCallback(() => {
    wonCalledRef.current = false;
    stuckRef.current = 0;
    setRocksCollected(0);
    setDistanceLeft(TRACK_LEN);
    setStuckTapsLeft(0);
    setFailNote('');
    setStatus('playing');
    setRunKey((k) => k + 1);
  }, []);

  const handleFullReset = useCallback(() => {
    setAutoDeploying(false);
    setDeployPct(0);
    setPhase('unfold');
    handleRetryDrive();
  }, [handleRetryDrive]);

  useEffect(() => {
    if (phase !== 'drive') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'ShiftLeft') {
        keysRef.current.boost = true;
      }
      if (e.code === 'Space' && stuckRef.current > 0) {
        e.preventDefault();
        handleEscapeMash();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'ShiftLeft') {
        keysRef.current.boost = false;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [phase, handleEscapeMash]);

  // Stage 2: 60fps Top-Down Lunar Valley Drive
  useEffect(() => {
    if (phase !== 'drive') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDPICanvas(canvas, W, H);
    if (!ctx) return;

    let animId = 0;
    const carImg = loadCanvasSprite(SPRITE_CAR);
    const craterImg = loadCanvasSprite(SPRITE_CRATER);
    const stoneImg = loadCanvasSprite(SPRITE_STONE);
    const stationImg = loadCanvasSprite(SPRITE_STATION);

    let roverX = W / 2;
    let dist = 0;
    let collected = 0;
    let finished = false;
    let wheelSpin = 0;
    const tracks: TireTrack[] = [];

    const items: TrackItem[] = [
      // 5 glowing lunar rock samples (5th is Genesis Rock)
      { id: 1, x: 300, y: 520, r: 16, kind: 'rock', label: 'Sample 1', collected: false },
      { id: 2, x: 540, y: 1080, r: 16, kind: 'rock', label: 'Sample 2', collected: false },
      { id: 3, x: 250, y: 1680, r: 16, kind: 'rock', label: 'Sample 3', collected: false },
      { id: 4, x: 560, y: 2260, r: 16, kind: 'rock', label: 'Sample 4', collected: false },
      { id: 5, x: 420, y: 2880, r: 19, kind: 'rock', label: 'GENESIS ROCK', isGenesis: true, collected: false },

      // Lunar Craters (trigger 4x4 escape if hit)
      { id: 10, x: 420, y: 740, r: 34, kind: 'crater', cleared: false },
      { id: 11, x: 260, y: 1320, r: 36, kind: 'crater', cleared: false },
      { id: 12, x: 510, y: 1940, r: 38, kind: 'crater', cleared: false },
      { id: 13, x: 330, y: 2540, r: 36, kind: 'crater', cleared: false },

      // Boulders (gentle bump)
      { id: 20, x: 220, y: 610, r: 22, kind: 'boulder' },
      { id: 21, x: 580, y: 890, r: 24, kind: 'boulder' },
      { id: 22, x: 430, y: 1480, r: 24, kind: 'boulder' },
      { id: 23, x: 200, y: 2100, r: 22, kind: 'boulder' },
      { id: 24, x: 600, y: 2680, r: 24, kind: 'boulder' },
    ];

    let last = performance.now();

    const loop = (now: number) => {
      prepareHiDPIFrame(ctx);
      const dt = Math.min(2, (now - last) / 16.67);
      last = now;

      if (!finished) {
        if (stuckRef.current > 0) {
          wheelSpin += 0.45 * dt;
        } else {
          const forwardSpeed = (keysRef.current.boost ? 5.8 : 3.9) * dt;
          dist = Math.min(TRACK_LEN, dist + forwardSpeed);
          setDistanceLeft(Math.max(0, Math.round(TRACK_LEN - dist)));

          const steerSpeed = 4.6 * dt;
          if (keysRef.current.left) roverX -= steerSpeed;
          if (keysRef.current.right) roverX += steerSpeed;
          roverX = Math.max(VALLEY_LEFT + 28, Math.min(VALLEY_RIGHT - 28, roverX));

          // Record subtle tire tracks
          if (Math.floor(dist / 12) !== Math.floor((dist - forwardSpeed) / 12)) {
            tracks.push({ x: roverX, y: dist });
            if (tracks.length > 60) tracks.shift();
          }

          // Collisions
          for (const item of items) {
            const screenY = ROVER_SCREEN_Y - (item.y - dist);
            if (screenY < -60 || screenY > H + 60) continue;

            const dx = roverX - item.x;
            const dy = ROVER_SCREEN_Y - screenY;
            const d = Math.hypot(dx, dy);

            if (item.kind === 'rock' && !item.collected && d < item.r + 24) {
              item.collected = true;
              collected += 1;
              setRocksCollected(collected);
            } else if (item.kind === 'crater' && !item.cleared && d < item.r + 14) {
              item.cleared = true;
              stuckRef.current = 5;
              setStuckTapsLeft(5);
            } else if (item.kind === 'boulder' && d < item.r + 18) {
              roverX += dx >= 0 ? 22 : -22;
              roverX = Math.max(VALLEY_LEFT + 28, Math.min(VALLEY_RIGHT - 28, roverX));
            }
          }

          // Finish Zone
          if (dist >= TRACK_LEN) {
            finished = true;
            if (collected >= 5) {
              setStatus('won');
              if (!wonCalledRef.current) {
                wonCalledRef.current = true;
                onWin();
              }
            } else {
              setFailNote(
                `You reached the Lunar Module with ${collected}/5 rock samples! Retry to collect all 5 (including the Genesis Rock).`,
              );
              setStatus('lost');
            }
          }
        }
      }

      // Draw Top-Down Hadley-Apennine Valley
      ctx.fillStyle = '#070A12';
      ctx.fillRect(0, 0, W, H);

      // Valley Canyon Floor
      ctx.fillStyle = '#141926';
      ctx.fillRect(VALLEY_LEFT, 0, VALLEY_RIGHT - VALLEY_LEFT, H);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(VALLEY_LEFT, 0);
      ctx.lineTo(VALLEY_LEFT, H);
      ctx.moveTo(VALLEY_RIGHT, 0);
      ctx.lineTo(VALLEY_RIGHT, H);
      ctx.stroke();

      // Subtle tire tracks
      ctx.fillStyle = '#1E293B';
      for (const tr of tracks) {
        const ty = ROVER_SCREEN_Y - (tr.y - dist);
        if (ty < -10 || ty > H + 10) continue;
        ctx.fillRect(tr.x - 16, ty, 5, 8);
        ctx.fillRect(tr.x + 11, ty, 5, 8);
      }

      // Lunar Module Finish Zone
      const finishScreenY = ROVER_SCREEN_Y - (TRACK_LEN - dist);
      if (finishScreenY > -90 && finishScreenY < H + 90) {
        ctx.fillStyle = '#0F2420';
        ctx.strokeStyle = '#34D399';
        ctx.lineWidth = 2.5;
        ctx.fillRect(VALLEY_LEFT + 10, finishScreenY - 36, VALLEY_RIGHT - VALLEY_LEFT - 20, 44);
        ctx.strokeRect(VALLEY_LEFT + 10, finishScreenY - 36, VALLEY_RIGHT - VALLEY_LEFT - 20, 44);
        if (isSpriteReady(stationImg)) {
          ctx.drawImage(stationImg, W / 2 - 42, finishScreenY - 96, 84, 68);
        }
        ctx.fillStyle = '#34D399';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('APOLLO 15 LUNAR MODULE FINISH ZONE', W / 2, finishScreenY - 10);
      }

      // Draw Items (Craters, Boulders, Glowing Rocks)
      for (const item of items) {
        const sy = ROVER_SCREEN_Y - (item.y - dist);
        if (sy < -50 || sy > H + 50) continue;

        if (item.kind === 'crater' || item.kind === 'boulder') {
          const drawRadius = item.kind === 'boulder' ? item.r * 1.15 : item.r;
          const rot = ((item.id * 1.37) % (Math.PI * 2));
          if (isSpriteReady(craterImg)) {
            ctx.save();
            ctx.translate(item.x, sy);
            ctx.rotate(rot);
            ctx.globalAlpha = item.kind === 'crater' && item.cleared ? 0.5 : 1;
            ctx.drawImage(craterImg, -drawRadius, -drawRadius, drawRadius * 2, drawRadius * 2);
            ctx.restore();
          } else {
            ctx.beginPath();
            ctx.arc(item.x, sy, item.r, 0, Math.PI * 2);
            ctx.fillStyle = item.kind === 'boulder' ? '#475569' : '#090D16';
            ctx.fill();
            ctx.strokeStyle = item.cleared ? '#475569' : item.kind === 'boulder' ? '#94A3B8' : '#F59E0B';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        } else if (item.kind === 'rock' && !item.collected) {
          ctx.save();
          ctx.translate(item.x, sy);
          if (isSpriteReady(stoneImg)) {
            if (item.isGenesis) {
              ctx.beginPath();
              ctx.arc(0, 0, item.r + 5, 0, Math.PI * 2);
              ctx.strokeStyle = '#FBBF24';
              ctx.lineWidth = 2;
              ctx.stroke();
            }
            ctx.drawImage(stoneImg, -item.r - 4, -item.r - 4, (item.r + 4) * 2, (item.r + 4) * 2);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, item.r, 0, Math.PI * 2);
            ctx.fillStyle = item.isGenesis ? '#FBBF24' : '#38BDF8';
            ctx.fill();
            ctx.strokeStyle = '#F8FAFC';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          ctx.fillStyle = item.isGenesis ? '#FDE68A' : '#BAE6FD';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(item.label ?? 'ROCK', 0, -item.r - 8);
          ctx.restore();
        }
      }

      // Draw Top-Down LRV-1 Buggy
      ctx.save();
      ctx.translate(roverX, ROVER_SCREEN_Y);
      if (isSpriteReady(carImg)) {
        if (stuckRef.current > 0 && Math.sin(wheelSpin) > 0) {
          ctx.rotate(0.06);
        }
        ctx.drawImage(carImg, -28, -32, 56, 64);
      } else {
        ctx.fillStyle = stuckRef.current > 0 && Math.sin(wheelSpin) > 0 ? '#F59E0B' : '#94A3B8';
        ctx.fillRect(-20, -18, 7, 12);
        ctx.fillRect(13, -18, 7, 12);
        ctx.fillRect(-20, 6, 7, 12);
        ctx.fillRect(13, 6, 7, 12);
        ctx.fillStyle = '#CBD5E1';
        ctx.fillRect(-13, -20, 26, 40);
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(-10, -2, 8, 12);
        ctx.fillRect(2, -2, 8, 12);
        ctx.beginPath();
        ctx.arc(0, -14, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#FBBF24';
        ctx.fill();
        ctx.strokeStyle = '#FEF3C7';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [phase, runKey, onWin]);

  // Stage 1 continuous animation math (0% -> 100%)
  const t1 = clamp01(deployPct / 25); // 0-25%: bay doors & swing down
  const t2 = clamp01((deployPct - 25) / 30); // 25-55%: chassis & wheels
  const t3 = clamp01((deployPct - 55) / 25); // 55-80%: seats & T-bar
  const t4 = clamp01((deployPct - 80) / 20); // 80-100%: cross-fade to real LRV-1 PNG + touchdown
  const origamiOpacity = 1 - t4;

  const milestones = [
    { pct: 25, label: '25% Bay Open' },
    { pct: 55, label: '55% Wheels' },
    { pct: 80, label: '80% Seats' },
    { pct: 100, label: '100% Dish & Ready' },
  ];

  const stageLabel =
    deployPct < 25
      ? '0%–25%: Bay doors open & folded rover swings down on hinges'
      : deployPct < 55
        ? '25%–55%: Chassis halves unfold & wire-mesh wheels lock'
        : deployPct < 80
          ? '55%–80%: Twin astronaut seats & T-bar controller pop upright'
          : deployPct < 100
            ? '80%–100%: Gold High-Gain Umbrella Dish blooms & rover touches down'
            : 'LRV-1 DEPLOYED & READY!';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-[#0E1320] px-3.5 py-2">
        <p className="font-sans text-xs font-semibold text-ink">
          {phase === 'unfold'
            ? 'Stage 1: Drag the Deployment Lanyard Slider (0% → 100%) to unfold LRV-1 from Apollo 15 Falcon!'
            : 'Stage 2: Steer through Hadley-Apennine, collect 5 Lunar Rocks (5th = Genesis Rock), and reach the Lander!'}
        </p>
        <div className="flex items-center gap-3 font-mono text-xs font-bold">
          {phase === 'unfold' ? (
            <span className="text-amber-300">DEPLOY: {Math.round(deployPct)}%</span>
          ) : (
            <>
              <span className="text-sky-300">ROCKS: {rocksCollected}/5</span>
              <span className="text-emerald-300">TO LANDER: {distanceLeft} m</span>
            </>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-line bg-[#070A12] p-4">
        {phase === 'unfold' ? (
          <div className="space-y-4">
            <svg viewBox="0 0 640 230" className="block h-auto w-full rounded-lg border border-line bg-[#0B1020]">
              {/* Distant lunar horizon silhouette & stars */}
              <circle cx="95" cy="36" r="1.4" fill="#CBD5E1" opacity="0.6" />
              <circle cx="240" cy="24" r="1.2" fill="#CBD5E1" opacity="0.5" />
              <circle cx="385" cy="42" r="1.6" fill="#CBD5E1" opacity="0.65" />
              <circle cx="525" cy="28" r="1.3" fill="#CBD5E1" opacity="0.55" />
              <circle cx="590" cy="54" r="1.2" fill="#CBD5E1" opacity="0.45" />
              <path
                d="M0,190 L0,174 L82,166 L158,176 L248,162 L350,175 L455,164 L558,173 L640,167 L640,190 Z"
                fill="#121828"
              />

              {/* Lunar ground with subtle crater & dust details */}
              <rect x="0" y="190" width="640" height="40" fill="#1E2538" />
              <line x1="0" y1="190" x2="640" y2="190" stroke="#475569" strokeWidth="2" />
              <ellipse cx="235" cy="205" rx="26" ry="5" fill="#141A29" stroke="#334155" strokeWidth="1" />
              <ellipse cx="470" cy="212" rx="34" ry="6" fill="#141A29" stroke="#334155" strokeWidth="1" />
              <ellipse cx="575" cy="201" rx="16" ry="3.5" fill="#141A29" stroke="#334155" strokeWidth="1" />
              <circle cx="290" cy="216" r="2.2" fill="#475569" />
              <circle cx="345" cy="200" r="1.8" fill="#475569" />
              <circle cx="405" cy="218" r="2.5" fill="#475569" />

              {/* Apollo 15 Lunar Module (Falcon) */}
              <image
                href={encodeURI(SPRITE_STATION)}
                x="18"
                y="20"
                width="165"
                height="170"
                preserveAspectRatio="xMidYMid meet"
              />

              {/* Subtle deployment cable/arm connected directly to the lander's side bay */}
              {origamiOpacity > 0.02 && (
                <g opacity={origamiOpacity}>
                  <line
                    x1="146"
                    y1="88"
                    x2={174 + t1 * 72 + t2 * 40}
                    y2={110 + t1 * 38 + t4 * 20}
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                  <circle cx="146" cy="88" r="3.5" fill="#FBBF24" />
                </g>
              )}

              {/* LRV-1 Origami Assembly (0%–85%, fades out smoothly during 80%–100%) */}
              {origamiOpacity > 0.01 && (
                <g
                  opacity={origamiOpacity}
                  transform={`translate(${174 + t1 * 72 + t2 * 40}, ${110 + t1 * 38 + t4 * 20}) rotate(${-90 * (1 - t1)})`}
                >
                  {/* Unfolding Chassis */}
                  <rect x="0" y="0" width={54 + t2 * 100} height="11" fill="#CBD5E1" />

                  {/* Rear & Front Wire-Mesh Wheels swinging outward */}
                  <g transform={`translate(${18 + t2 * 6}, ${6 + t2 * 10}) scale(${0.35 + t2 * 0.65})`}>
                    <circle cx="0" cy="0" r="14" fill="none" stroke="#94A3B8" strokeWidth="3.5" />
                  </g>
                  <g transform={`translate(${38 + t2 * 94}, ${6 + t2 * 10}) scale(${0.35 + t2 * 0.65})`}>
                    <circle cx="0" cy="0" r="14" fill="none" stroke="#94A3B8" strokeWidth="3.5" />
                  </g>

                  {/* Twin Seats & T-bar popping upright (55-80%) */}
                  {t3 > 0.05 && (
                    <g transform={`translate(44, 0) scale(1, ${t3})`}>
                      <rect x="0" y="-22" width="22" height="22" fill="#F8FAFC" />
                      <rect x="28" y="-22" width="22" height="22" fill="#F8FAFC" />
                      <line x1="62" y1="0" x2="62" y2="-18" stroke="#38BDF8" strokeWidth="3" />
                    </g>
                  )}

                  {/* Gold Umbrella Dish blooming open (80-100%) */}
                  {t4 > 0.05 && (
                    <g transform="translate(126, 0)">
                      <line x1="0" y1="0" x2="6" y2={-30 * t4} stroke="#FBBF24" strokeWidth="2.5" />
                      <path
                        d={`M${6 - 18 * t4},${-30 * t4} Q6,${-48 * t4} ${6 + 18 * t4},${-30 * t4}`}
                        fill="none"
                        stroke="#FBBF24"
                        strokeWidth="3"
                      />
                    </g>
                  )}
                </g>
              )}

              {/* Real Side-View LRV-1 PNG (cross-fades in cleanly between 80%–100%) */}
              {t4 > 0.01 && (
                <image
                  href={encodeURI(SPRITE_LRV_SIDE)}
                  x="265"
                  y="74"
                  width="210"
                  height="122"
                  opacity={t4}
                  preserveAspectRatio="xMidYMid meet"
                />
              )}
            </svg>

            <div className="space-y-3 rounded-lg border border-line bg-[#0E1320] p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-ink">DEPLOYMENT LANYARD SLIDER</span>
                <span className="font-sans text-xs font-semibold text-amber-300">{stageLabel}</span>
              </div>

              {/* 4 Milestone Pills */}
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {milestones.map((m) => {
                  const reached = deployPct >= m.pct;
                  return (
                    <div
                      key={m.pct}
                      className={`rounded-md border px-2 py-1 text-center font-mono text-[10px] font-bold transition-colors ${
                        reached
                          ? 'border-emerald-400/60 bg-[#0F2420] text-emerald-300'
                          : 'border-line bg-[#070A12] text-muted'
                      }`}
                    >
                      {reached ? '✓ ' : ''}
                      {m.label}
                    </div>
                  );
                })}
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={deployPct}
                onChange={(e) => {
                  setAutoDeploying(false);
                  setDeployPct(Number(e.target.value));
                }}
                className="w-full accent-amber-400"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={deployPct >= 100}
                  onClick={() => setAutoDeploying(true)}
                  className="rounded-lg border border-line-strong bg-[#070A12] px-4 py-2 font-sans text-xs font-bold text-ink disabled:opacity-40"
                >
                  Auto-Deploy
                </button>
                <button
                  type="button"
                  disabled={deployPct < 100}
                  onClick={() => setPhase('drive')}
                  className="rounded-lg px-5 py-2 font-sans text-sm font-bold text-space disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ backgroundColor: accentColor }}
                >
                  Start Lunar Drive →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <canvas ref={canvasRef} width={W} height={H} className="block h-auto w-full rounded-lg" />

            {stuckTapsLeft > 0 && status === 'playing' && (
              <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center px-4">
                <button
                  type="button"
                  onClick={handleEscapeMash}
                  className="rounded-xl border-2 border-amber-300 bg-[#1F1508] px-5 py-3 font-mono text-xs font-bold text-amber-200 shadow-lg sm:text-sm"
                >
                  STUCK IN CRATER! MASH SPACE / TAP 4x4 ESCAPE ({stuckTapsLeft}x)!
                </button>
              </div>
            )}
          </div>
        )}

        {status !== 'playing' && (
          <MiniGameResultOverlay
            status={status}
            title={status === 'won' ? 'Hadley-Apennine Traverse Complete!' : 'Missed Some Rock Samples'}
            summary={
              status === 'won'
                ? 'You unfolded LRV-1 like origami, steered through lunar craters, escaped dust traps, and brought all 5 samples (including the Genesis Rock) to Falcon!'
                : failNote
            }
            accentColor={accentColor}
            alreadyCompleted={alreadyCompleted}
            onRetry={handleRetryDrive}
            onBackToHub={onBackToHub}
          />
        )}
      </div>

      {phase === 'drive' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFullReset}
              className="rounded-lg border border-line-strong bg-[#0E1320] px-3 py-2 font-sans text-xs font-bold text-muted hover:text-ink"
            >
              ↺ Replay Unfold
            </button>
            <span className="font-mono text-xs text-muted">Keys: ← / → or A / D • Space = 4x4 Escape</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onPointerDown={() => {
                keysRef.current.left = true;
              }}
              onPointerUp={() => {
                keysRef.current.left = false;
              }}
              onPointerLeave={() => {
                keysRef.current.left = false;
              }}
              className="rounded-lg border border-line-strong bg-[#0E1320] px-4 py-2 font-sans text-xs font-bold text-ink"
            >
              ◀ LEFT
            </button>
            <button
              type="button"
              onPointerDown={() => {
                keysRef.current.boost = true;
              }}
              onPointerUp={() => {
                keysRef.current.boost = false;
              }}
              onPointerLeave={() => {
                keysRef.current.boost = false;
              }}
              className="rounded-lg border border-line-strong bg-[#0E1320] px-4 py-2 font-sans text-xs font-bold text-amber-300"
            >
              BOOST
            </button>
            <button
              type="button"
              onPointerDown={() => {
                keysRef.current.right = true;
              }}
              onPointerUp={() => {
                keysRef.current.right = false;
              }}
              onPointerLeave={() => {
                keysRef.current.right = false;
              }}
              className="rounded-lg px-4 py-2 font-sans text-xs font-bold text-space"
              style={{ backgroundColor: accentColor }}
            >
              RIGHT ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
