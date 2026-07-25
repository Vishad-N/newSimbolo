"use client";

import { motion } from "framer-motion";

type TimelineEvent = {
  year: string;
  title: string;
  description: string;
};

type CompanyTimelineProps = {
  timeline: TimelineEvent[];
};

export function CompanyTimeline({ timeline }: CompanyTimelineProps) {
  return (
    <section className="py-24 px-6 relative z-10">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Our Journey</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From our humble beginnings to where we are today, and where we are heading tomorrow.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2" />
          
          <div className="space-y-12">
            {timeline.map((event, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div key={event.year} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--primary)] shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)] z-10 mt-1 md:mt-0" />

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pl-16' : 'md:pr-16 text-left md:text-right'}`}
                  >
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors inline-block w-full">
                      <span className="inline-block px-3 py-1 mb-4 rounded-full bg-cyan-500/10 text-cyan-400 font-bold text-sm border border-cyan-500/20">
                        {event.year}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {event.description}
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
