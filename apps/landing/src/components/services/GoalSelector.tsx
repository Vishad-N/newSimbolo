"use client";

import { motion } from "framer-motion";
import { ArrowRight, Target, TrendingUp, MonitorPlay, ShoppingCart, Search, Megaphone, PencilLine, Gem, Zap } from "lucide-react";

type Goal = {
  id: string;
  label: string;
  icon: any;
  color: string;
};

const goals: Goal[] = [
  { id: "leads", label: "Get More Leads", icon: Target, color: "text-[#10B981]" },
  { id: "sales", label: "Increase Sales", icon: TrendingUp, color: "text-[#F59E0B]" },
  { id: "website", label: "Build a Website", icon: MonitorPlay, color: "text-[#3B82F6]" },
  { id: "ecommerce", label: "Launch an E-Commerce Store", icon: ShoppingCart, color: "text-[#A855F7]" },
  { id: "seo", label: "Improve SEO", icon: Search, color: "text-[#FACC15]" },
  { id: "ads", label: "Run Paid Ads", icon: Megaphone, color: "text-[#10B981]" },
  { id: "content", label: "Create Better Content", icon: PencilLine, color: "text-[#A855F7]" },
  { id: "brand", label: "Build My Brand", icon: Gem, color: "text-[#EF4444]" },
  { id: "scale", label: "Scale My Business", icon: Zap, color: "text-[#F59E0B]" },
];

export function GoalSelector() {
  const handleScroll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById("core-services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="goal-selector" className="relative border-t border-white/5 bg-[var(--sidebar)] py-20">
      {/* Background accents */}
      <div className="absolute left-0 top-0 h-full w-full overflow-hidden opacity-40 pointer-events-none">
        <div className="absolute left-[20%] top-[30%] h-64 w-64 rounded-full bg-[var(--primary)]/5 blur-[100px]" />
        <div className="absolute right-[20%] bottom-[10%] h-64 w-64 rounded-full bg-[#10B981]/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-[1290px] px-4 sm:px-8 lg:px-10 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-balance font-heading text-[2.2rem] font-bold leading-tight text-white sm:text-[3rem]">
            What do you want to <span className="text-[var(--primary)]">achieve?</span>
          </h2>
          <p className="mt-4 text-[1rem] text-[var(--muted)] sm:text-[1.1rem]">
            Choose your business goal and we&apos;ll show you the right services.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {goals.map((goal, index) => {
            const Icon = goal.icon;
            
            return (
              <motion.button
                key={goal.id}
                onClick={handleScroll}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group relative flex items-center justify-between rounded-[12px] border border-white/10 bg-[var(--surface)] p-5 text-left shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_15px_40px_rgba(247,146,30,0.15)]"
              >
                {/* Subtle internal glow on hover */}
                <div className="absolute inset-0 rounded-[12px] bg-gradient-to-r from-[var(--accent)]/20 to-[var(--primary)]/0 opacity-0 transition-opacity duration-300 group-hover:from-[var(--accent)]/20 group-hover:to-transparent group-hover:opacity-100" />
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-white/5 border border-white/5 transition-colors duration-300 group-hover:bg-white/10 group-hover:border-white/10 ${goal.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-heading text-[1.1rem] font-semibold text-white group-hover:text-[var(--accent)] transition-colors duration-300">
                    {goal.label}
                  </span>
                </div>
                
                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
