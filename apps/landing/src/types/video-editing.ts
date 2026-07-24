export type PreviewType = "youtube" | "instagram" | "vimeo" | "direct";
export type ServiceStatus = "published" | "hidden" | "archived";

export interface VideoServiceCategory {
  id: string;
  name: string;
  slug: string;
}

export interface VideoEditingService {
  id: string;
  title: string;
  slug: string;
  categoryIds: string[];
  thumbnail: string;
  previewType: PreviewType;
  previewUrl: string;
  shortDescription: string;
  fullDescription?: string;
  hourlyRate: number;
  currency: string;
  estimatedDelivery: string;
  recommendedDuration: string;
  complexity: "Low" | "Medium" | "High" | "Expert";
  tags: string[];
  badge?: string; // e.g. "Popular", "Best Seller", "New"
  status: ServiceStatus;
  featured: boolean;
  displayOrder: number;
  ctaText?: string;
  ctaLink?: string;
  createdAt?: string;
  updatedAt?: string;
}
