const ECOMMERCE_ILLUSTRATION_URL =
  "https://res.cloudinary.com/dkkqzckfq/image/upload/v1786966935/simbolo/package-illustrations/ecommerce-illustration-photoroom.png";

export const PACKAGE_ILLUSTRATION_PATHS = [
  "/images/services/ai_automation_1784887931272.png",
  "/images/services/branding_1784887903218.png",
  "/images/services/content_marketing_1784887968386.png",
  "/images/services/crm_integration_1784887948999.png",
  ECOMMERCE_ILLUSTRATION_URL,
  "/images/services/ecommerce_1784887873510.png",
  "/images/services/email_marketing_1784887958663.png",
  "/images/services/google_ads_1784887852918.png",
  "/images/services/graphic_design_1784887863706.png",
  "/images/services/meta-ads.png",
  "/images/services/mobile_app_development_1784887912184.png",
  "/images/services/performance_marketing_1784887977444.png",
  "/images/services/seo.png",
  "/images/services/shopify_development_1784887883421.png",
  "/images/services/social-media.png",
  "/images/services/ui_ux_design_1784887921459.png",
  "/images/services/video-editing.png",
  "/images/services/website-design.png",
] as const;

const packageIllustrationPaths = new Set<string>(PACKAGE_ILLUSTRATION_PATHS);

const serviceIllustrationFallbacks: ReadonlyArray<readonly [string, string]> = [
  ["google", "/images/services/google_ads_1784887852918.png"],
  ["meta", "/images/services/meta-ads.png"],
  ["seo", "/images/services/seo.png"],
  ["shopify", "/images/services/shopify_development_1784887883421.png"],
  ["ecommerce", ECOMMERCE_ILLUSTRATION_URL],
  ["website", "/images/services/website-design.png"],
  ["web design", "/images/services/website-design.png"],
  ["mobile", "/images/services/mobile_app_development_1784887912184.png"],
  ["ui", "/images/services/ui_ux_design_1784887921459.png"],
  ["graphic", "/images/services/graphic_design_1784887863706.png"],
  ["video", "/images/services/video-editing.png"],
  ["social", "/images/services/social-media.png"],
  ["email", "/images/services/email_marketing_1784887958663.png"],
  ["content", "/images/services/content_marketing_1784887968386.png"],
  ["crm", "/images/services/crm_integration_1784887948999.png"],
  ["automation", "/images/services/ai_automation_1784887931272.png"],
  ["performance", "/images/services/performance_marketing_1784887977444.png"],
  ["brand", "/images/services/branding_1784887903218.png"],
];

export function resolvePackageIllustration(illustration: string | null | undefined, serviceName: string): string {
  if (illustration && packageIllustrationPaths.has(illustration)) {
    return illustration;
  }

  const normalizedServiceName = serviceName.toLowerCase();
  return serviceIllustrationFallbacks.find(([keyword]) => normalizedServiceName.includes(keyword))?.[1]
    ?? "/images/services/branding_1784887903218.png";
}
