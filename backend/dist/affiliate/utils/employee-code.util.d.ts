/**
 * 32-symbol alphabet excluding visually ambiguous characters (0/O, 1/I).
 * Employee codes are read aloud / typed by customers at checkout, so ambiguity
 * would cause real support load.
 */
export declare const EMPLOYEE_CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export declare const EMPLOYEE_CODE_LENGTH = 5;
/** `EMP-` + 5 alphabet chars. Anchored — used for input validation. */
export declare const EMPLOYEE_CODE_REGEX: RegExp;
/**
 * Generates a cryptographically-secure employee code in the format `EMP-XXXXX`.
 * Uses crypto.randomInt (CSPRNG) — never Math.random, since the code is a
 * commission-bearing identifier.
 *
 * Search space: 32^5 ≈ 33.5M combinations.
 */
export declare function generateEmployeeCode(): string;
/** Trims and uppercases a user-supplied code so lookups are deterministic. */
export declare function normalizeEmployeeCode(code: string): string;
