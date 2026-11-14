import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  avatarFrames,
  avatars,
  getMissionRank,
  type Avatar,
  type AvatarFrame,
} from '../data/avatars';
import { AvatarIcon } from './icons/AvatarIcon';
import { playClick, playError, playSuccess } from '../utils/soundEffects';

interface AvatarShopModalProps {
  open: boolean;
  coins: number;
  currentAvatarId: string;
  unlockedAvatarIds: string[];
  activeFrameId: string;
  unlockedFrameIds: string[];
  explorerName: string;
  discoveredCount: number;
  onSelectAvatar: (avatar: Avatar) => void;
  onSelectFrame: (frame: AvatarFrame) => void;
  onChangeExplorerName: (name: string) => void;
  onClose: () => void;
}

export function AvatarShopModal({
  open,
  coins,
  currentAvatarId,
  unlockedAvatarIds,
  activeFrameId,
  unlockedFrameIds,
  explorerName,
  discoveredCount,
  onSelectAvatar,
  onSelectFrame,
  onChangeExplorerName,
  onClose,
}: AvatarShopModalProps) {
  const [tab, setTab] = useState<'avatars' | 'frames'>('avatars');
  const [toast, setToast] = useState<{ kind: 'success' | 'warn'; text: string } | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const activeAvatar = avatars.find((a) => a.id === currentAvatarId) ?? avatars[0];
  const activeFrame = avatarFrames.find((f) => f.id === activeFrameId) ?? avatarFrames[0];
  const missionRank = getMissionRank(discoveredCount);

  const showToast = (kind: 'success' | 'warn', text: string) => {
    setToast({ kind, text });
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2400);
  };

  useEffect(() => {
    if (!open) {
      setToast(null);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleAvatarClick = (a: Avatar) => {
    const owned = unlockedAvatarIds.includes(a.id) || a.cost === 0;
    if (owned) {
      playClick();
      onSelectAvatar(a);
      showToast('success', `${a.name} Equipped! ✓`);
      return;
    }
    if (coins >= a.cost) {
      playSuccess();
      onSelectAvatar(a);
      showToast('success', 'Unlocked & Equipped! ✓');
    } else {
      playError();
      showToast('warn', `Need ${a.cost - coins} more Cosmic Coins`);
    }
  };

  const handleFrameClick = (f: AvatarFrame) => {
    const owned = unlockedFrameIds.includes(f.id) || f.cost === 0;
    if (owned) {
      playClick();
      onSelectFrame(f);
      showToast('success', `${f.name} Frame Equipped! ✓`);
      return;
    }
    if (coins >= f.cost) {
      playSuccess();
      onSelectFrame(f);
      showToast('success', 'Unlocked & Equipped! ✓');
    } else {
      playError();
      showToast('warn', `Need ${f.cost - coins} more Cosmic Coins`);
    }
  };

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
            aria-label="Avatar & Explorer Profile Shop"
            className="panel max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl p-5"
            initial={{ y: 20, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 14, scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-ink">Explorer Profile & Avatar Shop</h2>
                <p className="mt-0.5 font-sans text-xs text-muted">
                  Customize your NASA callsign, mission emblem, and HUD frame
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close shop"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-card font-sans text-sm text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                ✕
              </button>
            </div>

            {/* Live Explorer Profile Card */}
            <div className="mt-4 flex flex-wrap items-center gap-3.5 rounded-xl border border-line-strong bg-[#0E1320] p-3.5">
              <AvatarIcon
                id={activeAvatar.id}
                size={60}
                frameColor={activeFrame.borderColor}
                frameBg={activeFrame.bgColor}
                className="shrink-0"
              />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded border border-sky-400/50 bg-[#0F2233] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-sky-300">
                    {missionRank}
                  </span>
                  <span className="font-mono text-xs font-bold text-sun-light">{coins} Cosmic Coins</span>
                </div>
                <label className="block">
                  <span className="sr-only">Explorer Callsign</span>
                  <input
                    type="text"
                    maxLength={24}
                    value={explorerName}
                    onChange={(e) => onChangeExplorerName(e.target.value)}
                    onBlur={() => {
                      if (!explorerName.trim()) onChangeExplorerName('Explorer Nova');
                    }}
                    placeholder="Explorer Nova"
                    className="w-full rounded-lg border border-line bg-[#070A12] px-2.5 py-1.5 font-display text-sm font-semibold text-ink placeholder:text-muted focus:border-deep focus:outline-none"
                  />
                </label>
              </div>
            </div>

            {/* Toast Feedback */}
            {toast && (
              <div
                role="status"
                className={`mt-3 rounded-lg border px-3 py-2 text-center font-sans text-xs font-bold ${
                  toast.kind === 'success'
                    ? 'border-emerald-400/60 bg-[#0F2420] text-emerald-300'
                    : 'border-amber-400/60 bg-[#241A0E] text-amber-300'
                }`}
              >
                {toast.text}
              </div>
            )}

            {/* Tabs */}
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-line bg-[#070A12] p-1">
              <button
                type="button"
                onClick={() => setTab('avatars')}
                className={`rounded-lg py-2 font-sans text-xs font-bold transition-colors ${
                  tab === 'avatars'
                    ? 'border border-line-strong bg-[#151C2E] text-ink'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Avatars ({avatars.length})
              </button>
              <button
                type="button"
                onClick={() => setTab('frames')}
                className={`rounded-lg py-2 font-sans text-xs font-bold transition-colors ${
                  tab === 'frames'
                    ? 'border border-line-strong bg-[#151C2E] text-ink'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Badge Frames ({avatarFrames.length})
              </button>
            </div>

            {/* Tab Content */}
            {tab === 'avatars' ? (
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {avatars.map((a) => {
                  const owned = unlockedAvatarIds.includes(a.id) || a.cost === 0;
                  const equipped = a.id === currentAvatarId;
                  const canAfford = coins >= a.cost;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      aria-disabled={!owned && !canAfford}
                      onClick={() => handleAvatarClick(a)}
                      className={`relative flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-colors ${
                        equipped
                          ? 'border-deep bg-[#151C2E]'
                          : owned
                            ? 'border-line bg-card hover:border-line-strong'
                            : canAfford
                              ? 'border-amber-400/40 bg-[#121624] hover:border-amber-400'
                              : 'cursor-not-allowed border-line bg-space opacity-60'
                      }`}
                    >
                      <AvatarIcon
                        id={a.id}
                        size={44}
                        tile={false}
                      />
                      <span className="font-sans text-[11px] font-bold leading-tight text-ink">{a.name}</span>
                      <span
                        className={`font-mono text-[10px] font-semibold ${
                          equipped
                            ? 'text-deep'
                            : owned
                              ? 'text-emerald-300'
                              : canAfford
                                ? 'text-sun-light'
                                : 'text-amber-400'
                        }`}
                      >
                        {equipped
                          ? 'Equipped'
                          : owned
                            ? 'Owned'
                            : canAfford
                              ? `${a.cost} Coins`
                              : `Need ${a.cost - coins} more`}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {avatarFrames.map((f) => {
                  const owned = unlockedFrameIds.includes(f.id) || f.cost === 0;
                  const equipped = f.id === activeFrameId;
                  const canAfford = coins >= f.cost;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      aria-disabled={!owned && !canAfford}
                      onClick={() => handleFrameClick(f)}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                        equipped
                          ? 'border-deep bg-[#151C2E]'
                          : owned
                            ? 'border-line bg-card hover:border-line-strong'
                            : canAfford
                              ? 'border-amber-400/40 bg-[#121624] hover:border-amber-400'
                              : 'cursor-not-allowed border-line bg-space opacity-60'
                      }`}
                    >
                      <AvatarIcon
                        id={activeAvatar.id}
                        size={42}
                        frameColor={f.borderColor}
                        frameBg={f.bgColor}
                        className="shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="truncate font-sans text-xs font-bold text-ink">{f.name}</div>
                        <div
                          className={`mt-0.5 font-mono text-[11px] font-semibold ${
                            equipped
                              ? 'text-deep'
                              : owned
                                ? 'text-emerald-300'
                                : canAfford
                                  ? 'text-sun-light'
                                  : 'text-amber-400'
                          }`}
                        >
                          {equipped
                            ? 'Equipped'
                            : owned
                              ? 'Owned'
                              : canAfford
                                ? `${f.cost} Coins`
                                : `Need ${f.cost - coins} more`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-4 rounded-xl border border-dashed border-line-strong bg-card p-3 font-sans text-xs text-muted">
              Earn Cosmic Coins by completing NASA mini-games, verifying blueprints, and passing mission quizzes!
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
