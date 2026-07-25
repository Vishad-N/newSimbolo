"use client";

import { motion } from "framer-motion";

type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

type OurProcessProps = {
  process: ProcessStep[];
};

export function OurProcess({ process }: OurProcessProps) {
  return (
    <section className="py-24 px-6 bg-white/[0.01]">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Our Process</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A proven methodology designed to take your idea from concept to successful launch and beyond.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line connecting steps on desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
          
          <div className="space-y-12 md:space-y-0">
            {process.map((item, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div key={item.step} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''} md:mb-12`}>
                  {/* Timeline dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[var(--background)] border-2 border-[var(--primary)] items-center justify-center z-10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]">
                    <span className="text-xs font-bold text-white">{item.step}</span>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className={`w-full md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16'}`}
                  >
                    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors relative group">
                      <div className="md:hidden w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold flex items-center justify-center mb-4">
                        {item.step}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[var(--primary)] transition-colors">{item.title}</h3>
                      <p className="text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
