export type BlogStatus = "published" | "draft" | "scheduled" | "archived";

export type BlogAuthor = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: "teal" | "blue" | "purple" | "orange" | "lime" | "pink";
};

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
};

export type BlogSEO = {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown or HTML string
  heroImage: string;
  authorId: string;
  categoryId: string;
  tags: string[]; // Array of Tag IDs
  status: BlogStatus;
  featured: boolean;
  publishDate: string; // ISO string
  updatedDate?: string; // ISO string
  readingTime: number; // in minutes
  viewCount?: number;
  seo?: BlogSEO;
  relatedArticleIds?: string[];
};
