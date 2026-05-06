import type { Metadata } from "next";
import Link from "next/link";
import { EstudiosBreadcrumb } from "@/components/estudios/estudios-breadcrumb";
import { FundamentosChapterList } from "@/components/estudios/fundamentos-chapter-list";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { FUNDAMENTOS_CURSO_CHAPTERS } from "@/lib/content/fundamentos-estudios-curso";

export const metadata: Metadata = {
  title: "Cursos fundamentales",
  description:
    "Curso completo: cómo dar estudios bíblicos efectivos — fundamentos, preparación, metodología, serie modelo y habilidades prácticas.",
};

export default function CursosFundamentalesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Formación"
        title="Cómo dar estudios bíblicos efectivos"
        description="Curso progresivo: desde el carácter y la oración hasta la estructura de cada lección, una serie modelo de cinco estudios y cierre con práctica supervisada. Toca un capítulo de la lista para leerlo."
      />

      <div className="border-b border-border-subtle py-10 sm:py-12 lg:py-14">
        <Container>
          <EstudiosBreadcrumb
            items={[
              { href: "/", label: "Inicio" },
              { href: "/estudios", label: "Estudios bíblicos" },
              { href: "/estudios/cursos-fundamentales", label: "Cursos fundamentales" },
            ]}
          />

          <div className="mt-8 rounded-2xl border border-border-subtle bg-indigo-50/40 p-4 text-sm text-muted sm:p-5">
            <p className="text-pretty">
              <strong className="text-ink">Cómo usar este curso:</strong> avanza en orden o salta al tema que necesites.
              Cada lección incluye ejercicios prácticos; el capítulo extra sugiere una bitácora para seguimiento.
            </p>
          </div>

          <div className="mt-10">
            <FundamentosChapterList chapters={FUNDAMENTOS_CURSO_CHAPTERS} />
          </div>

          <div className="mt-12 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/estudios"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border-subtle bg-surface px-5 text-sm font-bold text-ink shadow-sm transition hover:border-accent/30"
            >
              ← Volver a categorías de estudios
            </Link>
            <Link
              href="/estudios/cursos-fundamentales/introduccion"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-accent to-accent-glow px-5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
            >
              Empezar por la introducción →
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
