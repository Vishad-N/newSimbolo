"use client";

import { useState, useEffect } from "react";
import type { MarketingPackage } from "@/types/packages";

export function usePackages() {
  const [packages, setPackages] = useState<MarketingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch packages from the real backend API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
        const response = await fetch(`${apiUrl}/packages`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch packages from API");
        }
        
        const json = await response.json();
        
        // Map backend package data to frontend MarketingPackage type
        // Map backend package data to frontend MarketingPackage type
        const backendPackages = (json.data || json).filter((pkg: any) => !pkg.isAddon);
        const mappedPackages: MarketingPackage[] = backendPackages.map((pkg: any, index: number) => {
          // Find monthly and yearly pricings if available, else fallback to basePrice
          const monthlyPricing = pkg.pricings?.find((p: any) => p.billingPeriod === "monthly");
          const yearlyPricing = pkg.pricings?.find((p: any) => p.billingPeriod === "yearly");
          
          return {
            id: pkg.id,
            name: pkg.name,
            slug: pkg.slug,
            description: pkg.description || pkg.name,
            illustration: pkg.service?.name.includes("SEO") ? "/assets/seo-icon.svg" : "/assets/ads-icon.svg",
            priceMonthly: monthlyPricing ? monthlyPricing.price : pkg.basePrice,
            priceYearly: yearlyPricing ? yearlyPricing.price : pkg.basePrice * 10,
            rating: 5.0, // Default for now
            status: "published",
            displayOrder: index,
            themeColor: pkg.type === "ENTERPRISE" ? "accent" : (pkg.type === "STARTER" ? "blue" : "primary"),
            targetAudience: pkg.type,
            compactHighlights: pkg.features?.slice(0, 3).map((f: any) => f.name) || ["Strategy", "Execution", "Reporting"],
            detailedFeatures: pkg.features?.map((f: any) => ({
              category: "General",
              items: [{ name: f.name, included: true, tooltip: f.description }]
            })) || [],
            timeline: "Monthly Retainer",
            deliverables: [],
            requirements: [],
            faqs: []
          };
        });

        setPackages(mappedPackages);
      } catch (error) {
        console.error("Failed to load packages from API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return {
    packages,
    loading,
    addPackage: (_pkg: MarketingPackage) => {},
    updatePackage: (_id: string, _data: Partial<MarketingPackage>) => {},
    deletePackage: (_id: string) => {},
  };
}
