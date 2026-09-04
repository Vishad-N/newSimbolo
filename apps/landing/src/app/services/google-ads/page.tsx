import type { Metadata } from "next";
import Script from "next/script";
import { GoogleAdsPage } from "@/components/googleAds/GoogleAdsPage";
import { fetchMappedPackages } from "@/lib/package-mapper";
import { fetchMappedFaqs, fetchMappedTestimonials } from "@/lib/content-mapper";
import { landingApi, unwrapLandingEnvelope } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Google Ads Services | The Simbolo",
  description: "Drive more leads and sales with high-converting Google Ads campaigns.",
  alternates: {
    canonical: "/services/google-ads",
  },
  openGraph: {
    title: "Google Ads Services | The Simbolo",
    description: "Drive more leads and sales with high-converting Google Ads campaigns.",
    url: "/services/google-ads",
    siteName: "The Simbolo",
    images: [{ url: "/api/og?title=Google%20Ads%20Services&subtitle=Drive%20more%20leads%20and%20sales", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Google Ads Management Services",
  provider: {
    "@type": "Organization",
    name: "The Simbolo",
    url: "https://thesimbolo.com",
  },
  description: "Google Ads campaign setup and management to drive leads and sales.",
  serviceType: "Paid Search Advertising",
  areaServed: "Worldwide",
};

export default async function GoogleAdsRoute() {
  const [livePackages, rawConfig, liveFaqs, liveTestimonials] = await Promise.all([
    fetchMappedPackages('google-ads', []),
    landingApi.getServicePageConfig('google-ads', null),
    fetchMappedFaqs([]),
    fetchMappedTestimonials([]),
  ]);
  const liveConfig = unwrapLandingEnvelope(rawConfig, null);

  return (
    <>
      <Script id="google-ads-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GoogleAdsPage livePackages={livePackages} liveConfig={liveConfig} liveFaqs={liveFaqs} liveTestimonials={liveTestimonials} />
    </>
  );
}
