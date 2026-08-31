import type { ReactNode } from "react";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-32 pb-24 relative overflow-hidden">
      {/* Decorative background, matching the rest of the site's content pages */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] bg-gradient-to-b from-[var(--primary)]/10 via-[var(--accent)]/5 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent)]/5 blur-[120px] pointer-events-none z-0" />

      <div className="container relative z-10 mx-auto max-w-4xl px-5 sm:px-8 lg:px-10">
        <div className="text-center mb-14">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            {title}
          </h1>
          <p className="text-[var(--muted)] text-sm">Last updated: {lastUpdated}</p>
        </div>

        <div className="rounded-3xl border border-[var(--primary-border)]/40 bg-[var(--card)]/60 backdrop-blur-xl p-6 sm:p-10 lg:p-12 space-y-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3">
        {title}
      </h2>
      <div className="space-y-3 text-[0.95rem] leading-relaxed text-[var(--muted)] [&_strong]:text-[var(--text-primary)] [&_a]:text-[var(--primary)] [&_a]:hover:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:marker:text-[var(--primary)]">
        {children}
      </div>
    </section>
  );
}
