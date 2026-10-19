import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, fmt, type Chart, type SceneShell } from '../../../view/d3kit';
import { ddOscModel, oscF, type DdOscData } from '../models/discontinuousDerivative';

/**
 * f(x) = x^2 sin(1/x) (f(0) = 0): differentiable everywhere, but f' is
 * discontinuous at 0. Two panels: f flattens into 0 (the secant slope at
 * 0 is squeezed to 0) while f'(x) = 2x sin(1/x) - cos(1/x) keeps
 * oscillating with amplitude ~1. The highlighted points
 * (1/(2 pi n), -1) show f' has no limit at 0.
 */

const MARGIN = { top: 36, right: 16, bottom: 40, left: 60 };

function readoutText(data: DdOscData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(h = ${fmt(data.h, 4)}\)에서 차분몫 \(\frac{f(h) - f(0)}{h} = h\sin(1/h) \approx ${fmt(data.diffQuot, 6)} \to 0\) (\(h \to 0\)) — 그래서 \(f'(0) = 0\)입니다. 반면 \([-r, r]\) (\(r = ${fmt(data.r, 4)}\)) 위에서 \(\max |f'| \approx ${fmt(data.maxAbsFp, 4)}\)로 1 근처에 머뭅니다: \(f'\)는 0에서 진동이 멈추지 않습니다.`,
      en: String.raw`At \(h = ${fmt(data.h, 4)}\), the difference quotient \(\frac{f(h) - f(0)}{h} = h\sin(1/h) \approx ${fmt(data.diffQuot, 6)} \to 0\) as \(h \to 0\) — so \(f'(0) = 0\). But on \([-r, r]\) (\(r = ${fmt(data.r, 4)}\)), \(\max |f'| \approx ${fmt(data.maxAbsFp, 4)}\) stays near 1: \(f'\) never stops oscillating at 0.`,
    },
    lang,
  );
}

function explainText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`왼쪽: \(f(x) = x^2\sin(1/x)\)는 0 근처에서 납작해지고, 점선(기울기 0)이 \(x = 0\)에서의 접선입니다. \((0, 0)\)과 \((h, f(h))\)를 잇는 할선(주황)의 기울기가 0으로 수렴합니다. 오른쪽: \(f'(x) = 2x\sin(1/x) - \cos(1/x)\)는 진폭이 줄지 않고 계속 진동합니다 — 강조된 점 \(x_n = 1/(2\pi n)\)에서는 \(f'(x_n) = -1\)로 일정하므로 \(f'\)는 0에서 극한을 가질 수 없습니다 (아래 문제 3).`,
      en: String.raw`Left: \(f(x) = x^2\sin(1/x)\) flattens near 0, and the dashed line (slope 0) is the tangent at \(x = 0\). The secant (orange) through \((0, 0)\) and \((h, f(h))\) has slope tending to 0. Right: \(f'(x) = 2x\sin(1/x) - \cos(1/x)\) keeps oscillating with undiminished amplitude — at the highlighted points \(x_n = 1/(2\pi n)\) we have \(f'(x_n) = -1\) constantly, so \(f'\) cannot have a limit at 0 (problem 3 below).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(f\)는 모든 점에서 미분가능하지만(특히 \(f'(0) = 0\)), 도함수 \(f'\)는 0에서 불연속입니다 — 미분가능성이 도함수의 연속성을 보장하지 않습니다.`,
      en: String.raw`\(f\) is differentiable everywhere (in particular \(f'(0) = 0\)), yet its derivative \(f'\) is discontinuous at 0 — differentiability does not imply continuity of the derivative.`,
    },
    lang,
  );
}

function createDdScene(): Scene<DdOscData> {
  let shell: SceneShell | undefined;
  let chartF: Chart | undefined;
  let chartFp: Chart | undefined;
  let wrapF: HTMLElement | undefined;
  let wrapFp: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let explainSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: DdOscData; state: ControlState } | undefined;

  const drawF = (data: DdOscData): void => {
    if (!chartF) return;
    const { g, width, height } = chartF;
    g.selectAll('*').remove();

    g.append('text')
      .attr('x', 0)
      .attr('y', -18)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          { ko: 'f(x) = x²sin(1/x), f(0) = 0', en: 'f(x) = x²sin(1/x), f(0) = 0' },
          lang,
        ),
      );

    const r = data.r;
    const x = scaleLinear().domain([-r, r]).range([0, width]);
    const yLim = Math.max(r * r * 1.15, 1e-9);
    const y = scaleLinear().domain([-yLim, yLim]).range([height, 0]);

    const fnLine = line<{ x: number; y: number }>()
      .x((d) => x(d.x))
      .y((d) => y(d.y));

    // The tangent at 0: y = 0 (f'(0) = 0).
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke', 'var(--bound)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6 4');

    g.append('path')
      .datum(data.fPts)
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 2)
      .attr('d', fnLine);

    // Secant through (0, 0) and (h, f(h)).
    const h = data.h;
    const fh = oscF(h);
    if (h <= r) {
      const slope = fh / h;
      const x2 = Math.min(r, h * 1.6);
      g.append('line')
        .attr('x1', x(0))
        .attr('y1', y(0))
        .attr('x2', x(x2))
        .attr('y2', y(slope * x2))
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', 2);
      g.append('circle')
        .attr('cx', x(h))
        .attr('cy', y(fh))
        .attr('r', 4)
        .attr('fill', 'var(--accent)');
      g.append('text')
        .attr('x', x(h) + 6)
        .attr('y', y(fh) - 6)
        .attr('font-size', 11)
        .attr('fill', 'currentColor')
        .text(`(h, f(h))`);
    }
    g.append('circle').attr('cx', x(0)).attr('cy', y(0)).attr('r', 4).attr('fill', 'var(--bound)');
    g.append('text')
      .attr('x', x(0) + 6)
      .attr('y', y(0) + 16)
      .attr('font-size', 11)
      .attr('fill', 'currentColor')
      .text(localize({ ko: "f'(0) = 0", en: "f'(0) = 0" }, lang));

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(5));
    g.append('g').call(axisLeft(y).ticks(5));
  };

  const drawFp = (data: DdOscData): void => {
    if (!chartFp) return;
    const { g, width, height } = chartFp;
    g.selectAll('*').remove();

    g.append('text')
      .attr('x', 0)
      .attr('y', -18)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          { ko: "f'(x) = 2x·sin(1/x) − cos(1/x), f'(0) = 0", en: "f'(x) = 2x·sin(1/x) − cos(1/x), f'(0) = 0" },
          lang,
        ),
      );

    const r = data.r;
    const x = scaleLinear().domain([-r, r]).range([0, width]);
    const y = scaleLinear().domain([-1.15, 1.15]).range([height, 0]);

    const fnLine = line<{ x: number; y: number }>()
      .x((d) => x(d.x))
      .y((d) => y(d.y));

    g.append('path')
      .datum(data.fpPts)
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1.5)
      .attr('d', fnLine);

    // The constant limit -1 along x_n = 1/(2 pi n).
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(-1))
      .attr('y2', y(-1))
      .attr('stroke', 'var(--bound)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6 4');
    g.append('text')
      .attr('x', width)
      .attr('y', y(-1) - 6)
      .attr('text-anchor', 'end')
      .attr('font-size', 11)
      .attr('fill', 'var(--bound)')
      .text(localize({ ko: 'xₙ = 1/(2πn)에서 −1', en: '−1 along xₙ = 1/(2πn)' }, lang));

    // The sequence points inside the window.
    g.selectAll('circle.seq')
      .data(data.seqPoints.filter((d) => d.x <= r))
      .join('circle')
      .attr('class', 'seq')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 4.5)
      .attr('fill', 'var(--accent)')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1);

    // f'(0) = 0 marker.
    g.append('circle').attr('cx', x(0)).attr('cy', y(0)).attr('r', 4).attr('fill', 'var(--bound)');
    g.append('text')
      .attr('x', x(0) + 6)
      .attr('y', y(0) - 8)
      .attr('font-size', 11)
      .attr('fill', 'currentColor')
      .text(localize({ ko: "f'(0) = 0", en: "f'(0) = 0" }, lang));

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(5));
    g.append('g').call(axisLeft(y).ticks(5));
  };

  const draw = (): void => {
    if (!last || !readoutSlot || !explainSlot || !verdictSlot) return;
    drawF(last.data);
    drawFp(last.data);
    setRichText(readoutSlot, readoutText(last.data, lang));
    setRichText(explainSlot, explainText(lang));
    setRichText(verdictSlot, verdictText(lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);

      // Split the shell's chart area into two side-by-side panels.
      shell.chartWrap.style.display = 'flex';
      shell.chartWrap.style.gap = '8px';
      wrapF = document.createElement('div');
      wrapF.style.cssText = 'flex: 1 1 50%; min-width: 0; position: relative;';
      wrapFp = document.createElement('div');
      wrapFp.style.cssText = 'flex: 1 1 50%; min-width: 0; position: relative;';
      shell.chartWrap.append(wrapF, wrapFp);
      chartF = createChart(wrapF, MARGIN);
      chartFp = createChart(wrapFp, MARGIN);

      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const explain = document.createElement('div');
      explain.style.marginTop = '4px';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      verdict.style.marginTop = '4px';

      const seeAlso = document.createElement('div');
      seeAlso.style.marginTop = '4px';
      const link = document.createElement('a');
      link.href = '../darboux/';
      link.textContent = localize(
        {
          ko: '다르부 정리 — 도함수는 불연속이어도 중간값 성질을 가진다',
          en: "Darboux's theorem — derivatives have the intermediate value property even when discontinuous",
        },
        lang,
      );
      seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), link);

      shell.strips.append(readout, explain, verdict, seeAlso);
      readoutSlot = createRichSlot(readout);
      explainSlot = createRichSlot(explain);
      verdictSlot = createRichSlot(verdict);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      if (chartF && wrapF) chartF.setSize(wrapF.clientWidth || 320, wrapF.clientHeight || 300);
      if (chartFp && wrapFp) chartFp.setSize(wrapFp.clientWidth || 320, wrapFp.clientHeight || 300);
      draw();
    },
    dispose() {
      chartF?.destroy();
      chartFp?.destroy();
      chartF = undefined;
      chartFp = undefined;
      wrapF = undefined;
      wrapFp = undefined;
      readoutSlot = undefined;
      explainSlot = undefined;
      verdictSlot = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<DdOscData>({ model: ddOscModel, createScene: createDdScene });
