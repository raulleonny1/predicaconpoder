"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PresenterNotesPanel } from "@/components/predicar/presenter-notes-panel";
import { PresenterTimer } from "@/components/predicar/presenter-timer";
import { StageViewer } from "@/components/predicar/stage-viewer";
import { TranslationPicker } from "@/components/predicar/translation-picker";
import { useSermon } from "@/lib/sermon/sermon-context";
import { cn } from "@/lib/utils";

export function PresenterConsole({ onOpenBible }: { onOpenBible: () => void }) {
  const {
    sermon,
    stageBlocks,
    activeIndex,
    goNext,
    goPrev,
    toggleBlackScreen,
    blackScreen,
    setActiveIndex,
    openNewSermonDialog,
  } = useSermon();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "b" || e.key === "B") {
        toggleBlackScreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, toggleBlackScreen]);

  return (
    <div className="flex h-full min-h-[min(100dvh-6rem,900px)] flex-col rounded-2xl border border-border-subtle bg-void overflow-hidden shadow-xl">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-bold text-white">{sermon.title}</p>
          <p className="text-xs text-white/50">
            Diapositiva {stageBlocks.length ? activeIndex + 1 : 0} de {stageBlocks.length}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <TranslationPicker compact />
          <Link
            href="/predicar/visor"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110"
          >
            Visor ↗
          </Link>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(140px,32%)_auto_minmax(0,1fr)]">
        <div className="relative min-h-0 overflow-hidden border-b border-white/10">
          <StageViewer compact />
          {blackScreen ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black text-xs text-white/40">
              Pantalla en negro (B)
            </div>
          ) : null}
        </div>

        <div className="shrink-0 border-b border-white/10 p-3">
          <PresenterTimer />
        </div>

        <div className="flex min-h-0 flex-col p-3 pt-0">
          <PresenterNotesPanel />
        </div>
      </div>

      <div className="shrink-0 border-t border-white/10 p-3 space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={activeIndex <= 0}
            className="flex-1 rounded-xl border border-white/15 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 disabled:opacity-30"
          >
            ← Anterior
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={activeIndex >= stageBlocks.length - 1}
            className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-30"
          >
            Siguiente →
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenBible}
            className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
          >
            Biblia (⌘K)
          </button>
          <button
            type="button"
            onClick={toggleBlackScreen}
            className={cn(
              "rounded-lg px-3 py-2 text-xs font-semibold transition",
              blackScreen ? "bg-white text-void" : "border border-white/15 text-white/80 hover:bg-white/10",
            )}
          >
            Negro (B)
          </button>
          <button
            type="button"
            onClick={openNewSermonDialog}
            className="rounded-lg px-3 py-2 text-xs font-semibold text-white/40 hover:text-white"
          >
            Nuevo
          </button>
        </div>
        {stageBlocks.length > 1 ? (
          <div className="flex gap-1 overflow-x-auto pb-1">
            {stageBlocks.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
                  i === activeIndex ? "bg-accent text-white" : "bg-white/10 text-white/70 hover:bg-white/15",
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
