import { localize, type Lang } from '../../../contracts';
import { fmt, type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { countableModel, GRID_SIZE, type CountableData } from '../models/countable';

// Cantor's diagonal enumeration of the positive rationals on an 8x8
// grid (the 'rationals' panel), and the diagonal-argument panel: 8
// binary sequences whose flipped diagonal differs from every one of
// them, so the list can never be complete.

function topText(data: CountableData, lang: Lang): string {
  const shown = data.rationals
    .slice(0, 6)
    .map((r) => fmt(r.value))
    .join(', ');
  const more = data.n > 6 ? ', …' : '';
  return localize(
    {
      ko: String.raw`\(n\)=${data.n}: 처음 ${data.n}개 — ${shown}${more}`,
      en: String.raw`\(n\)=${data.n}: first ${data.n} — ${shown}${more}`,
    },
    lang,
  );
}

function bottomText(_data: CountableData, lang: Lang): string {
  return localize(
    {
      ko: '대각선을 뒤집은 수열 — 목록의 어느 것과도 다릅니다',
      en: 'The flipped diagonal — differs from every listed sequence',
    },
    lang,
  );
}

function drawRationals(chart: Chart, data: CountableData): void {
  const { g, width, height } = chart;
  const cell = Math.min(width, height) / GRID_SIZE;
  const ox = (width - cell * GRID_SIZE) / 2;
  const oy = (height - cell * GRID_SIZE) / 2;
  const badgeR = Math.min(11, cell * 0.22);

  for (const c of data.grid) {
    const x = ox + (c.q - 1) * cell;
    const y = oy + (c.p - 1) * cell;
    const badged = c.index !== null && c.index <= data.n;
    g.append('rect')
      .attr('x', x + 1)
      .attr('y', y + 1)
      .attr('width', Math.max(0, cell - 2))
      .attr('height', Math.max(0, cell - 2))
      .attr('fill', badged ? 'var(--accent)' : 'none')
      .attr('opacity', badged ? 0.12 : 1)
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.25);
    g.append('text')
      .attr('x', x + cell / 2)
      .attr('y', y + cell / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', Math.max(9, cell * 0.26))
      .attr('fill', 'currentColor')
      .attr('opacity', badged ? 1 : 0.45)
      .text(`${c.p}/${c.q}`);
    if (badged) {
      g.append('circle')
        .attr('cx', x + cell - badgeR - 3)
        .attr('cy', y + badgeR + 3)
        .attr('r', badgeR)
        .attr('fill', 'var(--accent)');
      g.append('text')
        .attr('x', x + cell - badgeR - 3)
        .attr('y', y + badgeR + 3)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', Math.max(8, badgeR * 1.05))
        .attr('fill', 'var(--bg)')
        .text(String(c.index));
    }
  }
}

function drawDiagonal(chart: Chart, data: CountableData): void {
  const { g, width, height } = chart;
  const rows = data.sequences.length + 1;
  const labelW = 40;
  const cs = Math.min((width - labelW) / data.sequences.length, height / (rows + 0.5));
  const ox = labelW + (width - labelW - cs * data.sequences.length) / 2;
  const oy = (height - cs * rows) / 2;

  data.sequences.forEach((seq, i) => {
    g.append('text')
      .attr('x', ox - 8)
      .attr('y', oy + i * cs + cs / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'central')
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.55)
      .text(`s${i}`);
    for (let j = 0; j < seq.length; j++) {
      const diag = i === j;
      g.append('rect')
        .attr('x', ox + j * cs + 1)
        .attr('y', oy + i * cs + 1)
        .attr('width', Math.max(0, cs - 2))
        .attr('height', Math.max(0, cs - 2))
        .attr('fill', diag ? 'var(--bound)' : 'none')
        .attr('opacity', diag ? 0.3 : 1)
        .attr('stroke', 'currentColor')
        .attr('stroke-opacity', 0.2);
      g.append('text')
        .attr('x', ox + j * cs + cs / 2)
        .attr('y', oy + i * cs + cs / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', Math.max(10, cs * 0.5))
        .attr('font-weight', diag ? 700 : 400)
        .attr('fill', diag ? 'var(--bound)' : 'currentColor')
        .text(seq[j] ?? '');
    }
  });

  const t = data.sequences.length;
  g.append('text')
    .attr('x', ox - 8)
    .attr('y', oy + t * cs + cs / 2)
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'central')
    .attr('font-size', 12)
    .attr('font-weight', 700)
    .attr('fill', 'var(--accent)')
    .text('t');
  for (let j = 0; j < data.anti.length; j++) {
    g.append('rect')
      .attr('x', ox + j * cs + 1)
      .attr('y', oy + t * cs + 1)
      .attr('width', Math.max(0, cs - 2))
      .attr('height', Math.max(0, cs - 2))
      .attr('fill', 'var(--accent)')
      .attr('opacity', 0.14)
      .attr('stroke', 'var(--accent)')
      .attr('stroke-opacity', 0.5);
    g.append('text')
      .attr('x', ox + j * cs + cs / 2)
      .attr('y', oy + t * cs + cs / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', Math.max(10, cs * 0.5))
      .attr('font-weight', 700)
      .attr('fill', 'var(--accent)')
      .text(data.anti[j] ?? '');
  }
}

function drawMain(chart: Chart, data: CountableData, _lang: Lang): void {
  const { g } = chart;
  g.selectAll('*').remove();
  if (data.panel === 'diagonal') {
    drawDiagonal(chart, data);
  } else {
    drawRationals(chart, data);
  }
}

export default defineSimpleScene<CountableData>({
  model: countableModel,
  drawMain,
  slotsAbove: [
    {
      text: topText,
      cssText: 'padding: 8px 12px 0; font-size: 13px; flex: none;',
      visible: (data) => data.panel !== 'diagonal',
    },
  ],
  slots: [
    {
      text: bottomText,
      cssText: 'color: var(--muted);',
      visible: (data) => data.panel === 'diagonal',
    },
  ],
});
