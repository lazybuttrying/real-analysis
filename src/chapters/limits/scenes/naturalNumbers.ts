import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, type Chart } from '../../../view/d3kit';
import { naturalNumbersModel, type NaturalNumbersData } from '../models/natural-numbers';

/**
 * Mathematical induction as falling dominoes. P(1) (the base case) is the
 * first domino, shown in accent color; the chain P(k) => P(k+1) means every
 * fallen domino knocks the next one over, so all n dominoes fall.
 */

function factsText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`P(1) 쓰러지고, \(P(k) \Rightarrow P(k+1)\) — 모든 도미노가 쓰러진다.`,
      en: String.raw`\(P(1)\) falls, and \(P(k) \Rightarrow P(k+1)\) — every domino falls.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`귀납 원리: \(P(1)\)이 참이고 \(P(k) \Rightarrow P(k+1)\)이면, 모든 자연수 \(n\)에 대해 \(P(n)\)이 참이다.`,
      en: String.raw`The induction principle: if \(P(1)\) holds and \(P(k) \Rightarrow P(k+1)\), then \(P(n)\) holds for every natural number \(n\).`,
    },
    lang,
  );
}

function createNaturalNumbersScene(): Scene<NaturalNumbersData> {
  let chart: Chart | undefined;
  let hostEl: HTMLElement | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: NaturalNumbersData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { dominoes } = data;
    const n = dominoes.length;

    g.selectAll('*').remove();

    const baseline = height - 44;
    const slotW = width / Math.max(1, n);
    const dw = Math.min(40, slotW * 0.5);
    const dh = Math.min(150, Math.max(60, (height - 120) * 0.6));
    const angle = -72;

    // ground line
    g.append('line')
      .attr('x1', 4)
      .attr('x2', width - 4)
      .attr('y1', baseline)
      .attr('y2', baseline)
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.35);

    dominoes.forEach((domino, i) => {
      const cx = slotW * (i + 0.5);
      const cy = baseline - dh * 0.18;
      const isBase = i === 0;

      // fallen domino: a rounded rectangle rotated nearly flat
      g.append('rect')
        .attr('x', cx - dw / 2)
        .attr('y', cy - dh / 2)
        .attr('width', dw)
        .attr('height', dh)
        .attr('rx', 7)
        .attr('transform', `rotate(${angle} ${cx} ${cy})`)
        .attr('fill', isBase ? 'var(--accent)' : 'currentColor')
        .attr('opacity', isBase ? 0.95 : 0.28);

      // label P(k) under each domino
      g.append('text')
        .attr('x', cx)
        .attr('y', baseline + 22)
        .attr('text-anchor', 'middle')
        .attr('font-size', 13)
        .attr('font-weight', isBase ? '700' : '400')
        .attr('fill', isBase ? 'var(--accent)' : 'currentColor')
        .text(domino.label);

      // implication arrow P(k) => P(k+1) between consecutive dominoes
      if (i < n - 1) {
        const arrowX = slotW * (i + 1);
        g.append('text')
          .attr('x', arrowX)
          .attr('y', cy - dh * 0.32)
          .attr('text-anchor', 'middle')
          .attr('font-size', 14)
          .attr('font-weight', '700')
          .attr('fill', 'var(--accent)')
          .text('⇒');
      }
    });

    // base-case marker above the first domino
    const firstCx = slotW * 0.5;
    g.append('text')
      .attr('x', firstCx)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', '700')
      .attr('fill', 'var(--accent)')
      .text(localize({ ko: 'P(1): 먼저 쓰러뜨린다 (기저)', en: 'P(1): knocked over first (base case)' }, lang));

    if (factsSlot && verdictSlot) {
      setRichText(factsSlot, factsText(lang));
      setRichText(verdictSlot, verdictText(lang));
    }
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
      chart = createChart(chartWrap);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize(_width, _height) {
      chart?.setSize(_width, _height);
      draw();
    },
    dispose() {
      chart?.destroy();
      chart = undefined;
      factsSlot = undefined;
      verdictSlot = undefined;
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

export default defineScene<NaturalNumbersData>({ model: naturalNumbersModel, createScene: createNaturalNumbersScene });
