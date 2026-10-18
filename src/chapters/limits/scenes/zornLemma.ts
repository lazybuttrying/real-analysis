import { scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, type Chart, type SceneShell } from '../../../view/d3kit';
import { zornLemmaModel, type ZornLemmaData } from '../models/zornLemma';

/**
 * Tao, Analysis I, Lemma 8.5.15 (Zorn's lemma), live on the divisors-of-12
 * poset. The Hasse diagram uses a fixed rank layout (rank 0: {1};
 * rank 1: {2, 3}; rank 2: {4, 6}; rank 3: {12}). The slider picks one of the
 * three maximal chains, drawn in accent; its upper bounds get bound-colored
 * rings, and the maximal element 12 gets a star. The readout names the
 * chain, its upper bound(s), and the maximal element.
 */

const MARGIN = { top: 40, right: 20, bottom: 60, left: 20 };

/** Fixed Hasse rank layout: element -> [x, rank]. */
const POS: Readonly<Record<number, readonly [number, number]>> = {
  1: [0, 0],
  2: [-1, 1],
  3: [1, 1],
  4: [-1, 2],
  6: [1, 2],
  12: [0, 3],
};

const NODE_R = 16;
const RING_R = 23;

/** Points string for a 5-pointed star centered at (cx, cy). */
function starPoints(cx: number, cy: number, rOuter: number, rInner: number): string {
  const pts: string[] = [];
  for (let k = 0; k < 10; k++) {
    const r = k % 2 === 0 ? rOuter : rInner;
    const angle = (Math.PI / 5) * k - Math.PI / 2;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

function chainText(data: ZornLemmaData): string {
  return `\\{${data.selectedChain.join(', ')}\\}`;
}

function readoutText(data: ZornLemmaData, lang: Lang): string {
  const ub = `\\{${data.upperBounds.join(', ')}\\}`;
  return localize(
    {
      ko: String.raw`사슬 \(C_{${data.selected}} = ${chainText(data)}\)의 상한은 \( ${ub} \)이고, 극대원소 \(12\)가 존재합니다 — Zorn의 보조정리가 약속한 대로입니다.`,
      en: String.raw`The chain \(C_{${data.selected}} = ${chainText(data)}\) has upper bound(s) \( ${ub} \); the maximal element \(12\) exists — as Zorn's lemma promises.`,
    },
    lang,
  );
}

function captionText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`Zorn의 보조정리: 비어 있지 않은 부분순서집합에서 모든 사슬이 상한을 가지면 극대원소가 존재합니다. 이 유한 poset에서는 모든 사슬이 최대원소를 가져 상한 조건이 자동으로 성립합니다 (문제 2).`,
      en: String.raw`Zorn's lemma: in a nonempty poset where every chain has an upper bound, a maximal element exists. In this finite poset every chain has a greatest element, so the upper-bound hypothesis holds automatically (problem 2).`,
    },
    lang,
  );
}

function createZornLemmaScene(): Scene<ZornLemmaData> {
  let shell: SceneShell | undefined;
  let mainChart: Chart | undefined;
  let mainWrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let captionSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: ZornLemmaData; state: ControlState } | undefined;

  const drawMain = (data: ZornLemmaData): void => {
    if (!mainChart) return;
    const { g, width, height } = mainChart;
    g.selectAll('*').remove();

    const x = scaleLinear().domain([-1.7, 1.7]).range([0, width]);
    const y = scaleLinear().domain([-0.7, 3.7]).range([height, 0]);
    const px = (v: number): number => x(POS[v]?.[0] ?? 0);
    const py = (v: number): number => y(POS[v]?.[1] ?? 0);

    g.append('text')
      .attr('x', 0)
      .attr('y', -20)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: '12의 약수 poset의 Hasse diagram (약분가능성 순서)',
            en: 'Hasse diagram of the divisors-of-12 poset (divisibility order)',
          },
          lang,
        ),
      );

    const inChain = (v: number): boolean => data.selectedChain.includes(v);
    const isUpper = (v: number): boolean => data.upperBounds.includes(v);
    const isMaximal = (v: number): boolean => data.maximal.includes(v);

    // Cover edges: chain edges in accent, the rest muted.
    for (const [a, b] of data.covers) {
      const onChain = inChain(a) && inChain(b);
      g.append('line')
        .attr('x1', px(a))
        .attr('y1', py(a))
        .attr('x2', px(b))
        .attr('y2', py(b))
        .attr('stroke-width', onChain ? 3.5 : 1.5)
        .attr('stroke', onChain ? 'var(--accent)' : 'currentColor')
        .attr('opacity', onChain ? 1 : 0.3);
    }

    // Nodes: stars behind maximal elements, rings around upper bounds.
    for (const v of data.elements) {
      const cx = px(v);
      const cy = py(v);
      const selected = inChain(v);
      if (isMaximal(v)) {
        g.append('polygon')
          .attr('points', starPoints(cx, cy, 28, 12))
          .attr('fill', 'var(--bound)')
          .attr('opacity', 0.8);
      }
      if (isUpper(v)) {
        g.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', RING_R)
          .attr('fill', 'none')
          .attr('stroke', 'var(--bound)')
          .attr('stroke-width', 2.5)
          .attr('stroke-dasharray', '4 3');
      }
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', NODE_R)
        .attr('fill', selected ? 'var(--accent)' : 'none')
        .attr('stroke', selected ? 'var(--accent)' : 'currentColor')
        .attr('stroke-width', 1.5)
        .attr('opacity', selected ? 1 : 0.85);
      g.append('text')
        .attr('x', cx)
        .attr('y', cy + 1)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', 13)
        .attr('font-weight', 600)
        .attr('fill', selected ? '#fff' : 'currentColor')
        .text(String(v));
    }

    // Legend.
    const legendY = height + 34;
    g.append('text')
      .attr('x', 0)
      .attr('y', legendY)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: '— 선택된 사슬', en: '— selected chain' }, lang));
    g.append('text')
      .attr('x', width * 0.36)
      .attr('y', legendY)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(localize({ ko: '○ 상한', en: '○ upper bound(s)' }, lang));
    g.append('text')
      .attr('x', width * 0.68)
      .attr('y', legendY)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(localize({ ko: '★ 극대원소', en: '★ maximal element' }, lang));
  };

  const draw = (): void => {
    if (!last || !readoutSlot || !captionSlot) return;
    drawMain(last.data);
    setRichText(readoutSlot, readoutText(last.data, lang));
    setRichText(captionSlot, captionText(lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);

      mainWrap = shell.chartWrap;
      mainChart = createChart(mainWrap, MARGIN);

      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const caption = document.createElement('div');
      caption.style.marginTop = '4px';

      shell.strips.append(readout, caption);
      readoutSlot = createRichSlot(readout);
      captionSlot = createRichSlot(caption);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      if (mainChart && mainWrap) mainChart.setSize(mainWrap.clientWidth || 640, mainWrap.clientHeight || 300);
      draw();
    },
    dispose() {
      mainChart?.destroy();
      mainChart = undefined;
      readoutSlot = undefined;
      captionSlot = undefined;
      mainWrap = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<ZornLemmaData>({ model: zornLemmaModel, createScene: createZornLemmaScene });
