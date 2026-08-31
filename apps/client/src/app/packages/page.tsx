"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, PackageOpen, ArrowRight } from "lucide-react";

interface BackendPackagePricing {
  billingPeriod?: string;
  price?: number;
}

interface BackendPackageFeature {
  name?: string;
  isIncluded?: boolean;
}

interface BackendPackage {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  basePrice?: number;
  isPopular?: boolean;
  isAddon?: boolean;
  features?: BackendPackageFeature[];
  pricings?: BackendPackagePricing[];
}

export default function ClientPackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<BackendPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
        const res = await fetch(`${apiUrl}/packages`);
        if (!res.ok) throw new Error("Failed to load packages");
        const json = await res.json();
        const data: BackendPackage[] = json.data || json || [];
        setPackages(data.filter((pkg) => !pkg.isAddon));
      } catch (err) {
        console.error("Failed to load packages", err);
        setError("Couldn't load packages right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center gap-3 mb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
          <PackageOpen className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-white">Choose a Package</h1>
        <p className="max-w-xl text-sm text-gray-400">
          Pick a plan to unlock your dashboard, projects, and support.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-300">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => {
            const monthlyPrice =
              pkg.pricings?.find((p) => p.billingPeriod?.toLowerCase() === "monthly")?.price ?? pkg.basePrice ?? 0;
            const features = (pkg.features ?? [])
              .filter((f) => f.isIncluded !== false && f.name)
              .map((f) => f.name as string);

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                  pkg.isPopular ? "border-primary shadow-[0_0_30px_var(--primary-glow)]" : "border-white/10 bg-white/[0.02]"
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[0.65rem] font-bold uppercase text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                <p className="mt-1 text-sm text-gray-400 line-clamp-2">{pkg.description}</p>
                <div className="mt-4 text-2xl font-bold text-white">
                  ₹{monthlyPrice.toLocaleString("en-IN")}
                  <span className="text-sm font-medium text-gray-400">/month</span>
                </div>
                {features.length > 0 && (
                  <ul className="mt-4 flex-1 space-y-2">
                    {features.slice(0, 5).map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs text-gray-300">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={() => router.push(`/checkout?package=${encodeURIComponent(pkg.slug)}`)}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
                >
                  Choose Package
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
