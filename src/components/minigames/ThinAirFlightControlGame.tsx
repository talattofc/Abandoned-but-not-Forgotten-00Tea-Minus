import { useCallback, useEffect, useRef, useState } from 'react';
import type { MiniGameProps } from './LunarCraterCruiserGame';
import { MiniGameResultOverlay } from './MiniGameResultOverlay';
import { isSpriteReady, loadCanvasSprite, prepareHiDPIFrame, setupHiDPICanvas } from './spriteLoader';
import { playShutter } from '../../utils/soundEffects';

const SPRITE_BG = '/minigames/mars/helicopter/Mars Krateri’nde Katmanlı Kanyon Manzarası.png';
const SPRITE_FUSELAGE = '/minigames/mars/helicopter/01_ingenuity_fuselage_no_rotors.png';
const SPRITE_ROTORS = '/minigames/mars/helicopter/02_coaxial_carbon_rotor_blades.png';
const SPRITE_PERSEVERANCE = '/minigames/mars/helicopter/03_perseverance_rover_top_down.png';

interface PhotoZone {
  id: number;
  x: number;
  y: number;
  title: string;
  captured: boolean;
}

const W = 840;
const H = 340;
const GROUND_Y = 290;
const PAD = { x: 695, w: 110 };

const INITIAL_ZONES: PhotoZone[] = [
  { id: 1, x: 265, y: 155, title: 'Perseverance Rover Below', captured: false },
  { id: 2, x: 520, y: 135, title: 'Ancient River Delta', captured: false },
];

export function ThinAirFlightControlGame({
  accentColor,
  alreadyCompleted,
  onWin,
  onBackToHub,
}: MiniGameProps) {
  const [phase, setPhase] = useState<'spin' | 'liftoff' | 'flight'>('spin');
  const [rpm, setRpm] = useState(0);
  const [photosCount, setPhotosCount] = useState(0);
  const [nearbyZone, setNearbyZone] = useState<PhotoZone | null>(null);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [flightHint, setFlightHint] = useState(
    'Fly over the 2 glowing Aerial Photo Zones and press Space / SNAP AERIAL PHOTO!',
  );
  const [status, setStatus] = useState<'playing' | 'won'>('playing');
  const [runKey, setRunKey] = useState(0);

  const spinBoxRef = useRef<HTMLDivElement>(null);
  const spinCanvasRef = useRef<HTMLCanvasElement>(null);
  const flightCanvasRef = useRef<HTMLCanvasElement>(null);

  const rpmRef = useRef(0);
  const holdSpinRef = useRef(false);
  const keysRef = useRef({ left: false, right: false, up: false, down: false });
  const zonesRef = useRef<PhotoZone[]>(INITIAL_ZONES.map((z) => ({ ...z })));
  const nearbyRef = useRef<PhotoZone | null>(null);
  const wonCalledRef = useRef(false);

  // Stage 1: Non-passive wheel listener so e.preventDefault() stops page scroll
  useEffect(() => {
    if (phase !== 'spin') return;
    const el = spinBoxRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      rpmRef.current = Math.min(3000, rpmRef.current + 145);
      setRpm(Math.round(rpmRef.current));
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [phase]);

  // Stage 1: Rotor animation + gentle RPM decay + liftoff trigger
  useEffect(() => {
    if (phase !== 'spin' && phase !== 'liftoff') return;
    const canvas = spinCanvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDPICanvas(canvas, 420, 210);
    if (!ctx) return;

    let animId = 0;
    const bgImg = loadCanvasSprite(SPRITE_BG);
    const fuselageImg = loadCanvasSprite(SPRITE_FUSELAGE);
    const rotorsImg = loadCanvasSprite(SPRITE_ROTORS);
    let bladePhase = 0;
    let last = performance.now();

    const loop = (now: number) => {
      prepareHiDPIFrame(ctx);
      const dt = Math.min(2, (now - last) / 16.67);
      last = now;

      if (phase === 'spin') {
        if (holdSpinRef.current) {
          rpmRef.current = Math.min(3000, rpmRef.current + 36 * dt);
        } else if (rpmRef.current > 0) {
          rpmRef.current = Math.max(0, rpmRef.current - 3.2 * dt);
        }
        setRpm(Math.round(rpmRef.current));

        if (rpmRef.current >= 2537) {
          setPhase('liftoff');
        }
      }

      bladePhase += Math.max(0.02, (rpmRef.current / 2537) * 0.65) * dt;

      // Draw Jezero Crater surface + Ingenuity
      if (isSpriteReady(bgImg)) {
        ctx.drawImage(bgImg, 0, 0, 420, 210);
        ctx.fillStyle = 'rgba(7, 10, 18, 0.38)';
        ctx.fillRect(0, 0, 420, 210);
      } else {
        ctx.fillStyle = '#1A0E0C';
        ctx.fillRect(0, 0, 420, 210);
        ctx.fillStyle = '#2B1612';
        ctx.fillRect(0, 168, 420, 42);
        ctx.strokeStyle = '#9A4A3A';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 168);
        ctx.lineTo(420, 168);
        ctx.stroke();
      }

      const liftY = phase === 'liftoff' ? -24 : 0;
      ctx.save();
      ctx.translate(210, 142 + liftY);
      if (isSpriteReady(fuselageImg) && isSpriteReady(rotorsImg)) {
        ctx.drawImage(fuselageImg, -26, -28, 52, 56);
        ctx.save();
        ctx.translate(0, -18);
        ctx.scale(Math.max(0.18, Math.abs(Math.cos(bladePhase))), 1);
        ctx.drawImage(rotorsImg, -46, -12, 92, 24);
        ctx.restore();
      } else {
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-8, 6);
        ctx.lineTo(-22, 22);
        ctx.moveTo(8, 6);
        ctx.lineTo(22, 22);
        ctx.stroke();
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(-13, -10, 26, 16);
        ctx.strokeStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, -34);
        ctx.stroke();
        const span = 52 * Math.abs(Math.cos(bladePhase)) + 10;
        ctx.strokeStyle = rpmRef.current >= 2537 ? '#34D399' : '#38BDF8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-span, -22);
        ctx.lineTo(span, -22);
        ctx.moveTo(-span * 0.9, -29);
        ctx.lineTo(span * 0.9, -29);
        ctx.stroke();
        ctx.fillStyle = '#1E3A8A';
        ctx.fillRect(-14, -38, 28, 5);
      }
      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [phase]);

  // Brief LIFT-OFF! transition into Stage 2
  useEffect(() => {
    if (phase !== 'liftoff') return;
    const timer = window.setTimeout(() => {
      setPhase('flight');
    }, 900);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const handleSnapPhoto = useCallback(() => {
    const z = nearbyRef.current;
    if (phase !== 'flight' || !z || z.captured || status !== 'playing') return;

    z.captured = true;
    playShutter();
    setShutterFlash(true);
    window.setTimeout(() => setShutterFlash(false), 180);

    const count = zonesRef.current.filter((item) => item.captured).length;
    setPhotosCount(count);
    setNearbyZone(null);
    nearbyRef.current = null;
    setFlightHint(
      count >= 2
        ? 'Both scout photos captured! Fly to the green Target Helipad on the right and descend gently!'
        : `Captured ${z.title}! Fly to the next glowing photo zone (${count}/2).`,
    );
  }, [phase, status]);

  useEffect(() => {
    if (phase !== 'flight') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keysRef.current.up = true;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keysRef.current.down = true;
      if (e.code === 'Space') {
        e.preventDefault();
        handleSnapPhoto();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keysRef.current.up = false;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keysRef.current.down = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [phase, handleSnapPhoto]);

  // Stage 2 & 3: Aerial Scout Flight & Landing
  useEffect(() => {
    if (phase !== 'flight') return;
    const canvas = flightCanvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDPICanvas(canvas, W, H);
    if (!ctx) return;

    let animId = 0;
    const bgImg = loadCanvasSprite(SPRITE_BG);
    const fuselageImg = loadCanvasSprite(SPRITE_FUSELAGE);
    const rotorsImg = loadCanvasSprite(SPRITE_ROTORS);
    const perseImg = loadCanvasSprite(SPRITE_PERSEVERANCE);
    let hx = 80;
    let hy = 185;
    let bladePhase = 0;
    let landed = false;

    const boulders = [
      { x: 170, w: 38, h: 42 },
      { x: 390, w: 46, h: 52 },
      { x: 610, w: 42, h: 46 },
    ];

    let last = performance.now();

    const loop = (now: number) => {
      prepareHiDPIFrame(ctx);
      const dt = Math.min(2, (now - last) / 16.67);
      last = now;

      if (!landed) {
        const move = 3.2 * dt;
        if (keysRef.current.left) hx -= move;
        if (keysRef.current.right) hx += move;
        if (keysRef.current.up) hy -= move;
        if (keysRef.current.down) hy += move;

        hx = Math.max(32, Math.min(W - 32, hx));
        hy = Math.max(36, Math.min(GROUND_Y - 18, hy));
        bladePhase += 0.65 * dt;

        // Gentle boulder bump
        for (const b of boulders) {
          if (hx + 18 > b.x && hx - 18 < b.x + b.w && hy + 16 > GROUND_Y - b.h) {
            hy = GROUND_Y - b.h - 20;
            setFlightHint('Watch out for canyon boulders! Stay high over rocky terrain.');
          }
        }

        // Check Photo Zones
        let near: PhotoZone | null = null;
        for (const z of zonesRef.current) {
          if (z.captured) continue;
          if (Math.hypot(hx - z.x, hy - z.y) < 52) {
            near = z;
            break;
          }
        }
        if (nearbyRef.current?.id !== near?.id) {
          nearbyRef.current = near;
          setNearbyZone(near ? { ...near } : null);
        }

        // Stage 3: Safe Touchdown on Target Helipad
        const allCaptured = zonesRef.current.every((z) => z.captured);
        if (allCaptured && hx >= PAD.x && hx <= PAD.x + PAD.w && hy >= GROUND_Y - 22) {
          landed = true;
          setStatus('won');
          if (!wonCalledRef.current) {
            wonCalledRef.current = true;
            onWin();
          }
        }
      }

      // Draw Mars Canyon
      if (isSpriteReady(bgImg)) {
        ctx.drawImage(bgImg, 0, 0, W, H);
        ctx.fillStyle = 'rgba(7, 10, 18, 0.42)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(43, 22, 18, 0.72)';
        ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
        ctx.strokeStyle = '#9A4A3A';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, GROUND_Y);
        ctx.lineTo(W, GROUND_Y);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#1A0E0C';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#2B1612';
        ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
        ctx.strokeStyle = '#9A4A3A';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, GROUND_Y);
        ctx.lineTo(W, GROUND_Y);
        ctx.stroke();
      }

      // Boulders
      for (const b of boulders) {
        ctx.fillStyle = '#5C2B22';
        ctx.strokeStyle = '#C26D53';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(b.x, GROUND_Y);
        ctx.lineTo(b.x + 8, GROUND_Y - b.h);
        ctx.lineTo(b.x + b.w - 8, GROUND_Y - b.h + 8);
        ctx.lineTo(b.x + b.w, GROUND_Y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Perseverance Rover below Zone 1
      if (isSpriteReady(perseImg)) {
        ctx.drawImage(perseImg, 240, GROUND_Y - 40, 52, 42);
      } else {
        ctx.fillStyle = '#CBD5E1';
        ctx.fillRect(245, GROUND_Y - 22, 40, 14);
        ctx.fillStyle = '#94A3B8';
        for (const wx of [250, 265, 280]) {
          ctx.beginPath();
          ctx.arc(wx, GROUND_Y - 5, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Ancient River Delta markings below Zone 2
      ctx.fillStyle = '#7C3AED';
      ctx.fillRect(490, GROUND_Y - 6, 60, 6);

      // Aerial Photo Zones
      for (const z of zonesRef.current) {
        ctx.save();
        ctx.translate(z.x, z.y);
        ctx.beginPath();
        ctx.arc(0, 0, 28, 0, Math.PI * 2);
        ctx.fillStyle = z.captured ? 'rgba(15, 36, 32, 0.7)' : 'rgba(27, 22, 12, 0.75)';
        ctx.fill();
        ctx.strokeStyle = z.captured ? '#34D399' : '#FBBF24';
        ctx.lineWidth = 2;
        ctx.setLineDash(z.captured ? [] : [5, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = z.captured ? '#34D399' : '#FDE68A';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(z.captured ? `${z.title} ✓` : z.title, 0, -35);
        ctx.restore();
      }

      // Target Helipad
      const readyToLand = zonesRef.current.every((z) => z.captured);
      ctx.fillStyle = readyToLand ? '#0F2420' : '#1E293B';
      ctx.strokeStyle = readyToLand ? '#34D399' : '#64748B';
      ctx.lineWidth = 2.5;
      ctx.fillRect(PAD.x, GROUND_Y - 8, PAD.w, 8);
      ctx.strokeRect(PAD.x, GROUND_Y - 8, PAD.w, 8);
      ctx.fillStyle = readyToLand ? '#34D399' : '#94A3B8';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('TARGET HELIPAD', PAD.x + PAD.w / 2, GROUND_Y - 16);

      // Ingenuity Helicopter
      ctx.save();
      ctx.translate(hx, hy);
      if (isSpriteReady(fuselageImg) && isSpriteReady(rotorsImg)) {
        ctx.drawImage(fuselageImg, -20, -22, 40, 44);
        ctx.save();
        ctx.translate(0, -14);
        ctx.scale(Math.max(0.18, Math.abs(Math.cos(bladePhase))), 1);
        ctx.drawImage(rotorsImg, -36, -10, 72, 20);
        ctx.restore();
      } else {
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-6, 6);
        ctx.lineTo(-13, 16);
        ctx.moveTo(6, 6);
        ctx.lineTo(13, 16);
        ctx.stroke();
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(-10, -8, 20, 14);
        const span = 26 * Math.abs(Math.cos(bladePhase)) + 8;
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-span, -15);
        ctx.lineTo(span, -15);
        ctx.moveTo(-span * 0.9, -20);
        ctx.lineTo(span * 0.9, -20);
        ctx.stroke();
      }
      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [phase, runKey, onWin]);

  const handleFullReset = useCallback(() => {
    wonCalledRef.current = false;
    rpmRef.current = 0;
    holdSpinRef.current = false;
    zonesRef.current = INITIAL_ZONES.map((z) => ({ ...z, captured: false }));
    nearbyRef.current = null;
    setPhase('spin');
    setRpm(0);
    setPhotosCount(0);
    setNearbyZone(null);
    setStatus('playing');
    setFlightHint('Fly over the 2 glowing Aerial Photo Zones and press Space / SNAP AERIAL PHOTO!');
    setRunKey((k) => k + 1);
  }, []);

  const rpmPct = Math.min(100, Math.round((rpm / 3000) * 100));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-[#0E1320] px-3.5 py-2">
        <p className="font-sans text-xs font-semibold text-ink">
          {phase !== 'flight'
            ? 'Stage 1: Scroll your Mouse Wheel (or hold Spin Rotors) to rev Ingenuity to 2,537 RPM for Mars Lift-Off!'
            : 'Stage 2 & 3: Snap 2 Aerial Scout Photos, then descend onto the green Target Helipad!'}
        </p>
        <span className="font-mono text-xs font-bold text-amber-300">
          {phase !== 'flight' ? `${rpm} / 2,537 RPM` : `SCOUT PHOTOS: ${photosCount} / 2`}
        </span>
      </div>

      <div ref={spinBoxRef} className="relative overflow-hidden rounded-xl border border-line bg-[#070A12] p-4">
        {phase !== 'flight' ? (
          <div className="grid gap-5 md:grid-cols-12 md:items-center">
            <canvas
              ref={spinCanvasRef}
              width={420}
              height={210}
              className="block h-auto w-full rounded-lg border border-line md:col-span-6"
            />

            <div className="space-y-3 md:col-span-6">
              {phase === 'liftoff' ? (
                <div className="rounded-lg border border-emerald-400 bg-[#0F2420] p-4 text-center font-display text-xl font-bold text-emerald-300">
                  LIFT-OFF! Entering Jezero Canyon...
                </div>
              ) : (
                <>
                  <div className="rounded-lg border border-line bg-[#0E1320] p-3.5">
                    <div className="flex justify-between font-mono text-xs font-bold">
                      <span className="text-ink">ROTOR TACHOMETER</span>
                      <span className={rpm >= 2537 ? 'text-emerald-300' : 'text-sky-300'}>
                        {rpm} RPM
                      </span>
                    </div>

                    {/* Gauge bar with Earth ~450 RPM & Mars 2,537 RPM markers */}
                    <div className="relative mt-3 h-5 w-full overflow-hidden rounded-full border border-line bg-[#070A12]">
                      <div
                        className={`h-full transition-all ${
                          rpm >= 2537 ? 'bg-emerald-400' : 'bg-sky-400'
                        }`}
                        style={{ width: `${rpmPct}%` }}
                      />
                      {/* Earth 450 RPM marker (~15%) */}
                      <div className="absolute inset-y-0 left-[15%] w-0.5 bg-rose-400" />
                      {/* Mars 2,537 RPM marker (~85%) */}
                      <div className="absolute inset-y-0 left-[84.5%] w-1 bg-emerald-300" />
                    </div>

                    <div className="mt-2 flex flex-wrap justify-between gap-2 font-mono text-[10px]">
                      <span className="text-rose-400">450 RPM: Earth Speed (Too slow!)</span>
                      <span className="text-emerald-300">2,537+ RPM: MARS LIFT-OFF TARGET!</span>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-muted">
                    Scroll your mouse wheel anywhere over this panel to spin the coaxial blades, or hold the button below!
                  </p>

                  <button
                    type="button"
                    onPointerDown={() => {
                      holdSpinRef.current = true;
                    }}
                    onPointerUp={() => {
                      holdSpinRef.current = false;
                    }}
                    onPointerLeave={() => {
                      holdSpinRef.current = false;
                    }}
                    className="w-full rounded-lg px-4 py-3 font-sans text-sm font-bold text-space"
                    style={{ backgroundColor: accentColor }}
                  >
                    ⚡ Spin Rotors (Hold / Scroll Wheel)
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="relative">
            <canvas ref={flightCanvasRef} width={W} height={H} className="block h-auto w-full rounded-lg border border-line" />

            {shutterFlash && <div className="pointer-events-none absolute inset-0 bg-white/75" />}

            {nearbyZone && status === 'playing' && (
              <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center px-4">
                <button
                  type="button"
                  onClick={handleSnapPhoto}
                  className="rounded-xl border-2 border-white bg-[#0E1320] px-5 py-2.5 font-sans text-sm font-bold text-amber-300 shadow-lg"
                >
                  📷 SNAP AERIAL PHOTO ({nearbyZone.title})
                </button>
              </div>
            )}
          </div>
        )}

        {status === 'won' && (
          <MiniGameResultOverlay
            status="won"
            title="Mars Aerial Scout Mission Complete!"
            summary="You revved Ingenuity’s coaxial blades to 2,537 RPM for Mars’s 1% thin air, captured both scout photos, and landed safely on the helipad!"
            accentColor={accentColor}
            alreadyCompleted={alreadyCompleted}
            onRetry={handleFullReset}
            onBackToHub={onBackToHub}
          />
        )}
      </div>

      {phase === 'flight' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-sans text-xs text-muted">{flightHint}</span>
          <div className="flex items-center gap-1.5">
            {(
              [
                ['◀', 'left'],
                ['▲', 'up'],
                ['▼ LAND', 'down'],
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
