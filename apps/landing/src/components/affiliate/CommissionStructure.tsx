"use client";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";

type CommissionPlan = {
  id: string;
  name: string;
  commission: string;
  description: string;
  isPopular?: boolean;
  badge?: string;
};

type CommissionStructureProps = {
  plans: CommissionPlan[];
};

export function CommissionStructure({ plans }: CommissionStructureProps) {
  return (
    <SectionCard className="p-6 md:p-8">
      <h2 className="text-[1.15rem] font-black text-[var(--text-primary)]">Commission Structure</h2>
      <p className="mt-1 text-[0.8rem] text-[var(--text-primary)]/60">Higher referrals, higher earnings!</p>
      
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative flex flex-col items-center rounded-[12px] border ${
              plan.isPopular ? "border-[var(--primary)] shadow-[0_0_20px_var(--accent-glow)]" : "border-[var(--text-primary)]/10"
            } bg-[var(--background)]/50 p-4 transition duration-300 hover:border-[var(--accent)]/50 text-center`}
          >
            {plan.isPopular && plan.badge && (
              <div className="absolute -top-3 rounded-full bg-[var(--primary)] px-2 py-0.5 text-[0.6rem] font-bold text-black whitespace-nowrap">
                {plan.badge}
              </div>
            )}
            <h3 className="mt-2 text-[1.15rem] lg:text-[1.0rem] xl:text-[1.15rem] font-black text-[var(--text-primary)] tracking-tight">{plan.commission}</h3>
            <p className="mt-1 text-[0.7rem] text-[var(--text-primary)]/60 leading-tight">{plan.description}</p>
            <div className={`mt-3 text-[0.85rem] font-bold ${plan.isPopular ? "text-[var(--primary)]" : "text-[var(--accent)]"}`}>
              {plan.name}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-6 text-[0.7rem] text-[var(--text-primary)]/40">* Commissions are tier-based and subject to terms & conditions.</p>
    </SectionCard>
  );
}
