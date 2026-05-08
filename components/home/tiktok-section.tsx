"use client";

import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

function normalizeTikTokId(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/(?:video\/|\/video\/|\/)(\d+)(?:$|[/?#])/);
  return match?.[1] ?? trimmed;
}

export function TikTokSection() {
  const username = siteConfig.socials?.tiktokUsername?.trim() ?? "";
  const videoIds = (siteConfig.socials?.tiktokVideoIds ?? []).map(normalizeTikTokId);
  const posts = (siteConfig.socials?.tiktokPosts ?? []).map((item) => ({
    ...item,
    id: normalizeTikTokId(item.id),
  }));
  const hasProfile = username.length > 0;
  const feedItems: Array<{ id: string; caption?: string; publishedAt?: string }> = (
    posts.length
      ? posts
      : videoIds.map((id, index) => ({ id, caption: `Publicación ${index + 1} de TikTok` }))
  ).slice(0, 5);

  return (
    <section className="relative py-12 sm:py-16 lg:py-24" aria-labelledby="tiktok-heading">
      <Container>
        <div className="flex flex-col gap-6 rounded-[2rem] border border-border-subtle bg-surface/90 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="tiktok-heading" className="text-pretty font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Últimos 5 TikToks
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                El recuadro muestra hasta cinco publicaciones recientes con formato de tarjeta.
              </p>
            </div>
            {hasProfile ? (
              <a
                href={`https://www.tiktok.com/@${username}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent to-accent-glow px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
              >
                Ver perfil @{username}
              </a>
            ) : (
              <div className="rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-ink">
                Configura tu usuario de TikTok en <code>lib/site-config.ts</code> para activar el feed.
              </div>
            )}
          </div>

          <div className="rounded-[1.75rem] border border-border-subtle bg-white/95 p-6 shadow-inner sm:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Feed</p>
                <h3 className="mt-2 text-2xl font-bold text-ink">Últimas publicaciones</h3>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                Aquí se listan tus TikToks más recientes en un diseño de recuadro limpio y ordenado.
              </p>
            </div>

            {hasProfile ? (
              feedItems.length > 0 ? (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {feedItems.map((item) => (
                    <li key={item.id} className="rounded-3xl border border-border-subtle bg-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">TT</div>
                        <div>
                          <p className="font-semibold text-ink">{item.caption ?? "TikTok reciente"}</p>
                          {item.publishedAt ? (
                            <p className="text-xs text-muted">{item.publishedAt}</p>
                          ) : (
                            <p className="text-xs text-muted">Publicado recientemente</p>
                          )}
                        </div>
                      </div>
                      <a
                        href={`https://www.tiktok.com/@${username}/video/${item.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-indigo-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-800"
                      >
                        Ver publicación
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-3xl border border-border-subtle bg-slate-50 p-8 text-center text-sm leading-relaxed text-muted">
                  Aún no se han agregado IDs de videos. Agrega tus TikToks más recientes en <code>siteConfig.socials.tiktokVideoIds</code> o crea entradas en <code>siteConfig.socials.tiktokPosts</code>.
                </div>
              )
            ) : (
              <div className="rounded-3xl border border-border-subtle bg-slate-50 p-8 text-center text-sm leading-relaxed text-muted">
                Se mostrará un recuadro con tus publicaciones cuando configures tu usuario de TikTok.
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
