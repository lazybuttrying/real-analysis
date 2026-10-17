/**
 * Clamp a raw control value into [lo, hi].
 *
 * ControlState values arrive as `unknown` (query params, slider events), so
 * the raw value is coerced with Number() first; anything non-finite falls
 * back to `fallback`. When `integer` is set, the value is floored before
 * clamping (matching the slider-index convention used across the scenes).
 *
 * Consolidates the per-model clamp helpers that were byte-similar in
 * ~19 model files.
 */
export function clampNumber(
  raw: unknown,
  lo: number,
  hi: number,
  fallback: number,
  integer = false,
): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  const v = integer ? Math.floor(n) : n;
  return Math.min(hi, Math.max(lo, v));
}
