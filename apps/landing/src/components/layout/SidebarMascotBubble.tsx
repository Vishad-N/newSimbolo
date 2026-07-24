"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

const MESSAGES = [
  "👋 What are we building today?",
  "🚀 Ready to grow your business?",
  "📈 Need more traffic?",
  "🎨 Let's create something amazing.",
  "💡 Looking for the right service?",
  "🎬 Need a killer video edit?",
  "🌐 Ready to launch your website?",
  "📊 Let's scale your brand.",
  "🔍 Want better search rankings?",
  "💬 Tell us your business goals.",
];

export function SidebarMascotBubble({ isExpanded = true }: { isExpanded?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only rotate if expanded and not hovered
    if (!isExpanded || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 6000); // 6 seconds

    return () => clearInterval(interval);
  }, [isExpanded, isHovered]);

  if (!isExpanded) return null;

  return (
    <div className="relative mt-2 px-5 pb-4 z-10">
      <Link href="/services/ai-match">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.02 }}
          className="group relative flex cursor-pointer items-start rounded-[12px] border border-white/10 bg-white/5 p-3 shadow-[0_4px_20px_rgba(34,211,238,0.05)] backdrop-blur-md transition-all hover:border-[var(--accent)]/40 hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(34,211,238,0.15)]"
        >
          {/* Pointer tail pointing up towards the mascot logo */}
          <div className="absolute -top-[6px] left-8 h-3 w-3 rotate-45 border-l border-t border-white/10 bg-white/5 transition-colors group-hover:border-[var(--accent)]/40 group-hover:bg-[#1a2235]" />

          <div className="mr-3 mt-0.5 text-[var(--accent)]">
            <MessageSquare className="h-4 w-4" />
          </div>

          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-[0.75rem] font-medium leading-snug text-white/80"
              >
                {MESSAGES[currentIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}

export function SidebarBackgroundDecoration() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
      {/* Subtle radial glow */}
      <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-[var(--accent)]/20 blur-[40px]" />
      
      {/* Abstract mesh/dots pattern (using radial gradient as dots) */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }}
      />
    </div>
  );
}
