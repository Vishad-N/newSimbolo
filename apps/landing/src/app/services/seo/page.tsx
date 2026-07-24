import type { Metadata } from "next";
import { SeoPage } from "@/components/seo/SeoPage";

export const metadata: Metadata = {
  title: "SEO Services | The Simbolo",
  description: "Rank higher, get found, and grow faster with data-driven SEO services.",
};

export default function Page() {
  return <SeoPage />;
}
