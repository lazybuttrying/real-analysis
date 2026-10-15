import { axisBottom, scaleLinear } from 'd3';
import { defineScene, localize, stripInlineMath, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { measureModel, type MeasureData } from '../models/measure';

/**
 * Outer measure as the cheapest countable interval cover. The number line
 * [0,1] shows every cover interval as a translucent band; the readout reports
 * the total cover length and the bound m* <= total it witnesses:
 * a singleton costs eps (hence 0 in the limit), the rationals cost
 * eps(1 - 2^{-K}) < eps (hence 0 too), and [0,1] itself costs 1.
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

function readoutText(data: MeasureData, lang: Lang): string {
  const { target, eps, K, totalLength } = data;
  // Float64 rounds the total up to eps when K > 53; keep the printed relation true.
  const rel = totalLength < eps ? '<' : '\\le';
  if (target === 'interval') {
    const ko = String.raw`덮개 총길이 \(L = ${fmt(totalLength, 5)}\) — 알려진 사실: \(m^*([0,1]) = 1\)입니다. 가산 가법성은 Carathéodory 구성 너머의 이야기입니다 (아이디어 수준).`;
    const en = String.raw`Cover total \(L = ${fmt(totalLength, 5)}\) — known fact: \(m^*([0,1]) = 1\). Countable additivity needs the Carathéodory construction (idea level only).`;
    return localize({ ko, en }, lang);
  }
  if (target === 'singleton') {
    const ko = String.raw`덮개 총길이 \(L = \varepsilon = ${fmt(eps, 3)}\) — 따라서 \(m^*(\{0.5\}) \le \varepsilon\). \(\varepsilon \to 0^+\)이므로 \(m^* = 0\)입니다.`;
    const en = String.raw`Cover total \(L = \varepsilon = ${fmt(eps, 3)}\) — so \(m^*(\{0.5\}) \le \varepsilon\). Letting \(\varepsilon \to 0^+\) gives \(m^* = 0\).`;
    return localize({ ko, en }, lang);
  }
  const ko = String.raw`덮개 총길이 \(L = \sum_{k=1}^{${K}}\varepsilon/2^k = ${fmt(totalLength, 5)} ${rel} \varepsilon = ${fmt(eps, 3)}\) — 따라서 \(m^*(\mathbb{Q}\cap[0,1]) \le L\). \(\varepsilon\)는 임의이므로 \(m^* = 0\)입니다.`;
  const en = String.raw`Cover total \(L = \sum_{k=1}^{${K}}\varepsilon/2^k = ${fmt(totalLength, 5)} ${rel} \varepsilon = ${fmt(eps, 3)}\) — so \(m^*(\mathbb{Q}\cap[0,1]) \le L\). Since \(\varepsilon\) is arbitrary, \(m^* = 0\).`;
  return localize({ ko, en }, lang);
}

function createMeasureScene(): Scene<MeasureData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: MeasureData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !readoutSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { target, covers, K } = data;

    const x = scaleLinear().domain([0, 1]).range([0, width]);
    // Rows stack the covers so overlaps stay visible.
    const rows = 8;
    const rowH = (height - 70) / rows;

    g.selectAll('*').remove();

    // The unit interval.
    g.append('line').attr('x1', 0).attr('x2', width).attr('y1', height - 40).attr('y2', height - 40).attr('stroke', 'currentColor').attr('stroke-width', 2);
    g.append('g').attr('transform', `translate(0,${height - 40})`).call(axisBottom(x).ticks(5));

    covers.forEach((cover, i) => {
      const row = i % rows;
      const yTop = height - 48 - row * rowH - 3;
      g.append('rect')
        .attr('x', x(Math.max(0, cover.c - cover.w / 2)))
        .attr('width', Math.max(1, x(Math.min(1, cover.c + cover.w / 2)) - x(Math.max(0, cover.c - cover.w / 2))))
        .attr('y', Math.max(0, yTop - rowH + 4))
        .attr('height', Math.max(1, rowH - 6))
        .style('fill', 'var(--accent)')
        .attr('opacity', 0.55);
    });

    // Mark the target point for the singleton witness.
    if (target === 'singleton') {
      g.append('circle')
        .attr('cx', x(0.5))
        .attr('cy', height - 40)
        .attr('r', 4)
        .attr('fill', 'var(--accent)');
    }

    g.append('text')
      .attr('x', 8)
      .attr('y', 14)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(
        target === 'rationals'
          ? `${localize({ ko: '덮개', en: 'covers' }, lang)}: ${covers.length} (K = ${K})`
          : `${localize({ ko: '대상', en: 'target' }, lang)}: ${target === 'singleton' ? '{0.5}' : '[0,1]'}`,
      );

    setRich(readoutSlot, readoutText(data, lang));
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
      strips.append(readout);
      host.append(chartWrap, strips);

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

export default defineScene<MeasureData>({ model: measureModel, createScene: createMeasureScene });
