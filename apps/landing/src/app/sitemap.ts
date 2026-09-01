import type { MetadataRoute } from "next";
import { fetchMappedCaseStudies } from "@/lib/case-studies-mapper";
import { landingApi } from "@/lib/api";
import { mapBlogResponse } from "@/lib/blog-mapper";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thesimbolo.com";

// Without this, Next prerenders the sitemap once at build time, when the CMS
// fetch always returns an empty fallback (see the case-studies/blogs pages'
// own force-dynamic fix) — new case studies/blog posts would never appear.
export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  "",
  "/about-us",
  "/affiliate-program",
  "/blogs",
  "/case-studies",
  "/contact",
  "/help-center",
  "/packages",
  "/privacy-policy",
  "/services",
  "/services/ecommerce",
  "/services/google-ads",
  "/services/graphic-design",
  "/services/meta-ads",
  "/services/seo",
  "/services/video-editing",
  "/services/website-design",
  "/terms-and-conditions",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const [caseStudies, blogsResponse] = await Promise.all([
    fetchMappedCaseStudies([]).catch(() => []),
    landingApi.getBlogs([]).catch(() => []),
  ]);

  const caseStudyEntries: MetadataRoute.Sitemap = caseStudies
    .filter((study) => study.status === "Published" && study.slug)
    .map((study) => ({
      url: `${SITE_URL}/case-studies/${study.slug}`,
      lastModified: study.publishDate ? new Date(study.publishDate) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const { posts } = mapBlogResponse(blogsResponse, []);
  const blogEntries: MetadataRoute.Sitemap = posts
    .filter((post) => post.status === "published" && post.slug)
    .map((post) => ({
      url: `${SITE_URL}/blogs/${post.slug}`,
      lastModified: post.publishDate ? new Date(post.publishDate) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticEntries, ...caseStudyEntries, ...blogEntries];
}
