import { axisBottom, axisLeft, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { squeezeModel, type SqueezeData } from '../models/squeeze';

/**
 * The squeeze theorem, live. The middle sequence sin(n)/n oscillates
 * but is trapped between -1/n and 1/n; as the guards close in on 0,
 * the middle has nowhere else to go.
 */

const MARGIN = { top: 28, right: 24, bottom: 44, left: 52 };

function readoutText(data: SqueezeData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(n = ${data.terms}\)에서: \(-\frac{1}{n} = ${fmt(-data.lastUpper, 4)} \le \frac{\sin n}{n} = ${fmt(data.lastMid, 4)} \le ${fmt(data.lastUpper, 4)} = \frac{1}{n}\).`,
      en: String.raw`At \(n = ${data.terms}\): \(-\frac{1}{n} = ${fmt(-data.lastUpper, 4)} \le \frac{\sin n}{n} = ${fmt(data.lastMid, 4)} \le ${fmt(data.lastUpper, 4)} = \frac{1}{n}\).`,
    },
    lang,
  );
}

function explainText(_data: SqueezeData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`조임 정리: 모든 \(n\)에 대해 \(a_n \le b_n \le c_n\)이고 두 바깥 수열이 같은 값 \(L\)로 가면, 가운데 수열도 \(L\)로 갑니다. 가운데는 직접 잴 필요가 없습니다. 양쪽 경비가 같은 문으로 들어가면 가운데도 그 문으로 들어갈 수밖에 없습니다. \(\sin n\)은 진동해서 극한을 직접 보기 어렵지만, \(|\sin n| \le 1\)이라 \(\frac{\sin n}{n}\)은 \(\pm \frac{1}{n}\) 사이에 갇힙니다.`,
      en: String.raw`The squeeze theorem: if \(a_n \le b_n \le c_n\) for every \(n\) and both outer sequences tend to the same \(L\), the middle one tends to \(L\) too. The middle never needs measuring directly: if both guards walk through the same door, whatever is between them goes through it as well. \(\sin n\) oscillates too much to read off a limit, but \(|\sin n| \le 1\) traps \(\frac{\sin n}{n}\) between \(\pm \frac{1}{n}\).`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: SqueezeData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  const x = scaleLinear().domain([0, data.terms + 1]).range([0, width]);
  const y = scaleLinear().domain([-1.15, 1.15]).range([height, 0]);

  g.append('text')
    .attr('x', 0)
    .attr('y', -10)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(localize({ ko: '조임 정리: sin(n)/n은 ±1/n 사이에 갇혀 있다', en: 'Squeeze: sin(n)/n trapped between ±1/n' }, lang));

  // Zero line.
  g.append('line')
    .attr('x1', x(0))
    .attr('x2', x(data.terms + 1))
    .attr('y1', y(0))
    .attr('y2', y(0))
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1)
    .attr('opacity', 0.4);

  const series = (
    pick: (p: (typeof data.points)[number]) => number,
    color: string,
    r: number,
    opacity: number,
  ): void => {
    for (const p of data.points) {
      g.append('circle').attr('cx', x(p.n)).attr('cy', y(pick(p))).attr('r', r).attr('fill', color).attr('opacity', opacity);
    }
  };
  series((p) => p.upper, 'var(--bound)', 3, 0.8);
  series((p) => p.lower, 'var(--bound)', 3, 0.8);
  series((p) => p.mid, 'var(--accent)', 3.5, 1);

  g.append('text')
    .attr('x', x(data.terms) - 4)
    .attr('y', y(1 / data.terms) - 10)
    .attr('text-anchor', 'end')
    .attr('font-size', 11)
    .attr('fill', 'var(--bound)')
    .text('1/n');
  g.append('text')
    .attr('x', x(data.terms) - 4)
    .attr('y', y(-1 / data.terms) + 16)
    .attr('text-anchor', 'end')
    .attr('font-size', 11)
    .attr('fill', 'var(--bound)')
    .text('-1/n');

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
  g.append('g').call(axisLeft(y).ticks(5));
}

export default defineSimpleScene<SqueezeData>({
  model: squeezeModel,
  margin: MARGIN,
  fallbackHeight: 340,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
  ],
});
