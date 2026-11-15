import { useState } from 'react';
import type { HardwareId, HardwareItem } from '../data/hardwareData';
import { DustStormBlueberryHuntGame } from './minigames/DustStormBlueberryHuntGame';
import { ExoplanetTransitHunterGame } from './minigames/ExoplanetTransitHunterGame';
import { JupiterGravitySlingshotGame } from './minigames/JupiterGravitySlingshotGame';
import { LunarCraterCruiserGame } from './minigames/LunarCraterCruiserGame';
import { MoonquakeSeismicLabGame } from './minigames/MoonquakeSeismicLabGame';
import { ThinAirFlightControlGame } from './minigames/ThinAirFlightControlGame';

interface MiniGameViewProps {
  hardware: HardwareItem;
  accentColor: string;
  miniGameCompleted: boolean;
  onCompleteMiniGame: (id: HardwareId, coinsEarned: number) => void;
  onBack: () => void;
}

export function MiniGameView({
  hardware,
  accentColor,
  miniGameCompleted,
  onCompleteMiniGame,
  onBack,
}: MiniGameViewProps) {
  const [launched, setLaunched] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState<50 | 25 | null>(null);

  const handleWin = () => {
    const reward: 50 | 25 = miniGameCompleted ? 25 : 50;
    setEarnedCoins(reward);
    onCompleteMiniGame(hardware.id, reward);
  };

  const renderSimulation = () => {
    const props = {
      accentColor,
      alreadyCompleted: earnedCoins !== null ? earnedCoins === 25 : miniGameCompleted,
      onWin: handleWin,
      onBackToHub: onBack,
    };

    switch (hardware.id) {
      case 'lrv-1':
        return <LunarCraterCruiserGame {...props} />;
      case 'apollo-12-alsep':
        return <MoonquakeSeismicLabGame {...props} />;
      case 'spirit-opportunity':
        return <DustStormBlueberryHuntGame {...props} />;
      case 'ingenuity':
        return <ThinAirFlightControlGame {...props} />;
      case 'pioneer-10':
        return <JupiterGravitySlingshotGame {...props} />;
      case 'kepler':
        return <ExoplanetTransitHunterGame {...props} />;
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1480px] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="panel rounded-lg px-3.5 py-2 font-sans text-xs font-bold text-ink transition-colors hover:border-line-strong sm:text-sm"
        >
          ← Back to {hardware.shortName}
        </button>
        <span
          className="rounded-lg border px-2.5 py-1 font-mono text-xs font-bold"
          style={{ backgroundColor: '#101522', color: accentColor, borderColor: `${accentColor}55` }}
        >
          {miniGameCompleted ? 'Simulation Completed ✓ · +25 Replay Coins' : 'Mission Simulation · +50 Coins'}
        </span>
      </div>

      <div className="panel rounded-xl p-5">
        <h3 className="font-display text-xl font-bold text-ink">{hardware.miniGame.title}</h3>
        <p className="mt-0.5 font-sans text-sm text-muted">{hardware.miniGame.subtitle}</p>

        <div className="mt-4 rounded-xl border border-line bg-space p-4">
          {!launched ? (
            <div className="grid gap-4 md:grid-cols-[1fr_1.1fr] md:items-center">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-line bg-[#0B1020]">
                <img src={hardware.heroImage} alt={hardware.name} className="h-full w-full object-contain p-3" />
                <span className="pointer-events-none absolute left-2 top-2 rounded border border-line bg-[#070A12]/90 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-muted">
                  AI GENERATED ILLUSTRATION
                </span>
              </div>
              <div className="space-y-3">
                <p className="font-sans text-sm leading-relaxed text-ink">{hardware.miniGame.instructions}</p>
                <div className="rounded-lg border border-line bg-card px-3 py-2 font-mono text-xs text-muted">
                  Controls: {hardware.miniGame.controlsHint}
                </div>
                <button
                  type="button"
                  onClick={() => setLaunched(true)}
                  className="w-full rounded-lg px-4 py-2.5 font-sans text-sm font-bold text-space transition-opacity hover:opacity-90"
                  style={{ backgroundColor: accentColor }}
                >
                  Launch Simulation
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {renderSimulation()}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-[#0E1320] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                <span>AI GENERATED ILLUSTRATION • Educational Simulation – Simplified Model</span>
                <span>00Tea-Minus Mission Sim</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
