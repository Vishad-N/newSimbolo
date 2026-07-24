"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { CampaignMetrics } from "@/components/metaAds/CampaignMetrics";
import { ServiceHero } from "@/components/shared/ServiceHero";

type MetaAdsHeroProps = {
  benefits: string[];
};

function MetaAdsMark() {
  return (
    <div className="relative h-[120px] w-[150px]">
      <div className="absolute left-12 top-0 h-[116px] w-9 rotate-[28deg] rounded-full bg-linear-to-b from-[#1877F2] to-[#E1306C] shadow-[0_0_26px_rgba(24,119,242,0.3)]" />
      <div className="absolute left-10 top-11 h-[92px] w-9 -rotate-[32deg] rounded-full bg-linear-to-b from-[var(--accent)] to-[var(--primary)] shadow-[0_0_26px_var(--accent-glow)]" />
      <div className="absolute bottom-0 left-0 h-10 w-10 rounded-full bg-[var(--primary)]" />
    </div>
  );
}

function HeroArt() {
  return (
    <div className="relative h-full w-full">
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.5 }} className="absolute right-[12%] top-[24%] z-20 grid h-12 w-12 place-items-center rounded-[8px] border border-white/10 bg-[var(--surface)]/80 text-[#1877F2] font-bold text-xl">
        f
      </motion.div>
      <div className="absolute left-[28%] top-[67%] h-10 w-[250px] rounded-[50%] border border-[#E1306C]/25 bg-[#E1306C]/6 shadow-[0_0_30px_rgba(225,48,108,0.16)]" />
      <div className="absolute right-0 top-0 lg:bottom-0 w-full max-w-[500px] translate-y-[285px] lg:translate-y-0">
        <CampaignMetrics />
      </div>
    </div>
  );
}

const SparkleIcon = () => <span className="text-white text-lg">✦</span>;

export function MetaAdsHero({ benefits }: MetaAdsHeroProps) {
  return (
    <ServiceHero
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Services", href: "/#services" },
        { label: "Meta Ads" },
      ]}
      badge={{
        icon: SparkleIcon,
        text: "Meta Ads Services",
      }}
      title={
        <>
          Run Meta Ads That
          <span className="block">
            <span className="text-[var(--accent)]">Convert Clicks</span>{" "}
            into Customers
          </span>
        </>
      }
      description="Strategic campaigns. Laser-focused targeting. Higher ROAS. Maximum growth."
      benefits={benefits}
      benefitIcon={CheckCircle2}
      primaryCta={{
        text: "Get Free Ad Audit",
        href: "/contact?service=meta-ads-audit",
      }}
      secondaryCta={{
        text: "Talk to Expert",
        href: "/contact?service=meta-ads-expert",
      }}
      visual={<HeroArt />}
    />
  );
}
