import { axisBottom, axisLeft, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  topologistSineModel,
  TS_XMAX,
  type Pt2,
  type TopologistSineData,
} from '../models/topologistSine';

/**
 * The topologist's sine curve, live. The graph of sin(1/x) on [xMin, 2] is
 * drawn as a polyline sampled uniformly in t = 1/x so the oscillations near
 * 0 render faithfully; the red segment {0} x [-1, 1] is the rest of the
 * closure. Dots mark the witness sequences converging to (0, 1), (0, -1),
 * and (0, 0): every point of the segment is a limit point, yet no path in
 * the closure leads from the segment into the curve.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 48 };

function pathOf(g: Chart['g'], x: (v: number) => number, y: (v: number) => number, pts: Pt2[]): void {
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p[0]).toFixed(2)},${y(p[1]).toFixed(2)}`).join(' ');
  g.append('path').attr('d', d).attr('fill', 'none').attr('stroke', 'var(--accent)').attr('stroke-width', 1.2);
}

function dots(
  g: Chart['g'],
  x: (v: number) => number,
  y: (v: number) => number,
  pts: Pt2[],
  fill: string,
): void {
  for (const p of pts) {
    g.append('circle').attr('cx', x(p[0])).attr('cy', y(p[1])).attr('r', 3).attr('fill', fill);
  }
}

function readoutText(data: TopologistSineData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(S = \{(x, \sin(1/x)) : x > 0\}\)를 \([${fmt(data.xMin, 3)},\, ${fmt(TS_XMAX, 0)}]\)에서 그린 것입니다. 빨간 선분 \(\{0\} \times [-1,1]\)은 \(S\)의 폐포에 속하지만 \(S\)에는 속하지 않습니다 — 점열 \((x_n, \pm 1)\), \((x_n, 0)\)이 선분 위의 점들로 수렴합니다.`,
      en: String.raw`\(S = \{(x, \sin(1/x)) : x > 0\}\) plotted on \([${fmt(data.xMin, 3)},\, ${fmt(TS_XMAX, 0)}]\). The red segment \(\{0\} \times [-1,1]\) lies in the closure of \(S\) but not in \(S\) — the dotted sequences \((x_n, \pm 1)\), \((x_n, 0)\) converge onto points of the segment.`,
    },
    lang,
  );
}

function explainText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(S\)는 연결집합입니다 — 연속함수 \(f(x) = (x, \sin(1/x))\) 아래 \((0,\infty)\)의 상이기 때문입니다 (아래 문제 1). 그래서 그 폐포 \(T = \overline{S}\)도 연결집합입니다. 그러나 \(T\)는 **경로연결이 아닙니다**: 선분 위의 점에서 \(S\)로 가는 경로는 존재하지 않습니다 (아래 문제 3). \(x_{\min}\)을 줄이면 0 근처의 진동이 얼마나 빽빽해지는지 보입니다.`,
      en: String.raw`\(S\) is connected — it is the image of \((0,\infty)\) under the continuous map \(f(x) = (x, \sin(1/x))\) (problem 1 below). Hence its closure \(T = \overline{S}\) is connected too. But \(T\) is **not path-connected**: no path in \(T\) leads from the segment into \(S\) (problem 3 below). Shrink \(x_{\min}\) to see how dense the oscillations near 0 become.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(T = S \cup (\{0\} \times [-1,1])\): 연결집합이지만 경로연결집합은 아닙니다 — 연결성과 경로연결성이 다르다는 것을 보여주는 표준적인 예입니다.`,
      en: String.raw`\(T = S \cup (\{0\} \times [-1,1])\): connected but not path-connected — the standard example that connectedness and path-connectedness differ.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: TopologistSineData, lang: Lang): void {
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
            ko: '위상수학자의 사인 곡선: S = {(x, sin(1/x)) : x > 0}',
            en: "Topologist's sine curve: S = {(x, sin(1/x)) : x > 0}",
          },
          lang,
        ),
      );

    const x = scaleLinear().domain([-0.08, TS_XMAX + 0.06]).range([0, width]);
    const y = scaleLinear().domain([-1.2, 1.2]).range([height, 0]);

    pathOf(g, x, y, data.pts);

    if (data.showSegment) {
      g.append('line')
        .attr('x1', x(0))
        .attr('x2', x(0))
        .attr('y1', y(-1))
        .attr('y2', y(1))
        .attr('stroke', '#d64545')
        .attr('stroke-width', 4)
        .attr('stroke-linecap', 'round');
      g.append('text')
        .attr('x', x(0) + 8)
        .attr('y', y(1) + 4)
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .attr('fill', '#d64545')
        .text('{0} × [−1, 1]');
    }

    if (data.showSeq) {
      dots(g, x, y, data.seqPlus, 'var(--accent)');
      dots(g, x, y, data.seqMinus, 'var(--bound)');
      dots(g, x, y, data.seqZero, 'currentColor');
      const lx = x(TS_XMAX + 0.06);
      const legend: Array<[string, string]> = [
        [localize({ ko: 'sin = 1', en: 'sin = 1' }, lang), 'var(--accent)'],
        [localize({ ko: 'sin = −1', en: 'sin = −1' }, lang), 'var(--bound)'],
        [localize({ ko: 'sin = 0', en: 'sin = 0' }, lang), 'currentColor'],
      ];
      legend.forEach(([label, fill], i) => {
        g.append('circle').attr('cx', lx - 92).attr('cy', 14 + i * 18).attr('r', 3.5).attr('fill', fill);
        g.append('text')
          .attr('x', lx - 84)
          .attr('y', 14 + i * 18 + 4)
          .attr('font-size', 11)
          .attr('fill', 'currentColor')
          .text(label);
      });
    }

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(5));

    g.append('text')
      .attr('x', width)
      .attr('y', 14)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(`x ∈ [${fmt(data.xMin, 3)}, ${fmt(TS_XMAX, 0)}] · ${data.pts.length} pts`);
}

export default defineSimpleScene<TopologistSineData>({
  model: topologistSineModel,
  margin: MARGIN,
  fallbackHeight: 360,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: (_data, lang) => explainText(lang), spaced: true },
    { text: (_data, lang) => verdictText(lang), bold: true, spaced: true }
  ],
});
