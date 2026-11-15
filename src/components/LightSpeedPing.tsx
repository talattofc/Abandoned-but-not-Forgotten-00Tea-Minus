import { useEffect, useRef, useState } from 'react';
import type { HardwareItem } from '../data/hardwareData';
import { playPing, playSuccess } from '../utils/soundEffects';

interface LightSpeedPingProps {
  hardware: HardwareItem;
  accentColor: string;
}

/**
 * Interactive speed-of-light (~300,000 km/s) signal simulator.
 * Animates via requestAnimationFrame using GPU transform (scaleX / translateX).
 */
export function LightSpeedPing({ hardware, accentColor }: LightSpeedPingProps) {
  const { ping } = hardware;
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setState('idle');
    setProgress(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hardware.id]);

  const handlePing = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    playPing();
    setState('sending');
    setProgress(0);
    const start = performance.now();

    const step = (now: number) => {
      const p = Math.min((now - start) / ping.simDurationMs, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        setState('done');
        playSuccess();
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  return (
    <div className="panel rounded-xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink">
            Ping the Hardware (Speed of Light: 300,000 km/s)
          </h3>
          <p className="mt-0.5 font-sans text-xs text-muted">
            One-way travel time: <strong className="text-ink">{ping.realTimeLabel}</strong> ({ping.distanceLabel})
            {ping.isFastForward && ' · 3s fast-forward simulation'}
          </p>
        </div>

        <button
          type="button"
          onClick={handlePing}
          disabled={state === 'sending'}
          className="rounded-lg px-3.5 py-2 font-sans text-xs font-bold text-space transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-65 sm:text-sm"
          style={{ backgroundColor: accentColor }}
        >
          {state === 'sending' ? 'Transmitting...' : state === 'done' ? 'Ping Again' : 'Ping Hardware'}
        </button>
      </div>

      {/* Signal Track */}
      <div className="mt-4 flex items-center gap-3">
        <span className="rounded border border-line bg-space px-2 py-1 font-mono text-xs font-bold text-sky-300">
          EARTH
        </span>
        <div className="relative h-3 flex-1 overflow-hidden rounded-full border border-line bg-space">
          <div
            className="h-full w-full origin-left"
            style={{
              backgroundColor: accentColor,
              transform: `scaleX(${progress})`,
            }}
          />
        </div>
        <span className="rounded border border-line bg-space px-2 py-1 font-mono text-xs font-bold text-ink">
          {hardware.shortName}
        </span>
      </div>

      {/* Live readout */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
        <span className="text-muted">
          {state === 'idle' && 'Ready to transmit radio pulse from NASA Deep Space Network.'}
          {state === 'sending' &&
            `Pulse in flight... ${Math.round(progress * 100)}% (${ping.isFastForward ? 'fast-forward' : `${(progress * 1.28).toFixed(2)}s`})`}
          {state === 'done' && ping.resultNote}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted/80">
          Educational Simulation – Simplified Model
        </span>
      </div>
    </div>
  );
}
