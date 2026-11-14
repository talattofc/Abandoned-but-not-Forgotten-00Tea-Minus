import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { HardwareItem } from '../data/hardwareData';
import { HardwareIllustration } from './icons/HardwareIllustration';

interface MiniGameModalProps {
  open: boolean;
  hardware: HardwareItem;
  accentColor: string;
  onClose: () => void;
}

/**
 * Modular Mini-Game container ready for Step 3 individual game builds.
 */
export function MiniGameModal({ open, hardware, accentColor, onClose }: MiniGameModalProps) {
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    setLaunched(false);
  }, [hardware.id, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-[#070A12]/85 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={hardware.miniGame.title}
            className="panel w-full max-w-lg rounded-2xl p-5"
            initial={{ y: 18, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className="inline-block rounded border px-2 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: '#101522', color: accentColor, borderColor: `${accentColor}55` }}
                >
                  Mission Simulation
                </span>
                <h2 className="mt-1.5 font-display text-xl font-bold text-ink">{hardware.miniGame.title}</h2>
                <p className="font-sans text-xs text-muted">{hardware.miniGame.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close mini-game"
                className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-card font-sans text-sm text-muted hover:border-line-strong hover:text-ink"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-line bg-space p-3">
              {!launched ? (
                <div className="space-y-3">
                  <div className="mx-auto aspect-[16/10] max-w-xs overflow-hidden rounded-lg border border-line">
                    <HardwareIllustration id={hardware.id} variant="blueprint" />
                  </div>
                  <p className="font-sans text-sm leading-relaxed text-ink">{hardware.miniGame.instructions}</p>
                  <div className="rounded-lg border border-line bg-card px-3 py-2 font-mono text-xs text-muted">
                    Controls: {hardware.miniGame.controlsHint}
                  </div>
                  <button
                    type="button"
                    onClick={() => setLaunched(true)}
                    className="w-full rounded-lg px-4 py-2.5 font-sans text-sm font-bold text-space transition-opacity hover:opacity-90"
                    style={{ backgroundColor: accentColor }}
                  >
                    Launch Simulation
                  </button>
                </div>
              ) : (
                <div className="space-y-3 py-6 text-center">
                  <div className="mx-auto inline-flex rounded-lg border border-dashed border-line-strong bg-card px-3 py-1 font-mono text-xs text-deep">
                    SIMULATION MODULE READY
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    {hardware.shortName} Lab Initialized
                  </h3>
                  <p className="mx-auto max-w-sm font-sans text-sm text-muted">
                    The full interactive playable module for <strong className="text-ink">{hardware.miniGame.title}</strong>{' '}
                    plugs in right here in the next build phase!
                  </p>
                  <button
                    type="button"
                    onClick={() => setLaunched(false)}
                    className="rounded-lg border border-line-strong bg-card px-4 py-2 font-sans text-xs font-bold text-ink hover:border-deep"
                  >
                    ← Back to Briefing
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
