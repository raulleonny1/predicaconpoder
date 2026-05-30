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

function PredicarWorkspaceInner() {
  const { user } = useAuth();
  const { insertScripture, hydrated } = useSermon();
  const [bibleOpen, setBibleOpen] = useState(false);

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
    <div className="flex min-h-[100dvh] flex-col">
      <AutoCloudSave />
      <NewSermonDialog />

      {!user ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950">
          Modo invitado: puedes predicar y usar la Biblia.{" "}
          <Link href="/predicar/ingresar" className="font-bold text-accent hover:underline">
            Inicia sesión
          </Link>{" "}
          para guardar tus mensajes en tu cuenta privada.
        </div>
      ) : null}

      <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90">
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
              className="rounded-xl border border-border-subtle bg-canvas px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent/30"
            >
              Visor
            </Link>
            <button
              type="button"
              onClick={openBible}
              className="rounded-xl bg-ink px-3 py-2 text-sm font-semibold text-white transition hover:bg-void-elevated"
            >
              Biblia ⌘K
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[1fr_minmax(360px,44%)] xl:gap-8">
        <section aria-label="Editor del mensaje" className="min-w-0">
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

        <aside className="min-h-[480px] xl:sticky xl:top-[4.5rem] xl:self-start">
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
