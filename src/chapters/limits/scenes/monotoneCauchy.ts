import { axisBottom, axisLeft, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { monotoneCauchyModel, type MonotoneCauchyData } from '../models/monotoneCauchy';

/**
 * The monotone sequence a_n = 1 - 2^(-n) rising to its supremum 1.
 * The tail region [tailN, 12] is highlighted and its diameter readout
 * shrinks to 0: the sequence is Cauchy.
 */

function createMonotoneCauchyScene(): Scene<MonotoneCauchyData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: MonotoneCauchyData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !readoutSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { n, tailN, maxIndex, terms, aN, tailDiameter, sup } = data;

    const x = scaleLinear().domain([0, maxIndex + 1]).range([0, width]);
    const y = scaleLinear().domain([0, 1.15]).range([height, 0]);

    g.selectAll('*').remove();

    // The highlighted tail region.
    g.append('rect')
      .attr('x', x(tailN - 0.5))
      .attr('width', Math.max(0, x(maxIndex + 0.5) - x(tailN - 0.5)))
      .attr('y', 0)
      .attr('height', height)
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.08);

    // The supremum line y = 1.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(sup))
      .attr('y2', y(sup))
      .attr('stroke', 'var(--bound)')
      .attr('stroke-dasharray', '5 4');

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(12));
    g.append('g').call(axisLeft(y).ticks(5));

    // Sequence points: the tail glows, the head stays gray.
    for (const term of terms) {
      const inTail = term.k >= tailN;
      g.append('circle')
        .attr('cx', x(term.k))
        .attr('cy', y(term.value))
        .attr('r', inTail ? 4 : 2.6)
        .attr('fill', inTail ? 'var(--accent)' : 'currentColor')
        .attr('opacity', inTail ? 1 : 0.45);
    }

    g.append('text')
      .attr('x', width - 8)
      .attr('y', y(sup) - 8)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', 'var(--bound)')
      .text(localize({ ko: '상한 1', en: 'sup 1' }, lang));

    setRichText(
      readoutSlot,
      localize(
        {
          ko: String.raw`\(a_{${n}} = ${fmt(aN)}\) — 꼬리 지름(항 \( \geq ${tailN}\)): \( ${fmt(tailDiameter)} \)`,
          en: String.raw`\(a_{${n}} = ${fmt(aN)}\) — tail diameter (terms \( \geq ${tailN}\)): \( ${fmt(tailDiameter)} \)`,
        },
        lang,
      ),
    );
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
      const legend = document.createElement('div');
      legend.style.cssText = 'font-size: 12px; color: var(--muted);';
      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      strips.append(legend, readout);
      host.append(chartWrap, strips);

      setRichText(
        createRichSlot(legend),
        localize(
          {
            ko: String.raw`\(a_n = 1 - 2^{-n}\) — 단조증가, 위로 유계, 극한 \(\sup = 1\); 꼬리 지름이 \(0\)으로 갑니다`,
            en: String.raw`\(a_n = 1 - 2^{-n}\) — increasing, bounded above, limit \(\sup = 1\); the tail diameter goes to \(0\)`,
          },
          lang,
        ),
      );
      readoutSlot = createRichSlot(readout);
      wrap = chartWrap;
      chart = createChart(chartWrap);
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
      readoutSlot = undefined;
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

export default defineScene<MonotoneCauchyData>({ model: monotoneCauchyModel, createScene: createMonotoneCauchyScene });
