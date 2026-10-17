import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, fmt, type Chart, type SceneShell } from '../../../view/d3kit';
import {
  alternatingAbsBound,
  cauchyProductModel,
  type CauchyProductData,
} from '../models/cauchyProduct';

/**
 * The Cauchy product, live. Top panel: the Cauchy-product partial sums
 * C_N = sum_{n<=N} c_n against the ordinary product of partial sums
 * A_N * B_N. For the 'exp' pair both lines climb together to e^2 (Mertens'
 * theorem in action); for the 'alternating' pair C_N wanders while
 * |c_n| >= 1 keeps it from ever settling. Bottom strip: the a_k * b_j
 * lattice, where c_n is the sum along the k + j = n diagonal (highlighted).
 */

const MARGIN = { top: 64, right: 20, bottom: 44, left: 64 };

function pairName(data: CauchyProductData, lang: Lang): string {
  return data.pair === 'exp'
    ? localize(
        {
          ko: String.raw`\(a_k = b_k = 1/k!\)`,
          en: String.raw`\(a_k = b_k = 1/k!\)`,
        },
        lang,
      )
    : localize(
        {
          ko: String.raw`\(a_k = b_k = (-1)^k/\sqrt{k+1}\)`,
          en: String.raw`\(a_k = b_k = (-1)^k/\sqrt{k+1}\)`,
        },
        lang,
      );
}

function factsText(data: CauchyProductData, lang: Lang): string {
  const { n, pair, terms, partials, prodPartials } = data;
  const cN = terms[n] ?? 0;
  const CN = partials[n] ?? 0;
  const PN = prodPartials[n] ?? 0;
  if (pair === 'exp') {
    return localize(
      {
        ko: String.raw`${pairName(data, lang)}: \(c_{${n}} = 2^{${n}}/${n}! = ${fmt(cN, 6)}\), \(C_{${n}} = ${fmt(CN, 6)}\), \(A_{${n}}B_{${n}} = ${fmt(PN, 6)}\) — 두 수열이 나란히 \(e^2 \approx 7.389056\)으로 올라갑니다.`,
        en: String.raw`${pairName(data, lang)}: \(c_{${n}} = 2^{${n}}/${n}! = ${fmt(cN, 6)}\), \(C_{${n}} = ${fmt(CN, 6)}\), \(A_{${n}}B_{${n}} = ${fmt(PN, 6)}\) — the two sequences climb side by side to \(e^2 \approx 7.389056\).`,
      },
      lang,
    );
  }
  const bound = alternatingAbsBound(n);
  return localize(
    {
      ko: String.raw`${pairName(data, lang)}: \(|c_{${n}}| = ${fmt(Math.abs(cN), 6)} \geq ${fmt(bound, 4)} \geq 1\), \(C_{${n}} = ${fmt(CN, 6)}\), \(A_{${n}}B_{${n}} = ${fmt(PN, 6)}\) — \(c_n \not\to 0\)이므로 코시 곱은 발산합니다.`,
      en: String.raw`${pairName(data, lang)}: \(|c_{${n}}| = ${fmt(Math.abs(cN), 6)} \geq ${fmt(bound, 4)} \geq 1\), \(C_{${n}} = ${fmt(CN, 6)}\), \(A_{${n}}B_{${n}} = ${fmt(PN, 6)}\) — since \(c_n \not\to 0\), the Cauchy product diverges.`,
    },
    lang,
  );
}

function verdictText(data: CauchyProductData, lang: Lang): string {
  if (data.pair === 'exp') {
    return localize(
      {
        ko: String.raw`메르텐스 정리: 한 급수가 절대수렴하고 다른 급수가 수렴하면 코시 곱은 \(AB\)로 수렴합니다. 위에서는 \(c_n = 2^n/n!\)이므로 \(C_N = \sum_{n \leq N} 2^n/n! \to e^2\)입니다.`,
        en: String.raw`Mertens' theorem: if one series converges absolutely and the other converges, the Cauchy product converges to \(AB\). Above, \(c_n = 2^n/n!\), so \(C_N = \sum_{n \leq N} 2^n/n! \to e^2\).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`반례: 두 급수 모두 라이프니츠 판정법으로 수렴하지만 \(|c_n| \geq \frac{2(n+1)}{n+2} \geq 1\)이므로 \(c_n \not\to 0\)이고 코시 곱 \(\sum c_n\)은 발산합니다 — 메르텐스 정리에서 절대수렴 조건은 필수입니다.`,
      en: String.raw`Counterexample: both series converge by Leibniz's test, yet \(|c_n| \geq \frac{2(n+1)}{n+2} \geq 1\), so \(c_n \not\to 0\) and the Cauchy product \(\sum c_n\) diverges — absolute convergence is essential in Mertens' theorem.`,
    },
    lang,
  );
}

function createCauchyProductScene(): Scene<CauchyProductData> {
  let shell: SceneShell | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: CauchyProductData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !factsSlot || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { n, partials, prodPartials, limit, lattice, terms } = data;

    g.selectAll('*').remove();

    const topH = Math.max(150, Math.floor((height - 40) * 0.6));
    const gapY = 40;
    const botH = Math.max(70, height - topH - gapY);
    const topG = g.append('g');
    const botG = g.append('g').attr('transform', `translate(0,${topH + gapY})`);

    const xTop = scaleLinear().domain([0, Math.max(1, n)]).range([0, width]);

    const topTitle = localize(
      {
        ko: '코시 곱 부분합 C_N vs A_N·B_N',
        en: 'Cauchy-product partial sums C_N vs A_N·B_N',
      },
      lang,
    );
    const botTitle = localize(
      {
        ko: 'a_k·b_j 격자 — c_n은 k+j=n 대각선의 합 (강조된 대각선)',
        en: 'The a_k·b_j lattice — c_n is the sum along the k+j=n diagonal (highlighted)',
      },
      lang,
    );

    topG
      .append('text')
      .attr('x', 0)
      .attr('y', -50)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(topTitle);
    botG
      .append('text')
      .attr('x', 0)
      .attr('y', -26)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(botTitle);

    // ---- Top panel: C_N and A_N * B_N against N. ----
    let yLo = Infinity;
    let yHi = -Infinity;
    for (let i = 0; i <= n; i++) {
      const c = partials[i] ?? 0;
      const p = prodPartials[i] ?? 0;
      yLo = Math.min(yLo, c, p);
      yHi = Math.max(yHi, c, p);
    }
    if (limit !== null) {
      yLo = Math.min(yLo, limit);
      yHi = Math.max(yHi, limit);
    }
    const yPad = (yHi - yLo) * 0.1 || 1;
    const yTop = scaleLinear().domain([yLo - yPad, yHi + yPad]).range([topH, 0]);

    topG.append('g').call(axisLeft(yTop).ticks(5));
    topG
      .append('g')
      .attr('transform', `translate(0,${topH})`)
      .call(axisBottom(xTop).ticks(Math.min(10, n + 1)));

    if (limit !== null) {
      topG
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yTop(limit))
        .attr('y2', yTop(limit))
        .attr('stroke', 'var(--muted)')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '6 4')
        .attr('opacity', 0.8);
      topG
        .append('text')
        .attr('x', width - 4)
        .attr('y', yTop(limit) - 6)
        .attr('font-size', 12)
        .attr('text-anchor', 'end')
        .attr('fill', 'var(--muted)')
        .text(`e² ≈ ${fmt(limit, 6)}`);
    }

    const seqLine = (vals: readonly number[]) =>
      line<number>()
        .x((_, i) => xTop(i))
        .y((_, i) => yTop(vals[i] ?? 0));

    topG
      .append('path')
      .datum(prodPartials)
      .attr('d', seqLine(prodPartials))
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .style('stroke', 'var(--bound)');
    topG
      .append('path')
      .datum(partials)
      .attr('d', seqLine(partials))
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)');

    // End dots at N = n.
    topG
      .append('circle')
      .attr('cx', xTop(n))
      .attr('cy', yTop(partials[n] ?? 0))
      .attr('r', 4)
      .attr('fill', 'var(--accent)')
      .append('title')
      .text(`C_${n} = ${fmt(partials[n] ?? 0, 8)}`);
    topG
      .append('circle')
      .attr('cx', xTop(n))
      .attr('cy', yTop(prodPartials[n] ?? 0))
      .attr('r', 4)
      .attr('fill', 'var(--bound)')
      .append('title')
      .text(`A_${n}·B_${n} = ${fmt(prodPartials[n] ?? 0, 8)}`);

    topG
      .append('text')
      .attr('x', 8)
      .attr('y', topH + 34)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: '■ C_N (코시 곱 부분합)', en: '■ C_N (Cauchy-product partial sums)' }, lang));
    topG
      .append('text')
      .attr('x', width / 2)
      .attr('y', topH + 34)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(localize({ ko: '■ A_N·B_N (부분합의 곱)', en: '■ A_N·B_N (product of partial sums)' }, lang));

    // ---- Bottom strip: the a_k * b_j lattice; c_d = sum of the k+j=d diagonal. ----
    const cell = Math.min(width / (n + 1), botH / (n + 1));
    const ox = (width - cell * (n + 1)) / 2;
    const oy = (botH - cell * (n + 1)) / 2;
    let maxAbs = 0;
    for (const c of lattice) maxAbs = Math.max(maxAbs, Math.abs(c.value));
    const scale = maxAbs > 0 ? maxAbs : 1;

    for (const c of lattice) {
      const fill = c.value >= 0 ? 'var(--accent)' : 'var(--bound)';
      botG
        .append('rect')
        .attr('x', ox + c.k * cell)
        .attr('y', oy + (n - c.j) * cell)
        .attr('width', cell - 0.75)
        .attr('height', cell - 0.75)
        .attr('fill', fill)
        .attr('opacity', 0.12 + 0.78 * (Math.abs(c.value) / scale))
        .attr('stroke', c.d === n ? 'currentColor' : 'none')
        .attr('stroke-width', c.d === n ? 1.25 : 0)
        .append('title')
        .text(
          `a_${c.k}·b_${c.j} = ${fmt(c.value, 6)} (k+j=${c.d}, c_${c.d} = ${fmt(terms[c.d] ?? 0, 6)})`,
        );
    }
    // k and j axis labels.
    botG
      .append('text')
      .attr('x', ox + ((n + 1) * cell) / 2)
      .attr('y', botH + 26)
      .attr('font-size', 12)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--muted)')
      .text('k →');
    botG
      .append('text')
      .attr('x', ox - 14)
      .attr('y', oy + ((n + 1) * cell) / 2)
      .attr('font-size', 12)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--muted)')
      .text('↑ j');

    setRichText(factsSlot, factsText(data, lang));
    setRichText(verdictSlot, verdictText(data, lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);
      const chartWrap = shell.chartWrap;
      const strips = shell.strips;
      const facts = document.createElement('div');
      facts.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      strips.append(facts, verdict);

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
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<CauchyProductData>({
  model: cauchyProductModel,
  createScene: createCauchyProductScene,
});
