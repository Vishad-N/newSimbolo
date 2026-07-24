import type { LucideIcon } from "lucide-react";

export type BillingCycle = "monthly" | "yearly";

export type SeoMetric = {
  id: string;
  value: string;
  label: string;
  sublabel?: string;
  icon: LucideIcon;
};

export type SeoService = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type SeoApproachStep = {
  id: string;
  title: string;
  description: string;
};

export type SeoPackage = {
  id: string;
  name: string;
  audience: string;
  priceMonthly: number | null;
  priceYearly: number | null;
  currency: "INR";
  isPopular?: boolean;
  badge?: string;
  buttonText: string;
  buttonLink: string;
  features: string[];
  icon: LucideIcon;
};

export type SeoResultMetric = {
  id: string;
  value: number;
  suffix: string;
  label: string;
};

export type SeoTestimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
};

export type SeoFaq = {
  id: string;
  question: string;
  answer: string;
};
