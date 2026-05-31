"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { saveCloudSermon } from "@/lib/sermon/cloud-sermons";
import { sermonHasMeaningfulContent } from "@/lib/sermon/local-sermons";
import { pushLiveSermon } from "@/lib/sermon/live-sync";
import { useSermon } from "@/lib/sermon/sermon-context";

/** Respaldo extra en biblioteca de nube cada 60 s (el guardado principal va en commitSermon). */
export function AutoCloudSave() {
  const { user } = useAuth();
  const { sermon } = useSermon();
  const sermonRef = useRef(sermon);

  useEffect(() => {
    sermonRef.current = sermon;
  }, [sermon]);

  useEffect(() => {
    if (!user?.uid) return;

    const id = setInterval(() => {
      const current = sermonRef.current;
      if (!sermonHasMeaningfulContent(current)) return;
      void saveCloudSermon(user.uid, current)
        .then((cloudId) => {
          void pushLiveSermon(user.uid, { ...sermonRef.current, cloudId }).catch(() => {});
        })
        .catch(() => {});
    }, 60000);

    return () => clearInterval(id);
  }, [user?.uid]);

  return null;
}
