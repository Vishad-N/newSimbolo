export interface CaseStudyMetric {
  id: string;
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  accent?: string;
  displayOrder: number;
}

export interface BeforeAfterMetric {
  id: string;
  metric: string;
  before: string;
  after: string;
}

export interface CaseStudyTimelineItem {
  id: string;
  title: string;
  description?: string;
  order: number;
}

export interface CaseStudyTestimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  photo?: string;
}

export interface CaseStudySEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage: string;
  heroImage: string;
  clientName: string;
  clientLogo?: string;
  industry: string;
  businessSize: string;
  services: string[];
  tags: string[];
  
  // Editorial Content
  challenge: string;
  strategy: string;
  execution: string;
  
  // Arrays
  metrics: CaseStudyMetric[];
  beforeAfter: BeforeAfterMetric[];
  timeline: CaseStudyTimelineItem[];
  gallery: string[];
  
  testimonial?: CaseStudyTestimonial;
  relatedStudies: string[]; // array of slugs or IDs
  
  seo?: CaseStudySEO;
  
  featured: boolean;
  publishDate: string; // ISO string
  status: "Draft" | "Published" | "Archived";
  readTime: string; // e.g. "5 min read"
}
