import { landingApi } from "@/lib/api";
import { SharedPackage } from "@/types/shared";

export async function fetchMappedPackages(serviceSlug: string, mockFallback: SharedPackage[]): Promise<SharedPackage[]> {
  try {
    const rawPackages = await landingApi.getPackages([]);
    
    if (rawPackages && rawPackages.length > 0) {
      const servicePackages = rawPackages.filter((p: any) => p.category?.slug === serviceSlug || p.category?.slug === 'marketing');
      
      if (servicePackages.length > 0) {
        return servicePackages.map((pkg: any) => {
          const monthlyPricing = pkg.pricings?.find((p: any) => p.billingPeriod === 'monthly');
          const yearlyPricing = pkg.pricings?.find((p: any) => p.billingPeriod === 'yearly');
          
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
            buttonLink: "?auth=register&checkout=" + pkg.id,
            features: pkg.features?.map((f: any) => f.name) || [],
          };
        });
      }
    }
  } catch (error) {
    console.error(`Failed to fetch mapped packages for ${serviceSlug}`, error);
  }
  
  return mockFallback;
}
