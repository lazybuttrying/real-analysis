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
import {
  evaluateFn,
  uniformContinuityModel,
  type FunctionKind,
  type UniformContinuityData,
} from '../models/uniform-continuity';

/**
 * Uniform vs pointwise continuity. The plot shows f on [0, 4.5] with the
 * point (x, f(x)), the delta-interval (x - delta, x + delta) shaded on the
 * x-axis, and the eps-band (f(x) - eps, f(x) + eps) around the point.
 * The readout gives delta_max(x, eps) and notes that it shrinks as x grows
 * for f(x) = x^2, while it stays constant for f(x) = 2x.
 */

const X_MAX = 4.5;

function fnName(kind: FunctionKind): string {
  return kind === 'square' ? 'f(x) = x^2' : 'f(x) = 2x';
}

function readoutText(data: UniformContinuityData, lang: Lang): string {
  const { fn, x, eps, delta } = data;
  return localize(
    {
      ko: String.raw`\(${fnName(fn)}\)에서 \(\delta_{\max}(x = ${fmt(x)}, \varepsilon = ${fmt(eps)}) \approx ${fmt(delta)}\)`,
      en: String.raw`For \(f(x) = ${fn === 'square' ? 'x^2' : '2x'}\): \(\delta_{\max}(x = ${fmt(x)}, \varepsilon = ${fmt(eps)}) \approx ${fmt(delta)}\)`,
    },
    lang,
  );
}

function verdictText(data: UniformContinuityData, lang: Lang): string {
  const { fn } = data;
  if (fn === 'square') {
    return localize(
      {
        ko: String.raw`\(x\)가 커질수록 \(\delta_{\max}\)는 줄어든다 — \(\mathbb{R}\) 전체를 감당하는 하나의 \(\delta\)는 존재하지 않는다.`,
        en: String.raw`\(\delta_{\max}\) shrinks as \(x\) grows — no single \(\delta\) can cover all of \(\mathbb{R}\).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(\delta_{\max} = \varepsilon/2\)로 모든 \(x\)에서 같다 — 하나의 \(\delta\)가 모든 \(x\)를 커버한다.`,
      en: String.raw`\(\delta_{\max} = \varepsilon/2\) everywhere — a single \(\delta\) covers every \(x\).`,
    },
    lang,
  );
}

function createUniformContinuityScene(): Scene<UniformContinuityData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: UniformContinuityData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !readoutSlot || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { fn, x, eps, delta, fx } = data;

    const xScale = scaleLinear().domain([0, X_MAX]).range([0, width]);
    const yMax = evaluateFn(fn, X_MAX) * 1.05;
    const yScale = scaleLinear().domain([0, yMax]).range([height - 8, 8]);

    g.selectAll('*').remove();

    // The delta-window: (x - delta, x + delta) x (f(x) - eps, f(x) + eps).
    g.append('rect')
      .attr('x', xScale(x - delta))
      .attr('width', Math.max(0, xScale(x + delta) - xScale(x - delta)))
      .attr('y', yScale(fx + eps))
      .attr('height', Math.max(0, yScale(fx - eps) - yScale(fx + eps)))
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.16);

    // Dashed guides at x +/- delta and f(x) +/- eps.
    for (const edge of [x - delta, x + delta]) {
      g.append('line')
        .attr('x1', xScale(edge))
        .attr('x2', xScale(edge))
        .attr('y1', 8)
        .attr('y2', height - 8)
        .attr('stroke', 'var(--bound)')
        .attr('stroke-dasharray', '4 3')
        .attr('opacity', 0.7);
    }
    for (const level of [fx - eps, fx + eps]) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(level))
        .attr('y2', yScale(level))
        .attr('stroke', 'var(--bound)')
        .attr('stroke-dasharray', '4 3')
        .attr('opacity', 0.7);
    }

    // The function curve.
    const N = 160;
    const samples: number[] = [];
    for (let i = 0; i <= N; i++) samples.push((i / N) * X_MAX);
    const curve = line<number>()
      .x((t) => xScale(t))
      .y((t) => yScale(evaluateFn(fn, t)));
    g.append('path')
      .attr('d', curve(samples) ?? '')
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 2.5);

    // The point (x, f(x)).
    g.append('circle')
      .attr('cx', xScale(x))
      .attr('cy', yScale(fx))
      .attr('r', 5.5)
      .attr('fill', 'var(--bound)');

    g.append('g').attr('transform', `translate(0,${height - 8})`).call(axisBottom(xScale).ticks(9));
    g.append('g').call(axisLeft(yScale).ticks(6));

    setRichText(readoutSlot, readoutText(data, lang));
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
      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      strips.append(legend, readout, verdict);
      host.append(chartWrap, strips);

      setRichText(
        createRichSlot(legend),
        localize(
          {
            ko: String.raw`파란 곡선 = 함수 \(f\), 빨간 점 = \((x, f(x))\), 음영 = \(\delta\)-구간 \(\times\) \(\varepsilon\)-띠`,
            en: String.raw`blue curve = the function \(f\), red dot = \((x, f(x))\), shaded = the \(\delta\)-window: \((x-\delta, x+\delta) \times (f(x)-\varepsilon, f(x)+\varepsilon)\)`,
          },
          lang,
        ),
      );
      readoutSlot = createRichSlot(readout);
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
      readoutSlot = undefined;
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

export default defineScene<UniformContinuityData>({ model: uniformContinuityModel, createScene: createUniformContinuityScene });
