import type { ControlState, SceneModel } from '../../../contracts';
import { clampNumber } from '../../../math/clamp';

/**
 * Open balls in three metrics on the plane. The eps-ball (x - eps, x + eps)
 * from the opensets scene is the special case B(c, r) = { x : d(x, c) < r }
 * for the Euclidean metric: here distance itself is axiomatized, and the
 * ball's shape follows the chosen metric — disk, square, or (discrete) a
 * sudden all-or-nothing jump at r = 1.
 * Pure computation: no DOM, d3, or three.
 */

export const METRIC_KINDS = ['euclid', 'discrete', 'maxnorm'] as const;
type MetricKind = (typeof METRIC_KINDS)[number];

interface DiscretePoint {
  x: number;
  y: number;
  label: string;
}

/** Fixed finite point set carrying the discrete metric. */
export const DISCRETE_POINTS: readonly DiscretePoint[] = [
  { x: 0, y: 0, label: 'p₀' },
  { x: 1, y: 0, label: 'p₁' },
  { x: 0.3, y: 0.8, label: 'p₂' },
  { x: 1.2, y: 0.9, label: 'p₃' },
  { x: -0.5, y: 0.4, label: 'p₄' },
  { x: 0.6, y: -0.6, label: 'p₅' },
];

export interface MetricSpacesData {
  metric: MetricKind;
  r: number;
  /** Fixed point set (only drawn for the discrete metric). */
  points: readonly DiscretePoint[];
  /** Ball membership per point for the discrete metric, B(p0, r). */
  inBall: readonly boolean[];
}

export function metricKindOf(raw: unknown): MetricKind {
  return raw === 'discrete' || raw === 'maxnorm' ? raw : 'euclid';
}

/** Discrete metric on the finite point set, by index: 0 if a === b, else 1. */
export function discreteDist(a: number, b: number): number {
  return a === b ? 0 : 1;
}

/** Indices of the points inside the discrete-metric ball B(center, r). */
export function discreteBall(center: number, r: number): number[] {
  const members: number[] = [];
  for (let i = 0; i < DISCRETE_POINTS.length; i++) {
    if (discreteDist(center, i) < r) members.push(i);
  }
  return members;
}

export function metricSpacesData(metric: MetricKind, r: number): MetricSpacesData {
  const members = new Set(discreteBall(0, r));
  return {
    metric,
    r,
    points: DISCRETE_POINTS,
    inBall: DISCRETE_POINTS.map((_, i) => members.has(i)),
  };
}

function clampR(raw: number): number {
  return clampNumber(raw, 0.2, 2, 1);
}

export const metricSpacesModel: SceneModel<MetricSpacesData> = {
  compute(state: ControlState) {
    const metric = metricKindOf(state['metric']);
    return metricSpacesData(metric, clampR(Number(state['r'] ?? 1)));
  },
};
