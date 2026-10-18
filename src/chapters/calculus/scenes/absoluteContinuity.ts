import { scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, type Chart, type SceneShell } from '../../../view/d3kit';
import { absoluteContinuityModel, type AbsoluteContinuityData } from '../models/absoluteContinuity';

/**
 * Absolute continuity, live: the two canonical examples side by side.
 *
 * The chart draws two horizontal bars — total length of the covering
 * intervals vs. sum of |Delta F| over them. For F(x) = x^2 the intervals
 * are packed at [1 - delta, 1] (delta = scale/20), where both bars shrink
 * to 0: F is absolutely continuous. For the Cantor function at stage n the
 * intervals are the 2^n stage-n Cantor intervals: total length (2/3)^n
 * shrinks to 0 while sum of |Delta c| stays frozen at 1 — uniform
 * continuity is not enough.
 */

const MARGIN = { top: 48, right: 20, bottom: 40, left: 200 };

function readoutText(data: AbsoluteContinuityData, lang: Lang): string {
  const { func, detail, totalLen, varSum } = data;
  if (func === 'square') {
    return localize(
      {
        ko: String.raw`구간들을 \([1 - \delta, 1]\)에 압축 (최악의 경우): \(\delta = ${detail.toFixed(2)}\), 총 길이 \(\delta = ${totalLen.toFixed(4)}\), \(\sum |\Delta F| = 1 - (1 - \delta)^2 = ${varSum.toFixed(4)}\).`,
        en: String.raw`Intervals packed at \([1 - \delta, 1]\) (worst case): \(\delta = ${detail.toFixed(2)}\), total length \(\delta = ${totalLen.toFixed(4)}\), \(\sum |\Delta F| = 1 - (1 - \delta)^2 = ${varSum.toFixed(4)}\).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`\(n = ${detail}\) 단계 칸토어 구간 \(2^${detail}\)개: 총 길이 \(\left(\frac23\right)^${detail} = ${totalLen.toFixed(4)}\), \(\sum |\Delta c| = 2^${detail} \cdot 2^{-${detail}} = ${varSum.toFixed(4)}\) — 항상 1입니다.`,
      en: String.raw`The \(2^${detail}\) stage-\(${detail}\) Cantor intervals: total length \(\left(\frac23\right)^${detail} = ${totalLen.toFixed(4)}\), \(\sum |\Delta c| = 2^${detail} \cdot 2^{-${detail}} = ${varSum.toFixed(4)}\) — always 1.`,
    },
    lang,
  );
}

function verdictText(data: AbsoluteContinuityData, lang: Lang): string {
  if (data.func === 'square') {
    return localize(
      {
        ko: String.raw`절대연속 ✓: \(\delta \to 0\)일 때 총 길이와 \(\sum |\Delta F|\)가 모두 0으로 갑니다 (정확히 \(2\delta - \delta^2\)).`,
        en: String.raw`Absolutely continuous ✓: total length and \(\sum |\Delta F|\) both go to 0 as \(\delta \to 0\) (exactly \(2\delta - \delta^2\)).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`절대연속 ✗: 총 길이는 \(\left(\frac23\right)^n \to 0\)이지만 \(\sum |\Delta c|\)는 1에 고정 — "절대적" 조건을 만족하지 못합니다. 균등연속으로는 부족합니다.`,
      en: String.raw`Not absolutely continuous ✗: total length \(\left(\frac23\right)^n \to 0\) but \(\sum |\Delta c|\) is stuck at 1 — the "absolute" condition fails. Uniform continuity is not enough.`,
    },
    lang,
  );
}

function createAbsoluteContinuityScene(): Scene<AbsoluteContinuityData> {
  let shell: SceneShell | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let readoutSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: AbsoluteContinuityData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !readoutSlot || !verdictSlot) return;
    const { data } = last;
    const { func, totalLen, varSum } = data;

    const { g, width, height } = chart;
    g.selectAll('*').remove();

    const rows = [
      {
        key: 'length',
        label: localize(
          { ko: '구간들의 총 길이 (δ로 만들기)', en: 'Total interval length (the δ we control)' },
          lang,
        ),
        value: totalLen,
      },
      {
        key: 'variation',
        label: localize(
          { ko: 'Σ |ΔF| — ε로 만들어야 함', en: 'Σ |ΔF| — must be made < ε' },
          lang,
        ),
        value: varSum,
      },
    ];

    // Manual band layout for the two rows (avoids pulling d3-scale's
    // scaleBand into the shared vendor chunk for two bars).
    const rowH = height / rows.length;
    const bw = rowH * 0.65;
    const yPos = (i: number): number => i * rowH + (rowH - bw) / 2;
    const hi = Math.max(0.5, totalLen, varSum);
    const x = scaleLinear().domain([0, hi]).range([0, width]);

    g.append('text')
      .attr('x', 0)
      .attr('y', -32)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `절대연속성 테스트 — ${func === 'square' ? 'F(x) = x² (막대 둘 다 → 0)' : '칸토어 함수 c (길이만 → 0, Σ|Δc| = 1 고정)'}`,
            en: `Absolute continuity test — ${func === 'square' ? 'F(x) = x² (both bars → 0)' : 'Cantor function c (length → 0 only, Σ|Δc| frozen at 1)'}`,
          },
          lang,
        ),
      );

    rows.forEach((row, i) => {
      g.append('text')
        .attr('x', -8)
        .attr('y', yPos(i) + bw / 2 + 4)
        .attr('font-size', 12)
        .attr('text-anchor', 'end')
        .attr('fill', 'currentColor')
        .text(row.label);
    });

    rows.forEach((row, i) => {
      g.append('rect')
        .attr('y', yPos(i))
        .attr('height', bw)
        .attr('x', 0)
        .attr('width', x(row.value))
        .style('fill', row.key === 'variation' ? 'var(--accent)' : 'currentColor')
        .attr('opacity', 0.85);
      g.append('text')
        .attr('x', x(row.value) + 6)
        .attr('y', yPos(i) + bw / 2 + 4)
        .attr('font-size', 12)
        .attr('fill', 'currentColor')
        .text(row.value.toFixed(4));
    });

    // Marker at 1 on the variation scale: where the Cantor function lives.
    g.append('line')
      .attr('x1', x(1))
      .attr('x2', x(1))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6,4')
      .attr('opacity', 0.7);

    setRichText(readoutSlot, readoutText(data, lang));
    setRichText(verdictSlot, verdictText(data, lang));
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);
      const chartWrap = shell.chartWrap;
      const strips = shell.strips;
      const readout = document.createElement('div');
      readout.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';

      // Honest scope note: the hard direction is stated, not proved, here.
      const scopeNote = document.createElement('div');
      scopeNote.style.marginTop = '2px';
      scopeNote.style.opacity = '0.75';

      // Cross-chapter link: the Cantor function scene in the limits chapter.
      const seeAlso = document.createElement('div');
      seeAlso.style.marginTop = '4px';
      const cantorLink = document.createElement('a');
      cantorLink.href = '../../limits/cantor-function/';
      cantorLink.textContent = localize(
        {
          ko: '칸토어 함수 씬 — 균등연속이지만 절대연속이 아닌 예',
          en: 'Cantor function scene — uniformly continuous but not absolutely continuous',
        },
        lang,
      );
      seeAlso.append(document.createTextNode(localize({ ko: '더 보기: ', en: 'See also: ' }, lang)), cantorLink);

      strips.append(readout, verdict, scopeNote, seeAlso);

      readoutSlot = createRichSlot(readout);
      verdictSlot = createRichSlot(verdict);
      const scopeSlot = createRichSlot(scopeNote);
      setRichText(
        scopeSlot,
        localize(
          {
            ko: String.raw`역방향도 성립합니다 — 절대연속이면 \(F' = f\) a.e.이고 \(F(x) - F(a) = \int_a^x f\) — 하지만 그 증명(유계변동과 Lebesgue 미분 정리를 경유)은 여기서 증명하지 않고 아이디어 수준으로만 언급합니다.`,
            en: String.raw`The converse also holds — AC implies \(F' = f\) a.e. with \(F(x) - F(a) = \int_a^x f\) — but its proof (via bounded variation and the Lebesgue differentiation theorem) is stated at idea level here, not proved.`,
          },
          lang,
        ),
      );

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
      readoutSlot = undefined;
      verdictSlot = undefined;
      wrap = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<AbsoluteContinuityData>({ model: absoluteContinuityModel, createScene: createAbsoluteContinuityScene });
