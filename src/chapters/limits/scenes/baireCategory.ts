import { axisBottom, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { baireModel, type BaireData } from '../models/baireCategory';

/**
 * Baire category, witnessed on [0,1]. The rationals of [0,1] are enumerated
 * q_1, q_2, ... (lowest-terms denominator order) and each stage k draws the
 * nested closed interval I_k = [a_k, b_k]: if q_k lands inside I_{k-1} the
 * interval shrinks to a quarter that excludes q_k, otherwise it is kept.
 * Rows stack from k = 1 at the top; a red tick marks each q_k (labeled when
 * the rational was dodged inside the interval), and a green diamond marks
 * the survivor x of the final intersection. The slider moves stage 1..14.
 */

const MARGIN = { top: 54, right: 16, bottom: 46, left: 44 };
const RED = '#e5484d';
const GREEN = '#30a46c';

function readoutText(data: BaireData, lang: Lang): string {
  const { stage, stages, survivor, finalA, finalB } = data;
  const hits = stages.filter((s) => s.hit).length;
  const len = finalB - finalA;
  return localize(
    {
      ko: String.raw`\(I_{${stage}} = [${fmt(finalA)},\, ${fmt(finalB)}]\) (길이 \(L = ${fmt(len)}\)), 생존자 \(x \approx ${fmt(survivor)}\) — \(q_1, \dots, q_{${stage}}\) 중 어느 것과도 다르며, 그중 ${hits}개는 구간 안에서 직접 피했습니다.`,
      en: String.raw`\(I_{${stage}} = [${fmt(finalA)},\, ${fmt(finalB)}]\) (length \(L = ${fmt(len)}\)), survivor \(x \approx ${fmt(survivor)}\) — different from every one of \(q_1, \dots, q_{${stage}}\); ${hits} of them were dodged inside the interval itself.`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`펀치라인: 생존자 \(x \in \bigcap_k I_k\)는 열거된 모든 유리수를 피합니다. 길이가 \(0\)으로 수렴하므로 극한의 교집합은 한 점 — 즉 무리수이며, \([0, 1]\)은 점들의 가산합집합이 될 수 없습니다.`,
      en: String.raw`Punchline: the survivor \(x \in \bigcap_k I_k\) dodges every enumerated rational. The lengths shrink to \(0\), so the limiting intersection is a single point — an irrational. \([0,1]\) is not a countable union of points.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: BaireData, lang: Lang): void {
    const { stage, stages, survivor } = data;

    const { g, width, height } = chart;
    g.selectAll('*').remove();
    const x = scaleLinear().domain([0, 1]).range([0, width]);
    const rh = height / stage;
    const yRow = (k: number): number => (k - 0.5) * rh;

    const header = g
      .append('text')
      .attr('x', 0)
      .attr('y', -34)
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor');
    header.text(
      localize(
        {
          ko: '중첩 구간으로 유리수 피하기 — 단계 k마다 [a_k, b_k] 그리기',
          en: 'Dodging the rationals with nested intervals — stage k draws [a_k, b_k]',
        },
        lang,
      ),
    );

    g.append('g').attr('transform', `translate(0,${height})`).call(axisBottom(x).ticks(6));

    for (const s of stages) {
      const yc = yRow(s.k);
      const barH = Math.max(3, Math.min(14, rh * 0.52));

      // Faint full [0,1] baseline for scale.
      g.append('line')
        .attr('x1', x(0))
        .attr('x2', x(1))
        .attr('y1', yc)
        .attr('y2', yc)
        .attr('stroke', 'currentColor')
        .attr('opacity', 0.12);

      // The interval bar: solid when q_k was dodged inside, dashed when q_k
      // already lay outside I_{k-1} (the interval was kept as-is).
      const bar = g
        .append('rect')
        .attr('x', x(s.a))
        .attr('y', yc - barH / 2)
        .attr('width', Math.max(1, x(s.b) - x(s.a)))
        .attr('height', barH)
        .attr('rx', 2);
      if (s.hit) {
        bar.style('fill', 'var(--accent)').attr('opacity', 0.85);
      } else {
        bar
          .style('fill', 'none')
          .attr('stroke', 'var(--accent)')
          .attr('stroke-dasharray', '4,3')
          .attr('opacity', 0.55);
      }

      // Red tick for q_k, labeled when the rational was dodged inside.
      g.append('line')
        .attr('x1', x(s.q))
        .attr('x2', x(s.q))
        .attr('y1', yc - barH / 2 - 4)
        .attr('y2', yc + barH / 2 + 4)
        .attr('stroke', RED)
        .attr('stroke-width', 2);
      if (s.hit) {
        const anchorRight = s.q > 0.82;
        g.append('text')
          .attr('x', anchorRight ? x(s.q) - 5 : x(s.q) + 5)
          .attr('y', yc - barH / 2 - 6)
          .attr('font-size', 10)
          .attr('text-anchor', anchorRight ? 'end' : 'start')
          .attr('fill', RED)
          .text(`q${s.k} = ${s.num}/${s.den}`);
      }

      // Row number.
      g.append('text')
        .attr('x', -10)
        .attr('y', yc + 4)
        .attr('font-size', 11)
        .attr('text-anchor', 'end')
        .attr('fill', 'currentColor')
        .text(String(s.k));
    }

    // Survivor diamond on the last row.
    const lastY = yRow(stage);
    const sx = x(survivor);
    g.append('path')
      .attr('d', `M ${sx} ${lastY - 8} L ${sx + 6} ${lastY} L ${sx} ${lastY + 8} L ${sx - 6} ${lastY} Z`)
      .attr('fill', GREEN);
    g.append('text')
      .attr('x', sx + 9)
      .attr('y', lastY + 4)
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', GREEN)
      .text('x');

    g.append('text')
      .attr('x', 0)
      .attr('y', height + 32)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text(
        localize(
          {
            ko: '■ I_k 구간 (진한 막대: 구간 안에서 q_k 회피 · 점선: q_k가 이미 밖) · 빨간 눈금: q_k · ◆x: 생존자',
            en: '■ I_k bar (solid: dodged q_k inside · dashed: q_k already outside) · red tick: q_k · ◆x: survivor',
          },
          lang,
        ),
      );
}

export default defineSimpleScene<BaireData>({
  model: baireModel,
  margin: MARGIN,
  fallbackHeight: 360,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: (_data, lang) => verdictText(lang), bold: true }
  ],
});
