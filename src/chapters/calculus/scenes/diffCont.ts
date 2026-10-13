import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { diffContModel, type DiffContData, type DiffContSample } from '../models/diffCont';

/** ASCII hyphen-minus from fmt() becomes the typographic minus the brief uses. */
function pretty(v: number, digits: number): string {
  return fmt(v, digits).replace('-', '\u2212');
}

function createDiffContScene(): Scene<DiffContData> {
  let chart: Chart | undefined;
  let lang: Lang = 'ko';
  let last: { data: DiffContData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { w, samples, leftQuotient, rightQuotient } = data;
    const { g, width, height } = chart;

    const x = scaleLinear().domain([-w, w]).range([0, width]);
    // Fixed pixel aspect ratio: the x-range 2w spans `width` px, so the y-range
    // must span 2w * height/width to keep the V self-similar at every zoom.
    // The 0.625 floor guarantees the arms (up to y = w) stay inside the plot.
    const yRange = 2 * w * Math.max(height / width, 0.625);
    const yLo = -0.2 * yRange;
    const y = scaleLinear().domain([yLo, 0.8 * yRange]).range([height, 0]);

    const curve = line<DiffContSample>()
      .x((p) => x(p.x))
      .y((p) => y(p.y));

    g.selectAll('*').remove();
    g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(5));
    g.append('g').attr('transform', `translate(${x(0)},0)`).call(axisLeft(y).ticks(5));

    // Tangent-attempt lines with slopes -1 and +1 through the corner,
    // clamped to the plot box. They agree with the graph on one side and
    // miss it on the other: no single tangent exists.
    const ax = Math.max(-w, yLo);
    const bx = Math.min(w, -yLo);
    const dashed: Array<[[number, number], [number, number]]> = [
      [
        [ax, ax],
        [w, w],
      ],
      [
        [-w, w],
        [bx, -bx],
      ],
    ];
    for (const [[x1, y1], [x2, y2]] of dashed) {
      g.append('line')
        .attr('x1', x(x1))
        .attr('x2', x(x2))
        .attr('y1', y(y1))
        .attr('y2', y(y2))
        .attr('stroke', 'var(--bound)')
        .attr('stroke-dasharray', '6 4')
        .attr('stroke-width', 1.5);
    }

    g.append('path').attr('fill', 'none').attr('stroke-width', 2.5).style('stroke', 'var(--accent)').attr('d', curve(samples) ?? '');
    g.append('circle').attr('cx', x(0)).attr('cy', y(0)).attr('r', 5).attr('fill', 'var(--accent)');

    g.append('text')
      .attr('x', 8)
      .attr('y', 14)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `창 [\u2212${pretty(w, 4)}, ${pretty(w, 4)}] · 왼쪽 기울기 ${pretty(leftQuotient, 0)} · 오른쪽 기울기 +${pretty(rightQuotient, 0)}`,
            en: `window [\u2212${pretty(w, 4)}, ${pretty(w, 4)}] · left slope ${pretty(leftQuotient, 0)} · right slope +${pretty(rightQuotient, 0)}`,
          },
          lang,
        ),
      );
    g.append('text')
      .attr('x', 8)
      .attr('y', 32)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(
        localize(
          { ko: '확대해도 모서리가 그대로', en: 'the corner survives every zoom' },
          lang,
        ),
      );
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      chart = createChart(host);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      draw();
    },
    dispose() {
      chart?.destroy();
      chart = undefined;
      last = undefined;
    },
  };
}

export default defineScene<DiffContData>({ model: diffContModel, createScene: createDiffContScene });
