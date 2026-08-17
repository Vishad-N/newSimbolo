export const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]{0,49}$/;
export const LOCAL_PHONE_PATTERN = /^\d{10}$/;
export const COUNTRY_CODE_PATTERN = /^\+[1-9]\d{0,2}$/;
export const GST_NUMBER_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
export const INDIAN_STATE_CODE_PATTERN = /^\d{2}$/;

export function sanitizeNameInput(value: string): string {
  return value.replace(/[^A-Za-z .'-]/g, "").replace(/\s{2,}/g, " ").slice(0, 50);
}

export function validatePersonName(value: string, label: string): string | null {
  const normalizedValue = value.trim();
  if (!normalizedValue) return `${label} is required.`;
  if (!NAME_PATTERN.test(normalizedValue)) {
    return `${label} can only contain letters, spaces, apostrophes, dots, and hyphens.`;
  }
  return null;
}

export function validatePhone(countryCode: string | undefined, phone: string | undefined, required = false): string | null {
  if (!phone && !required) return null;
  if (!countryCode || !COUNTRY_CODE_PATTERN.test(countryCode)) return "Enter a valid country code.";
  if (!phone || !LOCAL_PHONE_PATTERN.test(phone)) return "Phone number must be exactly 10 digits.";
  return null;
}

export function validateOptionalGstNumber(value: string | undefined): string | null {
  if (!value) return null;
  if (!GST_NUMBER_PATTERN.test(value)) return "Enter a valid 15-character GST number.";
  return null;
}

export function sanitizeStateCodeInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 2);
}

export function validateStateCode(value: string | undefined): string | null {
  if (!value?.trim()) return "State Code is required.";
  if (!INDIAN_STATE_CODE_PATTERN.test(value)) return "State Code must be exactly 2 digits.";
  return null;
}
