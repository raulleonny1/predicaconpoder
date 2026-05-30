"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { BiblePassage } from "@/lib/bible/types";
import type { BibleTranslationCode } from "@/lib/bible/translations";
import { parseTranslationCode } from "@/lib/bible/translations";
import {
  getContextualNotes,
  getStageBlocks,
  getSyncChannel,
  loadPresentation,
  loadSermon,
  loadTimer,
  loadTranslation,
  savePresentation,
  saveSermon,
  saveTimer,
  saveTranslation,
} from "@/lib/sermon/storage";
import { presentationKey, draftStorageKey } from "@/lib/sermon/user-scope";
import {
  deleteLocalSermon,
  loadLocalSermon,
  saveLocalSermon,
  sermonHasMeaningfulContent,
} from "@/lib/sermon/local-sermons";
import { saveCloudSermon } from "@/lib/sermon/cloud-sermons";
import {
  createBlockId,
  createDefaultSermon,
  type PresentationState,
  type SermonBlock,
  type SermonBlockType,
  type SermonDocument,
  type TimerState,
} from "@/lib/sermon/types";

type SermonContextValue = {
  sermon: SermonDocument;
  stageBlocks: SermonBlock[];
  contextualNotes: SermonBlock[];
  activeIndex: number;
  activeStageBlock: SermonBlock | undefined;
  blackScreen: boolean;
  hydrated: boolean;
  translation: BibleTranslationCode;
  timer: TimerState;
  timerDisplayMs: number;
  setTitle: (title: string) => void;
  setPresenterNotes: (notes: string) => void;
  setTranslation: (code: BibleTranslationCode) => void;
  updateBlock: (id: string, patch: Partial<SermonBlock>) => void;
  addBlock: (type: SermonBlockType, afterId?: string) => void;
  removeBlock: (id: string) => void;
  moveBlock: (id: string, direction: "up" | "down") => void;
  insertScripture: (passage: BiblePassage, afterId?: string) => void;
  setActiveIndex: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
  toggleBlackScreen: () => void;
  resetSermon: () => void;
  replaceSermon: (sermon: SermonDocument) => void;
  setCloudId: (cloudId?: string) => void;
  saveToLibrary: () => SermonDocument;
  loadFromLibrary: (savedId: string) => boolean;
  deleteFromLibrary: (savedId: string) => void;
  openNewSermonDialog: () => void;
  closeNewSermonDialog: () => void;
  confirmNewSermon: (saveFirst: boolean) => void;
  newSermonDialogOpen: boolean;
  needsSavePrompt: boolean;
  userId: string | null;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTimerTarget: (minutes: number | null) => void;
};

const SermonContext = createContext<SermonContextValue | null>(null);

function getTimerElapsed(timer: TimerState): number {
  if (!timer.running || !timer.startedAt) return timer.elapsedMs;
  return timer.elapsedMs + (Date.now() - timer.startedAt);
}

export function SermonProvider({
  children,
  userId,
  authReady,
}: {
  children: ReactNode;
  userId: string | null;
  authReady: boolean;
}) {
  const [sermon, setSermon] = useState<SermonDocument>(createDefaultSermon);
  const [activeIndex, setActiveIndexState] = useState(0);
  const [blackScreen, setBlackScreen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [translation, setTranslationState] = useState<BibleTranslationCode>("NVI");
  const [timer, setTimer] = useState<TimerState>({
    elapsedMs: 0,
    running: false,
    startedAt: null,
    targetMinutes: 45,
  });
  const [timerTick, setTimerTick] = useState(0);
  const [newSermonDialogOpen, setNewSermonDialogOpen] = useState(false);
  const timerRef = useRef(timer);
  const userIdRef = useRef(userId);
  const sermonRef = useRef(sermon);
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  userIdRef.current = userId;
  sermonRef.current = sermon;

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    setTranslationState(parseTranslationCode(loadTranslation()));
    setTimer(loadTimer());
  }, []);

  useEffect(() => {
    if (!authReady) return;

    const previousUser = prevUserIdRef.current;
    if (previousUser !== undefined && previousUser !== userId) {
      saveSermon(sermonRef.current, previousUser);
    }

    const loaded = loadSermon(userId);
    setSermon(loaded);
    setActiveIndexState(0);
    setBlackScreen(false);

    const pres = loadPresentation(userId);
    if (pres && pres.sermonId === loaded.id) {
      setActiveIndexState(pres.activeIndex);
      setBlackScreen(pres.blackScreen);
    }

    prevUserIdRef.current = userId;
    setHydrated(true);
  }, [userId, authReady]);

  const stageBlocks = useMemo(() => getStageBlocks(sermon), [sermon]);
  const activeStageBlock = stageBlocks[activeIndex];
  const contextualNotes = useMemo(
    () => getContextualNotes(sermon, activeStageBlock?.id),
    [sermon, activeStageBlock?.id],
  );

  const timerDisplayMs = useMemo(() => {
    void timerTick;
    return getTimerElapsed(timer);
  }, [timer, timerTick]);

  useEffect(() => {
    if (!timer.running) return;
    const id = setInterval(() => setTimerTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [timer.running]);

  const persistPresentation = useCallback(
    (index: number, black: boolean) => {
      savePresentation(
        {
          sermonId: sermon.id,
          activeIndex: index,
          blackScreen: black,
        },
        userIdRef.current,
      );
    },
    [sermon.id],
  );

  const setActiveIndex = useCallback(
    (index: number) => {
      const max = Math.max(0, stageBlocks.length - 1);
      const next = Math.min(Math.max(0, index), max);
      setActiveIndexState(next);
      persistPresentation(next, blackScreen);
    },
    [stageBlocks.length, blackScreen, persistPresentation],
  );

  const goNext = useCallback(() => setActiveIndex(activeIndex + 1), [activeIndex, setActiveIndex]);
  const goPrev = useCallback(() => setActiveIndex(activeIndex - 1), [activeIndex, setActiveIndex]);

  const toggleBlackScreen = useCallback(() => {
    setBlackScreen((b) => {
      const next = !b;
      persistPresentation(activeIndex, next);
      return next;
    });
  }, [activeIndex, persistPresentation]);

  const commitSermon = useCallback((next: SermonDocument) => {
    const updated = { ...next, updatedAt: new Date().toISOString() };
    setSermon(updated);
    saveSermon(updated, userIdRef.current);
  }, []);

  const setTitle = useCallback(
    (title: string) => commitSermon({ ...sermon, title }),
    [sermon, commitSermon],
  );

  const setPresenterNotes = useCallback(
    (presenterNotes: string) => commitSermon({ ...sermon, presenterNotes }),
    [sermon, commitSermon],
  );

  const setTranslation = useCallback((code: BibleTranslationCode) => {
    setTranslationState(code);
    saveTranslation(code);
  }, []);

  const replaceSermon = useCallback(
    (next: SermonDocument) => {
      commitSermon(next);
      setActiveIndexState(0);
      setBlackScreen(false);
      persistPresentation(0, false);
    },
    [commitSermon, persistPresentation],
  );

  const setCloudId = useCallback(
    (cloudId?: string) => {
      if (cloudId) {
        commitSermon({ ...sermon, cloudId });
      } else {
        const { cloudId: _removed, ...rest } = sermon;
        commitSermon(rest);
      }
    },
    [sermon, commitSermon],
  );

  const updateBlock = useCallback(
    (id: string, patch: Partial<SermonBlock>) => {
      commitSermon({
        ...sermon,
        blocks: sermon.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      });
    },
    [sermon, commitSermon],
  );

  const addBlock = useCallback(
    (type: SermonBlockType, afterId?: string) => {
      const block: SermonBlock = {
        id: createBlockId(),
        type,
        content:
          type === "heading"
            ? "Nueva sección"
            : type === "note"
              ? "Nota del presentador"
              : "Nuevo párrafo",
        showOnStage: type !== "note",
      };
      const blocks = [...sermon.blocks];
      if (afterId) {
        const idx = blocks.findIndex((b) => b.id === afterId);
        blocks.splice(idx + 1, 0, block);
      } else {
        blocks.push(block);
      }
      commitSermon({ ...sermon, blocks });
    },
    [sermon, commitSermon],
  );

  const removeBlock = useCallback(
    (id: string) => {
      if (sermon.blocks.length <= 1) return;
      commitSermon({ ...sermon, blocks: sermon.blocks.filter((b) => b.id !== id) });
    },
    [sermon, commitSermon],
  );

  const moveBlock = useCallback(
    (id: string, direction: "up" | "down") => {
      const idx = sermon.blocks.findIndex((b) => b.id === id);
      if (idx < 0) return;
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= sermon.blocks.length) return;
      const blocks = [...sermon.blocks];
      [blocks[idx], blocks[target]] = [blocks[target], blocks[idx]];
      commitSermon({ ...sermon, blocks });
    },
    [sermon, commitSermon],
  );

  const insertScripture = useCallback(
    (passage: BiblePassage, afterId?: string) => {
      const block: SermonBlock = {
        id: createBlockId(),
        type: "scripture",
        content: passage.reference,
        scripture: passage,
        showOnStage: true,
      };
      const blocks = [...sermon.blocks];
      if (afterId) {
        const idx = blocks.findIndex((b) => b.id === afterId);
        blocks.splice(idx + 1, 0, block);
      } else {
        blocks.push(block);
      }
      commitSermon({ ...sermon, blocks });
      const stage = getStageBlocks({ ...sermon, blocks });
      const newIdx = stage.findIndex((b) => b.id === block.id);
      if (newIdx >= 0) setActiveIndex(newIdx);
    },
    [sermon, commitSermon, setActiveIndex],
  );

  const resetSermon = useCallback(() => {
    replaceSermon(createDefaultSermon());
  }, [replaceSermon]);

  const needsSavePrompt = useMemo(() => sermonHasMeaningfulContent(sermon), [sermon]);

  const saveToLibrary = useCallback(() => {
    const saved = saveLocalSermon(userIdRef.current, sermon);
    setSermon(saved);
    saveSermon(saved, userIdRef.current);
    return saved;
  }, [sermon]);

  const loadFromLibrary = useCallback(
    (savedId: string) => {
      const loaded = loadLocalSermon(userIdRef.current, savedId);
      if (!loaded) return false;
      replaceSermon({ ...loaded, id: `sermon_${Date.now()}` });
      return true;
    },
    [replaceSermon],
  );

  const deleteFromLibrary = useCallback(
    (savedId: string) => {
      deleteLocalSermon(userIdRef.current, savedId);
      if (sermon.savedId === savedId) {
        const { savedId: _removed, ...rest } = sermon;
        commitSermon(rest);
      }
    },
    [sermon, commitSermon],
  );

  const openNewSermonDialog = useCallback(() => {
    if (needsSavePrompt) {
      setNewSermonDialogOpen(true);
    } else {
      resetSermon();
    }
  }, [needsSavePrompt, resetSermon]);

  const closeNewSermonDialog = useCallback(() => {
    setNewSermonDialogOpen(false);
  }, []);

  const confirmNewSermon = useCallback(
    (saveFirst: boolean) => {
      if (saveFirst) {
        const saved = saveToLibrary();
        const uid = userIdRef.current;
        if (uid) {
          void saveCloudSermon(uid, saved)
            .then((cloudId) => setCloudId(cloudId))
            .catch(() => {});
        }
      }
      resetSermon();
      setNewSermonDialogOpen(false);
    },
    [saveToLibrary, resetSermon, setCloudId],
  );

  const persistTimer = useCallback((next: TimerState) => {
    setTimer(next);
    saveTimer(next);
  }, []);

  const startTimer = useCallback(() => {
    const t = timerRef.current;
    if (t.running) return;
    persistTimer({ ...t, running: true, startedAt: Date.now() });
  }, [persistTimer]);

  const pauseTimer = useCallback(() => {
    const t = timerRef.current;
    if (!t.running) return;
    const elapsedMs = getTimerElapsed(t);
    persistTimer({ ...t, running: false, startedAt: null, elapsedMs });
  }, [persistTimer]);

  const resetTimer = useCallback(() => {
    persistTimer({
      elapsedMs: 0,
      running: false,
      startedAt: null,
      targetMinutes: timerRef.current.targetMinutes,
    });
  }, [persistTimer]);

  const setTimerTarget = useCallback(
    (targetMinutes: number | null) => {
      persistTimer({ ...timerRef.current, targetMinutes });
    },
    [persistTimer],
  );

  useEffect(() => {
    const channel = getSyncChannel();
    if (!channel) return;
    const onMessage = (ev: MessageEvent) => {
      if (ev.data?.type !== "presentation") return;
      const payload = ev.data.payload as PresentationState;
      if (payload.sermonId !== sermon.id) return;
      setActiveIndexState(payload.activeIndex);
      setBlackScreen(payload.blackScreen);
    };
    channel.addEventListener("message", onMessage);
    return () => channel.removeEventListener("message", onMessage);
  }, [sermon.id]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      const draftKey = draftStorageKey(userId);
      const presKey = presentationKey(userId);
      if (e.key === draftKey && e.newValue) {
        try {
          setSermon(JSON.parse(e.newValue) as SermonDocument);
        } catch {
          /* ignore */
        }
      }
      if (e.key === presKey && e.newValue) {
        try {
          const pres = JSON.parse(e.newValue) as PresentationState;
          if (pres.sermonId === sermon.id) {
            setActiveIndexState(pres.activeIndex);
            setBlackScreen(pres.blackScreen);
          }
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [sermon.id, userId]);

  const value = useMemo(
    () => ({
      sermon,
      stageBlocks,
      contextualNotes,
      activeIndex,
      activeStageBlock,
      blackScreen,
      hydrated,
      translation,
      timer,
      timerDisplayMs,
      setTitle,
      setPresenterNotes,
      setTranslation,
      updateBlock,
      addBlock,
      removeBlock,
      moveBlock,
      insertScripture,
      setActiveIndex,
      goNext,
      goPrev,
      toggleBlackScreen,
      resetSermon,
      replaceSermon,
      setCloudId,
      saveToLibrary,
      loadFromLibrary,
      deleteFromLibrary,
      openNewSermonDialog,
      closeNewSermonDialog,
      confirmNewSermon,
      newSermonDialogOpen,
      needsSavePrompt,
      userId,
      startTimer,
      pauseTimer,
      resetTimer,
      setTimerTarget,
    }),
    [
      sermon,
      stageBlocks,
      contextualNotes,
      activeIndex,
      activeStageBlock,
      blackScreen,
      hydrated,
      translation,
      timer,
      timerDisplayMs,
      setTitle,
      setPresenterNotes,
      setTranslation,
      updateBlock,
      addBlock,
      removeBlock,
      moveBlock,
      insertScripture,
      setActiveIndex,
      goNext,
      goPrev,
      toggleBlackScreen,
      resetSermon,
      replaceSermon,
      setCloudId,
      saveToLibrary,
      loadFromLibrary,
      deleteFromLibrary,
      openNewSermonDialog,
      closeNewSermonDialog,
      confirmNewSermon,
      newSermonDialogOpen,
      needsSavePrompt,
      userId,
      startTimer,
      pauseTimer,
      resetTimer,
      setTimerTarget,
    ],
  );

  return <SermonContext.Provider value={value}>{children}</SermonContext.Provider>;
}

export function useSermon() {
  const ctx = useContext(SermonContext);
  if (!ctx) throw new Error("useSermon debe usarse dentro de SermonProvider");
  return ctx;
}
