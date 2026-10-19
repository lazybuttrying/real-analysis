import { axisBottom, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { SQRT2, sqrt2IrrationalModel, type Sqrt2IrrationalData } from '../models/sqrt2Irrational';

/**
 * Tao, Analysis I, Proposition 4.4.4, live. The number line 1..2 carries one
 * dot per rational p/q with denominator <= N (accent), the dashed vertical
 * line marks sqrt(2) ~= 1.4142 (bound color) — no dot ever lands on it. The
 * closest rational is drawn larger; the readout shows it and its distance.
 * Dragging the denominator slider piles more dots onto the line, but the
 * hole at sqrt(2) survives every N.
 */

const MARGIN = { top: 44, right: 24, bottom: 52, left: 24 };
/** Cap on rendered dots; the data array is thinned by stride past this. */
const RENDER_CAP = 600;

function readoutText(data: Sqrt2IrrationalData, lang: Lang): string {
  const side =
    data.bestValue < SQRT2
      ? localize({ ko: '아래에서', en: 'from below' }, lang)
      : localize({ ko: '위에서', en: 'from above' }, lang);
  return localize(
    {
      ko: String.raw`\(N = ${data.denom}\): \(\sqrt{2}\)에 가장 가까운 유리수는 \(\frac{${data.bestP}}{${data.bestQ}} \approx ${fmt(data.bestValue, 8)}\) (${side} 접근), \(|\frac{${data.bestP}}{${data.bestQ}} - \sqrt{2}| \approx ${fmt(data.minDist, 8)} > 0\).`,
      en: String.raw`\(N = ${data.denom}\): the closest rational to \(\sqrt{2}\) is \(\frac{${data.bestP}}{${data.bestQ}} \approx ${fmt(data.bestValue, 8)}\) (${side}), with \(|\frac{${data.bestP}}{${data.bestQ}} - \sqrt{2}| \approx ${fmt(data.minDist, 8)} > 0\).`,
    },
    lang,
  );
}

function explainText(data: Sqrt2IrrationalData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`점들은 분모가 ${data.denom} 이하인 유리수 \(p/q \in [1, 2]\)입니다. 분모를 키우면 점이 빽빽해지지만, 점선 \(\sqrt{2} \approx 1.4142\) 위에는 어떤 \(N\)에서도 점이 하나도 찍히지 않습니다 — 증명(아래 문제 1)은 어떤 분수를 제곱해도 \(2\)가 될 수 없음을 보입니다.`,
      en: String.raw`The dots are the rationals \(p/q \in [1, 2]\) with denominator at most ${data.denom}. Raising the denominator packs the dots tighter, but for every \(N\) not a single dot lands on the dashed line \(\sqrt{2} \approx 1.4142\) — the proof (problem 1 below) shows no fraction squared can ever be \(2\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`유리수 직선에는 구멍이 있습니다 — 이 구멍을 메우는 것이 상한 공리이고, 그 구멍에 들어가는 수가 바로 다음 장면의 \(\sqrt{2}\)입니다.`,
      en: String.raw`The rational line has a hole in it — the least-upper-bound axiom fills that hole, and the number filling it is the \(\sqrt{2}\) of the coming scenes.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: Sqrt2IrrationalData, lang: Lang): void {
    const { g, width, height } = chart;
    g.selectAll('*').remove();

    const x = scaleLinear().domain([1, 2]).range([0, width]);
    const lineY = height * 0.45;

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(10));

    g.append('text')
      .attr('x', 0)
      .attr('y', -24)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: '분모 ≤ N인 유리수들과 √2의 구멍',
            en: 'Rationals with denominator ≤ N, and the hole at √2',
          },
          lang,
        ),
      );

    // The number line itself.
    g.append('line')
      .attr('x1', x(1))
      .attr('x2', x(2))
      .attr('y1', lineY)
      .attr('y2', lineY)
      .attr('stroke-width', 2)
      .style('stroke', 'currentColor');

    // Rational dots (thinned by stride past the render cap).
    const stride = Math.max(1, Math.ceil(data.points.length / RENDER_CAP));
    const dots = data.points.filter((_, i) => i % stride === 0);
    g.selectAll('circle.rational-dot')
      .data(dots)
      .join('circle')
      .attr('class', 'rational-dot')
      .attr('cx', (d) => x(d.value))
      .attr('cy', lineY)
      .attr('r', 3)
      .attr('opacity', 0.55)
      .style('fill', 'var(--accent)');

    // The closest rational: larger dot above the line.
    g.append('circle')
      .attr('cx', x(data.bestValue))
      .attr('cy', lineY - 18)
      .attr('r', 5.5)
      .style('fill', 'var(--accent)');
    g.append('line')
      .attr('x1', x(data.bestValue))
      .attr('x2', x(data.bestValue))
      .attr('y1', lineY - 12)
      .attr('y2', lineY)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3 2')
      .style('stroke', 'var(--accent)');
    g.append('text')
      .attr('x', x(data.bestValue))
      .attr('y', lineY - 26)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .style('fill', 'var(--accent)')
      .text(`${data.bestP}/${data.bestQ}`);

    // The hole: dashed marker at sqrt(2), bound color.
    g.append('line')
      .attr('x1', x(SQRT2))
      .attr('x2', x(SQRT2))
      .attr('y1', 0)
      .attr('y2', lineY + 14)
      .attr('stroke-dasharray', '5 4')
      .attr('stroke-width', 2)
      .style('stroke', 'var(--bound)');
    g.append('circle')
      .attr('cx', x(SQRT2))
      .attr('cy', lineY)
      .attr('r', 5)
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--bound)');
    g.append('text')
      .attr('x', x(SQRT2))
      .attr('y', lineY + 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .style('fill', 'var(--bound)')
      .text(localize({ ko: '√2 — 점 없음', en: '√2 — no dot' }, lang));
}

export default defineSimpleScene<Sqrt2IrrationalData>({
  model: sqrt2IrrationalModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: (_data, lang) => verdictText(lang), bold: true, spaced: true }
  ],
});
