"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export function BottomCTA() {
  return (
    <section className="relative py-24 px-4 sm:px-8 lg:px-10 overflow-hidden bg-[var(--sidebar)]">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-[var(--primary)]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[800px] text-center">
        <h2 className="text-[2.5rem] font-black leading-tight text-white sm:text-[3.5rem] md:text-[4rem]">
          Ready to <span className="bg-gradient-to-r from-[var(--primary)] to-[#14B8A6] bg-clip-text text-transparent">Grow Your Business?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-[600px] text-[1.1rem] leading-7 text-[var(--muted)]">
          Partner with The Simbolo and let our experts build a tailored digital strategy that drives real revenue and scalable growth.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
 className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-8 text-[1rem] font-bold text-[#ffffff] transition-all duration-300 hover:bg-[var(--primary-hover)] hover:-translate-y-[2px] hover:shadow-[0_12px_28px_var(--primary-glow)] active:bg-[var(--primary-active)] sm:w-auto"
          >
            Talk To Expert
            <Phone className="h-4 w-4 transition-transform group-hover:rotate-12" />
          </Link>
          <Link
            href="/free-audit"
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 text-[1rem] font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 sm:w-auto"
          >
            Get Free Consultation
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
