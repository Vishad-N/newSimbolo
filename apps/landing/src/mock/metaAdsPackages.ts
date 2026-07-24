import type { SharedPackage } from "@/types/shared";

export const metaAdsPackages: SharedPackage[] = [
  {
    id: "meta-starter",
    name: "Starter",
    audience: "For Small Businesses",
    priceMonthly: 9999,
    priceYearly: 119988,
    currency: "INR",
    buttonText: "Choose Plan",
    buttonLink: "/contact",
    features: [
      "Audience Research",
      "1 Campaign Setup",
      "2 Ad Creatives",
      "Conversion Tracking",
      "Weekly Reporting"
    ],
  },
  {
    id: "meta-growth",
    name: "Growth",
    audience: "For Growing Businesses",
    priceMonthly: 19999,
    priceYearly: 239988,
    currency: "INR",
    isPopular: true,
    badge: "Most Popular",
    buttonText: "Choose Plan",
    buttonLink: "/contact",
    features: [
      "Everything in Starter",
      "3 Campaigns",
      "6 Ad Creatives",
      "A/B Testing",
      "Weekly Optimization",
      "Detailed Reporting"
    ],
  },
  {
    id: "meta-scale",
    name: "Scale",
    audience: "For Scaling Businesses",
    priceMonthly: 34999,
    priceYearly: 419988,
    currency: "INR",
    buttonText: "Choose Plan",
    buttonLink: "/contact",
    features: [
      "Everything in Growth",
      "5 Campaigns",
      "10 Ad Creatives",
      "Advanced Targeting",
      "Daily Optimization",
      "Priority Support"
    ],
  },
  {
    id: "meta-premium",
    name: "Premium",
    audience: "For Large Businesses",
    priceMonthly: 59999,
    priceYearly: 719988,
    currency: "INR",
    buttonText: "Contact Us",
    buttonLink: "/contact",
    features: [
      "Everything in Scale",
      "Unlimited Campaigns",
      "Unlimited Creatives",
      "Dedicated Ad Expert",
      "Daily Optimization",
      "Custom Strategy Call"
    ],
  },
];
