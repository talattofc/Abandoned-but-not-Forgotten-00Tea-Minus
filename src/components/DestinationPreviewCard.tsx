import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import type { Destination, DestinationId } from '../data/destinationsData';

interface DestinationPreviewCardProps {
  dest: Destination;
  style: CSSProperties;
  onSelect: (id: DestinationId) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function DestinationPreviewCard({
  dest,
  style,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: DestinationPreviewCardProps) {
  return (
    <motion.div
      role="dialog"
      aria-label={dest.isActive ? dest.stopTitle : dest.name}
      className="panel absolute z-40 rounded-xl p-4"
      style={
        {
          ...style,
          borderColor: dest.isActive ? `${dest.color}66` : '#232B42',
        } as CSSProperties
      }
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.16 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {dest.isActive ? (
        <>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span
              className="rounded px-2 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: '#151C2E', color: dest.color, border: `1px solid ${dest.color}44` }}
            >
              Stop {dest.stop} · Active
            </span>
            <span className="rounded border border-line bg-card px-2 py-0.5 font-sans text-[11px] font-bold text-ink">
              {dest.hardwareCount} Iconic Devices
            </span>
          </div>
          <h3 className="font-display text-base font-bold leading-snug text-ink">{dest.stopTitle}</h3>
          <p className="mt-1.5 font-sans text-sm leading-relaxed text-muted">{dest.hook}</p>
          <ul className="mt-3 space-y-1.5 border-t border-line pt-2.5">
            {dest.hardware.map((h) => (
              <li key={h.id} className="flex items-center gap-2 font-sans text-xs text-ink">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: dest.color }} />
                <span className="truncate">{h.name}</span>
                <span className="ml-auto shrink-0 font-mono text-[11px] text-muted">{h.years}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onSelect(dest.id)}
            className="mt-3.5 w-full rounded-lg px-3 py-2 font-sans text-sm font-bold text-space transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            style={{ backgroundColor: dest.color }}
          >
            Explore Destination →
          </button>
        </>
      ) : (
        <>
          <h3 className="font-display text-base font-bold text-ink">
            {dest.name} <span className="font-sans text-sm font-normal text-muted">· {dest.subtitle}</span>
          </h3>
          <p className="mt-1.5 font-sans text-sm leading-relaxed text-muted">{dest.lockedMessage}</p>
        </>
      )}
    </motion.div>
  );
}
