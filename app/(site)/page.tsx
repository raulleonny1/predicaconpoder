import type { Metadata } from "next";
import { DonateStrip } from "@/components/home/donate-strip";
import { FeaturedBlog } from "@/components/home/featured-blog";
import { FeatureGrid } from "@/components/home/feature-grid";
import { HeroSection } from "@/components/home/hero-section";
import { siteConfig } from "@/lib/site-config";
import { BLOG_POSTS } from "@/lib/content/blog-posts";

export const metadata: Metadata = {
  title: "Inicio",
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
};

export default function HomePage() {
  const latestPosts = [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 2);

  return (
    <>
      <HeroSection />
      <FeatureGrid />
      <FeaturedBlog posts={latestPosts} />
      <DonateStrip />
    </>
  );
}
