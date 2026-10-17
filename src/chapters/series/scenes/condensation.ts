import { axisBottom, axisLeft, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, type Chart, type SceneShell } from '../../../view/d3kit';
import {
  condensationModel,
  type BlockData,
  type CondensationData,
  type CondSeries,
} from '../models/condensation';

/**
 * The Cauchy condensation test, live: the terms a_n as bars grouped into
 * dyadic blocks [2^n, 2^{n+1}). The slider highlights one block and the
 * strip below reports its block sum B_n against the condensed term
 * C_n = 2^n * a_{2^n}: the sandwich C_{n+1}/2 <= B_n <= C_n is what makes
 * sum a_n converge exactly when the condensed sum converges.
 */

const MARGIN = { top: 64, right: 20, bottom: 44, left: 56 };

function seriesFormula(series: CondSeries): string {
  switch (series) {
    case 'inv-n':
      return 'a_k = 1/k';
    case 'inv-n2':
      return 'a_k = 1/k^2';
    case 'inv-n-logn':
      return 'a_k = 1/(k ln k)';
  }
}

function factsText(data: CondensationData, lang: Lang): string {
  const { series, blockIndex, highlight } = data;
  const n = blockIndex;
  const lo = blockDataNext(data, n).condensed / 2;
  const b = highlight.blockSum.toFixed(4);
  const c = highlight.condensed.toFixed(4);
  if (series === 'inv-n-logn' && n === 0) {
    return localize(
      {
        ko: String.raw`블록 \([1, 2)\)는 \(a_1\)이 정의되지 않아(\(\ln 1 = 0\)) 비어 있습니다 — 응축 판정은 블록 1부터 적용합니다.`,
        en: String.raw`Block \([1, 2)\) is empty because \(a_1\) is undefined (\(\ln 1 = 0\)) — the condensation argument applies from block 1 onward.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`블록 \(n=${n}\) \([${highlight.start}, ${highlight.end + 1})\): 블록 합 \(B_{${n}} \approx ${b}\), 응축 항 \(C_{${n}} = 2^{${n}} \cdot a_{${highlight.start}} = ${c}\) — \(\frac{1}{2}C_{${n + 1}} = ${lo.toFixed(4)} \le ${b} \le ${c} = C_{${n}}\) 처럼 블록 합이 두 응축 항 사이에 끼어 있습니다.`,
      en: String.raw`Block \(n=${n}\) \([${highlight.start}, ${highlight.end + 1})\): block sum \(B_{${n}} \approx ${b}\), condensed term \(C_{${n}} = 2^{${n}} \cdot a_{${highlight.start}} = ${c}\) — \(\frac{1}{2}C_{${n + 1}} = ${lo.toFixed(4)} \le ${b} \le ${c} = C_{${n}}\): the block sum is sandwiched between condensed terms.`,
    },
    lang,
  );
}

/** Returns the block after block n in the full block list. */
function blockDataNext(data: CondensationData, n: number): BlockData {
  return data.blocks[n + 1] ?? data.blocks[data.blocks.length - 1] ?? data.highlight;
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`코시 응축 판정법: 감소하는 \(a_n \ge 0\)에 대해 \(\sum a_n\)은 \(\sum 2^n a_{2^n}\)과 운명을 같이합니다 — 한쪽이 수렴하면 다른 쪽도 수렴합니다.`,
      en: String.raw`Cauchy condensation test: for decreasing \(a_n \ge 0\), \(\sum a_n\) shares its fate with \(\sum 2^n a_{2^n}\) — one converges exactly when the other does.`,
    },
    lang,
  );
}

const X_TICKS: readonly number[] = [1, 2, 4, 8, 16, 32, 64, 128];
const X_LABELS: readonly string[] = ['1', '2', '4', '8', '16', '32', '64', '128'];

function createCondensationScene(): Scene<CondensationData> {
  let shell: SceneShell | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: CondensationData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !factsSlot || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { series, blockIndex, blocks, highlight, partialUpToBlock, condensedPartial } = data;

    g.selectAll('*').remove();

    const x = scaleLinear().domain([0.5, 128.5]).range([0, width]);
    let yMax = 0;
    for (const block of blocks) {
      for (const t of block.terms) yMax = Math.max(yMax, t);
    }
    if (yMax <= 0) yMax = 1;
    const y = scaleLinear().domain([0, yMax * 1.08]).range([height, 0]);

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
        { ko: `응축으로 보는 블록 합 — ${seriesFormula(series)}, 블록 n = ${blockIndex}`, en: `Block sums through condensation — ${seriesFormula(series)}, block n = ${blockIndex}` },
        lang,
      ),
    );
    header2.text(
      localize(
        {
          ko: `부분합 S_${highlight.end} ≈ ${partialUpToBlock.toFixed(4)} vs 응축 부분합 T_${blockIndex} ≈ ${condensedPartial.toFixed(4)} — 두 수열이 같이 수렴하거나 같이 발산합니다`,
          en: `Partial sum S_${highlight.end} ≈ ${partialUpToBlock.toFixed(4)} vs condensed partial sum T_${blockIndex} ≈ ${condensedPartial.toFixed(4)} — the two converge or diverge together`,
        },
        lang,
      ),
    );

    // Highlight backdrop over the selected dyadic block.
    g.append('rect')
      .attr('x', x(highlight.start))
      .attr('width', Math.max(0, x(highlight.end + 1) - x(highlight.start)))
      .attr('y', 0)
      .attr('height', height)
      .style('fill', 'var(--accent)')
      .attr('opacity', 0.08);

    // Dyadic block boundaries at 2^n, n = 1..6.
    for (let n = 1; n <= 6; n++) {
      const bx = x(2 ** n);
      g.append('line')
        .attr('x1', bx)
        .attr('x2', bx)
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', 'currentColor')
        .attr('stroke-dasharray', '3,3')
        .attr('opacity', 0.35);
    }

    // Term bars: one rect per term, accent for the highlighted block.
    for (const block of blocks) {
      const selected = block.index === blockIndex;
      for (let i = 0; i < block.terms.length; i++) {
        const k = block.start + i;
        const t = block.terms[i] ?? 0;
        g.append('rect')
          .attr('x', x(k) + 0.5)
          .attr('width', Math.max(0.5, x(k + 1) - x(k) - 1))
          .attr('y', y(t))
          .attr('height', Math.max(0, height - y(t)))
          .style('fill', 'var(--accent)')
          .attr('opacity', selected ? 0.9 : 0.22);
      }
    }

    // Legend.
    g.append('text')
      .attr('x', 8)
      .attr('y', height + 34)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: `■ 블록 n = ${blockIndex} [${highlight.start}, ${highlight.end + 1})`, en: `■ Block n = ${blockIndex} [${highlight.start}, ${highlight.end + 1})` }, lang));
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 34)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.6)
      .text(localize({ ko: '점선 = 블록 경계 2^n', en: 'dashed = block boundaries 2^n' }, lang));

    setRichText(factsSlot, factsText(data, lang));
    setRichText(verdictSlot, verdictText(lang));
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

export default defineScene<CondensationData>({ model: condensationModel, createScene: createCondensationScene });
