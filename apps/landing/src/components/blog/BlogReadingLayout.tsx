import { MessageCircle, Globe, Link as LinkIcon, Share2, Home } from "lucide-react";
import type { BlogPost, BlogAuthor, BlogCategory } from "@/types/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

type BlogReadingLayoutProps = {
  post: BlogPost;
  author?: BlogAuthor;
  category?: BlogCategory;
  relatedPosts: BlogPost[];
};

export function BlogReadingLayout({ post, author, category, relatedPosts }: BlogReadingLayoutProps) {
  const publishDate = new Date(post.publishDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <article className="bg-[var(--background)] min-h-screen pb-20">
      {/* Hero Section */}
      <header className="pt-32 pb-16 px-5 sm:px-8 lg:px-10 mx-auto max-w-[1000px] text-center">
        
        {/* Breadcrumbs */}
        <nav className="mb-8 flex flex-wrap items-center justify-center gap-2 text-[0.85rem] font-medium text-white/50">
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
          <span className="text-white/40 truncate max-w-[200px] sm:max-w-[300px]">{post.title}</span>
        </nav>
        
        <h1 className="font-heading text-[2.5rem] md:text-[3.5rem] font-black leading-tight text-white tracking-tight mb-6">
          {post.title}
        </h1>
        
        <p className="text-[1.2rem] text-white/60 mb-8 max-w-3xl mx-auto leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[0.9rem] text-white/50 border-t border-white/10 pt-8">
          {author && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {author.photoUrl && <img src={author.photoUrl} alt={author.name} className="h-full w-full object-cover" />}
              </div>
              <span className="font-medium text-white/80">{author.name}</span>
            </div>
          )}
          <span className="hidden sm:inline">•</span>
          <span>{publishDate}</span>
          <span className="hidden sm:inline">•</span>
          <span>{post.readingTime} min read</span>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-10 mb-16">
        <div className="aspect-[21/9] w-full overflow-hidden rounded-[24px] border border-white/10 bg-black/40 shadow-2xl relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.heroImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-20">
          
          {/* Main Content Area */}
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
            {/* React Markdown for rich content rendering */}
            <ReactMarkdown>
              {post.content}
            </ReactMarkdown>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2 pt-8 border-t border-white/10">
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[0.8rem] text-white/60">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author Card */}
            {author && (
              <div className="mt-16 rounded-[16px] bg-white/5 border border-white/10 p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-[var(--accent)]/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {author.photoUrl && <img src={author.photoUrl} alt={author.name} className="h-full w-full object-cover" />}
                </div>
                <div>
                  <h3 className="font-heading text-[1.5rem] font-bold text-white mb-1">{author.name}</h3>
                  <p className="text-[var(--accent)] text-[0.9rem] mb-4 font-medium">{author.role}</p>
                  <p className="text-white/60 text-[0.95rem] mb-4">{author.bio}</p>
                  <div className="flex justify-center sm:justify-start gap-3">
                    {author.socialLinks?.twitter && (
                      <a href={author.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-white/40 hover:text-blue-400">
                        <MessageCircle className="h-5 w-5" />
                      </a>
                    )}
                    {author.socialLinks?.linkedin && (
                      <a href={author.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-white/40 hover:text-blue-600">
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <aside className="hidden lg:block relative">
            <div className="sticky top-32 space-y-8">
              
              {/* Share */}
              <div className="rounded-[16px] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <h4 className="font-heading text-[1rem] font-bold text-white mb-4 uppercase tracking-wider text-center">Share Article</h4>
                <div className="flex justify-center gap-4">
                  <button className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-blue-600 hover:text-white transition-colors">
                    <Globe className="h-4 w-4" />
                  </button>
                  <button className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-blue-400 hover:text-white transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                  <button className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-blue-700 hover:text-white transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-colors">
                    <LinkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Table of Contents (Mock) */}
              <div className="rounded-[16px] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <h4 className="font-heading text-[1rem] font-bold text-white mb-4 uppercase tracking-wider">In this article</h4>
                <ul className="space-y-3 text-[0.9rem] text-white/60">
                  <li className="hover:text-[var(--accent)] cursor-pointer transition-colors">Introduction</li>
                  <li className="hover:text-[var(--accent)] cursor-pointer transition-colors">Key Strategies</li>
                  <li className="hover:text-[var(--accent)] cursor-pointer transition-colors pl-4">Methodology</li>
                  <li className="hover:text-[var(--accent)] cursor-pointer transition-colors pl-4">Implementation</li>
                  <li className="hover:text-[var(--accent)] cursor-pointer transition-colors">Conclusion</li>
                </ul>
              </div>

              {/* CTA */}
              <div className="rounded-[16px] border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-6 backdrop-blur-md text-center">
                <h4 className="font-heading text-[1.2rem] font-bold text-white mb-2">Ready to grow?</h4>
                <p className="text-[0.85rem] text-white/60 mb-4">Let our experts help you scale your business.</p>
                <Link href="/contact" className="inline-block w-full rounded-[8px] bg-[var(--accent)] py-2 text-black font-bold text-[0.9rem] hover:bg-[var(--accent-hover)] transition-colors">
                  Contact Us
                </Link>
              </div>

            </div>
          </aside>
        </div>
      </div>

      {/* Related Articles */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10 mt-32 border-t border-white/10 pt-20">
          <h2 className="font-heading text-[2rem] font-bold text-white mb-10 text-center">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map(rp => (
              <BlogCard key={rp.id} post={rp} />
            ))}
          </div>
        </section>
      )}

    </article>
  );
}
