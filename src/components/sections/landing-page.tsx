"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { BrandSection } from "@/components/sections/brand-section";
import { FeaturedServices } from "@/components/sections/featured-services";
import { Hero } from "@/components/sections/hero";
import { InfoCards } from "@/components/sections/info-cards";

export function LandingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />
      <main className="relative lg:pl-[250px]">
        <Navbar />
        <Hero />
        <FeaturedServices />
        <InfoCards />
        <BrandSection />
      </main>
    </div>
  );
}
