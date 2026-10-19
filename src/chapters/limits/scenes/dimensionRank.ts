import { localize, type Lang } from '../../../contracts';
import { type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { dimensionRankModel, type DimensionRankData, type Vec2 } from '../models/dimension-rank';

/**
 * Grid-transformation view of a linear map R^2 -> R^2: the original grid is
 * drawn lightly, the transformed grid on top, the kernel direction (collapsing
 * to the origin) in red and the image direction in blue. Math-bearing readout
 * strips use the shared KaTeX helper exactly like the shell summaries (strip
 * first, upgrade when the tex chunk arrives), each strip with its own sequence
 * guard so late arrivals from an older render never overwrite newer text.
 */
const KERNEL_RED = 'var(--bound)';
const IMAGE_BLUE = '#2563eb';

function readoutText(data: DimensionRankData, lang: Lang): string {
  const { rank, nullity } = data;
  return localize(
    {
      ko: String.raw`\(\operatorname{rank} T = ${rank}\), \(\operatorname{nullity} T = ${nullity}\), 합은 \(2 = \dim \mathbb{R}^2\) — 차원–랭크 정리`,
      en: String.raw`\(\operatorname{rank} T = ${rank}\), \(\operatorname{nullity} T = ${nullity}\), summing to \(2 = \dim \mathbb{R}^2\) — the rank–nullity theorem`,
    },
    lang,
  );
}

function kernelText(data: DimensionRankData, lang: Lang): string {
  const { kernelDir } = data;
  if (!kernelDir) {
    return localize(
      {
        ko: data.rank === 0
          ? String.raw`핵(kernel)은 전체 평면 — 모든 벡터가 원점으로 간다`
          : String.raw`핵(kernel)은 \(\{0\}\) — 원점으로 가는 방향이 없다 (단사)`,
        en: data.rank === 0
          ? String.raw`the kernel is the whole plane — every vector collapses to the origin`
          : String.raw`the kernel is \(\{0\}\) — no direction collapses to the origin (injective)`,
      },
      lang,
    );
  }
  const dir = `(${fmt(kernelDir.x)},\\ ${fmt(kernelDir.y)})`;
  return localize(
    {
      ko: String.raw`빨간 방향 ${dir}: 핵 방향 — 이 직선 전체가 원점으로 접힌다`,
      en: String.raw`red direction ${dir}: the kernel direction — this whole line collapses to the origin`,
    },
    lang,
  );
}

function imageText(data: DimensionRankData, lang: Lang): string {
  const { imageDir } = data;
  if (!imageDir) {
    return localize(
      {
        ko: data.rank === 0
          ? String.raw`상(image)은 \(\{0\}\)`
          : String.raw`상(image)은 전체 평면 (전사)`,
        en: data.rank === 0
          ? String.raw`the image is \(\{0\}\)`
          : String.raw`the image is the whole plane (surjective)`,
      },
      lang,
    );
  }
  const dir = `(${fmt(imageDir.x)},\\ ${fmt(imageDir.y)})`;
  return localize(
    {
      ko: String.raw`파란 방향 ${dir}: 상의 방향 — 격자가 이 직선 위로 납작해진다`,
      en: String.raw`blue direction ${dir}: the image direction — the grid flattens onto this line`,
    },
    lang,
  );
}

function fmt(v: number): string {
  const r = Math.round(v * 100) / 100;
  return String(Object.is(r, -0) ? 0 : r);
}

function drawMain(chart: Chart, data: DimensionRankData): void {
    const { g, width, height } = chart;
    g.selectAll('*').remove();

    const scale = Math.min((width - 48) / 6, (height - 48) / 6);
    const cx = width / 2;
    const cy = height / 2;
    const X = (x: number): number => cx + x * scale;
    const Y = (y: number): number => cy - y * scale;
    const P = (p: Vec2): [number, number] => [X(p.x), Y(p.y)];

    const seg = (a: Vec2, b: Vec2): string => {
      const [x1, y1] = P(a);
      const [x2, y2] = P(b);
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    };

    // Light original grid over [-2, 2]^2.
    const gridGroup = g.append('g').attr('stroke', 'currentColor').attr('stroke-opacity', 0.15);
    for (let k = -2; k <= 2; k++) {
      gridGroup.append('path').attr('d', seg({ x: k, y: -2 }, { x: k, y: 2 }));
      gridGroup.append('path').attr('d', seg({ x: -2, y: k }, { x: 2, y: k }));
    }
    // Axes slightly stronger.
    const axisGroup = g.append('g').attr('stroke', 'currentColor').attr('stroke-opacity', 0.35);
    axisGroup.append('path').attr('d', seg({ x: -2.6, y: 0 }, { x: 2.6, y: 0 }));
    axisGroup.append('path').attr('d', seg({ x: 0, y: -2.6 }, { x: 0, y: 2.6 }));

    // Transformed grid: image of each original grid line.
    const tGroup = g.append('g').attr('stroke', 'currentColor').attr('stroke-opacity', 0.55).attr('stroke-width', 1.25);
    for (let k = -2; k <= 2; k++) {
      const v0 = data.transformedGrid.find((_, i) => data.originalGrid[i]?.x === k && data.originalGrid[i]?.y === -2);
      const v1 = data.transformedGrid.find((_, i) => data.originalGrid[i]?.x === k && data.originalGrid[i]?.y === 2);
      const h0 = data.transformedGrid.find((_, i) => data.originalGrid[i]?.x === -2 && data.originalGrid[i]?.y === k);
      const h1 = data.transformedGrid.find((_, i) => data.originalGrid[i]?.x === 2 && data.originalGrid[i]?.y === k);
      if (v0 && v1) tGroup.append('path').attr('d', seg(v0, v1));
      if (h0 && h1) tGroup.append('path').attr('d', seg(h0, h1));
    }
    // Transformed lattice points as dots.
    const dotGroup = g.append('g').attr('fill', 'currentColor').attr('fill-opacity', 0.7);
    for (const q of data.transformedGrid) {
      dotGroup.append('circle').attr('cx', X(q.x)).attr('cy', Y(q.y)).attr('r', 2.2);
    }
    // Transformed unit square outline.
    const sq = data.transformedSquare.map(P);
    g.append('path')
      .attr('d', `M ${sq.map(([x, y]) => `${x} ${y}`).join(' L ')} Z`)
      .attr('fill', 'none')
      .attr('stroke', 'var(--bound)')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-dasharray', '5 4');

    // Kernel direction (red) through the origin.
    if (data.kernelDir) {
      g.append('path')
        .attr('d', seg({ x: -3 * data.kernelDir.x, y: -3 * data.kernelDir.y }, { x: 3 * data.kernelDir.x, y: 3 * data.kernelDir.y }))
        .attr('fill', 'none')
        .attr('stroke', KERNEL_RED)
        .attr('stroke-width', 2.5);
    }
    // Image direction (blue) through the origin.
    if (data.imageDir) {
      g.append('path')
        .attr('d', seg({ x: -3 * data.imageDir.x, y: -3 * data.imageDir.y }, { x: 3 * data.imageDir.x, y: 3 * data.imageDir.y }))
        .attr('fill', 'none')
        .attr('stroke', IMAGE_BLUE)
        .attr('stroke-width', 2.5);
    }
    // Origin marker.
    g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 3).attr('fill', 'currentColor');
}

export default defineSimpleScene<DimensionRankData>({
  model: dimensionRankModel,
  fallbackHeight: 360,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: kernelText, cssText: 'margin-top: 4px; font-size: 12px; color: var(--muted);' },
    { text: imageText, cssText: 'font-size: 12px; color: var(--muted);' }
  ],
});
