import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import type { HardwareId, HardwareItem } from '../data/hardwareData';
import { StoryStepIcon } from './icons/HardwareIllustration';
import { ImageLightbox, type LightboxTarget } from './ImageLightbox';
import { VoiceNarrator, type SpeechStatus } from './VoiceNarrator';
import { playClick } from '../utils/soundEffects';

interface MissionStoryViewProps {
  hardware: HardwareItem;
  accentColor: string;
  storyCompleted: boolean;
  onProgressChange: (chaptersRead: number) => void;
  onCompleteStory: (id: HardwareId) => void;
  onOpenQuiz: () => void;
  onBack: () => void;
}

export function MissionStoryView({
  hardware,
  accentColor,
  storyCompleted,
  onProgressChange,
  onCompleteStory,
  onOpenQuiz,
  onBack,
}: MissionStoryViewProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(storyCompleted ? 4 : 1);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>('idle');
  const [imgSrc, setImgSrc] = useState(hardware.story[0].chapterImage);
  const [videoFailed, setVideoFailed] = useState(false);
  const [zoomTarget, setZoomTarget] = useState<LightboxTarget | null>(null);

  const chapter = hardware.story[stepIdx];
  const isFinalChapter = stepIdx === hardware.story.length - 1;
  const encodedMediaSrc = encodeURI(chapter.chapterImage);
  const isVideoMedia = chapter.mediaType === 'video' || /\.(mp4|webm|ogv)$/i.test(chapter.chapterImage);
  const isVideoActive = isVideoMedia && !videoFailed;

  useEffect(() => {
    setImgSrc(encodedMediaSrc);
    setVideoFailed(false);
  }, [encodedMediaSrc]);

  useEffect(() => {
    const reached = Math.max(maxStepReached, stepIdx + 1);
    if (reached !== maxStepReached) {
      setMaxStepReached(reached);
    }
    onProgressChange(reached);
    if (stepIdx === hardware.story.length - 1) {
      onCompleteStory(hardware.id);
    }
  }, [stepIdx, maxStepReached, hardware.id, hardware.story.length, onProgressChange, onCompleteStory]);

  const handleChapterEnd = useCallback(() => {
    setStepIdx((prev) => (prev + 1 < hardware.story.length ? prev + 1 : prev));
  }, [hardware.story.length]);

  return (
    <div className="mx-auto w-full max-w-[1480px] space-y-4">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="panel rounded-lg px-3.5 py-2 font-sans text-xs font-bold text-ink transition-colors hover:border-line-strong sm:text-sm"
        >
          ← Back to {hardware.shortName}
        </button>

        <span
          className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-bold ${
            storyCompleted
              ? 'border-emerald-400/50 bg-[#0F2420] text-emerald-300'
              : 'border-line bg-card text-muted'
          }`}
        >
          {storyCompleted ? 'Story Completed ✓' : `Chapter ${stepIdx + 1} / ${hardware.story.length}`}
        </span>
      </div>

      {/* Voice Narration Bar */}
      <VoiceNarrator
        text={`${chapter.title}. ${chapter.text}`}
        chapterKey={`${hardware.id}-${chapter.step}`}
        accentColor={accentColor}
        autoAdvance={autoAdvance}
        onToggleAutoAdvance={() => setAutoAdvance((v) => !v)}
        onChapterEnd={handleChapterEnd}
        onStatusChange={setSpeechStatus}
      />

      {/* 4-Chapter Stepper Tabs */}
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4" role="tablist" aria-label="Story chapters">
        {hardware.story.map((c, idx) => {
          const active = idx === stepIdx;
          return (
            <button
              key={c.step}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                playClick();
                setStepIdx(idx);
              }}
              className={`rounded-lg border px-2.5 py-2 text-left font-sans text-xs font-bold transition-colors ${
                active
                  ? 'bg-[#151C2E] text-ink'
                  : 'border-line bg-card text-muted hover:border-line-strong hover:text-ink'
              }`}
              style={active ? { borderColor: accentColor } : undefined}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* NASA Mission Feed Viewport + Story Text */}
      <motion.div
        key={`${hardware.id}-${chapter.step}`}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.18 }}
        className="panel grid gap-6 rounded-xl p-4 sm:p-6 md:grid-cols-12 md:items-center"
      >
          {/* Cinematic Mission Viewport (7 cols) */}
          <div className="flex flex-col gap-1.5 md:col-span-7">
            <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-[#070A12]">
              {/* Top Telemetry Bar */}
              <div className="flex items-center justify-between gap-2 border-b border-line bg-[#0E1320] px-3.5 py-2 font-mono text-[11px] font-bold">
                <span className="truncate text-ink">
                  CAM-0{chapter.step} // {hardware.shortName.toUpperCase()}
                </span>
                <span
                  className={`shrink-0 rounded border px-2 py-0.5 ${
                    speechStatus === 'speaking'
                      ? 'border-emerald-400/60 bg-[#0F2420] text-emerald-300'
                      : 'border-line bg-space text-muted'
                  }`}
                >
                  {speechStatus === 'speaking' ? '● VOICE SYNC: ACTIVE' : 'MISSION FEED'}
                </span>
              </div>

              {/* Viewport Media (Video or Image with Ken Burns, Hero Fallback & Click-to-Zoom) */}
              {isVideoActive ? (
                <div className="relative aspect-[16/10] min-h-[260px] w-full overflow-hidden bg-[#0B1020] lg:min-h-[420px]">
                  <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-md border border-line bg-[#0E1320] px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-ink">
                    {chapter.mediaBadge}
                  </span>
                  <video
                    key={encodedMediaSrc}
                    src={encodedMediaSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onError={() => {
                      console.error('Story video failed to load:', encodedMediaSrc);
                      setVideoFailed(true);
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Zoom ${hardware.shortName} — ${chapter.title}`}
                  onClick={() =>
                    setZoomTarget({
                      src: imgSrc,
                      title: `${hardware.shortName} — ${chapter.title}`,
                      subtitle: `${chapter.label} · ${hardware.destinationLabel}`,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setZoomTarget({
                        src: imgSrc,
                        title: `${hardware.shortName} — ${chapter.title}`,
                        subtitle: `${chapter.label} · ${hardware.destinationLabel}`,
                      });
                    }
                  }}
                  className="relative aspect-[16/10] min-h-[260px] w-full cursor-zoom-in overflow-hidden bg-[#0B1020] lg:min-h-[420px]"
                >
                  <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-md border border-line bg-[#0E1320] px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-ink">
                    {chapter.mediaBadge}
                  </span>
                  <img
                    key={imgSrc}
                    src={imgSrc}
                    alt={`${hardware.name} — ${chapter.title}`}
                    onError={() => {
                      if (imgSrc !== encodeURI(hardware.heroImage)) {
                        console.error('Story image failed to load:', imgSrc);
                        setImgSrc(encodeURI(hardware.heroImage));
                      }
                    }}
                    className="ken-burns h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomTarget({
                        src: imgSrc,
                        title: `${hardware.shortName} — ${chapter.title}`,
                        subtitle: `${chapter.label} · ${hardware.destinationLabel}`,
                      });
                    }}
                    className="absolute right-3 top-3 z-10 rounded-lg border border-line bg-[#0E1320] px-2.5 py-1 font-sans text-xs font-bold text-ink transition-colors hover:border-line-strong"
                  >
                    🔍 Zoom
                  </button>

                  {chapter.seismographOverlay && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 border-t border-emerald-400/40 bg-[#070A12]/90 px-3 py-1.5">
                      <div className="mb-0.5 flex items-center justify-between font-mono text-[10px] font-bold text-emerald-300">
                        <span>PSE SEISMIC TELEMETRY // LIVE TRACE</span>
                        <span>APOLLO 12 ALSEP</span>
                      </div>
                      <div className="h-6 w-full overflow-hidden">
                        <svg viewBox="0 0 320 24" className="h-full w-full" preserveAspectRatio="none">
                          <motion.g
                            animate={{ x: [0, -80] }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                          >
                            <path
                              d="M0 12 L16 12 L20 5 L24 19 L28 3 L32 21 L36 9 L40 15 L44 12 L80 12 L96 12 L100 5 L104 19 L108 3 L112 21 L116 9 L120 15 L124 12 L160 12 L176 12 L180 5 L184 19 L188 3 L192 21 L196 9 L200 15 L204 12 L240 12 L256 12 L260 5 L264 19 L268 3 L272 21 L276 9 L280 15 L284 12 L320 12 L336 12 L340 5 L344 19 L348 3 L352 21 L356 9 L360 15 L364 12 L400 12"
                              fill="none"
                              stroke="#34D399"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </motion.g>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Telemetry & Caption Bar */}
              <div className="space-y-1 border-t border-line bg-[#0E1320] px-3.5 py-2.5">
                <p className="font-sans text-xs font-medium leading-snug text-ink/90">
                  {chapter.mediaCaption}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted">
                  <span className="truncate">DEST: {hardware.destinationLabel}</span>
                  <span className="truncate" style={{ color: accentColor }}>
                    STATUS: {hardware.status}
                  </span>
                </div>
              </div>
            </div>
            <p className="px-1 font-sans text-[11px] text-muted">
              Media Courtesy of NASA / JPL-Caltech / Ames Research Center.
            </p>
          </div>

          {/* Story Content (5 cols) */}
          <div className="space-y-4 md:col-span-5 md:px-2">
            <div className="flex items-center gap-2.5">
              <StoryStepIcon icon={chapter.icon} color={accentColor} />
              <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                {chapter.label}
              </span>
            </div>
            <h3 className="font-display text-xl font-bold leading-snug text-ink sm:text-2xl">{chapter.title}</h3>
            <p className="font-sans text-base leading-relaxed text-ink/90 sm:text-lg">{chapter.text}</p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href={hardware.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-[#0E1320] px-3 py-1.5 font-sans text-xs font-bold text-ink transition-colors hover:border-line-strong"
              >
                Explore Official NASA Mission ↗
              </a>
              {chapter.extraVideoUrl && (
                <a
                  href={chapter.extraVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/50 bg-[#1B160C] px-3 py-1.5 font-sans text-xs font-bold text-amber-200 transition-colors hover:border-amber-300"
                >
                  {chapter.extraVideoLabel ?? 'Watch Official NASA Video ↗'}
                </a>
              )}
            </div>
          </div>
        </motion.div>

      {/* Prev / Next & Quiz Unlock Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          disabled={stepIdx === 0}
          onClick={() => {
            playClick();
            setStepIdx((i) => Math.max(0, i - 1));
          }}
          className="panel rounded-lg px-4 py-2 font-sans text-xs font-bold text-ink hover:border-line-strong disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
        >
          ← Previous
        </button>

        {isFinalChapter ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-emerald-400/50 bg-[#0F2420] px-3 py-2 font-sans text-xs font-bold text-emerald-300">
              Mission Quiz Unlocked ✓
            </span>
            <button
              type="button"
              onClick={onOpenQuiz}
              className="rounded-lg bg-sun px-4 py-2 font-sans text-xs font-bold text-space transition-opacity hover:opacity-90 sm:text-sm"
            >
              Take Mission Quiz (+Coins) →
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              playClick();
              setStepIdx((i) => Math.min(hardware.story.length - 1, i + 1));
            }}
            className="rounded-lg px-4 py-2 font-sans text-xs font-bold text-space transition-opacity hover:opacity-90 sm:text-sm"
            style={{ backgroundColor: accentColor }}
          >
            Next Chapter →
          </button>
        )}
      </div>
      <ImageLightbox target={zoomTarget} onClose={() => setZoomTarget(null)} />
    </div>
  );
}
