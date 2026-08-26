import type { Metadata } from "next";
import { SeoPage } from "@/components/seo/SeoPage";
import { fetchMappedPackages } from "@/lib/package-mapper";
import { landingApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SEO Services | The Simbolo",
  description: "Rank higher, get found, and grow faster with data-driven SEO services.",
};

export default async function Page() {
  const [livePackages, liveConfig] = await Promise.all([
    fetchMappedPackages('seo', []),
    landingApi.getServicePageConfig('seo', null),
  ]);
  
  return <SeoPage livePackages={livePackages} liveConfig={liveConfig} />;
}
