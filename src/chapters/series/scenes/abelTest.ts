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
import { abelTestModel, type AbelTestData } from '../models/abelTest';

/**
 * Abel's test: sum a_n converges and (b_n) monotone bounded => sum a_n b_n converges.
 * The gold partial sums S_N settle onto the dashed limit line while the thin
 * accent curve shows the weight b_k - monotone, bounded, but NOT tending to 0
 * (b_k -> 2 for 'shifted', b_k -> 1 for 'scaled'). That is exactly why
 * Dirichlet's test cannot be applied directly, and why Abel's test is needed.
 */

const GOLD = '#d9930d';
const MARGIN = { top: 56, right: 20, bottom: 40, left: 56 };

function factsText(data: AbelTestData, lang: Lang): string {
  const { example, n, partialSums, weights, bLimit, limit } = data;
  const last = partialSums[partialSums.length - 1] ?? 0;
  const b1 = weights[0] ?? 0;
  const bn = weights[weights.length - 1] ?? 0;
  const terms =
    example === 'shifted'
      ? { ko: 'a_k=(-1)^k/k', en: 'a_k=(-1)^k/k' }
      : { ko: 'a_k=(-1)^k/√k', en: 'a_k=(-1)^k/sqrt(k)' };
  return localize(
    {
      ko: String.raw`\(N = ${n}\), \(a_k = ${localize(terms, lang)}\)의 부분합은 수렴하고, 가중치 \(b_k\)는 \(b_1 = ${fmt(b1, 4)} \to b_${n} = ${fmt(bn, 4)} \to ${fmt(bLimit, 0)}\)로 단조·유계이나 \(0\)으로 가지 않는다 — 그래서 디리클레 판정법은 직접 적용할 수 없지만, 아벨 판정법으로 \(S_N \to ${fmt(limit, 4)}\)를 얻는다(현재 \(S_N = ${fmt(last, 4)}\)).`,
      en: String.raw`\(N = ${n}\): the partial sums of \(a_k = ${localize(terms, lang)}\) converge, and the weight \(b_k\) is monotone and bounded with \(b_1 = ${fmt(b1, 4)} \to b_${n} = ${fmt(bn, 4)} \to ${fmt(bLimit, 0)}\), never tending to \(0\) — so Dirichlet's test does not apply directly, but Abel's test gives \(S_N \to ${fmt(limit, 4)}\) (currently \(S_N = ${fmt(last, 4)}\)).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`아벨 판정법: \(\sum a_n\)이 수렴하고 \((b_n)\)이 단조·유계이면 \(\sum a_n b_n\)도 수렴한다 — 디리클레 판정법에서 “\(b_n \to 0\)” 조건을 “유계”로 바꾼 짝꿍.`,
      en: String.raw`Abel's test: if \(\sum a_n\) converges and \((b_n)\) is monotone and bounded, then \(\sum a_n b_n\) converges — the companion to Dirichlet's test, with "\(b_n \to 0\)" replaced by "bounded".`,
    },
    lang,
  );
}

function createAbelTestScene(): Scene<AbelTestData> {
  let chart: Chart | undefined;
  let shell: SceneShell | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: AbelTestData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { n, example, partialSums, weights, limit, limitExact } = data;
    g.selectAll('*').remove();

    const allValues = [...partialSums, ...weights, limit];
    const lo = Math.min(...allValues);
    const hi = Math.max(...allValues);
    const pad = Math.max(0.2, (hi - lo) * 0.08);
    const xScale = scaleLinear().domain([1, n]).range([0, width]);
    const yScale = scaleLinear()
      .domain([lo - pad, hi + pad])
      .range([height, 0]);

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(xScale).ticks(8));
    g.append('g').call(axisLeft(yScale).ticks(6));

    g.append('text')
      .attr('x', 0)
      .attr('y', -36)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `N = ${n}    S_N = ${fmt(partialSums[partialSums.length - 1] ?? 0, 4)} → ${fmt(limit, 4)}${limitExact ? ' (정확값)' : ' (수치 근사)'}`,
            en: `N = ${n}    S_N = ${fmt(partialSums[partialSums.length - 1] ?? 0, 4)} → ${fmt(limit, 4)}${limitExact ? ' (exact)' : ' (numerical estimate)'}`,
          },
          lang,
        ),
      );

    // Limit band: the horizontal target the weighted sums settle onto.
    g.append('line')
      .attr('x1', xScale(1))
      .attr('x2', xScale(n))
      .attr('y1', yScale(limit))
      .attr('y2', yScale(limit))
      .attr('stroke-dasharray', '6 4')
      .attr('stroke-width', 2)
      .style('stroke', GOLD);
    g.append('text')
      .attr('x', xScale(n) - 4)
      .attr('y', yScale(limit) - 8)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', GOLD)
      .text(
        example === 'shifted'
          ? `−2 ln 2 − π²/12 = ${fmt(limit, 3)}`
          : localize(
              { ko: `극한 ≈ ${fmt(limit, 3)}`, en: `limit ≈ ${fmt(limit, 3)}` },
              lang,
            ),
      );

    // Weight sequence b_k: monotone and bounded, hovering away from 0.
    const weightLine = line<{ k: number; v: number }>()
      .x((p) => xScale(p.k))
      .y((p) => yScale(p.v));
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 1.8)
      .attr('stroke-dasharray', '4 3')
      .style('stroke', 'var(--accent)')
      .attr('opacity', 0.8)
      .attr('d', weightLine(weights.map((v, i) => ({ k: i + 1, v }))) ?? '');
    const bFirst = weights[0] ?? 0;
    g.append('text')
      .attr('x', xScale(1))
      .attr('y', yScale(bFirst) - 8)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: `b_k (단조·유계, 0으로 안 감)`, en: `b_k (monotone, bounded, ↛ 0)` }, lang));

    // Settling weighted partial sums.
    const settle = line<{ k: number; v: number }>()
      .x((p) => xScale(p.k))
      .y((p) => yScale(p.v));
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', GOLD)
      .attr('d', settle(partialSums.map((v, i) => ({ k: i + 1, v }))) ?? '');
    const step = Math.max(1, Math.floor(n / 60));
    partialSums.forEach((v, i) => {
      const isLast = i === partialSums.length - 1;
      if (!isLast && i % step !== 0) return;
      g.append('circle')
        .attr('cx', xScale(i + 1))
        .attr('cy', yScale(v))
        .attr('r', isLast ? 5 : 2.6)
        .style('fill', GOLD)
        .attr('opacity', isLast ? 1 : 0.55);
    });

    g.append('text')
      .attr('x', 0)
      .attr('y', height - 6)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(
        localize(
          { ko: '점선: b_k — 단조·유계이나 0으로 가지 않음', en: 'Dashed: b_k — monotone and bounded, but not → 0' },
          lang,
        ),
      );
    g.append('text')
      .attr('x', width)
      .attr('y', height - 6)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', GOLD)
      .text(localize({ ko: '금색: S_N = Σ a_k b_k (수렴)', en: 'Gold: S_N = Σ a_k b_k (converging)' }, lang));

    if (factsSlot && verdictSlot) {
      setRichText(factsSlot, factsText(data, lang));
      setRichText(verdictSlot, verdictText(lang));
    }
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
      chart = createChart(chartWrap, MARGIN);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize(width, height) {
      chart?.setSize(width, height);
      draw();
    },
    dispose() {
      chart?.destroy();
      chart = undefined;
      factsSlot = undefined;
      verdictSlot = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<AbelTestData>({ model: abelTestModel, createScene: createAbelTestScene });
