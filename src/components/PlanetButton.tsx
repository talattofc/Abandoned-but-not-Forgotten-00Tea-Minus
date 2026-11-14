import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';
import type { Destination, DestinationId } from '../data/destinationsData';
import { PlanetOrb } from './PlanetOrb';

export interface PlanetButtonProps {
  dest: Destination;
  size: number;
  isPreviewed: boolean;
  isHighlighted: boolean;
  compact: boolean;
  onPreview: (dest: Destination, el: HTMLElement) => void;
  onPreviewEnd: () => void;
  onSelect: (id: DestinationId) => void;
}

export const PlanetButton = memo(function PlanetButton({
  dest,
  size,
  isPreviewed,
  isHighlighted,
  compact,
  onPreview,
  onPreviewEnd,
  onSelect,
}: PlanetButtonProps) {
  const active = dest.isActive;
  const hit = Math.max(size + 14, active ? 48 : 34);
  const engaged = isPreviewed || isHighlighted;

  const ariaLabel = active
    ? `${dest.stopTitle}. ${dest.hardwareCount} hardware pieces. Press to explore.`
    : dest.isHome
      ? `${dest.name}: Launchpad and home base`
      : `${dest.name}: ${dest.subtitle}`;

  return (
    <div className="relative" style={{ width: hit, height: hit }}>
      <motion.button
        type="button"
        data-dest-id={dest.id}
        aria-label={ariaLabel}
        className={`absolute inset-0 flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-deep ${
          active ? 'cursor-pointer' : 'cursor-help'
        }`}
        animate={{ scale: engaged ? (active ? 1.18 : 1.07) : 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        onMouseEnter={(e) => onPreview(dest, e.currentTarget)}
        onMouseLeave={onPreviewEnd}
        onFocus={(e) => onPreview(dest, e.currentTarget)}
        onBlur={onPreviewEnd}
        onClick={(e) => {
          if (active) onSelect(dest.id);
          else onPreview(dest, e.currentTarget);
        }}
      >
        {/* Clean solid dashed ring for active destinations */}
        {active && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full border border-dashed"
            style={{
              width: Math.max(hit - 2, size * 1.48),
              height: Math.max(hit - 2, size * 1.48),
              borderColor: engaged ? dest.color : `${dest.color}88`,
            }}
          />
        )}

        <AnimatePresence>
          {engaged && active && <Reticle key="reticle" size={Math.max(hit + 6, size * 1.7)} color={dest.color} />}
        </AnimatePresence>

        <PlanetOrb dest={dest} size={size} dimmed={!active && !dest.isHome} />
      </motion.button>

      {/* Clean, consistent labels — no floating "EXPLORE!" pill */}
      <div
        className={`pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-center leading-tight ${
          !active && !dest.isHome && compact ? 'hidden' : ''
        }`}
      >
        {active ? (
          <>
            <div className="font-sans text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: dest.color }}>
              Stop {dest.stop}
            </div>
            <div className="font-display text-xs font-semibold text-ink sm:text-sm">{dest.name}</div>
          </>
        ) : dest.isHome ? (
          <div className="font-sans text-xs font-semibold text-sky-300">Earth · Home</div>
        ) : (
          <div className="font-sans text-xs text-muted">{dest.name}</div>
        )}
      </div>
    </div>
  );
});

function Reticle({ size, color }: { size: number; color: string }) {
  return (
    <motion.svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{ marginLeft: -size / 2, marginTop: -size / 2 }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.2 }}
    >
      <g className="spin-slow" style={{ transformOrigin: '50px 50px' }}>
        <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="5 7" />
      </g>
      <g stroke={color} strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M8 22 V8 H22" />
        <path d="M78 8 H92 V22" />
        <path d="M92 78 V92 H78" />
        <path d="M22 92 H8 V78" />
      </g>
    </motion.svg>
  );
}
