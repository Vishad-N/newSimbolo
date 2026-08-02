"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Briefcase, Clock, Zap, ExternalLink, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Expert } from "@/types/search";

interface ExpertModalProps {
  expert: Expert | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExpertModal({ expert, isOpen, onClose }: ExpertModalProps) {
  if (!expert) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[24px] border border-white/[0.08] bg-[var(--surface)] shadow-[0_24px_48px_rgba(0,0,0,0.4)] pointer-events-auto"
            >
              {/* Header */}
              <div className="relative border-b border-white/[0.08] p-6 pb-4">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex gap-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/10">
                    <Image src={expert.imageUrl} alt={expert.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-white">{expert.name}</h2>
                      {expert.isSimboloExpert && (
                        <span className="rounded-full bg-[var(--primary)]/20 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--primary)]">
                          Official Simbolo Expert
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--muted)]">{expert.title}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs font-medium">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <Star className="h-4 w-4 fill-amber-400" />
                        {expert.rating} Rating
                      </div>
                      <div className="h-1 w-1 rounded-full bg-white/20" />
                      <div className="flex items-center gap-1.5 text-[var(--text-primary)]">
                        <Briefcase className="h-4 w-4 text-[var(--muted)]" />
                        {expert.projectsCompleted} Projects
                      </div>
                      <div className="h-1 w-1 rounded-full bg-white/20" />
                      <div className="flex items-center gap-1.5 text-[var(--text-primary)]">
                        <Clock className="h-4 w-4 text-[var(--muted)]" />
                        {expert.availability}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-white">Experience & Background</h3>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">{expert.experience}</p>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-white">Top Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {expert.skills.map((skill) => (
                      <div key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--text-primary)]">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-[16px] bg-black/20 p-4">
                  <div>
                    <p className="text-xs text-[var(--muted)]">Specialization</p>
                    <p className="mt-1 text-sm font-semibold text-white">{expert.specialization}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)]">Avg. Response Time</p>
                    <p className="mt-1 text-sm font-semibold text-white flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-amber-400" />
                      {expert.responseTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-white/[0.08] bg-white/[0.02] p-6 text-center">
                <p className="mb-4 text-xs text-[var(--muted)]">This expert is available exclusively through Simbolo.</p>
                <div className="flex justify-center gap-3">
                  <Link href="/packages" onClick={onClose}>
                    <button className="flex h-11 items-center justify-center gap-2 rounded-[12px] bg-white/5 border border-white/10 px-6 text-sm font-semibold text-white transition hover:bg-white/10">
                      View Packages
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </Link>
                  <Link href="/packages" onClick={onClose}>
                    <button className="flex h-11 items-center justify-center gap-2 rounded-[12px] bg-[var(--primary)] px-8 text-sm font-semibold text-white shadow-[0_8px_16px_var(--primary-glow)] transition hover:scale-105 hover:bg-[var(--primary-hover)]">
                      Hire Expert
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
