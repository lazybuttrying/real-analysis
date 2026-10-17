import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, type Chart } from '../../../view/d3kit';
import { ZETA2, eulerProductModel, type EulerProductData } from '../models/eulerProduct';

/**
 * The Euler product, live. The partial products P_k = prod_{i<=k} 1/(1-p_i^{-2})
 * climb toward the dashed asymptote zeta(2) = pi^2/6 ~ 1.6449. Each new prime
 * sieves out the terms divisible by it, so the product homes in on the zeta
 * sum. The slider moves k from 1 to 15.
 */

const MARGIN = { top: 48, right: 20, bottom: 40, left: 64 };

function readoutText(data: EulerProductData, lang: Lang): string {
  const { k, terms, product, error } = data;
  const lastPrime = terms[terms.length - 1]?.prime ?? 0;
  return localize(
    {
      ko: String.raw`\(k = ${k}\) (소수 \(p_{${k}} = ${lastPrime}\)까지): \(P_{${k}} = \prod_{i=1}^{${k}} \frac{1}{1 - p_i^{-2}} \approx ${product.toFixed(6)}\), 남은 오차 \(\zeta(2) - P_{${k}} \approx ${error.toFixed(6)}\) — 소수가 하나 추가될 때마다 곱셈이 \(1\)보다 큰 인자만큼 올라갑니다.`,
      en: String.raw`\(k = ${k}\) (through the prime \(p_{${k}} = ${lastPrime}\)): \(P_{${k}} = \prod_{i=1}^{${k}} \frac{1}{1 - p_i^{-2}} \approx ${product.toFixed(6)}\), remaining error \(\zeta(2) - P_{${k}} \approx ${error.toFixed(6)}\) — each new prime multiplies the product by a factor above \(1\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`체 아이디어: \(\zeta(s)(1 - 2^{-s})\)를 곱하면 짝수 항이 사라지고, \((1 - 3^{-s})\)를 곱하면 \(3\)의 배수가 사라집니다. 처음 \(k\)개 소수를 체로 걸러내면 \(p_1, \dots, p_k\)와 서로소인 정수만 남고, \(k \to \infty\)일 때 남는 꼬리 합이 \(0\)으로 가므로 \(\zeta(s) = \prod_{p} \frac{1}{1 - p^{-s}}\)입니다.`,
      en: String.raw`The sieve idea: \(\zeta(s)(1 - 2^{-s})\) kills the even terms, and \((1 - 3^{-s})\) kills the multiples of \(3\). Sieving through the first \(k\) primes leaves only integers coprime to \(p_1, \dots, p_k\); as \(k \to \infty\) the leftover tail sum vanishes, giving \(\zeta(s) = \prod_{p} \frac{1}{1 - p^{-s}}\).`,
    },
    lang,
  );
}

function createEulerProductScene(): Scene<EulerProductData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: EulerProductData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !readoutSlot || !verdictSlot) return;
    const { data } = last;
    const { k, terms, product } = data;

    // --- Partial products climbing toward the zeta(2) asymptote ---
    {
      const { g, width, height } = chart;
      g.selectAll('*').remove();
      const x = scaleLinear().domain([1, Math.max(2, k)]).range([0, width]);
      let lo = Math.min(product, 1.3);
      const hi = ZETA2 * 1.01;
      for (const t of terms) lo = Math.min(lo, t.product);
      const y = scaleLinear().domain([lo - 0.02, hi]).range([height, 0]);

      g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(Math.min(k, 15)));
      g.append('g').call(axisLeft(y).ticks(6));

      const header = g.append('text').attr('x', 0).attr('y', -32).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
      header.text(
        localize(
          { ko: `P_k = ∏ 1/(1 − p_i⁻²) — 점선 점근선 ζ(2) = π²/6 ≈ 1.6449를 향해 오릅니다`, en: `P_k = ∏ 1/(1 − p_i⁻²) — climbing toward the dashed asymptote ζ(2) = π²/6 ≈ 1.6449` },
          lang,
        ),
      );

      // Dashed asymptote at zeta(2).
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(ZETA2))
        .attr('y2', y(ZETA2))
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '6,4');
      g.append('text')
        .attr('x', width - 4)
        .attr('y', y(ZETA2) - 6)
        .attr('font-size', 12)
        .attr('text-anchor', 'end')
        .style('fill', 'var(--accent)')
        .text('ζ(2) = π²/6 ≈ 1.6449');

      // Partial product curve.
      const productLine = line<{ k: number; v: number }>()
        .x((d) => x(d.k))
        .y((d) => y(d.v));
      const pts = terms.map((t) => ({ k: t.k, v: t.product }));
      if (pts.length > 1) {
        g.append('path').datum(pts).attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 2).attr('d', productLine);
      }
      // Mark each prime step with a dot.
      for (const t of terms) {
        g.append('circle').attr('cx', x(t.k)).attr('cy', y(t.product)).attr('r', 3.5).style('fill', 'var(--accent)');
      }
      if (k >= 1) {
        g.append('circle').attr('cx', x(k)).attr('cy', y(product)).attr('r', 5).style('fill', 'var(--accent)');
      }

      g.append('text')
        .attr('x', 8)
        .attr('y', height + 32)
        .attr('font-size', 12)
        .style('fill', 'var(--accent)')
        .text(localize({ ko: '● P_k (체로 거른 소수 k개)', en: '● P_k (k sieved primes)' }, lang));
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 32)
        .attr('font-size', 12)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.7)
        .text(localize({ ko: '점선: ζ(2) = π²/6', en: 'Dashed: ζ(2) = π²/6' }, lang));
    }

    setRichText(readoutSlot, readoutText(data, lang));
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
      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';

      // Cross-link to the Basel scene (relative: ../basel/).
      const seeAlso = document.createElement('div');
      seeAlso.style.marginTop = '4px';
      const link = document.createElement('a');
      link.href = '../basel/';
      link.textContent = localize(
        { ko: '바젤 문제 씬 — ζ(2) = π²/6을 구하는 합 쪽 이야기', en: 'Basel problem scene — the sum side of ζ(2) = π²/6' },
        lang,
      );
      seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), link);

      strips.append(readout, verdict, seeAlso);
      host.append(chartWrap, strips);

      readoutSlot = createRichSlot(readout);
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
      chart.setSize(wrap.clientWidth || 640, wrap.clientHeight || 320);
      draw();
    },
    dispose() {
      chart?.destroy();
      chart = undefined;
      readoutSlot = undefined;
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

export default defineScene<EulerProductData>({ model: eulerProductModel, createScene: createEulerProductScene });
