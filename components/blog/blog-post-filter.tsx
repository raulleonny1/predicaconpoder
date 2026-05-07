"use client";

import { useMemo, useState } from "react";
import { BlogPost } from "@/lib/content/blog-posts";
import { BlogPostCard } from "@/components/blog/blog-post-card";

const categoryColors: Record<string, string> = {
  Fe: "bg-indigo-600/10 text-indigo-700 dark:text-indigo-300",
  Biblia: "bg-sky-600/10 text-sky-700 dark:text-sky-300",
  Evangelismo: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-300",
  Recursos: "bg-fuchsia-600/10 text-fuchsia-700 dark:text-fuchsia-300",
  Confianza: "bg-violet-600/10 text-violet-700 dark:text-violet-300",
  Estudio: "bg-amber-600/10 text-amber-700 dark:text-amber-300",
};

function getCategoryClass(name: string) {
  return categoryColors[name] ?? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

export function BlogPostFilter({ posts }: { posts: BlogPost[] }) {
  const categories = useMemo(
    () => ["Todas", ...new Set(posts.flatMap((post) => post.categories))],
    [posts],
  );
  const [selected, setSelected] = useState<string>("Todas");

  const filteredPosts = useMemo(() => {
    if (selected === "Todas") return posts;
    return posts.filter((post) => post.categories.includes(selected));
  }, [posts, selected]);

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-border-subtle bg-surface/95 p-6 shadow-xl shadow-slate-900/5 dark:bg-slate-950/80 dark:border-slate-800">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Explora por categoría</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink dark:text-white">
              Encuentra artículos que te inspiren y te ayuden a crecer.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted dark:text-slate-300">
            Filtra por tema para ver reflexiones enfocadas en Biblia, fe, estudio y recursos prácticos.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = selected === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelected(category)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${isActive ? "border-accent bg-accent text-white shadow-lg shadow-indigo-500/10" : "border-border-subtle bg-white text-ink hover:border-accent hover:bg-indigo-50 hover:text-ink dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"}`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          {filteredPosts.slice(0, 1).map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-600 p-8 text-white shadow-2xl shadow-indigo-500/20"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-200">Destacado</p>
              <h3 className="mt-4 text-4xl font-bold tracking-tight">{post.title}</h3>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-indigo-100">{post.excerpt}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <span key={category} className={`rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm`}>
                    {category}
                  </span>
                ))}
              </div>
              <div className="mt-8">
                <a
                  href={`/blog/${post.slug}`}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-ink transition hover:bg-white/90"
                >
                  Ver artículo
                </a>
              </div>
            </article>
          ))}

          <div className="grid gap-6 md:grid-cols-2">
            {filteredPosts.slice(1).map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        <aside className="space-y-6 rounded-[2rem] border border-border-subtle bg-surface/95 p-6 shadow-xl shadow-slate-900/5 dark:bg-slate-950/80 dark:border-slate-800">
          <div className="rounded-[1.75rem] bg-gradient-to-br from-accent to-accent-glow p-6 text-white shadow-lg shadow-accent/30">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-100">Enfocado en crecimiento</p>
            <h3 className="mt-4 text-3xl font-bold">Más de 3 ideas para tu fe cada mes</h3>
            <p className="mt-4 text-sm leading-relaxed text-indigo-100/90">
              Lecturas breves y profundas que puedes usar hoy mismo, incluso si solo tienes 10 minutos.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Tendencias</h4>
            <div className="mt-4 space-y-4">
              {categories.slice(1, 5).map((category) => (
                <div key={category} className="flex items-center justify-between rounded-3xl border border-border-subtle bg-white/80 px-4 py-4 text-sm shadow-sm shadow-slate-900/5 dark:bg-slate-950/80 dark:border-slate-800">
                  <span>{category}</span>
                  <span className={getCategoryClass(category)}>{category}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border-subtle bg-white/80 p-5 text-sm text-muted shadow-sm shadow-slate-900/5 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-300">
            <p className="font-semibold text-ink dark:text-white">¿Buscas algo especial?</p>
            <p className="mt-2 leading-relaxed">
              Usa los filtros para encontrar el contenido que mejor se adapte a tu momento espiritual: estudio, oración o servicio.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
