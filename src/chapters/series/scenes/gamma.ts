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
import { gammaModel, type GammaData } from '../models/gamma';

/**
 * The gamma function: the integral Gamma(x) = ∫ t^{x-1} e^{-t} dt over
 * (0, ∞) extends the factorial to real x > 0. The curve dives toward +∞
 * near 0 (the integral just barely converges), dips through the minimum
 * near x ≈ 1.46, then blows past the factorial values — the red dots sit
 * exactly on the curve at (n, (n−1)!). The dashed marker ties the slider
 * position to the integral value via the recurrence Gamma(x+1) = x·Gamma(x).
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

function factsText(data: GammaData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`적분 정의 \(\Gamma(x) = \int_0^\infty t^{x-1} e^{-t}\,dt\) — \(x > 0\)에서 수렴. 현재 \(x = ${fmt(data.x, 2)}\)에서 \(\Gamma(x) \approx ${fmt(data.value, 6)}\).`,
      en: String.raw`Defined by the integral \(\Gamma(x) = \int_0^\infty t^{x-1} e^{-t}\,dt\) — converges for \(x > 0\). At \(x = ${fmt(data.x, 2)}\): \(\Gamma(x) \approx ${fmt(data.value, 6)}\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(\Gamma(x+1) = x\Gamma(x)\)이므로 \(\Gamma(n+1) = n!\) — 팩토리얼의 연속 확장이다.`,
      en: String.raw`\(\Gamma(x+1) = x\Gamma(x)\), hence \(\Gamma(n+1) = n!\) — the continuous extension of the factorial.`,
    },
    lang,
  );
}

function createGammaScene(): Scene<GammaData> {
  let chart: Chart | undefined;
  let hostEl: HTMLElement | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: GammaData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;

    const x = scaleLinear().domain([0, 4.2]).range([0, width]);
    const y = scaleLinear().domain([0, 10]).range([height, 0]);

    g.selectAll('*').remove();

    g.append('g').call(axisLeft(y).ticks(5));
    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));

    // The gamma curve, clipped at the top of the y domain.
    const curve = line<GammaData['samples'][number]>()
      .x((p) => x(p.x))
      .y((p) => y(Math.min(10, p.y)));
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)')
      .attr('d', curve(data.samples) ?? '');

    // Integer dots: (n, (n−1)!) — the factorial values the curve passes through.
    for (const d of data.dots) {
      g.append('circle')
        .attr('cx', x(d.x))
        .attr('cy', y(d.y))
        .attr('r', 4.5)
        .attr('fill', 'var(--bound)');
      const toRight = d.x <= 2;
      g.append('text')
        .attr('x', x(d.x) + (toRight ? 8 : -8))
        .attr('y', y(d.y) - 8)
        .attr('text-anchor', toRight ? 'start' : 'end')
        .attr('font-size', 11)
        .style('fill', 'var(--bound)')
        .text(`(${d.x}, ${d.x - 1}!)`);
    }

    // Dashed marker at the current x with a value readout.
    g.append('line')
      .attr('x1', x(data.x))
      .attr('x2', x(data.x))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5 4')
      .attr('opacity', 0.8);
    const readout = localize(
      { ko: '값', en: 'value' },
      lang,
    );
    g.append('text')
      .attr('x', Math.min(x(data.x) + 8, width - 4))
      .attr('y', 16)
      .attr('text-anchor', 'start')
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(`${readout}: Γ(${fmt(data.x, 2)}) ≈ ${fmt(data.value, 6)}`);

    if (factsSlot && verdictSlot) {
      setRich(factsSlot, factsText(data, lang));
      setRich(verdictSlot, verdictText(lang));
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

      factsSlot = makeSlot(facts);
      verdictSlot = makeSlot(verdict);
      chart = createChart(chartWrap);
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

export default defineScene<GammaData>({ model: gammaModel, createScene: createGammaScene });
