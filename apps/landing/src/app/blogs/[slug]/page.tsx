import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { BlogReadingLayout } from "@/components/blog/BlogReadingLayout";
import { landingApi } from "@/lib/api";
import { mapBlogResponse } from "@/lib/blog-mapper";
import { mockAuthors, mockBlogs, mockCategories } from "@/mock/blog";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getBlogData() {
  const response = await landingApi.getBlogs(mockBlogs);
  const mappedData = mapBlogResponse(response, mockBlogs);

  return {
    posts: mappedData.posts.length > 0 ? mappedData.posts : mockBlogs,
    authors: mappedData.authors.length > 0 ? mappedData.authors : mockAuthors,
    categories: mappedData.categories.length > 0 ? mappedData.categories : mockCategories,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { posts } = await getBlogData();
  const post = posts.find((blogPost) => blogPost.slug === slug && blogPost.status === "published");

  if (!post) {
    return {
      title: "Blog Not Found | The Simbolo",
    };
  }

  return {
    title: post.seo?.metaTitle || `${post.title} | The Simbolo Blog`,
    description: post.seo?.metaDescription || post.excerpt,
    alternates: {
      canonical: `/blogs/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.seo?.ogImage || post.heroImage }],
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const { posts, authors, categories } = await getBlogData();
  const selectedPost = posts.find((blogPost) => blogPost.slug === slug && blogPost.status === "published");

  if (!selectedPost) {
    notFound();
  }

  const post = selectedPost;
  const relatedPosts = posts
    .filter((blogPost) => blogPost.id !== post.id && blogPost.status === "published")
    .filter((blogPost) => blogPost.categoryId === post.categoryId || post.relatedArticleIds?.includes(blogPost.id))
    .slice(0, 3);
  const postAuthor = authors.find((author) => author.id === post.authorId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.seo?.ogImage || post.heroImage,
    datePublished: post.publishDate,
    author: { "@type": "Person", name: postAuthor?.name || "The Simbolo" },
    publisher: { "@type": "Organization", name: "The Simbolo", logo: { "@type": "ImageObject", url: "https://thesimbolo.com/favicon.png" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://thesimbolo.com/blogs/${slug}` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://thesimbolo.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://thesimbolo.com/blogs" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://thesimbolo.com/blogs/${slug}` },
    ],
  };

  return (
    <>
      <Script id="json-ld-blog-post" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Script id="json-ld-blog-post-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <BlogReadingLayout
        post={post}
        author={postAuthor}
        category={categories.find((category) => category.id === post.categoryId)}
        relatedPosts={relatedPosts}
      />
    </>
  );
}
