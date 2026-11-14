/**
 * Lightweight zero-dependency Web Audio API sound synthesizer for mission-control UI.
 * All audio calls are wrapped in try/catch for browser autoplay policy safety.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

function getContext(): AudioContext | null {
  if (!soundEnabled || typeof window === 'undefined') return null;
  try {
    const AudioCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return null;
    if (!audioCtx) {
      audioCtx = new AudioCtor();
    }
    if (audioCtx.state === 'suspended') {
      void audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/** Crisp, subtle UI tap/blip for buttons, planet selection, and navigation tabs. */
export function playClick(): void {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(640, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.045);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.055);
  } catch {
    // Ignore audio playback errors
  }
}

/** Classic space telemetry sonar ping for "Ping the Hardware". */
export function playPing(): void {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();
    const overtoneGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(988, now);
    osc.frequency.exponentialRampToValueAtTime(960, now + 0.36);

    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(1976, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.085, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    overtoneGain.gain.setValueAtTime(0.025, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    gain.connect(ctx.destination);
    overtoneGain.connect(ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 0.4);
    overtone.stop(now + 0.18);
  } catch {
    // Ignore audio playback errors
  }
}

/** Cheerful ascending chime for Blueprint Verified, Quiz Passed, Mini-Game Win, and Avatar Purchased. */
export function playSuccess(): void {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const start = now + i * 0.075;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.08, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.24);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.26);
    });
  } catch {
    // Ignore audio playback errors
  }
}

/** Gentle, soft low tone for Blueprint Failure Test or Wrong Quiz Answer. */
export function playError(): void {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(155, now + 0.22);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.075, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch {
    // Ignore audio playback errors
  }
}

/** Crisp camera shutter click for Pancam / Ingenuity / Kepler Photo Captures. */
export function playShutter(): void {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;

    // Short filtered noise burst for shutter curtain
    const bufferSize = Math.floor(ctx.sampleRate * 0.04);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.setValueAtTime(1.2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.14, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // Subtle mechanical latch click
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now + 0.01);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

    oscGain.gain.setValueAtTime(0.07, now + 0.01);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now + 0.01);
    osc.stop(now + 0.05);
  } catch {
    // Ignore audio playback errors
  }
}
