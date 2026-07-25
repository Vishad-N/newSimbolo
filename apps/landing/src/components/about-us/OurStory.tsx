"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

type OurStoryProps = {
  title: string;
  subtitle: string;
  content: string;
  quote: string;
  image: string;
};

export function OurStory({ title, subtitle, content, quote, image }: OurStoryProps) {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-semibold text-[var(--primary)] backdrop-blur-md">
              {title}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              {subtitle}
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              {content}
            </p>
            
            <div className="relative mt-8 p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
              <Quote className="absolute top-4 left-4 w-10 h-10 text-[var(--primary)]/20 rotate-180" />
              <p className="relative z-10 text-xl font-medium text-white italic pl-6 border-l-2 border-[var(--primary)]">
                "{quote}"
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-white/5 border border-white/10 relative">
              {/* Fallback pattern if image is just a placeholder path */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 to-cyan-500/10 flex items-center justify-center">
                <span className="text-white/30 font-medium">Story Illustration</span>
              </div>
              {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={image} 
                  alt="Our Story" 
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[var(--primary)] rounded-full blur-[80px] opacity-40 z-[-1]" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-cyan-400 rounded-full blur-[80px] opacity-30 z-[-1]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
