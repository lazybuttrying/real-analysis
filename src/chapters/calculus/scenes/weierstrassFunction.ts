import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import {
  weierstrassModel,
  type WeierstrassData,
} from '../models/weierstrassFunction';

/**
 * The Weierstrass function W(x) = sum a^n cos(b^n pi x), a = 1/2, b = 13,
 * live as its partial sums W_N over [0, 1]. The slider adds terms: each new
 * cosine is 13x faster and half as tall, so the curve gets rougher at every
 * scale instead of smoother. The caption strip shows the M-test numbers:
 * the uniform tail bound |W - W_N| <= a^{N+1}/(1-a) and the last term's
 * majorant a^N. Continuous everywhere by the M-test (see the m-test scene in
 * the series chapter), differentiable nowhere.
 */

const MARGIN = { top: 64, right: 20, bottom: 44, left: 60 };

function factsText(data: WeierstrassData, lang: Lang): string {
  const tail = fmt(data.tailBound, 8);
  const lastTerm = fmt(data.lastTermBound, 8);
  return localize(
    {
      ko: String.raw`부분합 \(W_{${data.n}}\) (항 \(n = ${data.n}\)개): 모든 \(x\)에 대해 \(|W(x) - W_{${data.n}}(x)| \le \frac{a^{${data.n + 1}}}{1-a} = ${tail}\), 마지막 항 \(|a^{${data.n}}\cos(b^{${data.n}}\pi x)| \le a^{${data.n}} = ${lastTerm}\) — M-판정법의 숫자 (급수 장의 m-test 장면).`,
      en: String.raw`Partial sum \(W_{${data.n}}\) (\({data.n}\) terms): \(|W(x) - W_{${data.n}}(x)| \le \frac{a^{${data.n + 1}}}{1-a} = ${tail}\) for every \(x\), and the last term \(|a^{${data.n}}\cos(b^{${data.n}}\pi x)| \le a^{${data.n}} = ${lastTerm}\) — the M-test in numbers (the m-test scene in the series chapter).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`바이어슈트라스 함수 \(W\)는 모든 점에서 연속이지만 (\(a = \frac12\), \(b = 13\)은 \(ab = 6.5 > 1 + \frac{3\pi}{2}\)을 만족) 어떤 점에서도 미분가능하지 않습니다 — 매끄러운 코사인들의 균등 극한이 미분가능하지 않을 수 있다는 첫 번째 예입니다.`,
      en: String.raw`The Weierstrass function \(W\) is continuous at every point, yet differentiable at none (\(a = \frac12\), \(b = 13\) satisfy \(ab = 6.5 > 1 + \frac{3\pi}{2}\)) — the first example that a uniform limit of smooth cosines need not be differentiable.`,
    },
    lang,
  );
}

function createWeierstrassScene(): Scene<WeierstrassData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: WeierstrassData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !factsSlot || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { xs, vals, yMin, yMax, n } = data;
    const count = xs.length;

    g.selectAll('*').remove();

    const title = localize(
      {
        ko: `Wₙ(x) — ${n}개 항의 부분합 (슬라이더: 항 개수 n)`,
        en: `Wₙ(x) — partial sum of ${n} terms (slider: term count n)`,
      },
      lang,
    );

    g.append('text')
      .attr('x', 0)
      .attr('y', -46)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(title);

    const x = scaleLinear().domain([0, 1]).range([0, width]);
    const pad = (yMax - yMin) * 0.08 || 1;
    const y = scaleLinear()
      .domain([yMin - pad, yMax + pad])
      .range([height, 0]);

    g.append('g').call(axisLeft(y).ticks(6));
    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));

    const curve = line<number>()
      .x((_, i) => x(xs[i] ?? 0))
      .y((_, i) => y(vals[i] ?? 0));

    g.append('path')
      .datum(xs)
      .attr('d', curve)
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .style('stroke', 'var(--accent)');

    // Anchor dots: W_N(0) = 2 - (1/2)^n and W_N(1) = -(2 - (1/2)^n).
    for (const [px, pv, label] of [
      [0, vals[0] ?? 0, `Wₙ(0) = ${fmt(vals[0] ?? 0, 4)}`],
      [1, vals[count - 1] ?? 0, `Wₙ(1) = ${fmt(vals[count - 1] ?? 0, 4)}`],
    ] as const) {
      g.append('circle')
        .attr('cx', x(px))
        .attr('cy', y(pv))
        .attr('r', 4)
        .attr('fill', 'var(--accent)')
        .append('title')
        .text(label);
    }

    g.append('text')
      .attr('x', 8)
      .attr('y', height + 34)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(
        localize(
          {
            ko: `■ Wₙ(x) = Σ aᵏcos(bᵏπx) (k = 0..${n})`,
            en: `■ Wₙ(x) = Σ aᵏcos(bᵏπx) (k = 0..${n})`,
          },
          lang,
        ),
      );

    setRichText(factsSlot, factsText(data, lang));
    setRichText(verdictSlot, verdictText(lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      hostEl = host;
      host.style.display = 'flex';
      host.style.flexDirection = 'column';

      const chartWrap = document.createElement('div');
      chartWrap.style.cssText = 'flex: 1 1 auto; min-height: 0; position: relative;';
      const strips = document.createElement('div');
      strips.style.cssText = 'padding: 6px 12px 8px; font-size: 13px; flex: none;';
      const facts = document.createElement('div');
      facts.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      strips.append(facts, verdict);
      host.append(chartWrap, strips);

      factsSlot = createRichSlot(facts);
      verdictSlot = createRichSlot(verdict);
      wrap = chartWrap;
      chart = createChart(chartWrap, MARGIN);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      if (!chart || !wrap) return;
      chart.setSize(wrap.clientWidth || 640, wrap.clientHeight || 360);
      draw();
    },
    dispose() {
      chart?.destroy();
      chart = undefined;
      factsSlot = undefined;
      verdictSlot = undefined;
      wrap = undefined;
      if (hostEl) {
        hostEl.replaceChildren();
        hostEl.style.display = '';
        hostEl.style.flexDirection = '';
        hostEl = undefined;
      }
      last = undefined;
    },
  };
}

export default defineScene<WeierstrassData>({
  model: weierstrassModel,
  createScene: createWeierstrassScene,
});
