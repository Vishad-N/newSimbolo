"use client";

import { motion } from "framer-motion";
import { Search, Lightbulb, PenTool, Code2, Rocket, TrendingUp } from "lucide-react";

const steps = [
  { id: 1, title: "Discover", description: "Deep dive into your brand.", icon: Search },
  { id: 2, title: "Strategy", description: "Data-driven roadmap.", icon: Lightbulb },
  { id: 3, title: "Design", description: "Premium UI/UX and assets.", icon: PenTool },
  { id: 4, title: "Development", description: "Scalable engineering.", icon: Code2 },
  { id: 5, title: "Launch", description: "Go-to-market execution.", icon: Rocket },
  { id: 6, title: "Growth", description: "Continuous optimization.", icon: TrendingUp }
];

export function ProcessTimeline() {
  return (
    <section className="py-12 px-4 sm:px-8 lg:px-10 border-t border-white/5 bg-[var(--background)]">
      <div className="mx-auto max-w-[1290px]">
        <div className="mb-10 text-center">
          <h2 className="text-[2rem] font-bold text-white sm:text-[2.5rem]">
            How We <span className="text-[var(--primary)]">Work</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[600px] text-[1rem] text-[var(--muted)]">
            A proven, transparent process designed to deliver exceptional results.
          </p>
        </div>

        <div className="relative">
          {/* Horizontal Line for Desktop */}
          <div className="absolute top-[64px] left-[8%] right-[8%] h-[2px] bg-white/10 hidden md:block" />
          
          <div className="grid gap-12 md:grid-cols-6 md:gap-4 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex flex-col items-center text-center group rounded-[16px] p-4 pt-6"
                >
                  <div className="absolute inset-0 rounded-[16px] bg-gradient-to-b from-[var(--accent)]/10 to-transparent transition-all duration-300 group-hover:from-[var(--accent)]/20" />
                  
                  {/* Icon Circle */}
                  <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-[2px] border-[var(--accent)]/50 bg-[var(--surface)] text-[var(--accent)] transition-all duration-500 group-hover:scale-110 group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-[#ffffff] group-hover:shadow-[0_0_30px_var(--primary-glow)]">
                    <Icon className="h-8 w-8" />
                    
                    {/* Step Number Badge */}
                    <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface)] border border-white/20 text-[0.7rem] font-bold text-white transition-colors group-hover:border-[var(--primary)]">
                      {step.id}
                    </div>
                  </div>
                  
                  <h3 className="relative z-10 mt-5 mb-1.5 text-[1.05rem] font-bold text-white">{step.title}</h3>
                  <p className="relative z-10 text-[0.85rem] text-[var(--muted)] max-w-[160px] mx-auto leading-tight">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
