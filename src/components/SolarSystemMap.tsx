import { AnimatePresence, motion } from 'framer-motion';
import { memo, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { destinations, type Destination, type DestinationId } from '../data/destinationsData';
import { useElementSize } from '../hooks/useElementSize';
import { clamp, computeLayout, type MapLayout } from '../utils/layout';
import { DestinationPreviewCard } from './DestinationPreviewCard';
import { PlanetButton } from './PlanetButton';

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface SolarSystemMapProps {
  highlightId: DestinationId | null;
  onSelect: (id: DestinationId) => void;
}

const rootBodies = destinations.filter((d) => !d.position.parentId);
const moonsOf = (id: DestinationId) => destinations.filter((d) => d.position.parentId === id);

export const SolarSystemMap = memo(function SolarSystemMap({ highlightId, onSelect }: SolarSystemMapProps) {
  const [containerRef, { width, height }] = useElementSize<HTMLDivElement>();
  const [preview, setPreview] = useState<{ dest: Destination; rect: Rect } | null>(null);
  const leaveTimer = useRef<number | undefined>(undefined);

  const layout = useMemo(() => (width > 0 && height > 0 ? computeLayout(width, height) : null), [width, height]);

  const cancelLeave = useCallback(() => window.clearTimeout(leaveTimer.current), []);

  const handlePreview = useCallback(
    (dest: Destination, el: HTMLElement) => {
      cancelLeave();
      const c = containerRef.current?.getBoundingClientRect();
      if (!c) return;
      const r = el.getBoundingClientRect();
      setPreview({ dest, rect: { left: r.left - c.left, top: r.top - c.top, width: r.width, height: r.height } });
    },
    [cancelLeave, containerRef],
  );

  const handlePreviewEnd = useCallback(() => {
    cancelLeave();
    leaveTimer.current = window.setTimeout(() => setPreview(null), 180);
  }, [cancelLeave]);

  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);
  useEffect(() => setPreview(null), [width, height]);

  const previewId = preview?.dest.id ?? null;

  return (
    <div ref={containerRef} className="relative min-h-[560px] flex-1 overflow-hidden md:min-h-[440px]">
      {/* Tap-away background */}
      <div className="absolute inset-0" onPointerDown={() => setPreview(null)} />

      {layout && (
        <>
          <OrbitRings layout={layout} emphasize={previewId ?? highlightId} />
          <Sun layout={layout} />

          {rootBodies.map((dest) => {
            const { x, y } = layout.place(dest);
            const size = layout.sizeFor(dest);
            const moons = moonsOf(dest.id);
            return (
              <div
                key={dest.id}
                className="absolute h-0 w-0"
                style={{ left: x, top: y, zIndex: previewId === dest.id ? 30 : dest.isActive || moons.length ? 20 : 10 }}
              >
                <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
                  <PlanetButton
                    dest={dest}
                    size={size}
                    isPreviewed={previewId === dest.id}
                    isHighlighted={highlightId === dest.id}
                    compact={layout.mode === 'portrait'}
                    onPreview={handlePreview}
                    onPreviewEnd={handlePreviewEnd}
                    onSelect={onSelect}
                  />
                </div>

                {moons.map((moon) => {
                  const orbitPx = size / 2 + layout.baseSize * (moon.position.moonOrbit ?? 1.6);
                  const paused = previewId === moon.id || highlightId === moon.id;
                  const orbitVars = { '--orbit-dur': '48s', '--orbit-delay': '-34s' } as CSSProperties;
                  return (
                    <div key={moon.id}>
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute rounded-full border border-dashed border-line-strong"
                        style={{ width: orbitPx * 2, height: orbitPx * 2, left: -orbitPx, top: -orbitPx }}
                      />
                      <div className={`orbit-cw absolute left-0 top-0 h-0 w-0 ${paused ? 'is-paused' : ''}`} style={orbitVars}>
                        <div className="absolute left-0 top-0 h-0 w-0" style={{ transform: `translateX(${orbitPx}px)` }}>
                          <div className={`orbit-ccw h-0 w-0 ${paused ? 'is-paused' : ''}`} style={orbitVars}>
                            <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
                              <PlanetButton
                                dest={moon}
                                size={layout.sizeFor(moon)}
                                isPreviewed={previewId === moon.id}
                                isHighlighted={highlightId === moon.id}
                                compact={layout.mode === 'portrait'}
                                onPreview={handlePreview}
                                onPreviewEnd={handlePreviewEnd}
                                onSelect={onSelect}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <AnimatePresence>
            {preview && (
              <DestinationPreviewCard
                key={preview.dest.id}
                dest={preview.dest}
                style={cardPosition(preview.rect, layout, preview.dest.isActive)}
                onSelect={onSelect}
                onMouseEnter={cancelLeave}
                onMouseLeave={handlePreviewEnd}
              />
            )}
          </AnimatePresence>
        </>
      )}

      {/* Flat hint chip */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 md:bottom-4">
        <div className="panel whitespace-nowrap rounded-full px-3.5 py-1.5 font-sans text-xs font-semibold text-ink">
          Select an active destination to begin scanning
        </div>
      </div>
    </div>
  );
});

function cardPosition(a: Rect, layout: MapLayout, active: boolean): CSSProperties {
  const { width: w, height: h, mode } = layout;
  const cardW = Math.min(300, w - 16);
  const cardH = active ? 290 : 150;
  const cx = a.left + a.width / 2;
  const cy = a.top + a.height / 2;

  if (mode === 'portrait') {
    const left = clamp(cx - cardW / 2, 8, w - cardW - 8);
    const below = cy < h * 0.5;
    const top = below
      ? clamp(a.top + a.height + 14, 8, h - cardH - 8)
      : clamp(a.top - cardH - 14, 8, h - cardH - 8);
    return { left, top, width: cardW };
  }

  const placeLeft = cx > w * 0.6;
  const left = placeLeft ? a.left - cardW - 18 : a.left + a.width + 18;
  return {
    left: clamp(left, 8, w - cardW - 8),
    top: clamp(cy - cardH / 2, 8, h - cardH - 8),
    width: cardW,
  };
}

const OrbitRings = memo(function OrbitRings({
  layout,
  emphasize,
}: {
  layout: MapLayout;
  emphasize: DestinationId | null;
}) {
  const { width, height, sun, maxR, baseSize } = layout;
  const emphasizeOrbit = emphasize === 'moon' ? 'earth' : emphasize;

  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0" width={width} height={height}>
      {/* Crisp Kuiper Belt icy-asteroid arc */}
      <circle
        cx={sun.x}
        cy={sun.y}
        r={maxR - baseSize * 0.45}
        fill="none"
        stroke="#8EA2FF"
        strokeOpacity="0.35"
        strokeWidth={1.5}
        strokeDasharray="2 10"
        strokeLinecap="round"
      />
      <circle
        cx={sun.x}
        cy={sun.y}
        r={maxR + baseSize * 0.45}
        fill="none"
        stroke="#475569"
        strokeOpacity="0.45"
        strokeWidth={1.25}
        strokeDasharray="1.5 14"
        strokeLinecap="round"
      />

      {destinations
        .filter((d) => !d.position.parentId && d.visual !== 'deepspace')
        .map((d) => {
          const r = layout.radiusFor(d.orbitRadius);
          const isActiveOrbit = d.id === 'mars' || d.id === 'earth';
          const lit = emphasizeOrbit === d.id;
          const stroke = lit ? d.color : isActiveOrbit ? (d.id === 'mars' ? '#E4572E' : '#60A5FA') : '#232B42';
          const opacity = lit ? 0.9 : isActiveOrbit ? 0.45 : 0.75;
          return (
            <circle
              key={d.id}
              cx={sun.x}
              cy={sun.y}
              r={r}
              fill="none"
              stroke={stroke}
              strokeOpacity={opacity}
              strokeWidth={lit ? 2 : isActiveOrbit ? 1.5 : 1}
              strokeDasharray={isActiveOrbit ? '6 7' : '3 8'}
            />
          );
        })}
    </svg>
  );
});

/**
 * Clean, flat/illustrated Sun in solid warm tones (#F59E0B, #FBBF24)
 * with crisp sunspot details and no outer rings or ray lines.
 */
const Sun = memo(function Sun({ layout }: { layout: MapLayout }) {
  const { sun } = layout;
  const r = sun.r;
  const svgSize = Math.round(r * 2.08);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: sun.x, top: sun.y, width: svgSize, height: svgSize }}
    >
      <svg viewBox="-104 -104 208 208" className="h-full w-full">
        {/* Flat two-tone solar body */}
        <circle cx="0" cy="0" r="100" fill="#F59E0B" />
        <circle cx="-8" cy="-8" r="84" fill="#FBBF24" />

        {/* Crisp sunspots & surface arc */}
        <circle cx="24" cy="-28" r="8" fill="#D97706" />
        <circle cx="38" cy="-16" r="4.5" fill="#D97706" />
        <circle cx="-30" cy="32" r="6" fill="#D97706" />
        <path d="M 18 42 A 46 46 0 0 0 54 14" fill="none" stroke="#FDE68A" strokeWidth="3.5" strokeLinecap="round" />

        {/* Crisp 1px outer rim */}
        <circle cx="0" cy="0" r="100" fill="none" stroke="#FDE68A" strokeOpacity="0.5" strokeWidth="1.5" />
      </svg>
    </div>
  );
});
