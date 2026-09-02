import type { Metadata } from "next";
import { LandingPage } from "@/components/sections/landing-page";
import { Suspense } from "react";
import Script from "next/script";
import { landingApi } from "@/lib/api";
import { fetchMappedTestimonials } from "@/lib/content-mapper";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Simbolo | AI-Powered Marketing Match",
  description:
    "The Simbolo is a digital marketing agency in Indore, India, offering SEO, Google Ads, Meta Ads, website design, e-commerce, graphic design, and video editing services.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "The Simbolo | AI-Powered Marketing Match",
    description: "Find the right digital marketing expert in seconds.",
    url: "/",
    siteName: "The Simbolo",
    images: [{ url: "/api/og?title=Find%20Your%20Marketing%20Expert&subtitle=AI-Powered%20Marketing%20Match", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: "The Simbolo",
  legalName: "The Simbolo Multimedia",
  url: "https://thesimbolo.com",
  logo: "https://thesimbolo.com/favicon.png",
  email: "hello@thesimbolo.com",
  telephone: "+91-89829-11880",
  description:
    "Digital marketing agency offering SEO, Google Ads, Meta Ads, website design, e-commerce, graphic design, and video editing services.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1st Floor, The Simbolo Multimedia, Plot No. ED/149, Ring Rd, near Khajrana Square, IDA Scheme 94 Sector ED",
    addressLocality: "Indore",
    addressRegion: "Madhya Pradesh",
    postalCode: "452016",
    addressCountry: "IN",
  },
  priceRange: "₹₹",
};

export default async function Home() {
  const [homepageData, featuredTestimonials] = await Promise.all([
    landingApi.getHomepage(null) as Promise<Record<string, any> | null>,
    fetchMappedTestimonials([], true),
  ]);

  return (
    <>
      <Script id="json-ld-organization" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Suspense fallback={null}>
        <LandingPage
          heroData={homepageData?.hero}
          whyChooseUs={homepageData?.whyChooseUs}
          testimonial={featuredTestimonials[0]}
        />
      </Suspense>
    </>
  );
}
