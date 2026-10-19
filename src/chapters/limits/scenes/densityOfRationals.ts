import { axisBottom, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { densityOfRationalsModel, type DensityOfRationalsData } from '../models/densityOfRationals';

/**
 * Tao, Analysis I, Propositions 4.4.1 and 4.4.3, live. A zoomed number line
 * on the open interval (x, y) (endpoints drawn as hollow circles). Rational
 * ticks with denominator <= N appear as accent dots; raising N multiplies
 * them. The constructed rational q = m/n from Tao's proof is drawn larger
 * with a label, and the readout shows the Archimedean recipe n, m and the
 * strict inequality x < m/n < y.
 */

const MARGIN = { top: 44, right: 24, bottom: 52, left: 24 };
/** Cap on rendered ticks; the data array is thinned by stride past this. */
const RENDER_CAP = 4000;

function intervalLabel(data: DensityOfRationalsData): string {
  return `(${fmt(data.x, 2)}, ${fmt(data.y, 2)})`;
}

function readoutText(data: DensityOfRationalsData, lang: Lang): string {
  const c = data.constructed;
  const check = c.verified
    ? localize({ ko: '확인됨 ✓', en: 'verified ✓' }, lang)
    : localize({ ko: '확인 실패 ✗', en: 'FAILED ✗' }, lang);
  return localize(
    {
      ko: String.raw`구간 ${intervalLabel(data)}: \(n = \left\lfloor\frac{1}{y-x}\right\rfloor + 1 = ${c.n}\), \(m = \lfloor nx \rfloor + 1 = ${c.m}\), \(q = \frac{m}{n} = \frac{${c.m}}{${c.n}} \approx ${fmt(c.value, 8)}\). \(x < q < y\) — ${check}.`,
      en: String.raw`Interval ${intervalLabel(data)}: \(n = \left\lfloor\frac{1}{y-x}\right\rfloor + 1 = ${c.n}\), \(m = \lfloor nx \rfloor + 1 = ${c.m}\), \(q = \frac{m}{n} = \frac{${c.m}}{${c.n}} \approx ${fmt(c.value, 8)}\). \(x < q < y\) — ${check}.`,
    },
    lang,
  );
}

function explainText(data: DensityOfRationalsData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(n\)을 \(\frac{1}{n} < y - x\)가 되도록 크게 잡으면(아르키메데스 성질), 간격 \(\frac{1}{n}\)짜리 눈금 \(\dots, \frac{m-1}{n}, \frac{m}{n}, \dots\) 중 하나는 반드시 \((x, y)\) 안에 떨어집니다. 분모 상한을 키우면 구간 안에 찍히는 유리수 눈금이 늘어납니다 — 현재 \({data.grid.length}\)개.`,
      en: String.raw`Choosing \(n\) so large that \(\frac{1}{n} < y - x\) (the Archimedean property) forces one of the \(\frac{1}{n}\)-spaced marks \(\dots, \frac{m-1}{n}, \frac{m}{n}, \dots\) to land inside \((x, y)\). Raising the denominator cap multiplies the rational ticks inside the interval — currently ${data.grid.length} of them.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`어떤 열린 구간에도 유리수가 들어갑니다 — 유리수는 실수 직선 위에 조밀합니다. (무리수도 조밀합니다: 아래 문제 3.)`,
      en: String.raw`Every open interval contains a rational — the rationals are dense on the real line. (So are the irrationals: problem 3 below.)`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: DensityOfRationalsData, lang: Lang): void {
    const { g, width, height } = chart;
    g.selectAll('*').remove();

    const pad = (data.y - data.x) * 0.06;
    const x = scaleLinear()
      .domain([data.x - pad, data.y + pad])
      .range([0, width]);
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
            ko: `열린 구간 ${intervalLabel(data)} 안의 유리수 (분모 ≤ ${data.denom})`,
            en: `Rationals inside the open interval ${intervalLabel(data)} (denominator ≤ ${data.denom})`,
          },
          lang,
        ),
      );

    // The zoomed line segment.
    g.append('line')
      .attr('x1', x(data.x))
      .attr('x2', x(data.y))
      .attr('y1', lineY)
      .attr('y2', lineY)
      .attr('stroke-width', 2)
      .style('stroke', 'currentColor');

    // Endpoints as hollow circles: the interval is open.
    for (const end of [data.x, data.y]) {
      g.append('circle')
        .attr('cx', x(end))
        .attr('cy', lineY)
        .attr('r', 5)
        .attr('fill', 'var(--background, #fff)')
        .attr('stroke-width', 2)
        .style('stroke', 'currentColor');
    }

    // Rational ticks (thinned by stride past the render cap).
    const stride = Math.max(1, Math.ceil(data.grid.length / RENDER_CAP));
    const ticks = data.grid.filter((_, i) => i % stride === 0);
    g.selectAll('circle.rational-tick')
      .data(ticks)
      .join('circle')
      .attr('class', 'rational-tick')
      .attr('cx', (d) => x(d.value))
      .attr('cy', lineY)
      .attr('r', 2.5)
      .attr('opacity', 0.5)
      .style('fill', 'var(--accent)');

    // The constructed rational q = m/n: larger dot with a label.
    const c = data.constructed;
    g.append('circle')
      .attr('cx', x(c.value))
      .attr('cy', lineY - 20)
      .attr('r', 6)
      .style('fill', 'var(--bound)');
    g.append('line')
      .attr('x1', x(c.value))
      .attr('x2', x(c.value))
      .attr('y1', lineY - 14)
      .attr('y2', lineY)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3 2')
      .style('stroke', 'var(--bound)');
    g.append('text')
      .attr('x', x(c.value))
      .attr('y', lineY - 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .style('fill', 'var(--bound)')
      .text(`${c.m}/${c.n}`);

    g.append('text')
      .attr('x', x(c.value))
      .attr('y', lineY + 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(localize({ ko: '구성된 유리수 q', en: 'constructed q' }, lang));
}

export default defineSimpleScene<DensityOfRationalsData>({
  model: densityOfRationalsModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: (_data, lang) => verdictText(lang), bold: true, spaced: true }
  ],
});
