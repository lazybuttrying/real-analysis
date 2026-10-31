import { axisBottom, axisLeft, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { additiveModel, SQRT2, type AdditiveData } from '../models/additive-functions';

/**
 * Additive functions, live. Points (a + b sqrt(2), a + b t) for
 * rational a, b, where t = f(sqrt(2)) is the slider. At t = sqrt(2)
 * everything sits on y = x; otherwise the points with b != 0 peel off
 * the line while the rational points (b = 0) stay pinned to it.
 */

const MARGIN = { top: 28, right: 24, bottom: 44, left: 56 };

function readoutText(data: AdditiveData, lang: Lang): string {
  if (data.onLine) {
    return localize(
      {
        ko: String.raw`\(t = ${fmt(data.t, 2)}\)는 \(\sqrt{2} \approx ${fmt(SQRT2, 4)}\)와 같습니다. 모든 점이 직선 \(y = x\) 위에 있습니다. 이것이 연속인 덧셈 함수 \(f(x) = x\)의 그래프입니다.`,
        en: String.raw`\(t = ${fmt(data.t, 2)}\) equals \(\sqrt{2} \approx ${fmt(SQRT2, 4)}\). Every point lies on the line \(y = x\). This is the graph of the continuous additive function \(f(x) = x\).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(t = ${fmt(data.t, 2)}\)는 \(\sqrt{2}\)와 ${fmt(Math.abs(data.deviation), 2)}만큼 다릅니다. 유리수 점 \(b = 0\)은 직선에 그대로 붙어 있지만, \(b \ne 0\)인 점들은 직선에서 떨어져 흩어집니다. 전체 그래프는 평면 전체에 조밀합니다.`,
      en: String.raw`\(t = ${fmt(data.t, 2)}\) differs from \(\sqrt{2}\) by ${fmt(Math.abs(data.deviation), 2)}. The rational points (\(b = 0\)) stay pinned to the line, but the points with \(b \ne 0\) peel away and scatter. The full graph is dense in the plane.`,
    },
    lang,
  );
}

function explainText(_data: AdditiveData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`덧셈 함수 \(f(x + y) = f(x) + f(y)\)는 유리수 위에서 \(f(q) = qf(1)\)로 완전히 고정됩니다. 그러나 실수를 유리수 위의 벡터공간으로 보면 \(1\)과 \(\sqrt{2}\)는 독립이라, \(f(\sqrt{2})\)의 값은 자유롭게 정할 수 있습니다. 이 자유가 하멜 기저입니다. 한 점에서라도 연속이면 자유는 사라지고 \(f(x) = cx\)만 남습니다. 연속이 아니면 그래프가 평면에 조밀한 괴물 같은 함수가 됩니다.`,
      en: String.raw`An additive function \(f(x + y) = f(x) + f(y)\) is completely pinned on the rationals: \(f(q) = qf(1)\). But viewing the reals as a vector space over the rationals, \(1\) and \(\sqrt{2}\) are independent, so the value \(f(\sqrt{2})\) can be chosen freely. That freedom is the Hamel basis. Continuity at a single point kills the freedom and leaves only \(f(x) = cx\). Without it, the graph is a monster dense in the plane.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: AdditiveData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const x = scaleLinear().domain([-3.6, 3.6]).range([0, width]);
  const y = scaleLinear().domain([-5, 5]).range([height, 0]);

  g.append('text')
    .attr('x', 0)
    .attr('y', -10)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      data.onLine
        ? localize({ ko: 't = √2: 모든 점이 직선 위에', en: 't = √2: every point on the line' }, lang)
        : localize({ ko: 't ≠ √2: 유리수 점만 직선에 남는다', en: 't ≠ √2: only the rational points stay on the line' }, lang),
    );

  g.append('line')
    .attr('x1', x(-3.6))
    .attr('y1', y(-3.6))
    .attr('x2', x(3.6))
    .attr('y2', y(3.6))
    .attr('stroke', 'var(--bound)')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '5 3');
  g.append('text')
    .attr('x', x(3.55))
    .attr('y', y(3.9))
    .attr('text-anchor', 'end')
    .attr('font-size', 11)
    .attr('fill', 'var(--bound)')
    .text('y = x');

  for (const p of data.points) {
    if (p.y < -5 || p.y > 5) continue;
    g.append('circle')
      .attr('cx', x(p.x))
      .attr('cy', y(p.y))
      .attr('r', p.rational ? 3.5 : 2.5)
      .attr('fill', p.rational ? 'var(--accent)' : 'var(--bound)')
      .attr('opacity', p.rational ? 1 : 0.75);
  }

  g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(8));
  g.append('g').attr('transform', `translate(${x(0)},0)`).call(axisLeft(y).ticks(7));
}

export default defineSimpleScene<AdditiveData>({
  model: additiveModel,
  margin: MARGIN,
  fallbackHeight: 340,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
  ],
});
