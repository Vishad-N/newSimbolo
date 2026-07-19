"use client";

import { ArrowRight } from "lucide-react";
import { SectionCard } from "@/components/seo/SectionCard";
import type { ReactNode } from "react";

type LeadFormProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  children?: ReactNode;
};

const defaultFields = ["Your Name", "Email Address", "Phone Number", "Website / Business (Optional)"];

export function LeadForm({ title = "Get Your Free Audit", description = "Submit your details and our expert will analyze your account & share a custom growth plan.", buttonText = "Get Free Audit", children }: LeadFormProps) {
  return (
    <SectionCard className="p-4">
      <h2 className="text-[1.08rem] font-black text-white">{title}</h2>
      <p className="mt-3 text-[0.76rem] leading-5 text-white/72">{description}</p>
      <form className="mt-4 space-y-2">
        {children ? (
          children
        ) : (
          defaultFields.map((field) => (
            <input
              key={field}
              aria-label={field}
              placeholder={field}
              className="h-10 w-full rounded-[8px] border border-white/10 bg-[var(--background)]/44 px-3 text-[0.78rem] text-white outline-none transition placeholder:text-white/42 focus:border-[var(--primary)]/60"
            />
          ))
        )}
        <button type="button" className="mt-3 inline-flex h-11 w-full items-center justify-center gap-3 rounded-[8px] bg-[var(--primary)] text-[0.86rem] font-black text-white shadow-[0_12px_26px_var(--primary-glow)] transition hover:bg-[var(--primary-hover)]">
          {buttonText}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex -space-x-2">
          {["VR", "AK", "NS", "DM", "RP"].map((avatar) => (
            <div key={avatar} className="grid h-8 w-8 place-items-center rounded-full border-2 border-[var(--card)] bg-[var(--primary)] text-[0.62rem] font-black text-white">
              {avatar}
            </div>
          ))}
        </div>
        <p className="text-[0.72rem] font-semibold leading-4 text-white/78">Loved by 1,000+ business owners</p>
      </div>
    </SectionCard>
  );
}
