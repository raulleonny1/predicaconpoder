import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { BIBLIOTECA_RECURSOS } from "@/lib/content/biblioteca-recursos";

export const metadata: Metadata = {
  title: "Biblioteca",
  description: "Recursos descargables para apoyar tu estudio bíblico y tu vida espiritual.",
};

export default function BibliotecaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Recursos"
        title="Biblioteca"
        description="Encuentra materiales prácticos para estudiar, planificar y seguir creciendo en tu fe."
      />
      <div className="border-b border-border-subtle py-10 sm:py-12 lg:py-14">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {BIBLIOTECA_RECURSOS.map((recurso) => (
                <div key={recurso.title} className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-sm shadow-slate-900/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{recurso.type}</p>
                  <h2 className="mt-3 text-xl font-bold text-ink">{recurso.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{recurso.description}</p>
                  <a
                    href={`/resources/${recurso.fileName}`}
                    download
                    className="mt-6 inline-flex min-h-[2.75rem] items-center justify-center rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-void-elevated"
                  >
                    Descargar recurso
                  </a>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
