import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Donar",
  description: "Apoya la plataforma con una donación, comparte recursos o contáctanos para ayudar.",
};

const methods = [
  {
    title: "Transferencia bancaria",
    description:
      "Envía tu aporte directo a nuestra cuenta. Es el método más rápido y seguro para donaciones regulares.",
    details: ["Banco: Banco de la Fe", "Titular: Predicar con Poder", "CLABE: 012345678901234567"],
  },
  {
    title: "Donación por correo",
    description:
      "Escríbenos para recibir los datos exactos de pago o una pasarela segura cuando esté lista.",
    details: ["Envía un correo a contacto@predicaconpoder.com", "Asunto: Donación"],
  },
  {
    title: "Comparte y apoya",
    description:
      "Ayuda a que más personas conozcan el ministerio. Compartir el sitio es una forma poderosa de apoyo.",
    details: ["Comparte en redes sociales", "Recomienda a amigos y líderes de tu iglesia"],
  },
];

export default function DonarPage() {
  return (
    <>
      <PageHeader
        eyebrow="Apoyo"
        title="Donaciones"
        description="Tu ayuda mantiene los estudios, los recursos gratuitos y el crecimiento del ministerio. Elige la forma que más te convenga."
      />
      <div className="border-b border-border-subtle py-10 sm:py-12 lg:py-14">
        <Container>
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="grid gap-5 lg:grid-cols-3">
              {methods.map((method) => (
                <article
                  key={method.title}
                  className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-sm shadow-slate-900/5"
                >
                  <h2 className="text-lg font-bold text-ink">{method.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{method.description}</p>
                  <ul className="mt-5 space-y-2 text-sm text-ink">
                    {method.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="rounded-3xl border border-accent/20 bg-accent/10 p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">¿Listo para apoyar?</p>
              <h2 className="mt-3 text-3xl font-bold text-ink">Conéctate con nosotros y recibe instrucciones</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Si prefieres un método específico o necesitas ayuda para completar tu donación, contáctanos y te responderemos con los datos exactos.
              </p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="mailto:contacto@predicaconpoder.com?subject=Donación%20a%20Predicar%20con%20Poder"
                  className="inline-flex min-h-[3rem] items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-void-elevated"
                >
                  Enviar correo de donación
                </Link>
                <Link
                  href="/contacto"
                  className="inline-flex min-h-[3rem] items-center justify-center rounded-full border border-border-subtle bg-surface px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent/40"
                >
                  Más formas de contacto
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
