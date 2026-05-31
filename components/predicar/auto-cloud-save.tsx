"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { saveCloudSermon } from "@/lib/sermon/cloud-sermons";
import { useSermon } from "@/lib/sermon/sermon-context";

/** Respaldo en biblioteca de nube cada ~12 s si hay cloudId (la sync en vivo usa Firestore live/) */
export function AutoCloudSave() {
  const { user } = useAuth();
  const { sermon, setCloudId } = useSermon();
  const sermonRef = useRef(sermon);

  useEffect(() => {
    sermonRef.current = sermon;
  }, [sermon]);

  useEffect(() => {
    if (!user?.uid || !sermon.cloudId) return;

    const id = setInterval(() => {
      void saveCloudSermon(user.uid, sermonRef.current)
        .then((cloudId) => setCloudId(cloudId))
        .catch(() => {});
    }, 12000);

    return () => clearInterval(id);
  }, [user?.uid, sermon.cloudId, setCloudId]);

  return null;
}
