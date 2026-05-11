import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { BlogPostFilter } from "@/components/blog/blog-post-filter";
import { BLOG_POSTS } from "@/lib/content/blog-posts";
import { siteConfig } from "@/lib/site-config";

const blogListingDescription =
  "Artículos cristianos diseñados para ayudar tu fe, tu estudio bíblico y tu vida diaria.";

export const metadata: Metadata = {
  title: "Blog",
  description: blogListingDescription,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: `Blog | ${siteConfig.name}`,
    description: blogListingDescription,
    images: [{ url: "/logo.png", alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${siteConfig.name}`,
    description: blogListingDescription,
    images: ["/logo.png"],
  },
};

export default function BlogPage() {
  const sortedPosts = [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <>
      <PageHeader
        eyebrow="Reflexiones"
        title="Blog"
        description="Explora publicaciones diseñadas para inspirar tu vida espiritual con claridad, estilo y mensaje profundo."
      />
      <div className="border-b border-border-subtle py-10 sm:py-12 lg:py-14">
        <Container>
          <BlogPostFilter posts={sortedPosts} />
        </Container>
      </div>
    </>
  );
}
