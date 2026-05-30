export type BibleVerse = {
  verse: number;
  text: string;
};

export type BiblePassage = {
  reference: string;
  bookId: number;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  verses: BibleVerse[];
  /** Traducción del texto mostrado */
  translation: string;
  /** Traducción que pidió el usuario */
  requestedTranslation?: string;
  /** Etiqueta corta si se usó respaldo (ej. NVI en lugar de RVR60) */
  translationFallback?: string;
};

export type BibleSearchHit = {
  book: number;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
};
