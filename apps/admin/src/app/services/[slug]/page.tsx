"use client";

import { use } from "react";
import { LayoutTemplate, Eye } from "lucide-react";
import { ServicePageConfigEditor } from "@/components/editors/ServicePageConfigEditor";
import { PricingTiersEditor } from "@/components/editors/PricingTiersEditor";
import { getWebsiteUrl } from "@/utils/utils";
import Link from "next/link";

// Only these service pages render the standalone 4-tier pricing grid
// (PricingSection / SeoPackages / MetaAdsClientPage) on the live site.
const SLUGS_WITH_PRICING_TIERS = ["seo", "google-ads", "meta-ads", "website-design", "ecommerce"];

export default function IndividualServiceEditor({ params }: { params: Promise<{ slug: string }> }) {
  // Use React.use() to unwrap the params promise since Next 15+ App Router passes params as a promise
  const resolvedParams = use(params);
  const title = resolvedParams.slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-primary" />
            {title} Page Configuration
          </h1>
          <p className="text-sm text-gray-400">Configure marketing content for the {title} landing page.</p>
        </div>
        <Link 
          href={getWebsiteUrl(`/services/${resolvedParams.slug}`)}
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10"
        >
          <Eye className="w-4 h-4" /> Preview Live
        </Link>
      </div>

      {SLUGS_WITH_PRICING_TIERS.includes(resolvedParams.slug) && (
        <PricingTiersEditor slug={resolvedParams.slug} />
      )}

      <ServicePageConfigEditor slug={resolvedParams.slug} />
    </div>
  );
}
