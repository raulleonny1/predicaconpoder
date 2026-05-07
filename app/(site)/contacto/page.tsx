import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Formulario de contacto para consultas, peticiones o solicitudes de colaboración.",
};

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Escríbenos"
        title="Contacto"
        description="Completa el formulario y te responderemos lo antes posible. También puedes escribirnos si tienes preguntas sobre estudios, donaciones o recursos."
      />
      <div className="border-b border-border-subtle py-12 lg:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <ContactForm />
          </div>
        </Container>
      </div>
    </>
  );
}
