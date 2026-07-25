"use client";

import { aboutData } from "@/mock/about";
import { AboutHero } from "@/components/about-us/AboutHero";
import { OurStory } from "@/components/about-us/OurStory";
import { MissionVision } from "@/components/about-us/MissionVision";
import { CoreValues } from "@/components/about-us/CoreValues";
import { WhyChooseUs } from "@/components/about-us/WhyChooseUs";
import { OurProcess } from "@/components/about-us/OurProcess";
import { OurExpertise } from "@/components/about-us/OurExpertise";
import { MeetTheTeam } from "@/components/about-us/MeetTheTeam";
import { CompanyTimeline } from "@/components/about-us/CompanyTimeline";
import { Technologies } from "@/components/about-us/Technologies";
import { FinalCTA } from "@/components/about-us/FinalCTA";
import { TestimonialSection } from "@/components/shared/TestimonialSection";
import { FAQSection } from "@/components/shared/FAQSection";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* 1. Hero */}
      <AboutHero {...aboutData.hero} />

      {/* 2. Our Story */}
      <OurStory {...aboutData.story} />

      {/* 3. Mission & Vision */}
      <MissionVision mission={aboutData.mission} vision={aboutData.vision} />

      {/* 4. Core Values */}
      <CoreValues values={aboutData.values} />

      {/* 5. Why Choose Simbolo */}
      <WhyChooseUs reasons={aboutData.whyChooseUs} />

      {/* 6. Our Process */}
      <OurProcess process={aboutData.process} />

      {/* 7. Our Expertise (Stats) */}
      <OurExpertise stats={aboutData.statistics} />

      {/* 8. Meet the Team */}
      <MeetTheTeam team={aboutData.team} />

      {/* 9. Timeline */}
      <CompanyTimeline timeline={aboutData.timeline} />

      {/* 10. Technologies */}
      <Technologies technologies={aboutData.technologies} />

      {/* 11. Testimonials */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">What Our Clients Say</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Don't just take our word for it. Read what our partners have to say about working with us.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestimonialSection testimonials={aboutData.testimonials} />
            {aboutData.testimonials.slice(1).map((testi) => (
              <TestimonialSection key={testi.id} testimonials={[testi]} />
            ))}
          </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="py-24 px-6 relative z-10 bg-white/[0.01]">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Got Questions?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We've got answers. If you can't find what you're looking for, feel free to reach out.
            </p>
          </div>
          <FAQSection faqs={aboutData.faq} title="" />
        </div>
      </section>

      {/* 12. CTA */}
      <FinalCTA {...aboutData.cta} />
    </div>
  );
}
