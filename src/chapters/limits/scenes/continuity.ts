import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { continuityModel, type ContinuityData, type ContinuitySample } from '../models/continuity';

/**
 * Continuity of x^2 at a movable point a. In broken mode the function value
 * jumps to a^2 + 1 while the limit stays a^2, so the epsilon band around the
 * limit no longer captures the marked point: the definition fails.
 */

function verdictText(data: ContinuityData, lang: Lang): string {
  const { a, limitV, funcV, continuous } = data;
  if (continuous) {
    return localize(
      {
        ko: String.raw`\(a = ${fmt(a)}\)에서 연속: \(\lim_{x \to a} x^2 = ${fmt(limitV)} = f(a)\)`,
        en: String.raw`continuous at \(a = ${fmt(a)}\): \(\lim_{x \to a} x^2 = ${fmt(limitV)} = f(a)\)`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`정의 깨짐: \(\lim_{x \to ${fmt(a)}} g(x) = ${fmt(limitV)} \neq ${fmt(funcV)} = g(${fmt(a)})\)`,
      en: String.raw`definition fails: \(\lim_{x \to ${fmt(a)}} g(x) = ${fmt(limitV)} \neq ${fmt(funcV)} = g(${fmt(a)})\)`,
    },
    lang,
  );
}

function createContinuityScene(): Scene<ContinuityData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: ContinuityData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { a, broken, limitV, funcV, eps, curve, continuous } = data;

    const x = scaleLinear().domain([-2.4, 2.4]).range([0, width]);
    const y = scaleLinear().domain([-1, 6.2]).range([height, 0]);

    g.selectAll('*').remove();

    // The epsilon band around the limit.
    g.append('rect')
      .attr('x', 0)
      .attr('width', width)
      .attr('y', y(limitV + eps))
      .attr('height', Math.max(0, y(limitV - eps) - y(limitV + eps)))
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.12);

    const path = line<ContinuitySample>()
      .x((p) => x(p.x))
      .y((p) => y(p.y));
    g.append('path').attr('d', path(curve)).attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 2);

    // The limit line and the point a.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(limitV))
      .attr('y2', y(limitV))
      .attr('stroke', 'var(--bound)')
      .attr('stroke-dasharray', '5 4');
    g.append('line')
      .attr('x1', x(a))
      .attr('x2', x(a))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', 'var(--bound)')
      .attr('stroke-dasharray', '4 3');

    if (broken) {
      // The curve's missing point: an open circle at (a, a^2).
      g.append('circle')
        .attr('cx', x(a))
        .attr('cy', y(limitV))
        .attr('r', 6)
        .attr('fill', 'var(--bg)')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 2);
    }
    // The actual function value at a.
    g.append('circle').attr('cx', x(a)).attr('cy', y(funcV)).attr('r', 5).attr('fill', continuous ? 'var(--accent)' : 'var(--bound)');

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(6));

    setRichText(verdictSlot, verdictText(data, lang));
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
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      strips.append(legend, verdict);
      host.append(chartWrap, strips);

      setRichText(
        createRichSlot(legend),
        localize(
          {
            ko: String.raw`밴드 = 극한 \(\pm 0.5\), 채운 점 = \(f(a)\) (broken 모드에서는 빈 동그라미가 극한 지점)`,
            en: String.raw`band = limit \(\pm 0.5\); the filled dot is \(f(a)\) (in broken mode the open circle marks the limit point)`,
          },
          lang,
        ),
      );
      verdictSlot = createRichSlot(verdict);
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
      verdictSlot = undefined;
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

export default defineScene<ContinuityData>({ model: continuityModel, createScene: createContinuityScene });
