"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPLOYEE_CODE_REGEX = exports.EMPLOYEE_CODE_LENGTH = exports.EMPLOYEE_CODE_ALPHABET = void 0;
exports.generateEmployeeCode = generateEmployeeCode;
exports.normalizeEmployeeCode = normalizeEmployeeCode;
const crypto_1 = require("crypto");
/**
 * 32-symbol alphabet excluding visually ambiguous characters (0/O, 1/I).
 * Employee codes are read aloud / typed by customers at checkout, so ambiguity
 * would cause real support load.
 */
exports.EMPLOYEE_CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
exports.EMPLOYEE_CODE_LENGTH = 5;
/** `EMP-` + 5 alphabet chars. Anchored — used for input validation. */
exports.EMPLOYEE_CODE_REGEX = /^EMP-[A-Z0-9]{5}$/;
/**
 * Generates a cryptographically-secure employee code in the format `EMP-XXXXX`.
 * Uses crypto.randomInt (CSPRNG) — never Math.random, since the code is a
 * commission-bearing identifier.
 *
 * Search space: 32^5 ≈ 33.5M combinations.
 */
function generateEmployeeCode() {
    let suffix = '';
    for (let i = 0; i < exports.EMPLOYEE_CODE_LENGTH; i += 1) {
        suffix += exports.EMPLOYEE_CODE_ALPHABET[(0, crypto_1.randomInt)(0, exports.EMPLOYEE_CODE_ALPHABET.length)];
    }
    return `EMP-${suffix}`;
}
/** Trims and uppercases a user-supplied code so lookups are deterministic. */
function normalizeEmployeeCode(code) {
    return (code ?? '').trim().toUpperCase();
}
//# sourceMappingURL=employee-code.util.js.map