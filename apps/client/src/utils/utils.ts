import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Reads the `userRole` cookie set by /auth/callback on login, so the client app
 * can isolate the affiliate self-service portal from the client dashboard shell
 * without waiting on a profile API call.
 */
export function getUserRole(): "CLIENT" | "AFFILIATE" | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)userRole=([^;]+)/);
  const value = match ? decodeURIComponent(match[1]) : null;
  return value === "AFFILIATE" || value === "CLIENT" ? value : null;
}
