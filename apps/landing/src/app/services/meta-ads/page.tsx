import type { Metadata } from "next";
import Script from "next/script";
import { MetaAdsClientPage } from "./client-page";

export const metadata: Metadata = {
  title: "Meta Ads Management Services | The Simbolo",
  description: "Boost your business with high-converting Meta Ads campaigns managed by certified experts. Generate quality leads, increase conversions, maximize ROAS, and scale your business with AI-powered advertising solutions from The Simbolo.",
  keywords: "Meta Ads Agency, Facebook Ads, Instagram Ads, Paid Social Marketing, Performance Marketing, Lead Generation, Meta Advertising, Facebook Marketing, Instagram Marketing, Digital Marketing Agency India",
  alternates: {
    canonical: "/services/meta-ads",
  },
  openGraph: {
    title: "Meta Ads Management Services | The Simbolo",
    description: "Boost your business with high-converting Meta Ads campaigns managed by certified experts. Generate quality leads, increase conversions, maximize ROAS, and scale your business with AI-powered advertising solutions from The Simbolo.",
    url: "/services/meta-ads",
    siteName: "The Simbolo",
    images: [
      {
        url: "/api/og?title=Meta%20Ads%20Management&subtitle=High-converting%20Facebook%20%26%20Instagram%20campaigns",
        width: 1200,
        height: 630,
        alt: "Meta Ads Management Services by The Simbolo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meta Ads Management Services | The Simbolo",
    description: "Boost your business with high-converting Meta Ads campaigns managed by certified experts.",
    images: ["/api/og?title=Meta%20Ads%20Management&subtitle=High-converting%20Facebook%20%26%20Instagram%20campaigns"],
  },
  authors: [{ name: "The Simbolo" }],
  category: "Marketing",
};

export const dynamic = "force-dynamic";

import { fetchMappedPackages } from "@/lib/package-mapper";
import { fetchMappedFaqs, fetchMappedTestimonials } from "@/lib/content-mapper";
import { landingApi } from "@/lib/api";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Meta Ads Management Services",
  provider: {
    "@type": "Organization",
    name: "The Simbolo",
    url: "https://thesimbolo.com",
  },
  description: "Facebook and Instagram advertising campaign management to generate leads and maximize ROAS.",
  serviceType: "Paid Social Advertising",
  areaServed: "Worldwide",
};

export default async function MetaAdsPage() {
  const [livePackages, liveConfig, liveFaqs, liveTestimonials] = await Promise.all([
    fetchMappedPackages('meta-ads', []),
    landingApi.getServicePageConfig('meta-ads', null),
    fetchMappedFaqs([]),
    fetchMappedTestimonials([]),
  ]);

  return (
    <>
      <Script id="meta-ads-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MetaAdsClientPage livePackages={livePackages} liveConfig={liveConfig} liveFaqs={liveFaqs} liveTestimonials={liveTestimonials} />
    </>
  );
}
