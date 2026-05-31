import type { BibleTranslationCode } from "@/lib/bible/translations";
import { DEFAULT_TRANSLATION } from "@/lib/bible/translations";
import type { StageAnnotationsState } from "@/lib/sermon/stage-annotations";
import { annotationsKey, draftStorageKey, presentationKey } from "@/lib/sermon/user-scope";
import type { PresentationState, SermonDocument, TimerState } from "@/lib/sermon/types";
import { createDefaultSermon } from "@/lib/sermon/types";

const TRANSLATION_KEY = "pcp:bible-translation";
const TIMER_KEY = "pcp:timer";
const SYNC_CHANNEL = "pcp-presentation-sync";

export function loadSermon(userId: string | null | undefined): SermonDocument {
  if (typeof window === "undefined") return createDefaultSermon();
  try {
    const raw = localStorage.getItem(draftStorageKey(userId));
    if (!raw) return createDefaultSermon();
    const parsed = JSON.parse(raw) as SermonDocument;
    return {
      ...createDefaultSermon(),
      ...parsed,
      presenterNotes: parsed.presenterNotes ?? "",
    };
  } catch {
    return createDefaultSermon();
  }
}

export function saveSermon(sermon: SermonDocument, userId: string | null | undefined): void {
  if (typeof window === "undefined") return;
  const updated = { ...sermon, updatedAt: new Date().toISOString() };
  localStorage.setItem(draftStorageKey(userId), JSON.stringify(updated));
}

export function loadPresentation(userId: string | null | undefined): PresentationState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(presentationKey(userId));
    if (!raw) return null;
    return JSON.parse(raw) as PresentationState;
  } catch {
    return null;
  }
}

export function savePresentation(
  state: PresentationState,
  userId: string | null | undefined,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(presentationKey(userId), JSON.stringify(state));
  broadcastPresentation(state);
}

export function loadTranslation(): BibleTranslationCode {
  if (typeof window === "undefined") return DEFAULT_TRANSLATION;
  try {
    const raw = localStorage.getItem(TRANSLATION_KEY);
    return (raw as BibleTranslationCode) || DEFAULT_TRANSLATION;
  } catch {
    return DEFAULT_TRANSLATION;
  }
}

export function saveTranslation(code: BibleTranslationCode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TRANSLATION_KEY, code);
}

export function loadTimer(): TimerState {
  if (typeof window === "undefined") {
    return { elapsedMs: 0, running: false, startedAt: null, targetMinutes: 45 };
  }
  try {
    const raw = localStorage.getItem(TIMER_KEY);
    if (!raw) return { elapsedMs: 0, running: false, startedAt: null, targetMinutes: 45 };
    return JSON.parse(raw) as TimerState;
  } catch {
    return { elapsedMs: 0, running: false, startedAt: null, targetMinutes: 45 };
  }
}

export function saveTimer(state: TimerState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TIMER_KEY, JSON.stringify(state));
  getSyncChannel()?.postMessage({ type: "timer", payload: state });
}

export function getSyncChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return null;
  return new BroadcastChannel(SYNC_CHANNEL);
}

function broadcastPresentation(state: PresentationState): void {
  const channel = getSyncChannel();
  channel?.postMessage({ type: "presentation", payload: state });
}

export function loadAnnotations(userId: string | null | undefined): StageAnnotationsState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(annotationsKey(userId));
    if (!raw) return null;
    return JSON.parse(raw) as StageAnnotationsState;
  } catch {
    return null;
  }
}

export function saveAnnotations(
  state: StageAnnotationsState,
  userId: string | null | undefined,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(annotationsKey(userId), JSON.stringify(state));
  const channel = getSyncChannel();
  channel?.postMessage({ type: "annotations", payload: state });
}

export function getStageBlocks(sermon: SermonDocument) {
  return sermon.blocks.filter((b) => b.showOnStage);
}

export function getContextualNotes(sermon: SermonDocument, activeStageBlockId: string | undefined) {
  if (!activeStageBlockId) {
    return sermon.blocks.filter((b) => b.type === "note");
  }

  const activeIdx = sermon.blocks.findIndex((b) => b.id === activeStageBlockId);
  if (activeIdx < 0) return sermon.blocks.filter((b) => b.type === "note");

  let prevStageIdx = -1;
  for (let i = activeIdx - 1; i >= 0; i--) {
    if (sermon.blocks[i].showOnStage) {
      prevStageIdx = i;
      break;
    }
  }

  const from = prevStageIdx + 1;
  return sermon.blocks.slice(from, activeIdx + 1).filter((b) => b.type === "note");
}
