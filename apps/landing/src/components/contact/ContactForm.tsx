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
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/20 p-8 backdrop-blur-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-[var(--text-primary)] mb-2">First Name *</label>
            <input 
              type="text" 
              id="firstName" 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-[var(--text-primary)] mb-2">Last Name *</label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-2">Work Email *</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[var(--text-primary)] mb-2">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-[var(--text-primary)] mb-2">Company Name</label>
            <input 
              type="text" 
              id="company" 
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-all"
            />
          </div>
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-[var(--text-primary)] mb-2">Service of Interest</label>
            <select 
              id="service" 
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-all appearance-none"
            >
              <option value="" className="text-black">Select a service...</option>
              <option value="Seo" className="text-black">SEO</option>
              <option value="Seo Expert" className="text-black">SEO Expert Consultation</option>
              <option value="Google Ads" className="text-black">Google Ads</option>
              <option value="Meta Ads" className="text-black">Meta Ads</option>
              <option value="Website Design" className="text-black">Website Design</option>
              <option value="Ecommerce" className="text-black">E-commerce Solutions</option>
              <option value="Graphic Design" className="text-black">Graphic Design</option>
              <option value="Video Editing" className="text-black">Video Editing</option>
              <option value="Other" className="text-black">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-[var(--text-primary)] mb-2">How can we help you? *</label>
          <textarea 
            id="message" 
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-all resize-none"
            required
            placeholder="Tell us about your project, goals, and timeline..."
          ></textarea>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-8 py-4 font-bold text-white transition-all hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)] disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--primary)]/30"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending Request...
            </>
          ) : (
            <>
              Get Started
              <Send className="h-5 w-5 ml-2" />
            </>
          )}
        </button>
        <p className="text-center text-xs text-[var(--muted)] mt-4">
          By submitting this form, you agree to our Privacy Policy and Terms of Service.
        </p>
      </form>
    </div>
  );
}
