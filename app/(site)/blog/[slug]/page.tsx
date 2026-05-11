import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogReadCounter } from "@/components/blog/blog-read-counter";
import { MarkdownArticle } from "@/components/content/markdown-article";
import { Container } from "@/components/ui/container";
import { BLOG_POSTS } from "@/lib/content/blog-posts";
import { siteConfig } from "@/lib/site-config";

const defaultBlogShareImage = "/logo.png";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((item) => item.slug === slug);
  if (!post) return { title: "Entrada" };

  const imagePath = post.openGraphImage ?? defaultBlogShareImage;
  const canonicalPath = `/blog/${post.slug}`;
  const publishedTime = `${post.publishedAt}T12:00:00.000Z`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      url: canonicalPath,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title: post.title,
      description: post.excerpt,
      publishedTime,
      section: post.categories[0],
      images: [
        {
          url: imagePath,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imagePath],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <div className="border-b border-border-subtle py-10 sm:py-12 lg:py-14">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Blog</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-muted">Publicado el {post.publishedAt}</p>
          <article className="mt-10">
            <MarkdownArticle markdown={post.body} />
          </article>
          <BlogReadCounter slug={post.slug} />
        </div>
      </Container>
    </div>
  );
}
