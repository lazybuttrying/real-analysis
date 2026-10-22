import { axisBottom, axisLeft, scaleLinear } from 'd3';
import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  parallelogramLawModel,
  type ParallelogramLawData,
  type Vec2,
} from '../models/parallelogramLaw';

/**
 * The parallelogram law, live. The parallelogram with vertices 0, e1,
 * e1 + e2, e2 is drawn in ordinary coordinates together with its
 * diagonals, and the l^p unit sphere bends as p slides: a circle only at
 * p = 2, squarer for large p and pinched for p close to 1. Only the norm
 * changes with p; the points do not. The readout compares
 * ||e1+e2||_p^2 + ||e1-e2||_p^2 = 2 * 2^(2/p) against
 * 2||e1||_p^2 + 2||e2||_p^2 = 4.
 */

const MARGIN = { top: 28, right: 24, bottom: 44, left: 52 };

function readoutText(data: ParallelogramLawData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(p = ${fmt(data.p, 1)}\): 좌변 \(\|e_1+e_2\|_p^2 + \|e_1-e_2\|_p^2 = 2 \cdot 2^{2/p} = ${fmt(data.lhs, 6)}\), 우변 \(2\|e_1\|_p^2 + 2\|e_2\|_p^2 = 4\). 차이 \(= ${fmt(data.gap, 6)}\).`,
      en: String.raw`\(p = ${fmt(data.p, 1)}\): left side \(\|e_1+e_2\|_p^2 + \|e_1-e_2\|_p^2 = 2 \cdot 2^{2/p} = ${fmt(data.lhs, 6)}\), right side \(2\|e_1\|_p^2 + 2\|e_2\|_p^2 = 4\). Gap \(= ${fmt(data.gap, 6)}\).`,
    },
    lang,
  );
}

function explainText(_data: ParallelogramLawData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`평행사변형 법칙은 내적에서 온 노름이라면 항상 \(\|x+y\|^2 + \|x-y\|^2 = 2\|x\|^2 + 2\|y\|^2\)를 만족한다는 항등식입니다. 그림의 평행사변형은 그대로인데 재는 자(\(p\)-노름)만 바뀝니다. 단위구가 \(p = 2\)에서만 보통의 원이 되는 것을 보세요. 요르단-폰 노이만 정리의 역에 따르면, \(p \ne 2\)인 \(\ell^p\) 노름은 어떤 내적에서도 나올 수 없습니다.`,
      en: String.raw`The parallelogram law is the identity \(\|x+y\|^2 + \|x-y\|^2 = 2\|x\|^2 + 2\|y\|^2\) that every inner-product norm must satisfy. The parallelogram in the picture stays fixed; only the measuring rule (the \(p\)-norm) changes. Watch the unit sphere: it is an ordinary circle only at \(p = 2\). By the converse in the Jordan-von Neumann theorem, the \(\ell^p\) norm for \(p \ne 2\) cannot come from any inner product.`,
    },
    lang,
  );
}

function verdictText(data: ParallelogramLawData, lang: Lang): string {
  if (data.holds) {
    return localize(
      {
        ko: String.raw`판정: \(p = 2\) — 평행사변형 법칙이 성립합니다 (차이 \(\approx 0\)). 유클리드 노름은 내적 \(\langle x, y \rangle = x_1 y_1 + x_2 y_2\)에서 옵니다.`,
        en: String.raw`Verdict: \(p = 2\) — the parallelogram law holds (gap \(\approx 0\)). The Euclidean norm comes from the inner product \(\langle x, y \rangle = x_1 y_1 + x_2 y_2\).`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`판정: 평행사변형 법칙이 깨집니다 — 차이 \(= ${fmt(data.gap, 6)} \ne 0\). 성립하는 경우는 \(p = 2\)뿐입니다. 슬라이더를 \(2\)로 맞춰 보세요.`,
      en: String.raw`Verdict: the parallelogram law fails — gap \(= ${fmt(data.gap, 6)} \ne 0\). It holds only at \(p = 2\). Slide \(p\) to \(2\) to see it close.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: ParallelogramLawData, lang: Lang): void {
  const { g, width, height } = chart;
  g.selectAll('*').remove();

  // One shared pixels-per-unit for both axes (centered square plot, the
  // complexNumbers approach), so the l^2 unit sphere is a true circle and
  // the l^p spheres are not stretched by the wide chart.
  const extent = 1.3;
  const unit = Math.min(width, height) / (2 * extent);
  const cx = width / 2;
  const cy = height / 2;
  const x = scaleLinear()
    .domain([-extent, extent])
    .range([cx - extent * unit, cx + extent * unit]);
  const y = scaleLinear()
    .domain([-extent, extent])
    .range([cy + extent * unit, cy - extent * unit]);
  const px = (v: Vec2): number => x(v.x);
  const py = (v: Vec2): number => y(v.y);
  const origin: Vec2 = { x: 0, y: 0 };

  g.append('text')
    .attr('x', 0)
    .attr('y', -10)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `평행사변형 법칙: p = ${fmt(data.p, 1)}${data.holds ? ' — 성립!' : ''}`,
          en: `The parallelogram law: p = ${fmt(data.p, 1)}${data.holds ? ' — holds!' : ''}`,
        },
        lang,
      ),
    );

  // The l^p unit sphere through the sample points.
  if (data.showCircle && data.samples.length > 0) {
    const path = data.samples
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${fmt(px(pt), 3)} ${fmt(py(pt), 3)}`)
      .join(' ');
    g.append('path')
      .attr('d', `${path} Z`)
      .attr('fill', 'var(--accent)')
      .attr('fill-opacity', data.holds ? 0.1 : 0.05)
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', data.holds ? 2.5 : 1.5)
      .attr('stroke-dasharray', data.holds ? 'none' : '5 3')
      .attr('opacity', 0.85);
    g.append('text')
      .attr('x', px({ x: -0.8, y: -0.68 }))
      .attr('y', py({ x: -0.8, y: -0.68 }))
      .attr('font-size', 11)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.7)
      .text(localize({ ko: '단위구', en: 'unit sphere' }, lang));
  }

  // The parallelogram 0 -> e1 -> e1 + e2 -> e2 -> 0.
  const verts: Vec2[] = [origin, data.e1, data.sum, data.e2];
  const poly = verts.map((v) => `${fmt(px(v), 3)},${fmt(py(v), 3)}`).join(' ');
  g.append('polygon')
    .attr('points', poly)
    .attr('fill', 'currentColor')
    .attr('fill-opacity', 0.06)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 2);

  // Diagonals: 0 to e1 + e2, and e1 to e2.
  const diagonal = (a: Vec2, b: Vec2): void => {
    g.append('line')
      .attr('x1', px(a))
      .attr('x2', px(b))
      .attr('y1', py(a))
      .attr('y2', py(b))
      .attr('stroke', 'var(--bound)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 3')
      .attr('opacity', 0.8);
  };
  diagonal(origin, data.sum);
  diagonal(data.e1, data.e2);

  // Vertex dots and labels.
  const labelled: { v: Vec2; label: string; dx: number; dy: number }[] = [
    { v: origin, label: '0', dx: -14, dy: 14 },
    { v: data.e1, label: 'e1', dx: 6, dy: 16 },
    { v: data.e2, label: 'e2', dx: -18, dy: -6 },
    { v: data.sum, label: 'e1+e2', dx: 8, dy: -6 },
  ];
  for (const item of labelled) {
    g.append('circle')
      .attr('cx', px(item.v))
      .attr('cy', py(item.v))
      .attr('r', 4)
      .attr('fill', 'currentColor');
    g.append('text')
      .attr('x', px(item.v) + item.dx)
      .attr('y', py(item.v) + item.dy)
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(item.label);
  }

  g.append('g').attr('transform', `translate(0,${y(0)})`).call(axisBottom(x).ticks(6));
  g.append('g').attr('transform', `translate(${x(0)},0)`).call(axisLeft(y).ticks(5));

  g.append('text')
    .attr('x', width)
    .attr('y', 14)
    .attr('text-anchor', 'end')
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', data.holds ? 'var(--accent)' : 'currentColor')
    .text(
      data.holds
        ? localize({ ko: 'LHS = RHS = 4', en: 'LHS = RHS = 4' }, lang)
        : localize(
            { ko: `LHS = ${fmt(data.lhs, 4)} vs RHS = 4`, en: `LHS = ${fmt(data.lhs, 4)} vs RHS = 4` },
            lang,
          ),
    );
}

export default defineSimpleScene<ParallelogramLawData>({
  model: parallelogramLawModel,
  margin: MARGIN,
  fallbackHeight: 360,
  drawMain,
  slots: [
    { text: readoutText, bold: true },
    { text: explainText, spaced: true },
    { text: verdictText, bold: true, spaced: true },
  ],
});
