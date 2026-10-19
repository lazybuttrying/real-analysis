import { localize, type Lang } from '../../../contracts';
import { type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { cauchySchwarzModel, type CauchySchwarzData, type Vec2 } from '../models/cauchySchwarz';

/**
 * Cauchy-Schwarz inequality in R^2: |x . y| <= ||x|| ||y||.
 *
 * The fixed vector x = (3, 0) is drawn in accent blue; the unit vector y
 * rotates on the unit circle with the `angle` slider (bound red). The dashed
 * arrow shows the orthogonal projection of x onto y, and a faint arc marks
 * the angle theta between x and y. The facts strip shows the live readout
 * |x . y| versus ||x|| ||y||; when y is parallel to x the equality case
 * flashes: a halo around y's tip and an equality verdict.
 */

const X_COLOR = 'var(--accent)';
const Y_COLOR = 'var(--bound)';
const PROJ_COLOR = 'currentColor';

// Plot window in math coordinates (1:1 aspect so angles are honest).
const X_MIN = -1.6;
const X_MAX = 4.2;
const Y_HALF = 2.9;

function fmt(v: number): string {
  const r = Math.round(v * 1000) / 1000;
  return String(Object.is(r, -0) ? 0 : r);
}

function factsText(data: CauchySchwarzData, lang: Lang): string {
  const { absDot, product, gap } = data;
  return localize(
    {
      ko: String.raw`\(|\langle x,y\rangle| = ${fmt(absDot)}\), \(\|x\|\,\|y\| = ${fmt(product)}\) — 간격 \((${fmt(gap)})\): \(|\langle x,y\rangle| \le \|x\|\,\|y\|\).`,
      en: String.raw`\(|\langle x,y\rangle| = ${fmt(absDot)}\), \(\|x\|\,\|y\| = ${fmt(product)}\) — slack \((${fmt(gap)})\): \(|\langle x,y\rangle| \le \|x\|\,\|y\|\).`,
    },
    lang,
  );
}

function verdictText(data: CauchySchwarzData, lang: Lang): string {
  if (data.isParallel) {
    return localize(
      {
        ko: String.raw`등호 성립! \(y \parallel x\) — \(|\langle x,y\rangle| = \|x\|\,\|y\|\). 등호는 두 벡터가 일차종속일 때 정확히 성립한다.`,
        en: String.raw`Equality! \(y \parallel x\) — \(|\langle x,y\rangle| = \|x\|\,\|y\|\). Equality holds exactly when the two vectors are linearly dependent.`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`등호는 \(y\)가 \(x\)와 평행할 때만 성립 — 슬라이더를 \(0\)이나 \(\pi\)로 돌려보세요.`,
      en: String.raw`Equality only when \(y\) is parallel to \(x\) — drag the slider to \(0\) or \(\pi\) to see it.`,
    },
    lang,
  );
}

function drawMain(chart: Chart, data: CauchySchwarzData, lang: Lang): void {
    const { g, width, height } = chart;
    const { theta, x, y, projection, isParallel, showProjection } = data;
    g.selectAll('*').remove();

    const unit = Math.min(width / (X_MAX - X_MIN), height / (2 * Y_HALF));
    const ox = -X_MIN * unit;
    const oy = height / 2;
    const px = (v: number): number => ox + v * unit;
    const py = (v: number): number => oy - v * unit;

    // Arrowheads: accent for x, bound-red for y, faint for the projection.
    const defs = g.append('defs');
    const marker = (id: string, color: string, size: number): void => {
      defs
        .append('marker')
        .attr('id', id)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 8)
        .attr('refY', 5)
        .attr('markerWidth', size)
        .attr('markerHeight', size)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M 0 1 L 9 5 L 0 9 z')
        .attr('fill', color);
    };
    marker('cauchy-x-arrow', X_COLOR, 7);
    marker('cauchy-y-arrow', Y_COLOR, 7);
    marker('cauchy-proj-arrow', PROJ_COLOR, 5);

    // Faint axes.
    g.append('line')
      .attr('x1', px(X_MIN))
      .attr('x2', px(X_MAX))
      .attr('y1', oy)
      .attr('y2', oy)
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.2);
    g.append('line')
      .attr('x1', ox)
      .attr('x2', ox)
      .attr('y1', py(-Y_HALF))
      .attr('y2', py(Y_HALF))
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.2);

    // Unit circle that y travels on.
    g.append('circle')
      .attr('cx', ox)
      .attr('cy', oy)
      .attr('r', unit)
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('stroke-dasharray', '3 5')
      .attr('opacity', 0.3);

    const arrow = (
      tip: Vec2,
      color: string,
      markerId: string,
      strokeWidth: number,
      dashed: boolean,
    ): void => {
      g.append('line')
        .attr('x1', ox)
        .attr('x2', px(tip.x))
        .attr('y1', oy)
        .attr('y2', py(tip.y))
        .attr('stroke', color)
        .attr('stroke-width', strokeWidth)
        .attr('stroke-dasharray', dashed ? '6 4' : null)
        .attr('opacity', dashed ? 0.6 : 0.95)
        .attr('marker-end', `url(#${markerId})`);
    };

    // The fixed vector x = (3, 0).
    arrow(x, X_COLOR, 'cauchy-x-arrow', 3, false);
    g.append('text')
      .attr('x', px(x.x) + 8)
      .attr('y', py(x.y) - 6)
      .attr('font-size', 14)
      .attr('font-weight', 700)
      .style('fill', X_COLOR)
      .text('x');

    // The rotating unit vector y.
    arrow(y, Y_COLOR, 'cauchy-y-arrow', 3, false);
    g.append('text')
      .attr('x', px(y.x) + 8)
      .attr('y', py(y.y) - 6)
      .attr('font-size', 14)
      .attr('font-weight', 700)
      .style('fill', Y_COLOR)
      .text('y');

    // Orthogonal projection of x onto y: dashed arrow plus the drop segment.
    if (showProjection) {
      arrow(projection, PROJ_COLOR, 'cauchy-proj-arrow', 2, true);
      g.append('line')
        .attr('x1', px(x.x))
        .attr('x2', px(projection.x))
        .attr('y1', py(x.y))
        .attr('y2', py(projection.y))
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4 4')
        .attr('opacity', 0.45);
      const projLabel = localize({ ko: 'x의 사영', en: 'proj of x' }, lang);
      g.append('text')
        .attr('x', px(projection.x) - 8)
        .attr('y', py(projection.y) + 16)
        .attr('text-anchor', 'end')
        .attr('font-size', 11)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.65)
        .text(projLabel);
    }

    // Angle arc from the x-axis to y.
    const arcR = 0.55 * unit;
    const endX = px(arcR * Math.cos(theta));
    const endY = py(arcR * Math.sin(theta));
    const largeArc = theta > Math.PI ? 1 : 0;
    g.append('path')
      .attr('d', `M ${px(arcR)} ${oy} A ${arcR} ${arcR} 0 ${largeArc} 0 ${endX} ${endY}`)
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.55);
    g.append('text')
      .attr('x', px(0.78 * Math.cos(theta / 2)))
      .attr('y', py(0.78 * Math.sin(theta / 2)) + 4)
      .attr('font-size', 12)
      .attr('font-style', 'italic')
      .attr('fill', 'currentColor')
      .attr('opacity', 0.7)
      .text('θ');

    // Equality flash: a halo around y's tip when y is parallel to x.
    if (isParallel) {
      [16, 9].forEach((r, i) => {
        g.append('circle')
          .attr('cx', px(y.x))
          .attr('cy', py(y.y))
          .attr('r', r)
          .attr('fill', 'none')
          .attr('stroke', X_COLOR)
          .attr('stroke-width', 3 - i)
          .attr('opacity', i === 0 ? 0.25 : 0.6);
      });
    }
}

export default defineSimpleScene<CauchySchwarzData>({
  model: cauchySchwarzModel,
  drawMain,
  slots: [
    { text: factsText, bold: true },
    { text: verdictText, bold: true }
  ],
});
