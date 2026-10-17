import { axisBottom, axisLeft, line, scaleLinear, scaleLog } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { lhopitalModel, type LHopitalData } from '../models/lhopital';

/**
 * L'Hopital's rule, live. Top panel: f and g heading for the same
 * indeterminate destination (0 for sin x / x as x -> 0+, infinity for
 * ln x / x as x -> infinity). Bottom panel: the ratio f(x)/g(x) (accent)
 * tracking the derivative ratio f'(x)/g'(x) (dashed) toward the shared
 * limit. The slider drives x toward the limit point.
 */

const MARGIN = { top: 60, right: 20, bottom: 44, left: 60 };

function factsText(data: LHopitalData, lang: Lang): string {
  const x = fmt(data.x, 4);
  const f = fmt(data.f, 4);
  const gv = fmt(data.g, 4);
  const ratio = fmt(data.ratio, 4);
  const dr = fmt(data.derivRatio, 4);
  if (data.pair === 'sin') {
    return localize(
      {
        ko: String.raw`\(x \approx ${x}\): \(\sin x \approx ${f}\), \(x \approx ${gv}\) — \(0/0\) 꼴. \(\frac{\sin x}{x} \approx ${ratio}\), \(\frac{(\sin x)'}{(x)'} = \cos x \approx ${dr}\) — 도함수 비율이 원래 비율을 따라 1로 갑니다.`,
        en: String.raw`\(x \approx ${x}\): \(\sin x \approx ${f}\), \(x \approx ${gv}\) — a \(0/0\) form. \(\frac{\sin x}{x} \approx ${ratio}\), \(\frac{(\sin x)'}{(x)'} = \cos x \approx ${dr}\) — the derivative ratio tracks the original toward 1.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(x \approx ${x}\): \(\ln x \approx ${f}\), \(x \approx ${gv}\) — \(\infty/\infty\) 꼴. \(\frac{\ln x}{x} \approx ${ratio}\), \(\frac{(\ln x)'}{(x)'} = \frac{1}{x} \approx ${dr}\) — 도함수 비율이 원래 비율을 따라 0으로 갑니다.`,
      en: String.raw`\(x \approx ${x}\): \(\ln x \approx ${f}\), \(x \approx ${gv}\) — an \(\infty/\infty\) form. \(\frac{\ln x}{x} \approx ${ratio}\), \(\frac{(\ln x)'}{(x)'} = \frac{1}{x} \approx ${dr}\) — the derivative ratio tracks the original toward 0.`,
    },
    lang,
  );
}

function verdictText(data: LHopitalData, lang: Lang): string {
  if (data.pair === 'sin') {
    return localize(
      {
        ko: String.raw`로피탈 정리 (\(0/0\)): \(f, g\)가 \(a\) 근처에서 미분가능하고 \(f, g \to 0\), \(g' \neq 0\)이면 \(\lim_{x\to a}\frac{f(x)}{g(x)} = \lim_{x\to a}\frac{f'(x)}{g'(x)}\) — 코시 평균값 정리를 \([a, x]\)에 적용한 것입니다.`,
        en: String.raw`L'Hôpital's rule (\(0/0\)): if \(f, g\) are differentiable near \(a\) with \(f, g \to 0\) and \(g' \neq 0\), then \(\lim_{x\to a}\frac{f(x)}{g(x)} = \lim_{x\to a}\frac{f'(x)}{g'(x)}\) — Cauchy's theorem applied on \([a, x]\).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`로피탈 정리 (\(\infty/\infty\)): \(|g| \to \infty\), \(g' \neq 0\)이고 \(\lim \frac{f'(x)}{g'(x)}\)가 존재하면 \(\lim \frac{f(x)}{g(x)} = \lim \frac{f'(x)}{g'(x)}\) — \([A, x]\) 위의 코시 평균값 정리에서 나옵니다.`,
      en: String.raw`L'Hôpital's rule (\(\infty/\infty\)): if \(|g| \to \infty\), \(g' \neq 0\), and \(\lim \frac{f'(x)}{g'(x)}\) exists, then \(\lim \frac{f(x)}{g(x)} = \lim \frac{f'(x)}{g'(x)}\) — from Cauchy's theorem on \([A, x]\).`,
    },
    lang,
  );
}

function createLHopitalScene(): Scene<LHopitalData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: LHopitalData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !factsSlot || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { xs, fVals, gVals, ratioVals, derivRatioVals, limit } = data;
    const n = xs.length;
    const xLo = xs[0] ?? 1;
    const xHi = xs[n - 1] ?? 1;

    g.selectAll('*').remove();

    const topH = Math.max(130, Math.floor((height - 36) * 0.48));
    const gapY = 36;
    const botH = Math.max(90, height - topH - gapY);
    const topG = g.append('g');
    const botG = g.append('g').attr('transform', `translate(0,${topH + gapY})`);

    const x = scaleLog().domain([xLo, xHi]).range([0, width]);

    const topTitle =
      data.pair === 'sin'
        ? localize(
            {
              ko: 'f(x) = sin x, g(x) = x — x → 0⁺에서 둘 다 0으로 (0/0 꼴)',
              en: 'f(x) = sin x, g(x) = x — both → 0 as x → 0⁺ (a 0/0 form)',
            },
            lang,
          )
        : localize(
            {
              ko: 'f(x) = ln x, g(x) = x — x → ∞에서 둘 다 ∞로 (∞/∞ 꼴)',
              en: 'f(x) = ln x, g(x) = x — both → ∞ as x → ∞ (an ∞/∞ form)',
            },
            lang,
          );
    const botTitle =
      data.pair === 'sin'
        ? localize(
            {
              ko: 'f(x)/g(x) (진한 선)가 f′(x)/g′(x) (점선)를 따라 1로',
              en: 'f(x)/g(x) (bold) tracks f′(x)/g′(x) (dashed) toward 1',
            },
            lang,
          )
        : localize(
            {
              ko: 'f(x)/g(x) (진한 선)가 f′(x)/g′(x) (점선)를 따라 0으로',
              en: 'f(x)/g(x) (bold) tracks f′(x)/g′(x) (dashed) toward 0',
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
        .x((_, i) => x(xs[i] ?? xLo))
        .y((_, i) => y(vals[i] ?? 0));

    // Top panel: f and g.
    let yMin = Infinity;
    let yMax = -Infinity;
    for (let i = 0; i < n; i++) {
      yMin = Math.min(yMin, fVals[i] ?? Infinity, gVals[i] ?? Infinity);
      yMax = Math.max(yMax, fVals[i] ?? -Infinity, gVals[i] ?? -Infinity);
    }
    const topPad = (yMax - yMin) * 0.08 || 1;
    const yTop = scaleLinear().domain([yMin - topPad, yMax + topPad]).range([topH, 0]);

    topG.append('g').call(axisLeft(yTop).ticks(5));
    topG
      .append('path')
      .datum(xs)
      .attr('d', curveLine(fVals, yTop))
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)');
    topG
      .append('path')
      .datum(xs)
      .attr('d', curveLine(gVals, yTop))
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .style('stroke', 'var(--bound)');

    // Bottom panel: the two ratios and the limit line.
    let rMin = limit;
    let rMax = limit;
    for (let i = 0; i < n; i++) {
      rMin = Math.min(rMin, ratioVals[i] ?? Infinity, derivRatioVals[i] ?? Infinity);
      rMax = Math.max(rMax, ratioVals[i] ?? -Infinity, derivRatioVals[i] ?? -Infinity);
    }
    const rPad = (rMax - rMin) * 0.1 || 0.05;
    const yBot = scaleLinear().domain([rMin - rPad, rMax + rPad]).range([botH, 0]);

    botG
      .append('g')
      .attr('transform', `translate(0,${botH})`)
      .call(axisBottom(x).ticks(5));
    botG.append('g').call(axisLeft(yBot).ticks(5));

    botG
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yBot(limit))
      .attr('y2', yBot(limit))
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6 4')
      .attr('opacity', 0.6);
    botG
      .append('text')
      .attr('x', width - 4)
      .attr('y', yBot(limit) - 6)
      .attr('font-size', 12)
      .attr('text-anchor', 'end')
      .attr('fill', 'currentColor')
      .attr('opacity', 0.75)
      .text(`→ ${limit}`);

    botG
      .append('path')
      .datum(xs)
      .attr('d', curveLine(derivRatioVals, yBot))
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 4')
      .style('stroke', 'var(--muted)');
    botG
      .append('path')
      .datum(xs)
      .attr('d', curveLine(ratioVals, yBot))
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)');

    // Slider marker across both panels.
    const mx = x(data.x);
    for (const [panel, ph] of [
      [topG, topH],
      [botG, botH],
    ] as const) {
      panel
        .append('line')
        .attr('x1', mx)
        .attr('x2', mx)
        .attr('y1', 0)
        .attr('y2', ph)
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3 3')
        .attr('opacity', 0.45);
    }
    topG
      .append('circle')
      .attr('cx', mx)
      .attr('cy', yTop(data.f))
      .attr('r', 4.5)
      .attr('fill', 'var(--accent)')
      .append('title')
      .text(`f(x) = ${fmt(data.f, 6)}`);
    topG
      .append('circle')
      .attr('cx', mx)
      .attr('cy', yTop(data.g))
      .attr('r', 4.5)
      .attr('fill', 'var(--bound)')
      .append('title')
      .text(`g(x) = ${fmt(data.g, 6)}`);
    botG
      .append('circle')
      .attr('cx', mx)
      .attr('cy', yBot(data.ratio))
      .attr('r', 4.5)
      .attr('fill', 'var(--accent)')
      .append('title')
      .text(`f(x)/g(x) = ${fmt(data.ratio, 6)}`);
    botG
      .append('circle')
      .attr('cx', mx)
      .attr('cy', yBot(data.derivRatio))
      .attr('r', 4.5)
      .attr('fill', 'none')
      .attr('stroke', 'var(--muted)')
      .attr('stroke-width', 2)
      .append('title')
      .text(`f'(x)/g'(x) = ${fmt(data.derivRatio, 6)}`);

    // Legend.
    botG
      .append('text')
      .attr('x', 8)
      .attr('y', botH + 34)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: '■ f(x)/g(x)', en: '■ f(x)/g(x)' }, lang));
    botG
      .append('text')
      .attr('x', width / 2)
      .attr('y', botH + 34)
      .attr('font-size', 12)
      .style('fill', 'var(--muted)')
      .text(localize({ ko: '┄ f′(x)/g′(x) 도함수 비율', en: "┄ f′(x)/g′(x) derivative ratio" }, lang));

    setRichText(factsSlot, factsText(data, lang));
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

export default defineScene<LHopitalData>({ model: lhopitalModel, createScene: createLHopitalScene });
