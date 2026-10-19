import { scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { peanoCurveModel, type PeanoData, type Pt2 } from '../models/peanoCurve';

/**
 * A Peano curve, live. The order-k approximating polyline snakes through
 * the 3^k x 3^k grid of subsquares; raising the order fills the square
 * denser. The t slider traces the parameter: the moving dot shows where
 * the curve is at "time" t. Green/red dots mark the start (0, 0) and the
 * end (1, 2/3) of the approximant.
 */

const MARGIN = { top: 40, right: 20, bottom: 36, left: 44 };

function readoutText(data: PeanoData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`차수 \(k = ${data.order}\): 꺾은선은 \(9^${data.order} = ${data.segmentCount}\)개의 선분으로 이루어지고, 연속한 점 사이의 거리는 최대 \(3^{-${data.order}} \approx ${fmt(data.maxStep, 5)}\)입니다. \(k \to \infty\)일 때 균등수렴하여 연속인 극한 곡선 \(p: [0,1] \to [0,1]^2\)를 얻습니다 (아래 문제 1).`,
      en: String.raw`Order \(k = ${data.order}\): the polyline has \(9^${data.order} = ${data.segmentCount}\) segments, consecutive points at most \(3^{-${data.order}} \approx ${fmt(data.maxStep, 5)}\) apart. As \(k \to \infty\) it converges uniformly to a continuous limit curve \(p: [0,1] \to [0,1]^2\) (problem 1 below).`,
    },
    lang,
  );
}

function explainText(data: PeanoData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`각 차수의 곡선은 \(3^{${data.order}} \times 3^{${data.order}}\) 격자의 모든 작은 정사각형을 방문합니다 — 차수를 올리면 정사각형이 빽빽이 채워집니다. 극한 곡선 \(p\)는 \([0,1]^2\)의 모든 점을 지나므로 (아래 문제 2) 전사함수입니다. \(t\) 슬라이더의 점은 매개변수 \(t\)에서 곡선이 어디에 있는지 보여줍니다.`,
      en: String.raw`Each order's curve visits every small square of the \(3^{${data.order}} \times 3^{${data.order}}\) grid — raising the order fills the square denser. The limit curve \(p\) passes through every point of \([0,1]^2\) (problem 2 below), hence is surjective. The dot on the \(t\) slider shows where the curve is at parameter \(t\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`연속인 전사함수 \([0,1] \to [0,1]^2\)가 존재합니다 — 1차원 구간이 2차원 정사각형을 "채울" 수 있습니다. 그러나 단사함수일 수는 없습니다 (아래 문제 3, Netto 정리).`,
      en: String.raw`A continuous surjection \([0,1] \to [0,1]^2\) exists — a 1-dimensional interval can "fill" a 2-dimensional square. But it cannot be injective (problem 3 below, Netto's theorem).`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: PeanoData, lang: Lang): void {
    const { g, width, height } = chart;
    g.selectAll('*').remove();

    g.append('text')
      .attr('x', 0)
      .attr('y', -20)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `페아노 곡선: 연속인 전사함수 [0, 1] → [0, 1]² (차수 ${data.order})`,
            en: `Peano curve: a continuous surjection [0, 1] → [0, 1]² (order ${data.order})`,
          },
          lang,
        ),
      );

    const size = Math.min(width, height);
    const x = scaleLinear().domain([-0.04, 1.04]).range([0, size]);
    const y = scaleLinear().domain([-0.04, 1.04]).range([size, 0]);

    if (data.showGrid) {
      const n = data.gridN;
      for (let i = 0; i <= n; i++) {
        const p = i / n;
        g.append('line')
          .attr('x1', x(p)).attr('x2', x(p)).attr('y1', y(0)).attr('y2', y(1))
          .attr('stroke', 'currentColor').attr('opacity', 0.12);
        g.append('line')
          .attr('x1', x(0)).attr('x2', x(1)).attr('y1', y(p)).attr('y2', y(p))
          .attr('stroke', 'currentColor').attr('opacity', 0.12);
      }
    }

    // Unit square border.
    g.append('rect')
      .attr('x', x(0)).attr('y', y(1))
      .attr('width', x(1) - x(0)).attr('height', y(0) - y(1))
      .attr('fill', 'none').attr('stroke', 'currentColor').attr('opacity', 0.5);

    // The approximating polyline.
    const d = data.points
      .map((p: Pt2, i: number) => `${i === 0 ? 'M' : 'L'}${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`)
      .join(' ');
    g.append('path')
      .attr('d', d)
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', data.order >= 4 ? 0.7 : 1.2)
      .attr('opacity', 0.9);

    // Start and end markers.
    const s = data.points[0]!;
    const e = data.points[data.points.length - 1]!;
    g.append('circle').attr('cx', x(s[0])).attr('cy', y(s[1])).attr('r', 5).attr('fill', '#2e9e5b');
    g.append('circle').attr('cx', x(e[0])).attr('cy', y(e[1])).attr('r', 5).attr('fill', '#d64545');
    g.append('text')
      .attr('x', x(s[0]) + 8).attr('y', y(s[1]) + 4)
      .attr('font-size', 11).attr('fill', 'currentColor')
      .text(localize({ ko: '시작 t = 0', en: 'start t = 0' }, lang));
    g.append('text')
      .attr('x', x(e[0]) - 8).attr('y', y(e[1]) - 8)
      .attr('text-anchor', 'end')
      .attr('font-size', 11).attr('fill', 'currentColor')
      .text(localize({ ko: '끝 t = 1', en: 'end t = 1' }, lang));

    // The tracing dot at parameter t.
    const tr = data.trace;
    g.append('circle')
      .attr('cx', x(tr[0])).attr('cy', y(tr[1]))
      .attr('r', 6).attr('fill', 'var(--bound)')
      .attr('stroke', 'currentColor').attr('stroke-width', 1.5);
    g.append('text')
      .attr('x', size + 12)
      .attr('y', 16)
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(`t = ${fmt(data.t, 3)} → (${fmt(tr[0], 3)}, ${fmt(tr[1], 3)})`);
    g.append('text')
      .attr('x', size + 12)
      .attr('y', 34)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(
        localize(
          { ko: `${data.segmentCount}개 선분`, en: `${data.segmentCount} segments` },
          lang,
        ),
      );
}

export default defineSimpleScene<PeanoData>({
  model: peanoCurveModel,
  margin: MARGIN,
  fallbackHeight: 420,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: (_data, lang) => verdictText(lang), bold: true, spaced: true }
  ],
});
