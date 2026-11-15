import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { BlueprintOption, FailureCategory, HardwareId, HardwareItem } from '../data/hardwareData';
import { playClick, playError, playSuccess } from '../utils/soundEffects';
import { ImageLightbox, type LightboxTarget } from './ImageLightbox';

interface BlueprintLabViewProps {
  hardware: HardwareItem;
  accentColor: string;
  verified: boolean;
  onVerifyBlueprint: (id: HardwareId, bonusCoins: number) => void;
  onBack: () => void;
}

interface SlotFailure {
  slotId: string;
  slotName: string;
  pickedLabel: string;
  category: FailureCategory;
  reason: string;
}

type TestPhaseState =
  | { status: 'idle' }
  | { status: 'simulating'; primaryCategory: FailureCategory | 'pass' }
  | { status: 'fail'; failures: SlotFailure[]; primaryCategory: FailureCategory }
  | { status: 'pass'; firstTime: boolean };

const BLUEPRINT_BONUS_COINS = 50;

export function BlueprintLabView({
  hardware,
  accentColor,
  verified,
  onVerifyBlueprint,
  onBack,
}: BlueprintLabViewProps) {
  const [phase, setPhase] = useState<'learn' | 'build'>('learn');
  const [activeHotspotId, setActiveHotspotId] = useState(hardware.hotspots[0]?.id ?? '');
  const [inspectedIds, setInspectedIds] = useState<string[]>([hardware.hotspots[0]?.id ?? '']);

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [testState, setTestState] = useState<TestPhaseState>({ status: 'idle' });
  const [zoomTarget, setZoomTarget] = useState<LightboxTarget | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const activeHotspot = hardware.hotspots.find((h) => h.id === activeHotspotId) ?? hardware.hotspots[0];

  const handleInspectHotspot = (id: string) => {
    setActiveHotspotId(id);
    setInspectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handlePickOption = (slotId: string, optionId: string) => {
    if (testState.status === 'simulating') return;
    playClick();
    setSelections((prev) => ({ ...prev, [slotId]: optionId }));
    setTestState({ status: 'idle' });
  };

  const allSlotsFilled = hardware.blueprintSlots.every((slot) => Boolean(selections[slot.id]));

  const handleRunTest = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);

    const failures: SlotFailure[] = [];
    for (const slot of hardware.blueprintSlots) {
      const pickedId = selections[slot.id];
      const picked: BlueprintOption | undefined = slot.options.find((o) => o.id === pickedId);
      if (!picked || !picked.isCorrect) {
        failures.push({
          slotId: slot.id,
          slotName: slot.slotName,
          pickedLabel: picked?.label ?? 'Unknown Part',
          category: picked?.failureCategory ?? 'instability',
          reason: picked?.failureReason ?? 'This component is not engineered for extreme space conditions!',
        });
      }
    }

    const primaryCategory: FailureCategory | 'pass' =
      failures.length > 0 ? failures[0].category : 'pass';

    setTestState({ status: 'simulating', primaryCategory });

    timerRef.current = window.setTimeout(() => {
      if (failures.length > 0) {
        playError();
        setTestState({
          status: 'fail',
          failures,
          primaryCategory: failures[0].category,
        });
      } else {
        playSuccess();
        const firstTime = !verified;
        setTestState({ status: 'pass', firstTime });
        onVerifyBlueprint(hardware.id, firstTime ? BLUEPRINT_BONUS_COINS : 0);
      }
    }, 2300);
  };

  const activeEffect: FailureCategory | 'pass' | null =
    testState.status === 'simulating'
      ? testState.primaryCategory
      : testState.status === 'fail'
        ? testState.primaryCategory
        : testState.status === 'pass'
          ? 'pass'
          : null;

  const viewportMotion =
    activeEffect === 'instability'
      ? { rotate: [0, -3.5, 3.5, -2.5, 2, 0], y: [0, 5, -2, 6, 0] }
      : activeEffect === 'freeze'
        ? { x: [0, -5, 5, -4, 4, 0] }
        : activeEffect === 'blackout'
          ? { opacity: [1, 0.35, 0.5, 0.25] }
          : activeEffect === 'pass'
            ? { scale: [1, 1.02, 1], opacity: 1 }
            : { rotate: 0, x: 0, y: 0, opacity: 1, scale: 1 };

  const failedSlotIds = new Set(testState.status === 'fail' ? testState.failures.map((f) => f.slotId) : []);

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

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPhase('learn')}
            className={`rounded-lg border px-3 py-1.5 font-sans text-xs font-bold transition-colors ${
              phase === 'learn' ? 'bg-[#151C2E] text-ink' : 'border-line bg-card text-muted hover:text-ink'
            }`}
            style={phase === 'learn' ? { borderColor: accentColor } : undefined}
          >
            Phase 1: Learn Blueprint
          </button>
          <button
            type="button"
            onClick={() => setPhase('build')}
            className={`rounded-lg border px-3 py-1.5 font-sans text-xs font-bold transition-colors ${
              phase === 'build' ? 'bg-[#151C2E] text-ink' : 'border-line bg-card text-muted hover:text-ink'
            }`}
            style={phase === 'build' ? { borderColor: accentColor } : undefined}
          >
            Phase 2: Build &amp; Test
          </button>
          <span
            className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-bold ${
              verified
                ? 'border-emerald-400/50 bg-[#0F2420] text-emerald-300'
                : 'border-line bg-card text-muted'
            }`}
          >
            {verified ? 'Verified ✓' : 'Not Built'}
          </span>
        </div>
      </div>

      {phase === 'learn' ? (
        /* ==================== PHASE 1: FULL-WIDTH LEARN THE BLUEPRINT ==================== */
        <div className="panel rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-bold text-ink sm:text-xl">
                Phase 1: Learn the NASA Technical Blueprint
              </h3>
              <p className="font-sans text-xs text-muted sm:text-sm">
                Click any numbered pin ({inspectedIds.length} / {hardware.hotspots.length} inspected) or click the
                spacecraft to zoom in.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPhase('build')}
              className="rounded-lg px-4 py-2 font-sans text-xs font-bold text-space transition-opacity hover:opacity-90 sm:text-sm"
              style={{ backgroundColor: accentColor }}
            >
              Start Assembly Challenge →
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
            {/* ~65% Blueprint Canvas (8 cols) */}
            <div className="lg:col-span-8">
              <div
                role="button"
                tabIndex={0}
                aria-label={`Zoom ${hardware.name} schematic`}
                onClick={() =>
                  setZoomTarget({
                    src: hardware.heroImage,
                    title: hardware.name,
                    subtitle: `NASA Technical Blueprint · ${hardware.destinationLabel}`,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomTarget({
                      src: hardware.heroImage,
                      title: hardware.name,
                      subtitle: `NASA Technical Blueprint · ${hardware.destinationLabel}`,
                    });
                  }
                }}
                className="relative aspect-[16/10] min-h-[300px] w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-[#0B1020] lg:min-h-[480px]"
              >
                <img
                  src={hardware.heroImage}
                  alt={hardware.name}
                  className="h-full w-full object-contain p-4"
                />

                <span className="pointer-events-none absolute left-3 top-3 rounded border border-line bg-[#070A12]/90 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-muted">
                  AI GENERATED ILLUSTRATION
                </span>

                {/* Zoom Corner Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomTarget({
                      src: hardware.heroImage,
                      title: hardware.name,
                      subtitle: `NASA Technical Blueprint · ${hardware.destinationLabel}`,
                    });
                  }}
                  className="absolute right-3 top-3 rounded-lg border border-line bg-[#0E1320] px-2.5 py-1 font-sans text-xs font-bold text-ink transition-colors hover:border-line-strong"
                >
                  🔍 Zoom
                </button>

                {/* Numbered Hotspot Pins (stopPropagation so pins don't trigger zoom) */}
                {hardware.hotspots.map((hs) => {
                  const selected = hs.id === activeHotspot.id;
                  return (
                    <button
                      key={hs.id}
                      type="button"
                      aria-label={`Inspect part ${hs.number}: ${hs.label}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInspectHotspot(hs.id);
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full border-2 font-mono text-xs font-bold transition-transform ${
                        selected ? 'scale-115 text-space' : 'bg-panel text-ink hover:scale-110'
                      }`}
                      style={{
                        left: `${hs.x}%`,
                        top: `${hs.y}%`,
                        borderColor: accentColor,
                        backgroundColor: selected ? accentColor : '#0E1320',
                      }}
                    >
                      {hs.number}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ~35% Parts List + Large Inspection Box (4 cols) */}
            <div className="space-y-3 lg:col-span-4">
              <div className="space-y-2">
                {hardware.hotspots.map((hs) => {
                  const selected = hs.id === activeHotspot.id;
                  const seen = inspectedIds.includes(hs.id);
                  return (
                    <button
                      key={hs.id}
                      type="button"
                      onClick={() => handleInspectHotspot(hs.id)}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-colors ${
                        selected
                          ? 'bg-[#151C2E] text-ink'
                          : 'border-line bg-space text-muted hover:border-line-strong hover:text-ink'
                      }`}
                      style={selected ? { borderColor: accentColor } : undefined}
                    >
                      <span
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-xs font-bold"
                        style={{
                          backgroundColor: selected ? accentColor : '#2F3956',
                          color: selected ? '#070A12' : '#E6E9F2',
                        }}
                      >
                        {hs.number}
                      </span>
                      <span className="font-display text-sm font-bold">{hs.label}</span>
                      {seen && <span className="ml-auto font-mono text-xs text-emerald-400">✓</span>}
                    </button>
                  );
                })}
              </div>

              {/* Part Inspection Box with Click-to-Zoom Thumbnail */}
              <div className="rounded-xl border border-line bg-space p-4 space-y-3">
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() =>
                      setZoomTarget({
                        src: activeHotspot.image,
                        title: activeHotspot.label,
                        subtitle: `Part #${activeHotspot.number} · ${hardware.shortName}`,
                      })
                    }
                    className="group relative h-24 w-24 shrink-0 cursor-zoom-in overflow-hidden rounded-xl border border-line bg-[#0B1020] p-2 transition-colors hover:border-line-strong"
                    title="Click to zoom part image"
                  >
                    <img
                      src={activeHotspot.image}
                      alt={activeHotspot.label}
                      className="h-full w-full object-contain transition-transform group-hover:scale-105"
                    />
                    <span className="absolute left-1 top-1 rounded border border-line bg-[#0E1320]/95 px-1 py-0.5 font-mono text-[9px] font-bold leading-none text-muted">
                      AI
                    </span>
                    <span className="absolute bottom-1 right-1 rounded border border-line bg-[#0E1320] px-1 text-[10px]">
                      🔍
                    </span>
                  </button>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="font-sans text-xs font-bold uppercase tracking-wider"
                        style={{ color: accentColor }}
                      >
                        Part #{activeHotspot.number}
                      </span>
                      <span className="rounded border border-line bg-[#0E1320] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-muted">
                        AI Generated Illustration
                      </span>
                    </div>
                    <div className="mt-0.5 font-display text-base font-bold leading-snug text-ink">
                      {activeHotspot.label}
                    </div>
                  </div>
                </div>
                <p className="font-sans text-sm leading-relaxed text-ink/90">{activeHotspot.fact}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== PHASE 2: FULL-WIDTH BUILD & TEST LAB ==================== */
        <div className="panel rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-bold text-ink sm:text-xl">
                Phase 2: Environment Test Chamber — Build &amp; Test
              </h3>
              <p className="font-sans text-xs text-muted sm:text-sm">
                Choose the real NASA parts (avoid Earth-style decoys!) and click 🔍 on any image to inspect details.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPhase('learn')}
              className="rounded-lg border border-line bg-card px-3 py-1.5 font-sans text-xs font-bold text-muted hover:text-ink"
            >
              ← Review Blueprint
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
            {/* ~55% Environment Test Chamber & Diagnostics (7 cols) */}
            <div className="space-y-3 lg:col-span-7">
              <motion.div
                animate={viewportMotion}
                transition={{ duration: 0.5, repeat: testState.status === 'simulating' ? 3 : 0 }}
                className={`relative aspect-[16/10] min-h-[300px] w-full overflow-hidden rounded-xl border-2 bg-[#0B1020] lg:min-h-[440px] ${
                  testState.status === 'fail'
                    ? 'border-rose-500'
                    : testState.status === 'pass'
                      ? 'border-emerald-400'
                      : testState.status === 'simulating'
                        ? 'border-amber-400'
                        : 'border-line'
                }`}
              >
                {/* Base Spacecraft Silhouette (Click to Zoom) */}
                <img
                  src={hardware.heroImage}
                  alt={hardware.name}
                  onClick={() =>
                    setZoomTarget({
                      src: hardware.heroImage,
                      title: hardware.name,
                      subtitle: 'Environment Test Chamber Reference',
                    })
                  }
                  className={`h-full w-full cursor-zoom-in object-contain p-5 transition-opacity ${
                    testState.status === 'pass' ? 'opacity-100' : 'opacity-25'
                  }`}
                />

                {/* Zoom Corner Button */}
                <button
                  type="button"
                  onClick={() =>
                    setZoomTarget({
                      src: hardware.heroImage,
                      title: hardware.name,
                      subtitle: 'Environment Test Chamber Reference',
                    })
                  }
                  className="absolute right-3 top-3 z-10 rounded-lg border border-line bg-[#0E1320] px-2.5 py-1 font-sans text-xs font-bold text-ink transition-colors hover:border-line-strong"
                >
                  🔍 Zoom
                </button>

                {/* Placed Part Previews inside Slots */}
                {testState.status !== 'pass' &&
                  hardware.blueprintSlots.map((slot, idx) => {
                    const pickedId = selections[slot.id];
                    const picked = slot.options.find((o) => o.id === pickedId);
                    const hasResult = testState.status === 'fail';
                    const isFailed = failedSlotIds.has(slot.id);
                    const slotBorder = hasResult
                      ? isFailed
                        ? 'border-rose-500 bg-[#27121A]/95'
                        : 'border-emerald-400 bg-[#0F2420]/95'
                      : picked
                        ? 'border-deep bg-[#151C2E]/95'
                        : 'border-dashed border-line-strong bg-[#070A12]/90';

                    return (
                      <div
                        key={slot.id}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center rounded-xl border p-2 ${slotBorder}`}
                        style={{ left: `${slot.x}%`, top: `${slot.y}%`, minWidth: '94px', maxWidth: '124px' }}
                      >
                        {picked ? (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setZoomTarget({
                                  src: picked.image,
                                  title: picked.label,
                                  subtitle: `Placed in ${slot.slotName}`,
                                });
                              }}
                              title={`Zoom ${picked.label}`}
                              className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full border border-line bg-[#0E1320] text-[10px] hover:border-line-strong"
                            >
                              🔍
                            </button>
                            <img src={picked.image} alt={picked.label} className="h-14 w-14 object-contain" />
                          </>
                        ) : (
                          <div className="grid h-14 w-14 place-items-center font-mono text-sm text-muted">?</div>
                        )}
                        <span className="mt-1 w-full truncate text-center font-mono text-[10px] font-bold text-ink">
                          {idx + 1}. {picked ? (hasResult ? (isFailed ? 'FAIL' : 'OK ✓') : 'READY') : slot.slotName}
                        </span>
                      </div>
                    );
                  })}

                {/* Live Visual Environment Test Overlays */}
                {activeEffect === 'freeze' && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between border-4 border-sky-300/60 bg-sky-950/35 p-3">
                    <div className="flex justify-between font-mono text-xs font-bold text-sky-200">
                      <span>CHAMBER TEMP: -170°C</span>
                      <span>CRYOGENIC FROST DETECTED</span>
                    </div>
                    <div className="flex justify-between font-mono text-xs font-bold text-sky-200">
                      <span>VACUUM: 0 kPa</span>
                      <span>MATERIAL FRACTURE</span>
                    </div>
                  </div>
                )}

                {activeEffect === 'no-oxygen' && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-amber-950/40 p-3">
                    <div className="flex justify-between font-mono text-xs font-bold text-amber-200">
                      <span>O₂ LEVEL: 0.00%</span>
                      <span className="rounded bg-rose-600 px-2 py-0.5 text-white">NO O₂ DETECTED</span>
                    </div>
                    <div className="text-center font-mono text-xs font-bold text-rose-200">
                      COMBUSTION FAILED · POWER OUTPUT: 0%
                    </div>
                  </div>
                )}

                {activeEffect === 'instability' && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-rose-950/30 p-3">
                    <div className="flex justify-between font-mono text-xs font-bold text-rose-200">
                      <span>STABILITY: CRITICAL</span>
                      <span className="rounded bg-rose-600 px-2 py-0.5 text-white">INSUFFICIENT LIFT / OVERWEIGHT</span>
                    </div>
                    <div className="text-center font-mono text-xs font-bold text-amber-200">
                      STRUCTURAL / MOBILITY FAILURE
                    </div>
                  </div>
                )}

                {activeEffect === 'blackout' && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-[#030408]/75 p-3">
                    <div className="flex justify-between font-mono text-xs font-bold text-rose-300">
                      <span>SOLAR / SIGNAL INPUT: 0.1%</span>
                      <span>POWER BLACKOUT</span>
                    </div>
                    <div className="text-center font-mono text-xs font-bold text-slate-300">
                      SYSTEM FROZEN — NO TELEMETRY
                    </div>
                  </div>
                )}

                {activeEffect === 'pass' && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="scan-sweep h-10 w-full border-y-2 border-emerald-400 bg-emerald-400/15" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded border border-emerald-400/60 bg-[#0F2420]/95 px-3 py-1.5 font-mono text-xs font-bold text-emerald-300">
                      <span>ENVIRONMENT TEST: PASS</span>
                      <span>ALL SYSTEMS NOMINAL ✓</span>
                    </div>
                  </div>
                )}
              </motion.div>

              <button
                type="button"
                disabled={!allSlotsFilled || testState.status === 'simulating'}
                onClick={handleRunTest}
                className="w-full rounded-lg px-4 py-3 font-sans text-sm font-bold text-space transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
                style={{ backgroundColor: accentColor }}
              >
                {testState.status === 'simulating'
                  ? 'Running Space Environment Test...'
                  : allSlotsFilled
                    ? 'Run Engineering Test'
                    : 'Fill All 3 Component Slots to Test'}
              </button>

              {/* Multi-Error Diagnostic Cards */}
              {testState.status === 'fail' && (
                <div className="space-y-2">
                  <div className="font-display text-xs font-bold uppercase tracking-wider text-rose-300">
                    {testState.failures.length} Engineering{' '}
                    {testState.failures.length === 1 ? 'Failure' : 'Failures'} Detected:
                  </div>
                  {testState.failures.map((f, idx) => (
                    <div key={f.slotId} className="rounded-xl border border-rose-500/70 bg-[#27121A] p-3.5">
                      <div className="font-display text-xs font-bold uppercase tracking-wider text-rose-300">
                        Failure {idx + 1}: {f.slotName} ({f.pickedLabel})
                      </div>
                      <p className="mt-1 font-sans text-sm leading-relaxed text-rose-100">{f.reason}</p>
                    </div>
                  ))}
                </div>
              )}

              {testState.status === 'pass' && (
                <div className="rounded-xl border border-emerald-400/70 bg-[#0F2420] p-4">
                  <div className="font-display text-sm font-bold uppercase tracking-wider text-emerald-300">
                    ALL SYSTEMS NOMINAL ✓
                  </div>
                  <p className="mt-1 font-sans text-sm text-emerald-100">
                    Every NASA component passed extreme space testing!
                    {testState.firstTime && (
                      <strong className="ml-1 font-mono text-sun-light">+{BLUEPRINT_BONUS_COINS} Cosmic Coins!</strong>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* ~45% 3 Slot Part Selector Cards with Large Thumbnails & Zoom Icons (5 cols) */}
            <div className="space-y-3 lg:col-span-5">
              {hardware.blueprintSlots.map((slot, idx) => {
                const isSlotFailed = failedSlotIds.has(slot.id);
                const isSlotPassed = testState.status === 'fail' && !isSlotFailed;
                return (
                  <div
                    key={slot.id}
                    className={`rounded-xl border bg-space p-3.5 ${
                      isSlotFailed
                        ? 'border-rose-500'
                        : isSlotPassed || testState.status === 'pass'
                          ? 'border-emerald-400/60'
                          : 'border-line'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-display text-xs font-bold uppercase tracking-wider text-muted sm:text-sm">
                        Slot {idx + 1}: <span className="text-ink">{slot.slotName}</span>
                      </div>
                      {isSlotFailed && (
                        <span className="font-mono text-xs font-bold text-rose-400">FAILED ✕</span>
                      )}
                      {(isSlotPassed || testState.status === 'pass') && (
                        <span className="font-mono text-xs font-bold text-emerald-400">VERIFIED ✓</span>
                      )}
                    </div>

                    <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                      {slot.options.map((opt) => {
                        const picked = selections[slot.id] === opt.id;
                        return (
                          <div
                            key={opt.id}
                            role="button"
                            tabIndex={0}
                            aria-pressed={picked}
                            onClick={() => handlePickOption(slot.id, opt.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handlePickOption(slot.id, opt.id);
                              }
                            }}
                            className={`relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-2.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                              picked
                                ? 'bg-[#151C2E] text-ink'
                                : 'border-line bg-card text-muted hover:border-line-strong hover:text-ink'
                            } ${testState.status === 'simulating' ? 'pointer-events-none opacity-65' : ''}`}
                            style={picked ? { borderColor: accentColor } : undefined}
                          >
                            {/* Top-right Zoom Icon Button */}
                            <button
                              type="button"
                              aria-label={`Zoom ${opt.label}`}
                              title={`Zoom ${opt.label}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setZoomTarget({
                                  src: opt.image,
                                  title: opt.label,
                                  subtitle: `${slot.slotName} · Candidate Component`,
                                });
                              }}
                              className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-md border border-line bg-[#0E1320] text-xs hover:border-line-strong"
                            >
                              🔍
                            </button>

                            <div className="h-20 w-20 overflow-hidden rounded-lg bg-[#0B1020] p-1.5 sm:h-24 sm:w-24">
                              <img src={opt.image} alt={opt.label} className="h-full w-full object-contain" />
                            </div>
                            <span className="font-sans text-xs font-bold leading-tight">{opt.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <ImageLightbox target={zoomTarget} onClose={() => setZoomTarget(null)} />
    </div>
  );
}
