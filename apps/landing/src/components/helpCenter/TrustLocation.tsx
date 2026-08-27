"use client";

import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { SectionCard } from "@/components/seo/SectionCard";
import { motion } from "framer-motion";

const OFFICE_ADDRESS =
  "1st Floor, The Simbolo Multimedia, Plot No. ED/149, Ring Rd, near Khajrana square, IDA, Scheme, Scheme 94 Sector ED, Indore, Madhya Pradesh 452016";
const OFFICE_ADDRESS_QUERY = encodeURIComponent(OFFICE_ADDRESS);

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
              <p className="text-[0.85rem] text-white/60 leading-relaxed">{OFFICE_ADDRESS}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white/5 text-[var(--accent)]">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-[0.85rem] font-bold text-white mb-1">Phone Number</h4>
              <p className="text-[0.85rem] text-white/60">+91 89829 11880</p>
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
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${OFFICE_ADDRESS_QUERY}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center rounded-[8px] bg-[var(--accent)] px-8 text-[0.95rem] font-bold text-black transition hover:bg-[var(--accent-hover)] hover:shadow-[0_0_20px_var(--accent-glow)]"
          >
            Get Directions
          </a>
        </div>
      </SectionCard>

      {/* Right Side: Google Map & Trust Badges */}
      <div className="flex flex-col gap-4">
        <SectionCard className="p-2 flex-1 relative overflow-hidden min-h-[300px]">
          {/* Glowing Map Border Effect */}
          <div className="absolute inset-0 rounded-[12px] border-2 border-[var(--accent)]/20 shadow-[inset_0_0_30px_rgba(34,211,238,0.1)] pointer-events-none z-10" />
          <iframe
            src={`https://www.google.com/maps?q=${OFFICE_ADDRESS_QUERY}&output=embed`}
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
