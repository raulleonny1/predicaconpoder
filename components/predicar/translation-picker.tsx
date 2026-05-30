"use client";

import { BIBLE_TRANSLATIONS } from "@/lib/bible/translations";
import { useSermon } from "@/lib/sermon/sermon-context";

export function TranslationPicker({ compact }: { compact?: boolean }) {
  const { translation, setTranslation } = useSermon();

  if (compact) {
    return (
      <select
        value={translation}
        onChange={(e) => setTranslation(e.target.value as typeof translation)}
        className="rounded-lg border border-white/15 bg-void px-2 py-1 text-xs font-semibold text-white/80 outline-none"
        aria-label="Traducción bíblica"
      >
        {BIBLE_TRANSLATIONS.map((t) => (
          <option key={t.code} value={t.code}>
            {t.shortLabel}
          </option>
        ))}
      </select>
    );
  }

  return (
    <select
      value={translation}
      onChange={(e) => setTranslation(e.target.value as typeof translation)}
      className="rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm font-medium text-ink outline-none focus:border-accent/40"
      aria-label="Traducción bíblica"
    >
      {BIBLE_TRANSLATIONS.map((t) => (
        <option key={t.code} value={t.code}>
          {t.label}
        </option>
      ))}
    </select>
  );
}
