import { BarChart3, FileText, Goal, Megaphone, Target, TrendingUp, Palette, Search, Layers } from "lucide-react";
import type { SharedResult, SharedService, SharedStat } from "@/types/shared";

export const metaAdsBenefits = ["High ROI Campaigns", "Advanced Targeting", "A/B Testing", "Retargeting Experts"];

export const metaAdsStats: SharedStat[] = [
  { id: "strategy", title: "Data-Driven Strategy", description: "Every decision backed by data", icon: BarChart3 },
  { id: "creative", title: "Creative Ad Excellence", description: "Scroll-stopping creatives that convert", icon: Palette },
  { id: "pixel", title: "Pixel & Conversion Setup", description: "Accurate tracking for better results", icon: Goal },
  { id: "optimization", title: "Ongoing Optimization", description: "Continuous testing for maximum ROI", icon: TrendingUp },
  { id: "reporting", title: "Transparent Reporting", description: "Clear reports & insights you can trust", icon: FileText },
];

export const metaAdsServices: SharedService[] = [
  { id: "audience", title: "Audience Research & Targeting", description: "Find the right audience for your business", icon: Search },
  { id: "creatives", title: "High-Converting Ad Creatives", description: "Engaging ads that get more clicks & leads", icon: Palette },
  { id: "setup", title: "Campaign Setup & Management", description: "Perfect setup, smart bidding & daily management", icon: Layers },
  { id: "ab-testing", title: "A/B Testing & Optimization", description: "Test, analyze & scale what works best", icon: Target },
  { id: "retargeting", title: "Retargeting & Remarketing", description: "Bring back interested users and convert them", icon: Megaphone },
];

export const metaAdsResults: SharedResult[] = [
  { id: "conversions", value: "230%", label: "Increase in Conversions", icon: Goal },
  { id: "roas", value: "4.6x", label: "Average ROAS", icon: TrendingUp },
  { id: "cpl", value: "-35%", label: "Reduction in Cost Per Lead", icon: Target },
  { id: "revenue", value: "+180%", label: "Increase in Revenue", icon: BarChart3 },
];
