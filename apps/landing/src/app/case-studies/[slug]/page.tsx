import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { CaseStudyClientPage } from "./client-page";
import { fetchMappedCaseStudies } from "@/lib/case-studies-mapper";

export const dynamic = "force-dynamic";

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
    alternates: {
      canonical: `/case-studies/${slug}`,
    },
    openGraph: {
      title: study.title,
      description: study.summary,
      url: `/case-studies/${slug}`,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.summary,
    image: study.coverImage,
    datePublished: study.publishDate,
    author: { "@type": "Organization", name: "The Simbolo" },
    publisher: { "@type": "Organization", name: "The Simbolo", logo: { "@type": "ImageObject", url: "https://thesimbolo.com/favicon.png" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://thesimbolo.com/case-studies/${slug}` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://thesimbolo.com" },
      { "@type": "ListItem", position: 2, name: "Case Studies", item: "https://thesimbolo.com/case-studies" },
      { "@type": "ListItem", position: 3, name: study.title, item: `https://thesimbolo.com/case-studies/${slug}` },
    ],
  };

  return (
    <>
      <Script id="json-ld-case-study" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Script id="json-ld-case-study-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CaseStudyClientPage study={study} relatedStudies={relatedStudies} />
    </>
  );
}
