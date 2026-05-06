import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownArticle } from "@/components/content/markdown-article";
import { EstudiosBreadcrumb } from "@/components/estudios/estudios-breadcrumb";
import { Container } from "@/components/ui/container";
import {
  FUNDAMENTOS_CURSO_CHAPTERS,
  getFundamentosChapter,
  getFundamentosNeighbors,
} from "@/lib/content/fundamentos-estudios-curso";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return FUNDAMENTOS_CURSO_CHAPTERS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ch = getFundamentosChapter(slug);
  if (!ch) return { title: "Lección" };
  return {
    title: ch.title,
    description: `${ch.label} — ${ch.moduleTitle}. Curso: cómo dar estudios bíblicos efectivos.`,
  };
}

export default async function FundamentosChapterPage({ params }: PageProps) {
  const { slug } = await params;
  const chapter = getFundamentosChapter(slug);
  if (!chapter) notFound();

  const { prev, next } = getFundamentosNeighbors(chapter.order);

  return (
    <>
      <div className="border-b border-border-subtle bg-surface">
        <Container className="py-8 sm:py-10 lg:py-12">
          <EstudiosBreadcrumb
            items={[
              { href: "/", label: "Inicio" },
              { href: "/estudios", label: "Estudios bíblicos" },
              { href: "/estudios/cursos-fundamentales", label: "Cursos fundamentales" },
              { href: `/estudios/cursos-fundamentales/${chapter.slug}`, label: chapter.label },
            ]}
          />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent">{chapter.moduleTitle}</p>
          <p className="mt-2 text-sm font-semibold text-muted">{chapter.label}</p>
          <h1 className="mt-2 text-pretty font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {chapter.title}
          </h1>
        </Container>
      </div>

      <div className="border-b border-border-subtle py-10 sm:py-12 lg:py-14">
        <Container>
          <article className="mx-auto max-w-3xl">
            <MarkdownArticle markdown={chapter.body} />
          </article>

          <nav
            className="mx-auto mt-14 flex max-w-3xl flex-col gap-3 border-t border-border-subtle pt-10 sm:flex-row sm:justify-between"
            aria-label="Navegación entre lecciones"
          >
            {prev ? (
              <Link
                href={`/estudios/cursos-fundamentales/${prev.slug}`}
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
                href={`/estudios/cursos-fundamentales/${next.slug}`}
                className="inline-flex min-h-12 flex-1 flex-col justify-center rounded-2xl border border-border-subtle bg-canvas/60 px-4 py-3 text-right transition hover:border-accent/30 sm:max-w-[48%]"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Siguiente</span>
                <span className="mt-1 font-semibold text-ink">{next.title}</span>
              </Link>
            ) : (
              <span className="hidden flex-1 sm:block" />
            )}
          </nav>

          <div className="mx-auto mt-8 max-w-3xl text-center">
            <Link
              href="/estudios/cursos-fundamentales"
              className="inline-flex min-h-11 items-center justify-center text-sm font-bold text-accent transition hover:underline"
            >
              ↑ Índice del curso
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
