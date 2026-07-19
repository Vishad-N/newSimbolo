import type { LucideIcon } from "lucide-react";

export type BillingCycle = "monthly" | "yearly";

export type SharedStat = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type SharedService = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type SharedPackage = {
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

export type SharedResult = {
  id: string;
  value: string;
  label: string;
  icon: LucideIcon;
};

export type SharedTestimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
};
