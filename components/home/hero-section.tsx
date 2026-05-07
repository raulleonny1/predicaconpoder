import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/container";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border-subtle">
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-[0.65]" aria-hidden />
      <div
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl max-sm:-left-24 max-sm:h-56 max-sm:w-56"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-violet/25 blur-3xl max-sm:-right-16 max-sm:h-64 max-sm:w-64"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[min(100%,48rem)] -translate-x-1/2 rounded-full bg-indigo-400/10 blur-3xl"
        aria-hidden
      />

      <Container className="relative py-12 sm:py-20 lg:py-28">
        <div className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-border-subtle bg-surface/90 px-3 py-2 text-left text-[0.7rem] font-semibold leading-snug text-muted shadow-sm backdrop-blur-sm sm:text-sm">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-pretty">Plataforma digital · 100% gratuita</span>
        </div>

        <h1 className="mt-6 max-w-4xl text-pretty font-heading text-[1.9rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:mt-8 sm:text-5xl md:text-6xl lg:text-7xl">
          Predica con Poder,
          <span className="block bg-gradient-to-r from-accent via-accent-glow to-violet bg-clip-text text-transparent">
            tu espacio para crecer con claridad.
          </span>
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted sm:text-xl lg:text-2xl">
          {siteConfig.tagline} con un diseño cuidado y rutas de aprendizaje prácticas para transformar tu estudio bíblico.
        </p>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted sm:mt-8 sm:text-base">
          Aquí encontrarás estudios bíblicos, reflexiones rápidas y recursos descargables pensados para ayudarte a vivir lo
          que aprendes, sin ruido ni complejidad.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            "Estudia con guía clara",
            "Reflexiona con propósito",
            "Descarga recursos útiles",
          ].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-border-subtle bg-surface/90 px-4 py-4 text-sm font-semibold text-ink shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-10 flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/estudios"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-accent to-accent-glow px-6 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110 active:brightness-95 sm:w-auto sm:min-w-[12rem] sm:px-8"
          >
            Explorar estudios
          </Link>
          <Link
            href="/blog"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-border-subtle bg-surface px-6 text-sm font-bold text-ink shadow-sm transition hover:border-accent/30 hover:shadow-md active:scale-[0.99] sm:w-auto sm:min-w-[12rem] sm:px-8"
          >
            Ver reflexiones
          </Link>
        </div>

        <dl className="mt-14 grid gap-6 border-t border-border-subtle pt-10 sm:grid-cols-3 sm:gap-4">
          {[
            { k: "Enfoque", v: "Evangélico, fiel a las Escrituras" },
            { k: "Formato", v: "Lecturas, guías y descargas" },
            { k: "Acceso", v: "Sin registro para empezar" },
          ].map((item) => (
            <div key={item.k}>
              <dt className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{item.k}</dt>
              <dd className="mt-2 text-sm font-semibold leading-snug text-ink">{item.v}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
