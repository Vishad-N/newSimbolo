"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Eye, ExternalLink } from "lucide-react";
import { useBlogs } from "@/hooks/useBlogs";
import type { BlogPost } from "@/types/blog";

export default function AdminBlogsPage() {
  const { blogs, categories, authors, loading, deleteBlog, updateBlog } = useBlogs();

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent"></div>
      </div>
    );
  }

  const toggleStatus = (pkg: BlogPost) => {
    const newStatus = pkg.status === "published" ? "draft" : "published";
    updateBlog(pkg.id, { status: newStatus });
  };

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || "Uncategorized";
  const getAuthorName = (id: string) => authors.find(a => a.id === id)?.name || "Unknown Author";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.8rem] font-bold text-white tracking-tight">Blog Manager</h1>
          <p className="mt-1 text-[0.9rem] text-white/50">Manage your articles, categories, and authors.</p>
        </div>
        <Link
          href="/admin/blogs/editor"
          className="flex items-center gap-2 rounded-[8px] bg-[var(--accent)] px-4 py-2.5 text-[0.9rem] font-bold text-black transition-transform hover:scale-[1.02] hover:bg-[var(--accent-hover)] shadow-[0_0_15px_var(--accent-glow)]"
        >
          <Plus className="h-4 w-4" />
          Write Article
        </Link>
      </div>

      <div className="overflow-hidden rounded-[12px] border border-white/10 bg-[var(--surface)]">
        <table className="w-full text-left text-[0.9rem]">
          <thead className="bg-black/20 text-[0.75rem] font-bold uppercase tracking-wider text-white/50">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {blogs.map((blog) => (
              <tr key={blog.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="font-bold text-white max-w-[300px] truncate" title={blog.title}>
                    {blog.title}
                  </div>
                  <div className="text-[0.75rem] text-white/50 mt-1">
                    {new Date(blog.publishDate).toLocaleDateString()} • {blog.readingTime} min read
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-white/70">
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[0.75rem] border border-white/10">
                    {getCategoryName(blog.categoryId)}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-white/70">
                  {getAuthorName(blog.authorId)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.75rem] font-semibold ${
                      blog.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {blog.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/blogs/${blog.slug}`}
                      target="_blank"
                      className="rounded-[6px] p-2 text-white/40 hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                      title="View on site"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => toggleStatus(blog)}
                      className="rounded-[6px] p-2 text-white/40 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                      title={blog.status === "published" ? "Unpublish" : "Publish"}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/admin/blogs/editor?id=${blog.id}`}
                      className="rounded-[6px] p-2 text-white/40 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
                          deleteBlog(blog.id);
                        }
                      }}
                      className="rounded-[6px] p-2 text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {blogs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-white/50">
                  No articles found. Write your first article to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
