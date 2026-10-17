import { axisBottom, axisLeft, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, type Chart } from '../../../view/d3kit';
import { limsupLiminfModel, type LimsupLiminfData } from '../models/limsupLiminf';

/**
 * Lim sup and lim inf of a_n = (-1)^n (1 + 1/n).
 *
 * A stem plot shows the terms alternating above and below the axis;
 * dashed lines mark the tail sup/inf limits (limsup = 1, liminf = -1).
 * The facts strip states the computed values; the verdict states the
 * general characterization: limsup = liminf iff the limit exists.
 */

function factsText(data: LimsupLiminfData, lang: Lang): string {
  const { count } = data;
  return localize(
    {
      ko: String.raw`\(a_n = (-1)^n(1+1/n)\) (\(n \le ${count}\)): \(\limsup a_n = 1\), \(\liminf a_n = -1\) — 꼬리의 상한과 하한이 모이는 곳.`,
      en: String.raw`\(a_n = (-1)^n(1+1/n)\) (\(n \le ${count}\)): \(\limsup a_n = 1\), \(\liminf a_n = -1\) — where the suprema and infima of the tails settle.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(\limsup a_n = \liminf a_n \iff \lim a_n\) 존재`,
      en: String.raw`\(\limsup a_n = \liminf a_n \iff \lim a_n\) exists`,
    },
    lang,
  );
}

function createLimsupLiminfScene(): Scene<LimsupLiminfData> {
  let chart: Chart | undefined;
  let hostEl: HTMLElement | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: LimsupLiminfData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { count, points, limsup, liminf } = data;
    g.selectAll('*').remove();

    const values = points.map((point) => point.value);
    const lo = Math.min(liminf, ...values) - 0.15;
    const hi = Math.max(limsup, ...values) + 0.15;
    const x = scaleLinear().domain([0, count + 1]).range([0, width]);
    const y = scaleLinear().domain([lo, hi]).range([height, 0]);

    const axisLabel = localize({ ko: 'n', en: 'n' }, lang);
    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(Math.min(10, count)));
    g.append('g').call(axisLeft(y).ticks(6));
    g.append('text')
      .attr('x', width)
      .attr('y', height + 28)
      .attr('text-anchor', 'end')
      .attr('font-size', 11)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.6)
      .text(axisLabel);

    // Faint zero line.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.25);

    // Stems and dots: alternating above and below.
    points.forEach((point) => {
      const cx = x(point.n);
      g.append('line')
        .attr('x1', cx)
        .attr('x2', cx)
        .attr('y1', y(0))
        .attr('y2', y(point.value))
        .attr('stroke', point.value >= 0 ? 'var(--accent)' : 'currentColor')
        .attr('stroke-width', 1.5)
        .attr('opacity', point.value >= 0 ? 0.85 : 0.4);
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', y(point.value))
        .attr('r', Math.max(2, Math.min(4, 240 / count)))
        .attr('fill', point.value >= 0 ? 'var(--accent)' : 'currentColor')
        .attr('opacity', point.value >= 0 ? 1 : 0.65);
    });

    // Dashed limsup / liminf lines with labels.
    const limsupLabel = localize({ ko: 'limsup = 1', en: 'limsup = 1' }, lang);
    const liminfLabel = localize({ ko: 'liminf = −1', en: 'liminf = −1' }, lang);
    [
      { value: limsup, label: limsupLabel },
      { value: liminf, label: liminfLabel },
    ].forEach(({ value, label }) => {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(value))
        .attr('y2', y(value))
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '6 4');
      g.append('text')
        .attr('x', width - 4)
        .attr('y', y(value) - 6)
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .style('fill', 'var(--accent)')
        .text(label);
    });

    if (factsSlot && verdictSlot) {
      setRichText(factsSlot, factsText(data, lang));
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

export default defineScene<LimsupLiminfData>({ model: limsupLiminfModel, createScene: createLimsupLiminfScene });
