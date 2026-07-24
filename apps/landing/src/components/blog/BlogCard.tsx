import Link from "next/link";
import { ArrowRight, Clock, Eye } from "lucide-react";
import type { BlogPost, BlogCategory, BlogAuthor } from "@/types/blog";

type BlogCardProps = {
  post: BlogPost;
  category?: BlogCategory;
  author?: BlogAuthor;
};

export function BlogCard({ post, category, author }: BlogCardProps) {
  // Safe parsing of the date
  const publishDate = new Date(post.publishDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <Link 
      href={`/blogs/${post.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-white/5 bg-[var(--surface)] transition-all duration-500 hover:-translate-y-2 hover:border-[var(--accent)]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-80" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={post.heroImage} 
          alt={post.title} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1"
        />
        
        {category && (
          <div className="absolute left-4 top-4 z-20 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-white">
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[var(--accent)]" />
            {category.name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between text-[0.8rem] text-white/50">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            <span>{post.readingTime} min read</span>
          </div>
          {post.viewCount !== undefined && (
            <div className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5" />
              <span>{post.viewCount.toLocaleString()} views</span>
            </div>
          )}
        </div>

        <h3 className="font-heading mb-3 text-[1.4rem] font-bold leading-tight text-white transition-colors group-hover:text-[var(--accent)] line-clamp-2">
          {post.title}
        </h3>
        
        <p className="mb-6 line-clamp-3 text-[0.95rem] text-white/60 leading-relaxed flex-1">
          {post.excerpt}
        </p>

        {/* Footer (Author & Read More) */}
        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-5">
          <div className="flex items-center gap-3">
            {author && (
              <>
                <div className="h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {author.photoUrl && <img src={author.photoUrl} alt={author.name} className="h-full w-full object-cover" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.85rem] font-semibold text-white/90">{author.name}</span>
                  <span className="text-[0.7rem] text-white/50">{publishDate}</span>
                </div>
              </>
            )}
          </div>
          
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)] transition-all group-hover:bg-[var(--accent)] group-hover:text-black">
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
