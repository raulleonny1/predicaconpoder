import { NextRequest, NextResponse } from "next/server";
import { fetchBollsChapter } from "@/lib/bible/bolls-client";
import { formatReference, getBookById } from "@/lib/bible/books";
import { parseTranslationCode } from "@/lib/bible/translations";
import { getTranslationMeta } from "@/lib/bible/translations";
import type { BiblePassage, BibleVerse } from "@/lib/bible/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const requested = parseTranslationCode(searchParams.get("translation"));
  const bookId = parseInt(searchParams.get("book") ?? "", 10);
  const chapter = parseInt(searchParams.get("chapter") ?? "", 10);
  const verseStart = parseInt(searchParams.get("verseStart") ?? "1", 10);
  const verseEnd = parseInt(searchParams.get("verseEnd") ?? String(verseStart), 10);

  const book = getBookById(bookId);
  if (!book || chapter < 1 || chapter > book.chapters) {
    return NextResponse.json({ error: "Referencia inválida" }, { status: 400 });
  }

  try {
    const result = await fetchBollsChapter(requested, bookId, chapter);
    if (!result) {
      return NextResponse.json(
        { error: "No hay texto disponible para este capítulo en ninguna traducción." },
        { status: 502 },
      );
    }

    const start = Math.max(1, verseStart);
    const end = Math.max(start, verseEnd);
    const verses: BibleVerse[] = result.verses.filter((v) => v.verse >= start && v.verse <= end);

    if (verses.length === 0) {
      return NextResponse.json({ error: "Versículos no encontrados" }, { status: 404 });
    }

    const passage: BiblePassage = {
      reference: formatReference(bookId, chapter, start, end > start ? end : undefined),
      bookId,
      chapter,
      verseStart: start,
      verseEnd: end,
      verses,
      translation: result.translationUsed,
      requestedTranslation: requested,
      translationFallback: result.usedFallback
        ? `${getTranslationMeta(requested).shortLabel} → ${getTranslationMeta(result.translationUsed).shortLabel}`
        : undefined,
    };

    return NextResponse.json(passage);
  } catch {
    return NextResponse.json({ error: "Error al consultar la Biblia" }, { status: 500 });
  }
}
