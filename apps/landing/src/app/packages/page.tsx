import type { Metadata } from "next";
import { PackagesPage } from "@/components/packages/PackagesPage";

export const metadata: Metadata = {
  title: "Packages | The Simbolo",
  description: "Transparent digital marketing packages for growing businesses.",
  alternates: {
    canonical: "/packages",
  },
  openGraph: {
    title: "Packages | The Simbolo",
    description: "Transparent digital marketing packages for growing businesses.",
    url: "/packages",
    siteName: "The Simbolo",
    images: [{ url: "/api/og?title=Packages&subtitle=Transparent%20pricing%20for%20growing%20businesses", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return <PackagesPage />;
}
