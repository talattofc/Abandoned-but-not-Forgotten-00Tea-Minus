import { motion } from 'framer-motion';
import { memo } from 'react';
import { getMissionRank, type Avatar, type AvatarFrame } from '../data/avatars';
import { AvatarIcon } from './icons/AvatarIcon';

interface TopHUDProps {
  explorerName: string;
  avatar: Avatar;
  frame: AvatarFrame;
  coins: number;
  discovered: number;
  total: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenShop: () => void;
}

export const TopHUD = memo(function TopHUD({
  explorerName,
  avatar,
  frame,
  coins,
  discovered,
  total,
  soundEnabled,
  onToggleSound,
  onOpenShop,
}: TopHUDProps) {
  const pct = total > 0 ? (discovered / total) * 100 : 0;
  const rank = getMissionRank(discovered);

  return (
    <header className="relative z-30 px-3 pt-3 md:px-6 md:pt-4">
      <div className="panel flex items-center justify-between gap-3 rounded-xl px-3 py-2 md:px-5 md:py-2.5">
        {/* Left: Nebula logo + Updated Branding */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-line-strong bg-space">
            <img
              src="/images/nebula.jpg"
              alt="00Tea-Minus Nebula Emblem"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-sm font-bold leading-tight tracking-wide text-ink sm:text-base md:text-lg">
              Abandoned but not Forgotten
            </h1>
            <p className="truncate font-sans text-xs text-muted">00Tea-Minus</p>
          </div>
        </div>

        {/* Right: Explorer panel */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onOpenShop}
            className="flex items-center gap-2 rounded-lg p-1 text-left transition-colors hover:bg-card"
            title={`${explorerName || 'Explorer Nova'} • ${rank}`}
          >
            <AvatarIcon
              id={avatar.id}
              size={38}
              frameColor={frame.borderColor}
              frameBg={frame.bgColor}
              className="shrink-0"
            />
            <div className="hidden leading-tight lg:block">
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-300">{rank}</div>
              <div className="max-w-[130px] truncate font-display text-sm font-semibold text-ink">
                {explorerName.trim() || 'Explorer Nova'}
              </div>
            </div>
          </button>

          <div
            className="flex items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 py-1.5"
            title="Cosmic Coins"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
              <circle cx="12" cy="12" r="10" fill="#F59E0B" />
              <circle cx="12" cy="12" r="7" fill="#FBBF24" />
              <polygon points="12,7 13.5,10.5 17,11 14.5,13.5 15,17 12,15 9,17 9.5,13.5 7,11 10.5,10.5" fill="#0E1320" />
            </svg>
            <motion.span
              key={coins}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="font-mono text-sm font-bold tabular-nums text-sun-light"
            >
              {coins}
            </motion.span>
            <span className="hidden font-sans text-xs text-muted xl:inline">Cosmic Coins</span>
          </div>

          <button
            type="button"
            onClick={onOpenShop}
            className="flex items-center gap-1.5 rounded-lg border border-line-strong bg-card px-2.5 py-1.5 font-sans text-xs font-bold text-ink transition-colors hover:border-deep hover:text-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep sm:text-sm"
            aria-label="Open Avatar Shop"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 7h12l1 13H5L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <span className="hidden md:inline">Avatar Shop</span>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
            title={soundEnabled ? 'Sound Effects: On' : 'Sound Effects: Muted'}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 font-sans text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep sm:text-sm ${
              soundEnabled
                ? 'border-line-strong bg-card text-ink hover:border-deep hover:text-deep'
                : 'border-line bg-space text-muted hover:border-line-strong hover:text-ink'
            }`}
          >
            <span aria-hidden="true">{soundEnabled ? '🔊' : '🔇'}</span>
            <span className="hidden xl:inline">{soundEnabled ? 'SFX On' : 'Muted'}</span>
          </button>

          <div
            className="flex items-center gap-2 rounded-lg border border-line bg-card px-2.5 py-1.5"
            title={`Hardware Discovered: ${discovered} / ${total}`}
          >
            <div className="leading-none">
              <div className="hidden font-sans text-[10px] uppercase tracking-wider text-muted md:block">
                Hardware Discovered
              </div>
              <div className="font-mono text-sm font-bold tabular-nums text-ink">
                {discovered} / {total}
              </div>
            </div>
            <div className="hidden h-1.5 w-14 overflow-hidden rounded-full bg-space md:block">
              <div className="h-full rounded-full bg-deep" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});
