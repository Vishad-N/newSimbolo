"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, HandCoins, Smile } from "lucide-react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";

export function BottomCTA() {
  return (
    <SectionCard className="p-8 md:p-12 relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[600px] rounded-full bg-[var(--primary)]/10 blur-[100px]" />
      
      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
        
        {/* Left Side: Mascot & Text */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left md:flex-row md:gap-6">
          <motion.div 
            animate={{ y: [0, -8, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-[var(--accent)]/30 shadow-[0_0_30px_rgba(233,2,181,0.2)] md:h-32 md:w-32 bg-[var(--surface)]"
          >
            <Image src="https://images.unsplash.com/photo-1558655146-d09347e92766?w=200&q=80" alt="Affiliate Mascot" fill className="object-cover" />
          </motion.div>
          
          <div className="mt-4 md:mt-0 max-w-[320px]">
            <h2 className="text-[1.8rem] md:text-[2.2rem] font-semibold leading-tight text-white">
              Ready to Start Earning?
            </h2>
            <p className="mt-2 text-[0.9rem] text-white/70 leading-relaxed">
              Join hundreds of affiliates who are already earning with The Simbolo.
            </p>
          </div>
        </div>

        {/* Right Side: Stats & CTA */}
        <div className="flex w-full flex-col items-center gap-6 md:w-auto md:items-end">
          <div className="flex w-full flex-wrap justify-center gap-6 md:justify-end">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-[var(--accent)]" />
              <div>
                <div className="font-heading text-[1.3rem] font-bold text-white leading-none">1,000+</div>
                <div className="text-[0.7rem] font-semibold text-white/50 mt-1">Active Affiliates</div>
              </div>
            </div>
            
            <div className="h-10 w-[1px] bg-white/10 hidden sm:block" />
            
            <div className="flex items-center gap-3">
              <HandCoins className="h-8 w-8 text-[var(--accent)]" />
              <div>
                <div className="font-heading text-[1.3rem] font-bold text-white leading-none">₹50L+</div>
                <div className="text-[0.7rem] font-semibold text-white/50 mt-1">Paid to Affiliates</div>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-3">
              <Smile className="h-8 w-8 text-[var(--accent)]" />
              <div>
                <div className="font-heading text-[1.3rem] font-bold text-white leading-none">98%</div>
                <div className="text-[0.7rem] font-semibold text-white/50 mt-1">Satisfaction Rate</div>
              </div>
            </div>
          </div>
          
 <Link href="/contact?type=affiliate" className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--primary)] px-8 text-[0.95rem] font-heading font-semibold tracking-[0.2px] normal-case text-[#ffffff] transition hover:bg-[var(--primary-hover)] hover:-translate-y-[2px] hover:shadow-[0_12px_28px_var(--primary-glow)] active:bg-[var(--primary-active)] md:w-auto">
            Join Affiliate Program
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
      </div>
    </SectionCard>
  );
}
