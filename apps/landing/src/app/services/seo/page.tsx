import type { Metadata } from "next";
import { SeoPage } from "@/components/seo/SeoPage";

export const metadata: Metadata = {
  title: "SEO Services | The Simbolo",
  description: "Rank higher, get found, and grow faster with data-driven SEO services.",
};

import { seoPackages as mockPackages } from "@/mock/seo-packages";
import { fetchMappedPackages } from "@/lib/package-mapper";

export default async function Page() {
  const packagesToPass = await fetchMappedPackages('seo', mockPackages);

  return <SeoPage livePackages={packagesToPass} />;
}
