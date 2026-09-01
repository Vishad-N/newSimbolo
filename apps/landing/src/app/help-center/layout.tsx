import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Help Center | The Simbolo",
  description:
    "Get answers to common questions about The Simbolo's services, billing, and support, or reach our team directly.",
  alternates: {
    canonical: "/help-center",
  },
  openGraph: {
    title: "Help Center | The Simbolo",
    description: "Answers to common questions about The Simbolo's services, billing, and support.",
    url: "/help-center",
    siteName: "The Simbolo",
    images: [{ url: "/api/og?title=Help%20Center&subtitle=Answers%20to%20common%20questions", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
};

export default function HelpCenterLayout({ children }: { children: ReactNode }) {
  return children;
}
