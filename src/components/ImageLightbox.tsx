import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

export interface LightboxTarget {
  src: string;
  title: string;
  subtitle?: string;
}

interface ImageLightboxProps {
  target: LightboxTarget | null;
  onClose: () => void;
}

/**
 * Reusable flat dark-space Lightbox Modal for inspecting NASA hardware and part images.
 */
export function ImageLightbox({ target, onClose }: ImageLightboxProps) {
  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [target, onClose]);

  return (
    <AnimatePresence>
      {target && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-[#070A12]/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={target.title}
            className="w-full max-w-4xl rounded-2xl border border-[#232B42] bg-[#0A0E1A] p-5"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-display text-lg font-bold text-ink sm:text-xl">{target.title}</h4>
                {target.subtitle && (
                  <p className="mt-0.5 font-sans text-xs text-muted sm:text-sm">{target.subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#232B42] bg-[#101522] px-3 py-1.5 font-sans text-xs font-bold text-ink transition-colors hover:border-line-strong"
              >
                Close ×
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center rounded-xl border border-[#232B42] bg-[#070A12] p-4">
              <img
                src={target.src}
                alt={target.title}
                className="max-h-[72vh] w-full object-contain"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
