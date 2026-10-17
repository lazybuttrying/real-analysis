import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  stripInlineMath,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createChart, type Chart } from '../../../view/d3kit';
import {
  boundedVariationModel,
  SINE_VARIATION_TRUE,
  type BoundedVariationData,
  type BoundedVariationFn,
} from '../models/boundedVariation';

/**
 * Bounded variation, live. Top panel: the example function sampled on the
 * uniform n-point partition — 'sine' (f(x) = sin 2 pi x, of bounded
 * variation) versus 'wild' (f(x) = x sin(1/x), f(0) = 0, not of bounded
 * variation). Bottom panel: the cumulative variation curve, settling onto
 * the dashed asymptote V = 4 for sine and climbing past every bound for
 * the wild example. The slider moves the partition point count n from 2
 * to 200.
 */

const MARGIN = { top: 48, right: 20, bottom: 40, left: 64 };

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

function fnLabel(fn: BoundedVariationFn, lang: Lang): string {
  if (fn === 'wild') {
    return localize(
      { ko: String.raw`\(f(x) = x\sin\frac{1}{x}\) (\(f(0) = 0\))`, en: String.raw`\(f(x) = x\sin\frac{1}{x}\) (\(f(0) = 0\))` },
      lang,
    );
  }
  return localize(
    { ko: String.raw`\(f(x) = \sin 2\pi x\)`, en: String.raw`\(f(x) = \sin 2\pi x\)` },
    lang,
  );
}

function readoutText(data: BoundedVariationData, lang: Lang): string {
  const { fn, n, variation } = data;
  if (fn === 'wild') {
    return localize(
      {
        ko: String.raw`\(n = ${n}\): \(V_{${n}} = \sum_{i=1}^{${n - 1}}|f(x_i) - f(x_{i-1})| \approx ${variation.toFixed(4)}\) — 분할을 잘게 쪼갤수록 변분이 계속 커지며 어떤 상한 아래도 들어가지 않습니다.`,
        en: String.raw`\(n = ${n}\): \(V_{${n}} = \sum_{i=1}^{${n - 1}}|f(x_i) - f(x_{i-1})| \approx ${variation.toFixed(4)}\) — refining the partition keeps pushing the variation higher, past any finite bound.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(n = ${n}\): \(V_{${n}} = \sum_{i=1}^{${n - 1}}|f(x_i) - f(x_{i-1})| \approx ${variation.toFixed(4)}\) — \(n\)을 키우면 \(\int_0^1 |f'(x)|\,dx = \int_0^1 2\pi|\cos 2\pi x|\,dx = 4\)에 수렴합니다.`,
      en: String.raw`\(n = ${n}\): \(V_{${n}} = \sum_{i=1}^{${n - 1}}|f(x_i) - f(x_{i-1})| \approx ${variation.toFixed(4)}\) — as \(n\) grows this converges to \(\int_0^1 |f'(x)|\,dx = \int_0^1 2\pi|\cos 2\pi x|\,dx = 4\).`,
    },
    lang,
  );
}

function verdictText(data: BoundedVariationData, lang: Lang): string {
  if (data.fn === 'wild') {
    return localize(
      {
        ko: String.raw`유계변분 판정: \(x\sin(1/x)\)는 유계변분이 아닙니다 — 아래 연습문제 3의 분할로 \(V \ge \sum_{k=1}^{N}(u_k + v_k) \ge \frac{H_N}{2\pi} \to \infty\)입니다.`,
        en: String.raw`Bounded-variation verdict: \(x\sin(1/x)\) is NOT of bounded variation — the partition in problem 3 below gives \(V \ge \sum_{k=1}^{N}(u_k + v_k) \ge \frac{H_N}{2\pi} \to \infty\).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`유계변분 판정: \(\sin 2\pi x\)는 유계변분이며 \(V_0^1(f) = 4\) — 누적 변분 곡선은 점선 \(V = 4\)에 안착합니다. 단조함수는 항상 유계변분입니다 (연습문제 1).`,
      en: String.raw`Bounded-variation verdict: \(\sin 2\pi x\) is of bounded variation with \(V_0^1(f) = 4\) — the cumulative variation curve settles onto the dashed line \(V = 4\). Monotone functions are always of bounded variation (problem 1).`,
    },
    lang,
  );
}

function createBoundedVariationScene(): Scene<BoundedVariationData> {
  let hostEl: HTMLElement | undefined;
  let chartTop: Chart | undefined;
  let chartBottom: Chart | undefined;
  let wrapTop: HTMLElement | undefined;
  let wrapBottom: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: BoundedVariationData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chartTop || !chartBottom || !last || !readoutSlot || !verdictSlot) return;
    const { data } = last;
    const { fn, n, xs, ys, cumulative, variation } = data;

    // --- Top panel: the example function on the uniform partition ---
    {
      const { g, width, height } = chartTop;
      g.selectAll('*').remove();
      const x = scaleLinear().domain([0, 1]).range([0, width]);
      let lo = Infinity;
      let hi = -Infinity;
      for (const y of ys) {
        lo = Math.min(lo, y);
        hi = Math.max(hi, y);
      }
      const pad = Math.max(0.05, (hi - lo) * 0.1);
      const y = scaleLinear().domain([lo - pad, hi + pad]).range([height, 0]);

      g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));
      g.append('g').call(axisLeft(y).ticks(6));

      const header = g.append('text').attr('x', 0).attr('y', -32).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
      header.text(
        localize(
          {
            ko: `함수 곡선 — 분할점 ${n}개 (균등분할)`,
            en: `Function curve — ${n} uniform partition points`,
          },
          lang,
        ),
      );

      const fnLine = line<{ px: number; py: number }>()
        .x((d) => x(d.px))
        .y((d) => y(d.py));
      const pts = xs.map((px, i) => ({ px, py: ys[i] ?? 0 }));
      if (pts.length > 1) {
        g.append('path').datum(pts).attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 2).attr('d', fnLine);
      }
      // Partition points as dots.
      for (const pt of pts) {
        g.append('circle')
          .attr('cx', x(pt.px))
          .attr('cy', y(pt.py))
          .attr('r', 2.5)
          .style('fill', 'var(--accent)');
      }

      g.append('text')
        .attr('x', width - 4)
        .attr('y', 14)
        .attr('font-size', 12)
        .attr('text-anchor', 'end')
        .attr('fill', 'currentColor')
        .attr('opacity', 0.7)
        .text(stripInlineMath(fnLabel(fn, lang)));
    }

    // --- Bottom panel: cumulative variation curve ---
    {
      const { g, width, height } = chartBottom;
      g.selectAll('*').remove();
      const x = scaleLinear().domain([0, 1]).range([0, width]);
      let hi = variation;
      if (fn === 'sine') hi = Math.max(hi, SINE_VARIATION_TRUE);
      const y = scaleLinear().domain([0, Math.max(hi * 1.08, 0.1)]).range([height, 0]);

      g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));
      g.append('g').call(axisLeft(y).ticks(6));

      const header = g.append('text').attr('x', 0).attr('y', -32).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
      header.text(
        localize(
          { ko: '누적 변분 — 각 분할점까지의 변분 합', en: 'Cumulative variation — running sum at each partition point' },
          lang,
        ),
      );

      // Dashed asymptote at the true variation, sine example only.
      if (fn === 'sine') {
        g.append('line')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', y(SINE_VARIATION_TRUE))
          .attr('y2', y(SINE_VARIATION_TRUE))
          .attr('stroke', 'var(--accent)')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '6,4');
        g.append('text')
          .attr('x', width - 4)
          .attr('y', y(SINE_VARIATION_TRUE) - 6)
          .attr('font-size', 12)
          .attr('text-anchor', 'end')
          .style('fill', 'var(--accent)')
          .text('V = 4');
      }

      const cumLine = line<{ px: number; py: number }>()
        .x((d) => x(d.px))
        .y((d) => y(d.py));
      const pts = xs.map((px, i) => ({ px, py: cumulative[i] ?? 0 }));
      if (pts.length > 1) {
        g.append('path').datum(pts).attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 2).attr('d', cumLine);
      }
      if (n >= 1) {
        g.append('circle').attr('cx', x(1)).attr('cy', y(variation)).attr('r', 4).style('fill', 'var(--accent)');
      }

      g.append('text')
        .attr('x', 8)
        .attr('y', height + 32)
        .attr('font-size', 12)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.7)
        .text(stripInlineMath(localize({ ko: String.raw`\(V_{${n}} \approx ${variation.toFixed(4)}\)`, en: String.raw`\(V_{${n}} \approx ${variation.toFixed(4)}\)` }, lang)));
    }

    setRich(readoutSlot, readoutText(data, lang));
    setRich(verdictSlot, verdictText(data, lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      hostEl = host;
      host.style.display = 'flex';
      host.style.flexDirection = 'column';

      const topWrap = document.createElement('div');
      topWrap.style.cssText = 'flex: 1 1 auto; min-height: 0; position: relative;';
      const bottomWrap = document.createElement('div');
      bottomWrap.style.cssText = 'flex: 1 1 auto; min-height: 0; position: relative;';
      const strips = document.createElement('div');
      strips.style.cssText = 'padding: 6px 12px 8px; font-size: 13px; flex: none;';
      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';

      // Cross-chapter link to the Cantor function (relative: ../../limits/cantor-function/).
      const seeAlso = document.createElement('div');
      seeAlso.style.marginTop = '4px';
      const link = document.createElement('a');
      link.href = '../../limits/cantor-function/';
      link.textContent = localize(
        {
          ko: '칸토어 함수 — 단조증가이므로 유계변분이고 V = 1',
          en: 'Cantor function — increasing, hence of bounded variation with V = 1',
        },
        lang,
      );
      seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), link);

      strips.append(readout, verdict, seeAlso);
      host.append(topWrap, bottomWrap, strips);

      readoutSlot = makeSlot(readout);
      verdictSlot = makeSlot(verdict);
      wrapTop = topWrap;
      wrapBottom = bottomWrap;
      chartTop = createChart(topWrap, MARGIN);
      chartBottom = createChart(bottomWrap, MARGIN);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize() {
      if (!chartTop || !wrapTop) return;
      chartTop.setSize(wrapTop.clientWidth || 640, wrapTop.clientHeight || 280);
      if (chartBottom && wrapBottom) {
        chartBottom.setSize(wrapBottom.clientWidth || 640, wrapBottom.clientHeight || 280);
      }
      draw();
    },
    dispose() {
      chartTop?.destroy();
      chartBottom?.destroy();
      chartTop = undefined;
      chartBottom = undefined;
      readoutSlot = undefined;
      verdictSlot = undefined;
      wrapTop = undefined;
      wrapBottom = undefined;
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

export default defineScene<BoundedVariationData>({ model: boundedVariationModel, createScene: createBoundedVariationScene });
