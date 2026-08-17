export const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]{0,49}$/;
export const LOCAL_PHONE_PATTERN = /^\d{10}$/;
export const COUNTRY_CODE_PATTERN = /^\+[1-9]\d{0,2}$/;

export function sanitizeNameInput(value: string): string {
  return value.replace(/[^A-Za-z .'-]/g, "").replace(/\s{2,}/g, " ").slice(0, 50);
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidName(value: string): boolean {
  return NAME_PATTERN.test(value.trim());
}

export function validatePersonName(value: string, label: string): string | null {
  if (!value.trim()) return `${label} is required.`;
  if (!isValidName(value)) return `${label} can only contain letters, spaces, apostrophes, dots, and hyphens.`;
  return null;
}

export function validatePhone(countryCode: string, phone: string, required = false): string | null {
  if (!phone && !required) return null;
  if (!COUNTRY_CODE_PATTERN.test(countryCode)) return "Enter a valid country code.";
  if (!LOCAL_PHONE_PATTERN.test(phone)) return "Phone number must be exactly 10 digits.";
  return null;
}
