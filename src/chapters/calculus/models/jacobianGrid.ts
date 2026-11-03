import type { SceneModel } from '../../../contracts';

/**
 * The Jacobian as a grid deformation. A rectangular grid in (a, b) space
 * is pushed through a map F: straight grid lines bend, and each small
 * cell lands as a curved patch whose area is the original area times
 * the local stretch factor |det J_F| at the cell. One cell is
 * highlighted on both sides in the same color, as in the reference
 * poster: follow that one cell and the determinant stops being a
 * formula and becomes a measured area ratio.
 * Three maps: polar coordinates (det = r), the stretch (u, v) to
 * (u^2, v) (det = 2u), and the complex square (det = 4(u^2 + v^2)).
 * Pure computation: no DOM, d3, or three.
 */

export interface Point {
  x: number;
  y: number;
}

export interface JacobianMap {
  /** Domain rectangle [a0, a1] x [b0, b1]. */
  aRange: readonly [number, number];
  bRange: readonly [number, number];
  apply: (a: number, b: number) => Point;
  /** Exact |det J| at a domain point. */
  det: (a: number, b: number) => number;
}

export const JACOBIAN_MAPS: Readonly<Record<string, JacobianMap>> = {
  polar: {
    aRange: [0, 3],
    bRange: [0, 2 * Math.PI],
    apply: (r, theta) => ({ x: r * Math.cos(theta), y: r * Math.sin(theta) }),
    det: (r) => r,
  },
  stretch: {
    aRange: [0, 2],
    bRange: [0, 2],
    apply: (u, v) => ({ x: u * u, y: v }),
    det: (u) => 2 * u,
  },
  square: {
    aRange: [0, 1.2],
    bRange: [0, 1.2],
    apply: (u, v) => ({ x: u * u - v * v, y: 2 * u * v }),
    det: (u, v) => 4 * (u * u + v * v),
  },
};

/** Grid divisions per axis. */
export const GRID_N = 5;

export interface GridLine {
  /** 'a' = first coordinate constant, 'b' = second coordinate constant. */
  kind: 'a' | 'b';
  /** The constant coordinate value in the domain. */
  value: number;
  /** Sampled image of the line under the map. */
  points: Point[];
}

export interface JacobianGridData {
  map: string;
  aRange: readonly [number, number];
  bRange: readonly [number, number];
  /** Domain grid lines (straight) and their images (bent). */
  domainLines: GridLine[];
  imageLines: GridLine[];
  cellI: number;
  cellJ: number;
  /** The highlighted cell in the domain (4 corners, closed). */
  cellDomain: Point[];
  /** The highlighted cell's image: edges sampled and curved, closed polygon. */
  cellImage: Point[];
  cellDomainArea: number;
  cellImageArea: number;
  /** Measured area ratio of the highlighted cell. */
  areaRatio: number;
  /** Exact |det J| at the cell center. */
  detAtCenter: number;
  center: Point;
}

function polygonArea(poly: readonly Point[]): number {
  let s = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i] as Point;
    const q = poly[(i + 1) % poly.length] as Point;
    s += p.x * q.y - q.x * p.y;
  }
  return Math.abs(s) / 2;
}

function sampleLine(map: JacobianMap, kind: 'a' | 'b', value: number): Point[] {
  const pts: Point[] = [];
  const m = 96;
  for (let i = 0; i <= m; i++) {
    if (kind === 'a') {
      const b = map.bRange[0] + ((map.bRange[1] - map.bRange[0]) * i) / m;
      pts.push(map.apply(value, b));
    } else {
      const a = map.aRange[0] + ((map.aRange[1] - map.aRange[0]) * i) / m;
      pts.push(map.apply(a, value));
    }
  }
  return pts;
}

function cellImagePolygon(map: JacobianMap, a0: number, a1: number, b0: number, b1: number): Point[] {
  const poly: Point[] = [];
  const edge = 10;
  const push = (a: number, b: number): void => {
    poly.push(map.apply(a, b));
  };
  for (let i = 0; i < edge; i++) push(a0 + ((a1 - a0) * i) / edge, b0);
  for (let i = 0; i < edge; i++) push(a1, b0 + ((b1 - b0) * i) / edge);
  for (let i = 0; i < edge; i++) push(a1 - ((a1 - a0) * i) / edge, b1);
  for (let i = 0; i < edge; i++) push(a0, b1 - ((b1 - b0) * i) / edge);
  return poly;
}

export function jacobianGridData(mapRaw: string, cellIRaw: number, cellJRaw: number): JacobianGridData {
  const name = JACOBIAN_MAPS[mapRaw] ? mapRaw : 'polar';
  const map = JACOBIAN_MAPS[name] as JacobianMap;
  const clampCell = (v: number): number =>
    Math.max(0, Math.min(GRID_N - 1, Math.round(Number.isFinite(v) ? v : 0)));
  const cellI = clampCell(cellIRaw);
  const cellJ = clampCell(cellJRaw);
  const [a0r, a1r] = map.aRange;
  const [b0r, b1r] = map.bRange;
  const da = (a1r - a0r) / GRID_N;
  const db = (b1r - b0r) / GRID_N;

  const domainLines: GridLine[] = [];
  const imageLines: GridLine[] = [];
  for (let k = 0; k <= GRID_N; k++) {
    const a = a0r + da * k;
    const b = b0r + db * k;
    domainLines.push({
      kind: 'a',
      value: a,
      points: [
        { x: a, y: b0r },
        { x: a, y: b1r },
      ],
    });
    domainLines.push({
      kind: 'b',
      value: b,
      points: [
        { x: a0r, y: b },
        { x: a1r, y: b },
      ],
    });
    imageLines.push({ kind: 'a', value: a, points: sampleLine(map, 'a', a) });
    imageLines.push({ kind: 'b', value: b, points: sampleLine(map, 'b', b) });
  }

  const ca0 = a0r + da * cellI;
  const ca1 = ca0 + da;
  const cb0 = b0r + db * cellJ;
  const cb1 = cb0 + db;
  const cellDomain: Point[] = [
    { x: ca0, y: cb0 },
    { x: ca1, y: cb0 },
    { x: ca1, y: cb1 },
    { x: ca0, y: cb1 },
  ];
  const cellImage = cellImagePolygon(map, ca0, ca1, cb0, cb1);
  const cellDomainArea = da * db;
  const cellImageArea = polygonArea(cellImage);
  const center = { x: (ca0 + ca1) / 2, y: (cb0 + cb1) / 2 };
  return {
    map: name,
    aRange: map.aRange,
    bRange: map.bRange,
    domainLines,
    imageLines,
    cellI,
    cellJ,
    cellDomain,
    cellImage,
    cellDomainArea,
    cellImageArea,
    areaRatio: cellImageArea / cellDomainArea,
    detAtCenter: map.det(center.x, center.y),
    center,
  };
}

export const jacobianGridModel: SceneModel<JacobianGridData> = {
  compute(state) {
    const map = typeof state['map'] === 'string' ? state['map'] : 'polar';
    return jacobianGridData(map, Number(state['cellI']), Number(state['cellJ']));
  },
};
