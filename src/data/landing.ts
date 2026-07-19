import {
  BadgePercent,
  BarChart3,
  Boxes,
  BriefcaseBusiness,
  Camera,
  Crown,
  DraftingCompass,
  Film,
  Gem,
  Gift,
  Grid2X2,
  HandCoins,
  Headphones,
  HelpCircle,
  Mail,
  Megaphone,
  MonitorPlay,
  MousePointer2,
  PencilLine,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Video,
  Workflow,
  Zap,
} from "lucide-react";
import type { NavItem, ServiceCardData } from "@/types/landing";

export const exploreNav: NavItem[] = [
  { label: "AI Marketing Match", icon: Sparkles, href: "/" },
  { label: "Services", icon: Workflow, href: "/#services" },
  { label: "Packages", icon: Boxes, href: "/packages" },
  { label: "Agencies", icon: BriefcaseBusiness, href: "/#agencies" },
  { label: "Freelancers", icon: Users, href: "/#freelancers" },
];

export const marketingNav: NavItem[] = [
  { label: "SEO", icon: Search, href: "/services/seo" },
  { label: "Google Ads", icon: MousePointer2, href: "/services/google-ads" },
  { label: "Meta Ads", icon: Megaphone, href: "/services/meta-ads" },
  { label: "Instagram Marketing", icon: Camera, href: "/#instagram-marketing" },
  { label: "Website Design", icon: MonitorPlay, href: "/services/website-design" },
  { label: "Video Editing", icon: Video, href: "/services/video-editing" },
  { label: "Graphic Design", icon: DraftingCompass, href: "/services/graphic-design" },
  { label: "Branding", icon: Gem, href: "/#branding" },
  { label: "Content Writing", icon: PencilLine, href: "/#content-writing" },
  { label: "Social Media Management", icon: Workflow, href: "/#social-media-management" },
  { label: "Email Marketing", icon: Mail, href: "/#email-marketing" },
  { label: "Lead Generation", icon: Target, href: "/#lead-generation" },
];

export const growNav: NavItem[] = [
  { label: "Become Seller", icon: HandCoins, href: "/#become-seller" },
  { label: "Agency Dashboard", icon: Users, href: "/#agency-dashboard" },
  { label: "Affiliate Program", icon: BadgePercent, href: "/affiliate-program" },
  { label: "Pricing", icon: ShieldCheck, href: "/#pricing" },
  { label: "Help Center", icon: HelpCircle, href: "/#help-center" },
];

export const categoryChips = [
  { label: "SEO", icon: Search },
  { label: "Meta Ads", icon: Workflow },
  { label: "Google Ads", icon: BarChart3 },
  { label: "Instagram Marketing", icon: Camera },
  { label: "Reel Editing", icon: Film },
  { label: "Website Design", icon: MonitorPlay },
  { label: "Branding", icon: Gem },
  { label: "Content Writing", icon: PencilLine },
  { label: "Email Marketing", icon: Mail },
  { label: "Lead Generation", icon: Target },
  { label: "Video Editing", icon: Video },
  { label: "Social Media Management", icon: Workflow },
];

export const services: ServiceCardData[] = [
  {
    title: "Meta Ads",
    icon: Megaphone,
    image: "/images/services/meta-ads.png",
    bullets: ["Facebook Ads", "Instagram Ads", "Lead Generation", "E-commerce Ads"],
    price: "₹4,999",
    rating: "4.9",
    accent: "blue",
  },
  {
    title: "SEO",
    icon: Search,
    image: "/images/services/seo.png",
    bullets: ["Technical SEO", "Local SEO", "Keyword Research", "Backlinks"],
    price: "₹7,999",
    rating: "4.8",
    accent: "green",
  },
  {
    title: "Website Design",
    icon: MonitorPlay,
    image: "/images/services/website-design.png",
    bullets: ["WordPress", "Shopify", "Landing Pages", "Speed Optimization"],
    price: "₹14,999",
    rating: "4.9",
    accent: "cyan",
  },
  {
    title: "Video Editing",
    icon: Film,
    image: "/images/services/video-editing.png",
    bullets: ["Reels", "YouTube", "Podcasts", "Ads"],
    price: "₹5,999",
    rating: "4.8",
    accent: "purple",
  },
  {
    title: "Social Media Management",
    icon: Gift,
    image: "/images/services/social-media.png",
    bullets: ["Instagram Growth", "LinkedIn", "Content Strategy", "Monthly Management"],
    price: "₹6,999",
    rating: "4.9",
    accent: "pink",
  },
];

export const chooseItems = [
  { label: "500+ Marketing Experts", icon: BadgePercent },
  { label: "Fast Delivery", icon: Zap },
  { label: "24/7 Customer Support", icon: Headphones },
  { label: "Verified Agencies", icon: ShieldCheck },
  { label: "AI-Powered Matching", icon: Sparkles },
  { label: "100% Secure Payments", icon: ShieldCheck },
];

export const brands = ["apollo", "Cipla", "lenskart", "Myntra", "TATA", "SAMSUNG", "boat", "Paytm", "SWIGGY"];

export const CrownIcon = Crown;
export const DashboardIcon = Grid2X2;
