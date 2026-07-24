import type { Metadata } from "next";
import { GoogleAdsPage } from "@/components/googleAds/GoogleAdsPage";

export const metadata: Metadata = {
  title: "Google Ads Services | The Simbolo",
  description: "Drive more leads and sales with high-converting Google Ads campaigns.",
};

export default function Page() {
  return <GoogleAdsPage />;
}
