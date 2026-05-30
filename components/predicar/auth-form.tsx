"use client";

import Link from "next/link";
import { useState } from "react";
import { mapAuthError } from "@/lib/auth/map-auth-error";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils";

type AuthFormProps = {
  compact?: boolean;
  onSuccess?: () => void;
  redirectHref?: string;
};

export function AuthForm({ compact, onSuccess, redirectHref = "/predicar" }: AuthFormProps) {
  const { configured, signInWithGoogle, signInWithEmail, signUpWithEmail, error, clearError } =
    useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!configured) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Firebase no está configurado. Añade las variables <code>NEXT_PUBLIC_FIREBASE_*</code> en{" "}
        <code>.env.local</code>.
      </div>
    );
  }

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setLocalError(null);
    clearError();
    try {
      await action();
      onSuccess?.();
    } catch (e) {
      setLocalError(mapAuthError(e));
    } finally {
      setBusy(false);
    }
  };

  const displayError = localError ?? error;

  return (
    <div className={cn(!compact && "mx-auto w-full max-w-md")}>
      {!compact ? (
        <div className="mb-6 text-center">
          <h1 className="font-heading text-2xl font-extrabold text-ink">
            {mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Cada cuenta tiene sus propios mensajes guardados, separados de otros usuarios.
          </p>
        </div>
      ) : null}

      <button
        type="button"
        disabled={busy}
        onClick={() => void run(signInWithGoogle)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface py-3 text-sm font-semibold text-ink transition hover:bg-canvas disabled:opacity-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continuar con Google
      </button>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-border-subtle" />
        <span className="text-xs text-muted">o con correo</span>
        <div className="h-px flex-1 bg-border-subtle" />
      </div>

      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={cn(
            "flex-1 rounded-lg py-2 text-sm font-semibold",
            mode === "login" ? "bg-accent text-white" : "bg-canvas text-muted",
          )}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={cn(
            "flex-1 rounded-lg py-2 text-sm font-semibold",
            mode === "signup" ? "bg-accent text-white" : "bg-canvas text-muted",
          )}
        >
          Registrarse
        </button>
      </div>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          void run(() =>
            mode === "login"
              ? signInWithEmail(email, password)
              : signUpWithEmail(email, password),
          );
        }}
      >
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          className="w-full rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm outline-none focus:border-accent/40"
        />
        <input
          type="password"
          required
          minLength={6}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña (mín. 6 caracteres)"
          className="w-full rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm outline-none focus:border-accent/40"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-ink py-3 text-sm font-bold text-white transition hover:bg-void-elevated disabled:opacity-50"
        >
          {busy ? "Espera…" : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </form>

      {displayError ? <p className="mt-3 text-sm text-red-600">{displayError}</p> : null}

      {!compact ? (
        <p className="mt-6 text-center text-sm text-muted">
          <Link href={redirectHref} className="font-semibold text-accent hover:underline">
            ← Volver a predicar
          </Link>
        </p>
      ) : null}
    </div>
  );
}
