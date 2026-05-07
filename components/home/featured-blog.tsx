import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BlogPost } from "@/lib/content/blog-posts";

interface FeaturedBlogProps {
  posts: BlogPost[];
}

export function FeaturedBlog({ posts }: FeaturedBlogProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="destacados-heading">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Reflexiones recientes</p>
          <h2 id="destacados-heading" className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Lecturas breves que invitan a poner en práctica la fe.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            Descubre ideas claras y aplicables para tu vida diaria, con contenido diseñado para inspirar tu paso a paso.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group overflow-hidden rounded-[2rem] border border-border-subtle bg-surface p-6 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:border-accent/25"
            >
              <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                <time dateTime={post.publishedAt} className="font-semibold text-ink">
                  {post.publishedAt}
                </time>
                <span className="h-1.5 w-1.5 rounded-full bg-border-subtle" />
                <span>{post.categories.join(" · ")}</span>
              </div>
              <h3 className="mt-5 text-2xl font-semibold leading-tight text-ink transition group-hover:text-accent">
                {post.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:underline"
              >
                Leer ahora
                <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-full border border-accent bg-accent/5 px-6 py-3 text-sm font-bold text-accent transition hover:border-transparent hover:bg-accent/15"
          >
            Ver todas las reflexiones
          </Link>
        </div>
      </Container>
    </section>
  );
}
