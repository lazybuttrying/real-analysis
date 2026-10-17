import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { absoluteModel, type AbsoluteData } from '../models/absolute';

// Two partial-sum walks: S_n of the signed series and T_n of the
// absolute-value series. For 'abs' both walks settle onto their limits;
// for 'cond' the signed walk settles while the absolute walk keeps climbing
// like ln n. The strip below states why rearrangement is safe only for
// absolutely convergent series, rendered through the shared KaTeX helper.

const MARGIN = { top: 72, right: 20, bottom: 44, left: 56 };

function noteText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`재배열이 안전한 이유: 절대수렴 급수는 순서를 바꿔도 합이 바뀌지 않습니다 — 꼬리를 얼마든 작게 만들 수 있기 때문입니다. 조건수렴 급수에서는 합이 바뀔 수 있습니다 (재배열 장면 참고).`,
      en: String.raw`Why reordering is safe here: an absolutely convergent series keeps its sum under any rearrangement — its tails can be made arbitrarily small. For a conditionally convergent series the sum can change (see the rearrangement scene).`,
    },
    lang,
  );
}

function createAbsoluteScene(): Scene<AbsoluteData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let noteSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: AbsoluteData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !noteSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { n, signed, absolute, signedLimit, absoluteLimit } = data;
    const sLast = signed[n - 1] ?? signedLimit;
    const tLast = absolute[n - 1] ?? 0;

    const bounds = [...signed, ...absolute, signedLimit];
    if (absoluteLimit !== null) bounds.push(absoluteLimit);
    const lo = Math.min(...bounds);
    const hi = Math.max(...bounds);
    const pad = (hi - lo) * 0.12 || 0.05;

    const x = scaleLinear().domain([1, Math.max(2, n)]).range([0, width]);
    const y = scaleLinear().domain([lo - pad, hi + pad]).range([height, 0]);

    const curve = line<number>()
      .x((_, i) => x(i + 1))
      .y((v) => y(v));

    g.selectAll('*').remove();

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(8));
    g.append('g').call(axisLeft(y).ticks(6));

    const tTarget =
      absoluteLimit === null
        ? localize({ ko: '발산 (조화급수, ~ ln n)', en: 'diverges (harmonic, ~ ln n)' }, lang)
        : fmt(absoluteLimit, 7);
    g.append('text')
      .attr('x', 0)
      .attr('y', -48)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `S_n = ${fmt(sLast, 7)} → ${fmt(signedLimit, 7)} · T_n = ${fmt(tLast, 7)} → ${tTarget}`,
            en: `S_n = ${fmt(sLast, 7)} → ${fmt(signedLimit, 7)} · T_n = ${fmt(tLast, 7)} → ${tTarget}`,
          },
          lang,
        ),
      );
    g.append('text')
      .attr('x', 0)
      .attr('y', -26)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.75)
      .text(
        localize(
          {
            ko:
              data.series === 'abs'
                ? '절대수렴: Σ|a_k|가 수렴하므로 Σa_k도 수렴합니다'
                : '조건수렴: Σ|a_k|는 발산하지만 Σa_k는 수렴합니다',
            en:
              data.series === 'abs'
                ? 'absolute convergence: Σ|a_k| converges, so Σa_k converges too'
                : 'conditional convergence: Σ|a_k| diverges, but Σa_k converges',
          },
          lang,
        ),
      );

    // Signed limit line.
    g.append('line')
      .attr('x1', x(1))
      .attr('x2', x(n))
      .attr('y1', y(signedLimit))
      .attr('y2', y(signedLimit))
      .attr('stroke-dasharray', '6 4')
      .attr('stroke-width', 2)
      .style('stroke', 'var(--accent)');
    g.append('text')
      .attr('x', x(n) - 4)
      .attr('y', y(signedLimit) - 8)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', 'var(--accent)')
      .text(fmt(signedLimit, 5));

    // Absolute limit line, when it exists.
    if (absoluteLimit !== null) {
      g.append('line')
        .attr('x1', x(1))
        .attr('x2', x(n))
        .attr('y1', y(absoluteLimit))
        .attr('y2', y(absoluteLimit))
        .attr('stroke-dasharray', '6 4')
        .attr('stroke-width', 2)
        .style('stroke', 'var(--bound)');
      g.append('text')
        .attr('x', x(n) - 4)
        .attr('y', y(absoluteLimit) - 8)
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .attr('fill', 'var(--bound)')
        .text(fmt(absoluteLimit, 5));
    } else {
      g.append('text')
        .attr('x', x(n) - 4)
        .attr('y', y(tLast) - 10)
        .attr('text-anchor', 'end')
        .attr('font-size', 12)
        .attr('fill', 'var(--bound)')
        .text(localize({ ko: 'T_n ~ ln n (발산)', en: 'T_n ~ ln n (diverges)' }, lang));
    }

    // The two walks.
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--accent)')
      .attr('d', curve(signed) ?? '');
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2.5)
      .style('stroke', 'var(--bound)')
      .attr('d', curve(absolute) ?? '');

    // Legend.
    g.append('text')
      .attr('x', 8)
      .attr('y', height + 34)
      .attr('font-size', 12)
      .attr('fill', 'var(--accent)')
      .text(localize({ ko: '— S_n: 부호 있는 부분합', en: '— S_n: signed partial sums' }, lang));
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 34)
      .attr('font-size', 12)
      .attr('fill', 'var(--bound)')
      .text(localize({ ko: '— T_n: 절댓값 부분합', en: '— T_n: absolute partial sums' }, lang));

    setRichText(noteSlot, noteText(lang));
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
      const note = document.createElement('div');
      strips.append(note);
      host.append(chartWrap, strips);

      noteSlot = createRichSlot(note);
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
      noteSlot = undefined;
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

export default defineScene<AbsoluteData>({ model: absoluteModel, createScene: createAbsoluteScene });
