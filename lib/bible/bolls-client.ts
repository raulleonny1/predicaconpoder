import type { BibleTranslationCode } from "@/lib/bible/translations";

const BOLLS_BASE = "https://bolls.life";

export type BollsVerse = { verse: number; text: string };

/** Traducciones con texto completo verificado en bolls.life */
export const BOLLS_ACTIVE_TRANSLATIONS: BibleTranslationCode[] = ["NVI", "LBLA", "KJV"];

const FALLBACK_CHAIN: Record<BibleTranslationCode, BibleTranslationCode[]> = {
  RVR1960: ["NVI", "LBLA"],
  RVR1995: ["NVI", "LBLA"],
  DHH: ["NVI", "LBLA"],
  NVI: ["LBLA"],
  LBLA: ["NVI"],
  KJV: [],
};

export type BollsChapterResult = {
  verses: BollsVerse[];
  translationUsed: BibleTranslationCode;
  requestedTranslation: BibleTranslationCode;
  usedFallback: boolean;
};

function cleanVerseText(text: string): string {
  return text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export async function fetchBollsChapter(
  requested: BibleTranslationCode,
  bookId: number,
  chapter: number,
): Promise<BollsChapterResult | null> {
  const chain = [requested, ...FALLBACK_CHAIN[requested]];

  for (const translation of chain) {
    try {
      const url = `${BOLLS_BASE}/get-text/${translation}/${bookId}/${chapter}/`;
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) continue;

      const data = (await res.json()) as BollsVerse[];
      if (!Array.isArray(data) || data.length === 0) continue;

      return {
        verses: data.map((v) => ({
          verse: v.verse,
          text: cleanVerseText(v.text),
        })),
        translationUsed: translation,
        requestedTranslation: requested,
        usedFallback: translation !== requested,
      };
    } catch {
      continue;
    }
  }

  return null;
}

export async function fetchBollsSearch(
  requested: BibleTranslationCode,
  query: string,
): Promise<{ results: BollsSearchRow[]; translationUsed: BibleTranslationCode; usedFallback: boolean } | null> {
  const chain = [requested, ...FALLBACK_CHAIN[requested]];

  for (const translation of chain) {
    try {
      const url = `${BOLLS_BASE}/search/${translation}/?q=${encodeURIComponent(query)}&page=1`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) continue;

      const data = (await res.json()) as BollsSearchRow[] | { readme?: string };
      if (!Array.isArray(data) || data.length === 0) continue;
      const first = data[0] as BollsSearchRow | { readme?: string };
      if (first && "readme" in first) continue;

      return {
        results: data,
        translationUsed: translation,
        usedFallback: translation !== requested,
      };
    } catch {
      continue;
    }
  }

  return null;
}

export type BollsSearchRow = {
  pk: string;
  translation: string;
  book: number;
  chapter: number;
  verse: number;
  text: string;
};
