"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Quote, ArrowRight, Share2 } from "lucide-react";
import { CaseStudy } from "@/types/case-studies";
import { KPIDashboard, BeforeAfterCards, TimelineView } from "@/components/case-studies/CaseStudyComponents";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";

interface CaseStudyClientPageProps {
  study?: CaseStudy;
  relatedStudies?: CaseStudy[];
}

import { caseStudies as mockCaseStudies } from "@/mock/case-studies";
import { useParams } from "next/navigation";

export function CaseStudyClientPage({ study: initialStudy, relatedStudies: initialRelated }: CaseStudyClientPageProps) {
  const params = useParams();
  
  const study = initialStudy || mockCaseStudies.find(s => s.slug === params.slug);
  const relatedStudies = initialRelated && initialRelated.length > 0 ? initialRelated : 
    (study ? mockCaseStudies.filter(s => study.relatedStudies.includes(s.slug) || study.relatedStudies.includes(s.id)) : []);

  if (!study) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Banner */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden min-h-[70vh] flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={study.heroImage}
            alt={study.title}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/90 to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.15),transparent_70%)]" />
        </div>

        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to Case Studies
          </Link>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="rounded-full bg-[var(--primary)]/10 px-4 py-1.5 text-sm font-semibold text-[var(--primary)] border border-[var(--primary)]/20 backdrop-blur-md">
              {study.industry}
            </span>
            {study.services.map(s => (
              <span key={s} className="rounded-full bg-white/5 px-4 py-1.5 text-sm font-medium text-gray-300 border border-white/10 backdrop-blur-md">
                {s}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8 leading-tight">
            {study.title}
          </h1>

          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10">
            {study.summary}
          </p>

          <div className="flex items-center justify-center gap-12 pt-8 border-t border-white/10">
            <div className="text-left">
              <div className="text-sm text-gray-500 mb-1">Client</div>
              <div className="text-lg font-bold text-white">{study.clientName}</div>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm text-gray-500 mb-1">Company Size</div>
              <div className="text-lg font-bold text-white">{study.businessSize}</div>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm text-gray-500 mb-1">Read Time</div>
              <div className="text-lg font-bold text-white">{study.readTime}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Content */}
      <section className="px-6 py-20 relative z-10">
        <div className="container mx-auto max-w-4xl">
          
          {/* KPIs */}
          <KPIDashboard metrics={study.metrics} />

          <div className="prose prose-invert prose-lg max-w-none mt-16 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[var(--primary)]">
            
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
              <span className="w-12 h-[2px] bg-[var(--primary)]"></span>
              The Challenge
            </h2>
            <div dangerouslySetInnerHTML={{ __html: study.challenge }} className="text-gray-300 leading-relaxed mb-16" />

            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
              <span className="w-12 h-[2px] bg-[var(--primary)]"></span>
              Our Strategy
            </h2>
            <div dangerouslySetInnerHTML={{ __html: study.strategy }} className="text-gray-300 leading-relaxed mb-16" />

            {/* Before After Visuals */}
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
              <span className="w-12 h-[2px] bg-[var(--primary)]"></span>
              The Transformation
            </h2>
            <BeforeAfterCards data={study.beforeAfter} />

            <h2 className="text-3xl font-bold text-white mb-6 mt-16 flex items-center gap-4">
              <span className="w-12 h-[2px] bg-[var(--primary)]"></span>
              Execution & Timeline
            </h2>
            <div dangerouslySetInnerHTML={{ __html: study.execution }} className="text-gray-300 leading-relaxed mb-12" />
            <TimelineView items={study.timeline} />

          </div>

          {/* Testimonial */}
          {study.testimonial && (
            <div className="my-24 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 to-cyan-500/10 rounded-3xl blur-2xl" />
              <div className="relative p-10 md:p-14 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
                <Quote className="w-12 h-12 text-[var(--primary)]/40 mb-6" />
                <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed mb-10 italic">
                  "{study.testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  {study.testimonial.photo ? (
                    <div className="w-14 h-14 rounded-full overflow-hidden relative">
                      <Image src={study.testimonial.photo} alt={study.testimonial.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-xl font-bold text-[var(--primary)] border border-[var(--primary)]/30">
                      {study.testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="text-lg font-bold text-white">{study.testimonial.name}</div>
                    <div className="text-gray-400">{study.testimonial.role}, {study.testimonial.company}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Share */}
          <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-t border-b border-white/10 mt-16">
            <div className="text-gray-400 font-medium">Share this success story</div>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-500/20 hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2v-8.37H6.46M7.83 6.7a1.68 1.68 0 0 0-1.68 1.68c0 .93.75 1.69 1.68 1.69a1.69 1.69 0 0 0 1.69-1.69c0-.93-.76-1.68-1.69-1.68Z"/></svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-sky-500/20 hover:text-sky-400 transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/20 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Related Studies */}
      {relatedStudies.length > 0 && (
        <section className="px-6 py-24 bg-black/40">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-white mb-12">More Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedStudies.map(related => (
                <CaseStudyCard key={related.id} study={related} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--primary)]/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--primary)]/10 rounded-full blur-[120px]" />
        
        <div className="container relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to achieve similar results?</h2>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            Let's discuss how our data-driven approach can help scale your business and outpace the competition.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto h-14 px-8 rounded-full bg-[var(--primary)] text-black font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
              Start Your Project <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto h-14 px-8 rounded-full bg-white/5 text-white font-bold hover:bg-white/10 transition-colors border border-white/10">
              Book a Free Consultation
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
