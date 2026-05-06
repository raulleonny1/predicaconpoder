import Link from "next/link";
import { Container } from "@/components/ui/container";

const features = [
  {
    title: "Estudios bíblicos",
    description:
      "Rutas de aprendizaje ordenadas: libro por libro o por temas, con lecciones que puedes seguir a tu ritmo.",
    href: "/estudios",
    tag: "Series",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
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
    title: "Blog y reflexiones",
    description:
      "Ideas breves y accionables: familia, trabajo, descanso y cultura, siempre ancladas en Cristo.",
    href: "/blog",
    tag: "Lectura",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
    ),
  },
  {
    title: "Biblioteca digital",
    description:
      "PDFs y ebooks listos para imprimir o leer offline: guías, devocionales y material de apoyo.",
    href: "/biblioteca",
    tag: "Descargas",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
] as const;

export function FeatureGrid() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-24" aria-labelledby="recursos-heading">
      <Container>
        <div className="flex max-w-3xl flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2
              id="recursos-heading"
              className="text-pretty font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl lg:text-4xl"
            >
              Todo lo que necesitas, en un solo lugar
            </h2>
            <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-muted sm:mt-3 sm:text-base">
              Diseñado como las mejores plataformas tech: simple por fuera, profundo por dentro.
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-accent">Sin costo · Sin complicaciones</p>
        </div>

        <ul className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {features.map((item) => (
            <li key={item.href} className="min-w-0">
              <Link
                href={item.href}
                className="group relative flex h-full min-h-[12.5rem] flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface p-5 card-shine touch-manipulation transition duration-300 active:scale-[0.99] sm:min-h-0 sm:p-6 sm:hover:-translate-y-1 sm:hover:border-accent/25"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 text-accent ring-1 ring-inset ring-indigo-100 transition group-hover:from-indigo-100 group-hover:to-violet-100 sm:h-12 sm:w-12">
                    {item.icon}
                  </span>
                  <span className="shrink-0 rounded-lg bg-canvas px-2 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-muted sm:text-[0.65rem]">
                    {item.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-pretty font-heading text-lg font-bold text-ink sm:mt-5 sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-accent transition group-hover:gap-2 sm:mt-5">
                  Abrir módulo
                  <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
