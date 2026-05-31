"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PresenterNotesPanel } from "@/components/predicar/presenter-notes-panel";
import { PresenterTimer } from "@/components/predicar/presenter-timer";
import { StageViewer } from "@/components/predicar/stage-viewer";
import { WhiteboardToolbar } from "@/components/predicar/stage-whiteboard";
import { TranslationPicker } from "@/components/predicar/translation-picker";
import { useSermon } from "@/lib/sermon/sermon-context";
import { getBlockDisplayLabel } from "@/lib/sermon/types";
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
    activeStageBlock,
    whiteboardMode,
    annotationTool,
    annotationColor,
    setWhiteboardMode,
    setAnnotationTool,
    setAnnotationColor,
    clearBlockAnnotations,
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
    <div className="grid h-full min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] overflow-hidden rounded-2xl border border-border-subtle bg-void shadow-xl">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-3 sm:px-4">
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
            className="inline-flex min-h-11 items-center rounded-lg bg-accent px-3 py-2 text-xs font-bold text-white transition hover:brightness-110"
          >
            Visor ↗
          </Link>
        </div>
      </div>

      {/* Cronómetro primero: siempre visible, no lo tapa la vista previa */}
      <div className="relative z-20 shrink-0 border-b border-white/10 bg-void p-3">
        <PresenterTimer />
      </div>

      <div className="presenter-console-body min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
        <div className="relative isolate max-h-40 min-h-[7.5rem] shrink-0 overflow-hidden border-b border-white/10 bg-void">
          <div className="h-full max-h-40 overflow-y-auto overscroll-contain">
            <StageViewer compact whiteboard />
          </div>
          {blackScreen ? (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black text-xs text-white/40">
              Pantalla en negro (B)
            </div>
          ) : null}
        </div>

        <div className="relative z-10 shrink-0 border-b border-white/10 bg-void p-3">
          <WhiteboardToolbar
            compact
            activeTool={annotationTool}
            activeColor={annotationColor}
            whiteboardMode={whiteboardMode}
            onToolChange={setAnnotationTool}
            onColorChange={setAnnotationColor}
            onToggleMode={() => setWhiteboardMode(!whiteboardMode)}
            onClearSlide={() => {
              if (activeStageBlock) clearBlockAnnotations(activeStageBlock.id);
            }}
          />
        </div>

        <div className="flex min-h-[8rem] flex-1 flex-col p-3 pt-0">
          <PresenterNotesPanel />
        </div>
      </div>

      <div className="presenter-console-dock z-30 space-y-3 border-t border-white/10 bg-void p-3 safe-area-bottom safe-area-x">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={activeIndex <= 0}
            className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-white/15 text-sm font-bold text-white transition hover:bg-white/10 disabled:opacity-30"
          >
            ← Anterior
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={activeIndex >= stageBlocks.length - 1}
            className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-30"
          >
            Siguiente →
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenBible}
            className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
          >
            Biblia
          </button>
          <button
            type="button"
            onClick={toggleBlackScreen}
            className={cn(
              "inline-flex min-h-11 items-center rounded-lg px-4 py-2 text-sm font-semibold transition",
              blackScreen ? "bg-white text-void" : "border border-white/15 text-white/80 hover:bg-white/10",
            )}
          >
            Negro
          </button>
          <button
            type="button"
            onClick={openNewSermonDialog}
            className="inline-flex min-h-11 items-center rounded-lg px-4 py-2 text-sm font-semibold text-white/40 hover:text-white"
          >
            Nuevo
          </button>
        </div>
        {stageBlocks.length > 1 ? (
          <div className="flex gap-1.5 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
            {stageBlocks.map((b, i) => {
              const blockIndex = sermon.blocks.findIndex((x) => x.id === b.id);
              return (
                <button
                  key={b.id}
                  type="button"
                  title={getBlockDisplayLabel(b, blockIndex >= 0 ? blockIndex : i)}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "flex h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-sm font-medium transition",
                    i === activeIndex ? "bg-accent text-white" : "bg-white/10 text-white/70 hover:bg-white/15",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
