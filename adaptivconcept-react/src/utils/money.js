/**
 * money.js
 * Helpers for integer-cents monetary values.
 */

/**
 * Format integer cents as a localized currency string.
 * e.g. formatCents(152050, "ZAR") → "ZAR 1 520.50"
 */
export function formatCents(cents, currency = "ZAR") {
  try {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    return `${currency} ${(cents / 100).toFixed(2)}`;
  }
}

/**
 * Convert a decimal amount string/number to integer cents.
 * e.g. toCents("15.50") → 1550
 */
export function toCents(value) {
  const num = parseFloat(String(value).replace(/,/g, ""));
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}

/**
 * Convert integer cents to a decimal number.
 * e.g. fromCents(1550) → 15.5
 */
export function fromCents(cents) {
  return cents / 100;
}

/**
 * Compute invoice totals from line items + tax + discount.
 * All inputs/outputs are integer cents.
 */
export function computeTotals(items = [], taxRateBp = 0, discountCents = 0) {
  const subtotal = items.reduce(
    (sum, item) => sum + Math.round((item.quantity || 1) * (item.unit_price_cents || 0)),
    0
  );
  const tax = Math.round(subtotal * taxRateBp / 10000);
  const total = Math.max(0, subtotal + tax - discountCents);
  return { subtotal, tax, total };
}
