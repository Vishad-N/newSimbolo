import type { SharedPackage } from "@/types/shared";
import type { MarketingPackage } from "@/types/packages";

/**
 * Service pages (SEO, Google Ads, Meta Ads, Website Design, E-Commerce) only
 * fetch the lighter SharedPackage shape, but reuse the /packages expanded
 * modal, which expects the richer MarketingPackage shape. Fields with no
 * equivalent on SharedPackage (illustration, deliverables, etc.) get sane
 * defaults so the modal renders without those optional sections.
 */
export function sharedPackageToMarketingPackage(pkg: SharedPackage): MarketingPackage {
  return {
    id: pkg.id,
    name: pkg.name,
    subtitle: pkg.audience,
    shortDescription: "",
    compactHighlights: pkg.features.slice(0, 3),
    priceMonthly: pkg.priceMonthly,
    priceYearly: pkg.priceYearly,
    currency: pkg.currency,
    badge: pkg.badge,
    rating: 5,
    icon: "rocket",
    illustration: "",
    features: pkg.features,
    deliverables: [],
    idealFor: pkg.audience ? [pkg.audience] : [],
    featured: Boolean(pkg.isPopular),
    status: "published",
    displayOrder: 0,
    buttonText: pkg.buttonText,
    buttonLink: pkg.buttonLink,
    themeColor: "teal",
  };
}
