import { axisBottom, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { opensetsModel, type OpenSetData, type OpenSetKind } from '../models/opensets';

/**
 * Is S open? A number line shows the set S, a movable point x and its
 * eps-ball: green when the ball stays inside S, red when it leaks out.
 * The verdict line states whether S itself is open, with the reason.
 */

function setName(kind: OpenSetKind): string {
  switch (kind) {
    case 'open':
      return '(0, 1)';
    case 'closed':
      return '[0, 1]';
    case 'half':
      return '[0, 1)';
    case 'singleton':
      return '{0}';
  }
}

function factsText(kind: OpenSetKind, data: OpenSetData, lang: Lang): string {
  const name = setName(kind);
  const openMark = data.setIsOpen
    ? localize({ ko: '열린집합 O', en: 'open: yes' }, lang)
    : localize({ ko: '열린집합 X', en: 'open: no' }, lang);
  const closedMark = data.setIsClosed
    ? localize({ ko: '닫힌집합 O', en: 'closed: yes' }, lang)
    : localize({ ko: '닫힌집합 X', en: 'closed: no' }, lang);
  return `${name}: ${openMark} · ${closedMark}`;
}

function verdictText(data: OpenSetData, lang: Lang): string {
  const { x, eps, xInSet, ballInside, maxSafeEps } = data;
  if (!xInSet) {
    return localize(
      {
        ko: String.raw`\(x = ${fmt(x)}\)가 집합 밖에 있습니다 — 집합 안의 점을 고르세요.`,
        en: String.raw`\(x = ${fmt(x)}\) is outside the set — pick a point inside it.`,
      },
      lang,
    );
  }
  if (ballInside) {
    return localize(
      {
        ko: String.raw`\(\varepsilon = ${fmt(eps)}\) 공이 집합 안에 들어갑니다 (이 점에서의 최대 안전 반지름 \(\approx ${fmt(maxSafeEps)}\)).`,
        en: String.raw`The \(\varepsilon = ${fmt(eps)}\) ball stays inside the set (largest safe radius here \(\approx ${fmt(maxSafeEps)}\)).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(\varepsilon = ${fmt(eps)}\) 공이 밖으로 샙니다 — 이 점에서는 어떤 작은 \(\varepsilon\)로도 열림이 깨집니다.`,
      en: String.raw`The \(\varepsilon = ${fmt(eps)}\) ball leaks out — at this point no positive \(\varepsilon\) keeps the ball inside.`,
    },
    lang,
  );
}

function createOpensetsScene(): Scene<OpenSetData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: OpenSetData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !factsSlot || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { kind, x, eps, xInSet, ballInside } = data;

    const xScale = scaleLinear().domain([-0.5, 1.5]).range([0, width]);
    const yMid = height / 2;

    g.selectAll('*').remove();

    // Baseline.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yMid)
      .attr('y2', yMid)
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.35);

    // The eps-ball around x (drawn under the set).
    if (xInSet) {
      g.append('rect')
        .attr('x', xScale(x - eps))
        .attr('width', Math.max(0, xScale(x + eps) - xScale(x - eps)))
        .attr('y', yMid - 26)
        .attr('height', 52)
        .attr('fill', ballInside ? 'var(--accent)' : 'var(--bound)')
        .attr('opacity', 0.18);
    }

    // The set S.
    if (kind === 'singleton') {
      g.append('circle')
        .attr('cx', xScale(0))
        .attr('cy', yMid)
        .attr('r', 6)
        .attr('fill', 'var(--accent)')
        .attr('stroke', 'var(--accent)');
    } else {
      g.append('line')
        .attr('x1', xScale(0))
        .attr('x2', xScale(1))
        .attr('y1', yMid)
        .attr('y2', yMid)
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', 8)
        .attr('stroke-linecap', 'round');
      const endpoint = (cx: number, included: boolean): void => {
        g.append('circle')
          .attr('cx', xScale(cx))
          .attr('cy', yMid)
          .attr('r', 6)
          .attr('fill', included ? 'var(--accent)' : 'var(--bg)')
          .attr('stroke', 'var(--accent)')
          .attr('stroke-width', 2.5);
      };
      endpoint(0, kind === 'closed' || kind === 'half');
      endpoint(1, kind === 'closed');
    }

    // The point x as a diamond.
    if (xInSet) {
      const cx = xScale(x);
      const s = 7;
      g.append('path')
        .attr('d', `M ${cx} ${yMid - 34 - s} L ${cx + s} ${yMid - 34} L ${cx} ${yMid - 34 + s} L ${cx - s} ${yMid - 34} Z`)
        .attr('fill', ballInside ? 'var(--accent)' : 'var(--bound)');
    }

    g.append('g').attr('transform', `translate(0,${height - 8})`).call(axisBottom(xScale).ticks(10));

    setRichText(factsSlot, factsText(kind, data, lang));
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
      const facts = document.createElement('div');
      facts.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      strips.append(legend, facts, verdict);
      host.append(chartWrap, strips);

      setRichText(
        createRichSlot(legend),
        localize(
          {
            ko: String.raw`파란색 = 집합 \(S\), 음영 = 점 \(x\)의 \(\varepsilon\)-공, 마름모 = 점 \(x\)`,
            en: String.raw`blue = the set \(S\), shaded = the \(\varepsilon\)-ball around \(x\), diamond = the point \(x\)`,
          },
          lang,
        ),
      );
      factsSlot = createRichSlot(facts);
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

export default defineScene<OpenSetData>({ model: opensetsModel, createScene: createOpensetsScene });
