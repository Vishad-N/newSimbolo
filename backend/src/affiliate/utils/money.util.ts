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
export function roundCurrency(value: number): number {
  if (!Number.isFinite(value)) return 0;
  // Number.EPSILON nudge protects against cases like 1.005 * 100 === 100.49999999999999
  const scaled = value * 100;
  const corrected = scaled >= 0 ? scaled + Number.EPSILON * Math.abs(scaled) : scaled - Number.EPSILON * Math.abs(scaled);
  return Math.round(corrected) / 100;
}
