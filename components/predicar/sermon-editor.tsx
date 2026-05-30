"use client";

import { useState } from "react";
import { BibleSearch } from "@/components/predicar/bible-search";
import { SermonImport } from "@/components/predicar/sermon-import";
import { useSermon } from "@/lib/sermon/sermon-context";
import type { SermonBlock, SermonBlockType } from "@/lib/sermon/types";
import { cn } from "@/lib/utils";

const BLOCK_LABELS: Record<SermonBlockType, string> = {
  heading: "Título",
  text: "Texto",
  scripture: "Escritura",
  note: "Nota (solo tú)",
};

function BlockIcon({ type }: { type: SermonBlockType }) {
  const cls = "h-4 w-4";
  if (type === "scripture") {
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
  }
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  );
}

function SermonBlockCard({
  block,
  index,
  isActive,
  onFocus,
  onOpenBible,
}: {
  block: SermonBlock;
  index: number;
  isActive: boolean;
  onFocus: () => void;
  onOpenBible: (afterId: string) => void;
}) {
  const { updateBlock, removeBlock, moveBlock } = useSermon();

  return (
    <article
      className={cn(
        "group rounded-2xl border bg-surface transition-shadow",
        isActive ? "border-accent/40 card-shine ring-2 ring-accent/20" : "border-border-subtle hover:border-accent/20",
        block.type === "note" && "border-dashed bg-canvas/50",
      )}
      onClick={onFocus}
    >
      <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-2">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
          <BlockIcon type={block.type} />
          {BLOCK_LABELS[block.type]}
        </span>
        <span className="text-xs text-muted/60">#{index + 1}</span>
        <div className="ml-auto flex items-center gap-1">
          <label className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-muted hover:bg-canvas">
            <input
              type="checkbox"
              checked={block.showOnStage}
              onChange={(e) => updateBlock(block.id, { showOnStage: e.target.checked })}
              className="rounded border-border-subtle text-accent focus:ring-accent"
            />
            Pantalla
          </label>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              moveBlock(block.id, "up");
            }}
            className="rounded-lg p-1.5 text-muted hover:bg-canvas hover:text-ink"
            aria-label="Subir"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              moveBlock(block.id, "down");
            }}
            className="rounded-lg p-1.5 text-muted hover:bg-canvas hover:text-ink"
            aria-label="Bajar"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeBlock(block.id);
            }}
            className="rounded-lg p-1.5 text-muted hover:bg-red-50 hover:text-red-600"
            aria-label="Eliminar"
          >
            ×
          </button>
        </div>
      </div>

      <div className="p-4">
        {block.type === "scripture" && block.scripture ? (
          <div className="space-y-2">
            <p className="font-heading text-sm font-bold text-accent">{block.scripture.reference}</p>
            <p className="line-clamp-4 text-sm leading-relaxed text-muted">
              {block.scripture.verses.map((v) => v.text).join(" ")}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenBible(block.id);
              }}
              className="text-xs font-semibold text-accent hover:underline"
            >
              Cambiar pasaje
            </button>
          </div>
        ) : (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            rows={block.type === "heading" ? 2 : 4}
            className={cn(
              "w-full resize-y rounded-xl border border-transparent bg-canvas/60 px-3 py-2 text-ink outline-none transition focus:border-accent/30 focus:bg-surface focus:ring-2 focus:ring-accent/15",
              block.type === "heading" && "font-heading text-lg font-bold",
              block.type === "note" && "text-sm italic text-muted",
            )}
            placeholder={BLOCK_LABELS[block.type]}
          />
        )}
      </div>
    </article>
  );
}

export function SermonEditor() {
  const { sermon, setTitle, addBlock, insertScripture, stageBlocks, setActiveIndex, activeIndex } =
    useSermon();
  const [bibleOpen, setBibleOpen] = useState(false);
  const [insertAfterId, setInsertAfterId] = useState<string | undefined>();

  const openBible = (afterId?: string) => {
    setInsertAfterId(afterId);
    setBibleOpen(true);
  };

  const focusBlockOnStage = (block: SermonBlock) => {
    if (!block.showOnStage) return;
    const idx = stageBlocks.findIndex((b) => b.id === block.id);
    if (idx >= 0) setActiveIndex(idx);
  };

  return (
    <>
      <div className="space-y-4">
        <SermonImport />

        <input
          type="text"
          value={sermon.title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border-0 bg-transparent font-heading text-2xl font-extrabold tracking-tight text-ink outline-none placeholder:text-muted/50 focus:ring-0"
          placeholder="Título del mensaje"
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => openBible()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-glow px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition hover:brightness-110"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Biblia
          </button>
          {(["heading", "text", "note"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addBlock(type)}
              className="rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent/30"
            >
              + {BLOCK_LABELS[type]}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {sermon.blocks.map((block, i) => {
            const stageIdx = block.showOnStage ? stageBlocks.findIndex((b) => b.id === block.id) : -1;
            return (
              <SermonBlockCard
                key={block.id}
                block={block}
                index={i}
                isActive={stageIdx === activeIndex}
                onFocus={() => focusBlockOnStage(block)}
                onOpenBible={openBible}
              />
            );
          })}
        </div>
      </div>

      <BibleSearch
        open={bibleOpen}
        onClose={() => setBibleOpen(false)}
        onSelectPassage={(passage) => insertScripture(passage, insertAfterId)}
      />
    </>
  );
}
