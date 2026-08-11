"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { landingApi } from "@/lib/api";

export function ContactForm() {
  const searchParams = useSearchParams();
  const defaultService = searchParams.get("service") || searchParams.get("type") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    service: defaultService.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await landingApi.submitContactForm(formData);
      setIsSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-12 text-center backdrop-blur-md flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-20 w-20 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mb-6 text-[var(--primary)]">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Request Received!</h2>
        <p className="text-[var(--muted)] max-w-md mx-auto mb-8">
          Thank you for reaching out. One of our growth experts will review your request and get back to you shortly.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-[var(--primary)] font-medium hover:underline"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-white/80">First Name *</label>
            <input 
              type="text" 
              id="firstName" 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all"
              required
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-white/80">Last Name *</label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all"
              required
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white/80">Work Email *</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all"
              required
              placeholder="john@company.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-white/80">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium text-white/80">Company Name</label>
            <input 
              type="text" 
              id="company" 
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all"
              placeholder="Company Inc."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="service" className="text-sm font-medium text-white/80">Service of Interest</label>
            <div className="relative">
              <select 
                id="service" 
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all appearance-none"
              >
                <option value="" className="bg-[var(--card)] text-white">Select a service...</option>
                <option value="Seo" className="bg-[var(--card)] text-white">SEO</option>
                <option value="Seo Expert" className="bg-[var(--card)] text-white">SEO Expert Consultation</option>
                <option value="Google Ads" className="bg-[var(--card)] text-white">Google Ads</option>
                <option value="Meta Ads" className="bg-[var(--card)] text-white">Meta Ads</option>
                <option value="Website Design" className="bg-[var(--card)] text-white">Website Design</option>
                <option value="Ecommerce" className="bg-[var(--card)] text-white">E-commerce Solutions</option>
                <option value="Graphic Design" className="bg-[var(--card)] text-white">Graphic Design</option>
                <option value="Video Editing" className="bg-[var(--card)] text-white">Video Editing</option>
                <option value="Other" className="bg-[var(--card)] text-white">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-white/80">How can we help you? *</label>
          <textarea 
            id="message" 
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all resize-none"
            required
            placeholder="Tell us about your project goals..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="group relative w-full inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-[var(--background)] px-8 text-lg font-bold transition-all hover:bg-[var(--primary-hover)] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative flex items-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Get Started
                <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </span>
        </button>
        <p className="text-center text-xs text-[var(--muted)] mt-4">
          By submitting this form, you agree to our Privacy Policy and Terms of Service.
        </p>
      </form>
    </div>
  );
}
