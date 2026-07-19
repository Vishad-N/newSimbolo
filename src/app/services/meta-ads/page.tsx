import type { Metadata } from "next";
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
        url: "/images/og/meta-ads.jpg",
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
    images: ["/images/og/meta-ads.jpg"],
  },
  authors: [{ name: "The Simbolo" }],
  category: "Marketing",
};

export default function MetaAdsPage() {
  return <MetaAdsClientPage />;
}
