import { landingApi } from "@/lib/api";

export interface MappedFaq {
  id: string;
  question: string;
  answer: string;
}

export interface MappedTestimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
}

interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  serviceId?: string | null;
}

interface TestimonialRecord {
  id: string;
  clientName: string;
  clientTitle?: string | null;
  companyName?: string | null;
  content: string;
  rating: number;
}

export interface MappedTeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  linkedin?: string;
  email?: string;
}

interface TeamMemberRecord {
  id: string;
  name: string;
  designation: string;
  bio?: string | null;
  image?: string | null;
  socialLinks?: { linkedin?: string; email?: string } | null;
}

function normalizeArray<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];
  if (!response || typeof response !== "object") return [];

  const responseRecord = response as { data?: unknown };
  if (Array.isArray(responseRecord.data)) return responseRecord.data as T[];

  if (responseRecord.data && typeof responseRecord.data === "object") {
    const nestedData = responseRecord.data as { data?: unknown };
    if (Array.isArray(nestedData.data)) return nestedData.data as T[];
  }

  return [];
}

/**
 * Fetches FAQs from the CMS, optionally scoped to a service, falling back to
 * the page's static mock FAQs when the CMS has none yet (never created, or
 * fetch failed).
 */
export async function fetchMappedFaqs(mockFallback: MappedFaq[], serviceId?: string): Promise<MappedFaq[]> {
  try {
    const response: unknown = await landingApi.getFaqs([], undefined, serviceId);
    const rawFaqs = normalizeArray<FaqRecord>(response);
    if (rawFaqs.length > 0) {
      return rawFaqs.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }));
    }
  } catch (error) {
    console.error("Failed to fetch mapped FAQs", error);
  }
  return mockFallback;
}

/**
 * Fetches testimonials from the CMS, falling back to the page's static mock
 * testimonials when the CMS has none yet (never created, or fetch failed).
 */
export async function fetchMappedTestimonials(mockFallback: MappedTestimonial[], isFeatured?: boolean): Promise<MappedTestimonial[]> {
  try {
    const response: unknown = await landingApi.getTestimonials([], isFeatured);
    const rawTestimonials = normalizeArray<TestimonialRecord>(response);
    if (rawTestimonials.length > 0) {
      return rawTestimonials.map((testimonial) => ({
        id: testimonial.id,
        quote: testimonial.content,
        name: testimonial.clientName,
        role: [testimonial.clientTitle, testimonial.companyName].filter(Boolean).join(", ") || "Client",
        rating: testimonial.rating,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch mapped testimonials", error);
  }
  return mockFallback;
}

/**
 * Fetches the public website team roster from the CMS, falling back to the
 * page's static mock team when the CMS has none yet (never created, or
 * fetch failed).
 */
export async function fetchMappedTeam(mockFallback: MappedTeamMember[]): Promise<MappedTeamMember[]> {
  try {
    const response: unknown = await landingApi.getTeamMembers([]);
    const rawTeam = normalizeArray<TeamMemberRecord>(response);
    if (rawTeam.length > 0) {
      return rawTeam.map((member) => ({
        id: member.id,
        name: member.name,
        role: member.designation,
        bio: member.bio ?? undefined,
        photo: member.image ?? undefined,
        linkedin: member.socialLinks?.linkedin,
        email: member.socialLinks?.email,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch mapped team members", error);
  }
  return mockFallback;
}
