"use client";

import Image from "next/image";
import { Check, ShoppingCart, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { ServiceHero } from "@/components/shared/ServiceHero";

type EcommerceHeroProps = {
  benefits: string[];
};

function HeroVisual() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18, duration: 0.65 }} className="relative h-[340px] w-full">
      <div className="absolute inset-0 scale-[0.80] md:scale-[0.85] origin-top md:origin-right">
      <div className="absolute inset-0 md:-translate-x-[150px] transition-transform duration-500">
      <div className="absolute left-0 top-12 hidden h-[320px] w-[320px] rounded-full border border-[var(--secondary)]/20 bg-[var(--secondary)]/5 shadow-[0_0_70px_rgba(45,212,191,0.14)] md:block" />
      
      {/* Main Illustration */}
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute left-[10%] top-[10%] z-20 hidden md:block w-[460px] h-[340px] rounded-[16px] overflow-hidden border-[4px] border-[#1e1e1e] bg-black shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
        <Image src="/images/services/ecommerce-illustration.png" alt="Ecommerce Dashboard Preview" width={460} height={340} className="w-full h-full object-cover opacity-90" priority />
        <div className="absolute inset-0 bg-linear-to-tr from-[var(--accent)]/20 to-transparent" />
      </motion.div>

      {/* Floating E-commerce Icon 1 */}
      <motion.div animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }} className="absolute left-[5%] top-[20%] z-40 hidden h-14 w-14 place-items-center rounded-2xl border border-green-500/30 bg-[#20232a] text-[1.4rem] font-black text-green-500 shadow-[0_15px_30px_rgba(32,35,42,0.5)] md:grid">
        <ShoppingCart className="h-7 w-7" />
      </motion.div>
      
      {/* Floating E-commerce Icon 2 */}
      <motion.div animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5.8, ease: "easeInOut" }} className="absolute left-[65%] top-[5%] z-40 hidden h-14 w-14 place-items-center rounded-2xl border border-purple-500/30 bg-black text-purple-500 shadow-[0_15px_30px_rgba(0,0,0,0.5)] md:grid">
        <Smartphone className="h-7 w-7" />
      </motion.div>
      </div>

      <div className="absolute right-0 top-[60%] w-full max-w-[280px] z-40 hidden lg:block">
        <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[color-mix(in_srgb,var(--card)_85%,transparent)] p-4 shadow-[0_22px_52px_rgba(0,0,0,0.3)] backdrop-blur-md">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="h-8 w-8 rounded-full bg-[var(--primary)]/20 grid place-items-center text-[var(--accent)]">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[0.75rem] text-white/70">Conversion Rate</div>
              <div className="text-[1rem] font-black text-white">+ 45%</div>
            </div>
          </div>
          <div className="pt-3">
             <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-[var(--accent)] w-[85%]" />
             </div>
             <div className="mt-2 flex justify-between text-[0.65rem] text-white/50">
               <span>Traffic: High</span>
               <span>Sales: Peak</span>
             </div>
          </div>
        </div>
      </div>
      </div>
    </motion.div>
  );
}

export function EcommerceHero({ benefits }: EcommerceHeroProps) {
  return (
    <ServiceHero
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Services", href: "/#services" },
        { label: "E-Commerce" },
      ]}
      badge={{
        icon: ShoppingCart,
        text: "E-Commerce Development",
      }}
      title={
        <>
          Build High-Converting
          <span className="block text-[var(--accent)]">
            E-Commerce Stores
          </span>
          That Drive Sales
        </>
      }
      description="Launch scalable online stores with Shopify, WooCommerce, Magento and custom solutions designed for maximum conversions."
      benefits={benefits}
      primaryCta={{
        text: "Get Free Consultation",
        href: "/contact?service=ecommerce-consultation",
      }}
      secondaryCta={{
        text: "Talk To Expert",
        href: "/contact?service=ecommerce-expert",
      }}
      visual={<HeroVisual />}
    />
  );
}
