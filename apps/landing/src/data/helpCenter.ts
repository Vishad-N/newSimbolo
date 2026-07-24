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
    link: "#"
  },
  {
    id: "qa-4",
    title: "Billing & Payments",
    description: "Invoices and payment help.",
    icon: CreditCard,
    link: "#"
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

export const helpCategories = [
  {
    id: "hc-1",
    title: "Website Design",
    articleCount: 12,
    icon: MonitorPlay,
    link: "#"
  },
  {
    id: "hc-2",
    title: "E-Commerce",
    articleCount: 15,
    icon: ShoppingCart,
    link: "#"
  },
  {
    id: "hc-3",
    title: "Mobile Apps",
    articleCount: 8,
    icon: Smartphone,
    link: "#"
  },
  {
    id: "hc-4",
    title: "Digital Marketing",
    articleCount: 20,
    icon: TrendingUp,
    link: "#"
  },
  {
    id: "hc-5",
    title: "Graphic Design",
    articleCount: 10,
    icon: Palette,
    link: "#"
  },
  {
    id: "hc-6",
    title: "Video Editing",
    articleCount: 7,
    icon: Video,
    link: "#"
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

export const knowledgeBaseArticles = [
  {
    id: "kb-1",
    title: "How to choose Shopify vs WooCommerce",
    readTime: "5 min read",
    category: "E-Commerce",
    icon: ShoppingCart,
    link: "#"
  },
  {
    id: "kb-2",
    title: "Website Planning Checklist",
    readTime: "4 min read",
    category: "Website Design",
    icon: FileCheck,
    link: "#"
  },
  {
    id: "kb-3",
    title: "Preparing Content Before Development",
    readTime: "6 min read",
    category: "Content",
    icon: PenTool,
    link: "#"
  },
  {
    id: "kb-4",
    title: "Branding Checklist",
    readTime: "3 min read",
    category: "Graphic Design",
    icon: Palette,
    link: "#"
  },
  {
    id: "kb-5",
    title: "SEO Basics",
    readTime: "7 min read",
    category: "Digital Marketing",
    icon: Search,
    link: "#"
  },
  {
    id: "kb-6",
    title: "How Project Milestones Work",
    readTime: "4 min read",
    category: "Project Management",
    icon: CheckSquare,
    link: "#"
  }
];

export const clientResources = [
  {
    id: "cr-1",
    title: "Website Requirement Template",
    icon: FileCheck,
    link: "#"
  },
  {
    id: "cr-2",
    title: "Brand Questionnaire",
    icon: PenTool,
    link: "#"
  },
  {
    id: "cr-3",
    title: "Logo Checklist",
    icon: Palette,
    link: "#"
  },
  {
    id: "cr-4",
    title: "SEO Checklist",
    icon: Search,
    link: "#"
  },
  {
    id: "cr-5",
    title: "Content Checklist",
    icon: CheckSquare,
    link: "#"
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
