import type { BlogPost } from "@/types/blog";
import { BlogCard } from "@/components/blog/BlogCard";

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mt-16 pt-16 border-t border-black/10 dark:border-white/10">
      <h3 className="font-heading text-[2rem] font-bold text-[var(--text-primary)] mb-8">You may also like these</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((rp) => (
          <BlogCard key={rp.id} post={rp} />
        ))}
      </div>
    </div>
  );
}
