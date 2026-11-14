import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { HardwareId, HardwareItem } from '../data/hardwareData';
import { playClick, playError, playSuccess } from '../utils/soundEffects';

interface MissionQuizModalProps {
  open: boolean;
  hardware: HardwareItem;
  accentColor: string;
  alreadyCompleted: boolean;
  onCompleteQuiz: (hardwareId: HardwareId, coinsEarned: number) => void;
  onClose: () => void;
}

const COINS_PER_CORRECT = 25;
const COMPLETION_BONUS = 25;

export function MissionQuizModal({
  open,
  hardware,
  accentColor,
  alreadyCompleted,
  onCompleteQuiz,
  onClose,
}: MissionQuizModalProps) {
  const [qIndex, setQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (open) {
      setQIndex(0);
      setSelectedOpt(null);
      setCorrectCount(0);
      setFinished(false);
    }
  }, [open, hardware.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const questions = hardware.quiz;
  const currentQ = questions[qIndex];
  const hasAnswered = selectedOpt !== null;

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOpt(idx);
    if (idx === currentQ.correctIndex) {
      playSuccess();
      setCorrectCount((c) => c + 1);
    } else {
      playError();
    }
  };

  const handleNext = () => {
    if (qIndex + 1 < questions.length) {
      playClick();
      setQIndex((i) => i + 1);
      setSelectedOpt(null);
    } else {
      playSuccess();
      setFinished(true);
      const earned = alreadyCompleted ? 0 : correctCount * COINS_PER_CORRECT + COMPLETION_BONUS;
      onCompleteQuiz(hardware.id, earned);
    }
  };

  const potentialCoins = alreadyCompleted ? 0 : correctCount * COINS_PER_CORRECT + COMPLETION_BONUS;

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
            aria-label={`${hardware.shortName} Mission Quiz`}
            className="panel w-full max-w-2xl rounded-2xl p-5 sm:p-6"
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
                  Mission Quiz · {hardware.shortName}
                </span>
                <h2 className="mt-1.5 font-display text-lg font-bold text-ink">
                  {finished ? 'Mission Debrief Complete!' : `Question ${qIndex + 1} of ${questions.length}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close quiz"
                className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-card font-sans text-sm text-muted hover:border-line-strong hover:text-ink"
              >
                ✕
              </button>
            </div>

            {!finished ? (
              <div className="mt-4 space-y-3">
                <p className="font-sans text-base font-bold leading-snug text-ink">{currentQ.question}</p>

                <div className="space-y-2">
                  {currentQ.options.map((opt, idx) => {
                    const isCorrect = idx === currentQ.correctIndex;
                    const isPicked = idx === selectedOpt;
                    let borderClass = 'border-line bg-card hover:border-line-strong text-ink';
                    if (hasAnswered) {
                      if (isCorrect) borderClass = 'border-emerald-400 bg-[#0F2420] text-emerald-200';
                      else if (isPicked) borderClass = 'border-rose-400 bg-[#27121A] text-rose-200';
                      else borderClass = 'border-line bg-space text-muted opacity-65';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-left font-sans text-sm transition-colors ${borderClass}`}
                      >
                        <span className="mr-2 font-mono text-xs font-bold opacity-75">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div className="rounded-xl border border-line bg-space p-3">
                    <div
                      className={`font-display text-xs font-bold uppercase tracking-wider ${
                        selectedOpt === currentQ.correctIndex ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {selectedOpt === currentQ.correctIndex
                        ? `Correct! ${alreadyCompleted ? '' : `+${COINS_PER_CORRECT} Coins`}`
                        : 'Good try — here is the science:'}
                    </div>
                    <p className="mt-1 font-sans text-xs leading-relaxed text-muted">{currentQ.explanation}</p>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="mt-3 w-full rounded-lg px-4 py-2 font-sans text-sm font-bold text-space transition-opacity hover:opacity-90"
                      style={{ backgroundColor: accentColor }}
                    >
                      {qIndex + 1 < questions.length ? 'Next Question →' : 'Finish & Claim Rewards'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-4 rounded-xl border border-line bg-space p-4 text-center">
                <div className="font-mono text-3xl font-bold text-ink">
                  {correctCount} / {questions.length}
                </div>
                <p className="font-sans text-sm text-muted">
                  You’ve logged <strong className="text-ink">{hardware.shortName}</strong> as{' '}
                  <strong className="text-emerald-400">Discovered ✓</strong>!
                </p>

                <div className="rounded-lg border border-line bg-card px-3 py-2.5 font-mono text-sm">
                  {alreadyCompleted ? (
                    <span className="text-muted">Quiz already completed earlier — replay score recorded!</span>
                  ) : (
                    <span className="text-sun-light">+{potentialCoins} Cosmic Coins added to your balance!</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-lg px-4 py-2.5 font-sans text-sm font-bold text-space transition-opacity hover:opacity-90"
                  style={{ backgroundColor: accentColor }}
                >
                  Return to Mission Dossier
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
