import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, fmt, type Chart } from '../../../view/d3kit';
import { countableModel, GRID_SIZE, type CountableData } from '../models/countable';

/**
 * Renders math-bearing HTML strips through the shared KaTeX helper, exactly
 * like the shell does for summaries (strip first, upgrade when the tex chunk
 * arrives). Each strip has its own sequence guard so late arrivals from an
 * older render never overwrite newer text.
 */
function createCountableScene(): Scene<CountableData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let topSlot: RichSlot | undefined;
  let bottomSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: CountableData; state: ControlState } | undefined;

  const drawRationals = (data: CountableData): void => {
    if (!chart) return;
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
  };

  const drawDiagonal = (data: CountableData): void => {
    if (!chart) return;
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
  };

  const draw = (): void => {
    if (!chart || !last || !topSlot || !bottomSlot) return;
    const { data } = last;
    const { g } = chart;
    g.selectAll('*').remove();

    if (data.panel === 'diagonal') {
      topSlot.el.style.display = 'none';
      bottomSlot.el.style.display = '';
      drawDiagonal(data);
      setRichText(
        bottomSlot,
        localize(
          {
            ko: '대각선을 뒤집은 수열 — 목록의 어느 것과도 다릅니다',
            en: 'The flipped diagonal — differs from every listed sequence',
          },
          lang,
        ),
      );
    } else {
      topSlot.el.style.display = '';
      bottomSlot.el.style.display = 'none';
      drawRationals(data);
      const shown = data.rationals
        .slice(0, 6)
        .map((r) => fmt(r.value))
        .join(', ');
      const more = data.n > 6 ? ', …' : '';
      setRichText(
        topSlot,
        localize(
          {
            ko: String.raw`\(n\)=${data.n}: 처음 ${data.n}개 — ${shown}${more}`,
            en: String.raw`\(n\)=${data.n}: first ${data.n} — ${shown}${more}`,
          },
          lang,
        ),
      );
    }
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      hostEl = host;
      host.style.display = 'flex';
      host.style.flexDirection = 'column';

      const top = document.createElement('div');
      top.style.cssText = 'padding: 8px 12px 0; font-size: 13px; flex: none;';
      const chartWrap = document.createElement('div');
      chartWrap.style.cssText = 'flex: 1 1 auto; min-height: 0; position: relative;';
      const bottom = document.createElement('div');
      bottom.style.cssText = 'padding: 6px 12px 8px; font-size: 13px; color: var(--muted); flex: none;';
      host.append(top, chartWrap, bottom);

      topSlot = createRichSlot(top);
      bottomSlot = createRichSlot(bottom);
      wrap = chartWrap;
      chart = createChart(chartWrap);
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
      topSlot = undefined;
      bottomSlot = undefined;
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

export default defineScene<CountableData>({ model: countableModel, createScene: createCountableScene });
