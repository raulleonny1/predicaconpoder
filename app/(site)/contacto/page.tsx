import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta con Predicar con Poder: preguntas, peticiones de oración o colaboración.",
};

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Escríbenos"
        title="Contacto"
        description="Pronto añadiremos un formulario. Mientras tanto, usa el correo general del ministerio."
      />
      <div className="border-b border-border-subtle py-12 lg:py-14">
        <Container>
          <div className="max-w-xl rounded-2xl border border-border-subtle bg-surface p-6 card-shine sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted">Correo</p>
            <a
              href={`mailto:${siteConfig.links.email}`}
              className="mt-2 block break-all text-lg font-bold text-accent transition hover:text-accent-hover"
            >
              {siteConfig.links.email}
            </a>
          </div>
        </Container>
      </div>
    </>
  );
}
