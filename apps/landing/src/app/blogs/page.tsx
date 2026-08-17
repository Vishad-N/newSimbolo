import type { Metadata } from "next";
import { Search, Sparkles } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { landingApi } from "@/lib/api";
import { mapBlogResponse } from "@/lib/blog-mapper";
import { mockAuthors, mockBlogs, mockCategories } from "@/mock/blog";

export const metadata: Metadata = {
  title: "Digital Marketing Blog | The Simbolo",
  description: "Read digital marketing, SEO, paid ads, AI marketing, and website growth insights from The Simbolo.",
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    title: "Digital Marketing Blog | The Simbolo",
    description: "Practical insights on SEO, ads, AI marketing, and growth strategy.",
    url: "/blogs",
    siteName: "The Simbolo",
    locale: "en_IN",
    type: "website",
  },
};

export default async function BlogsPage() {
  const response = await landingApi.getBlogs(mockBlogs);
  const mappedData = mapBlogResponse(response, mockBlogs);
  const posts = mappedData.posts.filter((post) => post.status === "published");
  const authors = mappedData.authors.length > 0 ? mappedData.authors : mockAuthors;
  const categories = mappedData.categories.length > 0 ? mappedData.categories : mockCategories;
  const featuredPost = posts.find((post) => post.featured) || posts[0];
  const gridPosts = posts.filter((post) => post.id !== featuredPost?.id);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="relative overflow-hidden px-5 pb-14 pt-28 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted)] dark:border-white/10">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            Marketing Insights
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
            Digital Marketing Blog
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Practical ideas for SEO, paid ads, AI marketing, content, and website growth.
          </p>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-black/10 bg-[var(--surface)] p-12 text-center dark:border-white/10">
              <Search className="mx-auto mb-4 h-10 w-10 text-[var(--muted)]" />
              <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">No blogs published yet</h2>
              <p className="mt-2 text-[var(--muted)]">Published articles will appear here.</p>
            </div>
          ) : (
            <div className="space-y-14">
              {featuredPost && (
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-px w-10 bg-[var(--accent)]" />
                    <h2 className="font-heading text-xl font-bold text-[var(--text-primary)]">Featured Article</h2>
                  </div>
                  <div className="max-w-3xl">
                    <BlogCard
                      post={featuredPost}
                      author={authors.find((author) => author.id === featuredPost.authorId)}
                      category={categories.find((category) => category.id === featuredPost.categoryId)}
                    />
                  </div>
                </div>
              )}

              {gridPosts.length > 0 && (
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-px w-10 bg-[var(--accent)]" />
                    <h2 className="font-heading text-xl font-bold text-[var(--text-primary)]">Latest Articles</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {gridPosts.map((post) => (
                      <BlogCard
                        key={post.id}
                        post={post}
                        author={authors.find((author) => author.id === post.authorId)}
                        category={categories.find((category) => category.id === post.categoryId)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
