import Link from "next/link";
import type { BlogPost } from "@/lib/content/blog-posts";

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group rounded-[2rem] border border-border-subtle bg-white/80 p-6 shadow-xl shadow-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10 dark:bg-slate-950/80 dark:border-slate-800">
      <div className="flex items-center justify-between gap-4 text-sm font-semibold text-muted">
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          <span className="mr-2 h-2.5 w-2.5 rounded-full bg-accent" />
          {post.publishedAt}
        </span>
        <span className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          Blog
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent dark:text-white">
          {post.title}
        </h2>
        <p className="text-sm leading-relaxed text-muted dark:text-slate-300">{post.excerpt}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {post.categories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {category}
          </span>
        ))}
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-accent-glow"
        >
          Leer artículo
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
