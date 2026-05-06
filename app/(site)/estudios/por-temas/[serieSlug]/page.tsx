import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EstudiosBreadcrumb } from "@/components/estudios/estudios-breadcrumb";
import { SerieLeccionesList } from "@/components/estudios/serie-lecciones-list";
import { Container } from "@/components/ui/container";
import { getSerieBySlug, SERIES_BIBLICAS } from "@/lib/content/series-por-temas-data";

type PageProps = { params: Promise<{ serieSlug: string }> };

export function generateStaticParams() {
  return SERIES_BIBLICAS.map((s) => ({ serieSlug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serieSlug } = await params;
  const serie = getSerieBySlug(serieSlug);
  if (!serie) return { title: "Serie" };
  return {
    title: serie.title,
    description: serie.description,
  };
}

export default async function SeriePage({ params }: PageProps) {
  const { serieSlug } = await params;
  const serie = getSerieBySlug(serieSlug);
  if (!serie) notFound();

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
            ]}
          />
          <p className="mt-4 text-3xl" aria-hidden>
            {serie.emoji}
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">Serie {serie.order}</p>
          <h1 className="mt-2 text-pretty font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {serie.title}
          </h1>
          <p className="mt-2 text-pretty text-lg font-medium text-muted">{serie.subtitle}</p>
          <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-muted">{serie.description}</p>
          {serie.notaParaElMaestro ? (
            <p className="mt-6 max-w-3xl rounded-xl border border-border-subtle bg-canvas/60 p-4 text-pretty text-sm text-muted">
              <strong className="text-ink">Para quien enseña:</strong> {serie.notaParaElMaestro}
            </p>
          ) : null}
        </Container>
      </div>

      <div className="border-b border-border-subtle py-10 sm:py-12 lg:py-14">
        <Container>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-muted">Lecciones de esta serie</h2>
          <div className="mt-4">
            <SerieLeccionesList serie={serie} />
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/estudios/por-temas"
              className="inline-flex min-h-11 items-center justify-center text-sm font-bold text-accent transition hover:underline"
            >
              ← Todas las series
            </Link>
            {serie.lecciones[0] ? (
              <Link
                href={`/estudios/por-temas/${serie.slug}/${[...serie.lecciones].sort((a, b) => a.order - b.order)[0].slug}`}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-accent to-accent-glow px-5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
              >
                Empezar lección 1 →
              </Link>
            ) : null}
          </div>
        </Container>
      </div>
    </>
  );
}
