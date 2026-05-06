import type { Metadata } from "next";
import Link from "next/link";
import { EstudiosBreadcrumb } from "@/components/estudios/estudios-breadcrumb";
import { SerieCardLink } from "@/components/estudios/serie-card-link";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { SERIES_BIBLICAS } from "@/lib/content/series-por-temas-data";

export const metadata: Metadata = {
  title: "Estudios por temas y series",
  description:
    "Series bíblicas por temas: fundamentos de la fe y más. Cada serie tiene lecciones listas para estudiar en grupo o uno a uno.",
};

export default function EstudiosPorTemasPage() {
  const series = [...SERIES_BIBLICAS].sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHeader
        eyebrow="Por tema"
        title="Estudios bíblicos por series"
        description="Cada serie agrupa lecciones consecutivas sobre un mismo eje. Empieza por Fundamentos de la fe para nuevos creyentes o visitantes; el contenido está listo para abrir, leer y dialogar."
      />

      <div className="border-b border-border-subtle py-10 sm:py-12 lg:py-14">
        <Container>
          <EstudiosBreadcrumb
            items={[
              { href: "/", label: "Inicio" },
              { href: "/estudios", label: "Estudios bíblicos" },
              { href: "/estudios/por-temas", label: "Por temas" },
            ]}
          />

          <div className="mt-8 rounded-2xl border border-border-subtle bg-indigo-50/40 p-4 text-sm text-muted sm:p-5">
            <p className="text-pretty">
              <strong className="text-ink">Cómo usar las series:</strong> entra en una serie, sigue el orden de las
              lecciones y usa los textos y preguntas como guía. Puedes ampliar con tu propia biblioteca o notas pastorales.
            </p>
          </div>

          <section className="mt-10" aria-labelledby="series-disponibles">
            <h2 id="series-disponibles" className="sr-only">
              Series disponibles
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:gap-6">
              {series.map((serie) => (
                <li key={serie.slug} className="min-w-0">
                  <SerieCardLink serie={serie} />
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/estudios"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border-subtle bg-surface px-5 text-sm font-bold text-ink shadow-sm transition hover:border-accent/30"
            >
              ← Volver a categorías de estudios
            </Link>
            <Link
              href="/estudios/por-temas/fundamentos-de-la-fe"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-accent to-accent-glow px-5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
            >
              Ir a Serie 1 →
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
