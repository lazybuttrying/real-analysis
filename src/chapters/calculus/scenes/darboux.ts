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
  MAX_DRAWN_CROSSINGS,
  darbouxModel,
  type DarbouxData,
} from '../models/darboux';

/**
 * Darboux's theorem, live. Top panel: f(x) = x^2 sin(1/x) (f(0) = 0), a
 * smooth-looking curve squeezed between the +/-x^2 envelope. Bottom panel:
 * f'(x) = 2x sin(1/x) - cos(1/x) (f'(0) = 0), oscillating wildly between the
 * +/-1 bands without ever settling down. The red IVP test line y = c meets
 * the graph at every level with |c| < 1 — the intermediate value property for
 * a function that is discontinuous at 0. The zoom slider drives both panels'
 * window on x = 0.
 */

const MARGIN = { top: 60, right: 20, bottom: 44, left: 60 };

function factsText(data: DarbouxData, lang: Lang): string {
  const h = fmt(data.halfWidth, 4);
  const c = fmt(data.level, 2);
  const n = data.crossings.length;
  const shown = Math.min(n, MAX_DRAWN_CROSSINGS);
  const note =
    n > MAX_DRAWN_CROSSINGS
      ? localize(
          {
            ko: String.raw` (앞쪽 ${fmt(shown, 0)}개만 표시)`,
            en: String.raw` (showing the first ${fmt(shown, 0)})`,
          },
          lang,
        )
      : '';
  return localize(
    {
      ko: String.raw`창 \([-${h},\, ${h}]\)에서 \(f'\)는 \(y = ${c}\)를 \(${fmt(n, 0)}\)번 만납니다${note} — 그리드에서 검출된 교차이며, \(|f'|\)는 \(\pm 1\) 띠 안에 갇히면서도 그 사이의 모든 높이를 밟습니다.`,
      en: String.raw`On the window \([-${h},\, ${h}]\), \(f'\) meets \(y = ${c}\) ${fmt(n, 0)} times${note} — crossings detected on the grid; \(|f'|\) stays inside the \(\pm 1\) bands yet steps on every height between them.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`다르부 정리: \(f\)가 \([a,b]\)에서 미분가능하면 \(f'\)는 \(f'(a)\)와 \(f'(b)\) 사이의 모든 값을 취합니다 — \(f'\)가 불연속이어도 마찬가지입니다. 점프 불연속은 도함수에서 절대 일어날 수 없습니다.`,
      en: String.raw`Darboux's theorem: if \(f\) is differentiable on \([a,b]\), then \(f'\) takes every value between \(f'(a)\) and \(f'(b)\) — even when \(f'\) is discontinuous. Jump discontinuities can never occur in a derivative.`,
    },
    lang,
  );
}

function createDarbouxScene(): Scene<DarbouxData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: DarbouxData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !factsSlot || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { xs, fVals, fpVals, envPos, envNeg, crossings, level, showF, halfWidth: h } = data;
    const n = xs.length;

    g.selectAll('*').remove();

    const topH = Math.max(130, Math.floor((height - 36) * 0.48));
    const gapY = 36;
    const botH = Math.max(90, height - topH - gapY);
    const topG = g.append('g');
    const botG = g.append('g').attr('transform', `translate(0,${topH + gapY})`);

    const x = scaleLinear().domain([-h, h]).range([0, width]);

    const topTitle = localize(
      {
        ko: 'f(x) = x² sin(1/x), f(0) = 0 — ±x² 띠 안에 갇힌 매끈한 곡선',
        en: 'f(x) = x² sin(1/x), f(0) = 0 — a smooth-looking curve trapped in the ±x² envelope',
      },
      lang,
    );
    const botTitle = localize(
      {
        ko: 'f′(x) = 2x sin(1/x) − cos(1/x), f′(0) = 0 — ±1 띠 사이에서 격렬하게 진동하지만 모든 높이를 만남',
        en: 'f′(x) = 2x sin(1/x) − cos(1/x), f′(0) = 0 — oscillates wildly between the ±1 bands, yet hits every level',
      },
      lang,
    );

    topG
      .append('text')
      .attr('x', 0)
      .attr('y', -46)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(topTitle);
    botG
      .append('text')
      .attr('x', 0)
      .attr('y', -22)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(botTitle);

    const curveLine = (vals: number[], y: (v: number) => number) =>
      line<number>()
        .x((_, i) => x(xs[i] ?? 0))
        .y((_, i) => y(vals[i] ?? 0));

    // Top panel: f between the +/-x^2 envelope.
    let fMin = Infinity;
    let fMax = -Infinity;
    for (let i = 0; i < n; i++) {
      fMin = Math.min(fMin, fVals[i] ?? Infinity, envNeg[i] ?? Infinity);
      fMax = Math.max(fMax, fVals[i] ?? -Infinity, envPos[i] ?? -Infinity);
    }
    const fPad = (fMax - fMin) * 0.08 || 1;
    const yTop = scaleLinear().domain([fMin - fPad, fMax + fPad]).range([topH, 0]);

    topG.append('g').call(axisLeft(yTop).ticks(4));
    topG
      .append('g')
      .attr('transform', `translate(0,${topH})`)
      .call(axisBottom(x).ticks(5));
    for (const env of [envPos, envNeg]) {
      topG
        .append('path')
        .datum(xs)
        .attr('d', curveLine(env, yTop))
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '6 4')
        .style('stroke', 'var(--muted)');
    }
    if (showF) {
      topG
        .append('path')
        .datum(xs)
        .attr('d', curveLine(fVals, yTop))
        .attr('fill', 'none')
        .attr('stroke-width', 2.5)
        .style('stroke', 'var(--accent)');
      topG
        .append('circle')
        .attr('cx', x(0))
        .attr('cy', yTop(0))
        .attr('r', 4)
        .attr('fill', 'var(--accent)')
        .append('title')
        .text('f(0) = 0');
    }

    // Bottom panel: f' between the +/-1 bands, with the IVP test line y = level.
    const yBot = scaleLinear().domain([-1.35, 1.35]).range([botH, 0]);

    botG
      .append('g')
      .attr('transform', `translate(0,${botH})`)
      .call(axisBottom(x).ticks(5));
    botG.append('g').call(axisLeft(yBot).ticks(5));

    for (const band of [-1, 1]) {
      botG
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yBot(band))
        .attr('y2', yBot(band))
        .attr('stroke', 'var(--muted)')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '6 4')
        .attr('opacity', 0.7);
    }
    botG
      .append('text')
      .attr('x', 4)
      .attr('y', yBot(1) - 6)
      .attr('font-size', 12)
      .attr('fill', 'var(--muted)')
      .text('+1');
    botG
      .append('text')
      .attr('x', 4)
      .attr('y', yBot(-1) + 16)
      .attr('font-size', 12)
      .attr('fill', 'var(--muted)')
      .text('−1');

    // The IVP test line y = c: solid red, drawn under the curve.
    botG
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yBot(level))
      .attr('y2', yBot(level))
      .attr('stroke', 'var(--bound)')
      .attr('stroke-width', 2)
      .attr('opacity', 0.85);
    botG
      .append('text')
      .attr('x', width - 4)
      .attr('y', yBot(level) - 6)
      .attr('font-size', 12)
      .attr('text-anchor', 'end')
      .style('fill', 'var(--bound)')
      .text(`y = ${fmt(level, 2)}`);

    botG
      .append('path')
      .datum(xs)
      .attr('d', curveLine(fpVals, yBot))
      .attr('fill', 'none')
      .attr('stroke-width', 1.75)
      .style('stroke', 'var(--accent)');

    // Crossing markers where f' meets y = c.
    const drawn = crossings.slice(0, MAX_DRAWN_CROSSINGS);
    for (const cx of drawn) {
      botG
        .append('circle')
        .attr('cx', x(cx))
        .attr('cy', yBot(level))
        .attr('r', 2.5)
        .attr('fill', 'var(--bound)')
        .append('title')
        .text(`f' = ${fmt(level, 2)} at x ≈ ${fmt(cx, 8)}`);
    }

    // Center marker at x = 0 (where f' is defined but discontinuous).
    botG
      .append('circle')
      .attr('cx', x(0))
      .attr('cy', yBot(0))
      .attr('r', 4.5)
      .attr('fill', 'var(--accent)')
      .append('title')
      .text("f'(0) = 0 (defined by the derivative, though f' is discontinuous here)");

    // Legend.
    botG
      .append('text')
      .attr('x', 8)
      .attr('y', botH + 34)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: '■ f′(x)', en: "■ f′(x)" }, lang));
    botG
      .append('text')
      .attr('x', width / 2)
      .attr('y', botH + 34)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(localize({ ko: '─ 테스트 높이 y = c', en: '─ test level y = c' }, lang));

    setRichText(factsSlot, factsText(data, lang));
    setRichText(verdictSlot, verdictText(lang));
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

export default defineScene<DarbouxData>({ model: darbouxModel, createScene: createDarbouxScene });
