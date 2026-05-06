"use client";

import { useEffect } from "react";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirebaseApp } from "@/firebase";

export function FirebaseAnalytics() {
  useEffect(() => {
    void (async () => {
      try {
        if (!(await isSupported())) return;
        getAnalytics(getFirebaseApp());
      } catch {
        // Analytics opcional; falla silenciosa en entornos no soportados
      }
    })();
  }, []);

  return null;
}
