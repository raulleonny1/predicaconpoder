"use client";

import { FormattedText } from "@/components/predicar/formatted-text";
import { StageCanvasLayer } from "@/components/predicar/stage-whiteboard";
import { useSermon } from "@/lib/sermon/sermon-context";
import type { SermonBlock } from "@/lib/sermon/types";
import { cn } from "@/lib/utils";

function StageBlockContent({ block, compact }: { block: SermonBlock; compact?: boolean }) {
  if (block.type === "scripture" && block.scripture) {
    return (
      <div className={cn("space-y-3", !compact && "space-y-6")}>
        <p
          className={cn(
            "font-heading font-bold tracking-wide text-accent-glow/90",
            compact ? "text-sm leading-snug" : "text-2xl sm:text-3xl",
          )}
        >
          {block.scripture.reference}
        </p>
        <div className={cn("space-y-2", !compact && "space-y-4")}>
          {block.scripture.verses.map((v) => (
            <p
              key={v.verse}
              className={cn("text-pretty", compact ? "text-xs leading-relaxed" : "stage-verse")}
            >
              <sup className="mr-1 text-[0.45em] font-bold text-accent-glow/80">{v.verse}</sup>
              {v.text}
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "heading") {
    return (
      <h1
        className={cn(
          "text-pretty font-heading font-extrabold tracking-tight break-words",
          compact ? "text-base leading-snug sm:text-lg" : "stage-heading",
        )}
      >
        <FormattedText content={block.content} />
      </h1>
    );
  }

  return (
    <p
      className={cn(
        "text-pretty whitespace-pre-wrap break-words",
        compact ? "text-sm leading-relaxed" : "stage-body",
      )}
    >
      <FormattedText content={block.content} />
    </p>
  );
}

export function StageViewer({
  compact,
  whiteboard,
}: {
  compact?: boolean;
  whiteboard?: boolean;
}) {
  const {
    stageBlocks,
    activeIndex,
    blackScreen,
    hydrated,
    whiteboardMode,
    annotationTool,
    annotationColor,
    getBlockAnnotations,
    addDrawPath,
    removeDrawPaths,
  } = useSermon();

  const block = stageBlocks[activeIndex];
  const pizarra = Boolean(whiteboard && whiteboardMode);
  const fullscreenDraw = pizarra && !compact;
  const annotations = block ? getBlockAnnotations(block.id) : { paths: [] };

  if (!hydrated) {
    return (
      <div className={cn("flex items-center justify-center", compact ? "min-h-[200px]" : "fixed inset-0")}>
        <span className="text-white/40">Cargando…</span>
      </div>
    );
  }

  if (blackScreen) {
    return <div className={cn("bg-black", compact ? "min-h-[200px]" : "fixed inset-0")} />;
  }

  if (!block) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4 text-center text-white/50",
          compact ? "min-h-[200px] px-6" : "fixed inset-0 px-12",
        )}
      >
        <p className="font-heading text-2xl">Sin diapositivas en pantalla</p>
        <p className="text-sm">Marca bloques como visibles o añade contenido al mensaje.</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "stage-canvas relative flex flex-col justify-center bg-void text-white",
          compact
            ? "min-h-[160px] overflow-hidden px-4 py-4"
            : "fixed inset-0 overflow-hidden overscroll-none touch-none px-[clamp(2rem,6vw,8rem)] py-[clamp(2rem,5vh,4rem)]",
          pizarra && "select-none",
        )}
        style={fullscreenDraw ? { touchAction: "none" } : undefined}
      >
        <div
          className={cn(
            "relative mx-auto w-full animate-in fade-in duration-300",
            compact ? "max-w-full" : "max-w-[min(100%,64rem)]",
          )}
        >
          <StageBlockContent block={block} compact={compact} />
          {pizarra && compact ? (
            <StageCanvasLayer
              paths={annotations.paths}
              tool={annotationTool}
              color={annotationColor}
              enabled
              onAddPath={(path) => addDrawPath(block.id, path)}
              onRemovePaths={(ids) => removeDrawPaths(block.id, ids)}
            />
          ) : null}
        </div>
        {!compact && stageBlocks.length > 1 && !pizarra ? (
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

      {fullscreenDraw ? (
        <StageCanvasLayer
          paths={annotations.paths}
          tool={annotationTool}
          color={annotationColor}
          enabled
          fullscreen
          onAddPath={(path) => addDrawPath(block.id, path)}
          onRemovePaths={(ids) => removeDrawPaths(block.id, ids)}
        />
      ) : null}
    </>
  );
}
