import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from "firebase/firestore";
import { getClientFirestore } from "@/lib/firebase-client";
import type { CloudSermonMeta, SermonDocument, SermonBlock } from "@/lib/sermon/types";

function sanitizeBlocks(blocks: SermonBlock[]): SermonBlock[] {
  return blocks.map((block) => {
    const clean: SermonBlock = {
      id: block.id,
      type: block.type,
      content: block.content,
      showOnStage: block.showOnStage,
    };
    if (block.label?.trim()) clean.label = block.label.trim();
    if (block.scripture) clean.scripture = block.scripture;
    return clean;
  });
}

function sermonsCollection(uid: string) {
  const db = getClientFirestore();
  if (!db) throw new Error("Firestore no disponible");
  return collection(db, "users", uid, "sermons");
}

function toSermonDocument(
  cloudId: string,
  data: Record<string, unknown>,
): SermonDocument {
  return {
    id: `sermon_${cloudId}`,
    cloudId,
    title: (data.title as string) ?? "Sin título",
    presenterNotes: (data.presenterNotes as string) ?? "",
    blocks: (data.blocks as SermonDocument["blocks"]) ?? [],
    updatedAt:
      (data.updatedAt as Timestamp)?.toDate?.()?.toISOString?.() ??
      (data.updatedAt as string) ??
      new Date().toISOString(),
  };
}

export async function listCloudSermons(uid: string): Promise<CloudSermonMeta[]> {
  const mapDocs = (snap: Awaited<ReturnType<typeof getDocs>>) =>
    snap.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      const updatedAt =
        (data.updatedAt as Timestamp)?.toDate?.()?.toISOString?.() ??
        new Date().toISOString();
      return {
        id: d.id,
        title: (data.title as string) ?? "Sin título",
        updatedAt,
      };
    });

  try {
    const q = query(sermonsCollection(uid), orderBy("updatedAt", "desc"));
    const snap = await getDocs(q);
    return mapDocs(snap);
  } catch {
    const snap = await getDocs(sermonsCollection(uid));
    return mapDocs(snap).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}

export async function loadCloudSermon(uid: string, cloudId: string): Promise<SermonDocument> {
  const db = getClientFirestore();
  if (!db) throw new Error("Firestore no disponible");
  const ref = doc(db, "users", uid, "sermons", cloudId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Mensaje no encontrado");
  return toSermonDocument(cloudId, snap.data());
}

export async function saveCloudSermon(uid: string, sermon: SermonDocument): Promise<string> {
  const db = getClientFirestore();
  if (!db) throw new Error("Firestore no disponible");

  const cloudId = sermon.cloudId ?? doc(sermonsCollection(uid)).id;
  const ref = doc(db, "users", uid, "sermons", cloudId);
  const isNew = !sermon.cloudId;

  const payload: Record<string, unknown> = {
    title: sermon.title,
    blocks: sanitizeBlocks(sermon.blocks),
    presenterNotes: sermon.presenterNotes,
    updatedAt: serverTimestamp(),
  };
  if (isNew) payload.createdAt = serverTimestamp();

  await setDoc(ref, payload, { merge: true });

  return cloudId;
}

export async function deleteCloudSermon(uid: string, cloudId: string): Promise<void> {
  const db = getClientFirestore();
  if (!db) throw new Error("Firestore no disponible");
  await deleteDoc(doc(db, "users", uid, "sermons", cloudId));
}
