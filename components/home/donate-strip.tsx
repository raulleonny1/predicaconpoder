import Link from "next/link";
import { Container } from "@/components/ui/container";

export function DonateStrip() {
  return (
    <section className="py-10 sm:py-14 lg:py-20" aria-labelledby="donar-heading">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-void via-void-elevated to-indigo-950 p-px shadow-2xl shadow-indigo-950/40 sm:rounded-3xl">
          <div className="relative rounded-[1.35rem] bg-gradient-to-br from-void px-4 py-10 sm:rounded-[1.4rem] sm:px-8 sm:py-12 lg:px-14 lg:py-16">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl max-sm:h-48 max-sm:w-48"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-24 left-4 h-72 w-72 rounded-full bg-violet/20 blur-3xl sm:left-10"
              aria-hidden
            />

            <div className="relative flex flex-col gap-8 sm:gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="min-w-0 max-w-xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Sostenibilidad</p>
                <h2
                  id="donar-heading"
                  className="mt-2 text-pretty font-heading text-xl font-extrabold tracking-tight text-white sm:mt-3 sm:text-2xl lg:text-3xl xl:text-4xl"
                >
                  Gratis para todos, posible gracias a la generosidad
                </h2>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-400 sm:mt-4 sm:text-base">
                  Tu donación impulsa nuevos cursos, mantiene la infraestructura y lleva recursos bíblicos a quienes más
                  lo necesitan.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/donar"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-ink shadow-lg touch-manipulation transition hover:bg-slate-100 active:scale-[0.99] sm:w-auto sm:min-w-[10.5rem] sm:px-8"
                >
                  Donar ahora
                </Link>
                <Link
                  href="/contacto"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-bold text-white backdrop-blur-sm touch-manipulation transition hover:bg-white/10 active:scale-[0.99] sm:w-auto sm:min-w-[10.5rem] sm:px-8"
                >
                  Otras formas de ayudar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
