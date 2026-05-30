import { findBookByName } from "@/lib/bible/books";

export type ParsedReference = {
  bookId: number;
  chapter: number;
  verseStart: number;
  verseEnd: number;
};

export function parseReference(input: string): ParsedReference | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const match = trimmed.match(
    /^(.+?)\s+(\d+)\s*:\s*(\d+)(?:\s*[-–]\s*(\d+))?(?:\s*[,;]\s*(\d+)(?:\s*[-–]\s*(\d+))?)?$/i,
  );
  if (!match) return null;

  const bookPart = match[1].trim();
  const chapter = parseInt(match[2], 10);
  const verseStart = parseInt(match[3], 10);
  const verseEnd = match[4] ? parseInt(match[4], 10) : verseStart;

  const book = findBookByName(bookPart);
  if (!book || chapter < 1 || chapter > book.chapters) return null;
  if (verseStart < 1 || verseEnd < verseStart) return null;

  return {
    bookId: book.id,
    chapter,
    verseStart,
    verseEnd,
  };
}

export function looksLikeReference(input: string): boolean {
  return /\d+\s*:\s*\d+/.test(input);
}
