/**
 * Dynamic Backend API Consumer Layer for Simbolo Landing Website
 * 
 * Configured to connect to the production NestJS API backend running at API_BASE_URL.
 * Integrates Next.js caching with revalidate tags and automatic fallback to static mock data
 * when offline or during zero-config local previews.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

async function fetchPublicApi<T>(endpoint: string, fallback: T, revalidateSeconds: number = 60): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) {
      throw new Error(`API error (${res.status}): ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`[Simbolo Landing API Fallback] Could not fetch ${endpoint}, using static fallback:`, error);
    return fallback;
  }
}

export const landingApi = {
  getHomepage: async (fallbackData: any) => fetchPublicApi('/cms/homepage', fallbackData, 60),
  getAboutUs: async (fallbackData: any) => fetchPublicApi('/cms/about-us', fallbackData, 120),
  getHelpCenter: async (fallbackData: any) => fetchPublicApi('/cms/help-center', fallbackData, 300),
  getNavigation: async (fallbackData: any) => fetchPublicApi('/cms/navigation', fallbackData, 300),
  getFooter: async (fallbackData: any) => fetchPublicApi('/cms/footer', fallbackData, 300),
  
  getServices: async (fallbackData: any) => fetchPublicApi('/services', fallbackData, 60),
  getServiceBySlug: async (slug: string, fallbackData: any) => fetchPublicApi(`/services/${encodeURIComponent(slug)}`, fallbackData, 60),
  
  getPackages: async (fallbackData: any, serviceId?: string) => {
    const endpoint = serviceId ? `/packages?serviceId=${encodeURIComponent(serviceId)}` : '/packages';
    return fetchPublicApi(endpoint, fallbackData, 60);
  },
  
  getBlogs: async (fallbackData: any, categoryId?: string, isFeatured?: boolean) => {
    let query = '';
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (isFeatured !== undefined) params.append('isFeatured', String(isFeatured));
    if (params.toString()) query = `?${params.toString()}`;
    return fetchPublicApi(`/blogs${query}`, fallbackData, 60);
  },
  getBlogBySlug: async (slug: string, fallbackData: any) => fetchPublicApi(`/blogs/${encodeURIComponent(slug)}`, fallbackData, 60),
  
  getCaseStudies: async (fallbackData: any, isFeatured?: boolean) => {
    const endpoint = isFeatured !== undefined ? `/case-studies?isFeatured=${isFeatured}` : '/case-studies';
    return fetchPublicApi(endpoint, fallbackData, 60);
  },
  getCaseStudyBySlug: async (slug: string, fallbackData: any) => fetchPublicApi(`/case-studies/${encodeURIComponent(slug)}`, fallbackData, 60),
  
  getPortfolioProjects: async (fallbackData: any, categoryId?: string) => {
    const endpoint = categoryId ? `/portfolio/projects?categoryId=${encodeURIComponent(categoryId)}` : '/portfolio/projects';
    return fetchPublicApi(endpoint, fallbackData, 60);
  },
  
  getTestimonials: async (fallbackData: any, isFeatured?: boolean) => {
    const endpoint = isFeatured !== undefined ? `/testimonials?isFeatured=${isFeatured}` : '/testimonials';
    return fetchPublicApi(endpoint, fallbackData, 60);
  },
  
  getFaqs: async (fallbackData: any, categoryId?: string, serviceId?: string) => {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (serviceId) params.append('serviceId', serviceId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchPublicApi(`/faqs${query}`, fallbackData, 60);
  },
  
  getSeoMetadata: async (path: string, fallbackData: any) => fetchPublicApi(`/seo/page?path=${encodeURIComponent(path)}`, fallbackData, 300),
};
