export type BillingCycle = "monthly" | "yearly";

export type PackageTheme = "teal" | "blue" | "purple" | "orange";

export type PackageIconName = "send" | "rocket" | "crown" | "gem";

export type MarketingPackage = {
  id: string;
  name: string;
  subtitle: string;
  shortDescription: string;
  compactHighlights: string[];
  priceMonthly: number | null;
  priceYearly: number | null;
  currency: "INR";
  badge?: string;
  rating: number;
  icon: PackageIconName | string;
  illustration: string;
  features: string[];
  deliverables: string[];
  idealFor: string[];
  featured: boolean;
  status: "published" | "draft";
  displayOrder: number;
  buttonText: string;
  buttonLink: string;
  themeColor: PackageTheme;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
};

export type BenefitItem = {
  id: string;
  title: string;
  description: string;
  icon: "shield" | "headphones" | "refresh";
  themeColor: "teal" | "lime";
};
