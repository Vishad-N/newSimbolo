"use client";

import { motion } from "framer-motion";
import { Search, Megaphone, BarChart3, MonitorPlay, Zap, ShoppingCart, Gem, Video, DraftingCompass } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Digital Marketing",
    description: "Drive traffic, generate leads, and maximize your ROI.",
    icon: BarChart3,
    color: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
    border: "border-[#22C55E]/30",
    services: [
      { name: "SEO", icon: Search, href: "/services/seo" },
      { name: "Google Ads", icon: BarChart3, href: "/services/google-ads" },
      { name: "Meta Ads", icon: Megaphone, href: "/services/meta-ads" },
    ]
  },
  {
    title: "Website Solutions",
    description: "Build high-converting, lightning-fast digital experiences.",
    icon: MonitorPlay,
    color: "text-[#3B82F6]",
    bg: "bg-[#3B82F6]/10",
    border: "border-[#3B82F6]/30",
    services: [
      { name: "Website Development", icon: MonitorPlay, href: "/services/website-design" },
      { name: "UI/UX Design", icon: Zap, href: "/services/website-design#ui-ux" },
      { name: "Performance Optimization", icon: Zap, href: "/services/website-design#performance" },
    ]
  },
  {
    title: "Commerce",
    description: "Scale your online store and increase average order value.",
    icon: ShoppingCart,
    color: "text-[#A855F7]",
    bg: "bg-[#A855F7]/10",
    border: "border-[#A855F7]/30",
    services: [
      { name: "Shopify", icon: ShoppingCart, href: "/services/ecommerce" },
      { name: "WooCommerce", icon: ShoppingCart, href: "/services/ecommerce" },
      { name: "Custom Stores", icon: Gem, href: "/services/ecommerce" },
    ]
  },
  {
    title: "Creative",
    description: "Engaging visual content that tells your brand story.",
    icon: Video,
    color: "text-[#EC4899]",
    bg: "bg-[#EC4899]/10",
    border: "border-[#EC4899]/30",
    services: [
      { name: "Video Editing", icon: Video, href: "/services/video-editing" },
      { name: "Graphic Design", icon: DraftingCompass, href: "/services/graphic-design" },
      { name: "Brand Identity", icon: Gem, href: "/services/graphic-design#branding" },
    ]
  }
];

export function ServiceCategories() {
  return (
    <section id="service-categories" className="py-20 px-4 sm:px-8 lg:px-10 border-t border-white/5 bg-[var(--background)]">
      <div className="mx-auto max-w-[1290px]">
        <div className="mb-12 text-center">
          <h2 className="text-[2rem] font-bold text-white sm:text-[2.5rem]">
            Explore by <span className="text-[var(--primary)]">Category</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-[1rem] text-[var(--muted)]">
            Find exactly what you need with our organized service hubs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category, index) => {
            const CatIcon = category.icon;
            
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-[16px] border border-white/10 bg-[var(--surface)] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]"
              >
                <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-100 ${category.bg}`} />
                
                <div className="relative z-10 flex items-start gap-5">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[12px] border ${category.bg} ${category.border} ${category.color}`}>
                    <CatIcon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-[1.3rem] font-bold text-white">{category.title}</h3>
                    <p className="mt-1.5 text-[0.9rem] text-[var(--muted)] max-w-[280px]">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-8 grid gap-3">
                  {category.services.map((service) => {
                    const ServiceIcon = service.icon;
                    return (
                      <Link
                        key={service.name}
                        href={service.href}
                        className="group/link flex items-center justify-between rounded-[8px] bg-white/5 p-3 px-4 transition-colors hover:bg-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <ServiceIcon className="h-4 w-4 text-[var(--muted)] group-hover/link:text-white transition-colors" />
                          <span className="text-[0.95rem] font-medium text-white/90 group-hover/link:text-white transition-colors">
                            {service.name}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[var(--muted)] opacity-0 -translate-x-2 transition-all group-hover/link:opacity-100 group-hover/link:translate-x-0 group-hover/link:text-white" />
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
