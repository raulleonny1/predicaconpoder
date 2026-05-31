import {
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { getClientFirestore } from "@/lib/firebase-client";
import { sermonHasMeaningfulContent } from "@/lib/sermon/local-sermons";
import type { StageAnnotationsState } from "@/lib/sermon/stage-annotations";
import type { PresentationState, SermonDocument, TimerState } from "@/lib/sermon/types";

function liveDocRef(uid: string, name: string) {
  const db = getClientFirestore();
  if (!db) return null;
  return doc(db, "users", uid, "live", name);
}

function parseClientUpdatedAt(data: Record<string, unknown>): string {
  const client = data.clientUpdatedAt;
  if (typeof client === "string") return client;
  if (typeof client === "number") return new Date(client).toISOString();
  const ts = data.updatedAt as Timestamp | undefined;
  return ts?.toDate?.()?.toISOString?.() ?? new Date(0).toISOString();
}

function parsePresentationUpdatedAt(data: Record<string, unknown>): number {
  if (typeof data.clientUpdatedAt === "number") return data.clientUpdatedAt;
  const ts = data.updatedAt as Timestamp | undefined;
  return ts?.toDate?.()?.getTime?.() ?? 0;
}

/** Preferir remoto si tiene contenido real y el local está vacío/plantilla, o si es más reciente. */
export function shouldApplyRemoteSermon(local: SermonDocument, remote: SermonDocument): boolean {
  const localEmpty = !sermonHasMeaningfulContent(local);
  const remoteHasContent = sermonHasMeaningfulContent(remote);

  if (localEmpty && remoteHasContent) return true;
  if (remoteHasContent && !localEmpty && remote.updatedAt > local.updatedAt) return true;
  if (!remoteHasContent && !localEmpty) return false;
  return remote.updatedAt > local.updatedAt;
}

/** Solo publicar a Firestore si hay contenido real (nunca la plantilla vacía). */
export function shouldPushLocalSermon(local: SermonDocument): boolean {
  return sermonHasMeaningfulContent(local);
}

export function subscribeLiveSermon(
  uid: string,
  onChange: (sermon: SermonDocument | null) => void,
): Unsubscribe | null {
  const ref = liveDocRef(uid, "sermon");
  if (!ref) return null;

  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onChange(null);
        return;
      }
      const data = snap.data();
      onChange({
        id: (data.id as string) ?? `sermon_${Date.now()}`,
        title: (data.title as string) ?? "Nuevo mensaje",
        blocks: (data.blocks as SermonDocument["blocks"]) ?? [],
        presenterNotes: (data.presenterNotes as string) ?? "",
        cloudId: (data.cloudId as string | undefined) ?? undefined,
        savedId: (data.savedId as string | undefined) ?? undefined,
        updatedAt: parseClientUpdatedAt(data),
      });
    },
    () => onChange(null),
  );
}

export async function pushLiveSermon(uid: string, sermon: SermonDocument): Promise<void> {
  const ref = liveDocRef(uid, "sermon");
  if (!ref) return;

  await setDoc(
    ref,
    {
      id: sermon.id,
      title: sermon.title,
      blocks: sermon.blocks,
      presenterNotes: sermon.presenterNotes,
      cloudId: sermon.cloudId ?? null,
      savedId: sermon.savedId ?? null,
      clientUpdatedAt: sermon.updatedAt,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export function subscribeLivePresentation(
  uid: string,
  onChange: (state: PresentationState | null, updatedAtMs: number) => void,
): Unsubscribe | null {
  const ref = liveDocRef(uid, "presentation");
  if (!ref) return null;

  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onChange(null, 0);
        return;
      }
      const data = snap.data();
      onChange(
        {
          sermonId: (data.sermonId as string) ?? "",
          activeIndex: (data.activeIndex as number) ?? 0,
          blackScreen: Boolean(data.blackScreen),
        },
        parsePresentationUpdatedAt(data),
      );
    },
    () => onChange(null, 0),
  );
}

export async function pushLivePresentation(
  uid: string,
  state: PresentationState,
  clientUpdatedAtMs: number,
): Promise<void> {
  const ref = liveDocRef(uid, "presentation");
  if (!ref) return;

  await setDoc(
    ref,
    {
      sermonId: state.sermonId,
      activeIndex: state.activeIndex,
      blackScreen: state.blackScreen,
      clientUpdatedAt: clientUpdatedAtMs,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export function subscribeLiveAnnotations(
  uid: string,
  onChange: (state: StageAnnotationsState | null, updatedAtMs: number) => void,
): Unsubscribe | null {
  const ref = liveDocRef(uid, "annotations");
  if (!ref) return null;

  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onChange(null, 0);
        return;
      }
      const data = snap.data();
      onChange(data.payload as StageAnnotationsState, parsePresentationUpdatedAt(data));
    },
    () => onChange(null, 0),
  );
}

export async function pushLiveAnnotations(
  uid: string,
  state: StageAnnotationsState,
  clientUpdatedAtMs: number,
): Promise<void> {
  const ref = liveDocRef(uid, "annotations");
  if (!ref) return;

  await setDoc(
    ref,
    {
      payload: state,
      clientUpdatedAt: clientUpdatedAtMs,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

function parseTimerPayload(data: Record<string, unknown>): TimerState {
  const payload = data.payload as TimerState | undefined;
  return {
    elapsedMs: typeof payload?.elapsedMs === "number" ? payload.elapsedMs : 0,
    running: Boolean(payload?.running),
    startedAt: typeof payload?.startedAt === "number" ? payload.startedAt : null,
    targetMinutes:
      typeof payload?.targetMinutes === "number" ? payload.targetMinutes : null,
  };
}

export function subscribeLiveTimer(
  uid: string,
  onChange: (state: TimerState | null, updatedAtMs: number) => void,
): Unsubscribe | null {
  const ref = liveDocRef(uid, "timer");
  if (!ref) return null;

  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onChange(null, 0);
        return;
      }
      const data = snap.data() as Record<string, unknown>;
      onChange(parseTimerPayload(data), parsePresentationUpdatedAt(data));
    },
    () => onChange(null, 0),
  );
}

export async function pushLiveTimer(
  uid: string,
  state: TimerState,
  clientUpdatedAtMs: number,
): Promise<void> {
  const ref = liveDocRef(uid, "timer");
  if (!ref) return;

  await setDoc(
    ref,
    {
      payload: state,
      clientUpdatedAt: clientUpdatedAtMs,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
