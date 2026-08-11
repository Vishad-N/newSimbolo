import type { Metadata } from "next";
import { GoogleAdsPage } from "@/components/googleAds/GoogleAdsPage";

export const metadata: Metadata = {
  title: "Google Ads Services | The Simbolo",
  description: "Drive more leads and sales with high-converting Google Ads campaigns.",
};

import { googleAdsPackages as mockPackages } from "@/mock/googleAdsPackages";
import { fetchMappedPackages } from "@/lib/package-mapper";

export default async function Page() {
  const packagesToPass = await fetchMappedPackages('google-ads', mockPackages);

  return <GoogleAdsPage livePackages={packagesToPass} />;
}
