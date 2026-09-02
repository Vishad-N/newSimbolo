"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CTAProps = {
  title: string;
  subtitle: string;
  primaryButton: { text: string; href: string };
};

export function FinalCTA({ title, subtitle, primaryButton }: CTAProps) {
  return (
    <section className="pt-4 pb-16 md:py-24 px-6 relative z-10 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[20rem] bg-[var(--primary)]/20 rounded-[100%] blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl text-center">
        <div className="p-12 md:p-16 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-md shadow-2xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto font-light">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={primaryButton.href} className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-xl bg-[var(--primary)] px-10 text-lg font-heading font-semibold text-white transition duration-300 hover:bg-[var(--primary-hover)] hover:-translate-y-1 hover:shadow-[0_15px_35px_var(--primary-glow)] active:bg-[var(--primary-active)]">
              {primaryButton.text}
              <ArrowRight className="h-5 w-5 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
