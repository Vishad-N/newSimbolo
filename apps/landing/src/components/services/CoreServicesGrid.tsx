"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Search, Megaphone, MonitorPlay, ShoppingCart, Video, DraftingCompass, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const coreServices = [
  {
    id: "seo",
    title: "Search Engine Optimization",
    shortTitle: "SEO",
    icon: Search,
    image: "/images/services/seo.png",
    description: "Dominate search rankings and drive high-intent organic traffic to your website.",
    highlights: ["Technical SEO Audit", "Keyword Strategy", "Quality Link Building"],
    price: "₹7,999",
    href: "/services/seo",
    colSpan: "lg:col-span-2",
    rowSpan: "lg:row-span-1",
    accent: "from-[#22C55E]/20 to-[#10B981]/5 border-[#22C55E]/30",
    glow: "bg-[#22C55E]/10 blur-[80px]",
    layout: "horizontal"
  },
  {
    id: "google-ads",
    title: "Google Ads",
    shortTitle: "Google Ads",
    icon: BarChart3,
    image: "/images/services/seo.png", // reusing an image as placeholder
    description: "Capture active buyers at the exact moment they search for your services.",
    highlights: ["Search Campaigns", "Performance Max", "Retargeting"],
    price: "₹9,999",
    href: "/services/google-ads",
    colSpan: "lg:col-span-1",
    rowSpan: "lg:row-span-1",
    accent: "from-[var(--primary)]/20 to-[var(--primary)]/5 border-[var(--primary)]/30",
    glow: "bg-[var(--primary)]/10 blur-[60px]",
    layout: "vertical"
  },
  {
    id: "website-design",
    title: "Website Development",
    shortTitle: "Website Design",
    icon: MonitorPlay,
    image: "/images/services/website-design.png",
    description: "Custom, high-performance websites built for conversions and brand authority.",
    highlights: ["Custom UI/UX", "Lightning Fast", "Mobile First"],
    price: "₹14,999",
    href: "/services/website-design",
    colSpan: "lg:col-span-1",
    rowSpan: "lg:row-span-1",
    accent: "from-[#3B82F6]/20 to-[#2563EB]/5 border-[#3B82F6]/30",
    glow: "bg-[#3B82F6]/10 blur-[80px]",
    layout: "vertical"
  },
  {
    id: "meta-ads",
    title: "Meta Ads",
    shortTitle: "Meta Ads",
    icon: Megaphone,
    image: "/images/services/meta-ads.png",
    description: "Scroll-stopping ad campaigns on Facebook and Instagram that drive real sales.",
    highlights: ["Creative Testing", "Audience Targeting", "ROAS Optimization"],
    price: "₹4,999",
    href: "/services/meta-ads",
    colSpan: "lg:col-span-2",
    rowSpan: "lg:row-span-1",
    accent: "from-[#06B6D4]/20 to-[#0891B2]/5 border-[#06B6D4]/30",
    glow: "bg-[#06B6D4]/10 blur-[60px]",
    layout: "horizontal"
  },
  {
    id: "ecommerce",
    title: "E-Commerce",
    shortTitle: "E-Commerce",
    icon: ShoppingCart,
    image: "/images/services/website-design.png",
    description: "Scalable online stores built on Shopify and WooCommerce.",
    highlights: ["Shopify Setup", "Payment Gateways", "Inventory Sync"],
    price: "₹19,999",
    href: "/services/ecommerce",
    colSpan: "lg:col-span-1",
    rowSpan: "lg:row-span-1",
    accent: "from-[#A855F7]/20 to-[#9333EA]/5 border-[#A855F7]/30",
    glow: "bg-[#A855F7]/10 blur-[60px]",
    layout: "vertical"
  },
  {
    id: "video-editing",
    title: "Video Editing",
    shortTitle: "Video Editing",
    icon: Video,
    image: "/images/services/video-editing.png",
    description: "Engaging short-form and long-form video content for modern platforms.",
    highlights: ["Instagram Reels", "YouTube Videos", "Ad Creatives"],
    price: "₹5,999",
    href: "/services/video-editing",
    colSpan: "lg:col-span-1",
    rowSpan: "lg:row-span-1",
    accent: "from-[#EC4899]/20 to-[#DB2777]/5 border-[#EC4899]/30",
    glow: "bg-[#EC4899]/10 blur-[60px]",
    layout: "vertical"
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    shortTitle: "Design",
    icon: DraftingCompass,
    image: "/images/services/social-media.png",
    description: "Premium visual assets that elevate your brand identity across all channels.",
    highlights: ["Brand Identity", "Social Graphics", "Print Materials"],
    price: "₹6,999",
    href: "/services/graphic-design",
    colSpan: "lg:col-span-1",
    rowSpan: "lg:row-span-1",
    accent: "from-[#F43F5E]/20 to-[#E11D48]/5 border-[#F43F5E]/30",
    glow: "bg-[#F43F5E]/10 blur-[60px]",
    layout: "vertical"
  }
];

export function CoreServicesGrid() {
  return (
    <section id="core-services" className="py-20 px-4 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1290px]">
        <div className="mb-12">
          <h2 className="text-[2.2rem] font-bold text-white leading-tight sm:text-[2.8rem]">
            Our Core <span className="text-[var(--primary)]">Services</span>
          </h2>
          <p className="mt-3 max-w-[600px] text-[1.05rem] text-[var(--muted)]">
            Discover our premium suite of digital solutions, engineered to scale your business and dominate your industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {coreServices.map((service, index) => {
            const Icon = service.icon;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-[20px] bg-[var(--surface)] border border-white/5 transition-all duration-500 hover:border-white/20 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] ${service.colSpan} ${service.rowSpan}`}
              >
                {/* Accent Background */}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${service.accent}`} />
                <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${service.glow}`} />

                <div className={`relative z-10 flex h-full ${service.layout.includes('horizontal') ? 'flex-col md:flex-row' : 'flex-col'} p-6 sm:p-8 gap-6`}>
                  
                  {/* Text Content */}
                  <div className={`flex flex-col flex-1 ${service.layout.includes('horizontal') ? 'md:order-1' : ''}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-white/5 border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {service.layout.includes('horizontal') && (
                        <h3 className="text-[1.5rem] font-bold text-white">{service.title}</h3>
                      )}
                    </div>
                    
                    {!service.layout.includes('horizontal') && (
                      <h3 className="text-[1.35rem] font-bold text-white mb-2">{service.title}</h3>
                    )}
                    
                    <p className="text-[0.95rem] text-[var(--muted)] leading-relaxed mb-6 flex-1">
                      {service.description}
                    </p>

                    <div className="mb-8 space-y-2.5">
                      {service.highlights.map((highlight) => (
                        <div key={highlight} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[var(--primary)]" />
                          <span className="text-[0.85rem] font-medium text-white/80">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-5">
                      <div>
                        <div className="text-[0.75rem] font-medium text-white/50 mb-1">Starting at</div>
                        <div className="text-[1.3rem] font-black text-white">{service.price}</div>
                      </div>
                      
                      <Link href={service.href} className="flex h-10 items-center justify-center gap-2 rounded-full bg-white/5 px-5 text-[0.85rem] font-bold text-[#ffffff] border border-white/10 transition-all duration-300 group-hover:bg-[var(--primary)] group-hover:text-black group-hover:border-[var(--primary)]">
                        Explore
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Illustration */}
                  <div className={`relative overflow-hidden rounded-[16px] bg-black/20 ${
                    service.layout === 'horizontal' ? 'h-[250px] md:h-auto md:flex-1 md:order-2' : 
                    service.layout === 'horizontal-small' ? 'h-[200px] md:h-auto md:w-[280px] md:order-2' : 
                    service.layout === 'vertical-tall' ? 'h-[240px] w-full mt-4' :
                    'h-[180px] w-full mt-2'
                  }`}>
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
