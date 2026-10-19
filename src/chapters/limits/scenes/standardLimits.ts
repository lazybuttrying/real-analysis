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
import { PLOT_CLIP, standardLimitsModel, type StandardLimitsData } from '../models/standardLimits';

/**
 * Tao, Analysis I, Props 6.5.2/6.5.3, live. A stem plot shows the terms
 * x^n (or x^{1/n}) against n; the dashed horizontal line marks the
 * theoretical limit (0 or 1) when one exists. The readout states the
 * regime: |x| < 1 -> 0, x = 1 -> 1, x = -1 oscillates, |x| > 1 diverges,
 * and x^{1/n} -> 1 from above (x > 1) or below (x < 1).
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 64 };

function clipValue(v: number): number {
  return Math.max(-PLOT_CLIP, Math.min(PLOT_CLIP, v));
}

function readoutText(data: StandardLimitsData, lang: Lang): string {
  const { kind, x, n, regime } = data;
  if (kind === 'root') {
    const side =
      x > 1
        ? localize({ ko: '위에서', en: 'from above' }, lang)
        : x < 1
          ? localize({ ko: '아래에서', en: 'from below' }, lang)
          : localize({ ko: '항등적으로', en: 'identically' }, lang);
    return localize(
      {
        ko: String.raw`\(x = ${fmt(x)}\), \(n \le ${n}\): \(x^{1/n} \to 1\) — ${side} 다가갑니다 (문제 2).`,
        en: String.raw`\(x = ${fmt(x)}\), \(n \le ${n}\): \(x^{1/n} \to 1\) — approached ${side} (problem 2).`,
      },
      lang,
    );
  }
  switch (regime) {
    case 'converges-zero':
      return localize(
        {
          ko: String.raw`\(x = ${fmt(x)}\): \(|x| < 1\)이므로 \(x^n \to 0\) — 꼬리가 기하급수적으로 가라앉습니다 (문제 1).`,
          en: String.raw`\(x = ${fmt(x)}\): \(|x| < 1\), so \(x^n \to 0\) — the tail sinks geometrically (problem 1).`,
        },
        lang,
      );
    case 'converges-one':
      return localize(
        {
          ko: String.raw`\(x = 1\): \(x^n = 1\)이므로 \(x^n \to 1\) — 자명한 경우입니다.`,
          en: String.raw`\(x = 1\): \(x^n = 1\), so \(x^n \to 1\) — the trivial case.`,
        },
        lang,
      );
    case 'oscillates':
      return localize(
        {
          ko: String.raw`\(x = -1\): \(x^n = (-1)^n\)은 \(-1\)과 \(1\)을 오갑니다 — 수렴하지 않습니다.`,
          en: String.raw`\(x = -1\): \(x^n = (-1)^n\) bounces between \(-1\) and \(1\) — no limit.`,
        },
        lang,
      );
    case 'unbounded':
      return localize(
        {
          ko: String.raw`\(x = ${fmt(x)}\): \(|x| > 1\)이므로 \(|x^n| \to \infty\) — 발산합니다. (그래프는 \(\pm ${PLOT_CLIP}\)에서 잘라 그렸습니다.)`,
          en: String.raw`\(x = ${fmt(x)}\): \(|x| > 1\), so \(|x^n| \to \infty\) — divergent. (The plot clips at \(\pm ${PLOT_CLIP}\).)`,
        },
        lang,
      );
  }
}

function explainText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`핵심 도구는 Bernoulli 부등식 \((1+h)^n \ge 1+nh\)입니다: \(|x| < 1\)이면 \(1/|x| = 1+h\)로 두어 \(|x|^n \le 1/(1+nh) \to 0\)을 얻고, \(x^{1/n}\)은 \(t_n = x^{1/n}-1\)로 두어 같은 부등식으로 \(t_n\)을 위에서 조입니다.`,
      en: String.raw`The key tool is Bernoulli's inequality \((1+h)^n \ge 1+nh\): for \(|x| < 1\), writing \(1/|x| = 1+h\) gives \(|x|^n \le 1/(1+nh) \to 0\), and for \(x^{1/n}\) the same inequality squeezes \(t_n = x^{1/n}-1\) from above.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`정리: \(|x| < 1 \Rightarrow x^n \to 0\), \(x = 1 \Rightarrow x^n \to 1\), \(x = -1\)은 진동, \(|x| > 1\)은 발산, \(x > 0 \Rightarrow x^{1/n} \to 1\).`,
      en: String.raw`Summary: \(|x| < 1 \Rightarrow x^n \to 0\), \(x = 1 \Rightarrow x^n \to 1\), \(x = -1\) oscillates, \(|x| > 1\) diverges, \(x > 0 \Rightarrow x^{1/n} \to 1\).`,
    },
    lang,
  );
}

function createStandardLimitsScene(): Scene<StandardLimitsData> {
  let shell: SceneShell | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let explainSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: StandardLimitsData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !readoutSlot || !explainSlot || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { kind, n, points, regime, limit } = data;
    g.selectAll('*').remove();

    const clipped = regime === 'unbounded';
    const values = points.map((p) => (clipped ? clipValue(p.value) : p.value));
    let lo = Math.min(...values);
    let hi = Math.max(...values);
    if (Number.isFinite(limit)) {
      lo = Math.min(lo, limit);
      hi = Math.max(hi, limit);
    }
    const pad = Math.max(0.1, 0.12 * (hi - lo));
    const x = scaleLinear().domain([0, n + 1]).range([0, width]);
    const y = scaleLinear().domain([lo - pad, hi + pad]).range([height, 0]);

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(Math.min(12, n)));
    g.append('g').call(axisLeft(y).ticks(6));
    g.append('text')
      .attr('x', width)
      .attr('y', height + 28)
      .attr('text-anchor', 'end')
      .attr('font-size', 11)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.6)
      .text('n');

    g.append('text')
      .attr('x', 0)
      .attr('y', -20)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        kind === 'power'
          ? localize({ ko: `수열 x^n (x = ${fmt(data.x)})`, en: `The sequence x^n (x = ${fmt(data.x)})` }, lang)
          : localize({ ko: `수열 x^{1/n} (x = ${fmt(data.x)})`, en: `The sequence x^{1/n} (x = ${fmt(data.x)})` }, lang),
      );

    // Faint zero line.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.25);

    // Stems and dots.
    points.forEach((point, i) => {
      const cx = x(point.k);
      const v = values[i] ?? 0;
      g.append('line')
        .attr('x1', cx)
        .attr('x2', cx)
        .attr('y1', y(0))
        .attr('y2', y(v))
        .attr('stroke', 'var(--accent)')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.7);
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', y(v))
        .attr('r', Math.max(2, Math.min(4, 240 / n)))
        .attr('fill', 'var(--accent)');
    });

    // Dashed limit line with label.
    if (Number.isFinite(limit)) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(limit))
        .attr('y2', y(limit))
        .attr('stroke', 'var(--bound)')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '6 4');
      g.append('text')
        .attr('x', width - 4)
        .attr('y', y(limit) - 6)
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .style('fill', 'var(--bound)')
        .text(localize({ ko: `극한 = ${fmt(limit)}`, en: `limit = ${fmt(limit)}` }, lang));
    }

    setRichText(readoutSlot, readoutText(data, lang));
    setRichText(explainSlot, explainText(lang));
    setRichText(verdictSlot, verdictText(lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);
      wrap = shell.chartWrap;
      chart = createChart(wrap, MARGIN);

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
      if (chart && wrap) chart.setSize(wrap.clientWidth || 640, wrap.clientHeight || 300);
      draw();
    },
    dispose() {
      chart?.destroy();
      chart = undefined;
      readoutSlot = undefined;
      explainSlot = undefined;
      verdictSlot = undefined;
      wrap = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<StandardLimitsData>({ model: standardLimitsModel, createScene: createStandardLimitsScene });
