import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { BlogPostFilter } from "@/components/blog/blog-post-filter";
import { BLOG_POSTS } from "@/lib/content/blog-posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artículos cristianos diseñados para ayudar tu fe, tu estudio bíblico y tu vida diaria.",
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
