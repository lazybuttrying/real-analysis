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
import { diniModel, type DiniData } from '../models/dini';

/**
 * Dini's theorem, live. Two modes on the `domain` control:
 *
 * compact    f_n(x) = n*x/(n+1) ↗ x on [0,1]. Monotone, continuous,
 *            continuous limit on a compact set: the worst gap 1/(n+1)
 *            shrinks to 0 uniformly (marker at x = 1).
 * noncompact g_n(x) = x^n ↘ 0 on (0,1]. Same monotone setup, but the
 *            domain is not compact: the sup gap stays stuck at 1 and the
 *            pointwise limit is discontinuous at x = 1 (dot marker).
 *
 * The bottom strip states the theorem and links to the two sibling scenes:
 * `compact` (compactness is the engine) and `m-test` (another
 * uniform-convergence tool).
 */

const MARGIN = { top: 64, right: 20, bottom: 44, left: 56 };

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

function header2Text(data: DiniData, lang: Lang): string {
  const { n, domain } = data;
  if (domain === 'compact') {
    return localize(
      {
        ko: `f_n(x) = nx/(n+1) ↗ x (점선) — n = ${n}까지의 단조 증가 곡선들, 정의역 [0,1]`,
        en: `f_n(x) = nx/(n+1) ↗ x (dashed) — increasing curves up to n = ${n}, on [0,1]`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: `g_n(x) = x^n ↘ 0 (점선) — n = ${n}까지의 단조 감소 곡선들, 정의역 (0,1]은 컴팩트가 아님`,
      en: `g_n(x) = x^n ↘ 0 (dashed) — decreasing curves up to n = ${n}, on (0,1] which is not compact`,
    },
    lang,
  );
}

function factsText(data: DiniData, lang: Lang): string {
  const { n, domain, maxGap } = data;
  if (domain === 'compact') {
    const gap = maxGap.toFixed(4);
    return localize(
      {
        ko: String.raw`\(n=${n}\): 최대 간격 \(\max_{[0,1]}|f-f_{${n}}| = 1/(${n}+1) \approx ${gap}\) → \(n\)이 커지면 0으로. 단조 + 연속 + 컴팩트 = 균등수렴.`,
        en: String.raw`\(n=${n}\): worst gap \(\max_{[0,1]}|f-f_{${n}}| = 1/(${n}+1) \approx ${gap}\) → 0 as \(n\) grows. Monotone + continuous + compact = uniform convergence.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(n=${n}\): \(\sup_{(0,1]}|g-g_{${n}}| = 1\) — \(n\)을 키워도 좁혀지지 않음. 단조·연속은 같은데 컴팩트성이 빠져 균등수렴이 깨진다 (원인은 예제 2).`,
      en: String.raw`\(n=${n}\): \(\sup_{(0,1]}|g-g_{${n}}| = 1\) — never shrinks as \(n\) grows. Monotone and continuous, but compactness is missing, so uniform convergence fails (see problem 2).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`디니 정리: \(K\)가 컴팩트이고, 각 \(f_n\)과 한계 \(f\)가 연속이며, 각 \(x\)에서 \(f_n(x)\)가 단조롭게 \(f(x)\)에 수렴하면 \(f_n \to f\)는 균등수렴한다. 증명은 열린 덮개 \(E_n = \{x : f(x)-f_n(x) < \varepsilon\}\)로 — 아래 예제 1.`,
      en: String.raw`Dini's theorem: if \(K\) is compact, each \(f_n\) and the limit \(f\) are continuous, and \(f_n(x) \to f(x)\) monotonically at each \(x\), then \(f_n \to f\) uniformly. The proof goes through the open cover \(E_n = \{x : f(x)-f_n(x) < \varepsilon\}\) — see problem 1 below.`,
    },
    lang,
  );
}

function linksHtml(lang: Lang): string {
  const seg = lang === 'ko' ? 'ko' : 'en';
  if (lang === 'ko') {
    return `컴팩트성이 증명의 엔진인 이유 → <a href="/${seg}/limits/compact/">compact 씬</a> · 또 다른 균등수렴 도구 → <a href="/${seg}/series/m-test/">M-판정법</a>`;
  }
  return `Why compactness is the engine of the proof → <a href="/${seg}/limits/compact/">compact scene</a> · Another uniform-convergence tool → <a href="/${seg}/series/m-test/">M-test</a>`;
}

function createDiniScene(): Scene<DiniData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: DiniData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !factsSlot || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { n, domain, xs, curves, limit } = data;

    g.selectAll('*').remove();

    const x = scaleLinear().domain([0, 1]).range([0, width]);
    let yMin = Infinity;
    let yMax = -Infinity;
    for (const row of curves) {
      for (const v of row) {
        yMin = Math.min(yMin, v);
        yMax = Math.max(yMax, v);
      }
    }
    for (const v of limit) {
      yMin = Math.min(yMin, v);
      yMax = Math.max(yMax, v);
    }
    const pad = (yMax - yMin) * 0.08 || 0.05;
    const y = scaleLinear().domain([yMin - pad, yMax + pad]).range([height, 0]);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(axisBottom(x).tickValues([0, 0.25, 0.5, 0.75, 1]));
    g.append('g').call(axisLeft(y).ticks(6));

    const header1 = g.append('text').attr('x', 0).attr('y', -48).attr('font-size', 13).attr('font-weight', 600).attr('fill', 'currentColor');
    const header2 = g.append('text').attr('x', 0).attr('y', -26).attr('font-size', 12).attr('fill', 'currentColor').attr('opacity', 0.75);
    header1.text(
      localize(
        {
          ko: '디니 정리 — 단조 연속함수열이 컴팩트 집합에서 연속 극한에 수렴하면 균등수렴',
          en: "Dini's theorem — a monotone sequence of continuous functions converging to a continuous limit on a compact set converges uniformly",
        },
        lang,
      ),
    );
    header2.text(header2Text(data, lang));

    // Faint earlier curves, then the current term bold.
    for (let k = 0; k < curves.length; k++) {
      const row = curves[k] ?? [];
      const isLast = k === curves.length - 1;
      const path = line<number>()
        .x((_, i) => x(xs[i] ?? 0))
        .y((_, i) => y(row[i] ?? 0));
      g.append('path')
        .datum(xs)
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke-width', isLast ? 2.5 : 1)
        .style('stroke', 'var(--accent)')
        .attr('opacity', isLast ? 1 : 0.12);
    }

    // The limit curve, dashed underneath.
    const limitLine = line<number>()
      .x((_, i) => x(xs[i] ?? 0))
      .y((_, i) => y(limit[i] ?? 0));
    g.append('path')
      .datum(xs)
      .attr('d', limitLine)
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .attr('stroke', 'currentColor')
      .attr('stroke-dasharray', '6 4')
      .attr('opacity', 0.7);

    // Gap marker at x = 1.
    const markerTop = y(1);
    const markerBottom = domain === 'compact' ? y(n / (n + 1)) : y(0);
    g.append('line')
      .attr('x1', x(1))
      .attr('x2', x(1))
      .attr('y1', markerTop)
      .attr('y2', markerBottom)
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '3 3');
    g.append('text')
      .attr('x', x(1) - 6)
      .attr('y', (markerTop + markerBottom) / 2)
      .attr('font-size', 12)
      .attr('text-anchor', 'end')
      .attr('fill', 'currentColor')
      .text(
        domain === 'compact'
          ? localize({ ko: `간격 1/${n + 1}`, en: `gap 1/${n + 1}` }, lang)
          : localize({ ko: 'sup 간격 1', en: 'sup gap 1' }, lang),
      );

    // Noncompact: the pointwise limit at x = 1 is g_n(1) = 1, a discontinuity.
    if (domain === 'noncompact') {
      g.append('circle').attr('cx', x(1)).attr('cy', y(1)).attr('r', 4).attr('fill', 'currentColor');
      g.append('text')
        .attr('x', x(1) - 10)
        .attr('y', y(1) - 10)
        .attr('font-size', 12)
        .attr('text-anchor', 'end')
        .attr('fill', 'currentColor')
        .text(localize({ ko: 'g_n(1)=1 — 극한이 x=1에서 불연속', en: 'g_n(1)=1 — the limit is discontinuous at x=1' }, lang));
    }

    // Legend.
    const legend = domain === 'compact'
      ? localize({ ko: `■ f_${n} (진한) · - - f (점선) · i 선 = 최대 간격 1/(${n}+1)`, en: `■ f_${n} (bold) · - - f (dashed) · i line = worst gap 1/(${n}+1)` }, lang)
      : localize({ ko: `■ g_${n} (진한) · - - g=0 (점선) · i 선 = sup 간격 1`, en: `■ g_${n} (bold) · - - g=0 (dashed) · i line = sup gap 1` }, lang);
    g.append('text')
      .attr('x', 8)
      .attr('y', height + 34)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.7)
      .text(legend);

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
      const links = document.createElement('div');
      links.style.cssText = 'padding-top: 4px;';
      links.innerHTML = linksHtml(lang);
      strips.append(facts, verdict, links);
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

export default defineScene<DiniData>({ model: diniModel, createScene: createDiniScene });
