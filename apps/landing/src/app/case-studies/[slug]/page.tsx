import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyClientPage } from "./client-page";
import { caseStudies as mockCaseStudies } from "@/mock/case-studies";
import { fetchMappedCaseStudies } from "@/lib/case-studies-mapper";
import { landingApi } from "@/lib/api";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const liveCaseStudies = await fetchMappedCaseStudies(mockCaseStudies);
  const study = liveCaseStudies.find(s => s.slug === params.slug);

  if (!study) {
    return { title: "Case Study Not Found" };
  }

  return {
    title: `${study.title} | The Simbolo Case Studies`,
    description: study.summary,
    openGraph: {
      title: study.title,
      description: study.summary,
      images: [{ url: study.coverImage }],
    },
  };
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const liveCaseStudies = await fetchMappedCaseStudies(mockCaseStudies);
  const study = liveCaseStudies.find(s => s.slug === params.slug);

  if (!study) {
    notFound();
  }

  const relatedStudies = liveCaseStudies.filter(s => study.relatedStudies.includes(s.slug) || study.relatedStudies.includes(s.id));

  return <CaseStudyClientPage study={study} relatedStudies={relatedStudies} />;
}
