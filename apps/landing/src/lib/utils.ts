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
