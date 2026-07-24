"use client";

import { TechStack } from "@/components/websiteDesign/TechStack";
import { 
  Code2, 
  Database, 
  Cloud, 
  Server, 
  Cpu, 
  Layers, 
  Blocks, 
  ShoppingCart,
  Zap,
  CreditCard,
  Globe
} from "lucide-react";

// For missing custom logos, we use Lucide icons with respective brand colors
const techStack = [
  { id: "react", name: "React", description: "Frontend UI", icon: Code2, color: "#61DAFB" },
  { id: "nextjs", name: "Next.js", description: "React Framework", icon: Layers, color: "#FFFFFF" },
  { id: "nestjs", name: "NestJS", description: "Backend Node", icon: Server, color: "#E0234E" },
  { id: "springboot", name: "Spring Boot", description: "Java Framework", icon: Zap, color: "#6DB33F" },
  { id: "java", name: "Java", description: "Backend Core", icon: Cpu, color: "#ED8B00" },
  { id: "nodejs", name: "Node.js", description: "Runtime", icon: Blocks, color: "#339933" },
  { id: "typescript", name: "TypeScript", description: "Typed JS", icon: Code2, color: "#3178C6" },
  { id: "postgresql", name: "PostgreSQL", description: "Database", icon: Database, color: "#336791" },
  { id: "mongodb", name: "MongoDB", description: "NoSQL DB", icon: Database, color: "#47A248" },
  { id: "docker", name: "Docker", description: "Containerization", icon: Cloud, color: "#2496ED" },
  { id: "aws", name: "AWS", description: "Cloud Services", icon: Cloud, color: "#FF9900" },
  { id: "vercel", name: "Vercel", description: "Deployment", icon: Globe, color: "#FFFFFF" },
  { id: "cloudflare", name: "Cloudflare", description: "CDN & Security", icon: Cloud, color: "#F38020" },
  { id: "shopify", name: "Shopify", description: "E-Commerce", icon: ShoppingCart, color: "#95BF47" },
  { id: "woocommerce", name: "WooCommerce", description: "WP Commerce", icon: ShoppingCart, color: "#96588A" },
  { id: "wordpress", name: "WordPress", description: "CMS", icon: Globe, color: "#21759B" },
  { id: "stripe", name: "Stripe", description: "Payments", icon: CreditCard, color: "#008CDD" },
  { id: "razorpay", name: "Razorpay", description: "India Payments", icon: CreditCard, color: "#0C5FCD" },
];

export function TechStackChips() {
  return (
    <section className="py-20 px-4 sm:px-8 lg:px-10 border-t border-white/5 bg-[var(--sidebar)]">
      <div className="mx-auto max-w-[1290px]">
        <TechStack title="Technology & Platforms" technologies={techStack} />
      </div>
    </section>
  );
}
