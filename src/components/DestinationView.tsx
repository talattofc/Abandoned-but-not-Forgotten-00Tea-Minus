import { motion } from 'framer-motion';
import type { Destination } from '../data/destinationsData';
import { getHardwareByDestination, type HardwareId, type PowerSource } from '../data/hardwareData';
import { PlanetOrb } from './PlanetOrb';
import { playClick } from '../utils/soundEffects';

interface DestinationViewProps {
  dest: Destination;
  discoveredIds: string[];
  onSelectHardware: (id: HardwareId) => void;
  onBack: () => void;
}

const POWER_COLORS: Record<PowerSource, string> = {
  Battery: '#60A5FA',
  'Solar Panels': '#FBBF24',
  'Nuclear RTG': '#34D399',
};

/**
 * Destination Hardware Selection screen:
 * shows the destination briefing and its 2 official NASA hardware cards.
 */
export function DestinationView({
  dest,
  discoveredIds,
  onSelectHardware,
  onBack,
}: DestinationViewProps) {
  const devices = getHardwareByDestination(dest.id);

  return (
    <section className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-10 pt-4 md:px-8">
      <div className="mx-auto w-full max-w-[1480px]">
        <button
          type="button"
          onClick={onBack}
          className="panel rounded-lg px-4 py-2 font-sans text-sm font-bold text-ink transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          ← Back to Solar System
        </button>

        <div className="mt-6 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <motion.div
            className="grid h-32 w-32 shrink-0 place-items-center"
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          >
            <PlanetOrb dest={dest} size={dest.visual === 'deepspace' ? 108 : 100} />
          </motion.div>
          <div>
            <span
              className="inline-block rounded border px-2.5 py-1 font-sans text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: '#101522', color: dest.color, borderColor: `${dest.color}55` }}
            >
              Stop {dest.stop} · {dest.subtitle}
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-ink md:text-3xl">
              {dest.stopTitle}
            </h2>
            <p className="mt-2 max-w-xl font-sans text-base leading-relaxed text-muted">{dest.hook}</p>
          </div>
        </div>

        {/* 2 Hardware Cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {devices.map((hw, i) => {
            const discovered = discoveredIds.includes(hw.id);
            const powerColor = POWER_COLORS[hw.powerSource];
            return (
              <motion.button
                key={hw.id}
                type="button"
                onClick={() => {
                  playClick();
                  onSelectHardware(hw.id);
                }}
                className="panel group flex flex-col rounded-xl p-4 text-left transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                {/* Hardware Illustration */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-line bg-[#0B1020]">
                  <img
                    src={hw.heroImage}
                    alt={hw.name}
                    className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="pointer-events-none absolute left-2 top-2 rounded border border-line bg-[#070A12]/90 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-muted">
                    AI GENERATED ILLUSTRATION
                  </span>
                </div>

                {/* Badges row */}
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded border border-line bg-space px-2 py-0.5 font-mono text-[11px] font-bold text-ink">
                    Launched {hw.launchYear}
                  </span>
                  <span
                    className={`rounded border px-2 py-0.5 font-mono text-[11px] font-bold ${
                      discovered
                        ? 'border-emerald-400/50 bg-[#0F2420] text-emerald-300'
                        : 'border-line bg-space text-muted'
                    }`}
                  >
                    {discovered ? 'Discovered ✓' : 'Unexplored'}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="mt-2.5 font-display text-lg font-bold leading-snug text-ink group-hover:text-white">
                  {hw.name}
                </h3>
                <p className="mt-1 flex-1 font-sans text-sm leading-relaxed text-muted">{hw.tagline}</p>

                {/* Status + Power Source pills */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                  <span className="rounded border border-line bg-space px-2 py-0.5 font-sans text-[11px] font-semibold text-ink">
                    {hw.status}
                  </span>
                  <span
                    className="rounded border px-2 py-0.5 font-sans text-[11px] font-bold"
                    style={{
                      backgroundColor: '#070A12',
                      borderColor: `${powerColor}55`,
                      color: powerColor,
                    }}
                  >
                    Power: {hw.powerSource}
                  </span>
                  <span className="ml-auto font-sans text-xs font-bold" style={{ color: dest.color }}>
                    Open Dossier →
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
