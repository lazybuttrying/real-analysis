import { area, axisBottom, axisLeft, line, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, type Chart } from '../../../view/d3kit';
import { mTestModel, type MTestData } from '../models/mTest';

/**
 * The Weierstrass M-test, live: the partial sum S_N(x) = sum_{k<=N} sin(kx)/k^2
 * (accent) against the limit curve L(x) (faint) and the uniform error band
 * L(x) +/- tailBound(N) (accent, opacity 0.15). Dragging N tightens the band
 * the same amount at every x -- that uniform tightening is the point.
 */

const MARGIN = { top: 64, right: 20, bottom: 44, left: 56 };

function factsText(data: MTestData, lang: Lang): string {
  const { n, tailBound } = data;
  const tb = tailBound.toFixed(4);
  return localize(
    {
      ko: String.raw`\(N=${n}\): 모든 \(x\)에 대해 \(|S(x)-S_{${n}}(x)| \le \sum_{k>${n}} 1/k^2 \approx ${tb}\) — 하나의 상계가 모든 \(x\)에 통한다, 이게 균등수렴.`,
      en: String.raw`\(N=${n}\): for every \(x\), \(|S(x)-S_{${n}}(x)| \le \sum_{k>${n}} 1/k^2 \approx ${tb}\) — one bound for all \(x\): that is uniform convergence.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`바이에르슈트라스 M-판정법: 모든 \(x\)에 대해 \(|f_n(x)| \le M_n\)이고 \(\sum M_n < \infty\)이면 \(\sum f_n\)은 균등수렴한다. 여기서는 \(M_n = 1/n^2\), \(\sum M_n = \pi^2/6 \approx 1.6449\).`,
      en: String.raw`Weierstrass M-test: if \(|f_n(x)| \le M_n\) for all \(x\) and \(\sum M_n < \infty\), then \(\sum f_n\) converges uniformly. Here \(M_n = 1/n^2\) and \(\sum M_n = \pi^2/6 \approx 1.6449\).`,
    },
    lang,
  );
}

const X_TICKS: readonly number[] = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI];
const X_LABELS: readonly string[] = ['0', 'π/2', 'π', '3π/2', '2π'];

function createMTestScene(): Scene<MTestData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: MTestData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !factsSlot || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { n, xs, partial, limit, tailBound } = data;

    g.selectAll('*').remove();

    const x = scaleLinear().domain([0, 2 * Math.PI]).range([0, width]);
    const upper: number[] = new Array<number>(xs.length);
    const lower: number[] = new Array<number>(xs.length);
    let yMin = Infinity;
    let yMax = -Infinity;
    for (let i = 0; i < xs.length; i++) {
      const li = limit[i] ?? 0;
      upper[i] = li + tailBound;
      lower[i] = li - tailBound;
      yMin = Math.min(yMin, upper[i] ?? Infinity, lower[i] ?? Infinity);
      yMax = Math.max(yMax, upper[i] ?? -Infinity, lower[i] ?? -Infinity);
    }
    const pad = (yMax - yMin) * 0.08 || 0.05;
    const y = scaleLinear().domain([yMin - pad, yMax + pad]).range([height, 0]);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        axisBottom(x)
          .tickValues([...X_TICKS])
          .tickFormat((d) => X_LABELS[X_TICKS.indexOf(Number(d))] ?? ''),
      );
    g.append('g').call(axisLeft(y).ticks(6));

    const header1 = g.append('text').attr('x', 0).attr('y', -48).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
    const header2 = g.append('text').attr('x', 0).attr('y', -26).attr('font-size', 12).attr('fill', 'currentColor').attr('opacity', 0.75);
    header1.text(
      localize(
        { ko: `S(x) = Σ sin(kx)/k² — N = ${n}인 부분합과 균등 오차 밴드`, en: `S(x) = Σ sin(kx)/k² — partial sum with N = ${n} and the uniform error band` },
        lang,
      ),
    );
    header2.text(
      localize(
        { ko: `S_${n}(x) (진한 선), 한계곡선 L(x) (옅은 선), 밴드 L(x) ± ${tailBound.toFixed(4)}`, en: `S_${n}(x) (bold), limit curve L(x) (faint), band L(x) ± ${tailBound.toFixed(4)}` },
        lang,
      ),
    );

    // Uniform error band: limit +/- tailBound, filled once, independent of x.
    const band = area<number>()
      .x((_, i) => x(xs[i] ?? 0))
      .y0((_, i) => y(lower[i] ?? 0))
      .y1((_, i) => y(upper[i] ?? 0));
    g.append('path')
      .datum(xs)
      .attr('d', band)
      .style('fill', 'var(--accent)')
      .attr('opacity', 0.15);

    // Limit curve, drawn faintly underneath.
    const limitLine = line<number>()
      .x((_, i) => x(xs[i] ?? 0))
      .y((_, i) => y(limit[i] ?? 0));
    g.append('path')
      .datum(xs)
      .attr('d', limitLine)
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.35);

    // The partial sum S_N, the curve the band is squeezing.
    const partialLine = line<number>()
      .x((_, i) => x(xs[i] ?? 0))
      .y((_, i) => y(partial[i] ?? 0));
    g.append('path')
      .datum(xs)
      .attr('d', partialLine)
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)');

    // Legend.
    g.append('text')
      .attr('x', 8)
      .attr('y', height + 34)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: `■ S_${n}(x) 부분합`, en: `■ S_${n}(x) partial sum` }, lang));
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 34)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.6)
      .text(localize({ ko: '─ L(x) 한계곡선 · 밴드 = 균등 오차', en: '─ L(x) limit · band = uniform error' }, lang));

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

export default defineScene<MTestData>({ model: mTestModel, createScene: createMTestScene });
