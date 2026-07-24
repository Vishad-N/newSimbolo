"use client";

import { StatsBar } from "@/components/shared/StatsBar";
import { BriefcaseBusiness, CheckCircle, Clock, Sparkles, Trophy } from "lucide-react";

const serviceStats = [
  { id: "projects", title: "500+", description: "Projects Delivered", icon: BriefcaseBusiness },
  { id: "satisfaction", title: "98%", description: "Client Satisfaction", icon: Trophy },
  { id: "support", title: "24/7", description: "Dedicated Support", icon: Clock },
  { id: "ai", title: "AI Powered", description: "Marketing Strategies", icon: Sparkles },
  { id: "custom", title: "100%", description: "Custom Solutions", icon: CheckCircle },
];

export function ServicesStats() {
  return (
    <section className="py-20 px-4 sm:px-8 lg:px-10 border-t border-white/5 bg-[var(--background)]">
      <div className="mx-auto max-w-[1290px]">
        <div className="mb-16 text-center">
          <h2 className="text-[2rem] font-bold text-white sm:text-[2.5rem]">
            Why Businesses Choose <span className="text-[var(--primary)]">The Simbolo</span>
          </h2>
        </div>
        <StatsBar stats={serviceStats} />
      </div>
    </section>
  );
}
