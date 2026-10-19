import { axisBottom, axisLeft, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, fmt, type Chart, type SceneShell } from '../../../view/d3kit';
import { thomaeModel, type ThomaeData } from '../models/thomae';

/**
 * Thomae's popcorn function, live. Dots (p/q, 1/q) in lowest terms for
 * q <= Q inside a zoom window around a center point. The finitely many
 * dots with height >= epsilon are highlighted: near an irrational
 * center, only these finitely many dots reach the epsilon line, so the
 * minimum distance from the center to them is a valid delta. At a
 * rational center the argument collapses (delta = 0).
 */

const MARGIN = { top: 36, right: 20, bottom: 44, left: 64 };

function readoutText(data: ThomaeData, lang: Lang): string {
  const inView = data.dots.filter(
    (d) => Math.abs(d.x - data.center) <= data.zoom,
  ).length;
  const tallInView = data.tallDots.filter(
    (d) => Math.abs(d.x - data.center) <= data.zoom,
  ).length;
  const base = localize(
    {
      ko: String.raw`\(\varepsilon = ${fmt(data.epsilon, 2)}\): 높이가 \(\varepsilon\) 이상인 점은 전부 \({data.tallDots.length}\)개로 유한하고 (분모 \(q \le 1/\varepsilon\)인 유리수뿐), 보기 창 안에는 \({tallInView}\)개가 있습니다. \(x_0 = ${fmt(data.center, 6)}\)에서 \(\delta = ${fmt(data.delta, 4)}\)이므로 \(|x - x_0| < \delta \Rightarrow f(x) < \varepsilon\)입니다. (창 안의 점 ${inView}개)`,
      en: String.raw`\(\varepsilon = ${fmt(data.epsilon, 2)}\): only ${data.tallDots.length} dots reach height \(\varepsilon\) — finitely many (rationals with denominator \(q \le 1/\varepsilon\)), ${tallInView} of them in view. At \(x_0 = ${fmt(data.center, 6)}\), \(\delta = ${fmt(data.delta, 4)}\), so \(|x - x_0| < \delta \Rightarrow f(x) < \varepsilon\). (${inView} dots in view)`,
    },
    lang,
  );
  if (data.centerIsTallRational) {
    return (
      base +
      localize(
        {
          ko: String.raw` 단, 중심 \(x_0\) 자체가 높이가 \(\varepsilon\) 이상인 유리수이므로 (\(\delta = 0\)) — 무리수에서의 연속성 논증은 여기서 적용되지 않습니다 (아래 문제 1).`,
          en: String.raw` But the center \(x_0\) is itself a rational with height \(\ge \varepsilon\) (\(\delta = 0\)) — the continuity argument for irrationals does not apply here (problem 1 below).`,
        },
        lang,
      )
    );
  }
  return base;
}

function explainText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`회색 점은 \(f(p/q) = 1/q\)인 유리수들, 강조된 점은 높이가 \(\varepsilon\) 이상인 유한개의 점입니다. 무리수 \(x_0\) 근처에서는 이 유한개의 점만 \(\varepsilon\) 선에 닿으므로, 그중 \(x_0\)에 가장 가까운 점까지의 거리를 \(\delta\)로 잡으면 \(|x - x_0| < \delta\)인 모든 \(x\)에서 \(f(x) < \varepsilon\)이 됩니다 — 이것이 무리수에서의 연속성 증명 그 자체입니다 (아래 문제 2). 창을 좁히면 점들이 0으로 납작해지는 모습이 보입니다.`,
      en: String.raw`The gray dots are the rationals \(f(p/q) = 1/q\); the highlighted ones are the finitely many dots with height \(\ge \varepsilon\). Near an irrational \(x_0\), only these finitely many dots reach the \(\varepsilon\) line, so taking \(\delta\) to be the distance to the nearest one gives \(f(x) < \varepsilon\) for every \(x\) with \(|x - x_0| < \delta\) — the continuity proof at irrationals, live (problem 2 below). Narrow the window and watch the dots flatten toward 0.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`토메 함수는 모든 무리수에서 연속이고 모든 유리수에서 불연속입니다 — 유리수에서는 \(f(x_0) = 1/q > 0\)인 반면 무리수 수열을 따라 \(f \to 0\)이므로 \(\varepsilon\)-근방 논증이 깨집니다 (아래 문제 1).`,
      en: String.raw`Thomae's function is continuous at every irrational and discontinuous at every rational — at a rational \(f(x_0) = 1/q > 0\) while \(f \to 0\) along irrationals, breaking the \(\varepsilon\)-argument (problem 1 below).`,
    },
    lang,
  );
}

function createThomaeScene(): Scene<ThomaeData> {
  let shell: SceneShell | undefined;
  let mainChart: Chart | undefined;
  let mainWrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let explainSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: ThomaeData; state: ControlState } | undefined;

  const drawMain = (data: ThomaeData): void => {
    if (!mainChart) return;
    const { g, width, height } = mainChart;
    g.selectAll('*').remove();

    const lo = data.center - data.zoom;
    const hi = data.center + data.zoom;
    const inView = data.dots.filter((d) => d.x >= lo && d.x <= hi);
    const tallInView = data.tallDots.filter((d) => d.x >= lo && d.x <= hi);
    const tallSet = new Set(tallInView);

    g.append('text')
      .attr('x', 0)
      .attr('y', -18)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `토메 함수: f(p/q) = 1/q, 무리수에서는 0 (x₀ = ${fmt(data.center, 4)} 근처)`,
            en: `Thomae's function: f(p/q) = 1/q, 0 at irrationals (near x₀ = ${fmt(data.center, 4)})`,
          },
          lang,
        ),
      );

    const x = scaleLinear().domain([lo, hi]).range([0, width]);
    const y = scaleLinear().domain([0, 1.12]).range([height, 0]);

    // Epsilon line.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(data.epsilon))
      .attr('y2', y(data.epsilon))
      .attr('stroke', 'var(--bound)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6 4');
    g.append('text')
      .attr('x', width)
      .attr('y', y(data.epsilon) - 6)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', 'var(--bound)')
      .text(`ε = ${fmt(data.epsilon, 2)}`);

    // Center line.
    g.append('line')
      .attr('x1', x(data.center))
      .attr('x2', x(data.center))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6 4')
      .attr('opacity', 0.5);
    g.append('text')
      .attr('x', x(data.center) + 5)
      .attr('y', 14)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.8)
      .text('x₀');

    // The ordinary (short) dots.
    g.selectAll('circle.short')
      .data(inView.filter((d) => !tallSet.has(d)))
      .join('circle')
      .attr('class', 'short')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 2)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.45);

    // The finitely many tall dots.
    g.selectAll('circle.tall')
      .data(tallInView)
      .join('circle')
      .attr('class', 'tall')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 4.5)
      .attr('fill', 'var(--accent)')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1);

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(6));

    g.append('text')
      .attr('x', width)
      .attr('y', height + 34)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `Q = ${data.qMax} · 창 [${fmt(lo, 3)}, ${fmt(hi, 3)}]`,
            en: `Q = ${data.qMax} · window [${fmt(lo, 3)}, ${fmt(hi, 3)}]`,
          },
          lang,
        ),
      );
  };

  const draw = (): void => {
    if (!last || !readoutSlot || !explainSlot || !verdictSlot) return;
    drawMain(last.data);
    setRichText(readoutSlot, readoutText(last.data, lang));
    setRichText(explainSlot, explainText(lang));
    setRichText(verdictSlot, verdictText(lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);

      mainWrap = shell.chartWrap;
      mainChart = createChart(mainWrap, MARGIN);

      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const explain = document.createElement('div');
      explain.style.marginTop = '4px';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      verdict.style.marginTop = '4px';

      shell.strips.append(readout, explain, verdict);
      readoutSlot = createRichSlot(readout);
      explainSlot = createRichSlot(explain);
      verdictSlot = createRichSlot(verdict);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      if (mainChart && mainWrap) mainChart.setSize(mainWrap.clientWidth || 640, mainWrap.clientHeight || 300);
      draw();
    },
    dispose() {
      mainChart?.destroy();
      mainChart = undefined;
      readoutSlot = undefined;
      explainSlot = undefined;
      verdictSlot = undefined;
      mainWrap = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<ThomaeData>({ model: thomaeModel, createScene: createThomaeScene });
