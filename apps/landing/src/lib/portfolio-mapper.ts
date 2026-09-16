import { landingApi } from "./api";
import { toSecureCloudinaryUrl } from "./utils";

export async function fetchMappedPortfolioProjects(serviceSlug: string, mockFallback: any[]): Promise<any[]> {
  try {
    const response = await landingApi.getPortfolioProjects([]) as any;
    const backendData = response.data || response;

    if (!backendData || !Array.isArray(backendData) || backendData.length === 0) {
      console.log(`[fetchMappedPortfolioProjects] No portfolio items found for ${serviceSlug}. Using mock.`);
      return mockFallback;
    }

    // Only projects explicitly linked to this service (via the admin Portfolio
    // form's Service field) belong on this service's page — otherwise every
    // service page would show the same unfiltered latest-6 regardless of what
    // the work actually is.
    const forService = backendData.filter((project: any) => project.service?.slug === serviceSlug);
    if (forService.length === 0) {
      return mockFallback;
    }

    const mapped = forService.map((project: any) => {
      const thumbnailUrl = project.coverImage?.secureUrl || project.coverImage?.url;
      return {
        id: project.id,
        title: project.title,
        category: project.category?.name || "Project",
        technologies: project.technologies || [],
        thumbnail: thumbnailUrl ? toSecureCloudinaryUrl(thumbnailUrl) : "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
        link: project.liveUrl || "/case-studies",
      };
    });

    // Return every matching project — the gallery itself caps the initial view and
    // expands in place via "View all works", so capping the data here would make
    // that button a dead end once a service has more than 6 published projects.
    return mapped;
  } catch (error) {
    console.warn("[fetchMappedPortfolioProjects] Failed to fetch. Using mock.", error);
    return mockFallback;
  }
}
