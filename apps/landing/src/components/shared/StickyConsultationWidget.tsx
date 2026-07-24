"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CalendarDays, X } from "lucide-react";

export function StickyConsultationWidget() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a slight delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-[5.5rem] z-50 flex items-center"
        >
          <div className="relative flex overflow-hidden rounded-full border border-[var(--accent)]/30 bg-[var(--surface)] shadow-[0_10px_40px_rgba(34,211,238,0.2)] backdrop-blur-xl">
            <Link 
              href="/contact?type=consultation"
              className="group flex items-center gap-3 px-5 py-2.5 transition hover:bg-[var(--accent)]/10"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-black">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div className="flex flex-col pr-2">
                <span className="text-[0.8rem] font-bold text-white transition-colors group-hover:text-[var(--accent)]">
                  Request Free Consultation
                </span>
                <span className="text-[0.65rem] font-medium text-white/50">
                  Let's discuss your project
                </span>
              </div>
            </Link>
            <button 
              onClick={() => setIsVisible(false)}
              className="flex items-center justify-center border-l border-white/10 px-3 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Close widget"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
