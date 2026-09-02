import { landingApi } from "@/lib/api";
import type { SharedPackage } from "@/types/shared";

interface PackagePricingRecord {
  billingPeriod: string;
  price: number;
}

interface PackageFeatureRecord {
  name: string;
}

interface LandingPackageRecord {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  basePrice: number;
  isAddon?: boolean;
  isPopular?: boolean;
  service?: {
    slug?: string;
  } | null;
  pricings?: PackagePricingRecord[];
  features?: PackageFeatureRecord[];
}

const normalizePackages = (response: unknown): LandingPackageRecord[] => {
  if (Array.isArray(response)) return response as LandingPackageRecord[];
  if (!response || typeof response !== "object") return [];

  const responseRecord = response as { data?: unknown };
  if (Array.isArray(responseRecord.data)) return responseRecord.data as LandingPackageRecord[];

  if (responseRecord.data && typeof responseRecord.data === "object") {
    const nestedData = responseRecord.data as { data?: unknown };
    if (Array.isArray(nestedData.data)) return nestedData.data as LandingPackageRecord[];
  }

  return [];
};

export async function fetchMappedPackages(serviceSlug: string, mockFallback: SharedPackage[]): Promise<SharedPackage[]> {
  try {
    const response: unknown = await landingApi.getPackages([]);
    const rawPackages = normalizePackages(response);

    if (rawPackages.length > 0) {
      const servicePackages = rawPackages.filter((pkg) =>
        pkg.isAddon === true && pkg.service?.slug === serviceSlug
      );
      
      if (servicePackages.length > 0) {
        return servicePackages.map((pkg) => {
          const monthlyPricing = pkg.pricings?.find((pricing) => pricing.billingPeriod === "monthly");
          const yearlyPricing = pkg.pricings?.find((pricing) => pricing.billingPeriod === "yearly");
          
          return {
            id: pkg.id,
            name: pkg.name,
            audience: pkg.description || "For Businesses",
            priceMonthly: monthlyPricing ? monthlyPricing.price : pkg.basePrice,
            priceYearly: yearlyPricing ? yearlyPricing.price : pkg.basePrice * 10,
            currency: "INR",
            isPopular: pkg.isPopular,
            badge: pkg.isPopular ? "Most Popular" : undefined,
            buttonText: "Choose Plan",
            // /checkout and the backend's GET /packages/:slug both look packages up by
            // slug, not id — using pkg.id here would 404 and silently fall back to a
            // ₹0 "Custom Package" at checkout.
            buttonLink: "?auth=register&checkout=" + pkg.slug,
            features: pkg.features?.map((feature) => feature.name) || [],
          };
        });
      }
    }
  } catch (error) {
    console.error(`Failed to fetch mapped packages for ${serviceSlug}`, error);
  }
  
  return mockFallback;
}
