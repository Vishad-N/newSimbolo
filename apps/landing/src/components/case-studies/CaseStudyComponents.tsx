import { CaseStudyMetric, BeforeAfterMetric, CaseStudyTimelineItem } from "@/types/case-studies";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// KPI Dashboard Component
export function KPIDashboard({ metrics }: { metrics: CaseStudyMetric[] }) {
  if (!metrics || metrics.length === 0) return null;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12">
      {metrics.sort((a, b) => a.displayOrder - b.displayOrder).map(metric => (
        <div key={metric.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm relative overflow-hidden group">
          <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-${metric.accent || 'primary'}-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          <div className={cn("text-4xl md:text-5xl font-bold mb-2 tracking-tight", metric.accent === 'primary' ? 'text-[var(--primary)]' : metric.accent === 'cyan' ? 'text-cyan-400' : metric.accent === 'blue' ? 'text-blue-400' : metric.accent === 'green' ? 'text-emerald-400' : 'text-white')}>
            {metric.prefix}{metric.value}{metric.suffix}
          </div>
          <div className="text-sm font-medium text-gray-400">{metric.label}</div>
        </div>
      ))}
    </div>
  );
}

// Before vs After Card Component
export function BeforeAfterCards({ data }: { data: BeforeAfterMetric[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
      {data.map(item => (
        <div key={item.id} className="rounded-2xl border border-white/5 overflow-hidden bg-black/20 flex flex-col">
          <div className="p-4 border-b border-white/5 bg-white/[0.02] text-center font-bold text-white text-lg tracking-wide">
            {item.metric}
          </div>
          <div className="grid grid-cols-2 divide-x divide-white/5 flex-1">
            <div className="p-6 flex flex-col items-center justify-center text-center">
              <div className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Before</div>
              <div className="text-3xl font-bold text-gray-400 line-through decoration-red-500/50 decoration-2">{item.before}</div>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center bg-[var(--primary)]/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/10 to-transparent" />
              <div className="text-xs font-bold tracking-widest text-[var(--primary)] uppercase mb-2 relative z-10">After</div>
              <div className="text-4xl font-bold text-white relative z-10">{item.after}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Timeline Component
export function TimelineView({ items }: { items: CaseStudyTimelineItem[] }) {
  if (!items || items.length === 0) return null;
  
  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className="my-16">
      <div className="relative border-l-2 border-white/10 ml-4 md:ml-6 space-y-12 pb-4">
        {sortedItems.map((item, index) => (
          <div key={item.id} className="relative pl-8 md:pl-12 group">
            <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-[#0a0a0a] border-2 border-[var(--primary)] group-hover:scale-125 group-hover:bg-[var(--primary)] transition-all duration-300 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
            <div className="text-xs font-bold tracking-widest text-[var(--primary)] uppercase mb-2">Phase {index + 1}</div>
            <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
            {item.description && (
              <p className="text-gray-400 leading-relaxed">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
