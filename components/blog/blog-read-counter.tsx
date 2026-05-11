"use client";

import { useEffect, useState } from "react";

type BlogReadCounterProps = {
  slug: string;
};

const sessionKey = (slug: string) => `blogReadRecorded:v1:${slug}`;

/** Evita dos POST en el mismo ciclo (p. ej. React Strict Mode). */
const ongoingIncrements = new Map<string, Promise<void>>();

export function BlogReadCounter({ slug }: BlogReadCounterProps) {
  const [count, setCount] = useState<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const key = sessionKey(slug);

      try {
        if (sessionStorage.getItem(key)) {
          const getRes = await fetch(`/api/blog-read?slug=${encodeURIComponent(slug)}`);
          const getData = (await getRes.json()) as { enabled?: boolean; count?: number };
          if (cancelled) return;
          if (getData.enabled) {
            setEnabled(true);
            setCount(typeof getData.count === "number" ? getData.count : 0);
          }
          return;
        }

        let increment = ongoingIncrements.get(slug);
        if (!increment) {
          increment = (async () => {
            const postRes = await fetch("/api/blog-read", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slug }),
            });
            const postData = (await postRes.json()) as { enabled?: boolean };
            if (postData.enabled) {
              sessionStorage.setItem(key, "1");
            }
          })();
          ongoingIncrements.set(slug, increment);
          increment.finally(() => ongoingIncrements.delete(slug));
        }

        await increment;
        if (cancelled) return;

        const getRes = await fetch(`/api/blog-read?slug=${encodeURIComponent(slug)}`);
        const getData = (await getRes.json()) as { enabled?: boolean; count?: number };
        if (cancelled) return;
        if (getData.enabled) {
          setEnabled(true);
          setCount(typeof getData.count === "number" ? getData.count : 0);
        }
      } catch {
        if (!cancelled) {
          setEnabled(false);
          setCount(null);
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!enabled || count === null) {
    return null;
  }

  const formatted = new Intl.NumberFormat("es").format(count);

  return (
    <div className="mt-12 rounded-2xl border border-border-subtle bg-indigo-50/40 px-5 py-4 text-center sm:px-6">
      <p className="text-sm font-semibold text-ink">
        Este artículo se ha abierto <span className="tabular-nums text-accent">{formatted}</span>{" "}
        {count === 1 ? "vez" : "veces"}
      </p>
      <p className="mt-1 text-xs text-muted">
        Conteo aproximado: se suma una vez por navegador en cada sesión (hasta cerrar el navegador).
      </p>
    </div>
  );
}
