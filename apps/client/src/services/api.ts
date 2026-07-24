const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  projects: {
    getAll: async () => {
      await delay(500);
      return [
        { id: "1", name: "FitLife SEO Campaign", service: "SEO", status: "In Progress", progress: 65, startDate: "2026-06-01", estDelivery: "2026-09-01", priority: "High", team: 3 },
        { id: "2", name: "Glow E-Commerce Site", service: "Web Design", status: "In Review", progress: 90, startDate: "2026-05-15", estDelivery: "2026-07-25", priority: "Medium", team: 5 },
        { id: "3", name: "Q3 Meta Ads", service: "Ads", status: "Not Started", progress: 0, startDate: "2026-08-01", estDelivery: "2026-11-01", priority: "Low", team: 2 },
      ];
    },
    getById: async (id: string) => {
      await delay(400);
      return { id, name: "FitLife SEO Campaign", service: "SEO", status: "In Progress", progress: 65, description: "Monthly SEO retainership for FitLife Gyms focusing on local keywords and backlinking." };
    }
  },
  
  tasks: {
    getAll: async () => {
      await delay(400);
      return [
        { id: "t1", projectId: "1", title: "Keyword Research", status: "Completed", progress: 100, deadline: "2026-06-15" },
        { id: "t2", projectId: "1", title: "On-page Optimization", status: "In Progress", progress: 40, deadline: "2026-07-30" },
        { id: "t3", projectId: "2", title: "Figma UI Approvals", status: "In Review", progress: 95, deadline: "2026-07-20" },
      ];
    }
  },

  orders: {
    getAll: async () => {
      await delay(400);
      return [
        { id: "ORD-9912", service: "Web Design Starter", amount: 14999, status: "Active", paymentStatus: "Paid", date: "2026-05-10" },
        { id: "ORD-9954", service: "SEO Professional", amount: 24999, status: "Active", paymentStatus: "Recurring", date: "2026-06-01" },
      ];
    }
  },

  invoices: {
    getAll: async () => {
      await delay(400);
      return [
        { id: "INV-2026-07-1", amount: 24999, status: "Paid", dueDate: "2026-07-05", downloadUrl: "#" },
        { id: "INV-2026-08-1", amount: 24999, status: "Pending", dueDate: "2026-08-05", downloadUrl: "#" },
      ];
    }
  },

  stats: {
    getDashboard: async () => {
      await delay(300);
      return {
        activeProjects: 2,
        pendingTasks: 14,
        upcomingMeetings: 1,
        invoicesDue: 1,
        projectCompletionAvg: 77.5
      };
    }
  },

  subscription: {
    get: async () => {
      await delay(400);
      return {
        currentPlan: "Business Growth",
        rank: 2,
        highestPlan: "Enterprise",
        highestRank: 3,
        daysRemaining: 18,
        purchaseDate: "15 August 2025",
        renewalDate: "15 August 2026",
        autoRenew: true,
        billingStatus: "Active",
        paymentStatus: "Up to Date",
        supportLevel: "Priority Support",
        accountManager: "Sarah Jenkins",
        limits: {
          seo: { name: "SEO Optimization", used: 1, max: 1 },
          ads: { name: "Google Ads Campaigns", used: 2, max: 3 },
          reports: { name: "Monthly Reports", used: 4, max: 5 },
          hours: { name: "Consulting Hours", used: 3.5, max: 10 }
        },
        features: [
          "SEO Optimization",
          "Google Ads Management",
          "Website Maintenance",
          "Monthly Performance Reports",
          "Priority Email Support"
        ]
      };
    },
    upgrade: async () => {
      await delay(500);
      return { success: true, message: "Upgraded successfully" };
    },
    renew: async () => {
      await delay(500);
      return { success: true, message: "Renewed successfully" };
    }
  },

  payments: {
    getAll: async () => {
      await delay(400);
      return [
        { id: "PAY-91823", amount: 24999, method: "Visa ending in 4242", date: "2026-06-05", status: "Successful" },
        { id: "PAY-91811", amount: 14999, method: "Visa ending in 4242", date: "2026-05-10", status: "Successful" },
      ];
    }
  },

  meetings: {
    getAll: async () => {
      await delay(400);
      return [
        { id: "M-1", title: "Q3 Strategy Sync", date: "2026-08-01T10:00:00Z", duration: "45m", attendees: ["Client", "Sarah (Manager)"], status: "Upcoming", joinUrl: "#" },
        { id: "M-2", title: "Design Review", date: "2026-07-15T14:30:00Z", duration: "30m", attendees: ["Client", "Alex (Designer)"], status: "Past", joinUrl: null },
      ];
    }
  },

  notifications: {
    getAll: async () => {
      await delay(300);
      return [
        { id: "N-1", type: "system", title: "Subscription Expiring Soon", message: "Your Business Growth plan expires in 18 days.", time: "1h ago", unread: true },
        { id: "N-2", type: "report", title: "Monthly Report Available", message: "Your July SEO performance report is ready for download.", time: "2h ago", unread: true },
        { id: "N-3", type: "project", title: "Task Completed", message: "On-page Optimization is 100% complete.", time: "1d ago", unread: false },
      ];
    }
  },

  support: {
    getTickets: async () => {
      await delay(400);
      return [
        { id: "T-1044", subject: "Update billing address", status: "Resolved", date: "2026-06-20", priority: "Low" },
        { id: "T-1092", subject: "Question about Meta Ads budget", status: "Open", date: "2026-07-21", priority: "Medium" },
      ];
    }
  },

  profile: {
    get: async () => {
      await delay(300);
      return {
        companyName: "FitLife Gyms",
        gst: "22AAAAA0000A1Z5",
        email: "founder@fitlife.example",
        phone: "+91 98765 43210",
        address: "123 Fitness Avenue, Mumbai, India",
        logo: "https://ui-avatars.com/api/?name=Fit+Life&background=14B8A6&color=fff",
        theme: "dark",
        notifications: { email: true, inApp: true, sms: false }
      };
    }
  }
};
