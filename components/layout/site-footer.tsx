import Link from "next/link";
import { BrandMark } from "@/components/layout/brand-mark";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-void pb-[max(1rem,env(safe-area-inset-bottom))] text-slate-300">
      <Container className="py-12 sm:py-14 lg:py-20">
        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-5">
            <div className="flex flex-wrap items-center gap-3">
              <BrandMark className="shadow-indigo-900/50" />
              <p className="min-w-0 font-heading text-base font-bold tracking-tight text-white sm:text-lg">
                <span className="break-words">{siteConfig.name}</span>
              </p>
            </div>
            <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-slate-400">{siteConfig.description}</p>
            <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-pretty text-sm leading-relaxed text-slate-400">
              <span className="text-indigo-300">«Buscad primeramente el reino de Dios y su justicia…»</span>
              <span className="mt-2 block text-xs font-medium text-slate-500">Mateo 6:33</span>
            </p>
          </div>

          <div className="min-w-0 lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Producto</p>
            <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-10 items-center text-sm text-slate-400 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={siteConfig.donatePath}
                  className="inline-flex min-h-10 items-center text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
                >
                  Apoyar el ministerio
                </Link>
              </li>
            </ul>
          </div>

          <div className="min-w-0 md:col-span-2 lg:col-span-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Contacto</p>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-slate-400 sm:mt-5">
              ¿Preguntas, colaboración o petición de oración? Estamos para servirte.
            </p>
            <Link
              href="/contacto"
              className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-white transition hover:text-indigo-300 sm:mt-4"
            >
              Escríbenos
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-pretty">
            © {year} {siteConfig.name}. Hecho con propósito eterno.
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="rounded-md bg-white/5 px-2 py-1 font-mono text-[0.65rem] text-slate-400">Next.js</span>
            <span className="hidden text-slate-600 sm:inline">·</span>
            <span className="rounded-md bg-white/5 px-2 py-1 font-mono text-[0.65rem] text-slate-400">Vercel</span>
            <span className="hidden text-slate-600 sm:inline">·</span>
            <span className="text-slate-500">listo para escalar</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
