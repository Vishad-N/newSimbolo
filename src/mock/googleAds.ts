import { BarChart3, FileText, Gauge, Goal, Handshake, LineChart, Megaphone, MonitorPlay, PlaySquare, RefreshCw, Search, ShieldCheck, ShoppingCart, Target, TrendingDown, TrendingUp, Users } from "lucide-react";
import type { GoogleAdsProcessStep, GoogleAdsResult, GoogleAdsService, GoogleAdsStat } from "@/types/googleAds";

export const googleAdsBenefits = ["High ROI Campaigns", "Targeted Traffic", "Low Cost Per Lead", "Better Conversions"];

export const googleAdsStats: GoogleAdsStat[] = [
  { id: "certified", title: "Google Certified Experts", description: "Experienced & certified professionals", icon: Search },
  { id: "strategy", title: "Data-Driven Strategy", description: "Every decision backed by data", icon: BarChart3 },
  { id: "conversion", title: "Conversion Focused", description: "We focus on real business results", icon: Target },
  { id: "reporting", title: "Transparent Reporting", description: "Clear reports & real-time insights", icon: FileText },
  { id: "optimization", title: "Continuous Optimization", description: "Improve performance, reduce cost", icon: RefreshCw },
];

export const googleAdsServices: GoogleAdsService[] = [
  { id: "search-ads", title: "Search Ads", description: "Appear on Google Search results & capture high-intent customers.", icon: Search },
  { id: "display-ads", title: "Display Ads", description: "Show your ads on top websites across the Google Display Network.", icon: MonitorPlay },
  { id: "shopping-ads", title: "Shopping Ads", description: "Promote your products with visually appealing Shopping Ads.", icon: ShoppingCart },
  { id: "youtube-ads", title: "YouTube Ads", description: "Reach & engage your audience on the world's largest video platform.", icon: PlaySquare },
  { id: "remarketing", title: "Remarketing Ads", description: "Re-engage visitors & convert them into loyal customers.", icon: Megaphone },
  { id: "performance-max", title: "Performance Max", description: "Get more conversions across all Google channels with PMax.", icon: Goal },
];

export const googleAdsProcess: GoogleAdsProcessStep[] = [
  { id: "research", title: "1. Research", description: "We analyze your business, competitors & audience.", icon: Users },
  { id: "strategy", title: "2. Strategy", description: "We create a winning Google Ads strategy.", icon: Handshake },
  { id: "setup", title: "3. Setup", description: "We set up campaigns with best practices.", icon: ShieldCheck },
  { id: "optimize", title: "4. Optimize", description: "We optimize ads for better performance & lower costs.", icon: RefreshCw },
  { id: "scale", title: "5. Scale", description: "We scale campaigns to maximize ROI.", icon: TrendingUp },
];

export const googleAdsResults: GoogleAdsResult[] = [
  { id: "conversions", value: "230%", label: "Increase in Conversions", icon: Gauge },
  { id: "roas", value: "+180%", label: "Increase in ROAS", icon: LineChart },
  { id: "cpl", value: "-32%", label: "Decrease in Cost Per Lead", icon: TrendingDown },
  { id: "retention", value: "90%", label: "Client Retention", icon: ShieldCheck },
];

export const whyChooseItems = ["Google Certified Experts", "High ROI & Low CPL", "Transparent Communication", "24/7 Support & Guidance"];
