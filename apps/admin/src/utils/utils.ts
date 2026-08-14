import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const websiteBaseUrl = (process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000").replace(/\/$/, "")

export function getWebsiteUrl(path = "") {
  const normalizedPath = path && !path.startsWith("/") ? `/${path}` : path
  return `${websiteBaseUrl}${normalizedPath}`
}
