"use client";

import { useSermon } from "@/lib/sermon/sermon-context";
import { stripRichTags } from "@/lib/sermon/rich-text";
import { cn } from "@/lib/utils";

export function PresenterNotesPanel() {
  const {
    sermon,
    setPresenterNotes,
    contextualNotes,
    activeStageBlock,
    stageBlocks,
    activeIndex,
  } = useSermon();

  const nextBlock = stageBlocks[activeIndex + 1];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
      <div className="shrink-0">
        <label className="text-[0.65rem] font-bold uppercase tracking-wider text-white/50">
          Notas generales
        </label>
        <textarea
          value={sermon.presenterNotes}
          onChange={(e) => setPresenterNotes(e.target.value)}
          rows={3}
          placeholder="Recordatorios, anuncios, tiempos…"
          className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-void/80 px-3 py-2 text-sm leading-relaxed text-white/90 outline-none placeholder:text-white/30 focus:border-accent/40 focus:ring-1 focus:ring-accent/30"
        />
      </div>

      {nextBlock ? (
        <div className="shrink-0 rounded-xl border border-accent/20 bg-accent/10 px-3 py-2">
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-accent-glow">
            Siguiente en pantalla
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-medium text-white/90">
            {nextBlock.type === "scripture"
              ? nextBlock.scripture?.reference ?? stripRichTags(nextBlock.content)
              : stripRichTags(nextBlock.content)}
          </p>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-wider text-white/50">
          Notas de esta diapositiva
          {activeStageBlock ? (
            <span className="ml-1 font-normal normal-case text-white/35">
              ({(() => {
                const plain = stripRichTags(activeStageBlock.content);
                return `${plain.slice(0, 40)}${plain.length > 40 ? "…" : ""}`;
              })()})
            </span>
          ) : null}
        </p>

        {contextualNotes.length === 0 ? (
          <p className="text-xs text-white/40">
            Añade bloques tipo «Nota» en el editor; aparecerán aquí según la diapositiva activa.
          </p>
        ) : (
          <ul className="space-y-2">
            {contextualNotes.map((note) => (
              <li
                key={note.id}
                className={cn(
                  "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm leading-relaxed text-white/85",
                )}
              >
                {note.content}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
