/**
 * Real Backend API Client Layer for Simbolo Admin Portal
 * 
 * Configured to connect to the production-ready NestJS API backend running at API_BASE_URL.
 * Includes graceful fallback to mock data during local offline development or UI preview mode.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

const TOKEN_STORAGE_KEY = "admin_token";
const REFRESH_TOKEN_STORAGE_KEY = "admin_refresh_token";
const USER_STORAGE_KEY = "admin_user";

// Fired when a refresh attempt fails outright (refresh token missing/expired/revoked) so
// TopNavbar can drop its cached "signed in" state and prompt the user to sign in again,
// instead of silently continuing to show a stale "Signed in as ..." while every
// authenticated call 401s in the background.
export const SESSION_EXPIRED_EVENT = "admin-session-expired";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const clearSession = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
};

// A short-lived access token expiring mid-session is the common case (not a bug to
// surface as an error) — refresh it silently using the longer-lived refresh token and
// retry the original call once. Concurrent 401s share one in-flight refresh instead of
// each firing their own (which would race to rotate the refresh token and invalidate
// each other). Only a failed refresh (refresh token itself missing/expired/revoked) is
// a real "you're logged out" event.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    if (typeof window === "undefined") return null;
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    if (!refreshToken) {
      clearSession();
      return null;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        clearSession();
        return null;
      }
      const json = await res.json();
      const data = json && typeof json === "object" && "data" in json ? json.data : json;
      if (!data?.accessToken || !data?.refreshToken) {
        clearSession();
        return null;
      }
      localStorage.setItem(TOKEN_STORAGE_KEY, data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, data.refreshToken);
      return data.accessToken as string;
    } catch {
      // Network failure talking to the refresh endpoint — leave the session alone
      // (don't log the user out over a blip); the retried request will just fail
      // with the original error and the caller's existing fallback handling applies.
      return null;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

// Shared by every caller that talks to the backend directly — the JSON helper below,
// plus raw multipart/form-data callers (file uploads) that can't go through
// fetchFromApi because it always forces a JSON Content-Type. Handles the 401 ->
// silent-refresh -> retry-once flow in one place so neither kind of caller has to
// duplicate it.
export async function fetchWithAuthRetry(url: string, options?: RequestInit): Promise<Response> {
  const isRefreshCall = url.includes("/auth/refresh-token");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options?.headers || {}),
    },
  });

  if (res.status === 401 && !isRefreshCall && typeof window !== "undefined" && localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      return fetch(url, {
        ...options,
        headers: {
          ...(options?.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    }
    // Refresh itself failed — clearSession() already ran inside refreshAccessToken().
  }

  return res;
}

async function fetchFromApi<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetchWithAuthRetry(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      throw new Error(`API error (${res.status}): ${res.statusText}`);
    }
    return unwrapEnvelope<T>(await res.json());
  } catch (error) {
    console.warn(`[Simbolo API Fallback] Could not fetch ${endpoint}, returning fallback data:`, error);
    if (fallback !== undefined) {
      await delay(300); // Simulate network latency for realistic UI state
      return fallback;
    }
    throw error;
  }
}

// The backend's global TransformInterceptor wraps every response in
// { success, message, data }. Unwrap it here, once, so every caller gets the
// real payload directly instead of each having to know about this envelope.
function unwrapEnvelope<T>(json: unknown): T {
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    return (json as { data: T }).data;
  }
  return json as T;
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

export interface AdminRole {
  id: string;
  name: string;
  slug: string;
}

export interface CreateStaffUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: string;
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

export type DocumentCategory = 'CONTRACT' | 'NDA' | 'PROPOSAL' | 'REPORT' | 'BRIEF' | 'PROJECT_FILE' | 'OTHER';

export interface AdminDocument {
  id: string;
  title: string;
  description?: string | null;
  category: DocumentCategory;
  fileUrl: string;
  fileSize?: number | null;
  mimeType?: string | null;
  downloadCount: number;
  createdAt: string;
  clientId?: string | null;
  projectId?: string | null;
  uploadedBy?: { id: string; firstName?: string; lastName?: string } | null;
  client?: { id: string; user?: { id: string; firstName?: string; lastName?: string } } | null;
  project?: { id: string; name: string } | null;
}

export interface DocumentFilters {
  clientId?: string;
  projectId?: string;
  category?: DocumentCategory;
  page?: number;
  pageSize?: number;
}

export interface UploadDocumentPayload {
  title: string;
  description?: string;
  category?: DocumentCategory;
  clientId?: string;
  projectId?: string;
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
 * Normalizes any list-endpoint response — a raw array, `{ data: [...] }`, or
 * `{ items: [...] }` — into a plain array, defaulting to `[]` for anything else.
 * Use this at every call site that feeds an API list response into `.map()` or
 * `<DataTable data={...} />`, instead of an ad-hoc `(response.data || response)`
 * unwrap that still throws when the response doesn't match the assumed shape.
 */
export function getDataArray<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response;
  const envelope = response as { data?: T[]; items?: T[] } | null | undefined;
  if (Array.isArray(envelope?.data)) return envelope.data;
  if (Array.isArray(envelope?.items)) return envelope.items;
  return [];
}

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
    getBySlug: async (slug: string) => fetchFromApi(`/services/${encodeURIComponent(slug)}`, { method: 'GET' }),
    create: async (data: any) => fetchFromApi('/services', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => fetchFromApi(`/services/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/services/${id}`, { method: 'DELETE' }),
  },
  packages: {
    getAll: async () => fetchFromApi('/packages', { method: 'GET' }),
    create: async (data: any) => fetchFromApi('/packages', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => fetchFromApi(`/packages/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/packages/${id}`, { method: 'DELETE' }),
    addFeature: async (data: { name: string; packageId: string; description?: string; isIncluded?: boolean; kind?: "FEATURE" | "DELIVERABLE"; limitValue?: string; sortOrder?: number }) =>
      fetchFromApi('/packages/features', { method: 'POST', body: JSON.stringify(data) }),
    deleteFeature: async (id: string) => fetchFromApi(`/packages/features/${id}`, { method: 'DELETE' }),
    upsertPricing: async (data: { packageId: string; currency?: string; price: number; billingPeriod?: string; discountPercentage?: number }) =>
      fetchFromApi('/packages/pricings', { method: 'POST', body: JSON.stringify(data) }),
    deletePricing: async (id: string) => fetchFromApi(`/packages/pricings/${id}`, { method: 'DELETE' }),
  },
  clients: {
    getAll: async () => fetchFromApi('/clients', { method: 'GET' }),
    createManual: async (data: ManualClientPayload) =>
      fetchFromApi('/clients/manual', { method: 'POST', body: JSON.stringify(data) }),
  },

  roles: {
    getAll: async (): Promise<AdminRole[]> => {
      const res = await fetchFromApi<{ data?: AdminRole[] } | AdminRole[]>('/roles', { method: 'GET' }, []);
      return Array.isArray(res) ? res : res.data ?? [];
    },
  },

  users: {
    create: async (data: CreateStaffUserPayload) =>
      fetchFromApi('/users', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Content & Showcase Modules
  blogs: {
    getAll: async () => fetchFromApi('/blogs', { method: 'GET' }),
    getCategories: async () => fetchFromApi('/blogs/categories', { method: 'GET' }),
    createCategory: async (data: { name: string; description?: string }) =>
      fetchFromApi('/blogs/categories', { method: 'POST', body: JSON.stringify(data) }),
    getAuthors: async () => fetchFromApi('/blogs/authors', { method: 'GET' }),
    createAuthor: async (data: { userId: string; bio?: string; avatarUrl?: string; twitterUrl?: string; linkedinUrl?: string }) =>
      fetchFromApi('/blogs/authors', { method: 'POST', body: JSON.stringify(data) }),
    create: async (data: any) => fetchFromApi('/blogs', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => fetchFromApi(`/blogs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/blogs/${id}`, { method: 'DELETE' }),
  },
  caseStudies: {
    getAll: async () => fetchFromApi('/case-studies/admin/all', { method: 'GET' }),
    getCategories: async () => fetchFromApi('/case-studies/categories', { method: 'GET' }),
    createCategory: async (data: { name: string; description?: string }) =>
      fetchFromApi('/case-studies/categories', { method: 'POST', body: JSON.stringify(data) }),
    create: async (data: any) => fetchFromApi('/case-studies', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => fetchFromApi(`/case-studies/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/case-studies/${id}`, { method: 'DELETE' }),
    addMetric: async (data: { label: string; value: string; changePercentage?: string; prefix?: string; suffix?: string; accent?: string; caseStudyId: string; sortOrder?: number }) =>
      fetchFromApi('/case-studies/metrics', { method: 'POST', body: JSON.stringify(data) }),
    deleteMetric: async (id: string) => fetchFromApi(`/case-studies/metrics/${id}`, { method: 'DELETE' }),
    addBeforeAfter: async (data: { metric?: string; beforeValue?: string; afterValue?: string; title?: string; description?: string; beforeImageId?: string; afterImageId?: string; caseStudyId: string; sortOrder?: number }) =>
      fetchFromApi('/case-studies/before-after', { method: 'POST', body: JSON.stringify(data) }),
    deleteBeforeAfter: async (id: string) => fetchFromApi(`/case-studies/before-after/${id}`, { method: 'DELETE' }),
  },
  portfolio: {
    getAll: async () => fetchFromApi('/portfolio', { method: 'GET' }),
    create: async (data: any) => fetchFromApi('/portfolio', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => fetchFromApi(`/portfolio/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/portfolio/${id}`, { method: 'DELETE' }),
  },
  videoCatalog: {
    getAll: async () => fetchFromApi('/video-catalog/admin/all', { method: 'GET' }),
    getCategories: async () => fetchFromApi('/video-catalog/categories', { method: 'GET' }),
    create: async (data: any) => fetchFromApi('/video-catalog', { method: 'POST', body: JSON.stringify(data) }),
    update: async (id: string, data: any) => fetchFromApi(`/video-catalog/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/video-catalog/${id}`, { method: 'DELETE' }),
    reorder: async (orderedIds: string[]) => fetchFromApi('/video-catalog/reorder', { method: 'PATCH', body: JSON.stringify({ orderedIds }) }),
    createCategory: async (data: { name: string; displayOrder?: number }) =>
      fetchFromApi('/video-catalog/categories', { method: 'POST', body: JSON.stringify(data) }),
    deleteCategory: async (id: string) => fetchFromApi(`/video-catalog/categories/${id}`, { method: 'DELETE' }),
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
      const res = await fetchWithAuthRetry(`${API_BASE_URL}/website-media/upload`, {
        method: 'POST',
        body: fileData,
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
  documents: {
    getAll: async (filters: DocumentFilters = {}) => {
      const page = filters.page ?? 1;
      const pageSize = filters.pageSize ?? 50;
      const query = new URLSearchParams();
      if (filters.clientId) query.set('clientId', filters.clientId);
      if (filters.projectId) query.set('projectId', filters.projectId);
      if (filters.category) query.set('category', filters.category);
      query.set('page', String(page));
      query.set('limit', String(pageSize));
      return toPaginated<AdminDocument>(
        await fetchFromApi(`/documents?${query.toString()}`, { method: 'GET' }, emptyPage<AdminDocument>(pageSize)),
        page,
        pageSize,
      );
    },
    // Bypasses fetchFromApi: it always sets Content-Type: application/json, which
    // would break the multipart boundary FormData needs — the browser sets the
    // correct multipart Content-Type itself as long as we don't set one manually.
    upload: async (file: File, payload: UploadDocumentPayload): Promise<AdminDocument> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', payload.title);
      if (payload.description) formData.append('description', payload.description);
      if (payload.category) formData.append('category', payload.category);
      if (payload.clientId) formData.append('clientId', payload.clientId);
      if (payload.projectId) formData.append('projectId', payload.projectId);

      const res = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        body: formData,
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const payloadJson = await res.json().catch(() => null);
        throw new Error(payloadJson?.message || `Upload failed (${res.status})`);
      }
      const json = await res.json();
      return json?.data ?? json;
    },
    update: async (id: string, data: Partial<UploadDocumentPayload> & { isPublic?: boolean }) =>
      fetchFromApi<AdminDocument>(`/documents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: async (id: string) => fetchFromApi(`/documents/${id}`, { method: 'DELETE' }),
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
