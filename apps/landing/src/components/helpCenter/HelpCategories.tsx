"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";
import { helpCategories } from "@/data/helpCenter";
import { cn } from "@/lib/utils";

interface HelpCategoriesProps {
  activeCategory: string | null;
  onSelectCategory: (title: string) => void;
}

export function HelpCategories({ activeCategory, onSelectCategory }: HelpCategoriesProps) {
  return (
    <SectionCard className="p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[1.25rem] font-bold text-white">Browse by Category</h2>
        <Link href="#knowledge-base" className="hidden sm:flex items-center gap-1.5 text-[0.85rem] font-medium text-[var(--accent)] transition hover:text-[var(--accent-hover)]">
          Jump to articles <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {helpCategories.map((category, index) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.title;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <button
                type="button"
                onClick={() => onSelectCategory(category.title)}
                className={cn(
                  "group flex w-full flex-col items-center justify-center gap-3 rounded-[10px] border p-5 text-center transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(34,211,238,0.05)]",
                  isActive
                    ? "border-[var(--accent)]/50 bg-[var(--surface)]"
                    : "border-white/10 bg-[var(--background)] hover:border-[var(--accent)]/30 hover:bg-[var(--surface)]"
                )}
              >
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                  isActive ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "bg-white/5 text-white/70 group-hover:bg-[var(--accent)]/10 group-hover:text-[var(--accent)]"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={cn("text-[0.95rem] font-semibold transition-colors", isActive ? "text-[var(--accent)]" : "text-white group-hover:text-[var(--accent)]")}>{category.title}</h3>
                  <p className="mt-1 text-[0.75rem] text-white/50">{category.articleCount} Articles</p>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center sm:hidden">
        <Link href="#knowledge-base" className="flex items-center gap-1.5 text-[0.85rem] font-medium text-[var(--accent)] transition hover:text-[var(--accent-hover)]">
          Jump to articles <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </SectionCard>
  );
}
