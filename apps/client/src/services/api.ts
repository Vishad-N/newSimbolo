const DEFAULT_LANDING_URL = process.env.NODE_ENV === 'production' ? 'https://simbolo.ai' : 'http://localhost:3000';

export class AuthenticationRedirectError extends Error {
  constructor(public readonly redirectUrl: string) {
    super('Authentication is required');
    this.name = 'AuthenticationRedirectError';
  }
}

export interface ClientSubscription {
  packageId?: string;
  currentPlan: string;
  daysRemaining: number;
  billingStatus: string;
}

export interface ClientProfileUpdate {
  countryCode?: string;
  phone?: string;
  gstNumber?: string;
  billingAddress?: string;
  stateCode?: string;
  timezone?: string;
  companyId?: string;
}

export function splitStoredPhone(countryCode?: string, phone?: string) {
  const phoneDigits = (phone || "").replace(/\D/g, "");
  if (phoneDigits.length > 10) {
    return {
      countryCode: countryCode || `+${phoneDigits.slice(0, -10)}`,
      phone: phoneDigits.slice(-10),
    };
  }
  return { countryCode: countryCode || "+91", phone: phoneDigits };
}

export const isSubscriptionExpired = (subscription: ClientSubscription) => (
  subscription.daysRemaining <= 0 ||
  ['PAST_DUE', 'CANCELED', 'UNPAID'].includes(subscription.billingStatus)
);

export const getLandingPageUrl = (
  pathname = '/',
  searchParams?: Record<string, string>,
) => {
  const configuredLandingUrl = process.env.NEXT_PUBLIC_LANDING_URL?.trim() || DEFAULT_LANDING_URL;
  let landingBaseUrl: URL;

  try {
    landingBaseUrl = new URL(configuredLandingUrl);
  } catch (error) {
    console.error('Invalid NEXT_PUBLIC_LANDING_URL; using the default landing URL.', error);
    landingBaseUrl = new URL(DEFAULT_LANDING_URL);
  }

  const landingUrl = new URL(pathname, landingBaseUrl);

  Object.entries(searchParams || {}).forEach(([key, value]) => {
    landingUrl.searchParams.set(key, value);
  });

  return landingUrl.toString();
};

export const redirectToLanding = (pathname = '/', searchParams?: Record<string, string>) => {
  const redirectUrl = getLandingPageUrl(pathname, searchParams);
  window.location.replace(redirectUrl);
  return redirectUrl;
};

const fetchProxy = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`/api/proxy/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      // Previously /checkout was excluded from this redirect, which meant an
      // unauthenticated (or session-expired) visit there just failed silently
      // instead of prompting login — landing's auth-modals now reads
      // `returnUrl` and sends the user straight back here after signing in,
      // so there is no more reason to special-case this path.
      const redirectUrl = redirectToLanding('/', {
        auth: 'login',
        returnUrl: window.location.href,
      });
      throw new AuthenticationRedirectError(redirectUrl);
    }
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const json = await res.json();
  // The backend's global TransformInterceptor wraps every response in
  // { success, message, data }. Unwrap it here, once, so every caller gets the
  // real payload directly — otherwise a paginated endpoint's own { data, meta }
  // shape ends up double-nested and callers' `res.data || res` unwrap a page
  // object instead of the actual array.
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    return json.data;
  }
  return json;
};

/**
 * Error carrying the backend HTTP status and its `{ statusCode, message, error }` message,
 * so callers can distinguish a 404 (no affiliate profile) from a 400 (validation failure)
 * and render the backend's own validation copy.
 */
export class ApiRequestError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

/** Like fetchProxy, but rejects with an ApiRequestError that preserves status + backend message. */
const fetchProxyDetailed = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`/api/proxy/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const rawMessage = (payload as { message?: string | string[] } | null)?.message;
    const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
    throw new ApiRequestError(res.status, message || `API error: ${res.status}`);
  }

  return (payload as { data?: unknown })?.data ?? payload;
};

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
export type PayoutMethodType = 'BANK_ACCOUNT' | 'UPI';
export type PayoutMethodStatus = 'PENDING' | 'VERIFIED' | 'DISABLED';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AffiliateProfile {
  id: string;
  affiliateCode: string;
  status: AffiliateStatus;
  commissionRate: number;
  isEligibleForCommission: boolean;
  createdAt: string;
}

export interface AffiliateSale {
  orderId: string;
  orderNumber: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface AffiliateCommission {
  id: string;
  orderId: string;
  commissionAmount: number;
  commissionRate: number;
  status: CommissionStatus;
  eligibleAt: string | null;
  creditedAt: string | null;
  createdAt: string;
}

export interface AffiliateWallet {
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarned: number;
  lifetimeWithdrawn: number;
}

export interface AffiliateWalletTransaction {
  id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export interface AffiliateWithdrawal {
  id: string;
  amount: number;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt: string | null;
  failureReason: string | null;
}

export interface AffiliatePayoutMethod {
  id: string;
  type: PayoutMethodType;
  isDefault: boolean;
  status: PayoutMethodStatus;
  maskedDetails: string;
  last4?: string;
}

export interface CreatePayoutMethodPayload {
  type: PayoutMethodType;
  accountNumber?: string;
  ifsc?: string;
  upiId?: string;
  isDefault?: boolean;
}

const emptyPage = <T,>(pageSize: number): Paginated<T> => ({ items: [], total: 0, page: 1, pageSize });

/**
 * Backend list endpoints return `{ data, meta: { total, page, limit, totalPages } }`
 * (this codebase's existing pagination convention) rather than a flat
 * `{ items, total, page, pageSize }` shape — normalize both here.
 */
const toPage = <T,>(res: unknown, pageSize: number): Paginated<T> => {
  const payload = res as
    | (Partial<Paginated<T>> & { data?: T[]; meta?: { total?: number; page?: number; limit?: number } })
    | T[]
    | null;
  if (Array.isArray(payload)) {
    return { items: payload, total: payload.length, page: 1, pageSize };
  }
  if (!payload) return emptyPage<T>(pageSize);
  if (payload.items) {
    return {
      items: payload.items,
      total: payload.total ?? payload.items.length,
      page: payload.page ?? 1,
      pageSize: payload.pageSize ?? pageSize,
    };
  }
  if (payload.data) {
    return {
      items: payload.data,
      total: payload.meta?.total ?? payload.data.length,
      page: payload.meta?.page ?? 1,
      pageSize: payload.meta?.limit ?? pageSize,
    };
  }
  return emptyPage<T>(pageSize);
};

const pageQuery = (page: number, pageSize: number) => `page=${page}&limit=${pageSize}`;

export const affiliateApi = {
  getProfile: async (): Promise<AffiliateProfile> =>
    (await fetchProxyDetailed('affiliate/me')) as AffiliateProfile,

  getSales: async (page = 1, pageSize = 10) =>
    toPage<AffiliateSale>(await fetchProxyDetailed(`affiliate/me/sales?${pageQuery(page, pageSize)}`), pageSize),

  getCommissions: async (page = 1, pageSize = 10) =>
    toPage<AffiliateCommission>(
      await fetchProxyDetailed(`affiliate/me/commissions?${pageQuery(page, pageSize)}`),
      pageSize,
    ),

  getWallet: async (): Promise<AffiliateWallet> =>
    (await fetchProxyDetailed('affiliate/me/wallet')) as AffiliateWallet,

  getWalletTransactions: async (page = 1, pageSize = 10) =>
    toPage<AffiliateWalletTransaction>(
      await fetchProxyDetailed(`affiliate/me/wallet/transactions?${pageQuery(page, pageSize)}`),
      pageSize,
    ),

  getWithdrawals: async (page = 1, pageSize = 10) =>
    toPage<AffiliateWithdrawal>(
      await fetchProxyDetailed(`affiliate/me/withdrawals?${pageQuery(page, pageSize)}`),
      pageSize,
    ),

  requestWithdrawal: async (amount: number): Promise<AffiliateWithdrawal> =>
    (await fetchProxyDetailed('affiliate/me/withdrawals', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })) as AffiliateWithdrawal,

  getPayoutMethods: async (): Promise<AffiliatePayoutMethod[]> => {
    const res = (await fetchProxyDetailed('affiliate/me/payout-methods')) as
      | { items?: AffiliatePayoutMethod[] }
      | AffiliatePayoutMethod[]
      | null;
    if (Array.isArray(res)) return res;
    return res?.items || [];
  },

  createPayoutMethod: async (payload: CreatePayoutMethodPayload) =>
    fetchProxyDetailed('affiliate/me/payout-methods', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  setDefaultPayoutMethod: async (id: string) =>
    fetchProxyDetailed(`affiliate/me/payout-methods/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isDefault: true }),
    }),

  deletePayoutMethod: async (id: string) =>
    fetchProxyDetailed(`affiliate/me/payout-methods/${id}`, { method: 'DELETE' }),
};

export const mockApi = {
  affiliate: affiliateApi,

  projects: {
    getAll: async (clientId?: string) => {
      if (!clientId) return [];
      const res = await fetchProxy(`projects?clientId=${clientId}`);
      return res.data || res || [];
    },
    getById: async (id: string) => {
      const res = await fetchProxy(`projects/${id}`);
      return res;
    }
  },
  
  tasks: {
    getAll: async (clientId?: string) => {
      if (!clientId) return [];
      const res = await fetchProxy(`tasks?clientId=${clientId}`);
      return res.data || res || [];
    }
  },

  orders: {
    getAll: async (clientId?: string) => {
      if (!clientId) return [];
      const res = await fetchProxy(`orders?clientId=${clientId}`);
      return res.data || res || [];
    }
  },

  invoices: {
    getAll: async () => {
      // Invoices for current user
      const res = await fetchProxy(`invoices/my`);
      return res.data || res || [];
    },
    downloadPdf: async (invoiceId: string) => {
      const res = await fetch(`/api/proxy/invoices/${invoiceId}/pdf`, {
        method: 'GET'
      });
      if (!res.ok) throw new Error('Failed to download invoice PDF');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  },

  documents: {
    getAll: async () => {
      // Documents for current user (own ClientProfile only, enforced server-side)
      const res = await fetchProxy(`documents/my`);
      return res.data || res || [];
    },
    trackDownload: async (documentId: string) => {
      await fetchProxy(`documents/${documentId}/download`, { method: 'POST' });
    },
    upload: async (file: File, title: string) => {
      // Deliberately bypasses fetchProxy: it always sets Content-Type: application/json,
      // which would break the multipart boundary the browser needs to generate for
      // FormData — the browser sets the correct multipart Content-Type itself as
      // long as we don't set one manually here.
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      const res = await fetch('/api/proxy/documents/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message || 'Failed to upload document');
      }
      return res.json();
    },
  },

  stats: {
    getDashboard: async (clientId?: string) => {
      if (!clientId) return null;
      const res = await fetchProxy(`dashboard/client/${clientId}`);
      return {
        activeProjects: res.metrics?.activeProjects || 0,
        pendingTasks: res.metrics?.pendingDeliverables || 0, // Maps deliverables to tasks
        upcomingMeetings: res.metrics?.upcomingMeetings || 0,
        invoicesDue: res.metrics?.openTickets || 0, // Using tickets for now as per dashboard mapping
        projectCompletionAvg: 0 // Can be calculated if needed
      };
    }
  },

  subscription: {
    get: async (clientId?: string) => {
      if (!clientId) return null;
      const res = await fetchProxy(`dashboard/client/${clientId}/billing`);
      const billingDashboard = res.data || res;
      if (!billingDashboard.activeSubscription) return null;
      
      const sub = billingDashboard.activeSubscription;
      const end = new Date(sub.currentPeriodEnd);
      const now = new Date();
      const diffTime = end.getTime() - now.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        id: sub.id,
        packageId: sub.package?.id,
        currentPlan: sub.package?.name || "Standard Plan",
        rank: sub.package?.type === 'MONTHLY' ? 1 : 2,
        highestPlan: "Enterprise",
        highestRank: 3,
        daysRemaining: daysRemaining,
        purchaseDate: new Date(sub.createdAt).toLocaleDateString(),
        renewalDate: new Date(sub.currentPeriodEnd).toLocaleDateString(),
        autoRenew: sub.status === 'ACTIVE',
        billingStatus: sub.status,
        paymentStatus: "Up to Date",
        supportLevel: "Priority Support",
        accountManager: "Assigned Agent",
        limits: {
          projects: { name: "Active Projects", used: 0, max: 10 },
        },
        features: [
          "Priority Support",
          "Dedicated Manager",
          "Custom Reports"
        ]
      };
    },
  },

  payments: {
    getAll: async () => {
      // Endpoint doesn't need clientId since it's /payments/my
      const res = await fetchProxy(`payments/my`);
      return res.data || res || [];
    }
  },

  meetings: {
    getAll: async (clientId?: string) => {
      if (!clientId) return [];
      const res = await fetchProxy(`meetings?clientId=${clientId}`);
      return res.data || res || [];
    }
  },

  notifications: {
    getAll: async () => {
      // Wait, backend notifications usually use the logged in user ID
      const res = await fetchProxy(`notifications`);
      return res.data || res || [];
    }
  },

  support: {
    getTickets: async () => {
      // Backend does not have tickets yet. Return empty array for now.
      return [];
    }
  },

  profile: {
    get: async () => {
      const response = await fetchProxy(`users/me`);
      const res = response.data || response;
      const profile = res.clientProfile || {};
      const normalizedPhone = splitStoredPhone(res.countryCode, res.phone);
      return {
        id: res.id,
        clientId: profile.id,
        firstName: res.firstName || "",
        lastName: res.lastName || "",
        companyName: profile.company?.name || "",
        legalName: profile.company?.legalName || profile.legalName || "",
        gst: profile.company?.gstNumber || profile.gstNumber || "",
        email: res.email,
        countryCode: normalizedPhone.countryCode,
        phone: normalizedPhone.phone,
        address: profile.company?.address || profile.billingAddress || "",
        state: profile.state || profile.company?.state || "",
        stateCode: profile.stateCode || profile.company?.stateCode || "",
        logo: res.avatarUrl || `https://ui-avatars.com/api/?name=${res.firstName}+${res.lastName}&background=14B8A6&color=fff`,
        theme: "dark",
        notifications: { email: true, inApp: true, sms: false }
      };
    },
    update: async (data: ClientProfileUpdate) => {
      const profileData = {
        gstNumber: data.gstNumber || undefined,
        billingAddress: data.billingAddress || undefined,
        stateCode: data.stateCode || undefined,
        timezone: data.timezone,
        companyId: data.companyId,
      };
      const requests: Promise<unknown>[] = [fetchProxy(`profiles/client`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      })];

      if (data.phone !== undefined || data.countryCode !== undefined) {
        requests.push(fetchProxy(`users/me`, {
          method: 'PUT',
          body: JSON.stringify({ countryCode: data.countryCode, phone: data.phone }),
        }));
      }

      return Promise.all(requests);
    }
  }
};
