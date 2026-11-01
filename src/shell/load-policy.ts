/**
 * Automatic load shedding (experiment, 2026-11-01).
 *
 * The sites are static, so there is no server to shed load at: the
 * load that matters is the visitor's own device and network. The
 * policy watches the signals a browser exposes and steps down in a
 * fixed order, cheapest-to-lose first:
 *
 *   tier 1 (strained): no semantic pre-warm on search focus, no
 *     playback auto-start. Everything still works on demand.
 *   tier 2 (critical): charts are replaced by a notice (text,
 *     readouts, tables, and keyword search keep working) and the
 *     semantic model is never downloaded.
 *
 * Body text, tables, and keyword search are never shed.
 *
 * A manual override wins over every signal: ?shed=0, ?shed=1, or
 * ?shed=2 in the URL. That is also how the tiers are drilled.
 */

export type LoadTier = 0 | 1 | 2;

export interface LoadSignals {
  saveData: boolean;
  /** navigator.connection.effectiveType: 'slow-2g', '2g', '3g', '4g', or '' when unknown. */
  effectiveType: string;
  /** navigator.deviceMemory in GB; 0 when unknown. */
  deviceMemory: number;
  /** navigator.hardwareConcurrency; 0 when unknown. */
  hardwareConcurrency: number;
  /** Long tasks (over 250 ms) observed in the last 10 seconds. */
  longTasksInWindow: number;
}

/** Pure tier decision, unit-tested. Unknown signals (0 or '') never raise the tier. */
export function decideTier(signals: LoadSignals): LoadTier {
  if (signals.effectiveType === 'slow-2g' || signals.longTasksInWindow >= 6) return 2;
  if (
    signals.saveData ||
    signals.effectiveType === '2g' ||
    (signals.deviceMemory > 0 && signals.deviceMemory <= 2) ||
    (signals.hardwareConcurrency > 0 && signals.hardwareConcurrency <= 2) ||
    signals.longTasksInWindow >= 3
  ) {
    return 1;
  }
  return 0;
}

function overrideTier(): LoadTier | null {
  try {
    const raw = new URLSearchParams(window.location.search).get('shed');
    if (raw === '0' || raw === '1' || raw === '2') return Number(raw) as LoadTier;
  } catch {
    // No location (tests, prerender): no override.
  }
  return null;
}

function readSignals(longTasksInWindow: number): LoadSignals {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  return {
    saveData: nav.connection?.saveData === true,
    effectiveType: nav.connection?.effectiveType ?? '',
    deviceMemory: nav.deviceMemory ?? 0,
    hardwareConcurrency: navigator.hardwareConcurrency ?? 0,
    longTasksInWindow,
  };
}

const LONG_TASK_WINDOW_MS = 10_000;
const RE_EVALUATE_MS = 5_000;

let currentTier: LoadTier = 0;
let started = false;
const longTaskStamps: number[] = [];
const listeners = new Set<(tier: LoadTier) => void>();

function evaluate(): void {
  const override = overrideTier();
  const now = Date.now();
  while (longTaskStamps.length > 0 && now - (longTaskStamps[0] ?? 0) > LONG_TASK_WINDOW_MS) {
    longTaskStamps.shift();
  }
  const next = override ?? decideTier(readSignals(longTaskStamps.length));
  if (next !== currentTier) {
    currentTier = next;
    listeners.forEach((listener) => listener(next));
  }
}

/** Starts the long-task observer and the re-evaluation timer. Idempotent. */
export function startLoadPolicy(): void {
  if (started) return;
  started = true;
  evaluate();
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 250) longTaskStamps.push(Math.round(entry.startTime + performance.timeOrigin));
      }
    });
    observer.observe({ entryTypes: ['longtask'] });
  } catch {
    // Long-task timing is Chromium-only; the static signals still apply.
  }
  window.setInterval(evaluate, RE_EVALUATE_MS);
}

export function loadTier(): LoadTier {
  return currentTier;
}

export function onLoadTierChange(listener: (tier: LoadTier) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Tier 1 and up: do not pre-warm the semantic model on focus. */
export function shedSemanticWarm(): boolean {
  return currentTier >= 1;
}

/** Tier 1 and up: playback does not auto-start (the play button still works). */
export function shedAutoplay(): boolean {
  return currentTier >= 1;
}

/** Tier 2: the semantic model is never downloaded; search stays keyword-only. */
export function shedSemantic(): boolean {
  return currentTier >= 2;
}

/** Tier 2: charts render as a notice instead of an SVG. */
export function shedCharts(): boolean {
  return currentTier >= 2;
}
