"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type Reason = {
  title: string;
  description: string;
};

type WhyChooseUsProps = {
  reasons: Reason[];
};

export function WhyChooseUs({ reasons }: WhyChooseUsProps) {
  return (
    <section className="py-24 px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/3 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Why Choose<br/><span className="text-[var(--primary)]">The Simbolo?</span></h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              We combine deep industry expertise with cutting-edge technology to deliver solutions that actually impact your bottom line.
            </p>
          </div>
          
          <div className="lg:w-2/3 w-full grid sm:grid-cols-2 gap-4">
            {reasons.map((reason, i) => (
              <motion.div 
                key={reason.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <CheckCircle2 className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-bold mb-1">{reason.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{reason.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
