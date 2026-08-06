"use client";

import { useBlogs } from "@/hooks/useBlogs";
import { BlogDetailLayout } from "@/components/blog/detail/BlogDetailLayout";
import { notFound } from "next/navigation";
import { use, useMemo } from "react";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { getBlogBySlug, authors, categories, blogs, loading } = useBlogs();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent"></div>
      </div>
    );
  }

  const post = getBlogBySlug(slug);

  if (!post) {
    return notFound();
  }

  const author = authors.find(a => a.id === post.authorId);
  const category = categories.find(c => c.id === post.categoryId);
  
  // Get 3 related posts
  const relatedPosts = blogs
    .filter(b => b.id !== post.id && b.status === "published" && (b.categoryId === post.categoryId || b.tags.some(t => post.tags.includes(t))))
    .slice(0, 3);

  // Compute prev/next posts based on publish date
  const publishedBlogs = blogs
    .filter(b => b.status === "published")
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  
  const currentIndex = publishedBlogs.findIndex(b => b.id === post.id);
  const nextPost = currentIndex > 0 ? publishedBlogs[currentIndex - 1] : undefined;
  const prevPost = currentIndex < publishedBlogs.length - 1 ? publishedBlogs[currentIndex + 1] : undefined;

  return (
    <BlogDetailLayout 
      post={post} 
      author={author} 
      category={category} 
      relatedPosts={relatedPosts}
      prevPost={prevPost}
      nextPost={nextPost}
    />
  );
}
