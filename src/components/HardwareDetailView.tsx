import { useEffect, useState } from 'react';
import type { Destination } from '../data/destinationsData';
import type { HardwareId, HardwareItem } from '../data/hardwareData';
import { BlueprintLabView } from './BlueprintLabView';
import { ImageLightbox, type LightboxTarget } from './ImageLightbox';
import { LightSpeedPing } from './LightSpeedPing';
import { MiniGameView } from './MiniGameView';
import { MissionQuizModal } from './MissionQuizModal';
import { MissionStoryView } from './MissionStoryView';
import { playClick } from '../utils/soundEffects';

interface HardwareDetailViewProps {
  dest: Destination;
  hardware: HardwareItem;
  isDiscovered: boolean;
  storyCompleted: boolean;
  blueprintVerified: boolean;
  miniGameCompleted: boolean;
  quizCompleted: boolean;
  onMarkDiscovered: (id: HardwareId) => void;
  onCompleteStory: (id: HardwareId) => void;
  onVerifyBlueprint: (id: HardwareId, bonusCoins: number) => void;
  onCompleteMiniGame: (id: HardwareId, coinsEarned: number) => void;
  onCompleteQuiz: (id: HardwareId, coinsEarned: number) => void;
  onBack: () => void;
}

type HubSection = 'hub' | 'story' | 'blueprint' | 'minigame';

export function HardwareDetailView({
  dest,
  hardware,
  isDiscovered,
  storyCompleted,
  blueprintVerified,
  miniGameCompleted,
  quizCompleted,
  onMarkDiscovered,
  onCompleteStory,
  onVerifyBlueprint,
  onCompleteMiniGame,
  onCompleteQuiz,
  onBack,
}: HardwareDetailViewProps) {
  const [section, setSection] = useState<HubSection>('hub');
  const [chaptersRead, setChaptersRead] = useState(storyCompleted ? 4 : 0);
  const [quizOpen, setQuizOpen] = useState(false);
  const [zoomTarget, setZoomTarget] = useState<LightboxTarget | null>(null);

  useEffect(() => {
    setSection('hub');
    setChaptersRead(storyCompleted ? 4 : 0);
    onMarkDiscovered(hardware.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hardware.id, onMarkDiscovered]);

  useEffect(() => {
    if (storyCompleted) {
      setChaptersRead(4);
    }
  }, [storyCompleted]);

  const stats = [
    { label: 'Launch Year', value: hardware.launchYear },
    { label: 'Power Source', value: hardware.powerSource },
    { label: 'Destination', value: hardware.destinationLabel },
    { label: 'Current Status', value: hardware.status },
  ];

  return (
    <section className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-10 pt-3 md:px-8">
      <div className="w-full">
        {section === 'story' && (
          <MissionStoryView
            key="story-view"
            hardware={hardware}
            accentColor={dest.color}
            storyCompleted={storyCompleted}
            onProgressChange={setChaptersRead}
            onCompleteStory={onCompleteStory}
            onOpenQuiz={() => {
              setSection('hub');
              setQuizOpen(true);
            }}
            onBack={() => setSection('hub')}
          />
        )}

        {section === 'blueprint' && (
          <BlueprintLabView
            key="blueprint-view"
            hardware={hardware}
            accentColor={dest.color}
            verified={blueprintVerified}
            onVerifyBlueprint={onVerifyBlueprint}
            onBack={() => setSection('hub')}
          />
        )}

        {section === 'minigame' && (
          <MiniGameView
            key="minigame-view"
            hardware={hardware}
            accentColor={dest.color}
            miniGameCompleted={miniGameCompleted}
            onCompleteMiniGame={onCompleteMiniGame}
            onBack={() => setSection('hub')}
          />
        )}

        {section === 'hub' && (
          <div
            key="hub-view"
            className="mx-auto w-full max-w-[1480px] space-y-5"
          >
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={onBack}
                className="panel rounded-lg px-3.5 py-2 font-sans text-xs font-bold text-ink transition-colors hover:border-line-strong sm:text-sm"
              >
                ← Back to {dest.name}
              </button>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-bold ${
                    isDiscovered
                      ? 'border-emerald-400/50 bg-[#0F2420] text-emerald-300'
                      : 'border-line bg-card text-muted'
                  }`}
                >
                  {isDiscovered ? 'Discovered ✓' : 'Scanning...'}
                </span>
                <a
                  href={hardware.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-line bg-card px-2.5 py-1 font-sans text-xs font-bold text-muted transition-colors hover:border-line-strong hover:text-ink"
                >
                  Explore Official NASA Mission ↗
                </a>
              </div>
            </div>

            {/* Hardware Title + Schematic Preview */}
            <div className="panel grid gap-4 rounded-xl p-4 md:grid-cols-[1.35fr_0.95fr] md:items-center">
              <div>
                <span
                  className="inline-block rounded border px-2 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: '#101522', color: dest.color, borderColor: `${dest.color}55` }}
                >
                  Stop {dest.stop} · Hardware Mission Hub
                </span>
                <h2 className="mt-1.5 font-display text-2xl font-bold leading-tight text-ink md:text-3xl">
                  {hardware.name}
                </h2>
                <p className="mt-1 font-sans text-sm leading-relaxed text-muted">{hardware.tagline}</p>

                {/* Compact Mission Stats Strip */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {stats.map((s) => (
                    <div key={s.label} className="rounded-lg border border-line bg-space px-3 py-2">
                      <div className="font-sans text-[10px] font-bold uppercase tracking-wider text-muted">
                        {s.label}
                      </div>
                      <div className="mt-0.5 font-display text-xs font-bold text-ink sm:text-sm">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                role="button"
                tabIndex={0}
                aria-label={`Zoom ${hardware.name}`}
                onClick={() =>
                  setZoomTarget({
                    src: hardware.heroImage,
                    title: hardware.name,
                    subtitle: `Hardware Mission Hub · ${hardware.destinationLabel}`,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomTarget({
                      src: hardware.heroImage,
                      title: hardware.name,
                      subtitle: `Hardware Mission Hub · ${hardware.destinationLabel}`,
                    });
                  }
                }}
                className="relative aspect-[16/10] min-h-[240px] w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-[#0B1020] lg:min-h-[300px]"
              >
                <img
                  src={hardware.heroImage}
                  alt={hardware.name}
                  className="h-full w-full object-contain p-3"
                />
                <span className="pointer-events-none absolute left-2.5 top-2.5 rounded border border-line bg-[#070A12]/90 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-muted">
                  AI GENERATED ILLUSTRATION
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomTarget({
                      src: hardware.heroImage,
                      title: hardware.name,
                      subtitle: `Hardware Mission Hub · ${hardware.destinationLabel}`,
                    });
                  }}
                  className="absolute right-3 top-3 rounded-lg border border-line bg-[#0E1320] px-2.5 py-1 font-sans text-xs font-bold text-ink transition-colors hover:border-line-strong"
                >
                  🔍 Zoom
                </button>
              </div>
            </div>

            {/* Ping the Hardware Simulator Bar */}
            <LightSpeedPing hardware={hardware} accentColor={dest.color} />

            {/* 4-Card 2x2 Mission Hub Grid */}
            <div className="grid gap-3.5 sm:grid-cols-2">
              {/* Card 1: Mission Story */}
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setSection('story');
                }}
                className="panel group flex flex-col justify-between rounded-xl p-4 text-left transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded border border-line bg-space px-2 py-0.5 font-mono text-[11px] font-bold text-muted">
                    CARD 01
                  </span>
                  <span
                    className={`rounded border px-2 py-0.5 font-mono text-[11px] font-bold ${
                      storyCompleted
                        ? 'border-emerald-400/50 bg-[#0F2420] text-emerald-300'
                        : 'border-line bg-space text-ink'
                    }`}
                  >
                    {storyCompleted ? 'Completed ✓' : `${chaptersRead} / 4 Chapters`}
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="font-display text-lg font-bold text-ink group-hover:text-white">
                    Mission Story (Animated + Voice)
                  </h3>
                  <p className="mt-1 font-sans text-sm text-muted">
                    Explore 4 animated chapters from launch to legacy with Voice Mode narration.
                  </p>
                </div>
                <div className="mt-4 font-sans text-xs font-bold" style={{ color: dest.color }}>
                  Open Story Mode →
                </div>
              </button>

              {/* Card 2: Interactive Blueprint Lab */}
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setSection('blueprint');
                }}
                className="panel group flex flex-col justify-between rounded-xl p-4 text-left transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded border border-line bg-space px-2 py-0.5 font-mono text-[11px] font-bold text-muted">
                    CARD 02
                  </span>
                  <span
                    className={`rounded border px-2 py-0.5 font-mono text-[11px] font-bold ${
                      blueprintVerified
                        ? 'border-emerald-400/50 bg-[#0F2420] text-emerald-300'
                        : 'border-line bg-space text-muted'
                    }`}
                  >
                    {blueprintVerified ? 'Verified ✓' : 'Not Built'}
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="font-display text-lg font-bold text-ink group-hover:text-white">
                    Interactive Blueprint Lab
                  </h3>
                  <p className="mt-1 font-sans text-sm text-muted">
                    Learn NASA’s engineering, then assemble real space parts and run the failure test!
                  </p>
                </div>
                <div className="mt-4 font-sans text-xs font-bold" style={{ color: dest.color }}>
                  Enter Engineering Lab →
                </div>
              </button>

              {/* Card 3: Mission Mini-Game */}
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setSection('minigame');
                }}
                className="panel group flex flex-col justify-between rounded-xl p-4 text-left transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded border border-line bg-space px-2 py-0.5 font-mono text-[11px] font-bold text-muted">
                    CARD 03
                  </span>
                  {miniGameCompleted ? (
                    <span className="rounded border border-emerald-400/50 bg-[#0F2420] px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
                      Completed ✓
                    </span>
                  ) : (
                    <span className="rounded border border-sun/50 bg-[#1F190D] px-2 py-0.5 font-mono text-[11px] font-bold text-sun-light">
                      +50 Coins
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="font-display text-lg font-bold text-ink group-hover:text-white">
                    Mission Mini-Game
                  </h3>
                  <p className="mt-1 font-sans text-sm text-muted">{hardware.miniGame.title} — {hardware.miniGame.subtitle}.</p>
                </div>
                <div className="mt-4 font-sans text-xs font-bold" style={{ color: dest.color }}>
                  Open Simulation →
                </div>
              </button>

              {/* Card 4: Mission Quiz (+Coins) — Locked until Story Mode is Completed */}
              <button
                type="button"
                disabled={!storyCompleted}
                onClick={() => storyCompleted && setQuizOpen(true)}
                className={`panel flex flex-col justify-between rounded-xl p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                  storyCompleted
                    ? 'group hover:border-line-strong'
                    : 'cursor-not-allowed opacity-65'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded border border-line bg-space px-2 py-0.5 font-mono text-[11px] font-bold text-muted">
                    CARD 04
                  </span>
                  {!storyCompleted ? (
                    <span className="rounded border border-amber-400/50 bg-[#1F190D] px-2 py-0.5 font-mono text-[11px] font-bold text-sun-light">
                      Locked · Complete Story
                    </span>
                  ) : quizCompleted ? (
                    <span className="rounded border border-emerald-400/50 bg-[#0F2420] px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
                      Completed ✓
                    </span>
                  ) : (
                    <span className="rounded border border-sun/50 bg-[#1F190D] px-2 py-0.5 font-mono text-[11px] font-bold text-sun-light">
                      Unlocked · +100 Coins
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="font-display text-lg font-bold text-ink">Mission Quiz (+Coins)</h3>
                  <p className="mt-1 font-sans text-sm text-muted">
                    {storyCompleted
                      ? 'Answer 3 mission questions to earn Cosmic Coins for the Avatar Shop!'
                      : 'Complete all 4 chapters of Mission Story to unlock this quiz.'}
                  </p>
                </div>
                <div className="mt-4 font-sans text-xs font-bold text-sun-light">
                  {!storyCompleted
                    ? 'Complete Mission Story to Unlock'
                    : quizCompleted
                      ? 'Replay Quiz →'
                      : 'Start Mission Quiz →'}
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      <MissionQuizModal
        open={quizOpen}
        hardware={hardware}
        accentColor={dest.color}
        alreadyCompleted={quizCompleted}
        onCompleteQuiz={onCompleteQuiz}
        onClose={() => setQuizOpen(false)}
      />

      <ImageLightbox target={zoomTarget} onClose={() => setZoomTarget(null)} />
    </section>
  );
}
