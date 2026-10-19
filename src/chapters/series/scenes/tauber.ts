import { axisBottom, axisLeft, line, scaleLinear, type ScaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  R_MAX,
  R_MIN,
  tauberModel,
  type TauberData,
  type TauberSample,
} from '../models/tauber';

/**
 * Tauber's theorem, live. Two Abel-sum curves ride toward r = 1: Grandi's
 * closed form A_G(r) = 1/(1+r) (bound color) homing in on 1/2, and the
 * computed A_D(r) (accent color) homing in on the ordinary sum S_D of the
 * o(1/n) series D. The vertical marker follows the R slider. The dashed
 * levels tell the story: for Grandi the level 1/2 is an Abel sum of a
 * DIVERGENT series (n a_n never tends to 0); for D the level S_D is a genuine
 * sum that the Abel sums recover -- Tauber's theorem at work.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 64 };

function readoutText(data: TauberData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(r = ${fmt(data.r, 3)}\): 그란디 \(A_G(r) = \frac{1}{1+r} \approx ${fmt(data.abelGrandiAtR, 4)}\) → \(\frac{1}{2}\); D: \(A_D(r) \approx ${fmt(data.abelDAtR, 4)}\), 보통 합 \(S_D \approx ${fmt(data.sumD, 4)}\). D의 곡선은 \(S_D\) 수준(점선)에 닿고, 그란디의 곡선은 \(\frac{1}{2}\)에 닿지만 그 아래에는 합이 없습니다.`,
      en: String.raw`\(r = ${fmt(data.r, 3)}\): Grandi \(A_G(r) = \frac{1}{1+r} \approx ${fmt(data.abelGrandiAtR, 4)}\) → \(\frac{1}{2}\); D: \(A_D(r) \approx ${fmt(data.abelDAtR, 4)}\), ordinary sum \(S_D \approx ${fmt(data.sumD, 4)}\). D's curve reaches its dashed level \(S_D\); Grandi's reaches \(\frac{1}{2}\), with no sum underneath.`,
    },
    lang,
  );
}

function checkText(data: TauberData, lang: Lang): string {
  const [p1, p2, p3] = data.ndProbes;
  const [g1, g2, g3] = data.grandiProbes;
  return localize(
    {
      ko: String.raw`\(o(1/n)\) 판정: 그란디는 \(|n\,a_n| = ${g1?.value}, ${g2?.value}, ${g3?.value}\) (\(n = ${g1?.n}, ${g2?.n}, ${g3?.n}\)) — \(0\)으로 가지 않아 가설이 깨집니다. D는 \(|n\,d_n| \approx ${fmt(p1?.value ?? 0, 4)}, ${fmt(p2?.value ?? 0, 4)}, ${fmt(p3?.value ?? 0, 4)}\) — \(0\)으로 가서 가설이 성립합니다.`,
      en: String.raw`The \(o(1/n)\) check: Grandi has \(|n\,a_n| = ${g1?.value}, ${g2?.value}, ${g3?.value}\) (\(n = ${g1?.n}, ${g2?.n}, ${g3?.n}\)) — never tends to \(0\), so the hypothesis fails. D has \(|n\,d_n| \approx ${fmt(p1?.value ?? 0, 4)}, ${fmt(p2?.value ?? 0, 4)}, ${fmt(p3?.value ?? 0, 4)}\) — tends to \(0\), so the hypothesis holds.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`타우버 정리: \(\sum a_n\)이 \(L\)에 Abel 총합가능하고 \(a_n = o(1/n)\)이면 \(\sum a_n = L\)이 실제로 수렴합니다. 그란디 급수는 Abel 합 \(\frac{1}{2}\)을 갖지만 항이 너무 커서(\(|n\,a_n| = n\)) 결론이 깨지고, D는 항이 작아서 Abel 합이 보통 합과 일치합니다.`,
      en: String.raw`Tauber's theorem: if \(\sum a_n\) is Abel summable to \(L\) and \(a_n = o(1/n)\), then \(\sum a_n\) genuinely converges to \(L\). Grandi has Abel sum \(\frac{1}{2}\) but its terms are too big (\(|n\,a_n| = n\)), so the conclusion fails; D's terms are small, so its Abel sum agrees with the ordinary sum.`,
    },
    lang,
  );
}

const path = line<TauberSample>()
  .x((d) => d.r)
  .y((d) => d.y);

// A dashed horizontal level line (an Abel-sum target) across the panel.
function level(
  g: Chart['g'],
  value: number,
  color: string,
  x: ScaleLinear<number, number>,
  y: ScaleLinear<number, number>,
): void {
  g.append('line')
    .attr('x1', x(R_MIN))
    .attr('x2', x(R_MAX))
    .attr('y1', y(value))
    .attr('y2', y(value))
    .attr('stroke-dasharray', '5 4')
    .attr('stroke-width', 1.5)
    .style('stroke', color);
}

function drawMain(chart: Chart, data: TauberData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const x = scaleLinear().domain([R_MIN, R_MAX]).range([0, width]);
  const yMin = 0.45;
  const yMax = 1.2;
  const y = scaleLinear().domain([yMin, yMax]).range([height, 0]);
  const px = path.x((d) => x(d.r)).y((d) => y(d.y));

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));
  g.append('g').call(axisLeft(y).ticks(6));

  g.append('text')
    .attr('x', 0)
    .attr('y', -20)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `Abel 합 곡선: A_G(r) = 1/(1+r) (그란디) vs A_D(r) (D, 4000항)`,
          en: `Abel-sum curves: A_G(r) = 1/(1+r) (Grandi) vs A_D(r) (D, 4000 terms)`,
        },
        lang,
      ),
    );

  // Dashed levels: 1/2 (Grandi's Abel sum) and S_D (D's ordinary sum).
  level(g, 0.5, 'var(--bound)', x, y);
  level(g, data.sumD, 'var(--accent)', x, y);
  g.append('text')
    .attr('x', x(R_MAX))
    .attr('y', y(0.5) - 6)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .style('fill', 'var(--bound)')
    .text('1/2');
  g.append('text')
    .attr('x', x(R_MAX))
    .attr('y', y(data.sumD) - 6)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(localize({ ko: `S_D ≈ ${fmt(data.sumD, 4)}`, en: `S_D ≈ ${fmt(data.sumD, 4)}` }, lang));

  // Grandi curve, bound color (the failing case).
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .style('stroke', 'var(--bound)')
    .attr('d', px(data.grandiCurve) ?? '');
  // D curve, accent color (the theorem working).
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 2.5)
    .style('stroke', 'var(--accent)')
    .attr('d', px(data.dCurve) ?? '');

  // Vertical marker at the slider r, with dots on both curves.
  g.append('line')
    .attr('x1', x(data.r))
    .attr('x2', x(data.r))
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '4 3')
    .attr('stroke', 'currentColor')
    .attr('opacity', 0.6);
  g.append('circle')
    .attr('cx', x(data.r))
    .attr('cy', y(data.abelGrandiAtR))
    .attr('r', 4)
    .style('fill', 'var(--bound)');
  g.append('circle')
    .attr('cx', x(data.r))
    .attr('cy', y(data.abelDAtR))
    .attr('r', 4)
    .style('fill', 'var(--accent)');

  // Legend.
  const legendY = height + 34;
  g.append('text')
    .attr('x', 8)
    .attr('y', legendY)
    .attr('font-size', 12)
    .style('fill', 'var(--bound)')
    .text(localize({ ko: '— A_G(r) (그란디, 가설 실패)', en: '— A_G(r) (Grandi, hypothesis fails)' }, lang));
  g.append('text')
    .attr('x', width * 0.45)
    .attr('y', legendY)
    .attr('font-size', 12)
    .style('fill', 'var(--accent)')
    .text(localize({ ko: '— A_D(r) (D, 가설 성립)', en: '— A_D(r) (D, hypothesis holds)' }, lang));
}

function mountExtra(strips: HTMLElement, lang: Lang): void {
  // Cross-link: the Grandi scene, whose divergent partial sums this
  // scene's failing half is built on.
  const seeAlso = document.createElement('div');
  seeAlso.style.marginTop = '4px';
  const grandiLink = document.createElement('a');
  grandiLink.href = '../grandi/';
  grandiLink.textContent = localize(
    {
      ko: '그란디 급수 씬 — 1, 0, 1, 0… 영원히 오가는 부분합',
      en: 'Grandi series scene — partial sums bouncing 1, 0, 1, 0… forever',
    },
    lang,
  );
  seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), grandiLink);
  strips.append(seeAlso);
}

export default defineSimpleScene<TauberData>({
  model: tauberModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: checkText, spaced: true },
    { text: (_data, lang) => verdictText(lang), bold: true, spaced: true },
  ],
  mountExtra,
});
