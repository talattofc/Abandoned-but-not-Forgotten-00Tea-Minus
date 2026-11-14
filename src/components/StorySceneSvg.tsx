import { motion } from 'framer-motion';
import { memo } from 'react';
import type { HardwareId, StoryIconKey } from '../data/hardwareData';

interface StorySceneSvgProps {
  hardwareId: HardwareId;
  step: number;
  icon: StoryIconKey;
  color: string;
}

/**
 * Custom animated flat-vector SVG scene for each of the 4 story chapters.
 * Uses only GPU-composited transform & opacity animations.
 */
export const StorySceneSvg = memo(function StorySceneSvg({
  hardwareId,
  step,
  color,
}: StorySceneSvgProps) {
  return (
    <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-[#0B1020]">
      <svg viewBox="0 0 240 150" className="h-full w-full" aria-hidden="true">
        <rect x="0" y="0" width="240" height="150" fill="#0B1020" />
        <g fill="#E6E9F2" opacity="0.4">
          <circle cx="24" cy="20" r="1.2" />
          <circle cx="72" cy="14" r="1" />
          <circle cx="188" cy="22" r="1.4" />
          <circle cx="216" cy="48" r="1" />
        </g>

        {renderScene(hardwareId, step, color)}
      </svg>
    </div>
  );
});

function renderScene(id: HardwareId, step: number, color: string) {
  /* ==================== LRV-1 ==================== */
  if (id === 'lrv-1') {
    if (step === 1) {
      // Origami unfolding out of the Lunar Module
      return (
        <g>
          <rect x="0" y="122" width="240" height="28" fill="#151C2E" />
          <rect x="34" y="34" width="64" height="72" rx="4" fill="#9AA5BD" />
          <polygon points="34,106 24,122 44,122" fill="#F59E0B" />
          <polygon points="98,106 88,122 108,122" fill="#F59E0B" />
          <motion.g
            animate={{ x: [0, 26, 26], rotate: [-14, 0, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0.8 }}
            style={{ transformOrigin: '104px 96px' }}
          >
            <rect x="108" y="88" width="76" height="8" rx="2" fill="#E6E9F2" />
            <circle cx="120" cy="108" r="11" fill="#0B1020" stroke="#E6E9F2" strokeWidth="2.5" />
            <circle cx="172" cy="108" r="11" fill="#0B1020" stroke="#E6E9F2" strokeWidth="2.5" />
          </motion.g>
        </g>
      );
    }
    if (step === 2) {
      // Wheels spinning & kicking up Moon dust
      return (
        <g>
          <rect x="0" y="122" width="240" height="28" fill="#151C2E" />
          <motion.g animate={{ x: [-8, 8, -8] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}>
            <rect x="74" y="86" width="90" height="10" rx="2" fill="#E6E9F2" />
            <rect x="92" y="68" width="14" height="18" rx="2" fill="#9AA5BD" />
            <rect x="122" y="68" width="14" height="18" rx="2" fill="#9AA5BD" />
            <circle cx="88" cy="108" r="13" fill="#0B1020" stroke="#E6E9F2" strokeWidth="2.5" />
            <circle cx="150" cy="108" r="13" fill="#0B1020" stroke="#E6E9F2" strokeWidth="2.5" />
            <motion.circle
              cx="64"
              cy="114"
              r="5"
              fill="#9AA5BD"
              animate={{ opacity: [0.8, 0], x: [-2, -18], y: [0, -8] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          </motion.g>
        </g>
      );
    }
    if (step === 3) {
      // Genesis Rock discovery
      return (
        <g>
          <rect x="0" y="122" width="240" height="28" fill="#151C2E" />
          <polygon points="96,122 114,94 134,98 144,122" fill="#E6E9F2" />
          <motion.circle
            cx="120"
            cy="104"
            r="26"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray="4 4"
            animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <path d="M120 56 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#FBBF24" />
        </g>
      );
    }
    // Step 4: Parked filming liftoff
    return (
      <g>
        <rect x="0" y="122" width="240" height="28" fill="#151C2E" />
        <rect x="44" y="96" width="52" height="8" rx="2" fill="#E6E9F2" />
        <circle cx="52" cy="112" r="9" fill="#0B1020" stroke="#E6E9F2" strokeWidth="2" />
        <circle cx="88" cy="112" r="9" fill="#0B1020" stroke="#E6E9F2" strokeWidth="2" />
        <line x1="86" y1="96" x2="86" y2="78" stroke="#60A5FA" strokeWidth="2" />
        <motion.g animate={{ y: [0, -56], opacity: [1, 1, 0] }} transition={{ duration: 2.6, repeat: Infinity }}>
          <polygon points="168,66 184,92 152,92" fill="#F59E0B" />
          <rect x="160" y="92" width="16" height="14" fill="#FBBF24" />
        </motion.g>
      </g>
    );
  }

  /* ==================== ALSEP ==================== */
  if (id === 'apollo-12-alsep') {
    if (step === 1) {
      return (
        <g>
          <rect x="0" y="122" width="240" height="28" fill="#151C2E" />
          <motion.g animate={{ y: [-38, 0] }} transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.8 }}>
            <rect x="96" y="64" width="48" height="36" rx="4" fill="#E6E9F2" />
            <line x1="100" y1="100" x2="88" y2="120" stroke="#F59E0B" strokeWidth="3" />
            <line x1="140" y1="100" x2="152" y2="120" stroke="#F59E0B" strokeWidth="3" />
          </motion.g>
        </g>
      );
    }
    if (step === 2) {
      // SNAP-27 RTG pulsing energy in freezing night
      return (
        <g>
          <rect x="0" y="122" width="240" height="28" fill="#151C2E" />
          <rect x="98" y="64" width="44" height="56" rx="4" fill="#151C2E" stroke="#F59E0B" strokeWidth="2.5" />
          {[76, 88, 100, 112].map((y) => (
            <line key={y} x1="90" y1={y} x2="150" y2={y} stroke="#F59E0B" strokeWidth="2" />
          ))}
          <motion.circle
            cx="120"
            cy="92"
            r="9"
            fill="#FBBF24"
            animate={{ scale: [0.85, 1.15, 0.85] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </g>
      );
    }
    if (step === 3) {
      // Moonquake seismic waves
      return (
        <g>
          <rect x="0" y="122" width="240" height="28" fill="#151C2E" />
          <path d="M 102 122 A 18 18 0 0 1 138 122 Z" fill="#E6E9F2" />
          {[1, 2, 3].map((ring) => (
            <motion.circle
              key={ring}
              cx="120"
              cy="122"
              r={18 + ring * 16}
              fill="none"
              stroke="#60A5FA"
              strokeWidth="2"
              animate={{ opacity: [0.9, 0.1, 0.9] }}
              transition={{ duration: 1.6, delay: ring * 0.25, repeat: Infinity }}
            />
          ))}
        </g>
      );
    }
    // Step 4: 8 years beaming radio waves
    return (
      <g>
        <rect x="0" y="122" width="240" height="28" fill="#151C2E" />
        <rect x="104" y="78" width="32" height="44" rx="3" fill="#E6E9F2" />
        <line x1="120" y1="42" x2="120" y2="78" stroke="#60A5FA" strokeWidth="2.5" />
        {[1, 2].map((arc) => (
          <motion.path
            key={arc}
            d={`M ${120 - arc * 14} ${46 - arc * 6} Q 120 ${30 - arc * 10} ${120 + arc * 14} ${46 - arc * 6}`}
            fill="none"
            stroke="#34D399"
            strokeWidth="2"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.4, delay: arc * 0.25, repeat: Infinity }}
          />
        ))}
      </g>
    );
  }

  /* ==================== SPIRIT & OPPORTUNITY ==================== */
  if (id === 'spirit-opportunity') {
    if (step === 1) {
      // Airbag bounce
      return (
        <g>
          <rect x="0" y="122" width="240" height="28" fill="#2A1410" />
          <motion.g
            animate={{ y: [-42, 0, -18, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.6 }}
          >
            <circle cx="120" cy="96" r="24" fill="#F59E0B" stroke="#E6E9F2" strokeWidth="2" />
            <circle cx="104" cy="90" r="10" fill="#FBBF24" />
            <circle cx="136" cy="90" r="10" fill="#FBBF24" />
          </motion.g>
        </g>
      );
    }
    if (step === 2) {
      // Dust devil cleaning solar panels
      return (
        <g>
          <rect x="0" y="122" width="240" height="28" fill="#2A1410" />
          <rect x="74" y="88" width="92" height="12" rx="2" fill="#1E3A5F" stroke="#60A5FA" strokeWidth="2" />
          <circle cx="88" cy="112" r="9" fill="#0B1020" stroke="#E6E9F2" strokeWidth="2" />
          <circle cx="152" cy="112" r="9" fill="#0B1020" stroke="#E6E9F2" strokeWidth="2" />
          <motion.path
            d="M 40 50 Q 120 42 200 52"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeDasharray="10 8"
            animate={{ x: [-20, 24, -20] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </g>
      );
    }
    if (step === 3) {
      // Hematite "blueberries"
      return (
        <g>
          <rect x="0" y="122" width="240" height="28" fill="#2A1410" />
          {[88, 114, 136, 156].map((x, idx) => (
            <motion.circle
              key={x}
              cx={x}
              cy={116 - (idx % 2) * 8}
              r="7"
              fill="#60A5FA"
              stroke="#E6E9F2"
              strokeWidth="1.5"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.8, delay: idx * 0.2, repeat: Infinity }}
            />
          ))}
        </g>
      );
    }
    // Step 4: Marathon monument in dust
    return (
      <g>
        <rect x="0" y="122" width="240" height="28" fill="#2A1410" />
        <line x1="20" y1="122" x2="180" y2="122" stroke="#E4572E" strokeWidth="2" strokeDasharray="6 4" />
        <rect x="130" y="92" width="46" height="12" rx="2" fill="#9AA5BD" />
        <line x1="154" y1="92" x2="154" y2="70" stroke="#E6E9F2" strokeWidth="2.5" />
        <rect x="144" y="64" width="20" height="8" rx="2" fill="#E6E9F2" />
      </g>
    );
  }

  /* ==================== INGENUITY ==================== */
  if (id === 'ingenuity') {
    if (step === 1) {
      // Dropping from Perseverance belly
      return (
        <g>
          <rect x="0" y="122" width="240" height="28" fill="#2A1410" />
          <rect x="64" y="42" width="112" height="26" rx="4" fill="#9AA5BD" />
          <motion.g animate={{ y: [0, 38, 38] }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.6 }}>
            <rect x="108" y="72" width="24" height="14" rx="2" fill="#FBBF24" />
            <line x1="88" y1="68" x2="152" y2="68" stroke="#E6E9F2" strokeWidth="3" />
          </motion.g>
        </g>
      );
    }
    if (step === 2 || step === 3) {
      // Spinning rotors & lifting off
      return (
        <g>
          <rect x="0" y="122" width="240" height="28" fill="#2A1410" />
          <motion.g
            animate={{ y: step === 2 ? [-8, -24, -8] : [-14, -26, -14], x: step === 3 ? [-24, 24, -24] : 0 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <rect x="102" y="76" width="36" height="20" rx="3" fill="#FBBF24" />
            <line x1="120" y1="54" x2="120" y2="76" stroke="#9AA5BD" strokeWidth="2.5" />
            <motion.rect
              x="64"
              y="56"
              width="112"
              height="4"
              rx="2"
              fill="#E6E9F2"
              animate={{ scaleX: [1, 0.35, 1] }}
              transition={{ duration: 0.25, repeat: Infinity }}
              style={{ transformOrigin: '120px 58px' }}
            />
            <line x1="104" y1="96" x2="90" y2="114" stroke="#E6E9F2" strokeWidth="2" />
            <line x1="136" y1="96" x2="150" y2="114" stroke="#E6E9F2" strokeWidth="2" />
          </motion.g>
        </g>
      );
    }
    return (
      <g>
        <rect x="0" y="122" width="240" height="28" fill="#2A1410" />
        <rect x="102" y="88" width="36" height="20" rx="3" fill="#FBBF24" />
        <line x1="72" y1="74" x2="168" y2="78" stroke="#E6E9F2" strokeWidth="3" />
        <line x1="104" y1="108" x2="90" y2="122" stroke="#E6E9F2" strokeWidth="2" />
        <line x1="136" y1="108" x2="150" y2="122" stroke="#E6E9F2" strokeWidth="2" />
      </g>
    );
  }

  /* ==================== PIONEER 10 ==================== */
  if (id === 'pioneer-10') {
    if (step === 1) {
      // Asteroid belt crossing
      return (
        <g>
          {[56, 114, 174].map((x, idx) => (
            <motion.circle
              key={x}
              cx={x}
              cy={42 + idx * 24}
              r={10 + idx * 2}
              fill="#7D776F"
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 2 + idx * 0.4, repeat: Infinity }}
            />
          ))}
          <motion.polygon
            points="36,110 56,96 48,118"
            fill="#FBBF24"
            animate={{ x: [0, 140], y: [0, -56] }}
            transition={{ duration: 2.6, repeat: Infinity }}
          />
        </g>
      );
    }
    if (step === 2) {
      // Jupiter flyby slingshot
      return (
        <g>
          <circle cx="96" cy="76" r="36" fill="#D7A46E" />
          <rect x="60" y="64" width="72" height="7" fill="#B9814B" />
          <ellipse cx="110" cy="88" rx="9" ry="5" fill="#C25130" />
          <motion.circle
            cx="154"
            cy="56"
            r="6"
            fill="#E6E9F2"
            animate={{ x: [-20, 44], y: [46, -24] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          />
        </g>
      );
    }
    if (step === 3) {
      // Golden Plaque
      return (
        <g>
          <rect x="64" y="34" width="112" height="82" rx="6" fill="#FBBF24" stroke="#F59E0B" strokeWidth="3" />
          <circle cx="96" cy="74" r="4" fill="#78350F" />
          {[0, 30, 60, 120, 150, 210, 240].map((deg) => (
            <line
              key={deg}
              x1="96"
              y1="74"
              x2={96 + Math.cos((deg * Math.PI) / 180) * 20}
              y2={74 + Math.sin((deg * Math.PI) / 180) * 20}
              stroke="#78350F"
              strokeWidth="1.5"
            />
          ))}
          <circle cx="148" cy="58" r="6" fill="#78350F" />
          <rect x="142" y="66" width="12" height="24" rx="2" fill="#78350F" />
        </g>
      );
    }
    // Step 4: Drifting toward Aldebaran
    return (
      <g>
        <circle cx="194" cy="36" r="14" fill="#E4572E" />
        <motion.g animate={{ x: [0, 22] }} transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}>
          <ellipse cx="82" cy="84" rx="20" ry="8" fill="#E6E9F2" />
          <rect x="74" y="92" width="16" height="10" fill="#9AA5BD" />
        </motion.g>
      </g>
    );
  }

  /* ==================== KEPLER ==================== */
  if (step === 2 || step === 3) {
    // Transit method: planet crossing star & light curve dip!
    return (
      <g>
        <circle cx="120" cy="54" r="24" fill="#FBBF24" />
        <motion.circle
          cx="120"
          cy="54"
          r="6"
          fill="#0B1020"
          animate={{ x: [-44, 44] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
        />
        <polyline
          points="30,116 96,116 108,132 132,132 144,116 210,116"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>
    );
  }

  return (
    <g>
      <circle cx="120" cy="75" r="16" fill="#F59E0B" />
      <circle cx="120" cy="75" r="46" fill="none" stroke="#2F3956" strokeDasharray="4 4" />
      <motion.circle
        cx="166"
        cy="75"
        r="6"
        fill="#60A5FA"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '120px 75px' }}
      />
    </g>
  );
}
