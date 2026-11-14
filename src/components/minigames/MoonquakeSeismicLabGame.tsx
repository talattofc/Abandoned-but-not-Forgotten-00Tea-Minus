import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MiniGameProps } from './LunarCraterCruiserGame';
import { MiniGameResultOverlay } from './MiniGameResultOverlay';

type TileKind = 'rtg' | 'hub' | 'seismo' | 'mag' | 'rock' | 'empty' | 'straight' | 'corner' | 'tee';

interface GridTile {
  id: string;
  kind: TileKind;
  rot: 0 | 1 | 2 | 3; // 90-deg clockwise steps
}

const ASSET_BASE = '/nasa/moon/NASA Apollo 12 ALSEP/apollo12_alsep_4_assets_transparent_png';
const IMG_RTG = encodeURI(`${ASSET_BASE}/01_snap27_nuclear_rtg.png`);
const IMG_HUB = encodeURI(`${ASSET_BASE}/02_central_station_helical_antenna.png`);
const IMG_SEISMO = encodeURI(`${ASSET_BASE}/03_passive_seismometer_dome.png`);
const IMG_MAG = encodeURI(`${ASSET_BASE}/04_lunar_surface_magnetometer.png`);
const IMG_ROCK_TILE = encodeURI('/minigames/moon/apollo 12/Aylı Kraterli Kaya Karo.png');

// Directions: 0 = Top, 1 = Right, 2 = Bottom, 3 = Left
const DIRS: Array<{ dr: number; dc: number; opp: number }> = [
  { dr: -1, dc: 0, opp: 2 },
  { dr: 0, dc: 1, opp: 3 },
  { dr: 1, dc: 0, opp: 0 },
  { dr: 0, dc: -1, opp: 1 },
];

function getPorts(tile: GridTile): number[] {
  let base: number[] = [];
  switch (tile.kind) {
    case 'rtg':
    case 'hub':
    case 'seismo':
    case 'mag':
      return [0, 1, 2, 3];
    case 'straight':
      base = [1, 3];
      break;
    case 'corner':
      base = [0, 1];
      break;
    case 'tee':
      base = [0, 1, 3];
      break;
    default:
      return [];
  }
  return base.map((d) => (d + tile.rot) % 4);
}

function isMovable(kind: TileKind): boolean {
  return kind === 'straight' || kind === 'corner' || kind === 'tee';
}

function createLevelGrid(level: 1 | 2): GridTile[][] {
  const mk = (id: string, kind: TileKind, rot: 0 | 1 | 2 | 3 = 0): GridTile => ({ id, kind, rot });

  if (level === 1) {
    return [
      [mk('00', 'corner', 1), mk('01', 'straight', 0), mk('02', 'rock'), mk('03', 'corner', 2), mk('04', 'empty')],
      [mk('10', 'straight', 1), mk('11', 'straight', 1), mk('12', 'corner', 0), mk('13', 'straight', 0), mk('14', 'corner', 3)],
      [mk('20', 'rtg'), mk('21', 'empty'), mk('22', 'hub'), mk('23', 'straight', 1), mk('24', 'seismo')],
      [mk('30', 'corner', 0), mk('31', 'straight', 0), mk('32', 'empty'), mk('33', 'corner', 3), mk('34', 'straight', 1)],
      [mk('40', 'straight', 0), mk('41', 'corner', 2), mk('42', 'rock'), mk('43', 'straight', 0), mk('44', 'corner', 1)],
    ];
  }

  // Level 2: Full ALSEP Network (RTG -> Hub -> T-junction -> Seismo & Mag)
  return [
    [mk('00', 'corner', 1), mk('01', 'straight', 0), mk('02', 'corner', 2), mk('03', 'corner', 0), mk('04', 'seismo')],
    [mk('10', 'straight', 1), mk('11', 'rock'), mk('12', 'straight', 0), mk('13', 'tee', 1), mk('14', 'straight', 1)],
    [mk('20', 'rtg'), mk('21', 'straight', 1), mk('22', 'hub'), mk('23', 'empty'), mk('24', 'rock')],
    [mk('30', 'corner', 0), mk('31', 'rock'), mk('32', 'empty'), mk('33', 'straight', 0), mk('34', 'corner', 3)],
    [mk('40', 'straight', 0), mk('41', 'corner', 2), mk('42', 'straight', 0), mk('43', 'corner', 2), mk('44', 'mag')],
  ];
}

export function MoonquakeSeismicLabGame({
  accentColor,
  alreadyCompleted,
  onWin,
  onBackToHub,
}: MiniGameProps) {
  const [level, setLevel] = useState<1 | 2>(1);
  const [grid, setGrid] = useState<GridTile[][]>(() => createLevelGrid(1));
  const [toolMode, setToolMode] = useState<'smart' | 'rotate'>('smart');
  const [dragFrom, setDragFrom] = useState<{ r: number; c: number } | null>(null);
  const [status, setStatus] = useState<'playing' | 'level1-clear' | 'won'>('playing');
  const [wonAwarded, setWonAwarded] = useState(false);

  // BFS from SNAP-27 RTG to compute all live powered cells
  const poweredSet = useMemo(() => {
    const visited = new Set<string>();
    let start: [number, number] | null = null;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (grid[r][c].kind === 'rtg') start = [r, c];
      }
    }
    if (!start) return visited;

    const queue: Array<[number, number]> = [start];
    visited.add(`${start[0]},${start[1]}`);

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const ports = getPorts(grid[r][c]);
      for (const d of ports) {
        const nr = r + DIRS[d].dr;
        const nc = c + DIRS[d].dc;
        if (nr < 0 || nr >= 5 || nc < 0 || nc >= 5) continue;
        const key = `${nr},${nc}`;
        if (visited.has(key)) continue;
        const neighborPorts = getPorts(grid[nr][nc]);
        if (neighborPorts.includes(DIRS[d].opp)) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }
    return visited;
  }, [grid]);

  // Check if Hub + required instruments are powered
  const hubPowered = useMemo(() => {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (grid[r][c].kind === 'hub' && poweredSet.has(`${r},${c}`)) return true;
      }
    }
    return false;
  }, [grid, poweredSet]);

  const seismoPowered = useMemo(() => {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (grid[r][c].kind === 'seismo' && poweredSet.has(`${r},${c}`)) return true;
      }
    }
    return false;
  }, [grid, poweredSet]);

  const magPowered = useMemo(() => {
    if (level === 1) return true;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (grid[r][c].kind === 'mag' && poweredSet.has(`${r},${c}`)) return true;
      }
    }
    return false;
  }, [grid, poweredSet, level]);

  const allPowered = hubPowered && seismoPowered && magPowered;

  useEffect(() => {
    if (!allPowered || status !== 'playing') return;
    const timer = window.setTimeout(() => {
      if (level === 1) {
        setStatus('level1-clear');
      } else {
        setStatus('won');
        if (!wonAwarded) {
          setWonAwarded(true);
          onWin();
        }
      }
    }, 550);
    return () => window.clearTimeout(timer);
  }, [allPowered, status, level, wonAwarded, onWin]);

  const findAdjacentEmpty = (r: number, c: number): [number, number] | null => {
    for (const d of DIRS) {
      const nr = r + d.dr;
      const nc = c + d.dc;
      if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5 && grid[nr][nc].kind === 'empty') {
        return [nr, nc];
      }
    }
    return null;
  };

  const rotateTile = (r: number, c: number) => {
    if (status !== 'playing') return;
    setGrid((prev) =>
      prev.map((row, ri) =>
        row.map((cell, ci) =>
          ri === r && ci === c && isMovable(cell.kind)
            ? { ...cell, rot: ((cell.rot + 1) % 4) as 0 | 1 | 2 | 3 }
            : cell,
        ),
      ),
    );
  };

  const swapCells = (r1: number, c1: number, r2: number, c2: number) => {
    if (status !== 'playing') return;
    setGrid((prev) => {
      const copy = prev.map((row) => [...row]);
      const temp = copy[r1][c1];
      copy[r1][c1] = copy[r2][c2];
      copy[r2][c2] = temp;
      return copy;
    });
  };

  const handleTileClick = (r: number, c: number) => {
    if (status !== 'playing') return;
    const tile = grid[r][c];
    if (!isMovable(tile.kind)) return;

    if (toolMode === 'rotate') {
      rotateTile(r, c);
      return;
    }

    const adjEmpty = findAdjacentEmpty(r, c);
    if (adjEmpty) {
      swapCells(r, c, adjEmpty[0], adjEmpty[1]);
    } else {
      rotateTile(r, c);
    }
  };

  const handleResetGrid = useCallback(() => {
    setGrid(createLevelGrid(level));
    setStatus('playing');
  }, [level]);

  const handleFullRestart = useCallback(() => {
    setLevel(1);
    setGrid(createLevelGrid(1));
    setStatus('playing');
    setWonAwarded(false);
  }, []);

  const startLevel2 = () => {
    setLevel(2);
    setGrid(createLevelGrid(2));
    setStatus('playing');
  };

  const renderCableSvg = (tile: GridTile, powered: boolean) => {
    const ports = getPorts(tile);
    const stroke = powered ? '#34D399' : '#475569';
    const center = 50;
    const ends: Record<number, [number, number]> = {
      0: [50, 0],
      1: [100, 50],
      2: [50, 100],
      3: [0, 50],
    };

    return (
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {ports.map((p) => (
          <line
            key={p}
            x1={center}
            y1={center}
            x2={ends[p][0]}
            y2={ends[p][1]}
            stroke={stroke}
            strokeWidth="14"
            strokeLinecap="round"
          />
        ))}
        <circle cx={center} cy={center} r="9" fill={powered ? '#A7F3D0' : '#64748B'} />
      </svg>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-[#0E1320] px-3.5 py-2">
        <p className="font-sans text-xs font-semibold text-ink">
          {level === 1
            ? 'Level 1 (Warm-Up): Route ~73 W power from SNAP-27 RTG → Central Station → Seismometer!'
            : 'Level 2 (Full ALSEP Network): Route power through Central Station to BOTH Seismometer & Magnetometer!'}
        </p>
        <div className="flex items-center gap-3 font-mono text-xs font-bold">
          <span className="text-amber-300">LEVEL {level}/2</span>
          <span className={allPowered ? 'text-emerald-300' : 'text-sky-300'}>
            {allPowered ? 'ALSEP ONLINE ✓' : 'ROUTING POWER...'}
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setToolMode('smart')}
            className={`rounded-lg border px-3 py-1.5 font-sans text-xs font-bold ${
              toolMode === 'smart'
                ? 'border-emerald-400 bg-[#0F2420] text-emerald-300'
                : 'border-line bg-[#0E1320] text-muted'
            }`}
          >
            Slide / Auto-Rotate
          </button>
          <button
            type="button"
            onClick={() => setToolMode('rotate')}
            className={`rounded-lg border px-3 py-1.5 font-sans text-xs font-bold ${
              toolMode === 'rotate'
                ? 'border-sky-400 bg-[#101C2E] text-sky-300'
                : 'border-line bg-[#0E1320] text-muted'
            }`}
          >
            ↻ Rotate Only (90°)
          </button>
        </div>

        <button
          type="button"
          onClick={handleResetGrid}
          className="rounded-lg border border-line-strong bg-[#0E1320] px-3.5 py-1.5 font-sans text-xs font-bold text-ink hover:border-ink"
        >
          Reset Grid
        </button>
      </div>

      {/* 5x5 Lunar Surface Grid */}
      <div className="relative rounded-xl border border-line bg-[#070A12] p-4">
        <div className="mx-auto grid max-w-[520px] grid-cols-5 gap-2">
          {grid.map((row, r) =>
            row.map((tile, c) => {
              const powered = poweredSet.has(`${r},${c}`);
              const movable = isMovable(tile.kind);
              const adjEmpty = movable ? findAdjacentEmpty(r, c) : null;

              if (tile.kind === 'empty') {
                return (
                  <div
                    key={`${r}-${c}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (
                        dragFrom &&
                        Math.abs(dragFrom.r - r) + Math.abs(dragFrom.c - c) === 1
                      ) {
                        swapCells(dragFrom.r, dragFrom.c, r, c);
                      }
                      setDragFrom(null);
                    }}
                    className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-line-strong bg-[#090D16] font-mono text-[10px] text-muted"
                  >
                    EMPTY
                  </div>
                );
              }

              if (tile.kind === 'rock') {
                return (
                  <div
                    key={`${r}-${c}`}
                    className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-line bg-[#181C28]"
                  >
                    <img
                      src={IMG_ROCK_TILE}
                      alt="Lunar Crater Obstacle"
                      className="h-full w-full object-cover opacity-90"
                    />
                  </div>
                );
              }

              if (tile.kind === 'rtg' || tile.kind === 'hub' || tile.kind === 'seismo' || tile.kind === 'mag') {
                const imgSrc =
                  tile.kind === 'rtg'
                    ? IMG_RTG
                    : tile.kind === 'hub'
                      ? IMG_HUB
                      : tile.kind === 'seismo'
                        ? IMG_SEISMO
                        : IMG_MAG;
                const label =
                  tile.kind === 'rtg'
                    ? 'SNAP-27'
                    : tile.kind === 'hub'
                      ? 'CENTRAL'
                      : tile.kind === 'seismo'
                        ? 'SEISMO'
                        : 'MAG';

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`relative flex aspect-square flex-col items-center justify-center rounded-lg border p-1.5 ${
                      powered
                        ? 'border-emerald-400 bg-[#0F2420]'
                        : 'border-line-strong bg-[#0E1320]'
                    }`}
                  >
                    <img src={imgSrc} alt={label} className="h-10 w-10 object-contain sm:h-12 sm:w-12" />
                    <span
                      className={`mt-0.5 font-mono text-[9px] font-bold ${
                        powered ? 'text-emerald-300' : 'text-muted'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              }

              // Movable cable tile
              return (
                <div
                  key={`${r}-${c}`}
                  draggable={movable}
                  onDragStart={() => setDragFrom({ r, c })}
                  onDragEnd={() => setDragFrom(null)}
                  onClick={() => handleTileClick(r, c)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTileClick(r, c);
                    }
                  }}
                  aria-label={`Cable tile ${tile.kind}`}
                  className={`relative aspect-square cursor-pointer rounded-lg border transition-colors ${
                    powered
                      ? 'border-emerald-400/70 bg-[#0F2420]'
                      : 'border-line bg-[#0E1320] hover:border-line-strong'
                  }`}
                >
                  {renderCableSvg(tile, powered)}
                  <button
                    type="button"
                    aria-label="Rotate cable 90 degrees"
                    onClick={(e) => {
                      e.stopPropagation();
                      rotateTile(r, c);
                    }}
                    className="absolute right-1 top-1 rounded border border-line bg-[#070A12] px-1 text-[10px] font-bold text-ink hover:border-sky-400"
                  >
                    ↻
                  </button>
                  {adjEmpty && (
                    <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-[#070A12] px-1 font-mono text-[8px] text-sky-300">
                      SLIDE
                    </span>
                  )}
                </div>
              );
            }),
          )}
        </div>

        {/* Level 1 Clear Overlay */}
        {status === 'level1-clear' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#070A12]/90 p-4">
            <div className="panel w-full max-w-md rounded-xl border p-6 text-center">
              <div className="mx-auto inline-flex rounded-md border border-emerald-400/50 bg-[#0F2420] px-2.5 py-1 font-mono text-xs font-bold text-emerald-300">
                LEVEL 1 COMPLETE ✓
              </div>
              <h4 className="mt-3 font-display text-xl font-bold text-ink">
                Seismometer Powered!
              </h4>
              <p className="mt-2 font-sans text-sm text-muted">
                SNAP-27 nuclear power is flowing through the Central Station! Next: connect BOTH the Seismometer and Magnetometer!
              </p>
              <button
                type="button"
                onClick={startLevel2}
                className="mt-5 rounded-lg px-5 py-2.5 font-sans text-sm font-bold text-space"
                style={{ backgroundColor: accentColor }}
              >
                Start Level 2: Full ALSEP Network →
              </button>
            </div>
          </div>
        )}

        {/* Final Win Overlay */}
        {status === 'won' && (
          <MiniGameResultOverlay
            status="won"
            title="ALSEP NETWORK ONLINE!"
            summary="Measuring Moonquakes & Magnetic Fields! Data pulses are beaming from the Central Station’s helical antenna back to Earth!"
            accentColor={accentColor}
            alreadyCompleted={alreadyCompleted}
            onRetry={handleFullRestart}
            onBackToHub={onBackToHub}
          />
        )}
      </div>

      <p className="font-sans text-xs text-muted">
        Tip: Green cables (#34D399) show live ~73 W nuclear power flowing from SNAP-27. Tap ↻ on any tile to rotate 90°, or click/drag a tile next to an EMPTY slot to slide it!
      </p>
    </div>
  );
}
