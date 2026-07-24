"use client";

import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { SectionCard } from "@/components/seo/SectionCard";
import { motion } from "framer-motion";

export function TrustLocation() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left Side: Office Details */}
      <SectionCard className="p-8 sm:p-10 flex flex-col justify-center">
        <h2 className="text-[1.5rem] font-black text-white mb-3">Visit Our Office</h2>
        <p className="text-[0.95rem] text-white/70 mb-8 leading-relaxed">
          We believe in complete transparency. Feel free to visit us, schedule a meeting, or connect with us directly to discuss your project.
        </p>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white/5 text-[var(--accent)]">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-[0.85rem] font-bold text-white mb-1">Office Address</h4>
              <p className="text-[0.85rem] text-white/60 leading-relaxed">123 Innovation Drive, Tech Park<br/>Mumbai, MH 400001, India</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white/5 text-[var(--accent)]">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-[0.85rem] font-bold text-white mb-1">Phone Number</h4>
              <p className="text-[0.85rem] text-white/60">+91 8982948199</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white/5 text-[var(--accent)]">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-[0.85rem] font-bold text-white mb-1">Email Address</h4>
              <p className="text-[0.85rem] text-white/60">hello@thesimbolo.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white/5 text-[var(--accent)]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-[0.85rem] font-bold text-white mb-1">Working Hours</h4>
              <p className="text-[0.85rem] text-white/60">Monday - Friday: 9:00 AM - 6:00 PM<br/>Saturday: 10:00 AM - 2:00 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button className="h-12 rounded-[8px] bg-[var(--accent)] px-8 text-[0.95rem] font-bold text-black transition hover:bg-[var(--accent-hover)] hover:shadow-[0_0_20px_var(--accent-glow)]">
            Get Directions
          </button>
        </div>
      </SectionCard>

      {/* Right Side: Google Map & Trust Badges */}
      <div className="flex flex-col gap-4">
        <SectionCard className="p-2 flex-1 relative overflow-hidden min-h-[300px]">
          {/* Glowing Map Border Effect */}
          <div className="absolute inset-0 rounded-[12px] border-2 border-[var(--accent)]/20 shadow-[inset_0_0_30px_rgba(34,211,238,0.1)] pointer-events-none z-10" />
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120562.1528659123!2d72.80208221808752!3d19.082502006709867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1689234567890!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: "10px", minHeight: "300px" }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="filter grayscale opacity-80 transition-opacity hover:opacity-100 hover:grayscale-0 duration-500"
          ></iframe>
        </SectionCard>

        <SectionCard className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[var(--accent)]" />
              <span className="text-[0.85rem] font-semibold text-white/90">Verified Business</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[var(--accent)]" />
              <span className="text-[0.85rem] font-semibold text-white/90">In-Person Meetings Available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[var(--accent)]" />
              <span className="text-[0.85rem] font-semibold text-white/90">Serving Clients Worldwide</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
