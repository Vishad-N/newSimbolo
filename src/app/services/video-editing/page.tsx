import type { Metadata } from "next";
import { VideoEditingPage } from "@/components/videoEditing/VideoEditingPage";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Professional Video Editing Services | The Simbolo",
  description: "Professional video editing services for brands, creators, businesses, and agencies. From reels and YouTube videos to advertisements and corporate films, The Simbolo delivers high-quality edits that increase engagement and conversions.",
  keywords: "video editing services, professional video editing, youtube video editor, reels editing, commercial video editing, agency video editing",
  alternates: {
    canonical: "/services/video-editing",
  },
  openGraph: {
    title: "Professional Video Editing Services | The Simbolo",
    description: "Professional video editing services for brands, creators, businesses, and agencies.",
    url: "https://thesimbolo.com/services/video-editing",
    siteName: "The Simbolo",
    images: [
      {
        url: "https://thesimbolo.com/assets/og-video-editing.jpg",
        width: 1200,
        height: 630,
        alt: "Professional Video Editing Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Video Editing Services | The Simbolo",
    description: "High-quality video editing services that increase engagement and conversions.",
    images: ["https://thesimbolo.com/assets/og-video-editing.jpg"],
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
  name: "Professional Video Editing Services",
  provider: {
    "@type": "Organization",
    name: "The Simbolo",
    url: "https://thesimbolo.com",
  },
  description: "Professional video editing services for brands, creators, businesses, and agencies. From reels and YouTube videos to advertisements and corporate films.",
  serviceType: "Video Editing",
  areaServed: "Worldwide",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "INR",
    lowPrice: "2499",
    highPrice: "11999",
    offerCount: "4",
  },
};

export default function Page() {
  return (
    <>
      <Script id="json-ld-video-editing" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <VideoEditingPage />
    </>
  );
}
