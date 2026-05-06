import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Blog",
  description: "Reflexiones cristianas, devocionales breves y artículos para la vida diaria.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reflexiones"
        title="Blog"
        description="Pronto encontrarás entradas ordenadas por fecha y tema. Estamos preparando el archivo de artículos."
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
