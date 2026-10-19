import { localize, type Lang, type LocalizedText } from '../../../contracts';
import { type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import { setsModel, type SetsData } from '../models/sets';

const OP_TEX: Record<string, string> = {
  union: 'A ∪ B',
  intersection: 'A ∩ B',
  complement: 'Aᶜ',
  difference: 'A ∖ B',
  symdiff: 'A △ B',
};

const MODE_LABEL: Record<string, LocalizedText> = {
  injective: { ko: '단사', en: 'injective' },
  surjective: { ko: '전사', en: 'surjective' },
  bijective: { ko: '전단사', en: 'bijective' },
  neither: { ko: '단사·전사 모두 아님', en: 'neither' },
};

function drawVenn(
  g: Chart['g'],
  width: number,
  hTop: number,
  data: SetsData,
  lang: Lang,
): void {
  const { op, activeRegions } = data;
  const cx = width / 2;
  const cy = hTop / 2 + 4;
  const r = Math.max(12, Math.min(hTop * 0.34, width * 0.2));
  const ax = cx - r * 0.72;
  const bx = cx + r * 0.72;
  const ux = cx - r * 2.15;
  const uy = cy - r * 1.32;
  const uw = r * 4.3;
  const uh = r * 2.64;

  const defs = g.append('defs');
  const highlight = 'var(--accent)';
  const opacity = 0.32;

  const circleA = (parent: Chart['g']) =>
    parent.append('circle').attr('cx', ax).attr('cy', cy).attr('r', r);
  const circleB = (parent: Chart['g']) =>
    parent.append('circle').attr('cx', bx).attr('cy', cy).attr('r', r);

  if (activeRegions.includes('both')) {
    defs.append('clipPath').attr('id', 'sets-clip-a').append('circle').attr('cx', ax).attr('cy', cy).attr('r', r);
    g.append('g')
      .attr('clip-path', 'url(#sets-clip-a)')
      .append('circle')
      .attr('cx', bx)
      .attr('cy', cy)
      .attr('r', r)
      .attr('fill', highlight)
      .attr('opacity', opacity);
  }
  if (activeRegions.includes('aOnly')) {
    const mask = defs.append('mask').attr('id', 'sets-mask-aonly').attr('maskUnits', 'userSpaceOnUse').attr('x', ux).attr('y', uy).attr('width', uw).attr('height', uh);
    mask.append('circle').attr('cx', ax).attr('cy', cy).attr('r', r).attr('fill', 'white');
    mask.append('circle').attr('cx', bx).attr('cy', cy).attr('r', r).attr('fill', 'black');
    circleA(g).attr('fill', highlight).attr('opacity', opacity).attr('mask', 'url(#sets-mask-aonly)');
  }
  if (activeRegions.includes('bOnly')) {
    const mask = defs.append('mask').attr('id', 'sets-mask-bonly').attr('maskUnits', 'userSpaceOnUse').attr('x', ux).attr('y', uy).attr('width', uw).attr('height', uh);
    mask.append('circle').attr('cx', bx).attr('cy', cy).attr('r', r).attr('fill', 'white');
    mask.append('circle').attr('cx', ax).attr('cy', cy).attr('r', r).attr('fill', 'black');
    circleB(g).attr('fill', highlight).attr('opacity', opacity).attr('mask', 'url(#sets-mask-bonly)');
  }
  if (activeRegions.includes('neither')) {
    const mask = defs.append('mask').attr('id', 'sets-mask-neither').attr('maskUnits', 'userSpaceOnUse').attr('x', ux).attr('y', uy).attr('width', uw).attr('height', uh);
    mask.append('rect').attr('x', ux).attr('y', uy).attr('width', uw).attr('height', uh).attr('fill', 'white');
    mask.append('circle').attr('cx', ax).attr('cy', cy).attr('r', r).attr('fill', 'black');
    mask.append('circle').attr('cx', bx).attr('cy', cy).attr('r', r).attr('fill', 'black');
    g.append('rect')
      .attr('x', ux)
      .attr('y', uy)
      .attr('width', uw)
      .attr('height', uh)
      .attr('fill', highlight)
      .attr('opacity', opacity)
      .attr('mask', 'url(#sets-mask-neither)');
  }

  // Outlines and labels.
  g.append('rect')
    .attr('x', ux)
    .attr('y', uy)
    .attr('width', uw)
    .attr('height', uh)
    .attr('fill', 'none')
    .attr('stroke', 'currentColor')
    .attr('opacity', 0.7);
  circleA(g).attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 1.5);
  circleB(g).attr('fill', 'none').attr('stroke', 'currentColor').attr('stroke-width', 1.5);

  g.append('text').attr('x', ux + 6).attr('y', uy + 16).attr('font-size', 13).attr('fill', 'currentColor').text('U');
  g.append('text')
    .attr('x', ax - r * 0.55)
    .attr('y', cy + 5)
    .attr('font-size', 13)
    .attr('fill', 'currentColor')
    .text('A');
  g.append('text')
    .attr('x', bx + r * 0.55)
    .attr('y', cy + 5)
    .attr('font-size', 13)
    .attr('fill', 'currentColor')
    .text('B');

  g.append('text')
    .attr('x', 8)
    .attr('y', 16)
    .attr('font-size', 13)
    .attr('fill', 'currentColor')
    .text(`${localize({ ko: '집합 연산', en: 'Set operation' }, lang)}: ${OP_TEX[op] ?? op}`);
}

function drawArrows(
  g: Chart['g'],
  width: number,
  height: number,
  hTop: number,
  data: SetsData,
  lang: Lang,
): void {
  const { domain, codomain, arrows, fnmode, isInjective, isSurjective } = data;
  const y0 = hTop + 34;
  const y1 = height - 16;
  const rows = Math.max(domain.length, codomain.length);
  const yAt = (i: number): number => (rows === 1 ? (y0 + y1) / 2 : y0 + (i * (y1 - y0)) / (rows - 1));
  const dx = width * 0.28;
  const ex = width * 0.72;
  const dr = 5.5;

  const defs = g.append('defs');
  defs
    .append('marker')
    .attr('id', 'sets-arrowhead')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 8)
    .attr('refY', 5)
    .attr('markerWidth', 7)
    .attr('markerHeight', 7)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M0,0 L10,5 L0,10 z')
    .attr('fill', 'currentColor');

  const hit = new Set(arrows.map((a) => a[1]));

  arrows.forEach(([from, to]) => {
    g.append('line')
      .attr('x1', dx + dr + 2)
      .attr('y1', yAt(from))
      .attr('x2', ex - dr - 4)
      .attr('y2', yAt(to))
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.65)
      .attr('marker-end', 'url(#sets-arrowhead)');
  });

  domain.forEach((label, i) => {
    g.append('circle').attr('cx', dx).attr('cy', yAt(i)).attr('r', dr).attr('fill', 'var(--accent)');
    g.append('text')
      .attr('x', dx - dr - 8)
      .attr('y', yAt(i) + 4)
      .attr('text-anchor', 'end')
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(label);
  });
  codomain.forEach((label, j) => {
    g.append('circle')
      .attr('cx', ex)
      .attr('cy', yAt(j))
      .attr('r', dr)
      .attr('fill', hit.has(j) ? 'var(--accent)' : 'none')
      .attr('stroke', hit.has(j) ? 'var(--accent)' : 'currentColor')
      .attr('stroke-dasharray', hit.has(j) ? '' : '3 2');
    g.append('text')
      .attr('x', ex + dr + 8)
      .attr('y', yAt(j) + 4)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .text(label);
  });

  g.append('text')
    .attr('x', 8)
    .attr('y', hTop + 14)
    .attr('font-size', 13)
    .attr('fill', 'currentColor')
    .text(`${localize({ ko: '함수 모양', en: 'Map shape' }, lang)}: ${localize(MODE_LABEL[fnmode] ?? { ko: fnmode, en: fnmode }, lang)}`);

  const verdict =
    lang === 'ko'
      ? `단사 ${isInjective ? 'O' : 'X'} · 전사 ${isSurjective ? 'O' : 'X'}`
      : `injective ${isInjective ? 'yes' : 'no'} · surjective ${isSurjective ? 'yes' : 'no'}`;
  g.append('text')
    .attr('x', width - 8)
    .attr('y', hTop + 14)
    .attr('text-anchor', 'end')
    .attr('font-size', 13)
    .style('fill', 'var(--bound)')
    .text(verdict);
}

function drawMain(chart: Chart, data: SetsData, lang: Lang): void {
    const { g, width, height } = chart;
    if (width < 40 || height < 160) return;
    const hTop = height * 0.54;

    g.selectAll('*').remove();
    drawVenn(g, width, hTop, data, lang);
    drawArrows(g, width, height, hTop, data, lang);
}

export default defineSimpleScene<SetsData>({
  model: setsModel,
  drawMain,
});
