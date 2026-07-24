import { Award, Headphones, ShieldCheck, Sparkles, Star } from "lucide-react";
import type { SeoApproachStep, SeoFaq, SeoMetric, SeoResultMetric, SeoTestimonial } from "@/types/seo";

export const heroBenefits = ["Higher Rankings", "More Organic Traffic", "Better Conversions", "Long-Term Growth"];

export const seoMetrics: SeoMetric[] = [
  { id: "projects", value: "500+", label: "Projects Completed", icon: Star },
  { id: "satisfaction", value: "98%", label: "Client Satisfaction", icon: Sparkles },
  { id: "ranked", value: "Top Ranked", label: "By Industry Experts", icon: Award },
  { id: "white-hat", value: "100%", label: "White Hat SEO", icon: ShieldCheck },
  { id: "support", value: "24/7", label: "Support & Reporting", icon: Headphones },
];

export const approachSteps: SeoApproachStep[] = [
  { id: "audit", title: "Audit & Analysis", description: "We analyze your website and competitors." },
  { id: "planning", title: "Strategy & Planning", description: "Customized SEO roadmap for your goals." },
  { id: "implementation", title: "Implementation", description: "We optimize and build authority." },
  { id: "optimization", title: "Track & Improve", description: "Continuous monitoring for best results." },
];

export const resultMetrics: SeoResultMetric[] = [
  { id: "traffic", value: 230, suffix: "%", label: "Increase in Organic Traffic" },
  { id: "leads", value: 180, suffix: "%", label: "Increase in Leads" },
  { id: "conversions", value: 150, suffix: "%", label: "Increase in Conversions" },
  { id: "retention", value: 90, suffix: "%", label: "Client Retention" },
];

export const testimonials: SeoTestimonial[] = [
  {
    id: "rohit-sharma",
    quote: "The Simbolo's SEO strategy took our website from page 5 to page 1 on Google. Our traffic and leads increased significantly within months.",
    name: "Dr. Rohit Sharma",
    role: "Skin Clinic, Delhi",
    rating: 5,
  },
  {
    id: "nisha-mehta",
    quote: "Their reporting was clear, the plan was practical, and our local rankings improved faster than expected.",
    name: "Nisha Mehta",
    role: "Retail Founder, Mumbai",
    rating: 5,
  },
];

export const seoFaqs: SeoFaq[] = [
  {
    id: "timeline",
    question: "How long does SEO take to show results?",
    answer: "Most websites begin seeing movement within 8 to 12 weeks, with stronger gains building over 4 to 6 months depending on competition and site health.",
  },
  {
    id: "reports",
    question: "Will I receive SEO reports?",
    answer: "Yes. Every package includes transparent reporting with keyword movement, traffic, completed work, and next actions.",
  },
  {
    id: "local",
    question: "Do you handle local SEO?",
    answer: "Yes. We optimize location pages, Google Business Profile signals, local keywords, citations, and review growth workflows.",
  },
  {
    id: "custom",
    question: "Can the SEO package be customized?",
    answer: "Yes. The UI is already structured around mock data so package content can later come from the service APIs without changing the page components.",
  },
];
