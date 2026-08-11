import { landingApi } from "./api";

export async function fetchMappedPortfolioProjects(serviceSlug: string, mockFallback: any[]): Promise<any[]> {
  try {
    // Note: If you want to filter by categoryId or serviceId, you'd need the ID, 
    // but right now the API gets all. You can filter client-side or pass serviceId.
    const response = await landingApi.getPortfolioProjects([]) as any;
    const backendData = response.data || response;

    if (!backendData || !Array.isArray(backendData) || backendData.length === 0) {
      console.log(`[fetchMappedPortfolioProjects] No portfolio items found for ${serviceSlug}. Using mock.`);
      return mockFallback;
    }

    // Attempt to filter by service if populated, otherwise return all
    // Or just return the latest 6
    const mapped = backendData.map((project: any) => ({
      id: project.id,
      title: project.title,
      category: project.category?.name || "Project",
      technologies: project.technologies || [],
      thumbnail: project.thumbnailUrl || project.heroImage || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
      link: `/portfolio/${project.slug}`,
    }));

    return mapped.slice(0, 6); // Just show the top 6
  } catch (error) {
    console.warn("[fetchMappedPortfolioProjects] Failed to fetch. Using mock.", error);
    return mockFallback;
  }
}
