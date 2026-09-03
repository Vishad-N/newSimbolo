export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Cloudinary's raw upload response returns a plain http:// url alongside the https://
// secure_url; the admin's media picker used to persist whichever one it got back
// (fixed at the picker level since, but assets picked before that fix may still carry
// an http:// value in already-saved records). next.config only allow-lists
// https://res.cloudinary.com for next/image, so an http:// asset URL silently fails to
// render (broken image, alt text only) — coerce it here wherever an admin-picked
// Cloudinary URL is rendered, so already-saved records aren't stuck with a broken card.
export function toSecureCloudinaryUrl(url: string): string {
  return url.startsWith("http://res.cloudinary.com/") ? url.replace("http://", "https://") : url;
}

// Builds an autoplaying embed URL for the inline in-card video preview. YouTube and
// Vimeo use different query param names for mute ("mute" vs "muted"), and the stored
// previewUrl may or may not already have a query string (Vimeo embeds often carry a
// "?h=" hash param), so params must be appended with the right separator either way.
export function buildInlinePreviewSrc(previewUrl: string, previewType: "youtube" | "vimeo", muted: boolean): string {
  const separator = previewUrl.includes("?") ? "&" : "?";
  const muteParam = previewType === "vimeo" ? "muted" : "mute";
  return `${previewUrl}${separator}autoplay=1&playsinline=1&${muteParam}=${muted ? 1 : 0}`;
}
