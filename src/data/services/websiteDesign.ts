import React from "react";
import { AppWindow, Code2, Database, Layout, LayoutTemplate, MonitorSmartphone, Server, Shield, ShoppingCart, Sparkles, Layers, Search, Zap, Globe } from "lucide-react";
import type { SharedPackage, SharedStat, SharedTestimonial } from "@/types/shared";

export const websiteDesignBenefits = [
  "Responsive Design",
  "Lightning Fast",
  "SEO Optimized",
  "Secure & Scalable",
  "Modern UI/UX",
];

export const websiteDesignStats: SharedStat[] = [
  {
    id: "wd-stat-1",
    title: "Modern Design",
    description: "Premium SaaS Look",
    icon: Layout,
  },
  {
    id: "wd-stat-2",
    title: "Fast Performance",
    description: "Sub-second Load Times",
    icon: Zap,
  },
  {
    id: "wd-stat-3",
    title: "SEO Ready",
    description: "Rank Higher on Google",
    icon: Search,
  },
  {
    id: "wd-stat-4",
    title: "Mobile Responsive",
    description: "Looks Great on All Devices",
    icon: MonitorSmartphone,
  },
  {
    id: "wd-stat-5",
    title: "Secure Hosting",
    description: "Protected Against Threats",
    icon: Shield,
  },
];

export type WebsiteService = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  startingPrice: string;
};

export const websiteServices: WebsiteService[] = [
  {
    id: "ws-1",
    title: "Business Websites",
    description: "Professional websites to represent your business online.",
    icon: LayoutTemplate,
    startingPrice: "14,999",
  },
  {
    id: "ws-2",
    title: "E-Commerce Websites",
    description: "Powerful online stores that convert visitors into customers.",
    icon: ShoppingCart,
    startingPrice: "24,999",
  },
  {
    id: "ws-3",
    title: "Landing Pages",
    description: "High-converting landing pages for campaigns and offers.",
    icon: Sparkles,
    startingPrice: "7,999",
  },
  {
    id: "ws-4",
    title: "Portfolio Websites",
    description: "Showcase your work with beautiful portfolio websites.",
    icon: AppWindow,
    startingPrice: "12,999",
  },
  {
    id: "ws-5",
    title: "Blog / News Websites",
    description: "SEO-friendly blog websites to grow your audience.",
    icon: Globe,
    startingPrice: "9,999",
  },
];

export const websitePackages: SharedPackage[] = [
  {
    id: "wd-pkg-1",
    name: "Starter",
    audience: "For Small Businesses",
    priceMonthly: 14999,
    priceYearly: 14999,
    currency: "INR",
    buttonText: "Choose Starter",
    buttonLink: "/contact?service=website-starter",
    features: [
      "Up to 5 Pages",
      "Mobile Responsive",
      "Basic SEO Setup",
      "Contact Form",
      "1 Month Free Support",
    ],
  },
  {
    id: "wd-pkg-2",
    name: "Professional",
    audience: "For Growing Companies",
    priceMonthly: 24999,
    priceYearly: 24999,
    currency: "INR",
    isPopular: true,
    badge: "Most Popular",
    buttonText: "Choose Professional",
    buttonLink: "/contact?service=website-professional",
    features: [
      "Up to 10 Pages",
      "Custom UI/UX Design",
      "Advanced SEO",
      "CMS Integration",
      "Speed Optimization",
      "3 Months Free Support",
    ],
  },
  {
    id: "wd-pkg-3",
    name: "E-Commerce",
    audience: "For Online Stores",
    priceMonthly: 39999,
    priceYearly: 39999,
    currency: "INR",
    buttonText: "Choose E-Commerce",
    buttonLink: "/contact?service=website-ecommerce",
    features: [
      "Unlimited Products",
      "Payment Gateway Integration",
      "Inventory Management",
      "Order Tracking",
      "User Accounts",
      "6 Months Free Support",
    ],
  },
  {
    id: "wd-pkg-4",
    name: "Enterprise",
    audience: "Custom Web Applications",
    priceMonthly: null,
    priceYearly: null,
    currency: "INR",
    buttonText: "Talk to Sales",
    buttonLink: "/contact?service=website-enterprise",
    features: [
      "Custom Next.js App",
      "Complex Integrations",
      "Scalable Architecture",
      "Dedicated Server Setup",
      "High Availability",
      "24/7 Priority Support",
    ],
  },
];

export const websiteProjects = [
  {
    id: "wp-1",
    title: "FitLife Gym",
    category: "Fitness Website",
    technologies: ["Next.js", "Tailwind CSS"],
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    link: "#",
  },
  {
    id: "wp-2",
    title: "Glow Skincare",
    category: "E-Commerce Website",
    technologies: ["React", "Shopify"],
    thumbnail: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
    link: "#",
  },
  {
    id: "wp-3",
    title: "Brainy Kids",
    category: "Educational Website",
    technologies: ["Next.js", "Prisma"],
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    link: "#",
  },
  {
    id: "wp-4",
    title: "Interior Studio",
    category: "Portfolio Website",
    technologies: ["React", "Framer Motion"],
    thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80",
    link: "#",
  },
  {
    id: "wp-5",
    title: "TechNova",
    category: "SaaS Website",
    technologies: ["Next.js", "Tailwind CSS"],
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    link: "#",
  },
  {
    id: "wp-6",
    title: "FinServe",
    category: "Corporate Website",
    technologies: ["React", "Node.js"],
    thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80",
    link: "#",
  },
];

export const websiteTestimonials: SharedTestimonial[] = [
  {
    id: "wt-1",
    name: "Rohit Sharma",
    role: "CEO, FitLife Gym",
    quote: "GrowMate built a stunning website for our business. The team was professional, responsive and delivered beyond our expectations.",
    rating: 5,
  },
  {
    id: "wt-2",
    name: "Neha Gupta",
    role: "Founder, Glow Skincare",
    quote: "Our new e-commerce store is blazing fast and the conversion rates have doubled since the launch. Highly recommended!",
    rating: 5,
  },
  {
    id: "wt-3",
    name: "Arjun Desai",
    role: "Director, TechNova",
    quote: "The SaaS landing page they designed is modern and perfectly aligned with our brand. The codebase is also incredibly clean.",
    rating: 5,
  },
];

export const technologiesData = [
  { id: "tech-1", name: "React", icon: Code2, description: "UI Library", color: "#61DAFB" },
  { id: "tech-2", name: "Next.js", icon: Layers, description: "React Framework", color: "#FFFFFF" },
  { id: "tech-3", name: "TypeScript", icon: Code2, description: "Type Safety", color: "#3178C6" },
  { id: "tech-4", name: "Node.js", icon: Server, description: "Backend Runtime", color: "#339933" },
  { id: "tech-5", name: "PostgreSQL", icon: Database, description: "Relational DB", color: "#336791" },
  { id: "tech-6", name: "Tailwind CSS", icon: Layout, description: "Styling", color: "#38B2AC" },
  { id: "tech-7", name: "Framer Motion", icon: Sparkles, description: "Animations", color: "#E902B5" },
  { id: "tech-8", name: "Vercel", icon: Globe, description: "Hosting", color: "#FFFFFF" },
];
