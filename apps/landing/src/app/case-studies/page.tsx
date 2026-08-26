import { Metadata } from "next";
import { CaseStudiesClientPage } from "./client-page";
import { caseStudies as mockCaseStudies } from "@/mock/case-studies";
import { fetchMappedCaseStudies } from "@/lib/case-studies-mapper";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case Studies & Results | The Simbolo",
  description: "Explore our digital marketing case studies. See how we've helped businesses achieve 300% ROI, scale E-commerce sales, and generate high-quality B2B leads.",
  keywords: "Marketing Case Studies, SEO Results, Meta Ads Success Stories, Digital Marketing Portfolio, E-commerce Case Study",
  alternates: {
    canonical: "/case-studies",
  },
  openGraph: {
    title: "Case Studies & Real Results | The Simbolo",
    description: "Explore our digital marketing case studies. See how we've helped businesses achieve incredible growth and ROI.",
    url: "/case-studies",
    siteName: "The Simbolo",
    images: [
      {
        url: "/images/og/case-studies.jpg",
        width: 1200,
        height: 630,
        alt: "The Simbolo Case Studies",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default async function CaseStudiesPage() {
  const liveCaseStudies = await fetchMappedCaseStudies([]);

  return <CaseStudiesClientPage initialCaseStudies={liveCaseStudies} />;
}
