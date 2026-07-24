import { BarChart3, FileSearch, Globe2, Link2, MapPin, Search, Bot, Zap } from "lucide-react";
import type { SeoService } from "@/types/seo";

export const seoServices: SeoService[] = [
  {
    id: "keyword-research",
    title: "Keyword Research",
    description: "Find the right keywords that drive results.",
    icon: Search,
  },
  {
    id: "on-page-seo",
    title: "On-Page SEO",
    description: "Optimize content, meta and website structure.",
    icon: BarChart3,
  },
  {
    id: "off-page-seo",
    title: "Off-Page SEO",
    description: "Build authority with quality backlinks.",
    icon: Link2,
  },
  {
    id: "technical-seo",
    title: "Technical SEO",
    description: "Improve speed, indexability and core web vitals.",
    icon: Globe2,
  },
  {
    id: "geo",
    title: "GEO",
    description: "Generative Engine Optimization for AI search.",
    icon: Bot,
  },
  {
    id: "aeo",
    title: "AEO",
    description: "Answer Engine Optimization for voice & snippets.",
    icon: Zap,
  },
];
