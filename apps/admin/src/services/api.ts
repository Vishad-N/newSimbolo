/**
 * Mock API Layer for Simbolo Admin
 * 
 * This layer intercepts data requests and returns mock JSON data to simulate a real backend.
 * Once the NestJS backend is ready, you can simply replace the fetchMock calls with real fetch/axios calls
 * pointing to your API endpoints, without having to change the UI components.
 */

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  homepage: {
    get: async () => {
      await delay(500);
      return {
        hero: {
          title: "AI-Powered Digital Marketing Matchmaking",
          subtitle: "Find the perfect marketing agency for your business.",
          ctaPrimary: "Get Matched",
          ctaSecondary: "View Services"
        }
      };
    },
    update: async (data: any) => {
      await delay(800);
      return { success: true, data };
    }
  },

  packages: {
    getAll: async () => {
      await delay(600);
      return [
        { id: "1", name: "Basic SEO", category: "SEO", price: "$499/mo", status: "Active" },
        { id: "2", name: "Pro SEO", category: "SEO", price: "$999/mo", status: "Active" },
        { id: "3", name: "Starter Website", category: "Web Dev", price: "$1,499", status: "Active" }
      ];
    },
    create: async (data: any) => {
      await delay(800);
      return { success: true, data: { ...data, id: Date.now().toString() } };
    },
    update: async (id: string, data: any) => {
      await delay(800);
      return { success: true, data };
    },
    delete: async (id: string) => {
      await delay(500);
      return { success: true };
    }
  },

  portfolio: {
    getAll: async () => {
      await delay(500);
      return [
        { id: "1", title: "TechCorp Rebrand", category: "Design", status: "Active" },
      ];
    },
    update: async (data: any) => { await delay(500); return { success: true }; }
  },

  testimonials: {
    getAll: async () => {
      await delay(400);
      return [];
    },
    update: async (data: any) => { await delay(500); return { success: true }; }
  },

  faqs: {
    getAll: async () => { await delay(400); return []; },
    update: async (data: any) => { await delay(500); return { success: true }; }
  },

  technologies: {
    getAll: async () => { await delay(400); return []; },
    update: async (data: any) => { await delay(500); return { success: true }; }
  },

  industries: {
    getAll: async () => { await delay(400); return []; },
    update: async (data: any) => { await delay(500); return { success: true }; }
  },

  settings: {
    getTheme: async () => { await delay(400); return {}; },
    updateTheme: async (data: any) => { await delay(500); return { success: true }; }
  },

  // Future backend-ready base URL config
  // config: {
  //   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  // }
};
