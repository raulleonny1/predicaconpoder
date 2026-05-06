import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownArticle } from "@/components/content/markdown-article";
import { EstudiosBreadcrumb } from "@/components/estudios/estudios-breadcrumb";
import { Container } from "@/components/ui/container";
import {
  getLeccionInSerie,
  getLeccionNeighbors,
  SERIES_BIBLICAS,
} from "@/lib/content/series-por-temas-data";

type PageProps = { params: Promise<{ serieSlug: string; leccionSlug: string }> };

export function generateStaticParams() {
  return SERIES_BIBLICAS.flatMap((serie) =>
    serie.lecciones.map((leccion) => ({
      serieSlug: serie.slug,
      leccionSlug: leccion.slug,
    })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serieSlug, leccionSlug } = await params;
  const data = getLeccionInSerie(serieSlug, leccionSlug);
  if (!data) return { title: "Lección" };
  return {
    title: `${data.leccion.title} | ${data.serie.title}`,
    description: `Lección ${data.leccion.order} — ${data.serie.subtitle}`,
  };
}

export default async function LeccionSeriePage({ params }: PageProps) {
  const { serieSlug, leccionSlug } = await params;
  const data = getLeccionInSerie(serieSlug, leccionSlug);
  if (!data) notFound();

  const { serie, leccion } = data;
  const { prev, next } = getLeccionNeighbors(serie, leccion.order);

  return (
    <>
      <div className="border-b border-border-subtle bg-surface">
        <Container className="py-8 sm:py-10 lg:py-12">
          <EstudiosBreadcrumb
            items={[
              { href: "/", label: "Inicio" },
              { href: "/estudios", label: "Estudios bíblicos" },
              { href: "/estudios/por-temas", label: "Por temas" },
              { href: `/estudios/por-temas/${serie.slug}`, label: `Serie ${serie.order}` },
              { href: `/estudios/por-temas/${serie.slug}/${leccion.slug}`, label: `Lección ${leccion.order}` },
            ]}
          />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {serie.emoji} {serie.title}
          </p>
          <p className="mt-2 text-sm font-semibold text-muted">Lección {leccion.order} de {serie.lecciones.length}</p>
          <h1 className="mt-2 text-pretty font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {leccion.title}
          </h1>
        </Container>
      </div>

      <div className="border-b border-border-subtle py-10 sm:py-12 lg:py-14">
        <Container>
          <article className="mx-auto max-w-3xl">
            <MarkdownArticle markdown={leccion.body} />
          </article>

          <nav
            className="mx-auto mt-14 flex max-w-3xl flex-col gap-3 border-t border-border-subtle pt-10 sm:flex-row sm:justify-between"
            aria-label="Navegación entre lecciones"
          >
            {prev ? (
              <Link
                href={`/estudios/por-temas/${serie.slug}/${prev.slug}`}
                className="inline-flex min-h-12 flex-1 flex-col justify-center rounded-2xl border border-border-subtle bg-canvas/60 px-4 py-3 text-left transition hover:border-accent/30 sm:max-w-[48%]"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Anterior</span>
                <span className="mt-1 font-semibold text-ink">{prev.title}</span>
              </Link>
            ) : (
              <span className="hidden flex-1 sm:block" />
            )}
            {next ? (
              <Link
                href={`/estudios/por-temas/${serie.slug}/${next.slug}`}
                className="inline-flex min-h-12 flex-1 flex-col justify-center rounded-2xl border border-border-subtle bg-canvas/60 px-4 py-3 text-right transition hover:border-accent/30 sm:max-w-[48%]"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Siguiente</span>
                <span className="mt-1 font-semibold text-ink">{next.title}</span>
              </Link>
            ) : (
              <span className="hidden flex-1 sm:block" />
            )}
          </nav>

          <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
            <Link
              href={`/estudios/por-temas/${serie.slug}`}
              className="inline-flex min-h-11 items-center justify-center text-sm font-bold text-accent transition hover:underline"
            >
              ↑ Índice de la serie
            </Link>
            <span className="hidden text-muted sm:inline" aria-hidden>
              ·
            </span>
            <Link
              href="/estudios/por-temas"
              className="inline-flex min-h-11 items-center justify-center text-sm font-bold text-muted transition hover:text-accent"
            >
              Todas las series
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
