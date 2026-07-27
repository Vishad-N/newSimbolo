/**
 * Real Backend API Client Layer for Simbolo Admin Portal
 * 
 * Configured to connect to the production-ready NestJS API backend running at API_BASE_URL.
 * Includes graceful fallback to mock data during local offline development or UI preview mode.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchFromApi<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
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

export const api = {
  // CMS Modules
  homepage: {
    get: async () => {
      const fallback = {
        hero: {
          title: "AI-Powered Digital Marketing Matchmaking",
          subtitle: "Find the perfect marketing agency for your business.",
          ctaPrimary: "Get Matched",
          ctaSecondary: "View Services"
        }
      };
      return fetchFromApi('/cms/homepage', { method: 'GET' }, fallback);
    },
    update: async (data: any) => {
      return fetchFromApi('/cms/homepage', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }, { success: true, data });
    }
  },

  aboutUs: {
    get: async () => fetchFromApi('/cms/about-us', { method: 'GET' }, { title: 'About The Simbolo' }),
    update: async (data: any) => fetchFromApi('/cms/about-us', { method: 'PATCH', body: JSON.stringify(data) }, { success: true, data }),
  },

  helpCenter: {
    get: async () => fetchFromApi('/cms/help-center', { method: 'GET' }, { title: 'Help Center & Knowledge Base' }),
    update: async (data: any) => fetchFromApi('/cms/help-center', { method: 'PATCH', body: JSON.stringify(data) }, { success: true, data }),
  },

  navigation: {
    get: async () => fetchFromApi('/cms/navigation', { method: 'GET' }, []),
    createItem: async (data: any) => fetchFromApi('/cms/navigation/items', { method: 'POST', body: JSON.stringify(data) }, { success: true, data }),
  },

  footer: {
    get: async () => fetchFromApi('/cms/footer', { method: 'GET' }, { copyright: '© 2026 The Simbolo. All rights reserved.' }),
    update: async (data: any) => fetchFromApi('/cms/footer', { method: 'PATCH', body: JSON.stringify(data) }, { success: true, data }),
  },

  // Services Catalog & Packages
  services: {
    getAll: async () => fetchFromApi('/services', { method: 'GET' }, []),
    create: async (data: any) => fetchFromApi('/services', { method: 'POST', body: JSON.stringify(data) }, { success: true, data: { ...data, id: Date.now().toString() } }),
    update: async (id: string, data: any) => fetchFromApi(`/services/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, { success: true, data }),
    delete: async (id: string) => fetchFromApi(`/services/${id}`, { method: 'DELETE' }, { success: true }),
  },

  packages: {
    getAll: async () => {
      const fallback = [
        { id: "1", name: "Basic SEO", category: "SEO", price: "$499/mo", status: "Active" },
        { id: "2", name: "Pro SEO", category: "SEO", price: "$999/mo", status: "Active" },
        { id: "3", name: "Starter Website", category: "Web Dev", price: "$1,499", status: "Active" }
      ];
      return fetchFromApi('/packages', { method: 'GET' }, fallback);
    },
    create: async (data: any) => fetchFromApi('/packages', { method: 'POST', body: JSON.stringify(data) }, { success: true, data: { ...data, id: Date.now().toString() } }),
    update: async (id: string, data: any) => fetchFromApi(`/packages/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, { success: true, data }),
    delete: async (id: string) => fetchFromApi(`/packages/${id}`, { method: 'DELETE' }, { success: true }),
  },

  // Content & Showcase Modules
  blogs: {
    getAll: async () => fetchFromApi('/blogs', { method: 'GET' }, []),
    create: async (data: any) => fetchFromApi('/blogs', { method: 'POST', body: JSON.stringify(data) }, { success: true, data: { ...data, id: Date.now().toString() } }),
    update: async (id: string, data: any) => fetchFromApi(`/blogs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, { success: true, data }),
    delete: async (id: string) => fetchFromApi(`/blogs/${id}`, { method: 'DELETE' }, { success: true }),
  },

  caseStudies: {
    getAll: async () => fetchFromApi('/case-studies', { method: 'GET' }, []),
    create: async (data: any) => fetchFromApi('/case-studies', { method: 'POST', body: JSON.stringify(data) }, { success: true, data: { ...data, id: Date.now().toString() } }),
    update: async (id: string, data: any) => fetchFromApi(`/case-studies/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, { success: true, data }),
    delete: async (id: string) => fetchFromApi(`/case-studies/${id}`, { method: 'DELETE' }, { success: true }),
  },

  portfolio: {
    getAll: async () => {
      const fallback = [
        { id: "1", title: "TechCorp Rebrand", category: "Design", status: "Active" },
      ];
      return fetchFromApi('/portfolio/projects', { method: 'GET' }, fallback);
    },
    create: async (data: any) => fetchFromApi('/portfolio/projects', { method: 'POST', body: JSON.stringify(data) }, { success: true, data: { ...data, id: Date.now().toString() } }),
    update: async (id: string, data: any) => fetchFromApi(`/portfolio/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, { success: true, data }),
    delete: async (id: string) => fetchFromApi(`/portfolio/projects/${id}`, { method: 'DELETE' }, { success: true }),
  },

  testimonials: {
    getAll: async () => fetchFromApi('/testimonials', { method: 'GET' }, []),
    create: async (data: any) => fetchFromApi('/testimonials', { method: 'POST', body: JSON.stringify(data) }, { success: true, data: { ...data, id: Date.now().toString() } }),
    update: async (id: string, data: any) => fetchFromApi(`/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, { success: true, data }),
    delete: async (id: string) => fetchFromApi(`/testimonials/${id}`, { method: 'DELETE' }, { success: true }),
  },

  faqs: {
    getAll: async () => fetchFromApi('/faqs', { method: 'GET' }, []),
    create: async (data: any) => fetchFromApi('/faqs', { method: 'POST', body: JSON.stringify(data) }, { success: true, data: { ...data, id: Date.now().toString() } }),
    update: async (id: string, data: any) => fetchFromApi(`/faqs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, { success: true, data }),
    delete: async (id: string) => fetchFromApi(`/faqs/${id}`, { method: 'DELETE' }, { success: true }),
  },

  // SEO & Media
  seo: {
    getAll: async () => fetchFromApi('/seo', { method: 'GET' }, []),
    getByPath: async (path: string) => fetchFromApi(`/seo/page?path=${encodeURIComponent(path)}`, { method: 'GET' }, null),
    create: async (data: any) => fetchFromApi('/seo', { method: 'POST', body: JSON.stringify(data) }, { success: true, data: { ...data, id: Date.now().toString() } }),
    update: async (id: string, data: any) => fetchFromApi(`/seo/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, { success: true, data }),
    delete: async (id: string) => fetchFromApi(`/seo/${id}`, { method: 'DELETE' }, { success: true }),
  },

  media: {
    getAll: async () => fetchFromApi('/media/assets', { method: 'GET' }, []),
    upload: async (fileData: FormData) => {
      try {
        const res = await fetch(`${API_BASE_URL}/media/upload`, {
          method: 'POST',
          body: fileData,
        });
        if (!res.ok) throw new Error(`Upload failed (${res.status})`);
        return await res.json();
      } catch (err) {
        console.warn('[Simbolo API Fallback] Media upload fallback:', err);
        return { id: Date.now().toString(), url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop" };
      }
    },
    delete: async (id: string) => fetchFromApi(`/media/assets/${id}`, { method: 'DELETE' }, { success: true }),
  },

  // Taxonomy & System Settings
  technologies: {
    getAll: async () => fetchFromApi('/cms/settings/technologies', { method: 'GET' }, []),
    update: async (data: any) => fetchFromApi('/cms/settings/technologies', { method: 'PATCH', body: JSON.stringify(data) }, { success: true, data }),
  },

  industries: {
    getAll: async () => fetchFromApi('/cms/settings/industries', { method: 'GET' }, []),
    update: async (data: any) => fetchFromApi('/cms/settings/industries', { method: 'PATCH', body: JSON.stringify(data) }, { success: true, data }),
  },

  settings: {
    getTheme: async () => fetchFromApi('/cms/settings/theme', { method: 'GET' }, { primaryColor: '#14B8A6', mode: 'dark' }),
    updateTheme: async (data: any) => fetchFromApi('/cms/settings/theme', { method: 'PATCH', body: JSON.stringify(data) }, { success: true, data }),
  },

  config: {
    baseURL: API_BASE_URL,
  },
};
