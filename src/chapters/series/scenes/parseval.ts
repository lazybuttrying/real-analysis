import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { parsevalModel, type ParsevalData } from '../models/parseval';

/**
 * Parseval's identity, live. The bars are the cumulative captured energy
 * S_N = a_0^2/2 + sum_{n<=N} (a_n^2 + b_n^2); the dashed horizontal line is
 * the L^2 norm (1/pi) int_{-pi}^{pi} f^2. Dragging N shows S_N rising to the
 * line — the Fourier series carries the full energy of f.
 */

const MARGIN = { top: 36, right: 20, bottom: 44, left: 64 };

const MODE_NAME: Record<string, { ko: string; en: string }> = {
  square: { ko: '구형파 (±1)', en: 'square wave (±1)' },
  sawtooth: { ko: '톱니파 f(x) = x', en: 'sawtooth f(x) = x' },
  parabola: { ko: '포물선 f(x) = x²', en: 'parabola f(x) = x²' },
};

function modeName(mode: string, lang: Lang): string {
  return localize(
    (MODE_NAME[mode] ?? MODE_NAME['square']) as { ko: string; en: string },
    lang,
  );
}

function readoutText(data: ParsevalData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`${modeName(data.mode, 'ko')}, \(N = ${data.nMax}\): 누적 에너지 \(S_N = ${fmt(data.captured, 6)}\), \(L^2\) 노름 \(\frac{1}{\pi}\int_{-\pi}^{\pi} f^2 = ${fmt(data.norm2, 6)}\), 포착 비율 \(S_N / \|f\|_2^2 = ${fmt(data.fraction * 100, 3)}\%\).`,
      en: String.raw`${modeName(data.mode, 'en')}, \(N = ${data.nMax}\): captured energy \(S_N = ${fmt(data.captured, 6)}\), \(L^2\) norm \(\frac{1}{\pi}\int_{-\pi}^{\pi} f^2 = ${fmt(data.norm2, 6)}\), captured fraction \(S_N / \|f\|_2^2 = ${fmt(data.fraction * 100, 3)}\%\).`,
    },
    lang,
  );
}

function explainText(data: ParsevalData, lang: Lang): string {
  const body = localize(
    {
      ko: String.raw`막대는 부분합까지 잡아낸 에너지 \(S_N = \frac{a_0^2}{2} + \sum_{n \le N}(a_n^2 + b_n^2)\)이고, 점선은 \(f\) 전체의 \(L^2\) 에너지입니다. \(N\)을 키우면 막대가 점선에 바짝 붙습니다 — 푸리에 급수가 \(f\)의 에너지를 하나도 빠뜨리지 않고 나른다는 뜻입니다.`,
      en: String.raw`The bars are the energy captured through the Nth partial sum, \(S_N = \frac{a_0^2}{2} + \sum_{n \le N}(a_n^2 + b_n^2)\); the dashed line is the full \(L^2\) energy of \(f\). Raising \(N\) presses the bars against the line — the Fourier series carries every bit of \(f\)'s energy.`,
    },
    lang,
  );
  const modeNote =
    data.mode === 'square'
      ? localize(
          {
            ko: String.raw` 구형파는 불연속이라 수렴이 느립니다 (\(b_n \sim 1/n\)이므로 에너지 꼬리가 \(\sim 1/N\)) — 아래 문제 1에서 \(\sum_{\text{홀수 } n} \frac{16}{\pi^2 n^2} = 2\)를 손으로 확인합니다.`,
            en: String.raw` The square wave is discontinuous, so convergence is slow (energy tail \(\sim 1/N\) since \(b_n \sim 1/n\)) — problem 1 below verifies \(\sum_{\text{odd } n} \frac{16}{\pi^2 n^2} = 2\) by hand.`,
          },
          lang,
        )
      : data.mode === 'parabola'
        ? localize(
            {
              ko: String.raw` 포물선은 매끄러워 \(a_n \sim 1/n^2\) — 에너지가 \(1/n^4\)으로 들어가 \(N\)이 조금만 커져도 점선에 거의 닿습니다.`,
              en: String.raw` The parabola is smooth, so \(a_n \sim 1/n^2\) — the energy goes in as \(1/n^4\), and the bars nearly touch the line at modest \(N\).`,
            },
            lang,
          )
        : '';
  return body + modeNote;
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(N \to \infty\)에서 \(S_N \uparrow \frac{1}{\pi}\int_{-\pi}^{\pi} f^2\) — 이것이 파스발 항등식입니다. 남는 에너지는 0이므로 푸리에 부분합은 \(L^2\)에서 \(f\)로 수렴합니다 (아래 문제 2, 3).`,
      en: String.raw`As \(N \to \infty\), \(S_N \uparrow \frac{1}{\pi}\int_{-\pi}^{\pi} f^2\) — that is Parseval's identity. No energy is left over, so the Fourier partial sums converge to \(f\) in \(L^2\) (problems 2 and 3 below).`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: ParsevalData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  g.append('text')
    .attr('x', 0)
    .attr('y', -18)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        { ko: `${modeName(data.mode, 'ko')}: 누적 에너지 S_N → L² 노름`, en: `${modeName(data.mode, 'en')}: cumulative energy S_N → L² norm` },
        lang,
      ),
    );

  const x = scaleLinear().domain([0, data.nMax + 1]).range([0, width]);
  const yTop = Math.max(data.norm2, data.captured) * 1.08;
  const y = scaleLinear().domain([0, yTop]).range([height, 0]);

  // Cumulative-energy bars.
  const barW = Math.max(1, (x(2) - x(1)) * 0.7);
  for (const t of data.terms) {
    g.append('rect')
      .attr('x', x(t.n) - barW / 2)
      .attr('width', barW)
      .attr('y', y(t.partial))
      .attr('height', Math.max(0, y(0) - y(t.partial)))
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.55);
  }
  // The S_N polyline on top of the bars.
  g.append('path')
    .attr('fill', 'none')
    .attr('stroke-width', 1.5)
    .attr('stroke', 'var(--accent)')
    .attr(
      'd',
      line<ParsevalData['terms'][number]>()
        .x((t) => x(t.n))
        .y((t) => y(t.partial))(data.terms) ?? '',
    );
  // The L^2-norm target line.
  g.append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y(data.norm2))
    .attr('y2', y(data.norm2))
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '7 4')
    .attr('stroke', 'currentColor')
    .attr('opacity', 0.85);
  g.append('text')
    .attr('x', width)
    .attr('y', y(data.norm2) - 6)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text(
      localize(
        { ko: `L² 노름 = ${fmt(data.norm2, 4)}`, en: `L² norm = ${fmt(data.norm2, 4)}` },
        lang,
      ),
    );

  g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(Math.min(data.nMax, 10)));
  g.append('g').call(axisLeft(y).ticks(5));
  g.append('text')
    .attr('x', 8)
    .attr('y', 14)
    .attr('font-size', 12)
    .attr('fill', 'currentColor')
    .text('S_N');

  // Readout numbers on the chart.
  g.append('text')
    .attr('x', width)
    .attr('y', 14)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(`N = ${data.nMax} · S_N = ${fmt(data.captured, 4)} · captured = ${fmt(data.fraction * 100, 2)}%`);
}

export default defineSimpleScene<ParsevalData>({
  model: parsevalModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: (_data, lang) => verdictText(lang), bold: true, spaced: true },
  ],
});
