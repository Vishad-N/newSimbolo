import type { Metadata } from "next";
import { AffiliatePage } from "@/components/affiliate/AffiliatePage";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Affiliate Program | The Simbolo",
  description: "Join The Simbolo Affiliate Program and earn recurring commissions by referring businesses for digital marketing, SEO, website development, branding, paid advertising and creative services.",
  keywords: "affiliate program, digital marketing affiliate, earn money online, referral program, marketing commissions, The Simbolo affiliate",
  alternates: {
    canonical: "/affiliate-program",
  },
  openGraph: {
    title: "Affiliate Program | The Simbolo",
    description: "Earn recurring commissions by referring businesses to The Simbolo.",
    url: "https://thesimbolo.com/affiliate-program",
    siteName: "The Simbolo",
    images: [
      {
        url: "https://thesimbolo.com/assets/og-affiliate.jpg",
        width: 1200,
        height: 630,
        alt: "The Simbolo Affiliate Program",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Affiliate Program | The Simbolo",
    description: "Earn recurring commissions by referring businesses to The Simbolo.",
    images: ["https://thesimbolo.com/assets/og-affiliate.jpg"],
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
  "@type": "WebPage",
  name: "The Simbolo Affiliate Program",
  description: "Join The Simbolo Affiliate Program and earn recurring commissions by referring businesses for digital marketing.",
  url: "https://thesimbolo.com/affiliate-program",
  publisher: {
    "@type": "Organization",
    name: "The Simbolo",
    url: "https://thesimbolo.com",
  },
};

export default function Page() {
  return (
    <>
      <Script id="json-ld-affiliate" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AffiliatePage />
    </>
  );
}
