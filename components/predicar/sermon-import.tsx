"use client";

import { useCallback, useRef, useState } from "react";
import { useSermon } from "@/lib/sermon/sermon-context";
import type { SermonBlock } from "@/lib/sermon/types";
import { createBlockId } from "@/lib/sermon/types";
import { cn } from "@/lib/utils";

type ImportPreview = {
  title: string;
  blocks: SermonBlock[];
  summary: { role: string; label: string; count: number }[];
  charCount: number;
  paragraphCount: number;
};

const ROLE_LABELS: Record<string, string> = {
  intro: "Introducción",
  body: "Desarrollo",
  point: "Puntos",
  conclusion: "Conclusión",
  application: "Aplicación",
  scripture: "Escrituras",
  note: "Notas (solo tú)",
  title: "Título",
};

export function SermonImport() {
  const { replaceSermon, sermon } = useSermon();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    setPreview(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/sermon/import", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "No se pudo importar el archivo.");
        return;
      }

      setPreview(data as ImportPreview);
    } catch {
      setError("Error de conexión al importar.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) void processFile(file);
  };

  const applyImport = (mode: "replace" | "append") => {
    if (!preview) return;

    if (mode === "replace") {
      replaceSermon({
        ...sermon,
        id: sermon.id,
        title: preview.title,
        blocks: preview.blocks,
        presenterNotes: sermon.presenterNotes,
        cloudId: sermon.cloudId,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const merged = [
        ...sermon.blocks,
        {
          id: createBlockId(),
          type: "heading" as const,
          content: "— Importado —",
          showOnStage: true,
        },
        ...preview.blocks,
      ];
      replaceSermon({
        ...sermon,
        title: sermon.title,
        blocks: merged,
      });
    }

    setPreview(null);
  };

  return (
    <div className="rounded-2xl border border-dashed border-accent/35 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-base font-bold text-ink">Importar predicación</h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Sube un Word (.docx) o PDF. El sistema reparte el contenido en introducción, puntos y
            conclusión aunque el documento no lo diga explícitamente.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="shrink-0 rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-void-elevated disabled:opacity-50"
        >
          {loading ? "Analizando…" : "Elegir archivo"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={(e) => onFiles(e.target.files)}
      />

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition",
          dragging
            ? "border-accent bg-accent/10"
            : "border-border-subtle bg-surface/80 hover:border-accent/40",
          loading && "pointer-events-none opacity-60",
        )}
      >
        <svg className="h-10 w-10 text-accent/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="mt-2 text-sm font-semibold text-ink">Arrastra .docx o .pdf aquí</p>
        <p className="mt-1 text-xs text-muted">Máx. 12 MB · Texto con letra seleccionable en PDF</p>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      {preview ? (
        <div className="mt-4 rounded-xl border border-border-subtle bg-surface p-4 card-shine">
          <p className="font-heading text-sm font-bold text-ink">Vista previa del reparto</p>
          <p className="mt-1 text-sm text-muted">
            <span className="font-semibold text-ink">{preview.title}</span>
            {" · "}
            {preview.blocks.length} bloques · {preview.charCount.toLocaleString("es")} caracteres
          </p>

          <ul className="mt-3 flex flex-wrap gap-2">
            {preview.summary.map((s) => (
              <li
                key={`${s.role}-${s.label}`}
                className="rounded-lg bg-canvas px-2.5 py-1 text-xs font-semibold text-ink"
              >
                {ROLE_LABELS[s.role] ?? s.label}: {s.count}
              </li>
            ))}
          </ul>

          <ol className="mt-4 max-h-48 space-y-1.5 overflow-y-auto text-xs text-muted">
            {preview.blocks.slice(0, 12).map((b, i) => (
              <li key={b.id} className="flex gap-2">
                <span className="shrink-0 font-bold text-accent">{i + 1}.</span>
                <span className="uppercase tracking-wide text-[0.6rem] text-muted">{b.type}</span>
                <span className="line-clamp-2 text-ink">{b.content}</span>
              </li>
            ))}
            {preview.blocks.length > 12 ? (
              <li className="text-muted">+ {preview.blocks.length - 12} bloques más…</li>
            ) : null}
          </ol>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyImport("replace")}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white hover:brightness-110"
            >
              Usar como mensaje nuevo
            </button>
            <button
              type="button"
              onClick={() => applyImport("append")}
              className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-ink hover:border-accent/30"
            >
              Añadir al final
            </button>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="rounded-xl px-3 py-2 text-sm text-muted hover:text-ink"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
