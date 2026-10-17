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
import { contractionModel, type ContractionData } from '../models/contraction';

/**
 * The contraction mapping principle on a number line: Picard iterates
 * x_{n+1} = T(x_n) march toward the fixed point while the a-priori error
 * ball |x - x*| <= q^n/(1-q) * |x_1 - x_0| shrinks around it. Two maps:
 * T(x) = x/2 + 1 on R (the ball collapses onto x* = 2), and T(x) = x/2 on the
 * incomplete space (0, 1] (the iterates are Cauchy but drain toward the
 * missing limit 0, drawn as a hollow ghost — no fixed point in the space).
 */

const MARGIN = { top: 20, right: 24, bottom: 48, left: 24 };

const DOMAIN: Record<ContractionData['map'], [number, number]> = {
  affine: [-0.1, 3.1],
  half: [-0.12, 1.12],
};

const TICKS: Record<ContractionData['map'], readonly number[]> = {
  affine: [0, 1, 2, 3],
  half: [0, 0.25, 0.5, 0.75, 1],
};

function titleText(data: ContractionData, lang: Lang): string {
  const { map, n } = data;
  return localize(
    {
      ko:
        map === 'affine'
          ? String.raw`\(T(x) = x/2 + 1\) (\(\mathbb{R}\) 위, \(q = 1/2\)) — 피카르 반복 \(n = ${n}\)`
          : String.raw`\(T(x) = x/2\) (\((0,1]\) 위, \(q = 1/2\)) — 피카르 반복 \(n = ${n}\)`,
      en:
        map === 'affine'
          ? String.raw`\(T(x) = x/2 + 1\) on \(\mathbb{R}\) (\(q = 1/2\)) — Picard iterates, \(n = ${n}\)`
          : String.raw`\(T(x) = x/2\) on \((0,1]\) (\(q = 1/2\)) — Picard iterates, \(n = ${n}\)`,
    },
    lang,
  );
}

function factsText(data: ContractionData, lang: Lang): string {
  const { map, n, iterates, radius } = data;
  const xn = iterates[iterates.length - 1] ?? 0;
  if (map === 'affine') {
    return localize(
      {
        ko: String.raw`\(n=${n}\): \(x_{${n}} = ${fmt(xn, 6)}\), 오차공 \(|x - 2| \le r_{${n}} = ${fmt(radius, 6)}\) — 실제 오차 \(|x_{${n}} - 2| = ${fmt(Math.abs(xn - 2), 6)}\)가 상한과 일치합니다.`,
        en: String.raw`\(n=${n}\): \(x_{${n}} = ${fmt(xn, 6)}\), error ball \(|x - 2| \le r_{${n}} = ${fmt(radius, 6)}\) — the actual error \(|x_{${n}} - 2| = ${fmt(Math.abs(xn - 2), 6)}\) meets the bound exactly.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(n=${n}\): \(x_{${n}} = ${fmt(xn, 6)}\), \(|x_{${n}} - 0| \le r_{${n}} = ${fmt(radius, 6)}\) — 코시수열이지만 극한 \(0\)은 \((0,1]\) 밖에 있습니다.`,
      en: String.raw`\(n=${n}\): \(x_{${n}} = ${fmt(xn, 6)}\), \(|x_{${n}} - 0| \le r_{${n}} = ${fmt(radius, 6)}\) — a Cauchy sequence whose limit \(0\) lies outside \((0,1]\).`,
    },
    lang,
  );
}

function verdictText(data: ContractionData, lang: Lang): string {
  if (data.map === 'affine') {
    return localize(
      {
        ko: String.raw`완비 공간 \(\mathbb{R}\)에서 수축사상은 유일한 고정점을 갖습니다 — 축소사상 원리. 오차공은 \(q^n/(1-q) = 2^{-n}\) 비율로 조여듭니다.`,
        en: String.raw`On the complete space \(\mathbb{R}\) a contraction has a unique fixed point — the contraction mapping principle. The error ball tightens at the rate \(q^n/(1-q) = 2^{-n}\).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\((0,1]\)은 완비이지 않습니다 — \(q = 1/2\)인 수축사상인데도 고정점이 없습니다. 완비성이 빠지면 정리가 무너집니다.`,
      en: String.raw`\((0,1]\) is not complete — a contraction with \(q = 1/2\) yet no fixed point. Without completeness the theorem collapses.`,
    },
    lang,
  );
}

function createContractionScene(): Scene<ContractionData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let titleSlot: RichSlot | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: ContractionData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !titleSlot || !factsSlot || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { map, n, iterates, fixedPoint, ambientLimit, radius } = data;

    g.selectAll('*').remove();

    const [dMin, dMax] = DOMAIN[map];
    const x = scaleLinear().domain([dMin, dMax]).range([0, width]);
    const lineY = height * 0.45;

    // Arrowhead for the iterate trail.
    const defs = g.append('defs');
    defs
      .append('marker')
      .attr('id', 'contraction-arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 8)
      .attr('refY', 5)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 1 L 9 5 L 0 9 z')
      .attr('fill', 'var(--accent)');

    // Axis.
    g.append('g')
      .attr('transform', `translate(0,${lineY})`)
      .call(
        axisBottom(x)
          .tickValues([...TICKS[map]])
          .tickFormat((d) => String(d)),
      );

    // Error ball: the interval [c - r, c + r] around the (ambient) limit,
    // clipped to the visible domain.
    const center = fixedPoint ?? ambientLimit;
    const ballL = Math.max(dMin, center - radius);
    const ballR = Math.min(dMax, center + radius);
    const ballIsGhost = fixedPoint === null;
    if (ballR > ballL) {
      g.append('rect')
        .attr('x', x(ballL))
        .attr('y', lineY - 26)
        .attr('width', Math.max(1, x(ballR) - x(ballL)))
        .attr('height', 52)
        .style('fill', 'var(--accent)')
        .attr('opacity', ballIsGhost ? 0.08 : 0.15);
      for (const edge of [ballL, ballR]) {
        g.append('line')
          .attr('x1', x(edge))
          .attr('x2', x(edge))
          .attr('y1', lineY - 26)
          .attr('y2', lineY + 26)
          .attr('stroke', 'var(--accent)')
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', ballIsGhost ? '4 3' : null)
          .attr('opacity', 0.7);
      }
    }

    // Iterate trail: arcs above the line, arrows pointing forward.
    const arcH = 16;
    for (let k = 0; k < iterates.length - 1; k++) {
      const a = iterates[k] ?? 0;
      const b = iterates[k + 1] ?? 0;
      const mid = (a + b) / 2;
      g.append('path')
        .attr('d', `M ${x(a)} ${lineY} Q ${x(mid)} ${lineY - arcH} ${x(b)} ${lineY}`)
        .attr('fill', 'none')
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.55)
        .attr('marker-end', 'url(#contraction-arrow)');
    }

    // Iterate dots; label only the first and the last to avoid clutter.
    iterates.forEach((v, k) => {
      const isFirst = k === 0;
      const isLast = k === iterates.length - 1;
      g.append('circle')
        .attr('cx', x(v))
        .attr('cy', lineY)
        .attr('r', isLast ? 6 : 4)
        .attr('fill', isLast ? 'var(--accent)' : 'currentColor')
        .attr('opacity', isLast ? 1 : 0.55);
      if (isFirst || isLast) {
        g.append('text')
          .attr('x', x(v))
          .attr('y', lineY + 34)
          .attr('text-anchor', 'middle')
          .attr('font-size', 12)
          .attr('fill', 'currentColor')
          .text(`x_${k}`);
      }
    });

    // The fixed point (solid ring) or the missing limit (hollow ghost).
    if (fixedPoint !== null) {
      g.append('circle')
        .attr('cx', x(fixedPoint))
        .attr('cy', lineY)
        .attr('r', 7)
        .attr('fill', 'none')
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', 2.5);
      g.append('text')
        .attr('x', x(fixedPoint))
        .attr('y', lineY - 34)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .style('fill', 'var(--accent)')
        .text('x* = 2');
    } else {
      g.append('circle')
        .attr('cx', x(ambientLimit))
        .attr('cy', lineY)
        .attr('r', 7)
        .attr('fill', 'none')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4 3')
        .attr('opacity', 0.6);
      g.append('text')
        .attr('x', Math.min(width - 4, x(ambientLimit) + 12))
        .attr('y', lineY - 34)
        .attr('text-anchor', 'start')
        .attr('font-size', 12)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.75)
        .text(localize({ ko: '0은 (0,1] 밖에 있음', en: '0 is outside (0,1]' }, lang));
    }

    // Radius label above the ball.
    g.append('text')
      .attr('x', x(Math.min(dMax, Math.max(dMin, center))))
      .attr('y', lineY - 46)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(
        localize(
          { ko: `반지름 r_${n} = ${fmt(radius, 6)}`, en: `radius r_${n} = ${fmt(radius, 6)}` },
          lang,
        ),
      );

    // Legend.
    const legendY = height + 36;
    g.append('text')
      .attr('x', 8)
      .attr('y', legendY)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: `● x_${n} (마지막 반복값) · ○ 고정점`, en: `● x_${n} (last iterate) · ○ fixed point` }, lang));
    g.append('text')
      .attr('x', width / 2)
      .attr('y', legendY)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.6)
      .text(
        localize(
          {
            ko: `밴드 = 오차공 |x − ${map === 'affine' ? '2' : '0'}| ≤ r_${n}`,
            en: `band = error ball |x − ${map === 'affine' ? '2' : '0'}| ≤ r_${n}`,
          },
          lang,
        ),
      );

    setRichText(titleSlot, titleText(data, lang));
    setRichText(factsSlot, factsText(data, lang));
    setRichText(verdictSlot, verdictText(data, lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      hostEl = host;
      host.style.display = 'flex';
      host.style.flexDirection = 'column';

      const title = document.createElement('div');
      title.style.cssText = 'padding: 2px 12px 0; font-size: 13px; font-weight: 600; flex: none;';
      const chartWrap = document.createElement('div');
      chartWrap.style.cssText = 'flex: 1 1 auto; min-height: 0; position: relative;';
      const strips = document.createElement('div');
      strips.style.cssText = 'padding: 6px 12px 8px; font-size: 13px; flex: none;';
      const facts = document.createElement('div');
      facts.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      strips.append(facts, verdict);
      host.append(title, chartWrap, strips);

      titleSlot = createRichSlot(title);
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
      titleSlot = undefined;
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

export default defineScene<ContractionData>({ model: contractionModel, createScene: createContractionScene });
