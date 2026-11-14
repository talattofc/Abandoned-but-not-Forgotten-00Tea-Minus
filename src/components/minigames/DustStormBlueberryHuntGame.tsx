import { useCallback, useEffect, useRef, useState } from 'react';
import type { MiniGameProps } from './LunarCraterCruiserGame';
import { MiniGameResultOverlay } from './MiniGameResultOverlay';
import { isSpriteReady, loadCanvasSprite, prepareHiDPIFrame, setupHiDPICanvas } from './spriteLoader';
import { playShutter } from '../../utils/soundEffects';

const SPRITE_COCOON = '/minigames/mars/rovers/mars_opportunity_4_separate_transparent_pngs/01_inflatable_airbag_cocoon.png';
const SPRITE_PLATFORM = '/minigames/mars/rovers/mars_opportunity_4_separate_transparent_pngs/02_opened_lander_petals_platform.png';
const SPRITE_ROVER = '/minigames/mars/rovers/mars_opportunity_4_separate_transparent_pngs/03_opportunity_rover_top_down.png';
const SPRITE_BLUEBERRIES = '/minigames/mars/rovers/mars_opportunity_4_separate_transparent_pngs/04_mars_hematite_blueberries.png';

interface ScienceSite {
  id: number;
  x: number;
  y: number;
  title: string;
  fact: string;
  color: string;
  photographed: boolean;
}

interface TireTrack {
  x: number;
  y: number;
  angle: number;
}

const W = 840;
const H = 360;

const CRATERS: Array<[number, number, number]> = [
  [400, 180, 48],
  [150, 220, 26],
  [720, 190, 32],
];

const INITIAL_SITES: ScienceSite[] = [
  {
    id: 1,
    x: 200,
    y: 110,
    title: 'Hematite "Blueberries"',
    fact: 'Opportunity spotted tiny round iron-rich hematite spheres—proof that liquid water once soaked these Martian rocks!',
    color: '#60A5FA',
    photographed: false,
  },
  {
    id: 2,
    x: 650,
    y: 95,
    title: 'Layered Crater Rim Rock',
    fact: 'Wave-rippled, layered bedrock along the crater rim showed that ancient salty water once flowed across Mars.',
    color: '#FBBF24',
    photographed: false,
  },
  {
    id: 3,
    x: 620,
    y: 280,
    title: 'Mars Horizon & Rover Tracks',
    fact: 'Opportunity drove 45.16 km across Mars—surpassing a full 42.195 km marathon on another planet!',
    color: '#34D399',
    photographed: false,
  },
];

export function DustStormBlueberryHuntGame({
  accentColor,
  alreadyCompleted,
  onWin,
  onBackToHub,
}: MiniGameProps) {
  const [phase, setPhase] = useState<'landing' | 'explore'>('landing');
  const [landingStage, setLandingStage] = useState<'ready' | 'bouncing' | 'stopped' | 'unfolding' | 'deployed'>('ready');
  const [unfoldPct, setUnfoldPct] = useState(0);

  const [photosCount, setPhotosCount] = useState(0);
  const [nearbySite, setNearbySite] = useState<ScienceSite | null>(null);
  const [polaroid, setPolaroid] = useState<ScienceSite | null>(null);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [craterAlert, setCraterAlert] = useState(false);
  const [status, setStatus] = useState<'playing' | 'won'>('playing');
  const [runKey, setRunKey] = useState(0);

  const landCanvasRef = useRef<HTMLCanvasElement>(null);
  const exploreCanvasRef = useRef<HTMLCanvasElement>(null);
  const stoppedXRef = useRef(470);
  const keysRef = useRef({ up: false, down: false, left: false, right: false });
  const sitesRef = useRef<ScienceSite[]>(INITIAL_SITES.map((s) => ({ ...s })));
  const nearbyRef = useRef<ScienceSite | null>(null);
  const wonCalledRef = useRef(false);

  // Part 1: Airbag Bounce Animation (~4s for 4 gentle bounces, then auto-unfold)
  useEffect(() => {
    if (phase !== 'landing') return;
    const canvas = landCanvasRef.current;
    if (!canvas) return;
    const LW = 720;
    const LH = 240;
    const ctx = setupHiDPICanvas(canvas, LW, LH);
    if (!ctx) return;

    let animId = 0;
    const cocoonImg = loadCanvasSprite(SPRITE_COCOON);
    const platformImg = loadCanvasSprite(SPRITE_PLATFORM);
    const roverImg = loadCanvasSprite(SPRITE_ROVER);
    const GY = 188;

    let bx = 85;
    let by = 40;
    let vx = 1.9;
    let vy = 0;
    let bounces = 0;
    const puffs: Array<{ x: number; y: number; r: number; life: number }> = [];

    const drawScene = () => {
      prepareHiDPIFrame(ctx);
      ctx.fillStyle = '#1C0E0C';
      ctx.fillRect(0, 0, LW, LH);
      ctx.fillStyle = '#3B1C16';
      ctx.fillRect(0, GY, LW, LH - GY);
      ctx.strokeStyle = '#9A4A3A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GY);
      ctx.lineTo(LW, GY);
      ctx.stroke();

      // Dust puffs
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.r += 0.35;
        p.life -= 0.7;
        if (p.life <= 0) {
          puffs.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(217, 119, 87, ${Math.min(1, p.life / 28)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (landingStage === 'ready' || landingStage === 'bouncing' || landingStage === 'stopped') {
        const drawX = landingStage === 'ready' ? 85 : bx;
        const drawY = landingStage === 'ready' ? 44 : by;
        ctx.save();
        ctx.translate(drawX, drawY);
        if (isSpriteReady(cocoonImg)) {
          ctx.drawImage(cocoonImg, -26, -26, 52, 52);
        } else {
          ctx.fillStyle = '#CBD5E1';
          ctx.strokeStyle = '#64748B';
          ctx.lineWidth = 2;
          for (const [ax, ay] of [
            [0, -10],
            [-11, 4],
            [11, 4],
            [0, 10],
          ]) {
            ctx.beginPath();
            ctx.arc(ax, ay, 13, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.moveTo(0, -10);
          ctx.lineTo(-10, 8);
          ctx.lineTo(10, 8);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      } else {
        // Unfolding lander petals + Opportunity rising at the stopped spot
        const t = unfoldPct / 100;
        const cx = stoppedXRef.current;
        ctx.save();
        ctx.translate(cx, GY);
        if (isSpriteReady(platformImg)) {
          const pw = 36 + 76 * t;
          const ph = 24 + 22 * t;
          ctx.drawImage(platformImg, -pw / 2, -ph + 4, pw, ph);
        } else {
          ctx.fillStyle = '#94A3B8';
          ctx.fillRect(-38 * t - 16, -5, 38 * t + 16, 5);
          ctx.fillRect(0, -5, 38 * t + 16, 5);
        }
        // Opportunity Rover rolling forward as t -> 1
        const rx = t > 0.55 ? (t - 0.55) * 110 : 0;
        ctx.translate(rx, -6);
        if (isSpriteReady(roverImg)) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, t * 1.6);
          ctx.drawImage(roverImg, -22, -22, 44, 44);
          ctx.restore();
        } else {
          ctx.fillStyle = '#38BDF8';
          ctx.fillRect(-20 * t, -14, 40 * t, 6);
          ctx.fillStyle = '#E2E8F0';
          ctx.fillRect(-12, -8, 24, 6);
          ctx.strokeStyle = '#F8FAFC';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(6, -14);
          ctx.lineTo(6, -14 - 18 * t);
          ctx.stroke();
          if (t > 0.4) {
            ctx.fillStyle = '#FBBF24';
            ctx.fillRect(2, -16 - 18 * t, 9, 5);
          }
          ctx.fillStyle = '#94A3B8';
          for (const wx of [-9, 0, 9]) {
            ctx.beginPath();
            ctx.arc(wx, 2, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }
    };

    if (landingStage !== 'bouncing') {
      drawScene();
      return;
    }

    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(2, (now - last) / 16.67);
      last = now;

      vy += 0.095 * dt;
      bx += vx * dt;
      by += vy * dt;

      if (by >= GY - 20) {
        by = GY - 20;
        bounces += 1;
        for (let i = 0; i < 6; i++) {
          puffs.push({ x: bx + (i - 2.5) * 9, y: GY - 4, r: 5, life: 28 });
        }
        if (bounces >= 4) {
          vx = 0;
          vy = 0;
          stoppedXRef.current = bx;
          setLandingStage('unfolding');
          drawScene();
          return;
        }
        vy = -vy * (0.72 - bounces * 0.08);
        vx *= 0.88;
      }
      drawScene();
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [phase, landingStage, unfoldPct]);

  // Seamless ~1.5s Petal Unfold -> auto-enter Free-Roam Drive
  useEffect(() => {
    if (landingStage !== 'unfolding') return;
    let animId = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(2, (now - last) / 16.67);
      last = now;
      setUnfoldPct((prev) => {
        const next = Math.min(100, prev + 1.15 * dt);
        if (next >= 100) {
          setLandingStage('deployed');
          setPhase('explore');
          return 100;
        }
        return next;
      });
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [landingStage]);

  const handleSnapPhoto = useCallback(() => {
    const target = nearbyRef.current;
    if (phase !== 'explore' || !target || target.photographed || status !== 'playing') return;

    target.photographed = true;
    playShutter();
    setShutterFlash(true);
    window.setTimeout(() => setShutterFlash(false), 180);

    setPolaroid({ ...target });
    const count = sitesRef.current.filter((s) => s.photographed).length;
    setPhotosCount(count);
    setNearbySite(null);
    nearbyRef.current = null;

    if (count >= 3) {
      window.setTimeout(() => {
        setStatus('won');
        if (!wonCalledRef.current) {
          wonCalledRef.current = true;
          onWin();
        }
      }, 1200);
    }
  }, [phase, status, onWin]);

  useEffect(() => {
    if (phase !== 'explore') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keysRef.current.up = true;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keysRef.current.down = true;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;
      if (e.code === 'Space') {
        e.preventDefault();
        handleSnapPhoto();
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
  }, [phase, handleSnapPhoto]);

  // Part 2: Free-Roam Top-Down Mars Drive
  useEffect(() => {
    if (phase !== 'explore') return;
    const canvas = exploreCanvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDPICanvas(canvas, W, H);
    if (!ctx) return;

    let animId = 0;
    const roverImg = loadCanvasSprite(SPRITE_ROVER);
    const blueberryImg = loadCanvasSprite(SPRITE_BLUEBERRIES);
    let rx = 140;
    let ry = 270;
    let rAngle = -Math.PI / 4;
    let slipTimer = 0;
    let safeX = 140;
    let safeY = 270;
    const slipPuffs: Array<{ x: number; y: number; r: number; life: number }> = [];
    const tracks: TireTrack[] = [];
    let trackStep = 0;

    let last = performance.now();

    const loop = (now: number) => {
      prepareHiDPIFrame(ctx);
      const dt = Math.min(2, (now - last) / 16.67);
      last = now;

      if (slipTimer > 0) {
        slipTimer -= dt;
        // Gently slide/reverse back toward safe rim position
        rx += (safeX - rx) * 0.1 * dt;
        ry += (safeY - ry) * 0.1 * dt;
        if (slipTimer <= 0) {
          rx = safeX;
          ry = safeY;
          setCraterAlert(false);
        }
      } else {
        let dx = 0;
        let dy = 0;
        if (keysRef.current.left) dx -= 1;
        if (keysRef.current.right) dx += 1;
        if (keysRef.current.up) dy -= 1;
        if (keysRef.current.down) dy += 1;

        if (dx !== 0 || dy !== 0) {
          const len = Math.hypot(dx, dy);
          const speed = 3.2 * dt;
          const nextX = Math.max(36, Math.min(W - 36, rx + (dx / len) * speed));
          const nextY = Math.max(36, Math.min(H - 36, ry + (dy / len) * speed));
          rAngle = Math.atan2(dy, dx);

          // Check crater circle collision
          let hitCrater: [number, number, number] | null = null;
          for (const c of CRATERS) {
            if (Math.hypot(nextX - c[0], nextY - c[1]) < c[2] + 13) {
              hitCrater = c;
              break;
            }
          }

          if (hitCrater) {
            const [cx, cy, cr] = hitCrater;
            const angOut = Math.atan2(ry - cy, rx - cx);
            safeX = Math.max(36, Math.min(W - 36, cx + Math.cos(angOut) * (cr + 22)));
            safeY = Math.max(36, Math.min(H - 36, cy + Math.sin(angOut) * (cr + 22)));
            // Tilt/slide slightly into rim before reversing
            rx = cx + Math.cos(angOut) * (cr + 4);
            ry = cy + Math.sin(angOut) * (cr + 4);
            slipTimer = 56;
            setCraterAlert(true);
            for (let i = 0; i < 6; i++) {
              slipPuffs.push({ x: rx + (i - 2.5) * 6, y: ry, r: 5, life: 26 });
            }
          } else {
            rx = nextX;
            ry = nextY;
            trackStep += speed;
            if (trackStep >= 10) {
              trackStep = 0;
              tracks.push({ x: rx, y: ry, angle: rAngle });
              if (tracks.length > 90) tracks.shift();
            }
          }
        }
      }

      // Find nearby undiscovered site
      let foundNear: ScienceSite | null = null;
      let nearestSite: ScienceSite | null = null;
      let nearestDist = Infinity;

      for (const s of sitesRef.current) {
        if (s.photographed) continue;
        const d = Math.hypot(rx - s.x, ry - s.y);
        if (d < nearestDist) {
          nearestDist = d;
          nearestSite = s;
        }
        if (d < 56) {
          foundNear = s;
        }
      }
      if (nearbyRef.current?.id !== foundNear?.id) {
        nearbyRef.current = foundNear;
        setNearbySite(foundNear ? { ...foundNear } : null);
      }

      // Draw Mars ground
      ctx.fillStyle = '#2B1410';
      ctx.fillRect(0, 0, W, H);

      // Steep Martian craters
      for (const [cx, cy, cr] of CRATERS) {
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fillStyle = '#180A08';
        ctx.fill();
        ctx.strokeStyle = '#9A4A3A';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Slip dust puffs
      for (let i = slipPuffs.length - 1; i >= 0; i--) {
        const p = slipPuffs[i];
        p.r += 0.4;
        p.life -= 0.8 * dt;
        if (p.life <= 0) {
          slipPuffs.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(217, 119, 87, ${Math.min(1, p.life / 26)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Subtle rover tire tracks
      ctx.fillStyle = '#1E0D0A';
      for (const tr of tracks) {
        ctx.save();
        ctx.translate(tr.x, tr.y);
        ctx.rotate(tr.angle);
        ctx.fillRect(-4, -14, 6, 4);
        ctx.fillRect(-4, 10, 6, 4);
        ctx.restore();
      }

      // 3 Science Sites
      for (const s of sitesRef.current) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fillStyle = s.photographed ? '#0F2420' : '#1B160C';
        ctx.fill();
        ctx.strokeStyle = s.photographed ? '#34D399' : s.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        if (isSpriteReady(blueberryImg)) {
          ctx.drawImage(blueberryImg, -16, -16, 32, 32);
        }

        ctx.fillStyle = s.photographed ? '#34D399' : s.color;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(s.photographed ? `${s.title} ✓` : s.title, 0, -28);
        ctx.restore();
      }

      // Top-down Opportunity Rover
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(rAngle + (slipTimer > 0 ? Math.sin(slipTimer * 0.5) * 0.25 : 0));
      if (isSpriteReady(roverImg)) {
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(roverImg, -24, -24, 48, 48);
      } else {
        ctx.fillStyle = '#38BDF8';
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1.5;
        ctx.fillRect(-16, -15, 32, 30);
        ctx.strokeRect(-16, -15, 32, 30);
        ctx.fillStyle = '#FBBF24';
        ctx.fillRect(6, -5, 8, 10);
      }
      ctx.restore();

      // Compass arrow pointing toward nearest undiscovered site
      if (nearestSite) {
        const ang = Math.atan2(nearestSite.y - ry, nearestSite.x - rx);
        ctx.save();
        ctx.translate(rx + Math.cos(ang) * 34, ry + Math.sin(ang) * 34);
        ctx.rotate(ang);
        ctx.fillStyle = '#FBBF24';
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-4, -5);
        ctx.lineTo(-4, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [phase, runKey]);

  const handleFullReset = useCallback(() => {
    wonCalledRef.current = false;
    sitesRef.current = INITIAL_SITES.map((s) => ({ ...s, photographed: false }));
    nearbyRef.current = null;
    setPhase('landing');
    setLandingStage('ready');
    setUnfoldPct(0);
    setPhotosCount(0);
    setNearbySite(null);
    setPolaroid(null);
    setCraterAlert(false);
    setStatus('playing');
    setRunKey((k) => k + 1);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-[#0E1320] px-3.5 py-2">
        <p className="font-sans text-xs font-semibold text-ink">
          {phase === 'landing'
            ? 'Part 1: Bounce onto Mars inside giant airbags, then unfold the lander petals to deploy Opportunity!'
            : 'Part 2: Drive Opportunity to all 3 glowing Science Sites and snap Pancam photos!'}
        </p>
        <span className="font-mono text-xs font-bold text-amber-300">
          {phase === 'landing' ? 'AIRBAG LANDING' : `PANCAM PHOTOS: ${photosCount} / 3`}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-line bg-[#070A12] p-4">
        {phase === 'landing' ? (
          <div className="space-y-4">
            <canvas ref={landCanvasRef} width={720} height={240} className="block h-auto w-full rounded-lg border border-line" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-sans text-xs text-muted">
                {landingStage === 'ready' && 'Opportunity is descending toward Meridiani Planum!'}
                {landingStage === 'bouncing' && 'Bouncing gently across Mars inside protective airbags...'}
                {landingStage === 'unfolding' && 'Opening lander petals, unfolding solar wings, and rolling onto Mars...'}
                {(landingStage === 'stopped' || landingStage === 'deployed') && 'Deploying onto Martian soil...'}
              </span>

              {landingStage === 'ready' && (
                <button
                  type="button"
                  onClick={() => setLandingStage('bouncing')}
                  className="rounded-lg px-5 py-2.5 font-sans text-sm font-bold text-space"
                  style={{ backgroundColor: accentColor }}
                >
                  Start Landing Sequence
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="relative">
            <canvas ref={exploreCanvasRef} width={W} height={H} className="block h-auto w-full rounded-lg border border-line" />

            {shutterFlash && <div className="pointer-events-none absolute inset-0 bg-white/75" />}

            {craterAlert && status === 'playing' && (
              <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center px-4">
                <div className="rounded-xl border border-amber-400 bg-[#1F140A] px-4 py-2 text-center font-mono text-xs font-bold text-amber-200">
                  SLIPPED INTO CRATER! Watch out for steep Martian craters! Reversing to safety...
                </div>
              </div>
            )}

            {nearbySite && status === 'playing' && (
              <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center px-4">
                <button
                  type="button"
                  onClick={handleSnapPhoto}
                  className="rounded-xl border-2 border-white bg-[#0E1320] px-5 py-2.5 font-sans text-sm font-bold text-amber-300 shadow-lg"
                >
                  📷 SNAP PANCAM PHOTO ({nearbySite.title})
                </button>
              </div>
            )}
          </div>
        )}

        {status === 'won' && (
          <MiniGameResultOverlay
            status="won"
            title="45.16 km Mars Marathon Complete!"
            summary="From airbag bounce landing to photographing hematite blueberries and rover tracks, you completed Opportunity’s legendary Mars expedition!"
            accentColor={accentColor}
            alreadyCompleted={alreadyCompleted}
            onRetry={handleFullReset}
            onBackToHub={onBackToHub}
          />
        )}
      </div>

      {/* Pancam Polaroid Telemetry Card */}
      {phase === 'explore' && polaroid && (
        <div className="rounded-lg border border-sky-400/50 bg-[#0E1320] p-3">
          <div className="font-mono text-[11px] font-bold text-sky-300">
            PANCAM TELEMETRY // {polaroid.title.toUpperCase()}
          </div>
          <p className="mt-1 font-sans text-xs text-ink">{polaroid.fact}</p>
        </div>
      )}

      {/* Touch D-Pad + Keyboard hint */}
      {phase === 'explore' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs text-muted">
            Keys: WASD / Arrow Keys to Drive • Space = Snap Pancam Photo
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
      )}
    </div>
  );
}
