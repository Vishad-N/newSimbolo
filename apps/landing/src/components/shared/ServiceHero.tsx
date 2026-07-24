"use client";

import Link from "next/link";
import { ArrowRight, Check, ChevronRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

export type ServiceHeroProps = {
  breadcrumbs: { label: string; href?: string }[];
  badge: {
    icon: ElementType;
    text: ReactNode;
  };
  title: ReactNode;
  description: string;
  benefits?: string[];
  benefitIcon?: ElementType;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta: {
    text: string;
    href: string;
  };
  visual: ReactNode;
};

export function ServiceHero({
  breadcrumbs,
  badge,
  title,
  description,
  benefits,
  benefitIcon: BenefitIcon = Check,
  primaryCta,
  secondaryCta,
  visual,
}: ServiceHeroProps) {
  const BadgeIcon = badge.icon;

  return (
    <section className="relative flex min-h-[60vh] w-full items-center py-12 lg:py-0">
      <div className="grid w-full items-center gap-8 lg:grid-cols-[1.22fr_1fr] lg:items-stretch">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative z-10 flex flex-col justify-center py-1 lg:py-0">
          
          <div className="mb-6 flex items-center gap-2 text-[0.72rem] font-medium text-white/70">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <div key={crumb.label} className="flex items-center gap-2">
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href} className="hover:text-white transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white">{crumb.label}</span>
                  )}
                  {!isLast && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                </div>
              );
            })}
          </div>

          <div className="mb-2.5 inline-flex h-8 w-fit items-center gap-1.5 rounded-full border border-[var(--accent)]/50 bg-[var(--accent-glow)] px-3 text-[0.7rem] font-black uppercase text-[var(--accent)] shadow-[0_0_24px_var(--accent-glow)]">
            <BadgeIcon className="h-4 w-4 shrink-0" />
            {badge.text}
          </div>

          <h1 className="font-heading text-[1.8rem] font-bold leading-[1.05] tracking-tight text-white md:text-[2.2rem] lg:text-[2.6rem] xl:text-[clamp(2.4rem,3vw,3.2rem)] max-w-[760px]">
            {title}
          </h1>

          <p className="mt-2.5 max-w-[560px] text-[0.92rem] leading-[1.6] text-white/84">
            {description}
          </p>

          {benefits && benefits.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-1.5 text-[0.78rem] font-medium text-white/82">
                  <BenefitIcon className="h-3.5 w-3.5 shrink-0 rounded-full border border-[var(--primary)] text-[var(--accent)]" />
                  {benefit}
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
 <Link href={primaryCta.href} className="inline-flex h-11 items-center justify-center gap-2.5 rounded-[8px] bg-[var(--primary)] px-6 text-[0.88rem] font-heading font-semibold normal-case tracking-[0.2px] text-[#ffffff] transition duration-300 hover:bg-[var(--primary-hover)] hover:-translate-y-[2px] hover:shadow-[0_12px_28px_var(--primary-glow)] active:bg-[var(--primary-active)]">
              {primaryCta.text}
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
            <Link href={secondaryCta.href} className="inline-flex h-11 items-center justify-center gap-2.5 rounded-[8px] border border-[var(--accent)]/50 px-6 text-[0.88rem] font-heading font-medium text-white transition duration-300 hover:bg-[var(--accent-glow)]">
              <MessageSquare className="h-4 w-4 shrink-0" />
              {secondaryCta.text}
            </Link>
          </div>
        </motion.div>

        <div className="relative flex h-full w-full items-center justify-center lg:justify-end lg:scale-100 scale-95 origin-center lg:items-stretch py-1 lg:py-0">
          <div className="w-full max-w-[600px] lg:h-full relative">
            {visual}
          </div>
        </div>
      </div>
    </section>
  );
}
