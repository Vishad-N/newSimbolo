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

/* ---------------------------------------------------------------------------
 * Affiliate / Sales Commission System
 * ------------------------------------------------------------------------- */

export type AffiliateStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type CommissionStatus = 'PENDING' | 'ELIGIBLE' | 'CREDITED' | 'REVERSED' | 'CANCELLED';
export type WithdrawalStatus =
  | 'PENDING'
  | 'SCHEDULED'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'REVERSED'
  | 'CANCELLED';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AffiliateOverview {
  totalSales: number;
  totalAffiliateSales: number;
  activeEmployees: number;
  totalCommission: number;
  pendingCommission: number;
  availableWalletLiability: number;
  pendingWithdrawals: number;
  paidWithdrawals: number;
}

export interface AffiliateEmployee {
  id: string;
  userId: string;
  name: string;
  email: string;
  affiliateCode: string;
  status: AffiliateStatus;
  ordersCount: number;
  salesTotal: number;
  commissionTotal: number;
  walletAvailable: number;
  walletPending: number;
  lifetimeWithdrawn: number;
}

export interface AdminAffiliateCommission {
  id: string;
  orderId: string;
  employeeName?: string;
  employeeCode?: string;
  commissionAmount: number;
  commissionRate: number;
  status: CommissionStatus;
  eligibleAt: string | null;
  creditedAt: string | null;
  createdAt: string;
}

export interface AdminWalletTransaction {
  id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export interface AdminAffiliateWithdrawal {
  id: string;
  employeeName: string;
  employeeCode: string;
  amount: number;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string | null;
  payoutMethod: string;
  razorpayPayoutId: string | null;
  failureReason?: string | null;
}

export interface AdminPayoutMethod {
  id: string;
  type: 'BANK_ACCOUNT' | 'UPI';
  isDefault: boolean;
  status: 'PENDING' | 'VERIFIED' | 'DISABLED';
  maskedDetails: string;
  last4?: string;
}

export interface AffiliateEmployeeDetail extends AffiliateEmployee {
  commissionRate?: number;
  isEligibleForCommission?: boolean;
  createdAt?: string;
  commissions?: AdminAffiliateCommission[];
  walletTransactions?: AdminWalletTransaction[];
  withdrawals?: AdminAffiliateWithdrawal[];
  payoutMethods?: AdminPayoutMethod[];
}

export interface AdminUserSearchResult {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status?: string;
  role?: { id: string; name: string; slug: string };
}

export interface CreateAffiliateEmployeePayload {
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  countryCode?: string;
  phone?: string;
  commissionRate?: number;
}

export interface AffiliateCommissionFilters {
  status?: string;
  employeeId?: string;
  page?: number;
  pageSize?: number;
}

export interface AffiliateSettings {
  defaultCommissionRate: number;
  commissionCalculationBasis: string;
  commissionHoldPeriodDays: number;
  minimumWithdrawalAmount: number;
  maximumWithdrawalAmount: number;
  paydayFrequency: string;
  paydayDayOfWeek: number;
  paydayCutoffTime: string;
  payoutAutoProcessingEnabled: boolean;
  selfReferralAllowed: boolean;
}

const emptyPage = <T,>(pageSize: number): Paginated<T> => ({ items: [], total: 0, page: 1, pageSize });

/**
 * The affiliate backend's list endpoints follow this codebase's existing pagination
 * convention — `{ data, meta: { total, page, limit, totalPages } }` (same shape as
 * PaymentsService.findAll etc.) — rather than the flat `{ items, total, page, pageSize }`
 * shape used elsewhere in this file. Normalize here instead of at every call site.
 */
const toPaginated = <T,>(raw: unknown, fallbackPage: number, fallbackPageSize: number): Paginated<T> => {
  const payload = raw as
    | { items?: T[]; total?: number; page?: number; pageSize?: number }
    | { data?: T[]; meta?: { total?: number; page?: number; limit?: number } }
    | T[]
    | null
    | undefined;
  if (Array.isArray(payload)) {
    return { items: payload, total: payload.length, page: fallbackPage, pageSize: fallbackPageSize };
  }
  if (!payload) return emptyPage<T>(fallbackPageSize);
  if ('items' in payload && payload.items) {
    return {
      items: payload.items,
      total: payload.total ?? payload.items.length,
      page: payload.page ?? fallbackPage,
      pageSize: payload.pageSize ?? fallbackPageSize,
    };
  }
  if ('data' in payload && payload.data) {
    return {
      items: payload.data,
      total: payload.meta?.total ?? payload.data.length,
      page: payload.meta?.page ?? fallbackPage,
      pageSize: payload.meta?.limit ?? fallbackPageSize,
    };
  }
  return emptyPage<T>(fallbackPageSize);
};

const EMPTY_AFFILIATE_OVERVIEW: AffiliateOverview = {
  totalSales: 0,
  totalAffiliateSales: 0,
  activeEmployees: 0,
  totalCommission: 0,
  pendingCommission: 0,
  availableWalletLiability: 0,
  pendingWithdrawals: 0,
  paidWithdrawals: 0,
};

const DEFAULT_AFFILIATE_SETTINGS: AffiliateSettings = {
  defaultCommissionRate: 0,
  commissionCalculationBasis: 'SUBTOTAL_AFTER_DISCOUNT',
  commissionHoldPeriodDays: 0,
  minimumWithdrawalAmount: 0,
  maximumWithdrawalAmount: 0,
  paydayFrequency: 'WEEKLY',
  paydayDayOfWeek: 5,
  paydayCutoffTime: '18:00',
  payoutAutoProcessingEnabled: false,
  selfReferralAllowed: false,
};

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
  affiliate: {
    getOverview: async () =>
      fetchFromApi<AffiliateOverview>('/admin/affiliate/overview', { method: 'GET' }, EMPTY_AFFILIATE_OVERVIEW),
    getEmployees: async (page = 1, pageSize = 50) =>
      toPaginated<AffiliateEmployee>(
        await fetchFromApi(
          `/admin/affiliate/employees?page=${page}&limit=${pageSize}`,
          { method: 'GET' },
          emptyPage<AffiliateEmployee>(pageSize),
        ),
        page,
        pageSize,
      ),
    getEmployee: async (id: string) =>
      fetchFromApi<AffiliateEmployeeDetail | null>(`/admin/affiliate/employees/${id}`, { method: 'GET' }, null),
    createEmployee: async (payload: CreateAffiliateEmployeePayload) =>
      fetchFromApi<AffiliateEmployee>('/admin/affiliate/employees', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    activateEmployee: async (id: string) =>
      fetchFromApi(`/admin/affiliate/employees/${id}/activate`, { method: 'PATCH' }),
    deactivateEmployee: async (id: string) =>
      fetchFromApi(`/admin/affiliate/employees/${id}/deactivate`, { method: 'PATCH' }),
    // Soft delete — backend refuses if the wallet has an outstanding balance or a
    // withdrawal is still in flight, and returns that reason as the error message.
    deleteEmployee: async (id: string) =>
      fetchFromApi(`/admin/affiliate/employees/${id}`, { method: 'DELETE' }),
    // Existing users who could be turned into a sales employee. Reuses the core
    // Users module's search (requires `users.view`, already granted to admin roles)
    // rather than duplicating a user list inside the affiliate module.
    searchUsers: async (query: string): Promise<AdminUserSearchResult[]> => {
      if (!query || query.trim().length < 2) return [];
      const res = await fetchFromApi<{ data?: AdminUserSearchResult[] } | AdminUserSearchResult[]>(
        `/users?search=${encodeURIComponent(query.trim())}&limit=10`,
        { method: 'GET' },
        [],
      );
      return Array.isArray(res) ? res : res.data ?? [];
    },

    getCommissions: async (filters: AffiliateCommissionFilters = {}) => {
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? 50;
      const query = new URLSearchParams();
      if (filters.status) query.set('status', filters.status);
      if (filters.employeeId) query.set('employeeId', filters.employeeId);
      query.set('page', String(page));
      query.set('limit', String(pageSize));
      return toPaginated<AdminAffiliateCommission>(
        await fetchFromApi(
          `/admin/affiliate/commissions?${query.toString()}`,
          { method: 'GET' },
          emptyPage<AdminAffiliateCommission>(pageSize),
        ),
        page,
        pageSize,
      );
    },

    getWithdrawals: async (page = 1, pageSize = 50) =>
      toPaginated<AdminAffiliateWithdrawal>(
        await fetchFromApi(
          `/admin/affiliate/withdrawals?page=${page}&limit=${pageSize}`,
          { method: 'GET' },
          emptyPage<AdminAffiliateWithdrawal>(pageSize),
        ),
        page,
        pageSize,
      ),
    getWithdrawal: async (id: string) =>
      fetchFromApi<AdminAffiliateWithdrawal | null>(`/admin/affiliate/withdrawals/${id}`, { method: 'GET' }, null),
    approveWithdrawal: async (id: string) =>
      fetchFromApi(`/admin/affiliate/withdrawals/${id}/approve`, { method: 'POST' }),
    processWithdrawal: async (id: string) =>
      fetchFromApi(`/admin/affiliate/withdrawals/${id}/process`, { method: 'POST' }),
    retryWithdrawal: async (id: string) =>
      fetchFromApi(`/admin/affiliate/withdrawals/${id}/retry`, { method: 'POST' }),
    cancelWithdrawal: async (id: string) =>
      fetchFromApi(`/admin/affiliate/withdrawals/${id}/cancel`, { method: 'POST' }),

    getSettings: async () =>
      fetchFromApi<AffiliateSettings>('/admin/affiliate/settings', { method: 'GET' }, DEFAULT_AFFILIATE_SETTINGS),
    updateSettings: async (data: Partial<AffiliateSettings>) =>
      fetchFromApi<AffiliateSettings>('/admin/affiliate/settings', { method: 'PUT', body: JSON.stringify(data) }),
  },

  config: {
    baseURL: API_BASE_URL,
  },
};
