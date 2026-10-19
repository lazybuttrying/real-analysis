import { axisBottom, axisLeft, line, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { baireOneModel, type BaireOneData, type BaireOneSample } from '../models/baireOne';

/**
 * Baire class 1, live. Thomae's function T (1/q at reduced p/q, 0 at
 * irrationals) is the pointwise limit of the continuous tent sums f_n: at
 * stage N the chart shows N-disjoint tents whose spikes sit exactly on the
 * rationals with denominator <= N. The readout compares f_N against the
 * exact Thomae values at three probe points, and the verdict strip states
 * the continuity story: continuous exactly at the irrationals (a dense
 * G-delta), discontinuous at every rational.
 */

const MARGIN = { top: 40, right: 20, bottom: 44, left: 64 };

function readoutText(data: BaireOneData, lang: Lang): string {
  const at = (i: number): number => data.probes[i]?.approx ?? NaN;
  const half = at(0);
  const sqrt2half = at(1);
  const third = at(2);
  return localize(
    {
      ko: String.raw`\(N = ${data.n}\): \(f_N(1/2) = ${fmt(half, 4)}\) (Thomae 값 \(0.5\)), \(f_N(\sqrt{2}/2) = ${fmt(sqrt2half, 4)}\) (Thomae 값 \(0\)), \(f_N(1/3) = ${fmt(third, 4)}\) (Thomae 값 \(1/3\)). 유리수 탐침점에서는 이미 정확히 일치하고, 무리수 탐침점은 \(0\)으로 가라앉습니다.`,
      en: String.raw`\(N = ${data.n}\): \(f_N(1/2) = ${fmt(half, 4)}\) (Thomae: \(0.5\)), \(f_N(\sqrt{2}/2) = ${fmt(sqrt2half, 4)}\) (Thomae: \(0\)), \(f_N(1/3) = ${fmt(third, 4)}\) (Thomae: \(1/3\)). The rational probes already match exactly; the irrational probe sinks to \(0\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`Thomae 함수는 무리수에서 연속이고 유리수에서 불연속입니다 — 연속점 집합은 무리수 전체, 즉 조밀한 \(G_\delta\)입니다. 연속함수들의 점별 극한이 항상 연속인 것은 아니지만, Baire 1급 함수라면 연속점을 조밀한 \(G_\delta\)만큼은 반드시 간직합니다.`,
      en: String.raw`Thomae's function is continuous exactly at the irrationals — a dense \(G_\delta\) — and discontinuous at every rational. A pointwise limit of continuous functions need not be continuous, but a Baire-1 function always keeps a dense \(G_\delta\) of continuity points.`,
    },
    lang,
  );
}

function constructionText(data: BaireOneData, lang: Lang): string {
  const { n, bumpCount } = data;
  return localize(
    {
      ko: String.raw`구성: \(f_N(x) = \sum \frac{1}{q}\,\mathrm{tri}(N^3(x - p/q))\) — 분모 \(\le N\)인 기약분수마다 높이 \(1/q\), 반너비 \(1/N^3\)인 텐트를 세웁니다. 텐트 너비 \(2/N^3\)이 기약분수 간격 \(1/(N(N-1))\)보다 작으므로 \(N = ${n}\)개의 텐트 ${bumpCount}개는 서로 겹치지 않습니다 — 유한합이라 연속입니다.`,
      en: String.raw`Construction: \(f_N(x) = \sum \frac{1}{q}\,\mathrm{tri}(N^3(x - p/q))\) — one tent of height \(1/q\) and half-width \(1/N^3\) over each reduced fraction with denominator \(\le N\). The tent width \(2/N^3\) is smaller than the fraction spacing \(1/(N(N-1))\), so the ${bumpCount} tents at \(N = ${n}\) are pairwise disjoint — a finite sum, hence continuous.`,
    },
    lang,
  );
}

const path = line<BaireOneSample>()
  .x((d) => d.x)
  .y((d) => d.y);

function drawMain(chart: Chart, data: BaireOneData, lang: Lang): void {
    const { g, width, height } = chart;
    g.selectAll('*').remove();
    const x = scaleLinear().domain([0, 1]).range([0, width]);
    const y = scaleLinear().domain([-0.06, 1.15]).range([height, 0]);
    const px = path.x((d) => x(d.x)).y((d) => y(d.y));

    g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(10));
    g.append('g').call(axisLeft(y).ticks(6));

    g.append('text')
      .attr('x', 0)
      .attr('y', -20)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(
        localize(
          {
            ko: `Thomae 함수로의 수렴: f_${data.n} (${data.bumpCount}개의 겹치지 않는 텐트)`,
            en: `Converging to Thomae's function: f_${data.n} (${data.bumpCount} disjoint tents)`,
          },
          lang,
        ),
      );

    // f_N, accent color: spiky but continuous.
    g.append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .style('stroke', 'var(--accent)')
      .attr('d', px(data.curve) ?? '');

    // Probe dots on the curve.
    for (const probe of data.probes) {
      g.append('circle')
        .attr('cx', x(probe.x))
        .attr('cy', y(probe.approx))
        .attr('r', 4)
        .style('fill', 'var(--bound)')
        .style('stroke', 'var(--bound)');
    }

    // Legend.
    const legendY = height + 34;
    g.append('text')
      .attr('x', 8)
      .attr('y', legendY)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(localize({ ko: `— f_${data.n} (연속 텐트합)`, en: `— f_${data.n} (continuous tent sum)` }, lang));
    g.append('text')
      .attr('x', width * 0.4)
      .attr('y', legendY)
      .attr('font-size', 12)
      .style('fill', 'var(--bound)')
      .text(localize({ ko: '● 탐침점', en: '● probe points' }, lang));
}

export default defineSimpleScene<BaireOneData>({
  model: baireOneModel,
  margin: MARGIN,
  fallbackHeight: 300,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: (_data, lang) => verdictText(lang), bold: true },
    { text: constructionText, spaced: true }
  ],
});
