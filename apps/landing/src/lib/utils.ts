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

// Admin-entered previewUrl values are frequently a plain share/watch link
// (youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, vimeo.com/<id>) rather than
// the iframe-embeddable form. YouTube/Vimeo refuse to render non-embed URLs inside an
// iframe (X-Frame-Options), which surfaces to users as "refused to connect" — so any
// URL used as an iframe src must be normalized to the embed form first, regardless of
// which format was actually stored.
export function toEmbeddableVideoUrl(previewUrl: string, previewType: "youtube" | "vimeo"): string {
  if (!previewUrl) return previewUrl;

  if (previewType === "youtube") {
    if (/youtube(-nocookie)?\.com\/embed\//.test(previewUrl)) return previewUrl;
    const watchId = previewUrl.match(/[?&]v=([^&]+)/)?.[1];
    const shortId = previewUrl.match(/youtu\.be\/([^?&]+)/)?.[1];
    const shortsId = previewUrl.match(/\/shorts\/([^?&]+)/)?.[1];
    const id = watchId || shortId || shortsId;
    return id ? `https://www.youtube.com/embed/${id}` : previewUrl;
  }

  if (previewType === "vimeo") {
    if (previewUrl.includes("player.vimeo.com/video/")) return previewUrl;
    const id = previewUrl.match(/vimeo\.com\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : previewUrl;
  }

  return previewUrl;
}

// Builds an autoplaying embed URL for the inline in-card video preview. YouTube and
// Vimeo use different query param names for mute ("mute" vs "muted"), and the stored
// previewUrl may or may not already have a query string (Vimeo embeds often carry a
// "?h=" hash param), so params must be appended with the right separator either way.
export function buildInlinePreviewSrc(previewUrl: string, previewType: "youtube" | "vimeo", muted: boolean): string {
  const embeddable = toEmbeddableVideoUrl(previewUrl, previewType);
  const separator = embeddable.includes("?") ? "&" : "?";
  const muteParam = previewType === "vimeo" ? "muted" : "mute";
  return `${embeddable}${separator}autoplay=1&playsinline=1&${muteParam}=${muted ? 1 : 0}`;
}
