import type { Metadata } from "next";
import Script from "next/script";
import { SeoPage } from "@/components/seo/SeoPage";
import { fetchMappedPackages } from "@/lib/package-mapper";
import { fetchMappedFaqs, fetchMappedTestimonials } from "@/lib/content-mapper";
import { landingApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SEO Services | The Simbolo",
  description: "Rank higher, get found, and grow faster with data-driven SEO services.",
  alternates: {
    canonical: "/services/seo",
  },
  openGraph: {
    title: "SEO Services | The Simbolo",
    description: "Rank higher, get found, and grow faster with data-driven SEO services.",
    url: "/services/seo",
    siteName: "The Simbolo",
    images: [{ url: "/api/og?title=SEO%20Services&subtitle=Rank%20higher%2C%20get%20found%2C%20grow%20faster", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "SEO Services",
  provider: {
    "@type": "Organization",
    name: "The Simbolo",
    url: "https://thesimbolo.com",
  },
  description: "Search engine optimization services to improve organic rankings, traffic, and visibility.",
  serviceType: "Search Engine Optimization",
  areaServed: "Worldwide",
};

export default async function Page() {
  const [livePackages, liveConfig, liveFaqs, liveTestimonials] = await Promise.all([
    fetchMappedPackages('seo', []),
    landingApi.getServicePageConfig('seo', null),
    fetchMappedFaqs([]),
    fetchMappedTestimonials([]),
  ]);

  return (
    <>
      <Script id="seo-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SeoPage livePackages={livePackages} liveConfig={liveConfig} liveFaqs={liveFaqs} liveTestimonials={liveTestimonials} />
    </>
  );
}
