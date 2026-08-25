import type { Metadata } from "next";
import { GoogleAdsPage } from "@/components/googleAds/GoogleAdsPage";
import { fetchMappedPackages } from "@/lib/package-mapper";
import { landingApi } from "@/lib/api";

export const metadata: Metadata = {
  title: "Google Ads Services | The Simbolo",
  description: "Drive more leads and sales with high-converting Google Ads campaigns.",
};

export default async function GoogleAdsRoute() {
  const [livePackages, liveConfig] = await Promise.all([
    fetchMappedPackages('google-ads', []),
    landingApi.getServicePageConfig('google-ads', null),
  ]);

  return <GoogleAdsPage livePackages={livePackages} liveConfig={liveConfig} />;
}
