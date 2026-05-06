import Link from "next/link";
import type { SerieBiblica } from "@/lib/content/series-por-temas-types";

type SerieCardLinkProps = {
  serie: SerieBiblica;
};

export function SerieCardLink({ serie }: SerieCardLinkProps) {
  return (
    <Link
      href={`/estudios/por-temas/${serie.slug}`}
      className="group flex flex-col rounded-2xl border border-border-subtle bg-surface p-5 card-shine transition touch-manipulation active:scale-[0.99] sm:p-6 sm:hover:-translate-y-1 sm:hover:border-accent/25"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-2xl" aria-hidden>
          {serie.emoji}
        </span>
        <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-accent">
          Serie {serie.order}
        </span>
      </div>
      <h2 className="mt-4 text-pretty font-heading text-lg font-bold text-ink group-hover:text-accent sm:text-xl">
        {serie.title}
      </h2>
      <p className="mt-1 text-sm font-medium text-muted">{serie.subtitle}</p>
      <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-muted">{serie.description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent transition group-hover:gap-3">
        Ver {serie.lecciones.length} lecciones
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
