import type { Metadata } from "next";
import { EcommercePage } from "@/components/ecommerce/EcommercePage";
import Script from "next/script";
import { ecommercePackages as mockPackages } from "@/data/services/ecommerce";
import { fetchMappedPackages } from "@/lib/package-mapper";
import { fetchMappedPortfolioProjects } from "@/lib/portfolio-mapper";

export const metadata: Metadata = {
  title: "E-Commerce Development Services | Shopify, WooCommerce & Custom Stores | The Simbolo",
  description: "Build high-converting e-commerce websites with Shopify, WooCommerce, React, Next.js and custom development. Launch secure, scalable online stores that increase sales with The Simbolo.",
  keywords: "ecommerce development, shopify experts, woocommerce developer, custom ecommerce, headless commerce, magento development, online store builder",
  alternates: {
    canonical: "/services/ecommerce",
  },
  openGraph: {
    title: "E-Commerce Development Services | The Simbolo",
    description: "Build high-converting e-commerce websites with Shopify, WooCommerce, React, Next.js and custom development.",
    url: "https://thesimbolo.com/services/ecommerce",
    siteName: "The Simbolo",
    images: [
      {
        url: "/api/og?title=E-Commerce%20Development&subtitle=Shopify%2C%20WooCommerce%20%26%20custom%20stores",
        width: 1200,
        height: 630,
        alt: "Professional E-Commerce Development Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Commerce Development Services | The Simbolo",
    description: "Build high-converting e-commerce websites with Shopify, WooCommerce, React, Next.js and custom development.",
    images: ["/api/og?title=E-Commerce%20Development&subtitle=Shopify%2C%20WooCommerce%20%26%20custom%20stores"],
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
  name: "E-Commerce Development Services",
  provider: {
    "@type": "Organization",
    name: "The Simbolo",
    url: "https://thesimbolo.com",
  },
  description: "Build high-converting e-commerce websites with Shopify, WooCommerce, React, Next.js and custom development.",
  serviceType: "E-Commerce Development",
  areaServed: "Worldwide",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "INR",
    lowPrice: "19999",
    highPrice: "99999",
    offerCount: "4",
  },
};

export const dynamic = "force-dynamic";

export default async function EcommerceRoute() {
  const [packagesToPass, liveProjectsToPass] = await Promise.all([
    fetchMappedPackages('ecommerce', []),
    fetchMappedPortfolioProjects('ecommerce', []),
  ]);

  return (
    <>
      <Script id="json-ld-ecommerce" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EcommercePage livePackages={packagesToPass} liveProjects={liveProjectsToPass} />
    </>
  );
}
