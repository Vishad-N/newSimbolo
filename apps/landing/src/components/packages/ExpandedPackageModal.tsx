"use client";

import { useEffect, useState } from "react";
import { X, Check, ArrowRight, Zap, Target, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { MarketingPackage, BillingCycle } from "@/types/packages";

type ExpandedPackageModalProps = {
  pkg: MarketingPackage | null;
  isOpen: boolean;
  onClose: () => void;
  defaultBilling?: BillingCycle;
};

export function ExpandedPackageModal({ pkg, isOpen, onClose, defaultBilling = "monthly" }: ExpandedPackageModalProps) {
  const [billing, setBilling] = useState<BillingCycle>(defaultBilling);

  // Sync default billing when modal opens
  useEffect(() => {
    if (isOpen) {
      setBilling(defaultBilling);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, defaultBilling]);

  if (!pkg) return null;

  const isYearly = billing === "yearly";
  const currentPrice = isYearly ? pkg.priceYearly : pkg.priceMonthly;
  const features = Array.isArray(pkg.features) ? pkg.features : [];
  
  const displayPrice = currentPrice 
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(currentPrice) 
    : "Custom Pricing";
  const displayPeriod = currentPrice ? (isYearly ? "/ Year" : "/ Month") : "";

  // Optional: calculate discount for yearly
  const monthlyEquivalent = (pkg.priceYearly || 0) / 12;
  const standardMonthly = pkg.priceMonthly || 0;
  const hasDiscount = isYearly && currentPrice && standardMonthly > monthlyEquivalent;
  const discountPercent = hasDiscount ? Math.round(((standardMonthly - monthlyEquivalent) / standardMonthly) * 100) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="expanded-package-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
            className="relative flex w-full max-w-[1200px] flex-col overflow-hidden rounded-[24px] p-[1.5px] shadow-[0_30px_100px_rgba(0,0,0,0.8),0_0_40px_var(--accent-glow)]"
          >
            {/* Animated Revolving Border */}
            <div className="pointer-events-none absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,#00f0ff_100%)] opacity-80" />
            
            {/* Inner Content Container */}
            <div className="relative flex max-h-[95vh] w-full flex-col overflow-hidden rounded-[23px] bg-[var(--background)] lg:flex-row lg:max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-[var(--accent)] hover:text-black"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left/Top Panel - Hero & Pricing */}
            <div className="relative flex flex-col bg-[var(--surface)] p-6 lg:p-8 lg:w-5/12 xl:w-1/3 border-r border-white/5 overflow-y-auto custom-scrollbar">
              
              <div className="mb-6">
                {pkg.badge && (
                  <span className="font-heading mb-4 inline-block rounded-full bg-[var(--accent)] px-3 py-1 text-[0.7rem] font-black uppercase tracking-wider text-black">
                    {pkg.badge}
                  </span>
                )}
                <h2 id="expanded-package-title" className="font-heading text-[2.5rem] font-black leading-tight text-white">{pkg.name}</h2>
                <p className="mt-2 text-[1rem] font-medium text-[var(--accent)]">{pkg.subtitle}</p>
                <p className="mt-4 text-[0.95rem] text-white/60 leading-relaxed">{pkg.shortDescription}</p>
              </div>

              {/* Pricing Toggle */}
              {pkg.priceMonthly && pkg.priceYearly && (
                <div className="mb-6 flex flex-col rounded-[12px] border border-[var(--toggle-border)] bg-[var(--toggle-container)] p-1.5">
                  <div className="relative flex">
                    <motion.div
                      layout
                      className="absolute bottom-0 left-0 top-0 w-1/2 rounded-[8px] bg-[var(--toggle-active)] shadow-sm"
                      initial={false}
                      animate={{ x: isYearly ? "100%" : "0%" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <button
                      onClick={() => setBilling("monthly")}
                      className={`relative z-10 w-1/2 py-2.5 text-[0.85rem] font-bold transition-colors ${!isYearly ? "text-[var(--toggle-text-active)]" : "text-[var(--toggle-text)] hover:text-[var(--toggle-text-hover)]"}`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBilling("yearly")}
                      className={`relative z-10 flex w-1/2 items-center justify-center gap-2 py-2.5 text-[0.85rem] font-bold transition-colors ${isYearly ? "text-[var(--toggle-text-active)]" : "text-[var(--toggle-text)] hover:text-[var(--toggle-text-hover)]"}`}
                    >
                      Yearly
                      <span className="rounded-full bg-[var(--accent)]/20 px-2 py-0.5 text-[0.65rem] text-[var(--accent)]">Save 20%</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Price Display */}
              <div className="mb-6">
                <motion.div
                  key={billing} // Re-animate on toggle
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-baseline gap-2"
                >
                  <span className="font-heading text-[3rem] font-black text-white leading-none tracking-tight">{displayPrice}</span>
                  <span className="text-[1rem] font-medium text-white/50">{displayPeriod}</span>
                </motion.div>
                {hasDiscount && (
                  <p className="mt-2 text-[0.85rem] text-[var(--accent)] font-medium">
                    That's equivalent to ₹{monthlyEquivalent.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / month!
                  </p>
                )}
              </div>

              {/* Ideal For */}
              {pkg.idealFor && pkg.idealFor.length > 0 && (
                <div className="mb-auto">
                  <h4 className="font-heading mb-3 text-[0.8rem] font-bold uppercase tracking-wider text-white/40 flex items-center gap-2">
                    <Target className="h-4 w-4" /> Ideal For
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {pkg.idealFor.map(item => (
                      <span key={item} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[0.75rem] text-white/70">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={pkg.buttonLink}
                  className="animate-heartbeat hover:animate-none flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--accent)] text-[0.95rem] font-bold text-black transition-transform hover:scale-[1.02] hover:bg-[var(--accent-hover)] shadow-[0_0_20px_var(--accent-glow)]"
                >
                  {pkg.buttonText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="?auth=register&checkout=custom"
                  className="flex h-12 w-full items-center justify-center rounded-[8px] border border-white/10 bg-transparent text-[0.95rem] font-bold text-white transition-colors hover:bg-white/5"
                >
                  Talk to an Expert
                </Link>
              </div>

            </div>

            {/* Right/Bottom Panel - Features & Deliverables */}
            <div className="custom-scrollbar flex-1 overflow-y-auto bg-[var(--background)] p-6 lg:p-8">
              
              <div className="grid gap-12 lg:grid-cols-2">
                {/* Features List */}
                <div>
                  <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                      <Zap className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading text-[1.4rem] font-bold text-white">Everything Included</h3>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {features.map((feature, i) => (
                      <li key={i} className="group flex items-start gap-3 rounded-[8px] p-2 transition-all hover:bg-white/5 hover:shadow-[0_0_15px_var(--accent-glow)] -ml-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 mt-0.5 group-hover:bg-[var(--accent)]/40 transition-colors">
                          <Check className="h-3.5 w-3.5 text-[var(--accent)]" />
                        </div>
                        <span className="text-[0.95rem] text-white/80 leading-relaxed group-hover:text-white transition-colors">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deliverables List */}
                {pkg.deliverables && pkg.deliverables.length > 0 && (
                  <div>
                    <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <h3 className="font-heading text-[1.4rem] font-bold text-white">Monthly Deliverables</h3>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {pkg.deliverables.map((item, i) => (
                        <li key={i} className="group flex items-start gap-3 rounded-[8px] p-2 transition-all hover:bg-white/5 hover:shadow-[0_0_15px_var(--accent-glow)] -ml-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 mt-0.5 group-hover:bg-[var(--accent)]/40 group-hover:border-[var(--accent)]/30 transition-colors">
                            <span className="text-[0.7rem] font-bold text-white/50 group-hover:text-[var(--accent)] transition-colors">{i + 1}</span>
                          </div>
                          <span className="text-[0.95rem] font-medium text-white/90 leading-relaxed group-hover:text-white transition-colors">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>
            
            <MascotMessage pkgName={pkg.name} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function MascotMessage({ pkgName }: { pkgName: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [pkgName]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const runCycle = () => {
      const delay = step % 2 === 0 ? 2000 : 4000;
      timer = setTimeout(() => {
        setStep((prev) => (prev + 1) % 6);
      }, delay);
    };
    runCycle();
    return () => clearTimeout(timer);
  }, [step, pkgName]);

  const planMessages: Record<string, string[]> = {
    "Starter": [
      "This covers all the essential basics! ✨",
      "Perfect for kicking things off! 🚀",
      "Ready to grow? Let's get started!"
    ],
    "Growth": [
      "Our most popular choice! 📈",
      "Double down on what works!",
      "Ready to explode your leads?"
    ],
    "Pro": [
      "Maximum ROI and market dominance! 👑",
      "Outperform all your competitors!",
      "Let's scale your business to the moon! 🚀"
    ],
    "Enterprise": [
      "Custom solutions for massive scale! 🏢",
      "Dedicated team, just for you!",
      "Let's build an empire together! 🤝"
    ]
  };

  const msgs = planMessages[pkgName] || [
    "This plan looks absolutely amazing! ✨",
    "Great choice for your goals! 🎯",
    "Shall we get this started? 🚀"
  ];

  const isThinking = step % 2 === 0;
  const msgIndex = Math.floor(step / 2);
  const currentMessage = msgs[msgIndex];

  return (
    <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-10 flex items-end gap-3 z-20 pointer-events-none">
      <div className="relative mb-8 rounded-2xl rounded-br-sm bg-[var(--bubble-bg)] p-4 shadow-[0_15px_40px_rgba(34,211,238,0.25)] text-[0.95rem] font-bold text-[var(--bubble-text)] w-[240px]">
        {/* Speech Bubble Tail */}
        <div className="absolute bottom-3 -right-4 h-5 w-5 bg-[var(--bubble-bg)]" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}></div>
        
        <AnimatePresence mode="wait">
          {isThinking ? (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex justify-center gap-1.5 py-2 px-2"
            >
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            </motion.div>
          ) : (
            <motion.div
              key={`msg-${msgIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center leading-snug"
            >
              {currentMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="relative h-28 w-28 shrink-0 mascot-float drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] -mr-2">
        <Image src="/assets/logo1.png" alt="Simbolo Mascot" fill className="object-contain" />
      </div>
    </div>
  );
}
