import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { arcLengthModel, type ArcLengthData, type ArcLengthPoint } from '../models/arcLength';

/**
 * Arc length, live. The smooth curve is drawn in the foreground color and
 * the polygonal approximation through the uniform partition points in the
 * accent color, with dots at the nodes. Refining the partition only
 * lengthens the polygonal path (triangle inequality), and the values climb
 * toward the exact length L, the supremum over all partitions.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 56 };

function readoutText(data: ArcLengthData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(n = ${data.n}\): 꺾은선 길이 \(L_{${data.n}} \approx ${fmt(data.length, 6)}\), 정확한 길이 \(L \approx ${fmt(data.exact, 6)}\), 틈 \(L - L_{${data.n}} \approx ${fmt(data.error, 6)}\).`,
      en: String.raw`\(n = ${data.n}\): polygonal length \(L_{${data.n}} \approx ${fmt(data.length, 6)}\), exact length \(L \approx ${fmt(data.exact, 6)}\), gap \(L - L_{${data.n}} \approx ${fmt(data.error, 6)}\).`,
    },
    lang,
  );
}

function explainText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`길이는 모든 분할에 대한 상한으로 정의됩니다: \(L = \sup_P \sum_i |\gamma(t_i) - \gamma(t_{i-1})|\). 분할을 세분화하면 삼각부등식에 의해 각 꺾은선 길이는 줄어들지 않으므로, \(L_n\)은 위로만 움직이며 \(L\)을 넘지 않습니다.`,
      en: String.raw`Length is defined as the supremum over all partitions: \(L = \sup_P \sum_i |\gamma(t_i) - \gamma(t_{i-1})|\). Refinement never shortens a polygonal path, by the triangle inequality, so \(L_n\) only moves up and never passes \(L\).`,
    },
    lang,
  );
}

function verdictText(data: ArcLengthData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`판정: \(L_{${data.n}} \approx ${fmt(data.length, 6)} \le L_{${2 * data.n}} \approx ${fmt(data.length2n, 6)} \le L \approx ${fmt(data.exact, 6)}\) — \(L_n \uparrow L\), 이 곡선은 길이를 잴 수 있습니다 (rectifiable).`,
      en: String.raw`Verdict: \(L_{${data.n}} \approx ${fmt(data.length, 6)} \le L_{${2 * data.n}} \approx ${fmt(data.length2n, 6)} \le L \approx ${fmt(data.exact, 6)}\) — \(L_n \uparrow L\), and this curve is rectifiable.`,
    },
    lang,
  );
}

const path = line<ArcLengthPoint>()
  .x((d) => d.x)
  .y((d) => d.y);

function drawMain(chart: Chart, data: ArcLengthData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();
  const x = scaleLinear().domain([-0.08, 1.1]).range([0, width]);
  const y = scaleLinear().domain([-0.08, 1.1]).range([height, 0]);
  const px = path.x((d) => x(d.x)).y((d) => y(d.y));

  g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(6));
  g.append('g').attr('transform', `translate(${x(0)},0)`).call(axisLeft(y).ticks(6));

  g.append('text')
    .attr('x', 0)
    .attr('y', -20)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        data.curve === 'circle'
          ? { ko: '사분원 — gamma(t) = (cos t, sin t)', en: 'Quarter circle — gamma(t) = (cos t, sin t)' }
          : { ko: '포물선 — gamma(t) = (t, t^2)', en: 'Parabola — gamma(t) = (t, t^2)' },
        lang,
      ),
    );

  // The smooth curve.
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .attr('opacity', 0.55)
    .attr('stroke', 'currentColor')
    .attr('d', px(data.curvePoints as ArcLengthPoint[]) ?? '');
  // The polygonal approximation, accent color.
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2.5)
    .style('stroke', 'var(--accent)')
    .attr('d', px(data.points as ArcLengthPoint[]) ?? '');
  // Nodes of the partition.
  for (const pt of data.points) {
    g.append('circle')
      .attr('cx', x(pt.x))
      .attr('cy', y(pt.y))
      .attr('r', 3.5)
      .style('fill', 'var(--accent)');
  }

  // Legend.
  const legendY = height + 34;
  g.append('text')
    .attr('x', 8)
    .attr('y', legendY)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '— 매끄러운 곡선', en: '— smooth curve' }, lang));
  g.append('text')
    .attr('x', width * 0.42)
    .attr('y', legendY)
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(
      localize(
        { ko: `— 꺾은선 근사 (n = ${data.n})`, en: `— polygonal approximation (n = ${data.n})` },
        lang,
      ),
    );
}

export default defineSimpleScene<ArcLengthData>({
  model: arcLengthModel,
  margin: MARGIN,
  fallbackHeight: 320,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: (_data, lang) => explainText(lang), spaced: true },
    { text: verdictText, bold: true, spaced: true },
  ],
});
