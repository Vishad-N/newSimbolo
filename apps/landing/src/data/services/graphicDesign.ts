import { CheckCircle2, Clock, Palette, PackageOpen, FileImage, Image as ImageIcon, Briefcase, LayoutTemplate, Layers, MousePointer2, FileText } from "lucide-react";
import type { SharedPackage, SharedStat, SharedTestimonial } from "@/types/shared";
import type { ServiceCardData } from "@/components/shared/ServiceCard";
import type { Project } from "@/components/shared/RecentWorksGallery";

export const graphicDesignBenefits = [
  "Unique & Creative Designs",
  "Fast Turnaround",
  "Unlimited Revisions",
  "100% Satisfaction Guarantee",
];

export const graphicDesignStats: SharedStat[] = [
  {
    id: "gd-stat-1",
    title: "Dedicated Designers",
    description: "Work with experts",
    icon: Palette,
  },
  {
    id: "gd-stat-2",
    title: "Fast Delivery",
    description: "Meet your deadlines",
    icon: Clock,
  },
  {
    id: "gd-stat-3",
    title: "Unlimited Revisions",
    description: "Until you're happy",
    icon: CheckCircle2,
  },
  {
    id: "gd-stat-4",
    title: "Source Files Included",
    description: "Get all raw files",
    icon: PackageOpen,
  },
  {
    id: "gd-stat-5",
    title: "100% Ownership",
    description: "Full copyright",
    icon: CheckCircle2,
  },
];

export const graphicDesignServices: ServiceCardData[] = [
  {
    id: "gd-1",
    title: "Logo Design",
    description: "Unique logos that make your brand unforgettable.",
    icon: Palette,
    startingPrice: "2,499",
  },
  {
    id: "gd-2",
    title: "Social Media Posts",
    description: "Eye-catching posts that boost engagement.",
    icon: ImageIcon,
    startingPrice: "999",
  },
  {
    id: "gd-3",
    title: "Poster Design",
    description: "Creative posters for events, promotions & more.",
    icon: FileImage,
    startingPrice: "1,499",
  },
  {
    id: "gd-4",
    title: "Brochure Design",
    description: "Professional brochures that tell your story.",
    icon: FileText,
    startingPrice: "2,499",
  },
  {
    id: "gd-5",
    title: "Business Cards",
    description: "Stylish cards that leave a lasting impression.",
    icon: Briefcase,
    startingPrice: "899",
  },
  {
    id: "gd-6",
    title: "Packaging Design",
    description: "Packaging that stands out on the shelf.",
    icon: PackageOpen,
    startingPrice: "2,999",
  },
  {
    id: "gd-7",
    title: "Banner Design",
    description: "Web & print banners that grab attention.",
    icon: LayoutTemplate,
    startingPrice: "799",
  },
  {
    id: "gd-8",
    title: "UI/UX Design",
    description: "Modern UI/UX for websites & mobile apps.",
    icon: Layers,
    startingPrice: "4,999",
  },
  {
    id: "gd-9",
    title: "Thumbnail Design",
    description: "High CTR thumbnails that drive clicks.",
    icon: MousePointer2,
    startingPrice: "699",
  },
];

export const graphicDesignPackages: SharedPackage[] = [
  {
    id: "gd-pkg-1",
    name: "Basic",
    audience: "For Startups & Individuals",
    priceMonthly: 4999,
    priceYearly: 4999,
    currency: "INR",
    buttonText: "Choose Plan",
    buttonLink: "/contact?service=graphic-design-basic",
    features: [
      "5 Unique Designs",
      "2 Revisions",
      "Delivery in 2 Days",
      "Source File",
    ],
  },
  {
    id: "gd-pkg-2",
    name: "Standard",
    audience: "For Growing Businesses",
    priceMonthly: 9999,
    priceYearly: 9999,
    currency: "INR",
    isPopular: true,
    badge: "Most Popular",
    buttonText: "Choose Plan",
    buttonLink: "/contact?service=graphic-design-standard",
    features: [
      "15 Unique Designs",
      "Unlimited Revisions",
      "Delivery in 3 Days",
      "Source File + Mockups",
    ],
  },
  {
    id: "gd-pkg-3",
    name: "Premium",
    audience: "For Established Brands",
    priceMonthly: 19999,
    priceYearly: 19999,
    currency: "INR",
    buttonText: "Choose Plan",
    buttonLink: "/contact?service=graphic-design-premium",
    features: [
      "30 Unique Designs",
      "Unlimited Revisions",
      "Delivery in 4 Days",
      "Source File + Mockups",
      "Priority Support",
    ],
  },
  {
    id: "gd-pkg-4",
    name: "Enterprise",
    audience: "For Large Businesses",
    priceMonthly: null,
    priceYearly: null,
    currency: "INR",
    buttonText: "Contact Us",
    buttonLink: "/contact?service=graphic-design-custom",
    features: [
      "Custom Design Solutions",
      "Dedicated Designer",
      "Priority Support",
      "Brand Style Guide",
      "Ongoing Design Support",
    ],
  },
];

export const graphicDesignProjects: Project[] = [
  {
    id: "gdp-1",
    title: "Brand Identity",
    category: "Logo & Branding",
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80",
    link: "#",
  },
  {
    id: "gdp-2",
    title: "Social Media Campaign",
    category: "Instagram Posts",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80",
    link: "#",
  },
  {
    id: "gdp-3",
    title: "Product Packaging",
    category: "Packaging Design",
    thumbnail: "https://images.unsplash.com/photo-1586208559093-3d0d62114251?w=600&q=80",
    link: "#",
  },
  {
    id: "gdp-4",
    title: "Event Posters",
    category: "Print Design",
    thumbnail: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80",
    link: "#",
  },
];

export const graphicDesignTestimonials: SharedTestimonial[] = [
  {
    id: "gdt-1",
    name: "Rohit Sharma",
    role: "Founder, TechNova",
    quote: "GrowMate's design team is incredibly talented and creative. They understood our brand perfectly and delivered designs that exceeded our expectations.",
    rating: 5,
  },
  {
    id: "gdt-2",
    name: "Priya Patel",
    role: "Marketing Head, RetailCo",
    quote: "The social media creatives they designed for our campaign were stunning. We saw a 40% increase in engagement right away.",
    rating: 5,
  },
];

export const graphicDesignFaqs = [
  {
    id: "gd-faq-1",
    question: "What types of graphic design services do you offer?",
    answer: "We provide a full range of graphic design services including logo design, branding packages, social media graphics, UI/UX design, print materials (brochures, flyers), and custom illustrations."
  },
  {
    id: "gd-faq-2",
    question: "Do I own the rights to the designs?",
    answer: "Yes, once the project is completed and fully paid for, you will receive full copyright ownership of the final designs, along with the source files."
  },
  {
    id: "gd-faq-3",
    question: "How does the revision process work?",
    answer: "We typically include 2-3 rounds of revisions depending on the package you choose. We work closely with you to ensure the final design perfectly matches your vision."
  },
  {
    id: "gd-faq-4",
    question: "What file formats will I receive?",
    answer: "You will receive high-resolution files suitable for both print and digital use, including PNG, JPEG, PDF, and the original vector source files (AI, EPS, or PSD)."
  }
];
