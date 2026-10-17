import { defineScene, localize, type ControlState, type Lang, type Scene } from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, type Chart } from '../../../view/d3kit';
import { groupsFieldsModel, type GroupsFieldsData } from '../models/groupsFields';

/**
 * Renders math-bearing HTML strips through the shared KaTeX helper, exactly
 * like the shell does for summaries (strip first, upgrade when the tex chunk
 * arrives). Each strip has its own sequence guard so late arrivals from an
 * older render never overwrite newer text.
 */
function verdictText(table: string, lang: Lang): string {
  if (table === 'z5') {
    return localize(
      {
        ko: String.raw`체 맞음: 0이 아닌 모든 원소가 역원을 가짐`,
        en: String.raw`a field: every nonzero element has an inverse`,
      },
      lang,
    );
  }
  return localize(
    {
      ko: String.raw`체 아님: 2의 역원이 없고 \(2 \times 3 = 0\)`,
      en: String.raw`not a field: 2 has no inverse and \(2 \times 3 = 0\)`,
    },
    lang,
  );
}

function createGroupsFieldsScene(): Scene<GroupsFieldsData> {
  let hostEl: HTMLElement | undefined;
  let chart: Chart | undefined;
  let wrap: HTMLElement | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: GroupsFieldsData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last || !verdictSlot) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { size, rows } = data;
    g.selectAll('*').remove();

    const label = 34;
    const cell = Math.min((width - label) / size, (height - label) / size);
    const ox = label + (width - label - cell * size) / 2;
    const oy = label + (height - label - cell * size) / 2;

    for (let a = 0; a < size; a++) {
      g.append('text')
        .attr('x', ox - 8)
        .attr('y', oy + a * cell + cell / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'central')
        .attr('font-size', 12)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.55)
        .text(String(a));
      g.append('text')
        .attr('x', ox + a * cell + cell / 2)
        .attr('y', oy - 8)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', 12)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.55)
        .text(String(a));
      for (let b = 0; b < size; b++) {
        const v = rows[a]?.[b] ?? 0;
        const zero = v === 0;
        g.append('rect')
          .attr('x', ox + b * cell + 1)
          .attr('y', oy + a * cell + 1)
          .attr('width', Math.max(0, cell - 2))
          .attr('height', Math.max(0, cell - 2))
          .attr('fill', zero ? 'var(--bound)' : 'none')
          .attr('opacity', zero ? 0.3 : 1)
          .attr('stroke', 'currentColor')
          .attr('stroke-opacity', 0.25);
        g.append('text')
          .attr('x', ox + b * cell + cell / 2)
          .attr('y', oy + a * cell + cell / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('font-size', Math.max(10, cell * 0.42))
          .attr('font-weight', zero ? 700 : 400)
          .attr('fill', zero ? 'var(--bound)' : 'currentColor')
          .text(String(v));
      }
    }

    setRichText(verdictSlot, verdictText(data.table, lang));
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
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      const subgroup = document.createElement('div');
      subgroup.style.cssText = 'margin-top: 4px; font-size: 12px; color: var(--muted);';
      const subfield = document.createElement('div');
      subfield.style.cssText = 'font-size: 12px; color: var(--muted);';
      strips.append(verdict, subgroup, subfield);
      host.append(chartWrap, strips);

      verdictSlot = createRichSlot(verdict);
      setRichText(
        createRichSlot(subgroup),
        localize(
          {
            ko: String.raw`부분군 판정법: 비어 있지 않고 연산·역원에 닫혀 있으면 부분군 (예: \(2\mathbb{Z} \subset \mathbb{Z}\))`,
            en: String.raw`Subgroup test: nonempty and closed under the operation and inverses (e.g. \(2\mathbb{Z} \subset \mathbb{Z}\))`,
          },
          lang,
        ),
      );
      setRichText(
        createRichSlot(subfield),
        localize(
          {
            ko: String.raw`부분체: \(\mathbb{Q} \subset \mathbb{R}\)`,
            en: String.raw`Subfield: \(\mathbb{Q} \subset \mathbb{R}\)`,
          },
          lang,
        ),
      );
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
      verdictSlot = undefined;
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

export default defineScene<GroupsFieldsData>({ model: groupsFieldsModel, createScene: createGroupsFieldsScene });
