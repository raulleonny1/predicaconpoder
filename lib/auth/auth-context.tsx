"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getClientAuth, isFirebaseConfigured } from "@/lib/firebase-client";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    const auth = getClientAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const auth = getClientAuth();
    if (!auth) {
      const msg = "Firebase no está configurado.";
      setError(msg);
      throw new Error(msg);
    }
    setError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo iniciar sesión con Google.";
      setError(msg);
      throw e;
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const auth = getClientAuth();
    if (!auth) {
      const msg = "Firebase no está configurado.";
      setError(msg);
      throw new Error(msg);
    }
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Credenciales incorrectas.";
      setError(msg);
      throw e;
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    const auth = getClientAuth();
    if (!auth) {
      const msg = "Firebase no está configurado.";
      setError(msg);
      throw new Error(msg);
    }
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo crear la cuenta.";
      setError(msg);
      throw e;
    }
  }, []);

  const signOut = useCallback(async () => {
    const auth = getClientAuth();
    if (!auth) return;
    await firebaseSignOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      configured,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      error,
      clearError: () => setError(null),
    }),
    [user, loading, configured, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
