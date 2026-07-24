export type DesignServiceStatus = "published" | "hidden" | "archived";

export interface DesignCategory {
  id: string;
  title: string;
  thumbnail: string;
  shortDescription: string;
  deliverables: string[];
  skills: string[];
  badge?: string; // e.g. "Most Requested", "Trending", "Recommended"
  featured: boolean;
  ctaText?: string;
  ctaLink?: string;
  displayOrder: number;
  status: DesignServiceStatus;
  createdAt?: string;
  updatedAt?: string;
}
