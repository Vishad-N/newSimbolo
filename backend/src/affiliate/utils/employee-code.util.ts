import { randomInt } from 'crypto';

/**
 * 32-symbol alphabet excluding visually ambiguous characters (0/O, 1/I).
 * Employee codes are read aloud / typed by customers at checkout, so ambiguity
 * would cause real support load.
 */
export const EMPLOYEE_CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export const EMPLOYEE_CODE_LENGTH = 5;

/** `EMP-` + 5 alphabet chars. Anchored — used for input validation. */
export const EMPLOYEE_CODE_REGEX = /^EMP-[A-Z0-9]{5}$/;

/**
 * Generates a cryptographically-secure employee code in the format `EMP-XXXXX`.
 * Uses crypto.randomInt (CSPRNG) — never Math.random, since the code is a
 * commission-bearing identifier.
 *
 * Search space: 32^5 ≈ 33.5M combinations.
 */
export function generateEmployeeCode(): string {
  let suffix = '';
  for (let i = 0; i < EMPLOYEE_CODE_LENGTH; i += 1) {
    suffix += EMPLOYEE_CODE_ALPHABET[randomInt(0, EMPLOYEE_CODE_ALPHABET.length)];
  }
  return `EMP-${suffix}`;
}

/** Trims and uppercases a user-supplied code so lookups are deterministic. */
export function normalizeEmployeeCode(code: string): string {
  return (code ?? '').trim().toUpperCase();
}
