import { axisBottom, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { archimedeanModel, type ArchimedeanData } from '../models/archimedean';

/**
 * The Archimedean property, live. Multiples of the step a march along
 * the number line; the first one past the target b is highlighted.
 * No matter how small the step or how far the target, the march
 * always arrives.
 */

const MARGIN = { top: 28, right: 24, bottom: 44, left: 52 };

function readoutText(data: ArchimedeanData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`한 걸음 \(a = ${fmt(data.a, 4)}\), 목표 \(b = ${fmt(data.b, 4)}\): \(n = ${data.n}\)이면 \((n-1)a = ${fmt(data.prevA, 4)} \le b < ${fmt(data.na, 4)} = na\).`,
      en: String.raw`Step \(a = ${fmt(data.a, 4)}\), target \(b = ${fmt(data.b, 4)}\): at \(n = ${data.n}\), \((n-1)a = ${fmt(data.prevA, 4)} \le b < ${fmt(data.na, 4)} = na\).`,
    },
    lang,
  );
}

function explainText(_data: ArchimedeanData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`아르키메데스 성질: 아무리 작은 걸음 \(a > 0\)라도, 아무리 먼 목표 \(b\)라도, 걸음을 충분히 반복하면 반드시 넘어섭니다. 무한히 작은 수는 실수에 없습니다. 이 성질 덕분에 \(\varepsilon\)-\(N\) 논법에서 "충분히 큰 \(N\)"이 항상 존재합니다. 증명은 상한 공리에서 나옵니다: 걸음의 배수들이 \(b\) 아래에 갇혀 있으면 상한이 있어야 하는데, 그 상한에서 한 걸음을 빼면 모순이 생깁니다.`,
      en: String.raw`The Archimedean property: however small the step \(a > 0\) and however far the target \(b\), repeating the step enough times always passes it. The reals have no infinitely small numbers. This is what guarantees that a "large enough \(N\)" always exists in \(\varepsilon\)-\(N\) arguments. The proof comes from the least-upper-bound axiom: if the multiples were trapped below \(b\) they would have a supremum, and stepping back from it by one step gives a contradiction.`,
    },
    lang,
  );
}

function corollaryText(_data: ArchimedeanData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`따름정리: 어떤 \(\varepsilon > 0\)에 대해서도 \(\frac{1}{n} < \varepsilon\)인 자연수 \(n\)이 있습니다. \(\varepsilon\)을 걸음으로, 1을 목표로 삼으면 됩니다.`,
      en: String.raw`Corollary: for every \(\varepsilon > 0\) there is a natural \(n\) with \(\frac{1}{n} < \varepsilon\). Take \(\varepsilon\) as the step and 1 as the target.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: ArchimedeanData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const hi = Math.max(data.na, data.b) * 1.08;
  const x = scaleLinear().domain([0, hi]).range([0, width]);
  const lineY = height * 0.55;

  g.append('text')
    .attr('x', 0)
    .attr('y', -10)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        { ko: `아르키메데스 성질: n = ${data.n} 걸음이면 넘어선다`, en: `Archimedean property: ${data.n} steps get past` },
        lang,
      ),
    );

  g.append('line')
    .attr('x1', x(0))
    .attr('x2', x(hi))
    .attr('y1', lineY)
    .attr('y2', lineY)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1.5);

  data.multiples.forEach((m, i) => {
    const isLast = i === data.multiples.length - 1;
    g.append('circle')
      .attr('cx', x(m))
      .attr('cy', lineY)
      .attr('r', isLast ? 6 : 3.5)
      .attr('fill', isLast ? 'var(--accent)' : 'currentColor')
      .attr('opacity', isLast ? 1 : 0.55);
    if (isLast) {
      g.append('text')
        .attr('x', x(m))
        .attr('y', lineY - 16)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .attr('fill', 'var(--accent)')
        .text('na');
    }
  });

  // Target marker.
  g.append('line')
    .attr('x1', x(data.b))
    .attr('x2', x(data.b))
    .attr('y1', lineY - 26)
    .attr('y2', lineY + 10)
    .attr('stroke', 'var(--bound)')
    .attr('stroke-width', 2.5);
  g.append('text')
    .attr('x', x(data.b))
    .attr('y', lineY + 30)
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', 'var(--bound)')
    .text('b');

  g.append('g').attr('transform', `translate(0,${height - 6})`).call(axisBottom(x).ticks(8));
}

export default defineSimpleScene<ArchimedeanData>({
  model: archimedeanModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: corollaryText, spaced: true },
  ],
});
