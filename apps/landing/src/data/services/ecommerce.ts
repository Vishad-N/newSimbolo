import React from "react";
import { Code2, Database, Layout, Server, Shield, ShoppingCart, Sparkles, Layers, Search, Zap, Globe, Store, Package, Smartphone, CreditCard } from "lucide-react";
import type { SharedPackage, SharedStat, SharedTestimonial, SharedResult } from "@/types/shared";

export const ecommerceBenefits = [
  "Shopify Experts",
  "WooCommerce",
  "Fast Performance",
  "Secure Payments",
];

export const ecommerceStats: SharedStat[] = [
  {
    id: "ec-stat-1",
    title: "Shopify Experts",
    description: "Certified Partners",
    icon: ShoppingCart,
  },
  {
    id: "ec-stat-2",
    title: "Lightning Fast",
    description: "Optimized Performance",
    icon: Zap,
  },
  {
    id: "ec-stat-3",
    title: "Mobile First",
    description: "Responsive Design",
    icon: Smartphone,
  },
  {
    id: "ec-stat-4",
    title: "Secure Checkout",
    description: "Payment Integration",
    icon: Shield,
  },
  {
    id: "ec-stat-5",
    title: "SEO Optimized",
    description: "Built for Rankings",
    icon: Search,
  },
];

export const ecommerceResults: SharedResult[] = [
  {
    id: "ec-res-1",
    label: "Stores Delivered",
    value: "150+",
    icon: Store,
  },
  {
    id: "ec-res-2",
    label: "Client Satisfaction",
    value: "98%",
    icon: Sparkles,
  },
  {
    id: "ec-res-3",
    label: "Revenue Generated",
    value: "₹100Cr+",
    icon: Package,
  },
  {
    id: "ec-res-4",
    label: "Support",
    value: "24/7",
    icon: Shield,
  },
];

export type EcommerceService = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  startingPrice?: string;
};

export const ecommerceServices: EcommerceService[] = [
  {
    id: "ecs-1",
    title: "Shopify Development",
    description: "Custom Shopify themes and apps for scalable stores.",
    icon: ShoppingCart,
  },
  {
    id: "ecs-2",
    title: "WooCommerce Development",
    description: "Flexible e-commerce solutions using WordPress.",
    icon: Store,
  },
  {
    id: "ecs-3",
    title: "Custom React Store",
    description: "High-performance bespoke stores using React & Next.js.",
    icon: Code2,
  },
  {
    id: "ecs-4",
    title: "Headless Commerce",
    description: "Decoupled architecture for blazing fast speed.",
    icon: Zap,
  },
  {
    id: "ecs-5",
    title: "Magento Development",
    description: "Enterprise-grade e-commerce solutions.",
    icon: Server,
  },
  {
    id: "ecs-6",
    title: "Store Migration",
    description: "Seamlessly migrate to a better platform.",
    icon: Layout,
  },
  {
    id: "ecs-7",
    title: "Marketplace Development",
    description: "Multi-vendor marketplace platforms.",
    icon: Globe,
  },
  {
    id: "ecs-8",
    title: "Payment Gateway Integration",
    description: "Secure and reliable payment setups.",
    icon: CreditCard,
  },
  {
    id: "ecs-9",
    title: "Performance Optimization",
    description: "Speed up your existing store.",
    icon: Sparkles,
  },
];

export const ecommercePackages: SharedPackage[] = [
  {
    id: "ec-pkg-1",
    name: "Starter",
    audience: "New Businesses",
    priceMonthly: 19999,
    priceYearly: 19999,
    currency: "INR",
    buttonText: "Choose Starter",
    buttonLink: "/contact?service=ecommerce-starter",
    features: [
      "Basic Shopify/WooCommerce Setup",
      "Up to 50 Products",
      "Standard Theme",
      "Payment Integration",
      "1 Month Free Support",
    ],
  },
  {
    id: "ec-pkg-2",
    name: "Growth",
    audience: "Growing Stores",
    priceMonthly: 39999,
    priceYearly: 39999,
    currency: "INR",
    isPopular: true,
    badge: "Most Popular",
    buttonText: "Choose Growth",
    buttonLink: "/contact?service=ecommerce-growth",
    features: [
      "Custom Theme Modification",
      "Up to 500 Products",
      "Advanced SEO Setup",
      "Abandoned Cart Recovery",
      "Speed Optimization",
      "3 Months Free Support",
    ],
  },
  {
    id: "ec-pkg-3",
    name: "Premium",
    audience: "Established Brands",
    priceMonthly: 79999,
    priceYearly: 79999,
    currency: "INR",
    buttonText: "Choose Premium",
    buttonLink: "/contact?service=ecommerce-premium",
    features: [
      "Fully Custom Design",
      "Unlimited Products",
      "Headless Commerce Option",
      "Custom App Integrations",
      "Multi-currency & Multilingual",
      "6 Months Free Support",
    ],
  },
  {
    id: "ec-pkg-4",
    name: "Enterprise",
    audience: "Large Scale Stores",
    priceMonthly: null,
    priceYearly: null,
    currency: "INR",
    buttonText: "Talk to Sales",
    buttonLink: "/contact?service=ecommerce-enterprise",
    features: [
      "Complex Custom Architecture",
      "ERP/CRM Integrations",
      "Dedicated Account Manager",
      "High Availability Setup",
      "Advanced Analytics Setup",
      "24/7 Priority Support",
    ],
  },
];

export const ecommerceProjects = [
  {
    id: "ecp-1",
    title: "Urban Threads",
    category: "Fashion Store",
    technologies: ["Shopify", "Liquid"],
    thumbnail: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80",
    link: "#",
  },
  {
    id: "ecp-2",
    title: "Tech Haven",
    category: "Electronics",
    technologies: ["WooCommerce", "WordPress"],
    thumbnail: "https://images.unsplash.com/photo-1550009158-9ebf6d1736eb?w=600&q=80",
    link: "#",
  },
  {
    id: "ecp-3",
    title: "Organix",
    category: "Grocery Marketplace",
    technologies: ["Next.js", "Node.js", "MongoDB"],
    thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
    link: "#",
  },
  {
    id: "ecp-4",
    title: "Luxe Home",
    category: "Furniture & Decor",
    technologies: ["Magento", "PHP"],
    thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    link: "#",
  },
];

export const ecommerceTestimonials: SharedTestimonial[] = [
  {
    id: "ect-1",
    name: "Amit Patel",
    role: "Founder, Urban Threads",
    quote: "The Simbolo completely transformed our online presence. Our new Shopify store is not only beautiful but also highly optimized, resulting in a 40% increase in sales.",
    rating: 5,
  },
  {
    id: "ect-2",
    name: "Sarah Jenkins",
    role: "Marketing Director, Tech Haven",
    quote: "Exceptional service and technical expertise. They built a custom headless commerce solution that handles our massive traffic seamlessly during flash sales.",
    rating: 5,
  },
  {
    id: "ect-3",
    name: "Rahul Verma",
    role: "CEO, Organix",
    quote: "Migrating from WooCommerce to a custom React store was a breeze with their team. The speed improvements are incredible, and our bounce rate dropped significantly.",
    rating: 5,
  },
];

export const ecommerceTechData = [
  { id: "tech-1", name: "React", icon: Code2, description: "UI Library", color: "#61DAFB" },
  { id: "tech-2", name: "Next.js", icon: Layers, description: "React Framework", color: "#FFFFFF" },
  { id: "tech-3", name: "Node.js", icon: Server, description: "Backend Runtime", color: "#339933" },
  { id: "tech-4", name: "NestJS", icon: Server, description: "Backend Framework", color: "#E0234E" },
  { id: "tech-5", name: "Java", icon: Code2, description: "Backend", color: "#007396" },
  { id: "tech-6", name: "Spring Boot", icon: Zap, description: "Java Framework", color: "#6DB33F" },
  { id: "tech-7", name: "Shopify", icon: ShoppingCart, description: "E-Commerce", color: "#95BF47" },
  { id: "tech-8", name: "WooCommerce", icon: Store, description: "E-Commerce", color: "#96588A" },
  { id: "tech-9", name: "Magento", icon: ShoppingCart, description: "Enterprise E-Commerce", color: "#EE672F" },
  { id: "tech-10", name: "Stripe", icon: CreditCard, description: "Payments", color: "#008CDD" },
  { id: "tech-11", name: "Razorpay", icon: CreditCard, description: "Payments", color: "#02042B" },
  { id: "tech-12", name: "MongoDB", icon: Database, description: "NoSQL DB", color: "#47A248" },
  { id: "tech-13", name: "PostgreSQL", icon: Database, description: "Relational DB", color: "#336791" },
];

export const ecommerceFaqs = [
  {
    id: "ec-faq-1",
    question: "Which platform is best for my e-commerce store?",
    answer: "It depends on your specific needs, budget, and scale. Shopify is excellent for quick setups and ease of use. WooCommerce provides flexibility if you use WordPress. For large catalogs and complex requirements, custom Next.js or Magento might be better.",
  },
  {
    id: "ec-faq-2",
    question: "Do you provide post-launch support and maintenance?",
    answer: "Yes! All our packages include a period of free support after launch. We also offer ongoing maintenance retainers to ensure your store stays secure, updated, and fast.",
  },
  {
    id: "ec-faq-3",
    question: "Can you integrate our existing ERP/CRM with the new store?",
    answer: "Absolutely. We have extensive experience integrating e-commerce platforms with popular ERP systems, CRMs, inventory management tools, and custom backend applications.",
  },
  {
    id: "ec-faq-4",
    question: "Will my new store be mobile-friendly and SEO optimized?",
    answer: "Every store we build is mobile-first and optimized for speed and SEO out of the box, ensuring you rank well on search engines and provide a great experience on any device.",
  },
];

export const ecommerceStoreFeatures = [
  {
    id: "esf-1",
    title: "Secure Checkout",
    description: "PCI-compliant payment gateways.",
    icon: Shield,
  },
  {
    id: "esf-2",
    title: "Inventory Sync",
    description: "Real-time stock tracking & alerts.",
    icon: Package,
  },
  {
    id: "esf-3",
    title: "Analytics Dashboard",
    description: "Track sales, traffic, and conversions.",
    icon: Search,
  },
  {
    id: "esf-4",
    title: "Custom Discounts",
    description: "Advanced coupon and discount engines.",
    icon: Sparkles,
  },
  {
    id: "esf-5",
    title: "Customer Accounts",
    description: "Wishlists, order history, and profiles.",
    icon: Store,
  },
  {
    id: "esf-6",
    title: "Global Shipping",
    description: "Automated shipping rates and tracking.",
    icon: Globe,
  },
];

export const ecommerceComparison = [
  {
    id: "comp-1",
    feature: "Store Performance",
    simbolo: "Sub-second load times",
    typical: "Average 3-5s load times",
  },
  {
    id: "comp-2",
    feature: "Code Quality",
    simbolo: "Custom tailored architecture",
    typical: "Bloated pre-made templates",
  },
  {
    id: "comp-3",
    feature: "SEO & Accessibility",
    simbolo: "Built-in technical SEO optimization",
    typical: "Basic or ignored entirely",
  },
  {
    id: "comp-4",
    feature: "Post-Launch Support",
    simbolo: "Dedicated 24/7 technical support",
    typical: "Slow ticket-based responses",
  },
  {
    id: "comp-5",
    feature: "Design",
    simbolo: "Premium, conversion-focused UI/UX",
    typical: "Generic layouts and components",
  },
];
