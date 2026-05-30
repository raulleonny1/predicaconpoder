import { NextRequest, NextResponse } from "next/server";
import { fetchBollsChapter, fetchBollsSearch } from "@/lib/bible/bolls-client";
import { formatReference } from "@/lib/bible/books";
import { parseReference, looksLikeReference } from "@/lib/bible/parse-reference";
import { parseTranslationCode } from "@/lib/bible/translations";
import type { BibleSearchHit } from "@/lib/bible/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim() ?? "";
  const requested = parseTranslationCode(searchParams.get("translation"));

  if (q.length < 2) {
    return NextResponse.json({ hits: [], type: "empty" as const });
  }

  if (looksLikeReference(q)) {
    const ref = parseReference(q);
    if (ref) {
      const result = await fetchBollsChapter(requested, ref.bookId, ref.chapter);
      if (result) {
        const start = ref.verseStart;
        const end = ref.verseEnd;
        const text = result.verses
          .filter((v) => v.verse >= start && v.verse <= end)
          .map((v) => v.text)
          .join(" ");

        if (text) {
          const hit: BibleSearchHit = {
            book: ref.bookId,
            chapter: ref.chapter,
            verse: ref.verseStart,
            text,
            reference: formatReference(ref.bookId, ref.chapter, start, end > start ? end : undefined),
          };
          return NextResponse.json({
            hits: [hit],
            type: "reference" as const,
            translationFallback: result.usedFallback ? result.translationUsed : undefined,
          });
        }
      }
    }
  }

  try {
    const search = await fetchBollsSearch(requested, q);
    if (!search) {
      return NextResponse.json({ error: "Búsqueda no disponible" }, { status: 502 });
    }

    const hits: BibleSearchHit[] = search.results.slice(0, 24).map((row) => ({
      book: row.book,
      chapter: row.chapter,
      verse: row.verse,
      text: row.text.replace(/<[^>]+>/g, ""),
      reference: formatReference(row.book, row.chapter, row.verse),
    }));

    return NextResponse.json({
      hits,
      type: "keyword" as const,
      translationFallback: search.usedFallback ? search.translationUsed : undefined,
    });
  } catch {
    return NextResponse.json({ error: "Error en la búsqueda" }, { status: 500 });
  }
}
