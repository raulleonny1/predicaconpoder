"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthForm } from "@/components/predicar/auth-form";
import { useAuth } from "@/lib/auth/auth-context";
import { BrandMark } from "@/components/layout/brand-mark";
import { siteConfig } from "@/lib/site-config";

export function AuthUserMenu() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  if (loading) {
    return <span className="text-xs text-muted">…</span>;
  }

  if (!user) {
    return (
      <Link
        href="/predicar/ingresar"
        className="rounded-xl bg-ink px-3 py-2 text-sm font-semibold text-white transition hover:bg-void-elevated"
      >
        Entrar
      </Link>
    );
  }

  const label = user.displayName ?? user.email?.split("@")[0] ?? "Cuenta";

  return (
    <div className="flex items-center gap-2">
      <span
        className="hidden max-w-[8rem] truncate text-xs font-medium text-muted sm:inline"
        title={user.email ?? undefined}
      >
        {label}
      </span>
      <button
        type="button"
        onClick={() => {
          void signOut().then(() => router.push("/predicar/ingresar"));
        }}
        className="rounded-xl border border-border-subtle px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent/30"
      >
        Salir
      </button>
    </div>
  );
}

export function AuthGateRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/predicar");
  }, [user, loading, router]);

  return null;
}

export function IngresarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="border-b border-border-subtle bg-surface/90 px-4 py-3 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <BrandMark className="h-9 w-9" />
          <span className="font-heading text-sm font-bold text-ink">{siteConfig.name}</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {loading ? (
          <p className="text-muted">Comprobando sesión…</p>
        ) : user ? (
          <div className="text-center">
            <p className="text-muted">Ya iniciaste sesión como {user.email}</p>
            <Link
              href="/predicar"
              className="mt-4 inline-flex rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white"
            >
              Ir a predicar
            </Link>
          </div>
        ) : (
          <AuthForm onSuccess={() => router.replace("/predicar")} />
        )}
      </main>
    </div>
  );
}
