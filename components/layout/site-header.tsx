"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/layout/brand-mark";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 pt-[max(0.5rem,env(safe-area-inset-top))]">
      <Container className="pt-2 sm:pt-3">
        <div className="flex min-h-14 items-center justify-between gap-2 rounded-2xl border border-border-subtle bg-surface/85 px-2.5 py-2 shadow-sm shadow-slate-900/[0.04] backdrop-blur-xl sm:min-h-[3.75rem] sm:gap-3 sm:px-4 md:px-5">
          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-2 transition-opacity hover:opacity-90 sm:gap-3 sm:flex-initial"
            title={siteConfig.name}
          >
            <BrandMark className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" />
            <span className="min-w-0 font-heading text-sm font-bold leading-snug tracking-tight text-ink sm:text-lg">
              <span className="line-clamp-2 sm:line-clamp-1">{siteConfig.name}</span>
              <span className="block text-xs font-normal text-muted-foreground sm:text-sm sm:inline sm:ml-2">
                {siteConfig.tagline}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Principal">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-canvas hover:text-ink",
                  pathname === item.href &&
                    "bg-gradient-to-b from-indigo-50 to-transparent text-accent",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={siteConfig.donatePath}
              className="ml-2 inline-flex min-h-10 items-center justify-center rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/15 transition hover:bg-void-elevated"
            >
              Donar
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
            <Link
              href={siteConfig.donatePath}
              className="inline-flex min-h-11 min-w-[4.25rem] items-center justify-center rounded-xl bg-ink px-3 text-sm font-semibold text-white"
            >
              Donar
            </Link>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border-subtle bg-canvas/80 text-ink touch-manipulation transition active:scale-[0.98] hover:bg-canvas"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? "Cerrar" : "Menú"}</span>
              {open ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Container>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] lg:hidden"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav"
            className="fixed inset-y-0 right-0 z-50 flex w-[min(100vw-2.5rem,20rem)] flex-col border-l border-border-subtle bg-surface shadow-2xl lg:hidden"
            style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
            role="dialog"
            aria-modal="true"
            aria-label="Navegación móvil"
          >
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
              <span className="font-heading text-sm font-bold text-ink">Menú</span>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border-subtle text-ink touch-manipulation"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "min-h-12 rounded-xl px-4 py-3 text-base font-medium text-ink touch-manipulation transition-colors active:bg-canvas",
                    pathname === item.href && "bg-indigo-50 font-semibold text-accent",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={siteConfig.donatePath}
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex min-h-12 items-center justify-center rounded-xl bg-ink px-4 text-base font-semibold text-white touch-manipulation"
              >
                Donar
              </Link>
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
