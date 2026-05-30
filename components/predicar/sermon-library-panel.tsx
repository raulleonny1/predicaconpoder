"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import {
  deleteCloudSermon,
  listCloudSermons,
  loadCloudSermon,
  saveCloudSermon,
} from "@/lib/sermon/cloud-sermons";
import { listLocalSermons, sermonHasMeaningfulContent } from "@/lib/sermon/local-sermons";
import { useSermon } from "@/lib/sermon/sermon-context";
import type { CloudSermonMeta } from "@/lib/sermon/types";

export function SermonLibraryPanel() {
  const router = useRouter();
  const { user, configured } = useAuth();
  const {
    sermon,
    userId,
    saveToLibrary,
    openNewSermonDialog,
    replaceSermon,
    setCloudId,
  } = useSermon();

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [list, setList] = useState<CloudSermonMeta[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const refreshList = useCallback(async () => {
    if (!user) return;
    setLoadingList(true);
    try {
      const cloud = await listCloudSermons(user.uid);
      setList(cloud);
    } catch {
      const local = listLocalSermons(userId, search);
      setList(local);
      setStatus("Mostrando copia local (Firestore no disponible).");
    } finally {
      setLoadingList(false);
    }
  }, [user, userId, search]);

  useEffect(() => {
    if (libraryOpen && user) void refreshList();
  }, [libraryOpen, user, refreshList]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => item.title.toLowerCase().includes(q));
  }, [list, search]);

  const requireAuth = (action: () => void) => {
    if (!user) {
      router.push("/predicar/ingresar");
      return;
    }
    if (!configured) {
      setStatus("Firebase no configurado.");
      return;
    }
    action();
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setStatus(null);
    try {
      const localCopy = saveToLibrary();
      const cloudId = await saveCloudSermon(user.uid, localCopy);
      setCloudId(cloudId);
      setStatus(`Guardado en tu cuenta`);
      await refreshList();
    } catch {
      saveToLibrary();
      setStatus("Guardado solo en este dispositivo (revisa Firestore).");
    } finally {
      setSaving(false);
    }
  };

  const handleLoad = async (id: string) => {
    if (!user) return;
    if (sermonHasMeaningfulContent(sermon) && sermon.cloudId !== id) {
      const save = confirm("¿Guardar el mensaje actual antes de abrir otro?");
      if (save) await handleSave();
    }
    try {
      const loaded = await loadCloudSermon(user.uid, id);
      replaceSermon(loaded);
      setLibraryOpen(false);
    } catch {
      setStatus("No se pudo abrir el mensaje.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm("¿Eliminar este mensaje de tu cuenta?")) return;
    try {
      await deleteCloudSermon(user.uid, id);
      if (sermon.cloudId === id) setCloudId();
      await refreshList();
    } catch {
      setStatus("No se pudo eliminar.");
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={openNewSermonDialog}
          className="rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent/30"
        >
          + Nuevo
        </button>
        <button
          type="button"
          onClick={() => requireAuth(() => void handleSave())}
          disabled={saving || !user}
          className="rounded-xl bg-accent/10 px-3 py-2 text-sm font-semibold text-accent transition hover:bg-accent/20 disabled:opacity-40"
          title={!user ? "Inicia sesión para guardar" : undefined}
        >
          {saving ? "Guardando…" : sermon.cloudId ? "Actualizar" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={() => requireAuth(() => setLibraryOpen(true))}
          disabled={!user}
          className="rounded-xl border border-border-subtle bg-canvas px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent/30 disabled:opacity-40"
        >
          Mis mensajes
        </button>
        {!user ? (
          <Link
            href="/predicar/ingresar"
            className="text-xs font-semibold text-accent hover:underline"
          >
            Crear cuenta
          </Link>
        ) : null}
      </div>

      {status ? (
        <p className="absolute right-0 top-full z-10 mt-1 whitespace-nowrap text-xs text-emerald-600">
          {status}
        </p>
      ) : null}

      {libraryOpen && user ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[1px]"
            aria-label="Cerrar"
            onClick={() => setLibraryOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 flex w-[min(100vw-2rem,26rem)] max-h-[min(70dvh,520px)] flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-2xl">
            <div className="border-b border-border-subtle p-3">
              <p className="text-xs text-muted truncate">{user.email}</p>
              <p className="mt-1 text-[0.65rem] text-muted">
                Solo tus mensajes · separados de otras cuentas
              </p>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título…"
                className="mt-3 w-full rounded-xl border border-border-subtle bg-canvas px-3 py-2 text-sm outline-none focus:border-accent/40"
              />
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain p-2">
              {loadingList ? (
                <p className="p-4 text-center text-sm text-muted">Cargando…</p>
              ) : filtered.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted">
                  {search ? "Sin resultados." : "Aún no tienes mensajes guardados."}
                </p>
              ) : (
                <ul className="space-y-1">
                  {filtered.map((item) => (
                    <li key={item.id} className="flex items-center gap-1 rounded-xl hover:bg-canvas">
                      <button
                        type="button"
                        onClick={() => void handleLoad(item.id)}
                        className="min-w-0 flex-1 px-3 py-2.5 text-left"
                      >
                        <span className="block truncate text-sm font-semibold text-ink">
                          {item.title}
                        </span>
                        <span className="text-xs text-muted">
                          {new Date(item.updatedAt).toLocaleString("es")}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(item.id)}
                        className="shrink-0 px-2 text-muted hover:text-red-600"
                        aria-label="Eliminar"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
