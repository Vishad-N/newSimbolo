const fetchProxy = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`/api/proxy/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (res.status === 401) {
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/checkout')) {
      const loginUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3002?auth=login' 
        : 'https://simbolo.co?auth=login';
      window.location.href = loginUrl;
      // return a never resolving promise to prevent further execution during redirect
      return new Promise(() => {});
    }
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
};

export const mockApi = {
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
      if (!res.activeSubscription) return null;
      
      const sub = res.activeSubscription;
      const end = new Date(sub.currentPeriodEnd);
      const now = new Date();
      const diffTime = Math.abs(end.getTime() - now.getTime());
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
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
    upgrade: async () => {
      return { success: true, message: "Upgrade request sent successfully" };
    },
    renew: async () => {
      return { success: true, message: "Renewal request sent successfully" };
    }
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
      const res = await fetchProxy(`users/me`);
      const profile = res.clientProfile || {};
      return {
        id: res.id,
        clientId: profile.id,
        firstName: res.firstName || "",
        lastName: res.lastName || "",
        companyName: profile.company?.name || "",
        legalName: profile.company?.legalName || profile.legalName || "",
        gst: profile.company?.gstNumber || profile.gstNumber || "",
        email: res.email,
        phone: profile.phone || "",
        address: profile.company?.address || profile.billingAddress || "",
        state: profile.state || profile.company?.state || "",
        stateCode: profile.stateCode || profile.company?.stateCode || "",
        logo: res.avatarUrl || `https://ui-avatars.com/api/?name=${res.firstName}+${res.lastName}&background=14B8A6&color=fff`,
        theme: "dark",
        notifications: { email: true, inApp: true, sms: false }
      };
    },
    update: async (data: any) => {
      const res = await fetchProxy(`profiles/client`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return res;
    }
  }
};
