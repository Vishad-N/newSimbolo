import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types/blog";

type BlogNavigationProps = {
  prevPost?: BlogPost;
  nextPost?: BlogPost;
};

export function BlogNavigation({ prevPost, nextPost }: BlogNavigationProps) {
  if (!prevPost && !nextPost) return null;

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-b border-black/10 dark:border-white/10 py-8">
      {prevPost ? (
        <Link 
          href={`/blogs/${prevPost.slug}`}
          className="group flex max-w-[45%] flex-col gap-2 w-full sm:text-left text-center"
        >
          <span className="flex items-center justify-center sm:justify-start gap-2 text-[0.85rem] font-bold uppercase tracking-wider text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
            <ArrowLeft className="h-4 w-4" /> Previous
          </span>
          <span className="font-heading text-[1.1rem] font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
            {prevPost.title}
          </span>
        </Link>
      ) : (
        <div className="max-w-[45%] w-full" />
      )}

      {nextPost ? (
        <Link 
          href={`/blogs/${nextPost.slug}`}
          className="group flex max-w-[45%] flex-col gap-2 w-full sm:text-right text-center"
        >
          <span className="flex items-center justify-center sm:justify-end gap-2 text-[0.85rem] font-bold uppercase tracking-wider text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
            Next <ArrowRight className="h-4 w-4" />
          </span>
          <span className="font-heading text-[1.1rem] font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
            {nextPost.title}
          </span>
        </Link>
      ) : (
        <div className="max-w-[45%] w-full" />
      )}
    </div>
  );
}
