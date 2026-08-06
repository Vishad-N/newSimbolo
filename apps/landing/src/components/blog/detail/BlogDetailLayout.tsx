"use client";

import type { BlogPost, BlogAuthor, BlogCategory } from "@/types/blog";
import { BlogHeader } from "./BlogHeader";
import { BlogContent } from "./BlogContent";
import { BlogSidebar } from "./BlogSidebar";
import { AuthorCard } from "./AuthorCard";
import { BlogNavigation } from "./BlogNavigation";
import { RelatedPosts } from "./RelatedPosts";
import { CommentSection } from "./CommentSection";

type BlogDetailLayoutProps = {
  post: BlogPost;
  author?: BlogAuthor;
  category?: BlogCategory;
  relatedPosts: BlogPost[];
  prevPost?: BlogPost;
  nextPost?: BlogPost;
};

export function BlogDetailLayout({ 
  post, 
  author, 
  category, 
  relatedPosts,
  prevPost,
  nextPost
}: BlogDetailLayoutProps) {
  const publishDate = new Date(post.publishDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <article className="relative bg-[var(--background)] min-h-screen pb-20 pt-28 overflow-hidden">
      {/* Decorative top background elements */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] bg-gradient-to-b from-[var(--accent)]/10 via-[var(--primary)]/5 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent)]/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--primary)]/5 blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-12 lg:gap-20">
          
          {/* Main Content Area (Left Column) */}
          <div className="w-full max-w-4xl mx-auto lg:mx-0">
            
            <BlogHeader title={post.title} category={category} />

            {/* Featured Image */}
            <div className="aspect-[16/9] w-full overflow-hidden rounded-[24px] border border-black/10 dark:border-white/10 bg-[var(--surface)] shadow-xl mb-12 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.heroImage} alt={post.title} className="w-full h-full object-cover" />
            </div>

            {/* Metadata (Author, Date, Reading Time) */}
            <div className="flex flex-wrap items-center gap-4 text-[0.9rem] text-[var(--muted)] mb-10 pb-6 border-b border-black/10 dark:border-white/10">
              {author && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-black/10 dark:border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {author.photoUrl && <img src={author.photoUrl} alt={author.name} className="h-full w-full object-cover" />}
                  </div>
                  <span className="font-bold text-[var(--text-primary)]">{author.name}</span>
                </div>
              )}
              <span className="hidden sm:inline">•</span>
              <span>{publishDate}</span>
              <span className="hidden sm:inline">•</span>
              <span>{post.readingTime} min read</span>
            </div>

            {/* Markdown Article Content */}
            <BlogContent content={post.content} />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2 pt-8">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[0.8rem] font-medium text-[var(--muted)]">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <AuthorCard author={author as BlogAuthor} />
            <BlogNavigation prevPost={prevPost} nextPost={nextPost} />
            <CommentSection />
          </div>

          {/* Sticky Sidebar (Right Column) */}
          <aside className="hidden lg:block relative">
            <div className="sticky top-32">
              <BlogSidebar />
            </div>
          </aside>
          
          {/* Mobile Sidebar Content (Stacked below) */}
          <aside className="block lg:hidden mt-12 w-full">
            <BlogSidebar />
          </aside>

        </div>
      </div>

      {/* Full-width Related Articles at the bottom */}
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <RelatedPosts posts={relatedPosts} />
      </div>
    </article>
  );
}
