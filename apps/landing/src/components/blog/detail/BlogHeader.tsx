import Link from "next/link";
import { Home } from "lucide-react";
import type { BlogCategory } from "@/types/blog";

type BlogHeaderProps = {
  title: string;
  category?: BlogCategory;
};

export function BlogHeader({ title, category }: BlogHeaderProps) {
  return (
    <header className="mb-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-[0.85rem] font-medium text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1">
          <Home className="h-4 w-4 text-[var(--accent)]" />
        </Link>
        <span>/</span>
        <Link href="/blogs" className="hover:text-[var(--accent)] transition-colors text-[var(--accent)]">
          Blog
        </Link>
        {category && (
          <>
            <span>/</span>
            <Link href={`/blogs?category=${category.id}`} className="hover:text-[var(--accent)] transition-colors text-[var(--accent)]">
              {category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-[var(--muted)] truncate max-w-[200px] sm:max-w-[300px]">{title}</span>
      </nav>
      
      <h1 className="font-heading text-[1.8rem] sm:text-[2.5rem] md:text-[3.2rem] font-black leading-tight text-[var(--text-primary)] tracking-tight">
        {title}
      </h1>
    </header>
  );
}
