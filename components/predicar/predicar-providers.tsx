"use client";

import { AuthProvider, useAuth } from "@/lib/auth/auth-context";
import { SermonProvider } from "@/lib/sermon/sermon-context";

function SermonWithUser({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  return (
    <SermonProvider userId={user?.uid ?? null} authReady={!loading}>
      {children}
    </SermonProvider>
  );
}

export function PredicarProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SermonWithUser>{children}</SermonWithUser>
    </AuthProvider>
  );
}
