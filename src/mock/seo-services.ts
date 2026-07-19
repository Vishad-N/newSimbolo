import { BarChart3, FileSearch, Globe2, Link2, MapPin, Search } from "lucide-react";
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
    id: "local-seo",
    title: "Local SEO",
    description: "Rank higher in local search results.",
    icon: MapPin,
  },
  {
    id: "seo-reporting",
    title: "SEO Reporting",
    description: "Transparent reports with actionable insights.",
    icon: FileSearch,
  },
];
