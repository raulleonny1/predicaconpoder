import type { BiblePassage } from "@/lib/bible/types";

export type SermonBlockType = "heading" | "text" | "scripture" | "note";

export type SermonBlock = {
  id: string;
  type: SermonBlockType;
  content: string;
  scripture?: BiblePassage;
  showOnStage: boolean;
};

export type SermonDocument = {
  id: string;
  title: string;
  blocks: SermonBlock[];
  presenterNotes: string;
  updatedAt: string;
  /** ID en la biblioteca local del navegador */
  savedId?: string;
  /** ID del documento en Firestore cuando está guardado en la nube */
  cloudId?: string;
};

export type PresentationState = {
  sermonId: string;
  activeIndex: number;
  blackScreen: boolean;
};

export type TimerState = {
  elapsedMs: number;
  running: boolean;
  startedAt: number | null;
  targetMinutes: number | null;
};

export type CloudSermonMeta = {
  id: string;
  title: string;
  updatedAt: string;
};

export function createBlockId(): string {
  return `blk_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createDefaultSermon(): SermonDocument {
  const id = `sermon_${Date.now()}`;
  return {
    id,
    title: "Nuevo mensaje",
    presenterNotes: "",
    blocks: [
      {
        id: createBlockId(),
        type: "heading",
        content: "Título del mensaje",
        showOnStage: true,
      },
      {
        id: createBlockId(),
        type: "text",
        content: "Escribe aquí tu introducción o puntos principales.",
        showOnStage: true,
      },
      {
        id: createBlockId(),
        type: "note",
        content: "Notas para ti: puntos clave, transiciones, recordatorios…",
        showOnStage: false,
      },
    ],
    updatedAt: new Date().toISOString(),
  };
}
