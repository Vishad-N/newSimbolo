"use client";

import { FAQSection } from "@/components/seo/FAQSection";
import { AffiliateHero } from "@/components/affiliate/AffiliateHero";
import { HowItWorksTimeline } from "@/components/affiliate/HowItWorksTimeline";
import { CommissionStructure } from "@/components/affiliate/CommissionStructure";
import { FeatureCards } from "@/components/affiliate/FeatureCards";
import { MarketingAssets } from "@/components/affiliate/MarketingAssets";
import { Leaderboard } from "@/components/affiliate/Leaderboard";
import { BottomCTA } from "@/components/affiliate/BottomCTA";

import {
  affiliateBenefits,
  howItWorksSteps,
  commissionPlans,
  affiliateFeatures,
  marketingAssets,
  affiliateLeaderboard,
  affiliateFaqs,
} from "@/data/affiliate";

export function AffiliatePage() {
  return (
    <>
        <div className="px-4 pb-8 pt-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1320px] space-y-6">
            
            {/* Row 1: Hero */}
            <AffiliateHero benefits={affiliateBenefits} />
            
            {/* Row 2: How It Works & Commission Grid */}
            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr] mt-8">
              <HowItWorksTimeline steps={howItWorksSteps} />
              <CommissionStructure plans={commissionPlans} />
            </div>

            {/* Row 3: Features, Assets, Leaderboard Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              <FeatureCards features={affiliateFeatures} />
              <MarketingAssets assets={marketingAssets} />
              <Leaderboard leaders={affiliateLeaderboard} />
            </div>

            {/* Row 4: CTA Banner */}
            <BottomCTA />

            {/* Row 5: FAQ */}
            <div className="mt-8">
              <FAQSection faqs={affiliateFaqs} />
            </div>

          </div>
        </div>
      </>
  );
}
