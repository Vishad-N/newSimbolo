import type { BlogAuthor, BlogCategory, BlogPost } from "@/types/blog";

type ApiEnvelope<T> = {
  data?: T;
  items?: T;
};

type BackendUser = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

type BackendAuthor = {
  id?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  user?: BackendUser | null;
};

type BackendCategory = {
  id?: string;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
};

type BackendTag = {
  id?: string;
  name?: string | null;
  slug?: string | null;
};

type BackendCoverImage = {
  url?: string | null;
};

type BackendBlogRecord = {
  id?: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  content?: string | null;
  status?: string | null;
  publishDate?: string | null;
  updatedAt?: string | null;
  readingTimeMin?: number | null;
  readingTime?: number | null;
  viewCount?: number | null;
  featured?: boolean | null;
  isFeatured?: boolean | null;
  heroImage?: string | null;
  coverImage?: BackendCoverImage | null;
  coverImageUrl?: string | null;
  authorId?: string | null;
  author?: BackendAuthor | null;
  categoryId?: string | null;
  category?: BackendCategory | null;
  tags?: Array<BackendTag | string> | null;
  seo?: BlogPost["seo"];
};

export type MappedBlogData = {
  posts: BlogPost[];
  authors: BlogAuthor[];
  categories: BlogCategory[];
};

function getArrayFromResponse(response: unknown): unknown[] {
  if (Array.isArray(response)) return response;
  if (!response || typeof response !== "object") return [];

  const envelope = response as ApiEnvelope<unknown>;
  if (Array.isArray(envelope.data)) return envelope.data;
  if (Array.isArray(envelope.items)) return envelope.items;

  if (envelope.data && typeof envelope.data === "object") {
    const nestedEnvelope = envelope.data as ApiEnvelope<unknown>;
    if (Array.isArray(nestedEnvelope.data)) return nestedEnvelope.data;
    if (Array.isArray(nestedEnvelope.items)) return nestedEnvelope.items;
  }

  return [];
}

function toStatus(status: string | null | undefined): BlogPost["status"] {
  const normalizedStatus = status?.toLowerCase();
  if (normalizedStatus === "draft" || normalizedStatus === "scheduled" || normalizedStatus === "archived") {
    return normalizedStatus;
  }

  return "published";
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getAuthorName(author: BackendAuthor | null | undefined): string {
  const user = author?.user;
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return fullName || user?.email || "The Simbolo Team";
}

function isBackendBlogRecord(value: unknown): value is BackendBlogRecord {
  return Boolean(value && typeof value === "object");
}

export function mapBlogResponse(response: unknown, fallbackPosts: BlogPost[]): MappedBlogData {
  const records = getArrayFromResponse(response).filter(isBackendBlogRecord);

  if (records.length === 0) {
    return {
      posts: fallbackPosts,
      authors: [],
      categories: [],
    };
  }

  const authorsById = new Map<string, BlogAuthor>();
  const categoriesById = new Map<string, BlogCategory>();

  const posts = records
    .map((record, index): BlogPost | null => {
      const title = record.title?.trim();
      if (!title) return null;

      const id = record.id || `blog-${index}`;
      const authorId = record.authorId || record.author?.id || "simbolo-team";
      const categoryId = record.categoryId || record.category?.id || "general";
      const publishDate = record.publishDate || record.updatedAt || new Date().toISOString();
      const tagIds = (record.tags || []).map((tag) => (typeof tag === "string" ? tag : tag.slug || tag.id || tag.name || "")).filter(Boolean);

      if (record.author && !authorsById.has(authorId)) {
        authorsById.set(authorId, {
          id: authorId,
          name: getAuthorName(record.author),
          role: "Author",
          bio: record.author.bio || "Insights from The Simbolo digital marketing team.",
          photoUrl: record.author.avatarUrl || record.author.user?.avatarUrl || "",
          socialLinks: {
            twitter: record.author.twitterUrl || undefined,
            linkedin: record.author.linkedinUrl || undefined,
          },
        });
      }

      if (record.category && !categoriesById.has(categoryId)) {
        const name = record.category.name || "General";
        categoriesById.set(categoryId, {
          id: categoryId,
          name,
          slug: record.category.slug || toSlug(name),
          description: record.category.description || undefined,
        });
      }

      return {
        id,
        title,
        slug: record.slug || toSlug(title),
        excerpt: record.excerpt || "",
        content: record.content || "",
        heroImage: record.heroImage || record.coverImage?.url || record.coverImageUrl || "/services/website-design/custom-dev.jpg",
        authorId,
        categoryId,
        tags: tagIds,
        status: toStatus(record.status),
        featured: Boolean(record.featured || record.isFeatured),
        publishDate,
        updatedDate: record.updatedAt || undefined,
        readingTime: record.readingTimeMin || record.readingTime || 1,
        viewCount: record.viewCount || undefined,
        seo: record.seo,
      };
    })
    .filter((post): post is BlogPost => Boolean(post));

  return {
    posts,
    authors: Array.from(authorsById.values()),
    categories: Array.from(categoriesById.values()),
  };
}
