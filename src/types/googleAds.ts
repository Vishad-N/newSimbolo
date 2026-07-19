import type { LucideIcon } from "lucide-react";

export type BillingCycle = "monthly" | "yearly";

export type GoogleAdsStat = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type GoogleAdsService = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type GoogleAdsPackage = {
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
};

export type GoogleAdsProcessStep = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type GoogleAdsResult = {
  id: string;
  value: string;
  label: string;
  icon: LucideIcon;
};

export type GoogleAdsTestimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
};

export type GoogleAdsFaq = {
  id: string;
  question: string;
  answer: string;
};
