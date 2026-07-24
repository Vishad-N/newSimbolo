"use client";

import { BrandSection } from "@/components/sections/brand-section";
import { FeaturedServices } from "@/components/sections/featured-services";
import { Hero } from "@/components/sections/hero";
import { InfoCards } from "@/components/sections/info-cards";

export function LandingPage() {
  return (
    <>
        <Hero />
        <FeaturedServices />
        <InfoCards />
        <BrandSection />
      </>
  );
}
