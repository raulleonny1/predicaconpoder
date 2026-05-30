"use client";

import { useSermon } from "@/lib/sermon/sermon-context";
import type { SermonBlock } from "@/lib/sermon/types";
import { cn } from "@/lib/utils";

function StageBlockContent({ block }: { block: SermonBlock }) {
  if (block.type === "scripture" && block.scripture) {
    return (
      <div className="space-y-6">
        <p className="font-heading text-2xl font-bold tracking-wide text-accent-glow/90 sm:text-3xl">
          {block.scripture.reference}
        </p>
        <div className="space-y-4">
          {block.scripture.verses.map((v) => (
            <p key={v.verse} className="stage-verse text-pretty">
              <sup className="mr-2 text-[0.45em] font-bold text-accent-glow/80">{v.verse}</sup>
              {v.text}
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "heading") {
    return (
      <h1 className="stage-heading text-pretty font-heading font-extrabold tracking-tight">
        {block.content}
      </h1>
    );
  }

  return <p className="stage-body text-pretty whitespace-pre-wrap">{block.content}</p>;
}

export function StageViewer({ compact }: { compact?: boolean }) {
  const { stageBlocks, activeIndex, blackScreen, hydrated } = useSermon();
  const block = stageBlocks[activeIndex];

  if (!hydrated) {
    return (
      <div className={cn("flex items-center justify-center", compact ? "min-h-[200px]" : "min-h-screen")}>
        <span className="text-white/40">Cargando…</span>
      </div>
    );
  }

  if (blackScreen) {
    return <div className={cn("bg-black", compact ? "min-h-[200px]" : "min-h-screen")} />;
  }

  if (!block) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4 text-center text-white/50",
          compact ? "min-h-[200px] px-6" : "min-h-screen px-12",
        )}
      >
        <p className="font-heading text-2xl">Sin diapositivas en pantalla</p>
        <p className="text-sm">Marca bloques como visibles o añade contenido al mensaje.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "stage-canvas flex flex-col justify-center bg-void text-white",
        compact ? "min-h-[220px] px-6 py-8" : "min-h-screen px-[clamp(2rem,6vw,8rem)] py-[clamp(2rem,5vh,4rem)]",
      )}
    >
      <div className="mx-auto w-full max-w-[min(100%,64rem)] animate-in fade-in duration-300">
        <StageBlockContent block={block} />
      </div>
      {!compact && stageBlocks.length > 1 ? (
        <div className="fixed bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/5 px-3 py-2 backdrop-blur-sm">
          {stageBlocks.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === activeIndex ? "w-6 bg-accent-glow" : "w-1.5 bg-white/25",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
