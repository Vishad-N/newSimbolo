import { landingApi } from "./api";
import { CaseStudy } from "@/types/case-studies";

function normalizeStatus(status: unknown): CaseStudy["status"] {
  switch (String(status ?? "").toUpperCase()) {
    case "DRAFT":
      return "Draft";
    case "ARCHIVED":
      return "Archived";
    case "PUBLISHED":
    default:
      return "Published";
  }
}

export async function fetchMappedCaseStudies(mockFallback: CaseStudy[], isFeatured?: boolean): Promise<CaseStudy[]> {
  try {
    const response = await landingApi.getCaseStudies([], isFeatured) as any;
    const backendData = response.data || response;

    if (!backendData || !Array.isArray(backendData) || backendData.length === 0) {
      console.log("[fetchMappedCaseStudies] No case studies found in backend. Using mock fallback.");
      return mockFallback;
    }

    return backendData.map((cs: any) => ({
      id: cs.id,
      title: cs.title,
      slug: cs.slug,
      summary: cs.summary,
      coverImage: cs.coverImage?.secureUrl || cs.coverImage?.url || "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80",
      heroImage: cs.coverImage?.secureUrl || cs.coverImage?.url || "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80",
      clientName: cs.clientName,
      industry: cs.industry,
      businessSize: cs.businessSize || "SMB",
      services: cs.services || [],
      tags: cs.tags || [],
      challenge: cs.challenge || "",
      strategy: cs.strategy || cs.solution || "",
      execution: cs.execution || cs.results || "",
      metrics: cs.metrics ? cs.metrics.map((m: any) => ({
        id: m.id || Math.random().toString(),
        label: m.label,
        value: m.value,
        prefix: m.prefix,
        suffix: m.suffix,
        accent: m.accent || "blue",
        displayOrder: m.sortOrder || 0
      })) : [],
      beforeAfter: (cs.beforeAfters || [])
        .filter((ba: any) => ba.metric && ba.beforeValue && ba.afterValue)
        .map((ba: any) => ({
          id: ba.id,
          metric: ba.metric,
          before: ba.beforeValue,
          after: ba.afterValue,
        })),
      timeline: [],
      gallery: [],
      testimonial: undefined,
      relatedStudies: [],
      featured: cs.featured || false,
      publishDate: cs.publishDate || new Date().toISOString(),
      status: normalizeStatus(cs.status),
      readTime: cs.readTime || "5 min read"
    }));
  } catch (error) {
    console.warn("[fetchMappedCaseStudies] Failed to fetch. Using mock.", error);
    return mockFallback;
  }
}
