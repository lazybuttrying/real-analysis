import type { ControlState, SceneModel } from '../../../contracts';

/**
 * Open-set checker on the number line. For a chosen set S, a point x and a
 * radius eps, it decides membership and whether the eps-ball around x stays
 * inside S — the hands-on form of "every point is an interior point".
 * Pure computation: no DOM, d3, or three.
 */

export const OPEN_SET_KINDS = ['open', 'closed', 'half', 'singleton'] as const;
export type OpenSetKind = (typeof OPEN_SET_KINDS)[number];

export interface OpenSetData {
  kind: OpenSetKind;
  x: number;
  eps: number;
  /** Is x an element of S? */
  xInSet: boolean;
  /** Largest radius whose ball around x fits in S (0 at boundary points). */
  maxSafeEps: number;
  /** Does (x - eps, x + eps) fit inside S? */
  ballInside: boolean;
  /** Mathematical facts about S itself. */
  setIsOpen: boolean;
  setIsClosed: boolean;
}

export function openSetKindOf(raw: unknown): OpenSetKind {
  return raw === 'closed' || raw === 'half' || raw === 'singleton' ? raw : 'open';
}

interface Interval {
  lo: number;
  hi: number;
  loOpen: boolean;
  hiOpen: boolean;
}

/** Interval description of S; null for the singleton. */
function intervalOf(kind: OpenSetKind): Interval | null {
  switch (kind) {
    case 'open':
      return { lo: 0, hi: 1, loOpen: true, hiOpen: true };
    case 'closed':
      return { lo: 0, hi: 1, loOpen: false, hiOpen: false };
    case 'half':
      return { lo: 0, hi: 1, loOpen: false, hiOpen: true };
    case 'singleton':
      return null;
  }
}

export function openSetContains(kind: OpenSetKind, x: number): boolean {
  if (kind === 'singleton') return x === 0;
  const iv = intervalOf(kind);
  if (iv === null) return false;
  const loOk = iv.loOpen ? x > iv.lo : x >= iv.lo;
  const hiOk = iv.hiOpen ? x < iv.hi : x <= iv.hi;
  return loOk && hiOk;
}

export function openSetMaxSafeEps(kind: OpenSetKind, x: number): number {
  if (!openSetContains(kind, x)) return 0;
  if (kind === 'singleton') return 0;
  const iv = intervalOf(kind);
  if (iv === null) return 0;
  return Math.min(x - iv.lo, iv.hi - x);
}

export function openSetFacts(kind: OpenSetKind): { isOpen: boolean; isClosed: boolean } {
  switch (kind) {
    case 'open':
      return { isOpen: true, isClosed: false };
    case 'closed':
      return { isOpen: false, isClosed: true };
    case 'half':
      return { isOpen: false, isClosed: false };
    case 'singleton':
      return { isOpen: false, isClosed: true };
  }
}

export function openSetData(kind: OpenSetKind, x: number, eps: number): OpenSetData {
  const xInSet = openSetContains(kind, x);
  const maxSafeEps = openSetMaxSafeEps(kind, x);
  const { isOpen, isClosed } = openSetFacts(kind);
  return {
    kind,
    x,
    eps,
    xInSet,
    maxSafeEps,
    ballInside: xInSet && eps <= maxSafeEps,
    setIsOpen: isOpen,
    setIsClosed: isClosed,
  };
}

function clampX(raw: number): number {
  if (!Number.isFinite(raw)) return 0.5;
  return Math.min(1.3, Math.max(-0.3, raw));
}

function clampEps(raw: number): number {
  if (!Number.isFinite(raw) || raw <= 0) return 0.2;
  return Math.min(0.6, Math.max(0.05, raw));
}

export const opensetsModel: SceneModel<OpenSetData> = {
  compute(state: ControlState) {
    const kind = openSetKindOf(state['set']);
    return openSetData(kind, clampX(Number(state['x'] ?? 0.5)), clampEps(Number(state['eps'] ?? 0.2)));
  },
};
