/**
 * Currency rounding helper.
 *
 * This codebase stores all monetary values as Prisma `Float` in rupees (NOT paise).
 * Floating point arithmetic on money must ALWAYS be normalised back to 2 decimal
 * places (paisa precision) immediately after every computation, otherwise
 * accumulated binary-representation error leaks into wallet balances and ledgers.
 *
 * Rounds half-up to the nearest paisa.
 */
export declare function roundCurrency(value: number): number;
