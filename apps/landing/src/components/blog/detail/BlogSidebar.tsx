"use client";

import { useEffect, useState } from "react";
import { ShareArticle } from "./ShareArticle";
import { ReadyToGrow } from "./ReadyToGrow";
import { HeadOfSEOCard } from "./HeadOfSEOCard";

export function BlogSidebar() {
  const [activeId, setActiveId] = useState<string>("");
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    // Extract headings from the article content
    const articleContent = document.getElementById("blog-content");
    if (!articleContent) return;

    const elements = Array.from(articleContent.querySelectorAll("h2, h3"));
    const headingData = elements.map((el) => {
      // Auto-generate ID if it doesn't have one
      if (!el.id) {
        el.id = el.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "";
      }
      return {
        id: el.id,
        text: el.textContent || "",
        level: el.tagName.toLowerCase() === "h2" ? 2 : 3,
      };
    });

    setHeadings(headingData);

    // Set up IntersectionObserver for spy scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <aside className="w-full space-y-8">

      {/* Table of Contents */}
      {headings.length > 0 && (
        <div className="rounded-[16px] border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 backdrop-blur-md hidden lg:block">
          <h4 className="font-heading text-[1rem] font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wider">In this article</h4>
          <ul className="space-y-3 text-[0.9rem]">
            {headings.map((heading) => (
              <li
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`cursor-pointer transition-colors ${
                  heading.level === 3 ? "pl-4" : ""
                } ${
                  activeId === heading.id
                    ? "text-[var(--accent)] font-semibold"
                    : "text-[var(--muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {heading.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Share Article */}
      <ShareArticle />

      {/* Ready to Grow */}
      <ReadyToGrow />

      {/* Head of SEO Card */}
      <HeadOfSEOCard />
    </aside>
  );
}
