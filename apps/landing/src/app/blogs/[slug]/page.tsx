"use client";

import { useBlogs } from "@/hooks/useBlogs";
import { BlogReadingLayout } from "@/components/blog/BlogReadingLayout";
import { notFound } from "next/navigation";
import { use } from "react";

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

  return (
    <BlogReadingLayout 
      post={post} 
      author={author} 
      category={category} 
      relatedPosts={relatedPosts} 
    />
  );
}
