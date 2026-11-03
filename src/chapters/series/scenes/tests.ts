import { axisBottom, axisLeft, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { svgText } from '../../../view/svgtext';
import { testsModel, type TestsData } from '../models/tests';

// Ratio-test series: scatter of r_k = a_{k+1}/a_k against the dashed limit
// line L. Comparison series: paired bars showing a_k = 1/(k^2+1) tucked
// under the majorant b_k = 1/k^2 at every k. The verdict strip below the
// chart states which test fired and why, rendered through the shared
// KaTeX helper like the shell renders summaries.

const MARGIN = { top: 64, right: 20, bottom: 44, left: 56 };

/** TeX fragment for the headers' math segment. */
function seriesLabel(series: string, lang: Lang): string {
  if (series === 'n-over-2n') return localize({ ko: String.raw`\sum k/2^k`, en: String.raw`\sum k/2^k` }, lang);
  if (series === 'inv-square-plus') return localize({ ko: String.raw`\sum 1/(k^2+1)`, en: String.raw`\sum 1/(k^2+1)` }, lang);
  return localize({ ko: String.raw`\sum 1/k!`, en: String.raw`\sum 1/k!` }, lang);
}

function verdictText(data: TestsData, lang: Lang): string {
  if (data.verdict === 'comparison-converges') {
    return localize(
      {
        ko: String.raw`비교 판정법: \(\frac{1}{k^2+1} < \frac{1}{k^2}\)이고 \(\sum \frac{1}{k^2} = \frac{\pi^2}{6}\)이므로 수렴`,
        en: String.raw`comparison test: \(\frac{1}{k^2+1} < \frac{1}{k^2}\) and \(\sum \frac{1}{k^2} = \frac{\pi^2}{6}\) — converges`,
      },
      lang,
    );
  }
  const l = data.series === 'factorial' ? '0' : '\\frac{1}{2}';
  return localize(
    {
      ko: String.raw`비율 판정법: \(L = ${l} < 1\)이므로 수렴`,
      en: String.raw`ratio test: \(L = ${l} < 1\) — converges`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: TestsData, lang: Lang): void {
  const { g, width, height } = chart;
  const { n } = data;

  g.selectAll('*').remove();

  const header1 = g.append('text').attr('x', 0).attr('y', -48).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
  const header2 = g.append('text').attr('x', 0).attr('y', -26).attr('font-size', 12).attr('fill', 'currentColor').attr('opacity', 0.75);

  if (data.ratios !== null && data.limit !== null) {
    const ratios = data.ratios;
    const limit = data.limit;
    const hi = Math.max(...ratios, limit) * 1.15;
    const x = scaleLinear().domain([1, Math.max(2, n)]).range([0, width]);
    const y = scaleLinear().domain([0, hi]).range([height, 0]);

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(6));

    header1.call(
      svgText,
      localize(
        {
          ko: String.raw`\(${seriesLabel(data.series, lang)}\) — 비율 \(r_k = a_{k+1}/a_k \to L = ${fmt(limit)}\)`,
          en: String.raw`\(${seriesLabel(data.series, lang)}\) — ratio \(r_k = a_{k+1}/a_k \to L = ${fmt(limit)}\)`,
        },
        lang,
      ),
    );
    header2.call(
      svgText,
      localize(
        {
          ko: String.raw`\(r_1 = ${fmt(ratios[0] ?? 0)}\)에서 시작해 \(L\)을 향해 감소합니다`,
          en: String.raw`decreasing from \(r_1 = ${fmt(ratios[0] ?? 0)}\) toward \(L\)`,
        },
        lang,
      ),
    );

    // Limit line.
    g.append('line')
      .attr('x1', x(1))
      .attr('x2', x(n))
      .attr('y1', y(limit))
      .attr('y2', y(limit))
      .attr('stroke-dasharray', '6 4')
      .attr('stroke-width', 2)
      .style('stroke', 'var(--bound)');
    g.append('text')
      .attr('x', x(n) - 4)
      .attr('y', y(limit) - 8)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', 'var(--bound)')
      .text(`L = ${fmt(limit)}`);

    // The ratio points.
    ratios.forEach((r, i) => {
      g.append('circle')
        .attr('cx', x(i + 1))
        .attr('cy', y(r))
        .attr('r', 4)
        .style('fill', 'var(--accent)');
    });
  } else if (data.majors !== null) {
    const terms = data.terms;
    const majors = data.majors;
    const x = scaleLinear().domain([0.5, n + 0.5]).range([0, width]);
    const y = scaleLinear().domain([0, (majors[0] ?? 1) * 1.1]).range([height, 0]);
    const band = width / n;

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(6));

    header1.call(
      svgText,
      localize(
        {
          ko: String.raw`\(${seriesLabel(data.series, lang)}\) — 모든 \(k\)에서 \(a_k = 1/(k^2+1) < b_k = 1/k^2\)`,
          en: String.raw`\(${seriesLabel(data.series, lang)}\) — \(a_k = 1/(k^2+1) < b_k = 1/k^2\) at every \(k\)`,
        },
        lang,
      ),
    );
    header2.call(
      svgText,
      localize(
        {
          ko: String.raw`\(\sum b_k = \pi^2/6 \approx 1.64493\) 수렴 \(\to\) 비교 판정법으로 \(\sum a_k\) 수렴`,
          en: String.raw`\(\sum b_k = \pi^2/6 \approx 1.64493\) converges \(\to \sum a_k\) converges by comparison`,
        },
        lang,
      ),
    );

    for (let k = 1; k <= n; k++) {
      const b = majors[k - 1] ?? 0;
      const a = terms[k - 1] ?? 0;
      g.append('rect')
        .attr('x', x(k) - band * 0.36)
        .attr('y', y(b))
        .attr('width', band * 0.72)
        .attr('height', Math.max(0, y(0) - y(b)))
        .attr('fill', 'var(--muted)')
        .attr('opacity', 0.55);
      g.append('rect')
        .attr('x', x(k) - band * 0.22)
        .attr('y', y(a))
        .attr('width', band * 0.44)
        .attr('height', Math.max(0, y(0) - y(a)))
        .style('fill', 'var(--accent)');
    }

    // Legend.
    g.append('text')
      .attr('x', 8)
      .attr('y', height + 34)
      .attr('font-size', 12)
      .attr('fill', 'var(--accent)')
      .call(svgText, localize({ ko: String.raw`■ \(a_k = 1/(k^2+1)\)`, en: String.raw`■ \(a_k = 1/(k^2+1)\)` }, lang));
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 34)
      .attr('font-size', 12)
      .attr('fill', 'var(--muted)')
      .call(svgText, localize({ ko: String.raw`■ \(b_k = 1/k^2\) (위에서 누름)`, en: String.raw`■ \(b_k = 1/k^2\) (dominating above)` }, lang));
  }
}

export default defineSimpleScene<TestsData>({
  model: testsModel,
  margin: MARGIN,
  drawMain,
  slots: [{ text: verdictText, bold: true }],
});
