import type { Metadata } from "next";
import { PackagesPage } from "@/components/packages/PackagesPage";

export const metadata: Metadata = {
  title: "Packages | The Simbolo",
  description: "Transparent digital marketing packages for growing businesses.",
};

export default function Page() {
  return <PackagesPage />;
}
