import Link from "next/link";
import type { SerieBiblica } from "@/lib/content/series-por-temas-types";
import { cn } from "@/lib/utils";

type SerieLeccionesListProps = {
  serie: SerieBiblica;
};

export function SerieLeccionesList({ serie }: SerieLeccionesListProps) {
  const lecciones = [...serie.lecciones].sort((a, b) => a.order - b.order);

  return (
    <ol className="space-y-3">
      {lecciones.map((leccion, index) => (
        <li key={leccion.slug}>
          <Link
            href={`/estudios/por-temas/${serie.slug}/${leccion.slug}`}
            className={cn(
              "group flex min-h-[4.25rem] items-center gap-4 rounded-2xl border border-border-subtle bg-surface p-4 card-shine transition",
              "touch-manipulation active:scale-[0.99] sm:hover:-translate-y-0.5 sm:hover:border-accent/25",
            )}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 font-heading text-sm font-bold text-accent ring-1 ring-inset ring-indigo-100">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 font-heading text-base font-bold text-ink group-hover:text-accent sm:text-lg">
              <span className="text-pretty">{leccion.title}</span>
            </span>
            <span className="shrink-0 text-accent transition group-hover:translate-x-0.5" aria-hidden>
              →
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
