import { axisBottom, axisLeft, scaleLinear, type Selection } from 'd3';
import {
  defineScene,
  localize,
  stripInlineMath,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { sequenceSpacesModel, term, type SequenceSpacesData } from '../models/sequence-spaces';

/**
 * Sequence spaces as the bridge between vector spaces and metric spaces.
 * Two views: (a) unit balls of the p-norms in R^2 — diamond (p=1), disk
 * (p=2), square (p=infinity); (b) the sequence tester x_n = 1/n^alpha with
 * membership readouts in l^1 / l^2 / l^infinity, showing the inclusion chain
 * l^1 subset l^2 subset l^infinity as alpha shrinks.
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

function normName(p: SequenceSpacesData['p'], lang: Lang): string {
  if (p === '1') return '\\(\\lVert x\\rVert_1 = \\sum \\lvert x_n\\rvert\\)';
  if (p === '2') return '\\(\\lVert x\\rVert_2 = (\\sum \\lvert x_n\\rvert^2)^{1/2}\\)';
  return localize(
    { ko: String.raw`\(\lVert x\rVert_\infty = \sup_n \lvert x_n\rvert\)`, en: String.raw`\(\lVert x\rVert_\infty = \sup_n \lvert x_n\rvert\)` },
    lang,
  );
}

function factsText(data: SequenceSpacesData, lang: Lang): string {
  const { view, p, alpha, membership, sumAbs, sumSq } = data;
  if (view === 'balls') {
    return localize(
      {
        ko: String.raw`${normName(p, lang)} — 단위 공 \(\lbrace x : \lVert x\rVert_p < 1\rbrace\)`,
        en: String.raw`${normName(p, lang)} — the unit ball \(\lbrace x : \lVert x\rVert_p < 1\rbrace\)`,
      },
      lang,
    );
  }
  const mark = (inside: boolean): string => (inside ? '✓' : '✗');
  return localize(
    {
      ko: String.raw`\(x_n = 1/n^{${fmt(alpha)}}\), \(\sum_{n=1}^{200} \lvert x_n\rvert \approx ${fmt(sumAbs)}\), \(\sum_{n=1}^{200} x_n^2 \approx ${fmt(sumSq)}\) — \(\ell^1\) ${mark(membership.inL1)} · \(\ell^2\) ${mark(membership.inL2)} · \(\ell^\infty\) ${mark(membership.inLInf)}`,
      en: String.raw`\(x_n = 1/n^{${fmt(alpha)}}\), \(\sum_{n=1}^{200} \lvert x_n\rvert \approx ${fmt(sumAbs)}\), \(\sum_{n=1}^{200} x_n^2 \approx ${fmt(sumSq)}\) — \(\ell^1\) ${mark(membership.inL1)} · \(\ell^2\) ${mark(membership.inL2)} · \(\ell^\infty\) ${mark(membership.inLInf)}`,
    },
    lang,
  );
}

function verdictText(data: SequenceSpacesData, lang: Lang): string {
  const { view, p } = data;
  if (view === 'balls') {
    const shape =
      p === '1'
        ? localize({ ko: '마름모', en: 'a diamond' }, lang)
        : p === '2'
          ? localize({ ko: '원판', en: 'a disk' }, lang)
          : localize({ ko: '정사각형', en: 'a square' }, lang);
    return localize(
      {
        ko: String.raw`같은 "단위 공"도 노름에 따라 ${shape} — 노름이 곧 거리를 만듭니다: \(d(x, y) = \lVert x - y\rVert\).`,
        en: String.raw`The same "unit ball" is ${shape} under a different norm — a norm induces a metric: \(d(x, y) = \lVert x - y\rVert\).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(\alpha\)를 줄이면 멤버십이 하나씩 떨어집니다 — \(\ell^1 \subset \ell^2 \subset \ell^\infty\). 제곱하면 수렴하는데 절댓값은 안 모이는 수열이 있습니다.`,
      en: String.raw`Shrink \(\alpha\) and memberships drop out one by one — \(\ell^1 \subset \ell^2 \subset \ell^\infty\). Some sequences converge when squared but not in absolute value.`,
    },
    lang,
  );
}

function centerMark(g: Selection<SVGGElement, unknown, null, undefined>, cx: number, cy: number): void {
  const s = 7;
  g.append('path')
    .attr('d', `M ${cx} ${cy - s} L ${cx + s} ${cy} L ${cx} ${cy + s} L ${cx - s} ${cy} Z`)
    .attr('fill', 'var(--accent)');
}

/** Number of sequence terms drawn in the sequence view. */
const DRAWN_TERMS = 30;

function createSequenceSpacesScene(): Scene<SequenceSpacesData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: SequenceSpacesData; state: ControlState } | undefined;

  const drawBalls = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { ballCurve } = data;

    const SPAN = 1.6;
    // The plot must be square: a unit ball has to look like a circle
    // (p = 2), a diamond (p = 1), or a square (p = inf) — never an ellipse.
    const side = Math.min(width, height);
    const x0 = (width - side) / 2;
    const y0 = (height - side) / 2;
    const xScale = scaleLinear().domain([-SPAN, SPAN]).range([x0, x0 + side]);
    const yScale = scaleLinear().domain([-SPAN, SPAN]).range([y0 + side, y0]);
    const cx = xScale(0);
    const cy = yScale(0);

    g.selectAll('*').remove();

    g.append('line')
      .attr('x1', x0)
      .attr('x2', x0 + side)
      .attr('y1', cy)
      .attr('y2', cy)
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.25);
    g.append('line')
      .attr('x1', cx)
      .attr('x2', cx)
      .attr('y1', y0)
      .attr('y2', y0 + side)
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.25);

    const path = ballCurve.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${xScale(x)} ${yScale(y)}`).join(' ') + ' Z';
    g.append('path')
      .attr('d', path)
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.18)
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 2);
    centerMark(g, cx, cy);

    g.append('g').attr('transform', `translate(0,${y0 + side - 8})`).call(axisBottom(xScale).ticks(8));
    g.append('g').attr('transform', `translate(${x0},0)`).call(axisLeft(yScale).ticks(8));
  };

  const drawSequence = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { alpha } = data;

    const terms: number[] = [];
    for (let n = 1; n <= DRAWN_TERMS; n++) terms.push(term(alpha, n));

    const xScale = scaleLinear().domain([0.5, DRAWN_TERMS + 0.5]).range([0, width]);
    const yScale = scaleLinear().domain([0, 1.05]).range([height, 0]);
    const bw = Math.max(1, (xScale(2) - xScale(1)) * 0.7);

    g.selectAll('*').remove();

    terms.forEach((t, i) => {
      const n = i + 1;
      g.append('rect')
        .attr('x', xScale(n) - bw / 2)
        .attr('y', yScale(t))
        .attr('width', bw)
        .attr('height', Math.max(0, yScale(0) - yScale(t)))
        .attr('fill', 'var(--accent)')
        .attr('opacity', 0.75);
    });

    g.append('g').attr('transform', `translate(0,${height - 8})`).call(axisBottom(xScale).ticks(10));
    g.append('g').call(axisLeft(yScale).ticks(6));
  };

  const draw = (): void => {
    if (!chart || !last || !factsSlot || !verdictSlot) return;
    const { data } = last;
    if (data.view === 'balls') drawBalls();
    else drawSequence();
    setRich(factsSlot, factsText(data, lang));
    setRich(verdictSlot, verdictText(data, lang));
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
      const facts = document.createElement('div');
      facts.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      strips.append(legend, facts, verdict);
      host.append(chartWrap, strips);

      setRich(
        makeSlot(legend),
        localize(
          {
            ko: String.raw`음영 = 단위 공 / 수열의 막대, 마름모 = 원점 — \(\ell^1 \subset \ell^2 \subset \ell^\infty\)`,
            en: String.raw`shading = the unit ball / sequence bars, diamond = the origin — \(\ell^1 \subset \ell^2 \subset \ell^\infty\)`,
          },
          lang,
        ),
      );
      factsSlot = makeSlot(facts);
      verdictSlot = makeSlot(verdict);
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

export default defineScene<SequenceSpacesData>({ model: sequenceSpacesModel, createScene: createSequenceSpacesScene });
