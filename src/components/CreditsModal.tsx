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
          className="fixed inset-0 z-50 grid place-items-center bg-[#070A12]/85 p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="About and Credits"
            className="panel max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line-strong p-4 sm:p-5"
            initial={{ y: 20, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 14, scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line-strong bg-space">
                  <img
                    src="/images/nebula.jpg"
                    alt="00Tea-Minus Emblem"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-bold text-ink">MISSION ECHO</h2>
                    <TurkishFlagSvg width={22} height={15} />
                  </div>
                  <p className="font-sans text-xs text-sky-300">
                    The Stories Behind Space Exploration • by 00Tea-Minus
                  </p>
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
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between gap-2 rounded-xl border border-line bg-[#0E1320] px-3.5 py-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
                  Creators
                </span>
                <span className="font-display text-sm font-bold text-ink">@talatt &amp; @micir</span>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-xl border border-line bg-[#0E1320] px-3.5 py-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
                  Tester
                </span>
                <span className="font-display text-sm font-bold text-ink">Nazlı Aydın</span>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-xl border border-line bg-[#0E1320] px-3.5 py-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
                  Special Thanks
                </span>
                <span className="font-display text-sm font-bold text-ink">Vedat Aydın</span>
              </div>
            </div>

            {/* Target Audience */}
            <div className="mt-3 rounded-xl border border-line bg-[#0E1320] p-3.5">
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-300">
                Target Audience
              </div>
              <p className="mt-1 font-sans text-xs leading-relaxed text-muted">
                Mission Echo is primarily designed for children aged 10–12, while offering different levels of
                exploration for younger and older learners. Younger users can engage through visuals and interactive
                games, while older learners can explore technical explanations and access official NASA resources for
                deeper research.
              </p>
            </div>

            {/* NASA Media Attribution */}
            <div className="mt-3 rounded-xl border border-line bg-[#070A12] p-3.5">
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
                NASA Media &amp; Data Attribution
              </div>
              <p className="mt-1 font-sans text-xs leading-relaxed text-muted">
                This educational project uses scientific information, imagery, and mission resources from NASA Science,
                NASA NSSDCA, JPL-Caltech, and NASA Ames Research Center. Authentic NASA photographs, official artist
                concepts, and educational simulations are identified separately. Users can access official NASA mission
                resources through links provided throughout the platform.
              </p>
            </div>

            {/* AI Usage Disclosure */}
            <div className="mt-3 rounded-xl border border-line bg-[#070A12] p-3.5">
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                AI Usage Disclosure
              </div>
              <p className="mt-1 font-sans text-xs leading-relaxed text-muted">
                Generative AI tools were used to assist in the development of Mission Echo, including source code, user
                interface components, game mechanics, illustrations, backgrounds, and visual assets. The 00Tea-Minus team
                selected, integrated, tested, and reviewed the final project components. AI-assisted code and visual
                content were used to create an interactive educational experience based on real NASA missions.
                AI-generated illustrations are educational representations and should not be confused with authentic NASA
                photographs or official NASA technical documentation. Scientific information is based on referenced NASA
                mission resources. Mission Echo is an independent educational project and is not affiliated with or
                endorsed by NASA.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
