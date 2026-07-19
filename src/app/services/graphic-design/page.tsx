import type { Metadata } from "next";
import { GraphicDesignPage } from "@/components/graphicDesign/GraphicDesignPage";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Graphic Design Services | The Simbolo",
  description: "Professional graphic design services including logo design, social media creatives, branding, brochures, banners, UI/UX design, thumbnails, and marketing materials. Creative designs that strengthen your brand identity and improve conversions.",
  keywords: "graphic design services, logo design, social media creatives, branding, brochure design, UI/UX design, banner design, professional designer",
  alternates: {
    canonical: "/services/graphic-design",
  },
  openGraph: {
    title: "Graphic Design Services | The Simbolo",
    description: "Creative designs that strengthen your brand identity and improve conversions.",
    url: "https://thesimbolo.com/services/graphic-design",
    siteName: "The Simbolo",
    images: [
      {
        url: "https://thesimbolo.com/assets/og-graphic-design.jpg",
        width: 1200,
        height: 630,
        alt: "Professional Graphic Design Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Graphic Design Services | The Simbolo",
    description: "Professional graphic design services including logo design, social media creatives, and branding.",
    images: ["https://thesimbolo.com/assets/og-graphic-design.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Graphic Design Services",
  provider: {
    "@type": "Organization",
    name: "The Simbolo",
    url: "https://thesimbolo.com",
  },
  description: "Professional graphic design services including logo design, social media creatives, branding, brochures, banners, UI/UX design, thumbnails, and marketing materials.",
  serviceType: "Design Services",
  areaServed: "Worldwide",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "INR",
    lowPrice: "699",
    highPrice: "19999",
    offerCount: "4",
  },
};

export default function Page() {
  return (
    <>
      <Script id="json-ld-graphic-design" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GraphicDesignPage />
    </>
  );
}
