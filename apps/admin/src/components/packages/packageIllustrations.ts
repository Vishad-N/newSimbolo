export interface PackageIllustrationOption {
  label: string;
  path: string;
}

const ECOMMERCE_ILLUSTRATION_URL =
  "https://res.cloudinary.com/dkkqzckfq/image/upload/v1786966935/simbolo/package-illustrations/ecommerce-illustration-photoroom.png";

export const PACKAGE_ILLUSTRATION_OPTIONS: readonly PackageIllustrationOption[] = [
  { label: "AI Automation", path: "/images/services/ai_automation_1784887931272.png" },
  { label: "Branding", path: "/images/services/branding_1784887903218.png" },
  { label: "Content Marketing", path: "/images/services/content_marketing_1784887968386.png" },
  { label: "CRM Integration", path: "/images/services/crm_integration_1784887948999.png" },
  { label: "E-commerce Illustration", path: ECOMMERCE_ILLUSTRATION_URL },
  { label: "E-commerce", path: "/images/services/ecommerce_1784887873510.png" },
  { label: "Email Marketing", path: "/images/services/email_marketing_1784887958663.png" },
  { label: "Google Ads", path: "/images/services/google_ads_1784887852918.png" },
  { label: "Graphic Design", path: "/images/services/graphic_design_1784887863706.png" },
  { label: "Meta Ads", path: "/images/services/meta-ads.png" },
  { label: "Mobile App Development", path: "/images/services/mobile_app_development_1784887912184.png" },
  { label: "Performance Marketing", path: "/images/services/performance_marketing_1784887977444.png" },
  { label: "SEO", path: "/images/services/seo.png" },
  { label: "Shopify Development", path: "/images/services/shopify_development_1784887883421.png" },
  { label: "Social Media", path: "/images/services/social-media.png" },
  { label: "UI/UX Design", path: "/images/services/ui_ux_design_1784887921459.png" },
  { label: "Video Editing", path: "/images/services/video-editing.png" },
  { label: "Website Design", path: "/images/services/website-design.png" },
];
