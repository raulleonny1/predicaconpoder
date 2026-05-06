import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Biblioteca",
  description: "PDFs, ebooks y recursos descargables para el estudio bíblico y la edificación.",
};

export default function BibliotecaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Recursos"
        title="Biblioteca"
        description="Esta sección reunirá PDFs y ebooks gratuitos. Podrás filtrar por tipo de recurso cuando el catálogo esté disponible."
      />
      <div className="border-b border-border-subtle py-12 lg:py-14">
        <Container>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-accent transition hover:gap-3"
          >
            <span aria-hidden>←</span> Volver al inicio
          </Link>
        </Container>
      </div>
    </>
  );
}
