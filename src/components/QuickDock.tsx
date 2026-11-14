import { motion } from 'framer-motion';
import { memo } from 'react';
import { activeDestinations, type DestinationId } from '../data/destinationsData';
import { PlanetOrb } from './PlanetOrb';

interface QuickDockProps {
  onSelect: (id: DestinationId) => void;
  onHighlight: (id: DestinationId | null) => void;
}

/** Touch-friendly destination cards for tablets & phones. */
export const QuickDock = memo(function QuickDock({ onSelect, onHighlight }: QuickDockProps) {
  return (
    <nav aria-label="Quick destination select" className="relative z-20 px-3 pb-3 pt-2 md:px-6 md:pb-5">
      <div className="mx-auto grid max-w-4xl grid-cols-3 gap-2 md:gap-4">
        {activeDestinations.map((dest) => (
          <motion.button
            key={dest.id}
            type="button"
            onClick={() => onSelect(dest.id)}
            onMouseEnter={() => onHighlight(dest.id)}
            onMouseLeave={() => onHighlight(null)}
            onFocus={() => onHighlight(dest.id)}
            onBlur={() => onHighlight(null)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="panel group flex min-h-[88px] flex-col items-center justify-center gap-1.5 rounded-xl p-2.5 text-center transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink sm:flex-row sm:justify-start sm:gap-3 sm:p-3.5 sm:text-left"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center">
              <PlanetOrb dest={dest} size={dest.visual === 'deepspace' ? 40 : 34} />
            </div>
            <div className="min-w-0">
              <div className="font-sans text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: dest.color }}>
                Stop {dest.stop}
              </div>
              <div className="font-display text-sm font-bold leading-tight text-ink sm:text-base">{dest.name}</div>
              <div className="hidden font-sans text-xs text-muted sm:block">{dest.hardwareCount} iconic devices</div>
            </div>
            <span className="ml-auto hidden font-sans text-base text-muted transition-transform group-hover:translate-x-1 group-hover:text-ink sm:block">
              →
            </span>
          </motion.button>
        ))}
      </div>
    </nav>
  );
});
