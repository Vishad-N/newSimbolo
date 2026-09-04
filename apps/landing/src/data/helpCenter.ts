import {
  MessageSquareText,
  CalendarDays,
  Activity,
  CreditCard,
  FileSignature,
  Building2,
  MonitorPlay,
  ShoppingCart,
  Smartphone,
  TrendingUp,
  Palette,
  Video,
  FileCheck,
  Search,
  PenTool,
  CheckSquare,
  Rocket,
  Star,
  Clock,
  Headphones
} from "lucide-react";
import type { SeoFaq } from "@/types/seo";
import type { SharedResult } from "@/types/shared";

// Maps a Help Center category label onto one of ContactForm's fixed "Service of
// Interest" options, so a topic link that forwards to /contact can prefill it
// where a real match exists instead of guessing.
const CONTACT_SERVICE_BY_CATEGORY: Record<string, string> = {
  "Website Design": "Website Design",
  "E-Commerce": "Ecommerce",
  "Graphic Design": "Graphic Design",
  "Video Editing": "Video Editing",
};

export function contactServiceForCategory(category: string): string {
  return CONTACT_SERVICE_BY_CATEGORY[category] || "";
}

// The client dashboard is a separate app; cross-app links to it (e.g. "Track My
// Project") go through this base URL, same pattern as the login redirect in
// components/auth/auth-modals.tsx.
const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3002";

export const popularSearches = [
  "Shopify",
  "Website Design",
  "Digital Marketing",
  "Video Editing",
  "Payments",
  "Quotes",
];

export const quickActions = [
  {
    id: "qa-1",
    title: "Contact Support",
    description: "Talk directly with our team.",
    icon: MessageSquareText,
    link: "/contact"
  },
  {
    id: "qa-2",
    title: "Book Free Consultation",
    description: "Schedule a free strategy call.",
    icon: CalendarDays,
    link: "/contact?type=consultation"
  },
  {
    id: "qa-3",
    title: "Track My Project",
    description: "Check project progress.",
    icon: Activity,
    link: `${DASHBOARD_URL}/projects`
  },
  {
    id: "qa-4",
    title: "Billing & Payments",
    description: "Invoices and payment help.",
    icon: CreditCard,
    link: `${DASHBOARD_URL}/payments`
  },
  {
    id: "qa-5",
    title: "Request Custom Quote",
    description: "Get pricing based on your requirements.",
    icon: FileSignature,
    link: "/contact?type=quote"
  },
  {
    id: "qa-6",
    title: "Contact Sales",
    description: "Need something bigger? Let's talk.",
    icon: Building2,
    link: "/contact?type=sales"
  }
];

// No dedicated per-category link: clicking a category filters the Knowledge Base
// below instead (see HelpCategories/KnowledgeBase), so there is nothing here to
// link to that doesn't already exist on the page.
export const helpCategories = [
  {
    id: "hc-1",
    title: "Website Design",
    articleCount: 12,
    icon: MonitorPlay,
  },
  {
    id: "hc-2",
    title: "E-Commerce",
    articleCount: 15,
    icon: ShoppingCart,
  },
  {
    id: "hc-3",
    title: "Mobile Apps",
    articleCount: 8,
    icon: Smartphone,
  },
  {
    id: "hc-4",
    title: "Digital Marketing",
    articleCount: 20,
    icon: TrendingUp,
  },
  {
    id: "hc-5",
    title: "Graphic Design",
    articleCount: 10,
    icon: Palette,
  },
  {
    id: "hc-6",
    title: "Video Editing",
    articleCount: 7,
    icon: Video,
  }
];

export const workflowSteps = [
  "Consultation",
  "Requirement Analysis",
  "Proposal",
  "Design",
  "Development",
  "Testing",
  "Launch",
  "Support"
];

export const helpFaqs: SeoFaq[] = [
  {
    id: "faq-1",
    question: "How does pricing work?",
    answer: "Our pricing varies based on the scope and complexity of your project. We offer fixed-price packages for standard services and custom quotes for enterprise requirements."
  },
  {
    id: "faq-2",
    question: "How long does a project take?",
    answer: "Project timelines depend on the service. A basic website might take 2 weeks, while a complex e-commerce store or mobile app can take 2-3 months."
  },
  {
    id: "faq-3",
    question: "Do you sign NDAs?",
    answer: "Yes, we respect your privacy and intellectual property. We are happy to sign a Non-Disclosure Agreement before discussing any sensitive project details."
  },
  {
    id: "faq-4",
    question: "How many revisions are included?",
    answer: "Most of our design and development packages include 2-3 rounds of revisions to ensure you are completely satisfied with the final output."
  },
  {
    id: "faq-5",
    question: "Do you provide maintenance?",
    answer: "Yes, we offer ongoing maintenance and support retainers to keep your website, app, or marketing campaigns running smoothly post-launch."
  },
  {
    id: "faq-6",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, Wire Transfers, and UPI (for clients in India)."
  },
  {
    id: "faq-7",
    question: "Can you redesign an existing website?",
    answer: "Absolutely. We specialize in revamping outdated websites with modern, responsive, and conversion-optimized designs."
  },
  {
    id: "faq-8",
    question: "Can I track project progress?",
    answer: "Yes, upon project kickoff, you will receive access to a dedicated client portal where you can track milestones, view drafts, and communicate with the team."
  }
];

// No individual article pages exist yet, so "Read Article" forwards to /contact
// with the topic pre-filled instead of pointing at a dead "#" (see KnowledgeBase).
export const knowledgeBaseArticles = [
  {
    id: "kb-1",
    title: "How to choose Shopify vs WooCommerce",
    readTime: "5 min read",
    category: "E-Commerce",
    icon: ShoppingCart,
  },
  {
    id: "kb-2",
    title: "Website Planning Checklist",
    readTime: "4 min read",
    category: "Website Design",
    icon: FileCheck,
  },
  {
    id: "kb-3",
    title: "Preparing Content Before Development",
    readTime: "6 min read",
    category: "Content",
    icon: PenTool,
  },
  {
    id: "kb-4",
    title: "Branding Checklist",
    readTime: "3 min read",
    category: "Graphic Design",
    icon: Palette,
  },
  {
    id: "kb-5",
    title: "SEO Basics",
    readTime: "7 min read",
    category: "Digital Marketing",
    icon: Search,
  },
  {
    id: "kb-6",
    title: "How Project Milestones Work",
    readTime: "4 min read",
    category: "Project Management",
    icon: CheckSquare,
  }
];

// No downloadable files are hosted yet, so each resource forwards to /contact
// with the request pre-filled instead of pointing at a dead "#" (see ClientResources).
export const clientResources = [
  {
    id: "cr-1",
    title: "Website Requirement Template",
    icon: FileCheck,
  },
  {
    id: "cr-2",
    title: "Brand Questionnaire",
    icon: PenTool,
  },
  {
    id: "cr-3",
    title: "Logo Checklist",
    icon: Palette,
  },
  {
    id: "cr-4",
    title: "SEO Checklist",
    icon: Search,
  },
  {
    id: "cr-5",
    title: "Content Checklist",
    icon: CheckSquare,
  }
];

export const footerTrustStats: SharedResult[] = [
  {
    id: "ft-1",
    label: "Projects Delivered",
    value: "250+",
    icon: Rocket,
  },
  {
    id: "ft-2",
    label: "Client Satisfaction",
    value: "98%",
    icon: Star,
  },
  {
    id: "ft-3",
    label: "Average Response Time",
    value: "30 min",
    icon: Clock,
  },
  {
    id: "ft-4",
    label: "Support Availability",
    value: "24/7",
    icon: Headphones,
  }
];
