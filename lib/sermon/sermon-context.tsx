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
  loadAnnotations,
  loadPresentation,
  loadSermon,
  loadTimer,
  loadTranslation,
  saveAnnotations,
  savePresentation,
  saveSermon,
  saveTimer,
  saveTranslation,
} from "@/lib/sermon/storage";
import { presentationKey, draftStorageKey, annotationsKey } from "@/lib/sermon/user-scope";
import {
  deleteLocalSermon,
  loadLocalSermon,
  saveLocalSermon,
  sermonHasMeaningfulContent,
} from "@/lib/sermon/local-sermons";
import { saveCloudSermon } from "@/lib/sermon/cloud-sermons";
import {
  pushLiveAnnotations,
  pushLivePresentation,
  pushLiveSermon,
  shouldApplyRemoteSermon,
  shouldPushLocalSermon,
  subscribeLiveAnnotations,
  subscribeLivePresentation,
  subscribeLiveSermon,
} from "@/lib/sermon/live-sync";
import {
  createBlockId,
  createDefaultSermon,
  type PresentationState,
  type SermonBlock,
  type SermonBlockType,
  type SermonDocument,
  type TimerState,
} from "@/lib/sermon/types";
import {
  createDefaultAnnotationsState,
  createEmptySlideAnnotations,
  normalizeSlideAnnotations,
  type AnnotationTool,
  type DrawPath,
  type SlideAnnotations,
  type StageAnnotationsState,
  type WhiteboardColor,
} from "@/lib/sermon/stage-annotations";

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
  insertScripture: (passage: BiblePassage, targetBlockId?: string) => void;
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
  whiteboardMode: boolean;
  annotationTool: AnnotationTool;
  annotationColor: WhiteboardColor;
  setWhiteboardMode: (on: boolean) => void;
  setAnnotationTool: (tool: AnnotationTool) => void;
  setAnnotationColor: (color: WhiteboardColor) => void;
  getBlockAnnotations: (blockId: string) => SlideAnnotations;
  addDrawPath: (blockId: string, path: DrawPath) => void;
  removeDrawPaths: (blockId: string, pathIds: string[]) => void;
  clearBlockAnnotations: (blockId: string) => void;
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
  const [annotations, setAnnotations] = useState<StageAnnotationsState>(() =>
    createDefaultAnnotationsState(""),
  );
  const timerRef = useRef(timer);
  const userIdRef = useRef(userId);
  const sermonRef = useRef(sermon);
  const prevUserIdRef = useRef<string | null | undefined>(undefined);
  const sermonPushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const annotationsPushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const applyingRemoteRef = useRef(false);
  const lastLocalPresentationMsRef = useRef(0);
  const lastLocalAnnotationsMsRef = useRef(0);

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

    const storedAnnotations = loadAnnotations(userId);
    if (storedAnnotations?.sermonId === loaded.id) {
      setAnnotations(storedAnnotations);
    } else {
      setAnnotations(createDefaultAnnotationsState(loaded.id));
    }

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

  const persistAnnotations = useCallback(
    (updater: StageAnnotationsState | ((prev: StageAnnotationsState) => StageAnnotationsState)) => {
      setAnnotations((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        saveAnnotations(next, userIdRef.current);

        const uid = userIdRef.current;
        if (uid && !applyingRemoteRef.current) {
          const stamp = Date.now();
          lastLocalAnnotationsMsRef.current = stamp;
          if (annotationsPushTimerRef.current) clearTimeout(annotationsPushTimerRef.current);
          annotationsPushTimerRef.current = setTimeout(() => {
            void pushLiveAnnotations(uid, next, stamp).catch(() => {});
          }, 350);
        }

        return next;
      });
    },
    [],
  );

  const getBlockAnnotations = useCallback(
    (blockId: string): SlideAnnotations => {
      return normalizeSlideAnnotations(annotations.byBlockId[blockId]);
    },
    [annotations.byBlockId],
  );

  const patchBlockAnnotations = useCallback(
    (blockId: string, patch: SlideAnnotations) => {
      persistAnnotations((prev) => ({
        ...prev,
        sermonId: sermon.id,
        byBlockId: { ...prev.byBlockId, [blockId]: patch },
      }));
    },
    [persistAnnotations, sermon.id],
  );

  const setWhiteboardMode = useCallback(
    (on: boolean) => {
      persistAnnotations((prev) => ({ ...prev, sermonId: sermon.id, whiteboardMode: on }));
    },
    [persistAnnotations, sermon.id],
  );

  const setAnnotationTool = useCallback(
    (tool: AnnotationTool) => {
      persistAnnotations((prev) => ({ ...prev, sermonId: sermon.id, activeTool: tool }));
    },
    [persistAnnotations, sermon.id],
  );

  const setAnnotationColor = useCallback(
    (color: WhiteboardColor) => {
      persistAnnotations((prev) => ({ ...prev, sermonId: sermon.id, activeColor: color }));
    },
    [persistAnnotations, sermon.id],
  );

  const addDrawPath = useCallback(
    (blockId: string, path: DrawPath) => {
      const current = getBlockAnnotations(blockId);
      patchBlockAnnotations(blockId, {
        paths: [...current.paths, path],
      });
    },
    [getBlockAnnotations, patchBlockAnnotations],
  );

  const removeDrawPaths = useCallback(
    (blockId: string, pathIds: string[]) => {
      const current = getBlockAnnotations(blockId);
      const ids = new Set(pathIds);
      patchBlockAnnotations(blockId, {
        paths: current.paths.filter((p) => !ids.has(p.id)),
      });
    },
    [getBlockAnnotations, patchBlockAnnotations],
  );

  const clearBlockAnnotations = useCallback(
    (blockId: string) => {
      patchBlockAnnotations(blockId, createEmptySlideAnnotations());
    },
    [patchBlockAnnotations],
  );

  const persistPresentation = useCallback(
    (index: number, black: boolean) => {
      const state: PresentationState = {
        sermonId: sermon.id,
        activeIndex: index,
        blackScreen: black,
      };
      savePresentation(state, userIdRef.current);

      const uid = userIdRef.current;
      if (uid && !applyingRemoteRef.current) {
        const stamp = Date.now();
        lastLocalPresentationMsRef.current = stamp;
        void pushLivePresentation(uid, state, stamp).catch(() => {});
      }
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

    const uid = userIdRef.current;
    if (uid && !applyingRemoteRef.current && shouldPushLocalSermon(updated)) {
      if (sermonPushTimerRef.current) clearTimeout(sermonPushTimerRef.current);
      sermonPushTimerRef.current = setTimeout(() => {
        void pushLiveSermon(uid, updated).catch(() => {});
      }, 400);
    }
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
      persistAnnotations(createDefaultAnnotationsState(next.id));
    },
    [commitSermon, persistPresentation, persistAnnotations],
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
    (passage: BiblePassage, targetBlockId?: string) => {
      if (targetBlockId) {
        const target = sermon.blocks.find((b) => b.id === targetBlockId);
        if (target) {
          const blocks = sermon.blocks.map((b) =>
            b.id === targetBlockId
              ? {
                  ...b,
                  type: "scripture" as const,
                  content: passage.reference,
                  scripture: passage,
                  showOnStage: b.type === "note" ? true : b.showOnStage,
                }
              : b,
          );
          commitSermon({ ...sermon, blocks });
          const stage = getStageBlocks({ ...sermon, blocks });
          const newIdx = stage.findIndex((b) => b.id === targetBlockId);
          if (newIdx >= 0) setActiveIndex(newIdx);
          return;
        }
      }

      const block: SermonBlock = {
        id: createBlockId(),
        type: "scripture",
        content: passage.reference,
        scripture: passage,
        showOnStage: true,
      };
      const blocks = [...sermon.blocks, block];
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
    const onAnnotations = (ev: MessageEvent) => {
      if (ev.data?.type !== "annotations") return;
      const payload = ev.data.payload as StageAnnotationsState;
      if (payload.sermonId !== sermon.id) return;
      setAnnotations(payload);
    };
    channel.addEventListener("message", onMessage);
    channel.addEventListener("message", onAnnotations);
    return () => {
      channel.removeEventListener("message", onMessage);
      channel.removeEventListener("message", onAnnotations);
    };
  }, [sermon.id]);

  /* Sincronización en vivo entre dispositivos (PC ↔ iPad) vía Firestore */
  useEffect(() => {
    if (!hydrated || !userId) return;

    const unsubSermon = subscribeLiveSermon(userId, (remote) => {
      const local = sermonRef.current;

      if (!remote) {
        if (shouldPushLocalSermon(local)) {
          void pushLiveSermon(userId, local).catch(() => {});
        }
        return;
      }

      if (!shouldApplyRemoteSermon(local, remote)) return;

      applyingRemoteRef.current = true;
      setSermon(remote);
      saveSermon(remote, userId);
      setAnnotations((prev) => ({ ...prev, sermonId: remote.id }));
      applyingRemoteRef.current = false;
    });

    const unsubPresentation = subscribeLivePresentation(userId, (remote, updatedAtMs) => {
      if (!remote || updatedAtMs <= lastLocalPresentationMsRef.current) return;
      if (remote.sermonId !== sermonRef.current.id) return;

      applyingRemoteRef.current = true;
      setActiveIndexState(remote.activeIndex);
      setBlackScreen(remote.blackScreen);
      savePresentation(remote, userId);
      applyingRemoteRef.current = false;
    });

    const unsubAnnotations = subscribeLiveAnnotations(userId, (remote, updatedAtMs) => {
      if (!remote || updatedAtMs <= lastLocalAnnotationsMsRef.current) return;
      if (remote.sermonId !== sermonRef.current.id) return;

      applyingRemoteRef.current = true;
      setAnnotations(remote);
      saveAnnotations(remote, userId);
      applyingRemoteRef.current = false;
    });

    return () => {
      unsubSermon?.();
      unsubPresentation?.();
      unsubAnnotations?.();
      if (sermonPushTimerRef.current) clearTimeout(sermonPushTimerRef.current);
      if (annotationsPushTimerRef.current) clearTimeout(annotationsPushTimerRef.current);
    };
  }, [hydrated, userId]);

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
      const annKey = annotationsKey(userId);
      if (e.key === annKey && e.newValue) {
        try {
          const ann = JSON.parse(e.newValue) as StageAnnotationsState;
          if (ann.sermonId === sermon.id) setAnnotations(ann);
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
      whiteboardMode: annotations.whiteboardMode,
      annotationTool: annotations.activeTool,
      annotationColor: annotations.activeColor,
      setWhiteboardMode,
      setAnnotationTool,
      setAnnotationColor,
      getBlockAnnotations,
      addDrawPath,
      removeDrawPaths,
      clearBlockAnnotations,
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
      annotations.whiteboardMode,
      annotations.activeTool,
      annotations.activeColor,
      setWhiteboardMode,
      setAnnotationTool,
      setAnnotationColor,
      getBlockAnnotations,
      addDrawPath,
      removeDrawPaths,
      clearBlockAnnotations,
    ],
  );

  return <SermonContext.Provider value={value}>{children}</SermonContext.Provider>;
}

export function useSermon() {
  const ctx = useContext(SermonContext);
  if (!ctx) throw new Error("useSermon debe usarse dentro de SermonProvider");
  return ctx;
}
