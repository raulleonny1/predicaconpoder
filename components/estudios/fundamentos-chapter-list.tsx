import Link from "next/link";
import type { FundamentosChapter } from "@/lib/content/fundamentos-estudios-types";
import { groupFundamentosByModule } from "@/lib/content/fundamentos-estudios-curso";
import { cn } from "@/lib/utils";

type FundamentosChapterListProps = {
  chapters: FundamentosChapter[];
};

const kindStyles: Record<FundamentosChapter["kind"], string> = {
  intro: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  chapter: "bg-indigo-50 text-accent ring-indigo-100",
  conclusion: "bg-violet-50 text-violet-800 ring-violet-100",
  practica: "bg-amber-50 text-amber-900 ring-amber-100",
  extra: "bg-slate-100 text-slate-700 ring-slate-200",
};

export function FundamentosChapterList({ chapters }: FundamentosChapterListProps) {
  const groups = groupFundamentosByModule(chapters);

  return (
    <div className="space-y-10 sm:space-y-12">
      {groups.map((group) => (
        <section key={`${group.moduleNumber}-${group.moduleTitle}`} aria-labelledby={`mod-${group.moduleNumber}`}>
          <h2 id={`mod-${group.moduleNumber}`} className="text-sm font-bold uppercase tracking-[0.18em] text-muted">
            {group.moduleTitle}
          </h2>
          <ul className="mt-4 space-y-3">
            {group.items.map((ch) => (
              <li key={ch.slug}>
                <Link
                  href={`/estudios/cursos-fundamentales/${ch.slug}`}
                  className={cn(
                    "group flex min-h-[4.25rem] items-center gap-4 rounded-2xl border border-border-subtle bg-surface p-4 card-shine transition",
                    "touch-manipulation active:scale-[0.99] sm:hover:-translate-y-0.5 sm:hover:border-accent/25",
                  )}
                >
                  <span
                    className={cn(
                      "shrink-0 rounded-xl px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider ring-1 ring-inset",
                      kindStyles[ch.kind],
                    )}
                  >
                    {ch.label}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-pretty font-heading text-base font-bold text-ink group-hover:text-accent sm:text-lg">
                      {ch.title}
                    </span>
                  </span>
                  <span
                    className="shrink-0 text-accent transition group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
