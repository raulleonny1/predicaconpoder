import type { Metadata } from "next";
import Link from "next/link";
import { StudyCategoryCard } from "@/components/estudios/study-category-card";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Estudios bíblicos",
  description:
    "Elige tu ruta: cursos fundamentales para enseñar la Biblia o estudios organizados por temas.",
};

const categories = [
  {
    href: "/estudios/cursos-fundamentales",
    title: "Cursos fundamentales para dar estudios bíblicos",
    description:
      "Base sólida para quienes quieren preparar lecciones con claridad: método, herramientas y buenas prácticas pastorales.",
    badge: "Formación",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    href: "/estudios/por-temas",
    title: "Estudios bíblicos de diferentes temas",
    description:
      "Explora enseñanzas agrupadas por tema: oración, familia, evangelismo, profecía, carácter cristiano y más.",
    badge: "Por tema",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
] as const;

export default function EstudiosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Aprende y enseña"
        title="Estudios bíblicos"
        description="Elige una ruta. Cada tarjeta te lleva a contenido organizado para estudiar solo, en grupo o para preparar clases."
      />

      <section className="border-b border-border-subtle py-10 sm:py-14 lg:py-16" aria-labelledby="categorias-estudios">
        <Container>
          <h2 id="categorias-estudios" className="sr-only">
            Categorías de estudios
          </h2>
          <ul className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-8">
            {categories.map((cat) => (
              <li key={cat.href} className="min-w-0">
                <StudyCategoryCard
                  href={cat.href}
                  title={cat.title}
                  description={cat.description}
                  badge={cat.badge}
                  icon={cat.icon}
                  className="min-h-[280px] sm:min-h-[320px]"
                />
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-10 max-w-2xl text-center text-pretty text-sm text-muted sm:mt-12">
            ¿Falta un tema que te interese?{" "}
            <Link href="/contacto" className="font-semibold text-accent underline-offset-2 hover:underline">
              Escríbenos
            </Link>
            .
          </p>

          <div className="mt-10 flex justify-center sm:mt-12">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-accent transition hover:gap-3"
            >
              <span aria-hidden>←</span> Volver al inicio
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
