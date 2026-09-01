
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About Us | The Simbolo",
  description:
    "The Simbolo is a digital marketing agency in Indore, India, helping businesses grow through SEO, paid ads, web design, and creative services. Meet the team behind the results.",
  alternates: {
    canonical: "/about-us",
  },
  openGraph: {
    title: "About Us | The Simbolo",
    description: "Meet the team behind The Simbolo's digital marketing results.",
    url: "/about-us",
    siteName: "The Simbolo",
    images: [{ url: "/api/og?title=About%20The%20Simbolo&subtitle=Our%20story%2C%20mission%2C%20and%20team", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
};

export default function AboutUsLayout({ children }: { children: ReactNode }) {
  return children;
}
