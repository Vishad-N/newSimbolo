import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyClientPage } from "./client-page";
import { fetchMappedCaseStudies } from "@/lib/case-studies-mapper";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const liveCaseStudies = await fetchMappedCaseStudies([]);
  const study = liveCaseStudies.find(s => s.slug === slug);

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

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const liveCaseStudies = await fetchMappedCaseStudies([]);
  const study = liveCaseStudies.find(s => s.slug === slug);

  if (!study) {
    notFound();
  }

  const relatedStudies = liveCaseStudies.filter(s => study.relatedStudies.includes(s.slug) || study.relatedStudies.includes(s.id));

  return <CaseStudyClientPage study={study} relatedStudies={relatedStudies} />;
}
