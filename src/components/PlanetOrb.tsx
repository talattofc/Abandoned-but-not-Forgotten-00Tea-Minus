import { memo, useId } from 'react';
import type { Destination } from '../data/destinationsData';

interface PlanetOrbProps {
  dest: Destination;
  size: number;
  dimmed?: boolean;
}

/**
 * Clean, flat-vector illustrated planets, moons, and Deep Space Kuiper marker.
 * Zero gradients, zero blur filters, zero box-shadow glows.
 */
export const PlanetOrb = memo(function PlanetOrb({ dest, size, dimmed = false }: PlanetOrbProps) {
  const clipId = useId();

  if (dest.visual === 'deepspace') {
    return <DeepSpaceMarker size={size} />;
  }

  const { base, detail, shade } = dest.palette;
  const isRinged = dest.visual === 'ringed';
  // Give Saturn extra horizontal room for its flat rings
  const svgW = isRinged ? Math.round(size * 1.95) : size;
  const svgH = size;
  const viewBox = isRinged ? '-48 0 196 100' : '0 0 100 100';

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={viewBox}
      className="block overflow-visible"
      style={{ opacity: dimmed ? 0.82 : 1 }}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx={50} cy={50} r={46} />
        </clipPath>
      </defs>

      {/* Back half of Saturn's ring */}
      {isRinged && (
        <g transform="rotate(-16 50 50)">
          <path
            d="M -38 50 A 88 22 0 0 1 138 50"
            fill="none"
            stroke="#C5A762"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M -28 50 A 78 17 0 0 1 128 50"
            fill="none"
            stroke="#070A12"
            strokeWidth="2.5"
          />
        </g>
      )}

      {/* Mars subtle geometric dust ring */}
      {dest.visual === 'mars' && (
        <circle
          cx={50}
          cy={50}
          r={53}
          fill="none"
          stroke="#E4572E"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />
      )}

      {/* Planet base disc */}
      <circle cx={50} cy={50} r={46} fill={base} />

      {/* Surface details clipped to the planet disc */}
      <g clipPath={`url(#${clipId})`}>
        {dest.visual === 'earth' && (
          <g fill={detail}>
            <path d="M22 28 C34 24 44 31 41 42 C38 50 26 52 21 43 Z" />
            <path d="M56 32 C72 28 84 40 78 56 C72 64 59 61 55 49 Z" />
            <path d="M31 64 C44 61 54 68 50 79 C43 85 30 81 28 71 Z" />
            {/* Crisp flat cloud bands */}
            <rect x="14" y="21" width="30" height="4.5" rx="2.25" fill="#E6E9F2" opacity="0.7" />
            <rect x="52" y="65" width="28" height="4.5" rx="2.25" fill="#E6E9F2" opacity="0.65" />
          </g>
        )}

        {dest.visual === 'moon' && (
          <g fill={detail}>
            <circle cx={35} cy={36} r={10} />
            <circle cx={63} cy={46} r={7.5} />
            <circle cx={42} cy={68} r={6} />
            <circle cx={66} cy={28} r={4} />
          </g>
        )}

        {dest.visual === 'mars' && (
          <g>
            {/* Polar ice cap */}
            <ellipse cx={50} cy={10} rx={18} ry={6} fill="#F1F5F9" />
            {/* Dark basaltic regions & craters */}
            <path d="M24 44 C38 39 54 45 64 56 C55 64 34 62 24 52 Z" fill={detail} />
            <circle cx={68} cy={36} r={6} fill={detail} />
            <circle cx={38} cy={72} r={5} fill={detail} />
          </g>
        )}

        {dest.visual === 'rocky' && (
          <g fill={detail}>
            <circle cx={34} cy={40} r={8} />
            <circle cx={62} cy={60} r={10} />
            <circle cx={58} cy={30} r={5} />
          </g>
        )}

        {dest.visual === 'cloudy' && (
          <g fill={detail}>
            <rect x="0" y="26" width="100" height="9" />
            <rect x="0" y="50" width="100" height="11" />
            <rect x="0" y="72" width="100" height="7" />
          </g>
        )}

        {dest.visual === 'gas' && (
          <g>
            <rect x="0" y="20" width="100" height="8" fill={detail} />
            <rect x="0" y="38" width="100" height="11" fill={detail} />
            <rect x="0" y="62" width="100" height="9" fill={detail} />
            {/* Great Red Spot */}
            <ellipse cx={64} cy={63} rx={11} ry={6.5} fill="#C25130" />
          </g>
        )}

        {dest.visual === 'ringed' && (
          <g fill={detail}>
            <rect x="0" y="28" width="100" height="7" />
            <rect x="0" y="47" width="100" height="9" />
            <rect x="0" y="68" width="100" height="6" />
          </g>
        )}

        {dest.visual === 'ice' && (
          <g fill={detail}>
            <rect x="0" y="34" width="100" height="8" />
            <rect x="0" y="60" width="100" height="7" />
          </g>
        )}

        {/* Crisp flat terminator shadow */}
        <path
          d="M 55 4 A 46 46 0 0 1 55 96 A 32 46 0 0 0 55 4 Z"
          fill={shade}
          opacity="0.22"
        />
      </g>

      {/* Crisp 1px outer rim */}
      <circle cx={50} cy={50} r={46} fill="none" stroke="#FFFFFF" strokeOpacity="0.16" strokeWidth="1.5" />

      {/* Front half of Saturn's ring */}
      {isRinged && (
        <g transform="rotate(-16 50 50)">
          <path
            d="M -38 50 A 88 22 0 0 0 138 50"
            fill="none"
            stroke="#E8D29A"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M -28 50 A 78 17 0 0 0 128 50"
            fill="none"
            stroke="#070A12"
            strokeWidth="2.5"
          />
        </g>
      )}
    </svg>
  );
});

/**
 * Astronomically cohesive Deep Space / Kuiper Belt marker:
 * dotted icy-asteroid arc, distant star cluster, and clean probe trajectory reticle.
 */
function DeepSpaceMarker({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="block overflow-visible" aria-hidden="true">
      {/* Icy Kuiper Belt asteroid arc */}
      <path
        d="M 14 78 A 46 46 0 0 1 82 18"
        fill="none"
        stroke="#8EA2FF"
        strokeWidth="2.5"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />
      <path
        d="M 22 86 A 48 48 0 0 1 88 28"
        fill="none"
        stroke="#475569"
        strokeWidth="1.5"
        strokeDasharray="1.5 9"
        strokeLinecap="round"
      />

      {/* Trajectory vector line */}
      <line
        x1="18"
        y1="72"
        x2="78"
        y2="24"
        stroke="#E6E9F2"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      {/* Crisp probe reticle */}
      <circle cx="54" cy="44" r="19" fill="#0E1320" stroke="#8EA2FF" strokeWidth="2" />
      <circle cx="54" cy="44" r="12" fill="none" stroke="#2F3956" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Probe chevron */}
      <polygon points="54,35 61,49 54,46 47,49" fill="#E6E9F2" />

      {/* Distant star cluster / icy bodies */}
      <circle cx="24" cy="30" r="2.2" fill="#E6E9F2" />
      <circle cx="30" cy="24" r="1.4" fill="#8EA2FF" />
      <circle cx="19" cy="24" r="1.3" fill="#CBD5E1" />
      <circle cx="80" cy="64" r="2.5" fill="#94A3B8" />
      <circle cx="72" cy="72" r="1.6" fill="#CBD5E1" />
      <path d="M80 18 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2 z" fill="#E6E9F2" />
    </svg>
  );
}
