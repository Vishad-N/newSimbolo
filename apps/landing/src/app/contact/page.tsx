import { Suspense } from "react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact Us | The Simbolo",
  description: "Get in touch with our team to discuss your digital growth.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-32 pb-24 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] bg-gradient-to-b from-[var(--primary)]/10 via-[var(--accent)]/5 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent)]/5 blur-[120px] pointer-events-none z-0" />
      
      <div className="container relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-6">
            Let's build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">growth strategy</span>
          </h1>
          <p className="text-[var(--muted)] text-lg">
            Ready to scale your business? Fill out the form below and one of our experts will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20">
          <Suspense fallback={<div className="h-[500px] rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse" />}>
            <ContactForm />
          </Suspense>

          <aside className="flex flex-col gap-8">
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/20 p-8 backdrop-blur-md">
              <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[0.85rem] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Email Us</p>
                  <a href="mailto:hello@thesimbolo.com" className="text-[var(--text-primary)] font-medium hover:text-[var(--primary)] transition-colors">
                    hello@thesimbolo.com
                  </a>
                </div>
                <div>
                  <p className="text-[0.85rem] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Call Us</p>
                  <a href="tel:+919876543210" className="text-[var(--text-primary)] font-medium hover:text-[var(--primary)] transition-colors">
                    +91 98765 43210
                  </a>
                </div>
                <div>
                  <p className="text-[0.85rem] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Visit Us</p>
                  <p className="text-[var(--text-primary)] font-medium">
                    123 Business Avenue, Tech Hub<br />
                    Mumbai, Maharashtra 400001<br />
                    India
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 p-8 backdrop-blur-md">
              <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-3">Prefer a direct chat?</h3>
              <p className="text-[var(--muted)] text-sm mb-6">
                Skip the form and talk directly to our team via WhatsApp.
              </p>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#25D366] px-6 font-bold text-white transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#25D366]/30"
              >
                Chat on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
