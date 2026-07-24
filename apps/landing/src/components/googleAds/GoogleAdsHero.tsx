"use client";

import Image from "next/image";
import { CheckCircle2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { PerformanceCard } from "@/components/googleAds/PerformanceCard";
import { ServiceHero } from "@/components/shared/ServiceHero";

type GoogleAdsHeroProps = {
  benefits: string[];
};

function GoogleAdsMark() {
  return (
    <div className="relative h-[120px] w-[150px]">
      <div className="absolute left-12 top-0 h-[116px] w-9 rotate-[28deg] rounded-full bg-linear-to-b from-[#3483fa] to-[var(--secondary)] shadow-[0_0_26px_rgba(45,212,191,0.2)]" />
      <div className="absolute left-10 top-11 h-[92px] w-9 -rotate-[32deg] rounded-full bg-linear-to-b from-[var(--accent)] to-[var(--primary)] shadow-[0_0_26px_var(--accent-glow)]" />
      <div className="absolute bottom-0 left-0 h-10 w-10 rounded-full bg-[var(--primary)]" />
    </div>
  );
}

function HeroArt() {
  return (
    <div className="relative h-full w-full">
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.5 }} className="absolute right-[12%] top-[24%] z-20 grid h-12 w-12 place-items-center rounded-[8px] border border-white/10 bg-[var(--surface)]/80 text-white">
        <Search className="h-6 w-6" />
      </motion.div>
      <div className="absolute left-[28%] top-[67%] h-10 w-[250px] rounded-[50%] border border-[var(--secondary)]/25 bg-[var(--secondary)]/6 shadow-[0_0_30px_rgba(45,212,191,0.16)]" />
      <div className="absolute right-0 top-0 lg:bottom-0 w-full max-w-[500px] translate-y-[285px] lg:translate-y-0">
        <PerformanceCard />
      </div>
    </div>
  );
}

const GIcon = () => <span className="text-white">G</span>;

export function GoogleAdsHero({ benefits }: GoogleAdsHeroProps) {
  return (
    <ServiceHero
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Services", href: "/#services" },
        { label: "Google Ads" },
      ]}
      badge={{
        icon: GIcon,
        text: "Google Ads Services",
      }}
      title={
        <>
          Drive More Leads & Sales
          <span className="block">with High-Converting</span>
          <span className="text-[var(--accent)]">Google Ads</span> Campaigns
        </>
      }
      description="We create data-driven Google Ads campaigns that bring quality traffic, generate leads, and maximize your ROI."
      benefits={benefits}
      benefitIcon={CheckCircle2}
      primaryCta={{
        text: "Get Free Google Ads Audit",
        href: "/contact?service=google-ads-audit",
      }}
      secondaryCta={{
        text: "Talk to Expert",
        href: "/contact?service=google-ads-expert",
      }}
      visual={<HeroArt />}
    />
  );
}
