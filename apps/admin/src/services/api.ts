/**
 * Real Backend API Client Layer for Simbolo Admin Portal
 * 
 * Configured to connect to the production-ready NestJS API backend running at API_BASE_URL.
 * Includes graceful fallback to mock data during local offline development or UI preview mode.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function fetchFromApi<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      throw new Error(`API error (${res.status}): ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`[Simbolo API Fallback] Could not fetch ${endpoint}, returning fallback data:`, error);
    if (fallback !== undefined) {
      await delay(300); // Simulate network latency for realistic UI state
      return fallback;
    }
    throw error;
  }
}

export interface ManualClientPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  countryCode?: string;
  phone?: string;
  packageId?: string;
  interval?: "MONTHLY" | "QUARTERLY" | "YEARLY";
  price?: number;
  currency?: string;
  billingAddress?: string;
  gstNumber?: string;
  timezone?: string;
  notes?: string;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    permissions?: string[];
  };
}

interface ApiEnvelope<T> {
  data: T;
}

export const api = {
  auth: {
    login: async (data: AdminLoginPayload) => {
      const response = await fetchFromApi<AdminLoginResponse | ApiEnvelope<AdminLoginResponse>>(
        '/auth/login',
        { method: 'POST', body: JSON.stringify(data) },
      );
      return 'data' in response ? response.data : response;
    },
  },
  // CMS Modules
  homepage: {
    get: async () => fetchFromApi('/cms/homepage', { method: 'GET' }),
    update: async (data: any) => fetchFromApi('/cms/homepage', { method: 'PATCH', body: JSON.stringify(data) }),
  },
  aboutUs: {
    get: async () => fetchFromApi('/cms/about-us', { method: 'GET' }),
    update: async (data: any) => fetchFromApi('/cms/about-us', { method: 'PATCH', body: JSON.stringify(data) }),
  },
  helpCenter: {
    get: async () => fetchFromApi('/cms/help-center', { method: 'GET' }),
    update: async (data: any) => fetchFromApi('/cms/help-center', { method: 'PATCH', body: JSON.stringify(data) }),
  },
  navigation: {
    get: async () => fetchFromApi('/cms/navigation', { method: 'GET' }),
    update: async (data: any) => fetchFromApi('/cms/navigation', { method: 'PATCH', body: JSON.stringify(data) }),
  },
  
  // Individual Service Page Config
  servicePageConfig: {
    get: async (slug: string) => fetchFromApi<any>(`/service-page-config/${slug}`, { method: 'GET' }, null),
    update: async (slug: string, data: any) => fetchFromApi<any>(`/service-page-config/${slug}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  
  footer: {
    get: async () => fetchFromApi('/cms/footer', { method: 'GET' }),
    update: async (data: any) => fetchFromApi('/cms/footer', { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // Services Catalog & Packages
  services: {
    getAll: async () => fetchFromApi('/services', { method: 'GET' }),
    create: async (data: any) => fetchFromApi('/services', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => fetchFromApi(`/services/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/services/${id}`, { method: 'DELETE' }),
  },
  packages: {
    getAll: async () => fetchFromApi('/packages', { method: 'GET' }),
    create: async (data: any) => fetchFromApi('/packages', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => fetchFromApi(`/packages/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/packages/${id}`, { method: 'DELETE' }),
  },
  clients: {
    getAll: async () => fetchFromApi('/clients', { method: 'GET' }),
    createManual: async (data: ManualClientPayload) =>
      fetchFromApi('/clients/manual', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Content & Showcase Modules
  blogs: {
    getAll: async () => fetchFromApi('/blogs', { method: 'GET' }),
    getCategories: async () => fetchFromApi('/blogs/categories', { method: 'GET' }),
    getAuthors: async () => fetchFromApi('/blogs/authors', { method: 'GET' }),
    create: async (data: any) => fetchFromApi('/blogs', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => fetchFromApi(`/blogs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/blogs/${id}`, { method: 'DELETE' }),
  },
  caseStudies: {
    getAll: async () => fetchFromApi('/case-studies', { method: 'GET' }),
    create: async (data: any) => fetchFromApi('/case-studies', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => fetchFromApi(`/case-studies/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/case-studies/${id}`, { method: 'DELETE' }),
  },
  portfolio: {
    getAll: async () => fetchFromApi('/portfolio', { method: 'GET' }),
    create: async (data: any) => fetchFromApi('/portfolio', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => fetchFromApi(`/portfolio/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/portfolio/${id}`, { method: 'DELETE' }),
  },
  testimonials: {
    getAll: async () => fetchFromApi('/testimonials', { method: 'GET' }),
    create: async (data: any) => fetchFromApi('/testimonials', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => fetchFromApi(`/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/testimonials/${id}`, { method: 'DELETE' }),
  },
  faqs: {
    getAll: async () => fetchFromApi('/faqs', { method: 'GET' }),
    create: async (data: any) => fetchFromApi('/faqs', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => fetchFromApi(`/faqs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/faqs/${id}`, { method: 'DELETE' }),
  },

  // SEO & Media
  seo: {
    getAll: async () => fetchFromApi('/seo', { method: 'GET' }),
    getByPath: async (path: string) => fetchFromApi(`/seo/page?path=${encodeURIComponent(path)}`, { method: 'GET' }),
    create: async (data: any) => fetchFromApi('/seo', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => fetchFromApi(`/seo/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/seo/${id}`, { method: 'DELETE' }),
  },
  media: {
    getAll: async (folder?: string) => {
      const url = folder ? `/website-media?folder=${encodeURIComponent(folder)}` : '/website-media';
      return fetchFromApi(url, { method: 'GET' });
    },
    upload: async (fileData: FormData) => {
      const res = await fetch(`${API_BASE_URL}/website-media/upload`, {
        method: 'POST',
        body: fileData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      return await res.json();
    },
    delete: async (id: string) => fetchFromApi(`/website-media/${id}`, { method: 'DELETE' }),
  },

  // Taxonomy & System Settings
  technologies: {
    getAll: async () => fetchFromApi('/settings/technologies', { method: 'GET' }),
    update: async (data: any) => fetchFromApi('/settings/technologies', { method: 'PATCH', body: JSON.stringify(data) }),
  },
  industries: {
    getAll: async () => fetchFromApi('/settings/industries', { method: 'GET' }),
    update: async (data: any) => fetchFromApi('/settings/industries', { method: 'PATCH', body: JSON.stringify(data) }),
  },
  settings: {
    getTheme: async () => fetchFromApi('/settings/theme', { method: 'GET' }),
    updateTheme: async (data: any) => fetchFromApi('/settings/theme', { method: 'PATCH', body: JSON.stringify(data) }),
  },
  websiteTeam: {
    getAll: async () => fetchFromApi('/website-team', { method: 'GET' }),
    create: async (data: any) => fetchFromApi('/website-team', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => fetchFromApi(`/website-team/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/website-team/${id}`, { method: 'DELETE' }),
  },
  leads: {
    getAll: async () => fetchFromApi('/leads', { method: 'GET' }),
    update: async (id: string, data: any) => fetchFromApi(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/leads/${id}`, { method: 'DELETE' }),
  },
  config: {
    baseURL: API_BASE_URL,
  },
};
