import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang, stripInlineMath } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  stoneWeierstrassModel,
  type StoneWeierstrassData,
  type StoneWeierstrassSample,
} from '../models/stoneWeierstrass';

/**
 * Stone-Weierstrass on the circle: trigonometric polynomials are uniformly
 * dense in C(S^1). The dashed target is the triangle wave f(x) = |x| on
 * [-pi, pi] (continuous on the circle); the solid curve is its cosine
 * partial sum S_n. Raising the degree slider squeezes the max error
 * toward zero — algebraic polynomials are nowhere in the picture.
 */

const MARGIN = { top: 48, right: 20, bottom: 44, left: 64 };

function headerText(data: StoneWeierstrassData, lang: Lang): string {
  const { degree } = data;
  // Plain text only: this goes into an SVG <text> element, where KaTeX cannot
  // render and stripInlineMath would leave raw TeX commands visible.
  return localize(
    {
      ko: `삼각다항식 S_${degree}(x)가 삼각파 |x|에 균등수렴합니다.`,
      en: `Trig polynomial S_${degree}(x) converges uniformly to the triangle wave |x|.`,
    },
    lang,
  );
}

function readoutText(data: StoneWeierstrassData, lang: Lang): string {
  const { degree, maxErr } = data;
  return localize(
    {
      ko: String.raw`차수 \({degree}\)에서 균등오차 \(\lVert S_{${degree}} - f\rVert_\infty \approx ${fmt(maxErr, 4)}\) — 차수를 올리면 오차가 단조로 0으로 갑니다.`,
      en: String.raw`At degree \(n = ${degree}\), uniform error \(\lVert S_{${degree}} - f\rVert_\infty \approx ${fmt(maxErr, 4)}\) — raising the degree drives the error monotonically to zero.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`점을 분리하고 상수를 포함하는 부분대수(여기서는 삼각다항식)는 균등하게 조밀하다 — 대수적 다항식은 전혀 필요 없다. 이것이 스톤-바이어슈트라스 정리입니다.`,
      en: String.raw`A subalgebra that separates points and contains the constants — here the trigonometric polynomials — is uniformly dense. No algebraic polynomials needed: this is the Stone–Weierstrass theorem.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: StoneWeierstrassData, lang: Lang): void {
    const { samples } = data;
    const { g, width, height } = chart;

    const x = scaleLinear().domain([-Math.PI, Math.PI]).range([0, width]);
    let yMin = Infinity;
    let yMax = -Infinity;
    for (const p of samples) {
      if (p.y < yMin) yMin = p.y;
      if (p.p < yMin) yMin = p.p;
      if (p.y > yMax) yMax = p.y;
      if (p.p > yMax) yMax = p.p;
    }
    const pad = Math.max(0.2, (yMax - yMin) * 0.15);
    const y = scaleLinear()
      .domain([yMin - pad, yMax + pad])
      .range([height, 0]);

    const fLine = line<StoneWeierstrassSample>()
      .x((p) => x(p.x))
      .y((p) => y(p.y));
    const sLine = line<StoneWeierstrassSample>()
      .x((p) => x(p.x))
      .y((p) => y(p.p));

    g.selectAll('*').remove();
    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(5));
    g.append('g').call(axisLeft(y).ticks(6));

    const header = g
      .append('text')
      .attr('x', 0)
      .attr('y', -30)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor');
    header.text(stripInlineMath(headerText(data, lang)));

    // Dashed target triangle wave, solid trigonometric partial sum.
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5 4')
      .attr('opacity', 0.65)
      .attr('d', fLine(samples) ?? '');
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)')
      .attr('d', sLine(samples) ?? '');

    const legend = g.append('text').attr('x', 8).attr('y', height + 32).attr('font-size', 12);
    legend
      .append('tspan')
      .style('fill', 'var(--accent)')
      .text(localize({ ko: '■ S_n (삼각다항식)   ', en: '■ S_n (trig polynomial)   ' }, lang));
    legend
      .append('tspan')
      .attr('fill', 'currentColor')
      .attr('opacity', 0.65)
      .text(localize({ ko: '┄ f (삼각파)', en: '┄ f (triangle wave)' }, lang));
}

export default defineSimpleScene<StoneWeierstrassData>({
  model: stoneWeierstrassModel,
  margin: MARGIN,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: (_data, lang) => verdictText(lang), bold: true }
  ],
  mountExtra: (strips, lang) => {
    const seeAlso = document.createElement('div');
    seeAlso.style.marginTop = '4px';
    const link = document.createElement('a');
    link.href = '../weierstrass-approx/';
    link.textContent = localize(
        { ko: '바이어슈트라스 근사 정리 씬 — 대수적 다항식의 경우', en: 'Weierstrass approximation scene — the algebraic-polynomial case' },
        lang,
      );
    seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), link);
    strips.append(seeAlso);
  },
});
