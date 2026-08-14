"use client";

import { useEffect, useState } from "react";
import { resolvePackageIllustration } from "@/data/package-illustrations";
import type { MarketingPackage, PackageTheme } from "@/types/packages";

interface BackendPackageFeature {
  name?: string;
  isIncluded?: boolean;
}

interface BackendPackagePricing {
  billingPeriod?: string;
  price?: number;
}

interface BackendPackage {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  illustration?: string | null;
  type?: string;
  basePrice?: number;
  isPopular?: boolean;
  isAddon?: boolean;
  service?: {
    name?: string;
    slug?: string;
  } | null;
  features?: BackendPackageFeature[];
  pricings?: BackendPackagePricing[];
}

interface PackageApiEnvelope {
  data?: unknown;
}

const DEFAULT_FEATURES = ["Strategy and planning", "Campaign execution", "Performance reporting"];

function normalizePackageResponse(response: unknown): BackendPackage[] {
  if (Array.isArray(response)) return response as BackendPackage[];
  if (!response || typeof response !== "object") return [];

  const data = (response as PackageApiEnvelope).data;
  if (Array.isArray(data)) return data as BackendPackage[];
  if (data && typeof data === "object" && Array.isArray((data as PackageApiEnvelope).data)) {
    return (data as PackageApiEnvelope).data as BackendPackage[];
  }

  return [];
}

function getTheme(type: string | undefined): PackageTheme {
  if (type === "ENTERPRISE") return "purple";
  if (type === "PROFESSIONAL") return "teal";
  if (type === "CUSTOM") return "orange";
  return "blue";
}

export function mapBackendPackage(pkg: BackendPackage, index: number): MarketingPackage {
  const name = pkg.name?.trim() || "Marketing Package";
  const serviceName = pkg.service?.name?.trim() || "Digital Marketing";
  const slug = pkg.slug?.trim() || pkg.id || "package";
  const basePrice = Number(pkg.basePrice) || 0;
  const monthlyPricing = pkg.pricings?.find((pricing) => pricing.billingPeriod?.toLowerCase() === "monthly");
  const yearlyPricing = pkg.pricings?.find((pricing) => pricing.billingPeriod?.toLowerCase() === "yearly");
  const includedFeatures = (pkg.features ?? [])
    .filter((feature) => feature.isIncluded !== false && Boolean(feature.name?.trim()))
    .map((feature) => feature.name!.trim());
  const features = includedFeatures.length > 0 ? includedFeatures : DEFAULT_FEATURES;
  const description = pkg.description?.trim() || `${serviceName} support designed for your business goals.`;

  return {
    id: pkg.id || slug,
    name,
    subtitle: serviceName,
    shortDescription: description,
    compactHighlights: features.slice(0, 3),
    priceMonthly: Number(monthlyPricing?.price) || basePrice || null,
    priceYearly: Number(yearlyPricing?.price) || (basePrice ? basePrice * 10 : null),
    currency: "INR",
    badge: pkg.isPopular ? "Most Popular" : undefined,
    rating: 5,
    icon: pkg.type === "ENTERPRISE" ? "crown" : "rocket",
    illustration: resolvePackageIllustration(pkg.illustration, `${serviceName} ${pkg.service?.slug ?? ""}`),
    features,
    deliverables: features,
    idealFor: [pkg.type ? `${pkg.type.toLowerCase().replaceAll("_", " ")} businesses` : "Growing businesses"],
    featured: Boolean(pkg.isPopular),
    status: "published",
    displayOrder: index,
    buttonText: "Choose Package",
    buttonLink: `?auth=register&checkout=${encodeURIComponent(slug)}`,
    themeColor: getTheme(pkg.type),
  };
}

export function usePackages() {
  const [packages, setPackages] = useState<MarketingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
        const response = await fetch(`${apiUrl}/packages`);

        if (!response.ok) {
          throw new Error("Failed to fetch packages from API");
        }

        const responseBody: unknown = await response.json();
        const mappedPackages = normalizePackageResponse(responseBody)
          .filter((pkg) => !pkg.isAddon)
          .map(mapBackendPackage);

        setPackages(mappedPackages);
      } catch (error) {
        console.error("Failed to load packages from API:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchPackages();
  }, []);

  return {
    packages,
    loading,
    addPackage: (_pkg: MarketingPackage) => {},
    updatePackage: (_id: string, _data: Partial<MarketingPackage>) => {},
    deletePackage: (_id: string) => {},
  };
}
