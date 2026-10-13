import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  stripInlineMath,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { epsdeltaModel, type EpsDeltaData, type EpsDeltaSample } from '../models/epsdelta';

/**
 * The epsilon-delta definition for f(x) = 2x at a = 1 (L = 2):
 * a horizontal epsilon band around L, a vertical delta band around a,
 * and a grid check that the implication really holds.
 */

interface RichSlot {
  el: HTMLElement;
  seq: number;
  text: string;
}

function makeSlot(el: HTMLElement): RichSlot {
  return { el, seq: 0, text: '' };
}

function setRich(slot: RichSlot, text: string): void {
  if (slot.text === text) return;
  slot.text = text;
  const id = ++slot.seq;
  slot.el.textContent = stripInlineMath(text);
  if (text.includes('\\(')) {
    import('../../../view/richtext')
      .then((module) => {
        if (slot.seq === id) module.renderRichText(slot.el, text);
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }
}

function createEpsDeltaScene(): Scene<EpsDeltaData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: EpsDeltaData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !readoutSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { a, l, epsilon, delta, samples, gridPass } = data;

    const x = scaleLinear().domain([0, 2]).range([0, width]);
    const y = scaleLinear().domain([-0.5, 4.5]).range([height, 0]);

    g.selectAll('*').remove();

    // The epsilon band around L.
    g.append('rect')
      .attr('x', 0)
      .attr('width', width)
      .attr('y', y(l + epsilon))
      .attr('height', Math.max(0, y(l - epsilon) - y(l + epsilon)))
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.12);
    // The delta band around a.
    g.append('rect')
      .attr('x', x(a - delta))
      .attr('width', Math.max(0, x(a + delta) - x(a - delta)))
      .attr('y', 0)
      .attr('height', height)
      .attr('fill', 'var(--bound)')
      .attr('opacity', 0.12);

    const curve = line<EpsDeltaSample>()
      .x((p) => x(p.x))
      .y((p) => y(p.fx));
    g.append('path').attr('d', curve(samples)).attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 2);

    // Target height L and the point a.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(l))
      .attr('y2', y(l))
      .attr('stroke', 'var(--bound)')
      .attr('stroke-dasharray', '5 4');
    g.append('line')
      .attr('x1', x(a))
      .attr('x2', x(a))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', 'var(--bound)')
      .attr('stroke-dasharray', '4 3');

    g.append('circle').attr('cx', x(a)).attr('cy', y(l)).attr('r', 4).attr('fill', 'var(--accent)');

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(4));
    g.append('g').call(axisLeft(y).ticks(5));

    setRich(
      readoutSlot,
      localize(
        {
          ko: String.raw`\(\varepsilon = ${fmt(epsilon)}\), \(\delta = \varepsilon/2 = ${fmt(delta)}\) — 격자 검사 ${gridPass ? '통과' : '실패'}: \(\lvert x-1\rvert < \delta\)인 모든 점에서 \(\lvert 2x-2\rvert < \varepsilon\)`,
          en: String.raw`\(\varepsilon = ${fmt(epsilon)}\), \(\delta = \varepsilon/2 = ${fmt(delta)}\) — grid check ${gridPass ? 'passes' : 'fails'}: every sampled point with \(\lvert x-1\rvert < \delta\) satisfies \(\lvert 2x-2\rvert < \varepsilon\)`,
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
      const definition = document.createElement('div');
      definition.style.cssText = 'font-size: 12px; color: var(--muted);';
      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      strips.append(definition, readout);
      host.append(chartWrap, strips);

      setRich(
        makeSlot(definition),
        localize(
          {
            ko: String.raw`정의: \(\forall\varepsilon > 0\ \exists\delta > 0\) s.t. \(0 < \lvert x - a\rvert < \delta \Rightarrow \lvert f(x) - L\rvert < \varepsilon\) (\(a = 1\), \(L = 2\))`,
            en: String.raw`Definition: \(\forall\varepsilon > 0\ \exists\delta > 0\) s.t. \(0 < \lvert x - a\rvert < \delta \Rightarrow \lvert f(x) - L\rvert < \varepsilon\) (\(a = 1\), \(L = 2\))`,
          },
          lang,
        ),
      );
      readoutSlot = makeSlot(readout);
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

export default defineScene<EpsDeltaData>({ model: epsdeltaModel, createScene: createEpsDeltaScene });
