"use client";

import { motion } from "framer-motion";
import { HeartPulse, UtensilsCrossed, Building2, GraduationCap, Factory, Rocket, Code2, ShoppingBag, Landmark, Plane } from "lucide-react";

const industries = [
  { name: "Healthcare", icon: HeartPulse, description: "Clinics, Hospitals & Telehealth" },
  { name: "Restaurants", icon: UtensilsCrossed, description: "Fine Dining, Cafes & Franchises" },
  { name: "Real Estate", icon: Building2, description: "Agencies, Brokers & Developers" },
  { name: "Education", icon: GraduationCap, description: "Schools, Universities & EdTech" },
  { name: "Manufacturing", icon: Factory, description: "B2B, Industrial & Suppliers" },
  { name: "Startups", icon: Rocket, description: "Pre-seed, Funded & Disruptors" },
  { name: "SaaS", icon: Code2, description: "Software, Cloud & B2B Tech" },
  { name: "E-Commerce", icon: ShoppingBag, description: "DTC, Retail & Marketplaces" },
  { name: "Finance", icon: Landmark, description: "Fintech, Wealth & Insurance" },
  { name: "Travel", icon: Plane, description: "Agencies, Hospitality & Tourism" }
];

export function IndustriesServed() {
  return (
    <section className="py-20 px-4 sm:px-8 lg:px-10 border-t border-white/5 bg-[var(--background)]">
      <div className="mx-auto max-w-[1290px]">
        <div className="mb-12 text-center">
          <h2 className="text-[2rem] font-bold text-white sm:text-[2.5rem]">
            Industries We <span className="text-[var(--primary)]">Serve</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-[1rem] text-[var(--muted)]">
            We tailor our strategies to fit the unique challenges and opportunities of your specific industry.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative flex flex-col items-center justify-center rounded-[16px] border border-white/10 bg-[var(--surface)] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/50 hover:bg-[var(--surface)] hover:shadow-[0_10px_30px_rgba(247,146,30,0.1)]"
              >
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-white/5 text-[var(--primary)] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[var(--primary)]/10">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 text-[1.05rem] font-semibold text-white">{industry.name}</h3>
                <p className="text-[0.75rem] text-[var(--muted)] leading-tight">{industry.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
