export type BibleTranslationCode =
  | "RVR1960"
  | "RVR1995"
  | "NVI"
  | "LBLA"
  | "DHH"
  | "KJV";

export type BibleTranslation = {
  code: BibleTranslationCode;
  label: string;
  shortLabel: string;
};

export const BIBLE_TRANSLATIONS: BibleTranslation[] = [
  { code: "RVR1960", label: "Reina-Valera 1960", shortLabel: "RVR60" },
  { code: "RVR1995", label: "Reina-Valera 1995", shortLabel: "RVR95" },
  { code: "NVI", label: "Nueva Versión Internacional", shortLabel: "NVI" },
  { code: "LBLA", label: "La Biblia de las Américas", shortLabel: "LBLA" },
  { code: "DHH", label: "Dios Habla Hoy", shortLabel: "DHH" },
  { code: "KJV", label: "King James Version (English)", shortLabel: "KJV" },
];

/** NVI tiene cobertura completa en el proveedor; RVR60/95 usan respaldo automático a NVI */
export const DEFAULT_TRANSLATION: BibleTranslationCode = "NVI";

const VALID_CODES = new Set(BIBLE_TRANSLATIONS.map((t) => t.code));

export function parseTranslationCode(value: string | null | undefined): BibleTranslationCode {
  if (value && VALID_CODES.has(value as BibleTranslationCode)) {
    return value as BibleTranslationCode;
  }
  return DEFAULT_TRANSLATION;
}

export function getTranslationMeta(code: BibleTranslationCode): BibleTranslation {
  return BIBLE_TRANSLATIONS.find((t) => t.code === code) ?? BIBLE_TRANSLATIONS[0];
}
