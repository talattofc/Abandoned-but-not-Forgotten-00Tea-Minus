import { useCallback, useEffect, useRef, useState } from 'react';
import type { MiniGameProps } from './LunarCraterCruiserGame';
import { MiniGameResultOverlay } from './MiniGameResultOverlay';
import { isSpriteReady, loadCanvasSprite, prepareHiDPIFrame, setupHiDPICanvas } from './spriteLoader';
import { playShutter } from '../../utils/soundEffects';

interface TargetStar {
  id: number;
  wx: number;
  wy: number;
  name: string;
  planetName: string;
  planetImage: string;
  fact: string;
  planetColor: string;
  starColor: string;
  periodOffset: number;
  captured: boolean;
}

const VIEW_W = 840;
const VIEW_H = 360;
const WORLD_W = 1500;
const WORLD_H = 820;

const INITIAL_TARGETS: TargetStar[] = [
  {
    id: 1,
    wx: 420,
    wy: 250,
    name: 'Kepler-186',
    planetName: 'Kepler-186f',
    planetImage: '/minigames/deep space/kepler/exoplanets_separate_transparent_pngs/01_kepler_186f_earthlike.png',
    fact: 'Earth-sized rocky world in the Habitable Zone!',
    planetColor: '#34D399',
    starColor: '#FDBA74',
    periodOffset: 0,
    captured: false,
  },
  {
    id: 2,
    wx: 1090,
    wy: 230,
    name: 'Kepler-22',
    planetName: 'Kepler-22b',
    planetImage: '/minigames/deep space/kepler/exoplanets_separate_transparent_pngs/02_kepler_22b_ocean_world.png',
    fact: 'A mysterious ocean "Super-Earth"!',
    planetColor: '#38BDF8',
    starColor: '#FDE047',
    periodOffset: 1.4,
    captured: false,
  },
  {
    id: 3,
    wx: 390,
    wy: 610,
    name: 'Kepler-16AB',
    planetName: 'Kepler-16b',
    planetImage: '/minigames/deep space/kepler/exoplanets_separate_transparent_pngs/03_kepler_16b_twin_suns.png',
    fact: 'A real-life "Tatooine" orbiting TWO suns!',
    planetColor: '#FBBF24',
    starColor: '#F59E0B',
    periodOffset: 2.8,
    captured: false,
  },
  {
    id: 4,
    wx: 1120,
    wy: 590,
    name: 'Kepler-10',
    planetName: 'Kepler-10b',
    planetImage: '/minigames/deep space/kepler/exoplanets_separate_transparent_pngs/04_kepler_10b_lava_planet.png',
    fact: 'A scorching lava world zipping close to its star!',
    planetColor: '#F97316',
    starColor: '#FEF08A',
    periodOffset: 4.1,
    captured: false,
  },
];

// Deterministic steady Cygnus background stars
const BG_STARS = Array.from({ length: 85 }, (_, i) => ({
  wx: 40 + ((i * 173) % (WORLD_W - 80)),
  wy: 40 + ((i * 113) % (WORLD_H - 80)),
  r: 1.4 + (i % 3) * 0.8,
  color: i % 5 === 0 ? '#BAE6FD' : i % 7 === 0 ? '#FDE68A' : '#E2E8F0',
}));

export function ExoplanetTransitHunterGame({
  accentColor,
  alreadyCompleted,
  onWin,
  onBackToHub,
}: MiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedCount, setCapturedCount] = useState(0);
  const [capturedIds, setCapturedIds] = useState<number[]>([]);
  const [lockedTarget, setLockedTarget] = useState<TargetStar | null>(null);
  const [discoveryCard, setDiscoveryCard] = useState<TargetStar | null>(null);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [coords, setCoords] = useState({ ra: '19h 24m', dec: '+44° 30\'' });
  const [status, setStatus] = useState<'playing' | 'won'>('playing');
  const [runKey, setRunKey] = useState(0);

  const camRef = useRef({ x: WORLD_W / 2, y: WORLD_H / 2 });
  const keysRef = useRef({ up: false, down: false, left: false, right: false });
  const dragRef = useRef<{ active: boolean; lastX: number; lastY: number }>({
    active: false,
    lastX: 0,
    lastY: 0,
  });
  const targetsRef = useRef<TargetStar[]>(INITIAL_TARGETS.map((t) => ({ ...t })));
  const lockedRef = useRef<TargetStar | null>(null);
  const wonCalledRef = useRef(false);

  const handleCapture = useCallback(() => {
    const target = lockedRef.current;
    if (!target || target.captured || status !== 'playing') return;

    target.captured = true;
    playShutter();
    setShutterFlash(true);
    window.setTimeout(() => setShutterFlash(false), 180);

    setDiscoveryCard({ ...target });
    const captured = targetsRef.current.filter((t) => t.captured);
    const count = captured.length;
    setCapturedCount(count);
    setCapturedIds(captured.map((t) => t.id));
    lockedRef.current = null;
    setLockedTarget(null);

    if (count >= 4) {
      window.setTimeout(() => {
        setStatus('won');
        if (!wonCalledRef.current) {
          wonCalledRef.current = true;
          onWin();
        }
      }, 1300);
    }
  }, [status, onWin]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keysRef.current.up = true;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keysRef.current.down = true;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;
      if (e.code === 'Space') {
        e.preventDefault();
        handleCapture();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keysRef.current.up = false;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keysRef.current.down = false;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [handleCapture]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDPICanvas(canvas, VIEW_W, VIEW_H);
    if (!ctx) return;

    const planetSprites = new Map<number, HTMLImageElement>();
    for (const t of INITIAL_TARGETS) {
      planetSprites.set(t.id, loadCanvasSprite(t.planetImage));
    }

    let animId = 0;
    let last = performance.now();
    let frameTick = 0;

    const loop = (now: number) => {
      prepareHiDPIFrame(ctx);
      const dt = Math.min(2, (now - last) / 16.67);
      last = now;
      frameTick += 1;

      const panSpeed = 4.6 * dt;
      if (keysRef.current.left) camRef.current.x -= panSpeed;
      if (keysRef.current.right) camRef.current.x += panSpeed;
      if (keysRef.current.up) camRef.current.y -= panSpeed;
      if (keysRef.current.down) camRef.current.y += panSpeed;

      camRef.current.x = Math.max(120, Math.min(WORLD_W - 120, camRef.current.x));
      camRef.current.y = Math.max(100, Math.min(WORLD_H - 100, camRef.current.y));

      if (frameTick % 8 === 0) {
        const raMins = Math.round(10 + (camRef.current.x / WORLD_W) * 45);
        const decDeg = Math.round(35 + (1 - camRef.current.y / WORLD_H) * 20);
        setCoords({ ra: `19h ${raMins}m`, dec: `+${decDeg}° 18'` });
      }

      // Check lock-on with any uncaptured target star
      let foundLock: TargetStar | null = null;
      for (const t of targetsRef.current) {
        if (t.captured) continue;
        if (Math.hypot(camRef.current.x - t.wx, camRef.current.y - t.wy) < 38) {
          foundLock = t;
          break;
        }
      }
      if (lockedRef.current?.id !== foundLock?.id) {
        lockedRef.current = foundLock;
        setLockedTarget(foundLock ? { ...foundLock } : null);
      }

      // Render Telescope View
      ctx.fillStyle = '#070A12';
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      const lensCx = VIEW_W / 2;
      const lensCy = VIEW_H / 2;
      const lensR = 165;

      // Clip inside circular telescope lens
      ctx.save();
      ctx.beginPath();
      ctx.arc(lensCx, lensCy, lensR, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = '#0B1020';
      ctx.fillRect(lensCx - lensR, lensCy - lensR, lensR * 2, lensR * 2);

      // Subtle RA/DEC grid lines
      ctx.strokeStyle = '#151E33';
      ctx.lineWidth = 1;
      const gridStep = 120;
      const offX = -(camRef.current.x % gridStep);
      const offY = -(camRef.current.y % gridStep);
      for (let gx = offX; gx < VIEW_W; gx += gridStep) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, VIEW_H);
        ctx.stroke();
      }
      for (let gy = offY; gy < VIEW_H; gy += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(VIEW_W, gy);
        ctx.stroke();
      }

      // Background steady stars
      for (const s of BG_STARS) {
        const sx = lensCx + (s.wx - camRef.current.x);
        const sy = lensCy + (s.wy - camRef.current.y);
        if (sx < lensCx - lensR - 10 || sx > lensCx + lensR + 10) continue;
        if (sy < lensCy - lensR - 10 || sy > lensCy + lensR + 10) continue;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4 Target Exoplanet Stars with periodic dark transit silhouettes!
      const timeSec = now * 0.001;
      for (const t of targetsRef.current) {
        const sx = lensCx + (t.wx - camRef.current.x);
        const sy = lensCy + (t.wy - camRef.current.y);
        if (Math.hypot(sx - lensCx, sy - lensCy) > lensR + 40) continue;

        ctx.save();
        ctx.translate(sx, sy);

        if (t.captured) {
          // After capture: replace host star directly with the full, crisp Exoplanet PNG
          const planetSize = 60;
          const planetSprite = planetSprites.get(t.id);
          if (isSpriteReady(planetSprite)) {
            ctx.drawImage(
              planetSprite,
              -planetSize / 2,
              -planetSize / 2,
              planetSize,
              planetSize,
            );
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, 22, 0, Math.PI * 2);
            ctx.fillStyle = t.planetColor;
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          ctx.fillStyle = '#34D399';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${t.planetName} ✓`, 0, -36);
        } else {
          const cycle = (timeSec + t.periodOffset) % 3.2;
          const transiting = cycle < 1.3;
          const transitProg = cycle / 1.3;

          // Before capture: star disk (dims slightly during transit)
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.fillStyle = t.starColor;
          ctx.globalAlpha = transiting ? 0.65 : 1;
          ctx.fill();
          ctx.globalAlpha = 1;

          // Tiny dark planet silhouette crossing the star
          if (transiting) {
            const px = -14 + transitProg * 28;
            ctx.beginPath();
            ctx.arc(px, 2, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = '#070A12';
            ctx.fill();
            ctx.strokeStyle = '#38BDF8';
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          ctx.fillStyle = '#CBD5E1';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(t.name, 0, -20);
        }
        ctx.restore();
      }

      ctx.restore(); // end lens clip

      // Lens outer ring & crosshair
      ctx.beginPath();
      ctx.arc(lensCx, lensCy, lensR, 0, Math.PI * 2);
      ctx.strokeStyle = foundLock ? '#34D399' : '#334155';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Crosshair reticle
      ctx.strokeStyle = foundLock ? '#34D399' : '#38BDF8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(lensCx, lensCy, 24, 0, Math.PI * 2);
      ctx.moveTo(lensCx - 34, lensCy);
      ctx.lineTo(lensCx - 12, lensCy);
      ctx.moveTo(lensCx + 12, lensCy);
      ctx.lineTo(lensCx + 34, lensCy);
      ctx.moveTo(lensCx, lensCy - 34);
      ctx.lineTo(lensCx, lensCy - 12);
      ctx.moveTo(lensCx, lensCy + 12);
      ctx.lineTo(lensCx, lensCy + 34);
      ctx.stroke();

      // Mini Sector Radar (top-right)
      const radX = VIEW_W - 115;
      const radY = 18;
      const radW = 98;
      const radH = 56;
      ctx.fillStyle = '#0E1320';
      ctx.fillRect(radX, radY, radW, radH);
      ctx.strokeStyle = '#232B42';
      ctx.strokeRect(radX, radY, radW, radH);

      for (const t of targetsRef.current) {
        const rx = radX + (t.wx / WORLD_W) * radW;
        const ry = radY + (t.wy / WORLD_H) * radH;
        ctx.fillStyle = t.captured ? '#34D399' : '#FBBF24';
        ctx.beginPath();
        ctx.arc(rx, ry, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      // Reticle box on mini radar
      ctx.strokeStyle = '#38BDF8';
      ctx.strokeRect(
        radX + (camRef.current.x / WORLD_W) * radW - 6,
        radY + (camRef.current.y / WORLD_H) * radH - 5,
        12,
        10,
      );

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [runKey]);

  const handleFullReset = useCallback(() => {
    wonCalledRef.current = false;
    targetsRef.current = INITIAL_TARGETS.map((t) => ({ ...t, captured: false }));
    camRef.current = { x: WORLD_W / 2, y: WORLD_H / 2 };
    lockedRef.current = null;
    setCapturedCount(0);
    setCapturedIds([]);
    setLockedTarget(null);
    setDiscoveryCard(null);
    setStatus('playing');
    setRunKey((k) => k + 1);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-[#0E1320] px-3.5 py-2">
        <p className="font-sans text-xs font-semibold text-ink">
          Objective: Pan Kepler’s telescope across Cygnus, center on the 4 blinking stars, and snap Exoplanet Photos!
        </p>
        <div className="flex items-center gap-3 font-mono text-xs font-bold">
          <span className="text-muted">
            {coords.ra} • {coords.dec}
          </span>
          <span className="text-sky-300">CATALOG: {capturedCount} / 4</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-line bg-[#070A12]">
        <canvas
          ref={canvasRef}
          width={VIEW_W}
          height={VIEW_H}
          onPointerDown={(e) => {
            dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
          }}
          onPointerMove={(e) => {
            if (!dragRef.current.active) return;
            const dx = e.clientX - dragRef.current.lastX;
            const dy = e.clientY - dragRef.current.lastY;
            dragRef.current.lastX = e.clientX;
            dragRef.current.lastY = e.clientY;
            camRef.current.x = Math.max(120, Math.min(WORLD_W - 120, camRef.current.x - dx * 1.4));
            camRef.current.y = Math.max(100, Math.min(WORLD_H - 100, camRef.current.y - dy * 1.4));
          }}
          onPointerUp={() => {
            dragRef.current.active = false;
          }}
          onPointerLeave={() => {
            dragRef.current.active = false;
          }}
          className="block h-auto w-full cursor-grab touch-none active:cursor-grabbing"
        />

        {shutterFlash && <div className="pointer-events-none absolute inset-0 bg-white/75" />}

        {lockedTarget && status === 'playing' && (
          <div className="absolute inset-x-0 bottom-4 z-10 flex flex-col items-center gap-2 px-4">
            <span className="rounded-md border border-emerald-400/60 bg-[#0F2420] px-3 py-1 font-mono text-[11px] font-bold text-emerald-300">
              TRANSIT DETECTED — READY TO CAPTURE!
            </span>
            <button
              type="button"
              onClick={handleCapture}
              className="rounded-xl border-2 border-white bg-[#0E1320] px-5 py-2.5 font-sans text-sm font-bold text-amber-300 shadow-lg"
            >
              📷 SNAP EXOPLANET PHOTO ({lockedTarget.name})
            </button>
          </div>
        )}

        {status === 'won' && (
          <MiniGameResultOverlay
            status="won"
            title="Kepler Star Catalog Complete!"
            summary="You explored the Cygnus constellation, spotted 4 transiting exoplanets, and photographed Kepler-186f, Kepler-22b, Kepler-16b, and Kepler-10b!"
            accentColor={accentColor}
            alreadyCompleted={alreadyCompleted}
            onRetry={handleFullReset}
            onBackToHub={onBackToHub}
          />
        )}
      </div>

      {/* Exoplanet Discovery Card */}
      {discoveryCard && (
        <div className="flex items-center gap-4 rounded-lg border border-sky-400/50 bg-[#0E1320] p-3.5">
          <img
            src={encodeURI(discoveryCard.planetImage)}
            alt={discoveryCard.planetName}
            className="h-20 w-20 shrink-0 rounded-lg border border-line bg-[#070A12] object-contain p-1.5"
          />
          <div>
            <div className="font-display text-base font-bold text-ink">
              {discoveryCard.planetName} Discovered!
            </div>
            <p className="mt-0.5 font-sans text-xs text-muted">{discoveryCard.fact}</p>
          </div>
        </div>
      )}

      {/* 4-Slot Exoplanet Catalog */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {INITIAL_TARGETS.map((t) => {
          const isFound = capturedIds.includes(t.id);
          return (
            <div
              key={t.id}
              className={`flex items-center gap-2.5 rounded-lg border px-2.5 py-2 ${
                isFound
                  ? 'border-emerald-400/50 bg-[#0F2420]'
                  : 'border-line bg-[#0E1320] opacity-65'
              }`}
            >
              {isFound ? (
                <img
                  src={encodeURI(t.planetImage)}
                  alt={t.planetName}
                  className="h-11 w-11 shrink-0 rounded-md border border-line bg-[#070A12] object-contain p-1"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line bg-[#070A12] font-mono text-sm font-bold text-muted">
                  ?
                </div>
              )}
              <div className="min-w-0">
                <div className="truncate font-sans text-xs font-bold text-ink">
                  {isFound ? t.planetName : t.name}
                </div>
                <div className="font-mono text-[10px] text-muted">
                  {isFound ? 'PHOTOGRAPHED ✓' : 'UNDISCOVERED'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls hint + Touch D-pad */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs text-muted">
          Drag Sky or use WASD / Arrow Keys • Space = Snap Exoplanet Photo
        </span>
        <div className="flex items-center gap-1.5">
          {(
            [
              ['◀', 'left'],
              ['▲', 'up'],
              ['▼', 'down'],
              ['▶', 'right'],
            ] as const
          ).map(([label, dir]) => (
            <button
              key={dir}
              type="button"
              onPointerDown={() => {
                keysRef.current[dir] = true;
              }}
              onPointerUp={() => {
                keysRef.current[dir] = false;
              }}
              onPointerLeave={() => {
                keysRef.current[dir] = false;
              }}
              className="rounded-lg border border-line-strong bg-[#0E1320] px-3.5 py-2 font-sans text-xs font-bold text-ink"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
