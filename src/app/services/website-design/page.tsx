import type { Metadata } from "next";
import { WebsiteDesignPage } from "@/components/websiteDesign/WebsiteDesignPage";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Website Design & Development Services | The Simbolo",
  description: "Professional website design and web development services using modern technologies like React, Next.js, NestJS, Spring Boot, and more. Build fast, responsive, SEO-friendly websites that help your business grow.",
  keywords: "website design, web development, react developer, nextjs developer, custom website, ecommerce development, saas development",
  alternates: {
    canonical: "/services/website-design",
  },
  openGraph: {
    title: "Website Design & Development Services | The Simbolo",
    description: "Build fast, responsive, SEO-friendly websites that help your business grow.",
    url: "https://thesimbolo.com/services/website-design",
    siteName: "The Simbolo",
    images: [
      {
        url: "https://thesimbolo.com/assets/og-website-design.jpg",
        width: 1200,
        height: 630,
        alt: "Professional Website Design Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Design & Development Services | The Simbolo",
    description: "Professional website design and web development services using modern technologies.",
    images: ["https://thesimbolo.com/assets/og-website-design.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Website Design & Development Services",
  provider: {
    "@type": "Organization",
    name: "The Simbolo",
    url: "https://thesimbolo.com",
  },
  description: "Professional website design and web development services using modern technologies like React, Next.js, NestJS, Spring Boot, and more.",
  serviceType: "Web Development",
  areaServed: "Worldwide",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "INR",
    lowPrice: "14999",
    highPrice: "39999",
    offerCount: "4",
  },
};

export default function Page() {
  return (
    <>
      <Script id="json-ld-website-design" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WebsiteDesignPage />
    </>
  );
}
