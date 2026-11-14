interface MiniGameResultOverlayProps {
  status: 'won' | 'lost';
  title: string;
  summary: string;
  accentColor: string;
  alreadyCompleted: boolean;
  onRetry: () => void;
  onBackToHub: () => void;
}

export function MiniGameResultOverlay({
  status,
  title,
  summary,
  accentColor,
  alreadyCompleted,
  onRetry,
  onBackToHub,
}: MiniGameResultOverlayProps) {
  const won = status === 'won';

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#070A12]/90 p-4">
      <div className="panel w-full max-w-md rounded-xl border p-6 text-center">
        <div
          className={`mx-auto inline-flex rounded-md border px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider ${
            won
              ? 'border-emerald-400/50 bg-[#0F2420] text-emerald-300'
              : 'border-rose-400/50 bg-[#261116] text-rose-300'
          }`}
        >
          {won ? 'MISSION ACCOMPLISHED' : 'SIMULATION FAILED'}
        </div>

        <h4 className="mt-3 font-display text-2xl font-bold text-ink">{title}</h4>
        <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{summary}</p>

        {won && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-400/40 bg-[#1B160C] px-3.5 py-1.5 font-mono text-xs font-bold text-sun-light">
            {alreadyCompleted
              ? '+25 Cosmic Coins (Replay Bonus!)'
              : '+50 Cosmic Coins (First Clear Bonus!)'}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg px-4 py-2 font-sans text-sm font-bold text-space transition-opacity hover:opacity-90"
            style={{ backgroundColor: accentColor }}
          >
            {won ? 'Play Again' : 'Retry'}
          </button>
          <button
            type="button"
            onClick={onBackToHub}
            className="rounded-lg border border-line-strong bg-[#0E1320] px-4 py-2 font-sans text-sm font-bold text-ink transition-colors hover:border-ink"
          >
            ← Back to Hub
          </button>
        </div>
      </div>
    </div>
  );
}
