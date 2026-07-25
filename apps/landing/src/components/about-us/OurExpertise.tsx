"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

type Stat = {
  value: string;
  suffix?: string;
  prefix?: string;
  label: string;
};

type OurExpertiseProps = {
  stats: Stat[];
};

function AnimatedCounter({ value, inView }: { value: string; inView: boolean }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const target = parseFloat(value.replace(/,/g, ''));
  const isDecimal = value.includes('.');

  useEffect(() => {
    if (!inView || !spanRef.current) return;
    
    let startTime: number;
    const duration = 2000; // 2 seconds

    const updateCounter = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = easeProgress * target;

      if (spanRef.current) {
        spanRef.current.textContent = isDecimal ? currentCount.toFixed(1) : Math.floor(currentCount).toString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [target, inView, isDecimal]);

  return (
    <span ref={spanRef}>
      {isDecimal ? "0.0" : "0"}
    </span>
  );
}

export function OurExpertise({ stats }: OurExpertiseProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 px-6 relative z-10" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Our Expertise in Numbers</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The results speak for themselves. We're proud of the impact we've made for our clients over the years.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center group hover:bg-white/[0.04] transition-colors"
            >
              <div className="text-5xl md:text-6xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {stat.prefix}
                <AnimatedCounter value={stat.value} inView={isInView} />
                <span className="text-[var(--primary)]">{stat.suffix}</span>
              </div>
              <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
