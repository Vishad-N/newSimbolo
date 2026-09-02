import { AboutUsPage } from "@/components/about-us/AboutUsPage";
import { landingApi } from "@/lib/api";
import { fetchMappedFaqs, fetchMappedTeam, fetchMappedTestimonials } from "@/lib/content-mapper";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [aboutUsData, liveTeam, liveFaqs, liveTestimonials] = await Promise.all([
    landingApi.getAboutUs(null) as Promise<Record<string, any> | null>,
    fetchMappedTeam([]),
    fetchMappedFaqs([]),
    fetchMappedTestimonials([]),
  ]);

  return (
    <AboutUsPage
      heroData={aboutUsData?.hero}
      storyData={aboutUsData?.story}
      liveTeam={liveTeam}
      liveFaqs={liveFaqs}
      liveTestimonials={liveTestimonials}
    />
  );
}
