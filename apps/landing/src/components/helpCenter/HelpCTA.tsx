"use client";

import Link from "next/link";
import { MessageSquareText, CalendarDays, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";

export function HelpCTA() {
  return (
    <SectionCard className="relative overflow-hidden p-8 sm:p-12 border-[var(--accent)]/30">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-[var(--accent)]/5" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent)]/10 blur-[100px]" />
      
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[2rem] font-black leading-tight text-white sm:text-[2.5rem]"
        >
          Still can't find your answer?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 max-w-2xl text-[1.05rem] text-white/70"
        >
          Our experts are just one message away. Reach out to us through your preferred channel and we'll get back to you immediately.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row w-full max-w-3xl"
        >
          <Link
            href="https://wa.me/918982948199"
            target="_blank"
            className="group flex h-14 w-full sm:w-auto flex-1 items-center justify-center gap-3 rounded-[12px] bg-[#25D366]/10 border border-[#25D366]/30 px-6 text-[0.95rem] font-bold text-[#25D366] transition-all hover:bg-[#25D366] hover:text-white hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]"
          >
            <MessageSquareText className="h-5 w-5" />
            Chat on WhatsApp
          </Link>
          <Link
            href="/contact?type=consultation"
            className="group flex h-14 w-full sm:w-auto flex-1 items-center justify-center gap-3 rounded-[12px] bg-[var(--accent)] border border-[var(--accent)] px-6 text-[0.95rem] font-bold text-black transition-all hover:bg-[var(--accent-hover)] hover:shadow-[0_0_20px_var(--accent-glow)]"
          >
            <CalendarDays className="h-5 w-5" />
            Book Consultation
          </Link>
          <Link
            href="mailto:hello@thesimbolo.com"
            className="group flex h-14 w-full sm:w-auto flex-1 items-center justify-center gap-3 rounded-[12px] bg-white/5 border border-white/10 px-6 text-[0.95rem] font-bold text-white transition-all hover:bg-white/10 hover:border-white/30"
          >
            <Mail className="h-5 w-5" />
            Send Email
          </Link>
        </motion.div>
      </div>
    </SectionCard>
  );
}
