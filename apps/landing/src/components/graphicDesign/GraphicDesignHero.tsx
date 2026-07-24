"use client";

import Image from "next/image";
import Link from "next/link";
import { Palette } from "lucide-react";
import { motion } from "framer-motion";
import { ServiceHero } from "@/components/shared/ServiceHero";

type GraphicDesignHeroProps = {
  benefits: string[];
};

function HeroVisual() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18, duration: 0.65 }} className="relative h-[340px] w-full">
      <div className="absolute inset-0 scale-[0.80] md:scale-[0.85] origin-top md:origin-right">
      <div className="absolute inset-0 md:-translate-x-[150px] transition-transform duration-500">
      <div className="absolute left-0 top-12 hidden h-[320px] w-[320px] rounded-full border border-[#E902B5]/20 bg-[#E902B5]/5 shadow-[0_0_70px_rgba(233,2,181,0.14)] md:block" />
      
      {/* Large Monitor */}
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute left-[15%] top-[12%] z-20 hidden md:block w-[420px] h-[280px] rounded-[16px] overflow-hidden border-[4px] border-[#1e1e1e] bg-black shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
        <div className="h-4 bg-[#2d2d2d] w-full flex items-center px-2 gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          <div className="h-2 w-2 rounded-full bg-green-500" />
        </div>
        <Image src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80" alt="Design Workspace" width={420} height={280} className="w-full h-full object-cover opacity-90" priority />
        <div className="absolute inset-0 bg-linear-to-tr from-[#E902B5]/20 to-transparent" />
      </motion.div>

      {/* Floating Mascot / Pen Tablet (Simulated with image/icon) */}
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut" }} className="absolute left-[60%] top-[35%] z-30 hidden md:flex items-center justify-center w-[160px] h-[160px] rounded-full bg-black/50 backdrop-blur-md border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[var(--primary)] p-2">
            <Image src="https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80" alt="Creative Mascot" width={160} height={160} className="w-full h-full object-cover rounded-full" />
        </div>
      </motion.div>

      {/* Floating Photoshop Icon */}
      <motion.div animate={{ y: [0, -12, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }} className="absolute left-[5%] top-[20%] z-40 hidden h-14 w-14 place-items-center rounded-[14px] border border-[#31A8FF]/30 bg-[#001E36] text-[1.4rem] font-black text-[#31A8FF] shadow-[0_15px_30px_rgba(0,30,54,0.5)] md:grid">
        Ps
      </motion.div>
      
      {/* Floating Illustrator Icon */}
      <motion.div animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5.8, ease: "easeInOut" }} className="absolute left-[45%] top-[2%] z-40 hidden h-14 w-14 place-items-center rounded-[14px] border border-[#FF9A00]/30 bg-[#330000] text-[1.4rem] font-black text-[#FF9A00] shadow-[0_15px_30px_rgba(51,0,0,0.5)] md:grid">
        Ai
      </motion.div>

      {/* Floating InDesign Icon */}
      <motion.div animate={{ y: [0, -8, 0], rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 6.2, ease: "easeInOut" }} className="absolute left-[85%] top-[15%] z-40 hidden h-12 w-12 place-items-center rounded-[12px] border border-[#FF3366]/30 bg-[#49021F] text-[1.2rem] font-black text-[#FF3366] shadow-[0_15px_30px_rgba(73,2,31,0.5)] md:grid">
        Id
      </motion.div>
      </div>

      <div className="absolute right-0 top-[60%] w-full max-w-[280px] z-40 hidden lg:block">
        <div className="relative overflow-hidden rounded-[8px] border border-[var(--accent)]/603530 bg-[color-mix(in_srgb,var(--card)_85%,transparent)] p-5 shadow-[0_22px_52px_rgba(0,0,0,0.3)] backdrop-blur-md">
          <div className="absolute inset-0 bg-radial-[circle_at_50%_0%] from-[var(--accent-glow)] to-transparent opacity-20" />
          <h3 className="text-[1rem] font-black text-white relative">Need Something Custom?</h3>
          <p className="text-[0.75rem] text-white/70 mt-2 leading-relaxed relative">
            Tell us your requirements and we&apos;ll create the perfect design solution for you.
          </p>
 <Link href="/contact?service=graphic-design-custom" className="relative mt-4 inline-flex h-9 w-full items-center justify-center rounded-[6px] bg-[var(--primary)] text-[0.8rem] font-bold text-[#ffffff] transition hover:bg-[var(--primary-hover)] hover:-translate-y-[2px] hover:shadow-[0_12px_28px_var(--primary-glow)] active:bg-[var(--primary-active)]">
            Request Custom Design
          </Link>
        </div>
      </div>
      </div>
    </motion.div>
  );
}

export function GraphicDesignHero({ benefits }: GraphicDesignHeroProps) {
  return (
    <ServiceHero
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Services", href: "/#services" },
        { label: "Graphic Design" },
      ]}
      badge={{
        icon: Palette,
        text: "GRAPHIC DESIGN SERVICES",
      }}
      title={
        <>
          Creative Designs That{" "}
          <span className="block text-[var(--accent)]">
            Build Your Brand
          </span>
        </>
      }
      description="Transform your brand's visual identity with our expert graphic design services. We craft compelling visuals that resonate."
      benefits={benefits}
      primaryCta={{
        text: "Get Free Design Quote",
        href: "/contact?service=graphic-design-quote",
      }}
      secondaryCta={{
        text: "Talk to Expert",
        href: "/contact?service=graphic-design-expert",
      }}
      visual={<HeroVisual />}
    />
  );
}
