import type { Destination } from '../data/destinationsData';

export type MapMode = 'landscape' | 'portrait';

export interface Point {
  x: number;
  y: number;
}

export interface MapLayout {
  mode: MapMode;
  width: number;
  height: number;
  sun: Point & { r: number };
  innerR: number;
  maxR: number;
  baseSize: number;
  radiusFor: (orbitRadius: number) => number;
  place: (dest: Destination) => Point;
  sizeFor: (dest: Destination) => number;
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Computes pixel positions for the map.
 * - landscape (wide screens): Sun is a focal point on the left edge, orbits arc to the right.
 * - portrait (phones): Sun peeks from the top, orbits arc downward.
 */
export function computeLayout(width: number, height: number): MapLayout {
  const mode: MapMode = width < 720 ? 'portrait' : 'landscape';
  const baseSize = clamp(Math.min(width, height) * 0.05, 16, 36);

  let sun: Point & { r: number };
  let maxR: number;
  let spread: number;

  if (mode === 'landscape') {
    const r = clamp(Math.min(height * 0.17, width * 0.09), 50, 130);
    sun = { x: r * 0.15, y: height / 2, r };
    maxR = width - sun.x - Math.max(84, width * 0.07);
    spread = height * 0.36;
  } else {
    const r = clamp(width * 0.17, 44, 90);
    sun = { x: width / 2, y: -r * 0.2, r };
    maxR = height - sun.y - Math.max(84, height * 0.1);
    spread = width * 0.36;
  }

  const innerR = sun.r * 1.45;
  const radiusFor = (n: number) => innerR + (maxR - innerR) * n;

  const place = (dest: Destination): Point => {
    const r = radiusFor(dest.orbitRadius);
    const s = clamp((dest.position.lane * spread) / r, -0.92, 0.92);
    const a = Math.asin(s);
    return mode === 'landscape'
      ? { x: sun.x + r * Math.cos(a), y: sun.y + r * Math.sin(a) }
      : { x: sun.x + r * Math.sin(a), y: sun.y + r * Math.cos(a) };
  };

  const sizeFor = (dest: Destination) => Math.round(baseSize * dest.size);

  return { mode, width, height, sun, innerR, maxR, baseSize, radiusFor, place, sizeFor };
}
