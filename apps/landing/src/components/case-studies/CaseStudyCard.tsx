import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, Clock, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { CaseStudy } from "@/types/case-studies";

interface CaseStudyCardProps {
  study: CaseStudy;
  className?: string;
  featured?: boolean;
}

export function CaseStudyCard({ study, className, featured = false }: CaseStudyCardProps) {
  // If featured is true, we can render a larger banner layout, otherwise a standard grid card.
  if (featured) {
    return (
      <div className={cn("group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.02] transition-all hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.15)] hover:border-[var(--primary)]/30 flex flex-col lg:flex-row", className)}>
        {/* Image Section */}
        <div className="relative w-full lg:w-[50%] h-[300px] lg:h-auto overflow-hidden">
          <Image
            src={study.heroImage}
            alt={study.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent lg:bg-gradient-to-r" />
        </div>
        
        {/* Content Section */}
        <div className="relative z-10 flex flex-col justify-center p-8 lg:p-12 w-full lg:w-[50%]">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)] border border-[var(--primary)]/20">
              {study.industry}
            </span>
            {study.services.slice(0, 2).map(s => (
              <span key={s} className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-300 border border-white/10">
                {s}
              </span>
            ))}
          </div>
          
          <div className="mb-4 text-sm font-semibold text-gray-400">
            {study.clientName}
          </div>
          
          <h3 className="mb-4 text-2xl lg:text-3xl font-bold text-white leading-tight">
            {study.title}
          </h3>
          
          <p className="mb-8 text-base text-gray-400 leading-relaxed line-clamp-3">
            {study.summary}
          </p>
          
          {study.metrics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 p-4 rounded-xl bg-black/40 border border-white/5">
              {study.metrics.slice(0, 3).map((metric) => (
                <div key={metric.id}>
                  <div className="text-xl font-bold text-white">
                    {metric.prefix}{metric.value}{metric.suffix}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{metric.label}</div>
                </div>
              ))}
            </div>
          )}
          
          <Link href={`/case-studies/${study.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] group/link w-fit">
            Read Full Case Study
            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    );
  }

  // Standard Grid Card
  return (
    <Link href={`/case-studies/${study.slug}`} className={cn("group flex flex-col overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.02] transition-all hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[var(--primary)]/10 hover:border-[var(--primary)]/30", className)}>
      <div className="relative h-[240px] w-full overflow-hidden">
        <Image
          src={study.coverImage}
          alt={study.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white border border-white/10">
            {study.industry}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 p-6">
        <div className="text-xs font-semibold text-[var(--primary)] mb-2">
          {study.clientName}
        </div>
        
        <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
          {study.title}
        </h3>
        
        <p className="text-sm text-gray-400 mb-6 line-clamp-2 flex-1">
          {study.summary}
        </p>
        
        {study.metrics.length > 0 && (
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/[0.08]">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {study.metrics[0].prefix}{study.metrics[0].value}{study.metrics[0].suffix}
              </div>
              <div className="text-xs text-gray-400">{study.metrics[0].label}</div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {new Date(study.publishDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric'})}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {study.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
