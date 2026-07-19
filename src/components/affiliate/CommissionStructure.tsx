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
      <h2 className="text-[1.15rem] font-black text-white">Commission Structure</h2>
      <p className="mt-1 text-[0.8rem] text-white/60">Higher referrals, higher earnings!</p>
      
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative flex flex-col items-center rounded-[12px] border ${
              plan.isPopular ? "border-[var(--primary)] shadow-[0_0_20px_var(--primary-glow)]" : "border-white/10"
            } bg-[var(--background)]/50 p-6 transition duration-300 hover:border-[var(--primary)]/50`}
          >
            {plan.isPopular && plan.badge && (
              <div className="absolute -top-3 rounded-full bg-[var(--primary)] px-3 py-0.5 text-[0.65rem] font-bold text-black">
                {plan.badge}
              </div>
            )}
            <h3 className="mt-2 text-[1.6rem] font-black text-white">{plan.commission}</h3>
            <p className="mt-1 text-[0.75rem] text-white/60">{plan.description}</p>
            <div className={`mt-4 text-[0.85rem] font-bold ${plan.isPopular ? "text-[var(--primary)]" : "text-[var(--primary-light)]"}`}>
              {plan.name}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-6 text-[0.7rem] text-white/40">* Commissions are tier-based and subject to terms & conditions.</p>
    </SectionCard>
  );
}
