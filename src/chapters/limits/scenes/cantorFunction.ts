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
import { cantorFunctionModel, type CantorFunctionData } from '../models/cantorFunction';

/**
 * The Cantor function (Devil's staircase), live. The staircase f(x) is always
 * drawn in full: continuous, nondecreasing, flat on every open interval that
 * the Cantor-set construction removes — yet it climbs from 0 to 1. Beneath it,
 * the bars show the surviving closed intervals of C_stage at the slider's
 * stage: as the stage grows, the bars shrink to total length (2/3)^stage while
 * the staircase keeps climbing only on what remains. The dashed segment marks
 * the widest flat step, f = 1/2 on (1/3, 2/3).
 */

const MARGIN = { top: 56, right: 20, bottom: 44, left: 60 };

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

function factsText(data: CantorFunctionData, lang: Lang): string {
  const { stage, intervals, totalLength } = data;
  const s = fmt(stage, 0);
  const count = fmt(intervals.length, 0);
  const len = fmt(totalLength, 5);
  return localize(
    {
      ko: String.raw`단계 \(n = ${s}\): 칸토어 집합 \(C_{${s}}\)는 구간 ${count}개 (=\(2^{${s}}\))로 이루어지고 전체 길이는 \((2/3)^{${s}} = ${len}\)이다. 계단은 항상 완성된 칸토어 함수 \(f\)이다 — \(f(0) = 0\), \(f(1) = 1\), \(f(1/3) = f(2/3) = 1/2\), \(f(1/4) = 1/3\).`,
      en: String.raw`Stage \(n = ${s}\): the Cantor set \(C_{${s}}\) consists of ${count} intervals (=\(2^{${s}}\)) with total length \((2/3)^{${s}} = ${len}\). The staircase is always the finished Cantor function \(f\) — \(f(0) = 0\), \(f(1) = 1\), \(f(1/3) = f(2/3) = 1/2\), \(f(1/4) = 1/3\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`악마의 계단: 연속이고 단조증가이며, 칸토어 집합을 뺀 모든 열린 구간 위에서는 평평하다 — 그런데도 0에서 1까지 오른다. 미분하면 거의 모든 점에서 0이다.`,
      en: String.raw`The Devil's staircase: continuous and nondecreasing, flat on every open interval outside the Cantor set — yet it climbs from 0 to 1. Its derivative is 0 at almost every point.`,
    },
    lang,
  );
}

function createCantorFunctionScene(): Scene<CantorFunctionData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: CantorFunctionData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !factsSlot || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { xs, fVals, intervals, stage } = data;

    g.selectAll('*').remove();

    const barH = 22;
    const gapY = 44;
    const mainH = Math.max(140, height - barH - gapY);
    const barsG = g.append('g').attr('transform', `translate(0,${mainH + gapY})`);

    const x = scaleLinear().domain([0, 1]).range([0, width]);
    const y = scaleLinear().domain([-0.06, 1.06]).range([mainH, 0]);

    g.append('text')
      .attr('x', 0)
      .attr('y', -42)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: '칸토어 함수 — 삼진 전개로 정의된 악마의 계단',
            en: "The Cantor function — the Devil's staircase, defined via ternary expansions",
          },
          lang,
        ),
      );

    g.append('g').call(axisLeft(y).ticks(5));
    g.append('g')
      .attr('transform', `translate(0,${mainH})`)
      .call(axisBottom(x).ticks(10));

    // The staircase itself, sampled densely enough that every step is crisp.
    const stair = line<number>()
      .x((_, i) => x(xs[i] ?? 0))
      .y((_, i) => y(fVals[i] ?? 0));
    g.append('path')
      .datum(xs)
      .attr('d', stair)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .style('stroke', 'var(--accent)');

    // The widest flat step: f = 1/2 on (1/3, 2/3), drawn dashed under the curve.
    g.append('line')
      .attr('x1', x(1 / 3))
      .attr('x2', x(2 / 3))
      .attr('y1', y(0.5))
      .attr('y2', y(0.5))
      .attr('stroke', 'var(--bound)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 4')
      .attr('opacity', 0.8);
    g.append('text')
      .attr('x', x(0.5))
      .attr('y', y(0.5) - 8)
      .attr('font-size', 12)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--bound)')
      .text('f = 1/2');

    // The surviving closed intervals of C_stage, as bars beneath the chart.
    barsG
      .append('text')
      .attr('x', 0)
      .attr('y', -10)
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `C_${stage}의 구간들`,
            en: `intervals of C_${stage}`,
          },
          lang,
        ),
      );
    for (const { l, r } of intervals) {
      barsG
        .append('rect')
        .attr('x', x(l))
        .attr('width', Math.max(1, x(r) - x(l)))
        .attr('y', 0)
        .attr('height', barH)
        .attr('fill', 'var(--accent)')
        .attr('opacity', 0.55);
    }
    barsG
      .append('text')
      .attr('x', 0)
      .attr('y', barH + 20)
      .attr('font-size', 12)
      .style('fill', 'var(--muted)')
      .text(
        localize(
          { ko: `단계 ${stage} — 구간 ${fmt(intervals.length, 0)}개`, en: `stage ${stage} — ${fmt(intervals.length, 0)} intervals` },
          lang,
        ),
      );

    setRich(factsSlot, factsText(data, lang));
    setRich(verdictSlot, verdictText(lang));
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

export default defineScene<CantorFunctionData>({ model: cantorFunctionModel, createScene: createCantorFunctionScene });
