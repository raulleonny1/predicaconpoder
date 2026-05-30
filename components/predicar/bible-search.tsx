"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TranslationPicker } from "@/components/predicar/translation-picker";
import { BIBLE_BOOKS, formatReference } from "@/lib/bible/books";
import type { BiblePassage, BibleSearchHit, BibleVerse } from "@/lib/bible/types";
import { useSermon } from "@/lib/sermon/sermon-context";
import { cn } from "@/lib/utils";

type BibleSearchProps = {
  open: boolean;
  onClose: () => void;
  onSelectPassage: (passage: BiblePassage) => void;
};

type SearchResponse =
  | { hits: BibleSearchHit[]; type: "reference" | "keyword" | "empty" }
  | { error: string };

export function BibleSearch({ open, onClose, onSelectPassage }: BibleSearchProps) {
  const { translation } = useSermon();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<BibleSearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [mode, setMode] = useState<"search" | "browse">("search");
  const [browseBook, setBrowseBook] = useState<number | null>(null);
  const [browseChapter, setBrowseChapter] = useState<number | null>(null);
  const [chapterVerses, setChapterVerses] = useState<BibleVerse[]>([]);
  const [chapterError, setChapterError] = useState<string | null>(null);
  const [chapterFallback, setChapterFallback] = useState<string | null>(null);
  const [rangeStart, setRangeStart] = useState<number | null>(null);
  const [rangeEnd, setRangeEnd] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetBrowse = useCallback(() => {
    setBrowseBook(null);
    setBrowseChapter(null);
    setChapterVerses([]);
    setChapterError(null);
    setChapterFallback(null);
    setRangeStart(null);
    setRangeEnd(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setHits([]);
    setSelected(0);
    setMode("search");
    resetBrowse();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open, resetBrowse]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const runSearch = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setHits([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/bible/search?q=${encodeURIComponent(q)}&translation=${translation}`,
        );
        const data = (await res.json()) as SearchResponse;
        if ("hits" in data) {
          setHits(data.hits);
          setSelected(0);
        }
      } finally {
        setLoading(false);
      }
    },
    [translation],
  );

  useEffect(() => {
    if (!open || mode !== "search") return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 280);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open, mode, runSearch]);

  const fetchPassage = async (
    book: number,
    chapter: number,
    verseStart: number,
    verseEnd?: number,
  ): Promise<BiblePassage | null> => {
    const params = new URLSearchParams({
      translation,
      book: String(book),
      chapter: String(chapter),
      verseStart: String(verseStart),
      verseEnd: String(verseEnd ?? verseStart),
    });
    const res = await fetch(`/api/bible/passage?${params}`);
    if (!res.ok) return null;
    return res.json() as Promise<BiblePassage>;
  };

  const insertPassage = async (bookId: number, chapter: number, start: number, end: number) => {
    setLoading(true);
    try {
      const passage = await fetchPassage(bookId, chapter, start, end);
      if (passage) {
        onSelectPassage(passage);
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const selectHit = async (hit: BibleSearchHit) => {
    await insertPassage(hit.book, hit.chapter, hit.verse, hit.verse);
  };

  const openChapter = async (bookId: number, chapter: number) => {
    setLoading(true);
    setBrowseChapter(chapter);
    setRangeStart(null);
    setRangeEnd(null);
    setChapterVerses([]);
    setChapterError(null);
    setChapterFallback(null);
    try {
      const res = await fetch(
        `/api/bible/passage?${new URLSearchParams({
          translation,
          book: String(bookId),
          chapter: String(chapter),
          verseStart: "1",
          verseEnd: "250",
        })}`,
      );
      const data = (await res.json()) as BiblePassage & { error?: string };
      if (!res.ok) {
        setChapterError(data.error ?? "No se pudieron cargar los versículos.");
        return;
      }
      if (!data.verses?.length) {
        setChapterError("Este capítulo no tiene texto disponible.");
        return;
      }
      setChapterVerses(data.verses);
      setChapterFallback(data.translationFallback ?? null);
      setRangeStart(data.verses[0].verse);
      setRangeEnd(data.verses[0].verse);
    } catch {
      setChapterError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const onVerseClick = (verseNum: number, shiftKey: boolean) => {
    if (shiftKey && rangeStart !== null) {
      setRangeEnd(verseNum);
      return;
    }
    setRangeStart(verseNum);
    setRangeEnd(verseNum);
  };

  const normalizedRange = (): { start: number; end: number } | null => {
    if (rangeStart === null || rangeEnd === null) return null;
    return {
      start: Math.min(rangeStart, rangeEnd),
      end: Math.max(rangeStart, rangeEnd),
    };
  };

  const isVerseInRange = (verseNum: number) => {
    const r = normalizedRange();
    if (!r) return false;
    return verseNum >= r.start && verseNum <= r.end;
  };

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && hits[selected]) {
      e.preventDefault();
      void selectHit(hits[selected]);
    }
  };

  if (!open) return null;

  const book = browseBook ? BIBLE_BOOKS.find((b) => b.id === browseBook) : null;
  const range = normalizedRange();

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-[max(1rem,8vh)] sm:p-8">
      <button
        type="button"
        className="absolute inset-0 bg-void/70 backdrop-blur-md"
        aria-label="Cerrar búsqueda"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Búsqueda bíblica"
        className="relative flex max-h-[min(85dvh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-void-elevated shadow-2xl shadow-black/50"
      >
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 shrink-0 text-accent-glow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => {
                setMode("search");
                setQuery(e.target.value);
              }}
              onKeyDown={onInputKeyDown}
              placeholder="Juan 3:16, amor, fe, Salmo 23…"
              className="min-w-0 flex-1 bg-transparent font-heading text-lg text-white outline-none placeholder:text-white/40"
              autoComplete="off"
              spellCheck={false}
            />
            <kbd className="hidden rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/50 sm:inline">
              Esc
            </kbd>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("search");
                resetBrowse();
                inputRef.current?.focus();
              }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                mode === "search" ? "bg-accent text-white" : "text-white/60 hover:bg-white/10",
              )}
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("browse");
                resetBrowse();
              }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                mode === "browse" ? "bg-accent text-white" : "text-white/60 hover:bg-white/10",
              )}
            >
              Explorar libros
            </button>
            <div className="ml-auto">
              <TranslationPicker compact />
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto overscroll-contain p-2">
            {mode === "browse" ? (
              <div className="p-2">
                {!browseBook ? (
                  <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                    {BIBLE_BOOKS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBrowseBook(b.id)}
                        className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white/90 transition hover:bg-white/10"
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                ) : !browseChapter && book ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setBrowseBook(null)}
                      className="mb-3 text-sm text-accent-glow hover:underline"
                    >
                      ← Todos los libros
                    </button>
                    <p className="mb-3 font-heading text-lg font-bold text-white">{book.name}</p>
                    <p className="mb-3 text-xs text-white/45">Elige un capítulo</p>
                    <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-8">
                      {Array.from({ length: book.chapters }, (_, i) => i + 1).map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => void openChapter(book.id, ch)}
                          className="rounded-lg bg-white/5 py-2 text-sm font-semibold text-white transition hover:bg-accent hover:text-white"
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </>
                ) : browseChapter && book ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setBrowseChapter(null);
                        setChapterVerses([]);
                        setChapterError(null);
                        setChapterFallback(null);
                        setRangeStart(null);
                        setRangeEnd(null);
                      }}
                      className="mb-3 text-sm text-accent-glow hover:underline"
                    >
                      ← {book.name} · capítulos
                    </button>
                    <p className="font-heading text-lg font-bold text-white">
                      {book.name} {browseChapter}
                    </p>
                    <p className="mt-1 text-xs text-white/45">
                      Clic en un versículo · Mayús+clic para rango · o inserta el capítulo completo
                    </p>

                    {chapterFallback ? (
                      <p className="mt-3 rounded-lg bg-amber-500/15 px-3 py-2 text-xs text-amber-200/90">
                        Texto en {chapterFallback} (la versión elegida no está en el servidor bíblico).
                      </p>
                    ) : null}

                    {loading && chapterVerses.length === 0 && !chapterError ? (
                      <p className="mt-6 text-center text-sm text-white/50">Cargando versículos…</p>
                    ) : chapterError ? (
                      <p className="mt-6 text-center text-sm text-amber-300/90">{chapterError}</p>
                    ) : chapterVerses.length === 0 ? (
                      <p className="mt-6 text-center text-sm text-white/50">
                        No se pudieron cargar los versículos.
                      </p>
                    ) : (
                      <ul className="mt-4 space-y-1">
                        {chapterVerses.map((v) => (
                          <li key={v.verse}>
                            <button
                              type="button"
                              onClick={(e) => onVerseClick(v.verse, e.shiftKey)}
                              className={cn(
                                "flex w-full gap-3 rounded-xl px-3 py-2.5 text-left transition",
                                isVerseInRange(v.verse)
                                  ? "bg-accent/25 ring-1 ring-accent/50"
                                  : "hover:bg-white/8",
                              )}
                            >
                              <span className="shrink-0 font-heading text-sm font-bold text-accent-glow">
                                {v.verse}
                              </span>
                              <span className="text-sm leading-relaxed text-white/85">{v.text}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : null}
              </div>
            ) : loading && hits.length === 0 ? (
              <p className="p-6 text-center text-sm text-white/50">Buscando en las Escrituras…</p>
            ) : hits.length === 0 && query.length >= 2 ? (
              <p className="p-6 text-center text-sm text-white/50">
                Sin resultados. Prueba una referencia como Juan 3:16.
              </p>
            ) : hits.length === 0 ? (
              <div className="p-6 text-center text-sm text-white/50">
                <p>Escribe una referencia o palabra clave.</p>
                <p className="mt-2 text-xs text-white/35">Atajo: Ctrl+K o ⌘+K</p>
              </div>
            ) : (
              <ul className="space-y-0.5">
                {hits.map((hit, i) => (
                  <li key={`${hit.book}-${hit.chapter}-${hit.verse}-${i}`}>
                    <button
                      type="button"
                      onClick={() => void selectHit(hit)}
                      onMouseEnter={() => setSelected(i)}
                      className={cn(
                        "w-full rounded-xl px-4 py-3 text-left transition",
                        selected === i ? "bg-accent/25 ring-1 ring-accent/50" : "hover:bg-white/8",
                      )}
                    >
                      <span className="font-heading text-sm font-bold text-accent-glow">
                        {hit.reference}
                      </span>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/80">
                        {hit.text}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {mode === "browse" && browseChapter && book && chapterVerses.length > 0 ? (
            <div className="shrink-0 border-t border-white/10 bg-void-elevated/95 p-3 backdrop-blur-sm">
              <p className="mb-2 text-center text-xs text-white/50">
                {range
                  ? formatReference(book.id, browseChapter, range.start, range.end > range.start ? range.end : undefined)
                  : "Selecciona versículos"}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!range || loading}
                  onClick={() => range && void insertPassage(book.id, browseChapter, range.start, range.end)}
                  className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-40"
                >
                  Insertar selección
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    const last = chapterVerses[chapterVerses.length - 1]?.verse ?? 1;
                    void insertPassage(book.id, browseChapter, 1, last);
                  }}
                  className="rounded-xl border border-white/15 px-3 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/10"
                >
                  Capítulo completo
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
