"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useBlogs } from "@/hooks/useBlogs";
import type { BlogPost } from "@/types/blog";

function BlogEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const { blogs, categories, authors, addBlog, updateBlog, loading } = useBlogs();
  
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    heroImage: "/services/website-design/custom-dev.jpg", // default placeholder
    authorId: "",
    categoryId: "",
    tags: [],
    status: "draft",
    featured: false,
    readingTime: 5,
  });

  useEffect(() => {
    if (!loading) {
      if (id) {
        const existing = blogs.find(b => b.id === id);
        if (existing) setFormData(existing);
      } else {
        // Set defaults if creating new
        if (categories.length > 0) setFormData(prev => ({ ...prev, categoryId: categories[0].id }));
        if (authors.length > 0) setFormData(prev => ({ ...prev, authorId: authors[0].id }));
      }
    }
  }, [id, blogs, categories, authors, loading]);

  const handleSave = () => {
    if (!formData.title || !formData.slug || !formData.content) {
      alert("Title, Slug, and Content are required.");
      return;
    }

    if (id) {
      updateBlog(id, { ...formData, updatedDate: new Date().toISOString() } as BlogPost);
    } else {
      const newBlog: BlogPost = {
        ...formData,
        id: `blog_${Date.now()}`,
        publishDate: formData.publishDate || new Date().toISOString(),
        viewCount: 0,
      } as BlogPost;
      addBlog(newBlog);
    }
    
    router.push("/admin/blogs");
  };

  if (loading) return <div className="p-8 text-white">Loading editor...</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-20 bg-[var(--background)]/80 backdrop-blur-md py-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link href="/admin/blogs" className="rounded-full p-2 hover:bg-white/5 text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-[1.5rem] font-bold text-white tracking-tight">
            {id ? "Edit Article" : "New Article"}
          </h1>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-[8px] bg-[var(--accent)] px-6 py-2.5 text-[0.9rem] font-bold text-black transition-transform hover:scale-[1.02] hover:bg-[var(--accent-hover)] shadow-[0_0_15px_var(--accent-glow)]"
        >
          <Save className="h-4 w-4" />
          Save & {formData.status === 'published' ? 'Publish' : 'Draft'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[12px] border border-white/10 bg-[var(--surface)] p-6 space-y-5">
            <div>
              <label className="mb-1.5 block text-[0.8rem] font-bold text-white/70 uppercase tracking-wide">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="The Ultimate Guide to Digital Marketing"
                className="w-full rounded-[8px] border border-white/10 bg-black/20 px-4 py-3 text-[1.1rem] font-medium text-white placeholder-white/30 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
            
            <div>
              <label className="mb-1.5 block text-[0.8rem] font-bold text-white/70 uppercase tracking-wide">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\\s+/g, '-') })}
                placeholder="ultimate-guide-digital-marketing"
                className="w-full rounded-[8px] border border-white/10 bg-black/20 px-4 py-2.5 text-[0.9rem] text-white placeholder-white/30 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[0.8rem] font-bold text-white/70 uppercase tracking-wide">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A short summary of the article..."
                rows={3}
                className="w-full rounded-[8px] border border-white/10 bg-black/20 px-4 py-3 text-[0.9rem] text-white placeholder-white/30 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-[12px] border border-white/10 bg-[var(--surface)] p-6">
            <label className="mb-3 block text-[0.9rem] font-bold text-white tracking-wide">Content (Markdown)</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="# Introduction\\n\\nWrite your amazing content here..."
              className="w-full min-h-[500px] rounded-[8px] border border-white/10 bg-black/40 p-4 text-[0.95rem] text-white font-mono placeholder-white/30 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] resize-y custom-scrollbar"
            />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <div className="rounded-[12px] border border-white/10 bg-[var(--surface)] p-5 space-y-4">
            <h3 className="font-bold text-white border-b border-white/10 pb-3">Publishing</h3>
            
            <div>
              <label className="mb-1.5 block text-[0.75rem] font-bold text-white/50 uppercase tracking-wide">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-[8px] border border-white/10 bg-black/20 px-3 py-2 text-[0.9rem] text-white focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-black/20 text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-0"
              />
              <label htmlFor="featured" className="text-[0.9rem] font-medium text-white/80 cursor-pointer">Feature this article</label>
            </div>
          </div>

          {/* Media */}
          <div className="rounded-[12px] border border-white/10 bg-[var(--surface)] p-5 space-y-4">
            <h3 className="font-bold text-white border-b border-white/10 pb-3">Media</h3>
            
            <div>
              <label className="mb-1.5 block text-[0.75rem] font-bold text-white/50 uppercase tracking-wide">Hero Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  placeholder="/images/hero.jpg"
                  className="flex-1 rounded-[8px] border border-white/10 bg-black/20 px-3 py-2 text-[0.85rem] text-white focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              {formData.heroImage && (
                <div className="mt-3 aspect-video w-full overflow-hidden rounded-[8px] border border-white/10 bg-black/40 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.heroImage} alt="Hero preview" className="object-cover w-full h-full" />
                </div>
              )}
            </div>
          </div>

          {/* Organization */}
          <div className="rounded-[12px] border border-white/10 bg-[var(--surface)] p-5 space-y-4">
            <h3 className="font-bold text-white border-b border-white/10 pb-3">Organization</h3>
            
            <div>
              <label className="mb-1.5 block text-[0.75rem] font-bold text-white/50 uppercase tracking-wide">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full rounded-[8px] border border-white/10 bg-black/20 px-3 py-2 text-[0.9rem] text-white focus:border-[var(--accent)] focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[0.75rem] font-bold text-white/50 uppercase tracking-wide">Author</label>
              <select
                value={formData.authorId}
                onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                className="w-full rounded-[8px] border border-white/10 bg-black/20 px-3 py-2 text-[0.9rem] text-white focus:border-[var(--accent)] focus:outline-none"
              >
                {authors.map(auth => (
                  <option key={auth.id} value={auth.id}>{auth.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[0.75rem] font-bold text-white/50 uppercase tracking-wide">Reading Time (mins)</label>
              <input
                type="number"
                min="1"
                value={formData.readingTime}
                onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) || 5 })}
                className="w-full rounded-[8px] border border-white/10 bg-black/20 px-3 py-2 text-[0.9rem] text-white focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminBlogEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading...</div>}>
      <BlogEditorContent />
    </Suspense>
  );
}
