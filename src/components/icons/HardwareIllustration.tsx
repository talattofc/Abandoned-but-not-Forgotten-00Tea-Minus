import { memo } from 'react';
import type { HardwareId, StoryIconKey } from '../../data/hardwareData';

const C = {
  bg: '#0B1020',
  grid: '#182138',
  white: '#E6E9F2',
  grey: '#9AA5BD',
  dark: '#151C2E',
  line: '#2F3956',
  blue: '#60A5FA',
  navy: '#1E3A5F',
  amber: '#F59E0B',
  gold: '#FBBF24',
  red: '#E4572E',
  deep: '#8EA2FF',
  green: '#34D399',
};

interface HardwareIllustrationProps {
  id: HardwareId;
  variant?: 'card' | 'blueprint';
  className?: string;
}

export const HardwareIllustration = memo(function HardwareIllustration({
  id,
  variant = 'card',
  className = 'h-full w-full',
}: HardwareIllustrationProps) {
  const isBlueprint = variant === 'blueprint';

  return (
    <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
      <rect x="0" y="0" width="240" height="150" rx="10" fill={C.bg} />
      {isBlueprint ? (
        <g stroke={C.grid} strokeWidth="1">
          {[30, 60, 90, 120].map((y) => (
            <line key={`h-${y}`} x1="0" y1={y} x2="240" y2={y} />
          ))}
          {[40, 80, 120, 160, 200].map((x) => (
            <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="150" />
          ))}
          <rect x="8" y="8" width="224" height="134" rx="6" fill="none" stroke={C.line} strokeDasharray="4 4" />
        </g>
      ) : (
        <g fill={C.white} opacity="0.45">
          <circle cx="24" cy="22" r="1.2" />
          <circle cx="64" cy="16" r="1" />
          <circle cx="198" cy="24" r="1.3" />
          <circle cx="216" cy="52" r="1" />
          <circle cx="34" cy="60" r="1" />
        </g>
      )}
      {HARDWARE_ART[id]}
    </svg>
  );
});

const HARDWARE_ART: Record<HardwareId, JSX.Element> = {
  /* 1. Apollo 15 LRV-1: umbrella mesh dish, T-bar hand controller, 2 seats, fenders, spoked wire-mesh wheels */
  'lrv-1': (
    <g>
      <rect x="0" y="122" width="240" height="28" fill="#151C2E" />
      <line x1="0" y1="122" x2="240" y2="122" stroke={C.line} strokeWidth="1.5" />

      {/* High-gain umbrella mesh dish antenna */}
      <line x1="166" y1="78" x2="178" y2="38" stroke={C.grey} strokeWidth="2.5" />
      <path d="M 158 36 Q 178 16 198 38" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 162 37 Q 178 26 194 38" fill="none" stroke={C.amber} strokeWidth="1.5" strokeDasharray="2 2" />
      <line x1="178" y1="27" x2="178" y2="18" stroke={C.white} strokeWidth="1.8" />
      <circle cx="178" cy="17" r="2.2" fill={C.amber} />

      {/* TV Camera mast */}
      <line x1="158" y1="78" x2="160" y2="54" stroke={C.white} strokeWidth="2" />
      <rect x="155" y="48" width="12" height="7" rx="1.5" fill={C.blue} />

      {/* T-bar hand controller between seats */}
      <line x1="120" y1="80" x2="120" y2="62" stroke={C.white} strokeWidth="2.5" />
      <line x1="113" y1="62" x2="127" y2="62" stroke={C.amber} strokeWidth="3" strokeLinecap="round" />

      {/* Two astronaut seats with headrests */}
      <g>
        <rect x="86" y="56" width="16" height="22" rx="2" fill={C.grey} />
        <rect x="84" y="51" width="12" height="6" rx="1.5" fill={C.white} />
        <rect x="128" y="56" width="16" height="22" rx="2" fill={C.grey} />
        <rect x="126" y="51" width="12" height="6" rx="1.5" fill={C.white} />
      </g>

      {/* Origami aluminum chassis & lower frame */}
      <rect x="58" y="78" width="122" height="10" rx="2" fill={C.white} />
      <rect x="74" y="88" width="90" height="8" rx="1.5" fill={C.grey} />
      <rect x="152" y="70" width="22" height="8" rx="1.5" fill={C.amber} />

      {/* Front & Rear fenders */}
      <path d="M 40 94 Q 60 74 80 94" fill="none" stroke={C.amber} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 158 94 Q 178 74 198 94" fill="none" stroke={C.amber} strokeWidth="3.5" strokeLinecap="round" />

      {/* Spoked wire-mesh wheels */}
      {[60, 178].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="108" r="16" fill={C.bg} stroke={C.white} strokeWidth="2.8" />
          <circle cx={cx} cy="108" r="11" fill="none" stroke={C.grey} strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1={cx - 12} y1="108" x2={cx + 12} y2="108" stroke={C.grey} strokeWidth="1.2" />
          <line x1={cx} y1="96" x2={cx} y2="120" stroke={C.grey} strokeWidth="1.2" />
          <line x1={cx - 8} y1="100" x2={cx + 8} y2="116" stroke={C.grey} strokeWidth="1.2" />
          <line x1={cx - 8} y1="116" x2={cx + 8} y2="100" stroke={C.grey} strokeWidth="1.2" />
          <circle cx={cx} cy="108" r="4" fill={C.amber} />
        </g>
      ))}
    </g>
  ),

  /* 2. Apollo 12 ALSEP: finned SNAP-27 RTG cask, central station + helical antenna, seismometer dome & magnetometer */
  'apollo-12-alsep': (
    <g>
      <rect x="0" y="122" width="240" height="28" fill="#151C2E" />
      <line x1="0" y1="122" x2="240" y2="122" stroke={C.line} strokeWidth="1.5" />

      {/* Flat power/data ribbon cables */}
      <path d="M 60 112 H 102" stroke={C.amber} strokeWidth="2" strokeDasharray="4 3" />
      <path d="M 136 112 H 170" stroke={C.blue} strokeWidth="2" strokeDasharray="4 3" />
      <path d="M 136 96 H 196" stroke={C.green} strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Cylindrical finned SNAP-27 RTG power cask */}
      <g transform="translate(32, 74)">
        <rect x="4" y="8" width="22" height="38" rx="3" fill={C.dark} stroke={C.amber} strokeWidth="2" />
        {[14, 20, 26, 32, 38].map((y) => (
          <line key={y} x1="-2" y1={y} x2="32" y2={y} stroke={C.amber} strokeWidth="2" />
        ))}
        <rect x="9" y="2" width="12" height="6" rx="1" fill={C.grey} />
        <circle cx="15" cy="26" r="4" fill={C.gold} />
      </g>

      {/* Central Station + Helical Antenna */}
      <g transform="translate(100, 34)">
        <line x1="18" y1="0" x2="18" y2="40" stroke={C.white} strokeWidth="2.5" />
        <path d="M 11 6 L 25 10 L 11 15 L 25 20 L 11 25 L 25 30" fill="none" stroke={C.blue} strokeWidth="2" strokeLinejoin="round" />
        <rect x="0" y="40" width="36" height="44" rx="3" fill={C.white} />
        <rect x="6" y="48" width="24" height="12" rx="1.5" fill={C.navy} />
        <circle cx="12" cy="70" r="2.5" fill={C.green} />
        <circle cx="24" cy="70" r="2.5" fill={C.amber} />
      </g>

      {/* Seismometer Dome */}
      <g transform="translate(166, 86)">
        <path d="M 2 30 A 18 18 0 0 1 38 30 Z" fill={C.grey} stroke={C.white} strokeWidth="1.8" />
        <rect x="12" y="18" width="16" height="12" rx="2" fill={C.navy} />
        <circle cx="20" cy="24" r="3" fill={C.blue} />
        <rect x="0" y="30" width="40" height="6" rx="1.5" fill={C.white} />
      </g>

      {/* Magnetometer Tripod */}
      <g transform="translate(194, 54)">
        <line x1="16" y1="14" x2="6" y2="32" stroke={C.grey} strokeWidth="2" />
        <line x1="16" y1="14" x2="26" y2="32" stroke={C.grey} strokeWidth="2" />
        <line x1="16" y1="14" x2="16" y2="2" stroke={C.white} strokeWidth="2" />
        <circle cx="16" cy="2" r="2.5" fill={C.green} />
        <circle cx="6" cy="32" r="2.5" fill={C.green} />
        <circle cx="26" cy="32" r="2.5" fill={C.green} />
      </g>
    </g>
  ),

  /* 3. Spirit & Opportunity: wide solar deck, Pancam masthead, robotic arm, 6-wheel rocker-bogie */
  'spirit-opportunity': (
    <g>
      <rect x="0" y="122" width="240" height="28" fill="#2A1410" />
      <line x1="0" y1="122" x2="240" y2="122" stroke={C.red} strokeWidth="1.5" />

      {/* Upright Pancam masthead ("neck and head") */}
      <line x1="124" y1="68" x2="124" y2="28" stroke={C.white} strokeWidth="3.5" />
      <rect x="108" y="20" width="32" height="13" rx="3" fill={C.white} />
      <circle cx="116" cy="26.5" r="3.2" fill={C.navy} stroke={C.blue} strokeWidth="1" />
      <circle cx="132" cy="26.5" r="3.2" fill={C.navy} stroke={C.blue} strokeWidth="1" />
      <rect x="121" y="24" width="6" height="5" rx="1" fill={C.amber} />

      {/* High-gain & UHF antennas */}
      <line x1="92" y1="68" x2="88" y2="46" stroke={C.grey} strokeWidth="2" />
      <ellipse cx="88" cy="44" rx="9" ry="4" fill={C.white} />

      {/* Wide wing-like solar array deck */}
      <polygon points="48,66 184,66 172,78 60,78" fill={C.navy} stroke={C.blue} strokeWidth="2" />
      <line x1="82" y1="66" x2="86" y2="78" stroke={C.blue} strokeWidth="1.2" />
      <line x1="116" y1="66" x2="116" y2="78" stroke={C.blue} strokeWidth="1.2" />
      <line x1="150" y1="66" x2="146" y2="78" stroke={C.blue} strokeWidth="1.2" />

      {/* Warm electronics box */}
      <rect x="90" y="78" width="54" height="16" rx="2" fill={C.amber} />

      {/* Front Robotic Science Arm (IDD) */}
      <path d="M 144 82 L 176 74 L 194 92" fill="none" stroke={C.white} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="176" cy="74" r="3" fill={C.amber} />
      <circle cx="195" cy="94" r="5" fill={C.grey} stroke={C.white} strokeWidth="1.5" />

      {/* 6-wheel Rocker-Bogie Suspension */}
      <path d="M 68 108 L 92 90 L 116 108 L 140 90 L 164 108" fill="none" stroke={C.grey} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {[68, 116, 164].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="110" r="11" fill={C.bg} stroke={C.white} strokeWidth="2.5" />
          <circle cx={cx} cy="110" r="3.5" fill={C.red} />
        </g>
      ))}
    </g>
  ),

  /* 4. Ingenuity: coaxial counter-rotating twin blades, top square solar panel, tissue-box fuselage, 4 carbon legs */
  ingenuity: (
    <g>
      <rect x="0" y="124" width="240" height="26" fill="#2A1410" />
      <line x1="0" y1="124" x2="240" y2="124" stroke={C.red} strokeWidth="1.5" />

      {/* Top square solar panel */}
      <rect x="94" y="14" width="52" height="9" rx="2" fill={C.navy} stroke={C.blue} strokeWidth="2" />
      <line x1="111" y1="14" x2="111" y2="23" stroke={C.blue} strokeWidth="1" />
      <line x1="129" y1="14" x2="129" y2="23" stroke={C.blue} strokeWidth="1" />

      {/* Coaxial mast */}
      <line x1="120" y1="23" x2="120" y2="62" stroke={C.grey} strokeWidth="3" />

      {/* Coaxial counter-rotating twin rotor blades */}
      <rect x="40" y="32" width="160" height="5" rx="2.5" fill={C.white} />
      <rect x="52" y="44" width="136" height="5" rx="2.5" fill={C.grey} />
      <circle cx="120" cy="34.5" r="4.5" fill={C.amber} />
      <circle cx="120" cy="46.5" r="4.5" fill={C.amber} />

      {/* Tissue-box insulated fuselage */}
      <rect x="98" y="62" width="44" height="26" rx="3" fill={C.gold} stroke={C.amber} strokeWidth="2" />
      <rect x="104" y="68" width="12" height="10" rx="1.5" fill={C.navy} />
      <circle cx="130" cy="74" r="4.5" fill={C.navy} stroke={C.blue} strokeWidth="1.5" />

      {/* 4 angled carbon-fiber landing legs */}
      <line x1="100" y1="86" x2="72" y2="118" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="140" y1="86" x2="168" y2="118" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="106" y1="88" x2="90" y2="120" stroke={C.grey} strokeWidth="2" strokeLinecap="round" />
      <line x1="134" y1="88" x2="150" y2="120" stroke={C.grey} strokeWidth="2" strokeLinecap="round" />
      <circle cx="72" cy="118" r="2.5" fill={C.amber} />
      <circle cx="168" cy="118" r="2.5" fill={C.amber} />
    </g>
  ),

  /* 5. Pioneer 10: 2.74m parabolic dish, 3 long radial booms (2 RTG + 1 magnetometer), gold plaque */
  'pioneer-10': (
    <g>
      {/* Trajectory arc */}
      <path d="M 14 128 Q 70 108 104 88" fill="none" stroke={C.deep} strokeWidth="1.5" strokeDasharray="4 4" />

      {/* 2.74m Parabolic Dish Antenna */}
      <ellipse cx="120" cy="48" rx="48" ry="17" fill={C.white} stroke={C.grey} strokeWidth="2" />
      <ellipse cx="120" cy="48" rx="32" ry="10" fill="none" stroke={C.line} strokeWidth="1.5" />
      {/* Feed horn tripod */}
      <line x1="94" y1="48" x2="120" y2="20" stroke={C.grey} strokeWidth="2" />
      <line x1="146" y1="48" x2="120" y2="20" stroke={C.grey} strokeWidth="2" />
      <line x1="120" y1="48" x2="120" y2="20" stroke={C.grey} strokeWidth="1.5" />
      <circle cx="120" cy="19" r="4" fill={C.amber} />

      {/* Hexagonal bus + Golden Pioneer Plaque */}
      <rect x="102" y="65" width="36" height="22" rx="3" fill={C.grey} />
      <rect x="124" y="70" width="12" height="12" rx="1" fill={C.gold} stroke={C.amber} strokeWidth="1.2" />
      <circle cx="128" cy="76" r="1.4" fill="#78350F" />
      <line x1="131" y1="74" x2="133" y2="78" stroke="#78350F" strokeWidth="1.2" />

      {/* Boom 1 & 2: Twin SNAP-19 RTG Booms */}
      <line x1="102" y1="78" x2="36" y2="98" stroke={C.white} strokeWidth="2.5" />
      <rect x="24" y="92" width="18" height="12" rx="2" transform="rotate(-17 33 98)" fill={C.amber} />
      <line x1="138" y1="78" x2="204" y2="98" stroke={C.white} strokeWidth="2.5" />
      <rect x="198" y="92" width="18" height="12" rx="2" transform="rotate(17 207 98)" fill={C.amber} />

      {/* Boom 3: Long Magnetometer Boom */}
      <line x1="120" y1="87" x2="120" y2="136" stroke={C.white} strokeWidth="2" />
      <circle cx="120" cy="138" r="4.5" fill={C.blue} />
    </g>
  ),

  /* 6. Kepler Space Telescope: angled sunshade aperture tube, photometer barrel, 4-panel solar array wing */
  kepler: (
    <g>
      <circle cx="28" cy="34" r="2.5" fill={C.gold} />
      <circle cx="44" cy="20" r="1.8" fill={C.white} />
      <circle cx="20" cy="58" r="1.4" fill={C.blue} />

      {/* 4-Panel Solar Array Wing */}
      <g transform="translate(116, 78) rotate(24)">
        <rect x="0" y="0" width="76" height="32" rx="2" fill={C.navy} stroke={C.blue} strokeWidth="2" />
        <line x1="19" y1="0" x2="19" y2="32" stroke={C.blue} strokeWidth="1.5" />
        <line x1="38" y1="0" x2="38" y2="32" stroke={C.blue} strokeWidth="1.5" />
        <line x1="57" y1="0" x2="57" y2="32" stroke={C.blue} strokeWidth="1.5" />
        <line x1="0" y1="16" x2="76" y2="16" stroke={C.blue} strokeWidth="1" />
      </g>

      {/* Main Photometer Barrel + Angled Sunshade Aperture Tube */}
      <g transform="rotate(-24 110 74)">
        <rect x="74" y="52" width="84" height="44" rx="4" fill={C.white} />
        <rect x="134" y="52" width="24" height="44" rx="2" fill={C.amber} />
        {/* Angled sunshade */}
        <polygon points="74,52 46,38 46,96 74,96" fill={C.grey} stroke={C.white} strokeWidth="1.5" />
        {/* 0.95m Aperture */}
        <ellipse cx="64" cy="70" rx="8" ry="18" fill={C.navy} stroke={C.blue} strokeWidth="2" />
      </g>
    </g>
  ),
};

export const StoryStepIcon = memo(function StoryStepIcon({
  icon,
  color,
}: {
  icon: StoryIconKey;
  color: string;
}) {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <rect x="1" y="1" width="30" height="30" rx="8" fill="#151C2E" stroke="#2F3956" />
      {icon === 'launch' && <path d="M16 7 L21 17 L18 17 L18 24 L14 24 L14 17 L11 17 Z" fill={color} />}
      {icon === 'mission' && (
        <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <circle cx="16" cy="16" r="7" />
          <circle cx="16" cy="16" r="2.5" fill={color} />
          <path d="M16 6 V9 M16 23 V26 M6 16 H9 M23 16 H26" />
        </g>
      )}
      {icon === 'discovery' && (
        <path
          d="M16 7 L18.5 13 L25 13.5 L20 17.8 L21.5 24.5 L16 21 L10.5 24.5 L12 17.8 L7 13.5 L13.5 13 Z"
          fill={color}
        />
      )}
      {icon === 'legacy' && (
        <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
          <circle cx="16" cy="16" r="6" />
          <path d="M8 22 Q16 26 24 10" />
        </g>
      )}
    </svg>
  );
});
