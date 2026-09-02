/**
 * Dynamic Backend API Consumer Layer for Simbolo Landing Website
 * 
 * Configured to connect to the production NestJS API backend running at API_BASE_URL.
 * Integrates Next.js caching with revalidate tags and automatic fallback to static mock data
 * when offline or during zero-config local previews.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
const shouldSkipBuildApiFetch =
  process.env.SKIP_BUILD_API_FETCH === "true" ||
  process.env.NEXT_PHASE === "phase-production-build";

// The CMS/content endpoints can return a genuinely empty result (no rows
// created yet, or a section never saved from the admin panel) without that
// being a fetch error — an empty array, an empty object, or null/undefined.
// Treat that as "no CMS data yet" and fall back to the static mock content,
// same as a network failure would. Existing callers (blog-mapper, etc.)
// unwrap the backend's {success, data} envelope themselves, so this only
// PEEKS through the envelope to check emptiness — it never strips it from
// what's actually returned, to avoid breaking that already-working code.
function isEmptyResult(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if ('success' in record && 'data' in record) return isEmptyResult(record.data);
    return Object.keys(record).length === 0;
  }
  return false;
}

async function fetchPublicApi<T>(endpoint: string, fallback: T, revalidateSeconds: number = 60): Promise<T> {
  if (shouldSkipBuildApiFetch) {
    return fallback;
  }

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
    const data = await res.json();
    return isEmptyResult(data) ? fallback : (data as T);
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
  getTeamMembers: async (fallbackData: any) => fetchPublicApi('/website-team?activeOnly=true', fallbackData, 300),
  getServiceBySlug: async (slug: string, fallbackData: any) => fetchPublicApi(`/services/${encodeURIComponent(slug)}`, fallbackData, 60),
  
  getServicePageConfig: async (slug: string, fallbackData: any) => fetchPublicApi(`/service-page-config/${encodeURIComponent(slug)}`, fallbackData, 60),

  getVideoCatalogItems: async (fallbackData: any, categoryId?: string) => {
    const endpoint = categoryId ? `/video-catalog?categoryId=${encodeURIComponent(categoryId)}` : '/video-catalog';
    return fetchPublicApi(endpoint, fallbackData, 60);
  },
  getVideoCatalogCategories: async (fallbackData: any) => fetchPublicApi('/video-catalog/categories', fallbackData, 300),

  getPackages: async (fallbackData: any, serviceId?: string) => {
    const endpoint = serviceId ? `/packages?serviceId=${encodeURIComponent(serviceId)}` : '/packages';
    return fetchPublicApi(endpoint, fallbackData, 300);
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
    const endpoint = categoryId ? `/portfolio?categoryId=${encodeURIComponent(categoryId)}` : '/portfolio';
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
  
  submitContactForm: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    phone: string;
    company?: string;
    service?: string;
    message: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit form');
    return res.json();
  }
};
