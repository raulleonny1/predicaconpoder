import type { Metadata } from "next";
import { DonateStrip } from "@/components/home/donate-strip";
import { FeatureGrid } from "@/components/home/feature-grid";
import { HeroSection } from "@/components/home/hero-section";
import { siteConfig } from "@/lib/site-config";

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
  return (
    <>
      <HeroSection />
      <FeatureGrid />
      <DonateStrip />
    </>
  );
}
