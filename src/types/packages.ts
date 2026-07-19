export type BillingCycle = "monthly" | "yearly";

export type PackageTheme = "teal" | "blue" | "purple" | "orange";

export type PackageIconName = "send" | "rocket" | "crown" | "gem";

export type MarketingPackage = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  priceMonthly: number | null;
  priceYearly: number | null;
  currency: "INR";
  badge?: string;
  isPopular: boolean;
  buttonText: string;
  buttonLink: string;
  displayOrder: number;
  themeColor: PackageTheme;
  icon: PackageIconName;
  isActive: boolean;
  features: string[];
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
