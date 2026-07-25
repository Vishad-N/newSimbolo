"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare, Building2 } from "lucide-react";
import { motion } from "framer-motion";

type AboutHeroProps = {
  badge: string;
  title: string;
  description: string;
  primaryCta: { text: string; href: string };
  secondaryCta: { text: string; href: string };
};

export function AboutHero({ badge, title, description, primaryCta, secondaryCta }: AboutHeroProps) {
  return (
    <section className="relative flex lg:min-h-[65vh] min-h-[60vh] w-full flex-col justify-center overflow-hidden pt-24 pb-12 px-6">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-[var(--primary)]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[25rem] h-[25rem] bg-cyan-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-semibold text-gray-300 mb-6 backdrop-blur-md"
        >
          <Building2 className="w-4 h-4 text-[var(--primary)]" />
          {badge}
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight"
        >
          {title.split(' ').map((word, i, arr) => (
            i === arr.length - 1 || i === arr.length - 2 ? (
              <span key={i} className={i === arr.length - 2 ? "text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-cyan-400" : "text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-cyan-400"}>
                {word}{' '}
              </span>
            ) : (
              <span key={i}>{word} </span>
            )
          ))}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {description}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href={primaryCta.href} className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-[8px] bg-[var(--primary)] px-8 text-[0.95rem] font-heading font-semibold text-white transition duration-300 hover:bg-[var(--primary-hover)] hover:-translate-y-[2px] hover:shadow-[0_12px_28px_var(--primary-glow)] active:bg-[var(--primary-active)]">
            {primaryCta.text}
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
          <Link href={secondaryCta.href} className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-[8px] border border-[var(--accent)]/50 px-8 text-[0.95rem] font-heading font-medium text-white transition duration-300 hover:bg-[var(--accent-glow)]">
            <MessageSquare className="h-4 w-4 shrink-0" />
            {secondaryCta.text}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
