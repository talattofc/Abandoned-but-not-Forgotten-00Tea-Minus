import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { playClick } from '../utils/soundEffects';

interface CreditsModalProps {
  open: boolean;
  onClose: () => void;
}

export function TurkishFlagSvg({ width = 22, height = 15 }: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 20"
      aria-label="Turkish Flag"
      className="inline-block shrink-0 rounded-[2px] border border-white/15"
    >
      <rect width="30" height="20" fill="#E30A17" />
      <circle cx="11.2" cy="10" r="5" fill="#FFFFFF" />
      <circle cx="12.55" cy="10" r="4" fill="#E30A17" />
      <polygon
        points="16.4,10 17.65,9.58 17.65,8.25 18.43,9.32 19.68,8.91 18.91,10 19.68,11.09 18.43,10.68 17.65,11.75 17.65,10.42"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function CreditsModal({ open, onClose }: CreditsModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleClose = () => {
    playClick();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-[#070A12]/85 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="About and Credits"
            className="panel w-full max-w-md rounded-2xl border border-line-strong p-5"
            initial={{ y: 20, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 14, scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line-strong bg-space">
                  <img
                    src="/images/nebula.jpg"
                    alt="00Tea-Minus Emblem"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-bold text-ink">
                      Abandoned but not Forgotten
                    </h2>
                    <TurkishFlagSvg width={22} height={15} />
                  </div>
                  <p className="font-mono text-xs text-sky-300">00Tea-Minus</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close About and Credits"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-card font-sans text-sm text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                ✕
              </button>
            </div>

            {/* Credits List */}
            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between rounded-xl border border-line bg-[#0E1320] px-3.5 py-2.5">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
                  Creators
                </span>
                <span className="font-display text-sm font-bold text-ink">@talatt &amp; @micir</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-line bg-[#0E1320] px-3.5 py-2.5">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
                  Tester
                </span>
                <span className="font-display text-sm font-bold text-ink">Nazlı Aydın</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-line bg-[#0E1320] px-3.5 py-2.5">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
                  Special Thanks
                </span>
                <span className="font-display text-sm font-bold text-ink">Vedat Aydın</span>
              </div>
            </div>

            {/* NASA Attribution */}
            <div className="mt-4 rounded-xl border border-line bg-[#070A12] p-3.5">
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
                NASA Media &amp; Data Attribution
              </div>
              <p className="mt-1 font-sans text-xs leading-relaxed text-muted">
                Educational space exploration project using public domain imagery and media courtesy of NASA /
                JPL-Caltech / Ames Research Center (science.nasa.gov / nssdc.gsfc.nasa.gov).
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
