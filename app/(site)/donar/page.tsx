import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Donar",
  description: "Apoya con tu donación el ministerio Predicar con Poder y ayuda a mantener los recursos gratuitos.",
};

export default function DonarPage() {
  return (
    <>
      <PageHeader
        eyebrow="Apoyo"
        title="Donaciones"
        description="Estamos preparando opciones seguras de donación (enlace, Stripe u otra pasarela). Si quieres colaborar ya, escríbenos y te enviaremos instrucciones."
      />
      <div className="border-b border-border-subtle py-12 lg:py-14">
        <Container>
          <Link
            href="/contacto"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-accent to-accent-glow px-8 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110"
          >
            Ir a contacto
          </Link>
        </Container>
      </div>
    </>
  );
}
