"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BibleSearch } from "@/components/predicar/bible-search";
import { PresenterConsole } from "@/components/predicar/presenter-console";
import { AutoCloudSave } from "@/components/predicar/auto-cloud-save";
import { NewSermonDialog } from "@/components/predicar/new-sermon-dialog";
import { SermonLibraryPanel } from "@/components/predicar/sermon-library-panel";
import { SermonEditor } from "@/components/predicar/sermon-editor";
import { TranslationPicker } from "@/components/predicar/translation-picker";
import { AuthUserMenu } from "@/components/predicar/auth-user-menu";
import { useAuth } from "@/lib/auth/auth-context";
import { useSermon } from "@/lib/sermon/sermon-context";
import { BrandMark } from "@/components/layout/brand-mark";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type TabletPanel = "editor" | "console";

function PredicarWorkspaceInner() {
  const { user } = useAuth();
  const { insertScripture, hydrated } = useSermon();
  const [bibleOpen, setBibleOpen] = useState(false);
  const [tabletPanel, setTabletPanel] = useState<TabletPanel>("editor");

  const openBible = useCallback(() => setBibleOpen(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setBibleOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted">
        Preparando tu espacio de predicación…
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden">
      <AutoCloudSave />
      <NewSermonDialog />

      {!user ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950 safe-area-x">
          Modo invitado: puedes predicar y usar la Biblia.{" "}
          <Link href="/predicar/ingresar" className="font-bold text-accent hover:underline">
            Inicia sesión
          </Link>{" "}
          para guardar tus mensajes en tu cuenta privada.
        </div>
      ) : null}

      <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface/90 backdrop-blur-xl safe-area-x safe-area-top">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-h-11 items-center gap-2.5 transition hover:opacity-90">
            <BrandMark className="h-9 w-9" />
            <div>
              <span className="font-heading text-sm font-bold text-ink">{siteConfig.name}</span>
              <span className="block text-xs text-muted">Modo predicación</span>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
            <TranslationPicker />
            <div className="relative">
              <SermonLibraryPanel />
            </div>
            <AuthUserMenu />
            <Link
              href="/predicar/visor"
              target="_blank"
              rel="noopener noreferrer"
              title="Abre la pantalla para proyectar (en otra pestaña). Tú te quedas aquí con el cronómetro."
              className="inline-flex min-h-11 items-center rounded-xl border border-border-subtle bg-canvas px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent/30"
            >
              Visor ↗
            </Link>
            <button
              type="button"
              onClick={openBible}
              className="inline-flex min-h-11 items-center rounded-xl bg-ink px-3 py-2 text-sm font-semibold text-white transition hover:bg-void-elevated"
            >
              Biblia
              <span className="ml-1.5 hidden text-white/60 md:inline">⌘K</span>
            </button>
          </nav>
        </div>
      </header>

      {/* iPad / tablet vertical: alternar editor y consola */}
      <div
        className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 border-b border-border-subtle bg-surface/95 backdrop-blur-md lg:hidden safe-area-x"
        role="tablist"
        aria-label="Sección de predicación"
      >
        <div className="mx-auto flex max-w-[1600px] gap-1 px-4 py-2 sm:px-6">
          <button
            type="button"
            role="tab"
            aria-selected={tabletPanel === "editor"}
            onClick={() => setTabletPanel("editor")}
            className={cn(
              "min-h-11 flex-1 rounded-xl text-sm font-bold transition",
              tabletPanel === "editor"
                ? "bg-accent text-white shadow-md shadow-indigo-500/20"
                : "bg-canvas text-muted",
            )}
          >
            Tu mensaje
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tabletPanel === "console"}
            onClick={() => setTabletPanel("console")}
            className={cn(
              "min-h-11 flex-1 rounded-xl text-sm font-bold transition",
              tabletPanel === "console"
                ? "bg-void text-white shadow-md"
                : "bg-canvas text-muted",
            )}
          >
            Consola
          </button>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 min-h-0 gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[1fr_minmax(300px,42%)] lg:gap-6 lg:overflow-hidden safe-area-x safe-area-bottom">
        <section
          aria-label="Editor del mensaje"
          className={cn(
            "min-h-0 min-w-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-1",
            tabletPanel !== "editor" ? "hidden lg:block" : "flex flex-1 flex-col overflow-y-auto overscroll-contain",
          )}
        >
          <div className="mb-4">
            <h1 className="font-heading text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
              Tu mensaje
            </h1>
            <p className="mt-1 text-sm text-muted">
              {user
                ? "Tus mensajes están en tu cuenta, separados de otros usuarios."
                : "Entra con tu cuenta para guardar y recuperar mensajes."}
            </p>
          </div>
          <SermonEditor />
        </section>

        <aside
          className={cn(
            "min-h-[min(100dvh-10rem,720px)] lg:self-start",
            tabletPanel !== "console" ? "hidden lg:block" : "flex min-h-0 flex-1 flex-col",
          )}
        >
          <PresenterConsole onOpenBible={openBible} />
        </aside>
      </div>

      <BibleSearch
        open={bibleOpen}
        onClose={() => setBibleOpen(false)}
        onSelectPassage={(passage) => insertScripture(passage)}
      />
    </div>
  );
}

export function PredicarWorkspace() {
  return <PredicarWorkspaceInner />;
}
