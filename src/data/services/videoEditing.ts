import { MonitorPlay, Star, Users, LayoutTemplate, Film, Shield, Clock } from "lucide-react";
import type { SharedPackage, SharedStat, SharedTestimonial } from "@/types/shared";

export const videoEditingBenefits = [
  "High Quality Edits",
  "Fast Turnaround",
  "Unlimited Revisions",
  "100% Satisfaction",
];

export const videoEditingStats: SharedStat[] = [
  {
    id: "ve-stat-1",
    title: "Expert Editors",
    description: "Skilled & Experienced",
    icon: Users,
  },
  {
    id: "ve-stat-2",
    title: "Premium Tools",
    description: "Industry Standard Softwares",
    icon: LayoutTemplate,
  },
  {
    id: "ve-stat-3",
    title: "All Formats",
    description: "Reels, Shorts, YouTube & More",
    icon: Film,
  },
  {
    id: "ve-stat-4",
    title: "Secure & Confidential",
    description: "Your Data is Safe",
    icon: Shield,
  },
  {
    id: "ve-stat-5",
    title: "On-Time Delivery",
    description: "Always on Deadline",
    icon: Clock,
  },
];

export const videoEditingPackages: SharedPackage[] = [
  {
    id: "ve-pkg-1",
    name: "Basic",
    audience: "For Starters",
    priceMonthly: 2499,
    priceYearly: 2499,
    currency: "INR",
    buttonText: "Choose Plan",
    buttonLink: "/contact?service=video-editing-basic",
    features: [
      "Up to 60 Sec",
      "Basic Transitions",
      "Text & Titles",
      "Background Music",
      "1 Revision",
    ],
  },
  {
    id: "ve-pkg-2",
    name: "Standard",
    audience: "For Growing Brands",
    priceMonthly: 4999,
    priceYearly: 4999,
    currency: "INR",
    isPopular: true,
    badge: "Most Popular",
    buttonText: "Choose Plan",
    buttonLink: "/contact?service=video-editing-standard",
    features: [
      "Up to 3 Minutes",
      "Smooth Transitions",
      "Text, Titles & Captions",
      "Background Music",
      "Color Correction",
      "2 Revisions",
    ],
  },
  {
    id: "ve-pkg-3",
    name: "Premium",
    audience: "For Professionals",
    priceMonthly: 7999,
    priceYearly: 7999,
    currency: "INR",
    buttonText: "Choose Plan",
    buttonLink: "/contact?service=video-editing-premium",
    features: [
      "Up to 10 Minutes",
      "Advanced Effects",
      "Motion Graphics",
      "Sound Design",
      "Color Grading",
      "3 Revisions",
    ],
  },
  {
    id: "ve-pkg-4",
    name: "YouTube Pro",
    audience: "For Creators",
    priceMonthly: 11999,
    priceYearly: 11999,
    currency: "INR",
    buttonText: "Choose Plan",
    buttonLink: "/contact?service=video-editing-youtube-pro",
    features: [
      "10+ Minutes",
      "Cinematic Editing",
      "Thumbnail Design",
      "Royalty Free Music",
      "4 Revisions",
      "Priority Support",
    ],
  },
];

export const portfolioWorks = [
  {
    id: "pw-1",
    title: "Travel Vlog Edit",
    category: "Vlog",
    duration: "2:45",
    thumbnail: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&q=80",
  },
  {
    id: "pw-2",
    title: "YouTube Tech Review",
    category: "Tech",
    duration: "8:12",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
  },
  {
    id: "pw-3",
    title: "Reels - Fashion Brand",
    category: "Social Media",
    duration: "0:28",
    thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
  },
  {
    id: "pw-4",
    title: "Podcast Highlights",
    category: "Podcast",
    duration: "1:15",
    thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80",
  },
  {
    id: "pw-5",
    title: "Product Promotion",
    category: "Promo",
    duration: "0:45",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&q=80",
  },
  {
    id: "pw-6",
    title: "Real Estate Promo",
    category: "Promo",
    duration: "1:02",
    thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  },
];

export const videoEditingTestimonials: SharedTestimonial[] = [
  {
    id: "ve-test-1",
    name: "Rohit Sharma",
    role: "Fitness Influencer",
    quote: "Amazing editing quality and super fast delivery! They truly understand what works.",
    rating: 5,
  },
  {
    id: "ve-test-2",
    name: "Priya Desai",
    role: "Tech YouTuber",
    quote: "Their YouTube Pro package helped my channel grow. The cinematic edits are top-notch.",
    rating: 5,
  },
  {
    id: "ve-test-3",
    name: "Anand Mehta",
    role: "E-commerce Founder",
    quote: "Great attention to detail. The product promotion videos converted really well for our ads.",
    rating: 5,
  },
];

export const toolsWeUse = [
  {
    id: "tool-1",
    name: "Adobe Premiere Pro",
    shortName: "Pr",
    color: "#e2bbfd",
    bgColor: "#2a0b3c",
  },
  {
    id: "tool-2",
    name: "After Effects",
    shortName: "Ae",
    color: "#b0baff",
    bgColor: "#161b36",
  },
  {
    id: "tool-3",
    name: "Photoshop",
    shortName: "Ps",
    color: "#31a8ff",
    bgColor: "#001e36",
  },
  {
    id: "tool-4",
    name: "DaVinci Resolve",
    shortName: "Dv",
    iconUrl: "/assets/davinci.png",
    color: "#ff8475",
    bgColor: "#361816",
  },
  {
    id: "tool-5",
    name: "Audition",
    shortName: "Au",
    color: "#00f0a8",
    bgColor: "#002d24",
  },
  {
    id: "tool-6",
    name: "Final Cut Pro",
    shortName: "Fc",
    color: "#ffffff",
    bgColor: "#1e1e1e",
  },
];

export const toolsStats = [
  { id: "st-1", label: "Projects Completed", value: "500+", icon: MonitorPlay },
  { id: "st-2", label: "Client Satisfaction", value: "98%", icon: Star },
  { id: "st-3", label: "Happy Clients", value: "100+", icon: Users },
  { id: "st-4", label: "Support Available", value: "24/7", icon: Clock },
];
