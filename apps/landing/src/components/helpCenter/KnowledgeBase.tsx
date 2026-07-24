"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";
import { knowledgeBaseArticles } from "@/data/helpCenter";

export function KnowledgeBase() {
  return (
    <SectionCard className="p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--accent)]/10 text-[var(--accent)]">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-[1.25rem] font-bold text-white">Knowledge Base</h2>
        </div>
        <Link href="#" className="hidden sm:flex items-center gap-1.5 text-[0.85rem] font-medium text-[var(--accent)] transition hover:text-[var(--accent-hover)]">
          View all articles <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {knowledgeBaseArticles.map((article, index) => {
          const Icon = article.icon;
          return (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Link
                href={article.link}
                className="group flex flex-col justify-between h-full rounded-[10px] border border-white/10 bg-[var(--background)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--accent)]/30 hover:bg-[var(--surface)] hover:shadow-[0_10px_20px_rgba(34,211,238,0.05)]"
              >
                <div>
                  <div className="mb-4 flex items-center gap-3 text-[0.75rem] font-medium text-white/50">
                    <span className="flex items-center gap-1 text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-[4px]">
                      <Icon className="h-3 w-3" />
                      {article.category}
                    </span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-[1.05rem] font-semibold text-white leading-snug group-hover:text-[var(--accent)] transition-colors">
                    {article.title}
                  </h3>
                </div>
                
                <div className="mt-6 flex items-center text-[0.85rem] font-bold text-white/40 group-hover:text-white transition-colors">
                  Read Article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center sm:hidden">
        <Link href="#" className="flex items-center gap-1.5 text-[0.85rem] font-medium text-[var(--accent)] transition hover:text-[var(--accent-hover)]">
          View all articles <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </SectionCard>
  );
}
