"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Mail } from "lucide-react";
import { useBlogs } from "@/hooks/useBlogs";
import { BlogCard } from "@/components/blog/BlogCard";

export default function BlogsListingPage() {
  const { blogs, categories, authors, loading } = useBlogs();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const publishedBlogs = useMemo(() => 
    blogs.filter(b => b.status === "published").sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()),
  [blogs]);

  const featuredBlog = useMemo(() => publishedBlogs.find(b => b.featured) || publishedBlogs[0], [publishedBlogs]);

  const filteredBlogs = useMemo(() => {
    return publishedBlogs.filter(blog => {
      // Don't duplicate featured blog if it's the only one, wait, we usually exclude featured from the grid or just show it again.
      // Let's show all in the grid for now.
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? blog.categoryId === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [publishedBlogs, searchQuery, selectedCategory]);

  const getCategory = (id: string) => categories.find(c => c.id === id);
  const getAuthor = (id: string) => authors.find(a => a.id === id);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--accent)]/10 via-transparent to-transparent opacity-50" />
        
        <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10 text-center">
          <h1 className="font-heading text-[3rem] md:text-[4rem] font-black leading-tight text-white tracking-tight mb-4">
            Insights That Help <br className="hidden md:block"/> Businesses Grow
          </h1>
          <p className="mx-auto max-w-2xl text-[1.1rem] text-white/60 mb-12">
            Expert strategies, tutorials, and case studies on digital marketing, web development, AI, and business growth.
          </p>

          {/* Search Bar */}
          <div className="mx-auto max-w-xl relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/40" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10 mb-12">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-[0.9rem] font-bold transition-colors ${
              selectedCategory === null 
                ? "bg-[var(--accent)] text-black shadow-[0_0_15px_var(--accent-glow)]" 
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            All Topics
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[0.9rem] font-bold transition-colors ${
                selectedCategory === cat.id 
                  ? "bg-[var(--accent)] text-black shadow-[0_0_15px_var(--accent-glow)]" 
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map(blog => (
            <BlogCard 
              key={blog.id} 
              post={blog} 
              category={getCategory(blog.categoryId)} 
              author={getAuthor(blog.authorId)} 
            />
          ))}
          
          {filteredBlogs.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-white/50 text-[1.1rem]">No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="mx-auto max-w-[1000px] px-5 sm:px-8 lg:px-10 pb-32">
        <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 md:p-12 text-center backdrop-blur-sm relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[var(--accent)]/20 blur-[60px]" />
          
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)]/10 mb-6">
            <Mail className="h-8 w-8 text-[var(--accent)]" />
          </div>
          <h2 className="font-heading text-[2rem] font-bold text-white mb-4">Stay updated with digital marketing insights.</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">Get our latest strategies and tutorials delivered straight to your inbox every week. No spam, just value.</p>
          
          <form className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 rounded-[12px] border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/40 focus:border-[var(--accent)] focus:outline-none"
              required
            />
            <button
              type="submit"
              className="rounded-[12px] bg-[var(--accent)] px-6 py-3 font-bold text-black transition-transform hover:scale-105 hover:bg-[var(--accent-hover)] shadow-[0_0_15px_var(--accent-glow)] whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
