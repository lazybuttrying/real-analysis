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
import {
  XRANGE,
  continuityEquivalencesModel,
  type ContinuityEquivalencesData,
  type ContView,
  type CurvePoint,
} from '../models/continuityEquivalences';

/**
 * Tao, Analysis I, Prop 9.4.7, live: three equivalent faces of continuity
 * at x0 = 0 for f(x) = x^2 (continuous) versus the jump function
 * f(x) = x^2 (x < 0), x^2 + 1 (x >= 0) (discontinuous at 0).
 *
 * One chart, view-dependent overlays:
 *   epsdelta   - the eps-band around f(x0) and the sampled maximal delta;
 *   sequential - dots (x_n, f(x_n)) with dashed connectors to (x_n, 0);
 *   preimage   - the open interval V on the y-axis and its sampled preimage
 *                on the x-axis.
 * The verdict strip states which formulation holds or fails.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 64 };

const branchLine = line<CurvePoint>()
  .x((d) => d.x)
  .y((d) => d.y);

function viewTitle(view: ContView, lang: Lang): string {
  switch (view) {
    case 'epsdelta':
      return localize({ ko: 'ε-δ: ε 띠와 δ 구간', en: 'ε–δ: the ε-band and the δ-interval' }, lang);
    case 'sequential':
      return localize({ ko: '수열: x_n → 0 이면 f(x_n) → f(0) 인가', en: 'Sequential: does x_n → 0 give f(x_n) → f(0)?' }, lang);
    case 'preimage':
      return localize({ ko: '역상: 열린 집합 V의 역상', en: 'Preimage: the preimage of the open set V' }, lang);
  }
}

function fnName(data: ContinuityEquivalencesData): string {
  return data.fn === 'square' ? 'f(x) = x²' : 'f(x) = x² (x < 0), x² + 1 (x ≥ 0)';
}

function readoutText(data: ContinuityEquivalencesData, lang: Lang): string {
  const { view, eps, fx0, maxDelta, deltaWorks, seqMatches, vLo, vHi, preimageRadius, preimageHolds } = data;
  const name = fnName(data);
  switch (view) {
    case 'epsdelta': {
      const verdict = deltaWorks
        ? localize(
            {
              ko: String.raw`\(\delta_{\max} \approx ${fmt(maxDelta)}\)가 통합니다 — 이 \(\varepsilon\)에서는 띠를 벗어나는 점이 없습니다.`,
              en: String.raw`\(\delta_{\max} \approx ${fmt(maxDelta)}\) works — no point escapes the band at this \(\varepsilon\).`,
            },
            lang,
          )
        : localize(
            {
              ko: String.raw`어떤 \(\delta > 0\)도 통하지 않습니다 — \(\delta\)를 아무리 좁혀도 띠 밖의 점이 있습니다.`,
              en: String.raw`No \(\delta > 0\) works — however narrow the \(\delta\)-interval, some point escapes the band.`,
            },
            lang,
          );
      return localize(
        {
          ko: String.raw`${name}, \(\varepsilon = ${fmt(eps)}\), \(f(0) = ${fmt(fx0)}\): ${verdict}`,
          en: String.raw`${name}, \(\varepsilon = ${fmt(eps)}\), \(f(0) = ${fmt(fx0)}\): ${verdict}`,
        },
        lang,
      );
    }
    case 'sequential': {
      const verdict = seqMatches
        ? localize(
            {
              ko: String.raw`\(f(x_n) \to f(0)\)이 성립합니다 — 점들이 \((0, f(0))\)으로 모입니다.`,
              en: String.raw`\(f(x_n) \to f(0)\) holds — the dots gather at \((0, f(0))\).`,
            },
            lang,
          )
        : localize(
            {
              ko: String.raw`\(f(x_n) \not\to f(0)\) — 점들이 두 높이 사이를 오가며 모이지 않습니다.`,
              en: String.raw`\(f(x_n) \not\to f(0)\) — the dots bounce between two heights and never settle.`,
            },
            lang,
          );
      return localize(
        {
          ko: String.raw`${name}: \(x_n = (-1)^n/n \to 0\)에 대해 ${verdict}`,
          en: String.raw`${name}: for \(x_n = (-1)^n/n \to 0\), ${verdict}`,
        },
        lang,
      );
    }
    case 'preimage': {
      const verdict = preimageHolds
        ? localize(
            {
              ko: String.raw`\(f^{-1}(V)\)가 \((-${fmt(preimageRadius)}, ${fmt(preimageRadius)})\)을 포함합니다 — \(0\)의 근방입니다.`,
              en: String.raw`\(f^{-1}(V)\) contains \((-${fmt(preimageRadius)}, ${fmt(preimageRadius)})\) — a neighborhood of \(0\).`,
            },
            lang,
          )
        : localize(
            {
              ko: String.raw`\(f^{-1}(V)\)가 \(0\) 주변의 어떤 구간도 포함하지 않습니다 — 근방이 아닙니다.`,
              en: String.raw`\(f^{-1}(V)\) contains no interval around \(0\) — not a neighborhood.`,
            },
            lang,
          );
      return localize(
        {
          ko: String.raw`${name}: \(V = (${fmt(vLo)}, ${fmt(vHi)})\)에 대해 ${verdict}`,
          en: String.raw`${name}: for \(V = (${fmt(vLo)}, ${fmt(vHi)})\), ${verdict}`,
        },
        lang,
      );
    }
  }
}

function verdictText(data: ContinuityEquivalencesData, lang: Lang): string {
  const { fn, view } = data;
  const holds = view === 'epsdelta' ? data.deltaWorks : view === 'sequential' ? data.seqMatches : data.preimageHolds;
  if (fn === 'square') {
    return localize(
      {
        ko: String.raw`\(f(x) = x^2\)는 \(0\)에서 연속입니다 — 세 formulation이 모두 성립합니다${holds ? '.' : ' (이 \(\varepsilon\)에서는 보이지 않지만, 모든 \(\varepsilon\)에 대해 성립합니다).'}`,
        en: String.raw`\(f(x) = x^2\) is continuous at \(0\) — all three formulations hold${holds ? '.' : ' (not visible at this \(\varepsilon\), but true for every \(\varepsilon\)).'}`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`점프 함수는 \(0\)에서 불연속입니다 — 세 formulation이 모두 깨집니다${holds ? ' (이 \(\varepsilon\)에서는 결함이 가려지지만, \(\varepsilon\)을 좁히면 드러납니다).' : '.'}`,
      en: String.raw`The jump function is discontinuous at \(0\) — all three formulations fail${holds ? ' (hidden at this \(\varepsilon\); shrink \(\varepsilon\) to expose it).' : '.'}`,
    },
    lang,
  );
}

function createContinuityEquivalencesScene(): Scene<ContinuityEquivalencesData> {
  let shell: SceneShell | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: ContinuityEquivalencesData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !readoutSlot || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { fn, view, eps, x0, fx0, maxDelta, deltaWorks, terms, vLo, vHi, preimageIntervals, yMax } = data;
    g.selectAll('*').remove();

    const yLo = Math.min(-0.1, vLo - 0.1);
    const x = scaleLinear().domain([-XRANGE, XRANGE]).range([0, width]);
    const y = scaleLinear().domain([yLo, yMax]).range([height, 0]);

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(6));

    g.append('text')
      .attr('x', 0)
      .attr('y', -20)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(`${fnName(data)} — ${viewTitle(view, lang)}`);

    const px = branchLine.x((d) => x(d.x)).y((d) => y(d.y));

    // View-dependent shaded regions first (under the curve).
    if (view === 'epsdelta') {
      // The eps-band around f(x0).
      g.append('rect')
        .attr('x', 0)
        .attr('width', width)
        .attr('y', y(fx0 + eps))
        .attr('height', Math.max(0, y(fx0 - eps) - y(fx0 + eps)))
        .attr('fill', 'var(--bound)')
        .attr('opacity', 0.14);
      // The delta-interval on the x-axis.
      if (deltaWorks) {
        g.append('rect')
          .attr('x', x(-maxDelta))
          .attr('width', Math.max(0, x(maxDelta) - x(-maxDelta)))
          .attr('y', 0)
          .attr('height', height)
          .attr('fill', 'var(--accent)')
          .attr('opacity', 0.12);
      }
    }
    if (view === 'preimage') {
      // V on the y-axis (full-width band) and its preimage strips on x.
      g.append('rect')
        .attr('x', 0)
        .attr('width', width)
        .attr('y', y(vHi))
        .attr('height', Math.max(0, y(vLo) - y(vHi)))
        .attr('fill', 'var(--bound)')
        .attr('opacity', 0.14);
      for (const iv of preimageIntervals) {
        g.append('rect')
          .attr('x', x(iv.lo))
          .attr('width', Math.max(0, x(iv.hi) - x(iv.lo)))
          .attr('y', 0)
          .attr('height', height)
          .attr('fill', 'var(--accent)')
          .attr('opacity', 0.16);
      }
    }

    // The function curve: two branches so the jump has no connecting line.
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)')
      .attr('d', px(data.curveLeft) ?? '');
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)')
      .attr('d', px(data.curveRight) ?? '');

    // Dashed guides per view.
    if (view === 'epsdelta') {
      for (const level of [fx0 - eps, fx0 + eps]) {
        g.append('line')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', y(level))
          .attr('y2', y(level))
          .attr('stroke', 'var(--bound)')
          .attr('stroke-dasharray', '4 3')
          .attr('opacity', 0.8);
      }
      if (deltaWorks) {
        for (const edge of [-maxDelta, maxDelta]) {
          g.append('line')
            .attr('x1', x(edge))
            .attr('x2', x(edge))
            .attr('y1', 0)
            .attr('y2', height)
            .attr('stroke', 'var(--accent)')
            .attr('stroke-dasharray', '4 3')
            .attr('opacity', 0.8);
        }
      }
    }
    if (view === 'preimage') {
      for (const level of [vLo, vHi]) {
        g.append('line')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', y(level))
          .attr('y2', y(level))
          .attr('stroke', 'var(--bound)')
          .attr('stroke-dasharray', '4 3')
          .attr('opacity', 0.8);
      }
    }

    // The point (x0, f(x0)): filled; for the jump, an open dot marks the
    // left-hand value 0 that the curve approaches but never takes at 0.
    g.append('circle')
      .attr('cx', x(x0))
      .attr('cy', y(fx0))
      .attr('r', 5)
      .style('fill', 'var(--bound)');
    if (fn === 'jump') {
      g.append('circle')
        .attr('cx', x(x0))
        .attr('cy', y(0))
        .attr('r', 5)
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .style('stroke', 'var(--accent)');
    }

    // Sequential view: dots (x_n, f(x_n)) with dashed connectors to (x_n, 0).
    if (view === 'sequential') {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(fx0))
        .attr('y2', y(fx0))
        .attr('stroke', 'var(--bound)')
        .attr('stroke-dasharray', '6 4')
        .attr('opacity', 0.8);
      for (const t of terms) {
        const cx = x(t.xn);
        g.append('line')
          .attr('x1', cx)
          .attr('x2', cx)
          .attr('y1', y(0))
          .attr('y2', y(t.fxn))
          .attr('stroke', 'var(--accent)')
          .attr('stroke-dasharray', '3 2')
          .attr('opacity', 0.45);
        g.append('circle').attr('cx', cx).attr('cy', y(0)).attr('r', 2).attr('fill', 'currentColor').attr('opacity', 0.5);
        g.append('circle').attr('cx', cx).attr('cy', y(t.fxn)).attr('r', 3).style('fill', 'var(--accent)');
      }
    }

    setRichText(readoutSlot, readoutText(data, lang));
    setRichText(verdictSlot, verdictText(data, lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);
      wrap = shell.chartWrap;
      chart = createChart(wrap, MARGIN);

      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      verdict.style.marginTop = '4px';

      shell.strips.append(readout, verdict);
      readoutSlot = createRichSlot(readout);
      verdictSlot = createRichSlot(verdict);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      if (chart && wrap) chart.setSize(wrap.clientWidth || 640, wrap.clientHeight || 300);
      draw();
    },
    dispose() {
      chart?.destroy();
      chart = undefined;
      readoutSlot = undefined;
      verdictSlot = undefined;
      wrap = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<ContinuityEquivalencesData>({
  model: continuityEquivalencesModel,
  createScene: createContinuityEquivalencesScene,
});
