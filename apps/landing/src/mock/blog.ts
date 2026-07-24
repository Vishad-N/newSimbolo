import type { BlogAuthor, BlogCategory, BlogPost, BlogTag } from "@/types/blog";

export const mockAuthors: BlogAuthor[] = [
  {
    id: "auth_1",
    name: "Alex Rivera",
    role: "Head of SEO",
    bio: "Alex is an SEO specialist with over a decade of experience helping brands scale organic traffic.",
    photoUrl: "/assets/placeholders/author-1.jpg", // We'll use generic placeholders if not found
    socialLinks: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "auth_2",
    name: "Samantha Chen",
    role: "Performance Marketing Lead",
    bio: "Samantha manages multi-million dollar ad spends across Google and Meta networks.",
    photoUrl: "/assets/placeholders/author-2.jpg",
  }
];

export const mockCategories: BlogCategory[] = [
  { id: "cat_seo", name: "SEO", slug: "seo", color: "teal" },
  { id: "cat_ads", name: "Paid Ads", slug: "paid-ads", color: "blue" },
  { id: "cat_dev", name: "Development", slug: "development", color: "purple" },
  { id: "cat_ai", name: "AI Marketing", slug: "ai-marketing", color: "orange" },
];

export const mockTags: BlogTag[] = [
  { id: "tag_google", name: "Google", slug: "google" },
  { id: "tag_meta", name: "Meta", slug: "meta" },
  { id: "tag_strategy", name: "Strategy", slug: "strategy" },
  { id: "tag_tech", name: "Technology", slug: "tech" },
];

export const mockBlogs: BlogPost[] = [
  {
    id: "blog_1",
    title: "10 SEO Strategies to Skyrocket Your Organic Traffic in 2026",
    slug: "10-seo-strategies-2026",
    excerpt: "Discover the most effective SEO tactics that are working right now to boost your website's visibility and drive qualified leads.",
    content: `
# 10 SEO Strategies to Skyrocket Your Organic Traffic

If you are struggling to get traffic to your website, you are not alone. With Google's constant algorithm updates and the rise of AI-generated content, SEO is evolving faster than ever.

In this guide, we will break down the top 10 strategies that actually work.

## 1. Optimize for AI Search Experiences (SGE)

Traditional search is changing. With AI Overviews (formerly SGE), users often get their answers directly on the search results page. To ensure your brand remains visible, you need to structure your content differently.

*   Answer questions clearly and concisely.
*   Use schema markup extensively.
*   Target long-tail conversational queries.

> "The future of SEO isn't just about ranking links, it's about being the source of truth that AI models cite." — Alex Rivera

## 2. Topic Clusters over Keywords

Stop writing isolated blog posts. Start building **Topic Clusters**. Create a massive pillar page covering a broad topic (e.g., "Digital Marketing"), and link it to dozens of smaller, highly specific cluster pages (e.g., "Instagram Marketing for Dentists").

### Why this works:
1. It builds immense topical authority.
2. It organizes your site structure perfectly.
3. It keeps users engaged longer.

## 3. High-Performance Core Web Vitals

A slow website is a dying website. If your page takes more than 3 seconds to load, you're losing over 50% of your visitors.

![Page Speed Example](/services/website-design/e-commerce.jpg)

### Action Steps:
*   Optimize images (WebP format).
*   Minify CSS and JavaScript.
*   Use a premium CDN.

## 4. Video Integration

Google loves multimedia. Embedding relevant YouTube videos in your blog posts dramatically increases time-on-page and provides alternative ways for users to consume your content.

---

Ready to scale your organic traffic? Reach out to our team of SEO experts today!
    `,
    heroImage: "/services/website-design/custom-dev.jpg",
    authorId: "auth_1",
    categoryId: "cat_seo",
    tags: ["tag_google", "tag_strategy"],
    status: "published",
    featured: true,
    publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
    viewCount: 1245,
    seo: {
      metaTitle: "10 SEO Strategies to Skyrocket Organic Traffic",
      metaDescription: "Discover the most effective SEO tactics to boost visibility.",
    }
  },
  {
    id: "blog_2",
    title: "How to Optimize Your Meta Ads Budget for Maximum ROI",
    slug: "optimize-meta-ads-budget-roi",
    excerpt: "Stop wasting money on inefficient ad spend. Learn how to structure your campaigns and allocate budget like a pro media buyer.",
    content: `
# Maximizing Meta Ads ROI

Are your Facebook and Instagram ads burning through cash without delivering results? The problem usually isn't the platform; it's the account structure and budget allocation.

## The CBO vs. ABO Debate

Campaign Budget Optimization (CBO) is generally the best approach for scaling, but Ad Set Budget Optimization (ABO) is still critical for testing.

### The Golden Rule of Testing

Always use ABO when testing new creatives or audiences. This forces Meta to spend money exactly where you want it, giving you clear data on what works.

## Consolidation is Key

The biggest mistake media buyers make is creating too many ad sets with tiny budgets. The algorithm needs data to learn. If you spread your budget too thin, you'll never exit the learning phase.

*   Limit ad sets per campaign to 3-5.
*   Ensure each ad set has enough budget to generate 50 conversions a week.
*   Merge overlapping lookalike audiences.

Ready to see better returns? Start consolidating today!
    `,
    heroImage: "/services/graphic-design/social-media.jpg",
    authorId: "auth_2",
    categoryId: "cat_ads",
    tags: ["tag_meta", "tag_strategy"],
    status: "published",
    featured: false,
    publishDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 5,
    viewCount: 890,
  },
  {
    id: "blog_3",
    title: "The Future of AI in Digital Marketing",
    slug: "future-of-ai-digital-marketing",
    excerpt: "Artificial Intelligence is no longer just a buzzword. See how AI is fundamentally reshaping content creation, ad targeting, and customer service.",
    content: `
# AI in Digital Marketing

The landscape of marketing is shifting rapidly as AI tools become mainstream.

## 1. Content Generation

AI is accelerating content production. While it shouldn't replace human writers, it serves as an incredible brainstorming and drafting partner.

## 2. Predictive Analytics

Machine learning algorithms can now predict customer behavior with astonishing accuracy, allowing for proactive marketing rather than reactive.
    `,
    heroImage: "/services/website-design/ui-ux.jpg",
    authorId: "auth_1",
    categoryId: "cat_ai",
    tags: ["tag_tech"],
    status: "published",
    featured: false,
    publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 4,
    viewCount: 210,
  }
];
