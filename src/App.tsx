import { MotionConfig } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AvatarShopModal } from './components/AvatarShopModal';
import { CreditsModal, TurkishFlagSvg } from './components/CreditsModal';
import { DestinationView } from './components/DestinationView';
import { HardwareDetailView } from './components/HardwareDetailView';
import { QuickDock } from './components/QuickDock';
import { SolarSystemMap } from './components/SolarSystemMap';
import { StarField } from './components/StarField';
import { TopHUD } from './components/TopHUD';
import { ViewErrorBoundary } from './components/ViewErrorBoundary';
import { avatarFrames, avatars, type Avatar, type AvatarFrame } from './data/avatars';
import { getDestination, totalHardware, type DestinationId } from './data/destinationsData';
import { getHardwareById, type HardwareId } from './data/hardwareData';
import { playClick, playSuccess, setSoundEnabled } from './utils/soundEffects';

const SAVE_KEY = 'abandoned_not_forgotten_save_v1';

interface SaveState {
  coins: number;
  discoveredIds: string[];
  storyCompletedIds: string[];
  blueprintVerifiedIds: string[];
  miniGameCompletedIds: string[];
  quizCompletedIds: string[];
  avatarId: string;
  unlockedAvatarIds: string[];
  activeFrameId: string;
  unlockedFrameIds: string[];
  explorerName: string;
  soundEnabled: boolean;
}

function defaultSave(): SaveState {
  return {
    coins: 150,
    discoveredIds: [],
    storyCompletedIds: [],
    blueprintVerifiedIds: [],
    miniGameCompletedIds: [],
    quizCompletedIds: [],
    avatarId: avatars[0].id,
    unlockedAvatarIds: [avatars[0].id],
    activeFrameId: 'default',
    unlockedFrameIds: ['default'],
    explorerName: 'Explorer Nova',
    soundEnabled: true,
  };
}

function loadSave(): SaveState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultSave();
    const parsed = JSON.parse(raw) as Partial<SaveState>;
    const unlockedAvatars = Array.isArray(parsed.unlockedAvatarIds)
      ? Array.from(new Set([avatars[0].id, ...parsed.unlockedAvatarIds]))
      : [avatars[0].id];
    const unlockedFrames = Array.isArray(parsed.unlockedFrameIds)
      ? Array.from(new Set(['default', ...parsed.unlockedFrameIds]))
      : ['default'];
    return {
      coins: typeof parsed.coins === 'number' ? parsed.coins : 150,
      discoveredIds: Array.isArray(parsed.discoveredIds) ? parsed.discoveredIds : [],
      storyCompletedIds: Array.isArray(parsed.storyCompletedIds) ? parsed.storyCompletedIds : [],
      blueprintVerifiedIds: Array.isArray(parsed.blueprintVerifiedIds) ? parsed.blueprintVerifiedIds : [],
      miniGameCompletedIds: Array.isArray(parsed.miniGameCompletedIds) ? parsed.miniGameCompletedIds : [],
      quizCompletedIds: Array.isArray(parsed.quizCompletedIds) ? parsed.quizCompletedIds : [],
      avatarId: typeof parsed.avatarId === 'string' ? parsed.avatarId : avatars[0].id,
      unlockedAvatarIds: unlockedAvatars,
      activeFrameId: typeof parsed.activeFrameId === 'string' ? parsed.activeFrameId : 'default',
      unlockedFrameIds: unlockedFrames,
      explorerName: typeof parsed.explorerName === 'string' ? parsed.explorerName : 'Explorer Nova',
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
    };
  } catch {
    return defaultSave();
  }
}

export default function App() {
  const [save, setSave] = useState<SaveState>(loadSave);
  const [selectedDestination, setSelectedDestination] = useState<DestinationId | null>(null);
  const [selectedHardwareId, setSelectedHardwareId] = useState<HardwareId | null>(null);
  const [highlightId, setHighlightId] = useState<DestinationId | null>(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const mapViewRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setSoundEnabled(save.soundEnabled);
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch {
      // Ignore storage quota errors
    }
  }, [save]);

  const handleToggleSound = useCallback(() => {
    setSave((prev) => {
      const nextEnabled = !prev.soundEnabled;
      setSoundEnabled(nextEnabled);
      if (nextEnabled) playClick();
      return { ...prev, soundEnabled: nextEnabled };
    });
  }, []);

  const avatar = avatars.find((a) => a.id === save.avatarId) ?? avatars[0];
  const activeFrame = avatarFrames.find((f) => f.id === save.activeFrameId) ?? avatarFrames[0];

  const handleSelectOrBuyAvatar = useCallback((next: Avatar) => {
    setSave((prev) => {
      const owned = prev.unlockedAvatarIds.includes(next.id) || next.cost === 0;
      if (owned) {
        return {
          ...prev,
          avatarId: next.id,
          unlockedAvatarIds: prev.unlockedAvatarIds.includes(next.id)
            ? prev.unlockedAvatarIds
            : [...prev.unlockedAvatarIds, next.id],
        };
      }
      if (prev.coins < next.cost) return prev;
      return {
        ...prev,
        coins: prev.coins - next.cost,
        avatarId: next.id,
        unlockedAvatarIds: [...prev.unlockedAvatarIds, next.id],
      };
    });
  }, []);

  const handleSelectOrBuyFrame = useCallback((next: AvatarFrame) => {
    setSave((prev) => {
      const owned = prev.unlockedFrameIds.includes(next.id) || next.cost === 0;
      if (owned) {
        return {
          ...prev,
          activeFrameId: next.id,
          unlockedFrameIds: prev.unlockedFrameIds.includes(next.id)
            ? prev.unlockedFrameIds
            : [...prev.unlockedFrameIds, next.id],
        };
      }
      if (prev.coins < next.cost) return prev;
      return {
        ...prev,
        coins: prev.coins - next.cost,
        activeFrameId: next.id,
        unlockedFrameIds: [...prev.unlockedFrameIds, next.id],
      };
    });
  }, []);

  const handleChangeExplorerName = useCallback((name: string) => {
    setSave((prev) => ({ ...prev, explorerName: name }));
  }, []);

  const handleSelectDestination = useCallback((id: DestinationId) => {
    playClick();
    const target = document.querySelector<HTMLElement>(`[data-dest-id="${id}"]`);
    const view = mapViewRef.current;
    if (target && view) {
      const t = target.getBoundingClientRect();
      const v = view.getBoundingClientRect();
      view.style.transformOrigin = `${t.left + t.width / 2 - v.left}px ${t.top + t.height / 2 - v.top}px`;
    }
    setHighlightId(null);
    setSelectedHardwareId(null);
    setSelectedDestination(id);
  }, []);

  const handleMarkDiscovered = useCallback((id: HardwareId) => {
    setSave((prev) =>
      prev.discoveredIds.includes(id) ? prev : { ...prev, discoveredIds: [...prev.discoveredIds, id] },
    );
  }, []);

  const handleCompleteStory = useCallback((id: HardwareId) => {
    setSave((prev) =>
      prev.storyCompletedIds.includes(id)
        ? prev
        : { ...prev, storyCompletedIds: [...prev.storyCompletedIds, id] },
    );
  }, []);

  const handleVerifyBlueprint = useCallback((id: HardwareId, bonusCoins: number) => {
    setSave((prev) => {
      const alreadyVerified = prev.blueprintVerifiedIds.includes(id);
      return {
        ...prev,
        coins: prev.coins + (alreadyVerified ? 0 : bonusCoins),
        blueprintVerifiedIds: alreadyVerified
          ? prev.blueprintVerifiedIds
          : [...prev.blueprintVerifiedIds, id],
      };
    });
  }, []);

  const handleCompleteMiniGame = useCallback((id: HardwareId, _coinsEarned?: number) => {
    playSuccess();
    setSave((prev) => {
      const alreadyDone = prev.miniGameCompletedIds.includes(id);
      const reward = alreadyDone ? 25 : 50;
      return {
        ...prev,
        coins: prev.coins + reward,
        miniGameCompletedIds: alreadyDone ? prev.miniGameCompletedIds : [...prev.miniGameCompletedIds, id],
      };
    });
  }, []);

  const handleCompleteQuiz = useCallback((id: HardwareId, coinsEarned: number) => {
    setSave((prev) => {
      const nextDiscovered = prev.discoveredIds.includes(id) ? prev.discoveredIds : [...prev.discoveredIds, id];
      const alreadyDone = prev.quizCompletedIds.includes(id);
      const nextQuiz = alreadyDone ? prev.quizCompletedIds : [...prev.quizCompletedIds, id];
      return {
        ...prev,
        coins: prev.coins + (alreadyDone ? 0 : coinsEarned),
        discoveredIds: nextDiscovered,
        quizCompletedIds: nextQuiz,
      };
    });
  }, []);

  const openShop = useCallback(() => {
    playClick();
    setShopOpen(true);
  }, []);
  const closeShop = useCallback(() => {
    playClick();
    setShopOpen(false);
  }, []);
  const openCredits = useCallback(() => {
    playClick();
    setCreditsOpen(true);
  }, []);
  const closeCredits = useCallback(() => {
    setCreditsOpen(false);
  }, []);
  const handleBackToMap = useCallback(() => {
    playClick();
    setSelectedHardwareId(null);
    setSelectedDestination(null);
  }, []);
  const handleBackToDest = useCallback(() => {
    playClick();
    setSelectedHardwareId(null);
  }, []);

  const selectedDest = selectedDestination ? getDestination(selectedDestination) : undefined;
  const selectedHw = selectedHardwareId ? getHardwareById(selectedHardwareId) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedDestination, selectedHardwareId]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative flex min-h-[100dvh] flex-col overflow-x-hidden bg-space font-sans text-ink">
        <StarField />

        <TopHUD
          explorerName={save.explorerName}
          avatar={avatar}
          frame={activeFrame}
          coins={save.coins}
          discovered={save.discoveredIds.length}
          total={totalHardware}
          soundEnabled={save.soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenShop={openShop}
        />

        <ViewErrorBoundary onReset={handleBackToMap}>
          {selectedDest && selectedHw ? (
            <HardwareDetailView
              key={`hw-${selectedHw.id}`}
              dest={selectedDest}
              hardware={selectedHw}
              isDiscovered={save.discoveredIds.includes(selectedHw.id)}
              storyCompleted={save.storyCompletedIds.includes(selectedHw.id)}
              blueprintVerified={save.blueprintVerifiedIds.includes(selectedHw.id)}
              miniGameCompleted={save.miniGameCompletedIds.includes(selectedHw.id)}
              quizCompleted={save.quizCompletedIds.includes(selectedHw.id)}
              onMarkDiscovered={handleMarkDiscovered}
              onCompleteStory={handleCompleteStory}
              onVerifyBlueprint={handleVerifyBlueprint}
              onCompleteMiniGame={handleCompleteMiniGame}
              onCompleteQuiz={handleCompleteQuiz}
              onBack={handleBackToDest}
            />
          ) : selectedDest ? (
            <DestinationView
              key={`dest-${selectedDest.id}`}
              dest={selectedDest}
              discoveredIds={save.discoveredIds}
              onSelectHardware={setSelectedHardwareId}
              onBack={handleBackToMap}
            />
          ) : (
            <main
              key="map"
              ref={mapViewRef}
              className="relative flex min-h-0 flex-1 flex-col"
            >
              <SolarSystemMap highlightId={highlightId} onSelect={handleSelectDestination} />
              <QuickDock onSelect={handleSelectDestination} onHighlight={setHighlightId} />
            </main>
          )}
        </ViewErrorBoundary>

        <footer className="relative z-20 flex flex-wrap items-center justify-center gap-3 border-t border-line bg-[#070A12] px-4 py-3 text-center font-sans text-xs text-muted">
          <span>
            MISSION ECHO — The Stories Behind Space Exploration • by 00Tea-Minus | Uses scientific information, imagery,
            and mission resources from NASA Science, NASA NSSDCA, JPL-Caltech, and NASA Ames Research Center.
          </span>
          <button
            type="button"
            onClick={openCredits}
            className="inline-flex items-center gap-1.5 rounded-md border border-line-strong bg-[#0E1320] px-2.5 py-1 font-sans text-xs font-bold text-ink transition-colors hover:border-deep hover:text-deep"
          >
            <TurkishFlagSvg width={16} height={11} />
            <span>About, Credits &amp; AI Disclosure</span>
          </button>
        </footer>

        <CreditsModal open={creditsOpen} onClose={closeCredits} />

        <AvatarShopModal
          open={shopOpen}
          coins={save.coins}
          currentAvatarId={avatar.id}
          unlockedAvatarIds={save.unlockedAvatarIds}
          activeFrameId={activeFrame.id}
          unlockedFrameIds={save.unlockedFrameIds}
          explorerName={save.explorerName}
          discoveredCount={save.discoveredIds.length}
          onSelectAvatar={handleSelectOrBuyAvatar}
          onSelectFrame={handleSelectOrBuyFrame}
          onChangeExplorerName={handleChangeExplorerName}
          onClose={closeShop}
        />
      </div>
    </MotionConfig>
  );
}
