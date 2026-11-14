import { useCallback, useEffect, useRef, useState } from 'react';

interface VoiceNarratorProps {
  text: string;
  chapterKey: string;
  accentColor: string;
  autoAdvance: boolean;
  onToggleAutoAdvance: () => void;
  onChapterEnd: () => void;
  onStatusChange?: (status: SpeechStatus) => void;
}

export type SpeechStatus = 'idle' | 'speaking' | 'paused';

/**
 * Native Web Speech API narrator (window.speechSynthesis).
 * Zero external APIs; picks a clear en-US / en-GB voice at 0.95x pace.
 */
export function VoiceNarrator({
  text,
  chapterKey,
  accentColor,
  autoAdvance,
  onToggleAutoAdvance,
  onChapterEnd,
  onStatusChange,
}: VoiceNarratorProps) {
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const autoRef = useRef(autoAdvance);
  const onEndRef = useRef(onChapterEnd);
  const onStatusRef = useRef(onStatusChange);
  const shouldAutoPlayRef = useRef(false);

  autoRef.current = autoAdvance;
  onEndRef.current = onChapterEnd;
  onStatusRef.current = onStatusChange;

  useEffect(() => {
    onStatusRef.current?.(status);
  }, [status]);

  const stopSpeech = useCallback(() => {
    if (!supported) return;
    try {
      window.speechSynthesis?.cancel();
    } catch {
      // Ignore speech synthesis cancellation errors on unsupported or busy browsers
    }
    setStatus('idle');
  }, [supported]);

  const speakCurrent = useCallback(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = synth.getVoices();
    const preferred =
      voices.find((v) => v.lang.startsWith('en-US') && /natural|google|aria|jenny|samantha/i.test(v.name)) ||
      voices.find((v) => v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')) ||
      voices.find((v) => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setStatus('speaking');
    utterance.onpause = () => setStatus('paused');
    utterance.onresume = () => setStatus('speaking');
    utterance.onend = () => {
      setStatus('idle');
      if (autoRef.current) {
        shouldAutoPlayRef.current = true;
        onEndRef.current();
      }
    };
    utterance.onerror = () => setStatus('idle');

    synth.speak(utterance);
  }, [supported, text]);

  // Cancel any active speech when unmounting or switching chapters manually
  useEffect(() => {
    if (shouldAutoPlayRef.current) {
      shouldAutoPlayRef.current = false;
      speakCurrent();
      return;
    }
    stopSpeech();
  }, [chapterKey, speakCurrent, stopSpeech]);

  useEffect(() => {
    return () => {
      if (!supported) return;
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // Ignore cleanup errors on unmount
      }
    };
  }, [supported]);

  const handlePlayPause = () => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    if (status === 'speaking') {
      synth.pause();
      setStatus('paused');
    } else if (status === 'paused') {
      synth.resume();
      setStatus('speaking');
    } else {
      speakCurrent();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-space px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className="font-display text-xs font-bold uppercase tracking-wider text-ink">
          Voice Mode: Listen to Story
        </span>
        {/* Flat animated waveform bars (GPU transform only) */}
        <div className="flex h-4 items-end gap-0.5" aria-hidden="true">
          {[0.5, 0.9, 0.65, 1, 0.55].map((h, i) => (
            <span
              key={i}
              className={`w-1 rounded-sm transition-transform duration-200 ${
                status === 'speaking' ? 'voice-bar' : ''
              }`}
              style={{
                height: '14px',
                backgroundColor: status === 'speaking' ? accentColor : '#2F3956',
                transform: status === 'speaking' ? undefined : `scaleY(${h * 0.45})`,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>
      </div>

      {!supported ? (
        <span className="font-sans text-xs text-muted">Voice narration is not supported in this browser.</span>
      ) : (
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={handlePlayPause}
            className="rounded-lg px-2.5 py-1 font-sans text-xs font-bold text-space transition-opacity hover:opacity-90"
            style={{ backgroundColor: accentColor }}
          >
            {status === 'speaking' ? '❚❚ Pause' : status === 'paused' ? '▶ Resume' : '▶ Play'}
          </button>
          <button
            type="button"
            onClick={stopSpeech}
            disabled={status === 'idle'}
            className="rounded-lg border border-line bg-card px-2.5 py-1 font-sans text-xs font-bold text-ink transition-colors hover:border-line-strong disabled:cursor-not-allowed disabled:opacity-45"
          >
            ■ Stop
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={autoAdvance}
            onClick={onToggleAutoAdvance}
            className={`rounded-lg border px-2.5 py-1 font-sans text-xs font-bold transition-colors ${
              autoAdvance
                ? 'border-deep bg-[#151C2E] text-deep'
                : 'border-line bg-card text-muted hover:text-ink'
            }`}
          >
            Auto-Read Next: {autoAdvance ? 'ON' : 'OFF'}
          </button>
        </div>
      )}
    </div>
  );
}
