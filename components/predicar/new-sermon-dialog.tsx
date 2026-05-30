"use client";

import { useSermon } from "@/lib/sermon/sermon-context";

export function NewSermonDialog() {
  const {
    newSermonDialogOpen,
    closeNewSermonDialog,
    confirmNewSermon,
    sermon,
  } = useSermon();

  if (!newSermonDialogOpen) return null;

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        aria-label="Cerrar"
        onClick={closeNewSermonDialog}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-sermon-title"
        className="relative w-full max-w-md rounded-2xl border border-border-subtle bg-surface p-6 shadow-2xl"
      >
        <h2 id="new-sermon-title" className="font-heading text-lg font-bold text-ink">
          ¿Crear un mensaje nuevo?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Tienes cambios en «{sermon.title}». ¿Quieres guardarlo en tu biblioteca antes de empezar
          uno nuevo?
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => confirmNewSermon(true)}
            className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white hover:brightness-110"
          >
            Guardar y crear nuevo
          </button>
          <button
            type="button"
            onClick={() => confirmNewSermon(false)}
            className="flex-1 rounded-xl border border-border-subtle px-4 py-2.5 text-sm font-semibold text-ink hover:border-accent/30"
          >
            Crear sin guardar
          </button>
          <button
            type="button"
            onClick={closeNewSermonDialog}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted hover:text-ink"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
