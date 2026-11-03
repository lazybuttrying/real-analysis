import { line } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import type { JacobianGridData, Point } from '../models/jacobianGrid';
import { jacobianGridModel } from '../models/jacobianGrid';

/**
 * Two panels, one cell. Left: the rectangular domain grid. Right: the
 * same grid after the map, lines bent. The highlighted cell keeps the
 * same green fill on both sides, so the eye can follow a single cell
 * through the deformation and read the determinant as its area ratio.
 */

const CELL_FILL = '#59a14f';

function drawMain(chart: Chart, data: JacobianGridData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const gap = 30;
  const panelW = (width - gap) / 2;
  const panelH = height - 28;

  const drawPanel = (
    offsetX: number,
    title: string,
    lines: JacobianGridData['domainLines'],
    cell: Point[],
    bounds: { minX: number; maxX: number; minY: number; maxY: number },
    cellClosed: boolean,
  ): void => {
    const sx = panelW / (bounds.maxX - bounds.minX);
    const sy = panelH / (bounds.maxY - bounds.minY);
    const s = Math.min(sx, sy);
    const ox = offsetX + (panelW - s * (bounds.maxX - bounds.minX)) / 2;
    const oy = 24 + (panelH - s * (bounds.maxY - bounds.minY)) / 2;
    const X = (p: Point): number => ox + (p.x - bounds.minX) * s;
    const Y = (p: Point): number => oy + (bounds.maxY - p.y) * s;
    const path = line<Point>()
      .x((p) => X(p))
      .y((p) => Y(p));

    const panel = g.append('g');
    panel
      .append('text')
      .attr('x', offsetX + panelW / 2)
      .attr('y', 14)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(title);

    // The highlighted cell first, under the grid lines.
    const cellPath = `${path(cell) ?? ''}${cellClosed ? 'Z' : ''}`;
    panel
      .append('path')
      .attr('d', cellPath)
      .attr('fill', CELL_FILL)
      .attr('opacity', 0.55)
      .attr('stroke', CELL_FILL)
      .attr('stroke-width', 1.5);

    for (const gridLine of lines) {
      panel
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', gridLine.kind === 'a' ? '#4e79a7' : '#e15759')
        .attr('stroke-width', 1)
        .attr('opacity', 0.75)
        .attr('d', path(gridLine.points) ?? '');
    }
  };

  // Image bounds from the sampled image lines and cell.
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const gridLine of data.imageLines) {
    for (const p of gridLine.points) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
  }
  const padX = (maxX - minX) * 0.04 + 0.05;
  const padY = (maxY - minY) * 0.04 + 0.05;

  drawPanel(
    0,
    localize({ ko: '정의역 격자', en: 'domain grid' }, lang),
    data.domainLines,
    data.cellDomain,
    { minX: data.aRange[0], maxX: data.aRange[1], minY: data.bRange[0], maxY: data.bRange[1] },
    true,
  );
  drawPanel(
    panelW + gap,
    localize({ ko: '변형된 격자', en: 'deformed grid' }, lang),
    data.imageLines,
    data.cellImage,
    { minX: minX - padX, maxX: maxX + padX, minY: minY - padY, maxY: maxY + padY },
    true,
  );
}

function readoutText(data: JacobianGridData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`초록 칸 하나의 넓이 비율은 ${fmt(data.areaRatio, 3)}이고, 칸 중심에서의 \(|\det J|\)는 ${fmt(data.detAtCenter, 3)}입니다. 행렬식은 추상적인 수가 아니라 그 칸이 몇 배로 늘어났는지를 잰 값입니다.`,
      en: String.raw`The green cell's measured area ratio is ${fmt(data.areaRatio, 3)}, and \(|\det J|\) at its center is ${fmt(data.detAtCenter, 3)}. The determinant is not an abstract number: it is the measured stretch factor of that cell.`,
    },
    lang,
  );
}

export default defineSimpleScene<JacobianGridData>({
  model: jacobianGridModel,
  drawMain,
  slots: [{ text: readoutText, bold: true }],
});
