import { axisBottom, axisLeft, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { boundedModel, type BoundedData } from '../models/bounded';

/**
 * Bounded sequences, live. Terms are plotted against n; dashed lines
 * at +-M appear when a bound exists. The linear example outgrows any
 * fixed band the chart can show.
 */

const MARGIN = { top: 28, right: 24, bottom: 44, left: 52 };

function kindName(data: BoundedData, lang: Lang): string {
  if (data.kind === 'ratio') return localize({ ko: String.raw`\(a_n = \frac{n}{n+1}\)`, en: String.raw`\(a_n = \frac{n}{n+1}\)` }, lang);
  if (data.kind === 'alt') return localize({ ko: String.raw`\(a_n = (-1)^n\)`, en: String.raw`\(a_n = (-1)^n\)` }, lang);
  return localize({ ko: String.raw`\(a_n = \frac{n}{5}\)`, en: String.raw`\(a_n = \frac{n}{5}\)` }, lang);
}

function readoutText(data: BoundedData, lang: Lang): string {
  if (data.bounded) {
    return localize(
      {
        ko: String.raw`${kindName(data, lang)}: 보이는 항의 최대 절댓값은 ${fmt(data.shownMax, 4)}이고, 모든 항이 \(|a_n| \le 1\)을 만족합니다.`,
        en: String.raw`${kindName(data, lang)}: the largest absolute value shown is ${fmt(data.shownMax, 4)}, and every term satisfies \(|a_n| \le 1\).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`${kindName(data, lang)}: 보이는 항만으로도 절댓값이 ${fmt(data.shownMax, 4)}까지 자랍니다. 어떤 \(M\)을 골라도 언젠가 넘어섭니다.`,
      en: String.raw`${kindName(data, lang)}: even the shown terms reach absolute value ${fmt(data.shownMax, 4)}. Whatever \(M\) is chosen, the sequence eventually passes it.`,
    },
    lang,
  );
}

function explainText(_data: BoundedData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`수열이 유계라는 것은, 모든 항을 한 번에 가두는 울타리 \(M\)이 있다는 뜻입니다: 모든 \(n\)에 대해 \(|a_n| \le M\). 울타리는 항마다 다르면 안 됩니다. 수렴하는 수열은 항상 유계입니다. 하지만 반대는 아닙니다: \((-1)^n\)은 유계인데 수렴하지 않습니다. 볼차노-바이어슈트라스 정리는 유계인 수열 안에서 수렴하는 부분수열을 찾아냅니다.`,
      en: String.raw`A sequence is bounded when one fence \(M\) pens in every term at once: \(|a_n| \le M\) for all \(n\). The fence may not move from term to term. Every convergent sequence is bounded. The converse fails: \((-1)^n\) is bounded but does not converge. The Bolzano-Weierstrass theorem finds a convergent subsequence hiding inside a bounded sequence.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: BoundedData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const yMax = data.bounded ? 1.4 : Math.max(2, data.shownMax * 1.1);
  const x = scaleLinear().domain([0, data.terms + 1]).range([0, width]);
  const y = scaleLinear().domain([-yMax, yMax]).range([height, 0]);

  g.append('text')
    .attr('x', 0)
    .attr('y', -10)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      data.bounded
        ? localize({ ko: '유계: 울타리 M = 1 안에 다 들어간다', en: 'Bounded: one fence M = 1 holds them all' }, lang)
        : localize({ ko: '유계 아님: 어떤 울타리도 넘어선다', en: 'Unbounded: it outgrows every fence' }, lang),
    );

  if (data.bound !== null) {
    for (const s of [1, -1]) {
      g.append('line')
        .attr('x1', x(0))
        .attr('x2', x(data.terms + 1))
        .attr('y1', y(s * data.bound))
        .attr('y2', y(s * data.bound))
        .attr('stroke', 'var(--bound)')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5 3');
    }
    g.append('text')
      .attr('x', x(data.terms + 1) - 4)
      .attr('y', y(data.bound) - 6)
      .attr('text-anchor', 'end')
      .attr('font-size', 11)
      .attr('fill', 'var(--bound)')
      .text('M = 1');
  }

  data.values.forEach((v, i) => {
    g.append('circle')
      .attr('cx', x(i + 1))
      .attr('cy', y(v))
      .attr('r', 3.5)
      .attr('fill', 'var(--accent)');
  });

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
  g.append('g').call(axisLeft(y).ticks(5));
}

export default defineSimpleScene<BoundedData>({
  model: boundedModel,
  margin: MARGIN,
  fallbackHeight: 340,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
  ],
});
