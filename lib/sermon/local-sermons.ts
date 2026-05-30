import {
  draftStorageKey,
  libraryIndexKey,
  libraryItemKey,
} from "@/lib/sermon/user-scope";
import type { SermonDocument } from "@/lib/sermon/types";
import { createDefaultSermon } from "@/lib/sermon/types";

export type SavedSermonMeta = {
  id: string;
  title: string;
  updatedAt: string;
};

function readIndex(userId: string | null | undefined): SavedSermonMeta[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(libraryIndexKey(userId)) ?? "[]") as SavedSermonMeta[];
  } catch {
    return [];
  }
}

function writeIndex(userId: string | null | undefined, index: SavedSermonMeta[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(libraryIndexKey(userId), JSON.stringify(index));
}

export function sermonHasMeaningfulContent(sermon: SermonDocument): boolean {
  const fresh = createDefaultSermon();
  if (sermon.title.trim() && sermon.title.trim() !== fresh.title) return true;
  if (sermon.presenterNotes.trim()) return true;
  if (sermon.blocks.length !== fresh.blocks.length) return true;
  return sermon.blocks.some((block, i) => {
    const base = fresh.blocks[i];
    return !base || block.content !== base.content || block.type !== base.type;
  });
}

export function listLocalSermons(userId: string | null | undefined, search?: string): SavedSermonMeta[] {
  const q = search?.trim().toLowerCase() ?? "";
  const sorted = readIndex(userId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  if (!q) return sorted;
  return sorted.filter((item) => item.title.toLowerCase().includes(q));
}

export function saveLocalSermon(
  userId: string | null | undefined,
  sermon: SermonDocument,
): SermonDocument {
  const savedId = sermon.savedId ?? sermon.cloudId ?? `saved_${Date.now()}`;
  const updatedAt = new Date().toISOString();
  const toSave: SermonDocument = {
    ...sermon,
    savedId,
    updatedAt,
    title: sermon.title.trim() || "Sin título",
  };

  localStorage.setItem(libraryItemKey(userId, savedId), JSON.stringify(toSave));

  const index = readIndex(userId).filter((item) => item.id !== savedId);
  index.unshift({ id: savedId, title: toSave.title, updatedAt });
  writeIndex(userId, index);

  return toSave;
}

export function loadLocalSermon(
  userId: string | null | undefined,
  savedId: string,
): SermonDocument | null {
  try {
    const raw = localStorage.getItem(libraryItemKey(userId, savedId));
    if (!raw) return null;
    return JSON.parse(raw) as SermonDocument;
  } catch {
    return null;
  }
}

export function deleteLocalSermon(userId: string | null | undefined, savedId: string): void {
  localStorage.removeItem(libraryItemKey(userId, savedId));
  writeIndex(
    userId,
    readIndex(userId).filter((item) => item.id !== savedId),
  );
}

export { draftStorageKey };
