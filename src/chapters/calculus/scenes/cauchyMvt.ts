import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { cauchyMvtModel, type CauchyMVTData } from '../models/cauchyMvt';

/**
 * The parametric curve (g(t), f(t)) = (t^3, t^2) on [1, 2], its chord, and
 * the tangent at the slider point xi. The readout shows the chord slope
 * 3/7 against the slope ratio f'(xi)/g'(xi) = 2/(3 xi); at the theorem point
 * xi = 14/9 the two agree and the tangent turns parallel to the chord.
 */

function readoutText(data: CauchyMVTData, parallel: boolean, lang: Lang): string {
  const ko = String.raw`할선 기울기 \(\frac{f(2)-f(1)}{g(2)-g(1)} = \frac{3}{7} \approx ${fmt(
    data.chordSlope,
    4,
  )}\), 접선 비율 \(\frac{f'(\xi)}{g'(\xi)} = \frac{2}{3\xi} \approx ${fmt(
    data.tangentSlopeRatio,
    4,
  )}\)${parallel ? String.raw` — 평행 ✓` : ''}`;
  const en = String.raw`Chord slope \(\frac{f(2)-f(1)}{g(2)-g(1)} = \frac{3}{7} \approx ${fmt(
    data.chordSlope,
    4,
  )}\), tangent ratio \(\frac{f'(\xi)}{g'(\xi)} = \frac{2}{3\xi} \approx ${fmt(
    data.tangentSlopeRatio,
    4,
  )}\)${parallel ? String.raw` — parallel ✓` : ''}`;
  return localize({ ko, en }, lang);
}

function createCauchyMVTScene(): Scene<CauchyMVTData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: CauchyMVTData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !readoutSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { curve, xi, chordSlope, tangentSlopeRatio, theoremXi } = data;
    const first = curve[0];
    const lastCurve = curve[curve.length - 1];
    if (!first || !lastCurve) return;

    const px = (t: number): number => t * t * t;
    const py = (t: number): number => t * t;
    const xa = px(1);
    const xb = px(2);
    const ya = py(1);
    const yb = py(2);

    const x = scaleLinear().domain([0, xb + 0.6]).range([0, width]);
    const y = scaleLinear().domain([0, yb + 0.6]).range([height, 0]);

    const curveLine = line<{ x: number; y: number }>()
      .x((p) => x(p.x))
      .y((p) => y(p.y));

    const parallel = Math.abs(tangentSlopeRatio - chordSlope) < 0.002;

    // Tangent at xi: through (xi^3, xi^2) with slope 2/(3 xi).
    const m = tangentSlopeRatio;
    const tx = px(xi);
    const ty = py(xi);
    const tanAt = (xx: number): number => ty + m * (xx - tx);

    g.selectAll('*').remove();
    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));
    g.append('g').call(axisLeft(y).ticks(5));

    // The chord (dashed, bound color).
    g.append('line')
      .attr('x1', x(xa))
      .attr('x2', x(xb))
      .attr('y1', y(ya))
      .attr('y2', y(yb))
      .attr('stroke', 'var(--bound)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 4');

    // The parametric curve (g(t), f(t)).
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)')
      .attr('d', curveLine(curve) ?? '');

    // The tangent at xi (accent when parallel to the chord, muted otherwise).
    g.append('line')
      .attr('x1', x(0))
      .attr('x2', x(xb + 0.6))
      .attr('y1', y(tanAt(0)))
      .attr('y2', y(tanAt(xb + 0.6)))
      .style('stroke', parallel ? 'var(--accent)' : 'var(--muted)')
      .attr('stroke-width', 2)
      .attr('opacity', parallel ? 0.95 : 0.5);

    // The point (g(xi), f(xi)) and the theorem point.
    g.append('circle')
      .attr('cx', x(tx))
      .attr('cy', y(ty))
      .attr('r', 5)
      .attr('fill', 'var(--accent)')
      .append('title')
      .text(`xi = ${fmt(xi, 4)}`);
    g.append('circle')
      .attr('cx', x(px(theoremXi)))
      .attr('cy', y(py(theoremXi)))
      .attr('r', 5)
      .attr('fill', 'none')
      .attr('stroke', 'var(--bound)')
      .attr('stroke-width', 2)
      .append('title')
      .text(`14/9 = ${fmt(theoremXi, 4)}`);

    g.append('text')
      .attr('x', 8)
      .attr('y', 14)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(`(g(t), f(t)) = (t^3, t^2), t in [1, 2]`);

    setRichText(readoutSlot, readoutText(data, parallel, lang));
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
      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      strips.append(readout);
      host.append(chartWrap, strips);

      readoutSlot = createRichSlot(readout);
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

export default defineScene<CauchyMVTData>({ model: cauchyMvtModel, createScene: createCauchyMVTScene });
