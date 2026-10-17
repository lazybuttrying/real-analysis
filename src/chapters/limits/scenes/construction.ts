import { scaleLinear } from 'd3';
import {
  defineScene,
  localize,
  type ControlState,
  type Lang,
  type Scene,
} from '../../../contracts';
import { createRichSlot, setRichText, type RichSlot } from '../../../view/richslot';
import { createChart, createSceneShell, fmt, type Chart, type SceneShell } from '../../../view/d3kit';
import { constructionModel, type ConstructionData } from '../models/construction';

/**
 * The Cauchy construction of the reals: a real number is an equivalence
 * class of Cauchy sequences of rationals. Rational terms (decimal
 * truncations of sqrt(2), or the Babylonian iterates) march into the hole
 * at sqrt(2) — and the march itself IS the real number. The sqrt(2) line is
 * drawn solid here (contrast the holes scene, where it was dashed and
 * unreachable): the construction fills the gap.
 */

function factsText(data: ConstructionData, lang: Lang): string {
  const { seq, terms } = data;
  const last = terms[terms.length - 1];
  if (last === undefined) return '';
  const seqName =
    seq === 'newton'
      ? localize({ ko: '바빌로니아 수열', en: 'the Babylonian sequence' }, lang)
      : localize({ ko: '소수점 자르기 수열', en: 'the decimal-truncation sequence' }, lang);
  const fraction = last.n <= 4 ? `\\(x_{${last.n}} = \\frac{${last.p}}{${last.q}}\\)` : `\\(x_{${last.n}}\\)`;
  return localize(
    {
      ko: String.raw`${seqName}: ${fraction} — 모든 항은 유리수, 오차 \(\lvert x_{${last.n}} - \sqrt{2}\rvert \approx ${fmt(last.error, 2)}\).`,
      en: String.raw`${seqName}: ${fraction} — every term rational, error \(\lvert x_{${last.n}} - \sqrt{2}\rvert \approx ${fmt(last.error, 2)}\).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`서로 다른 수열이 같은 구멍으로 모이면 같은 실수 — 실수란 유리수 코시수열의 동치류다: \(\sqrt{2} = [(x_n)]\).`,
      en: String.raw`Different sequences marching into the same hole are the same real number — a real number is an equivalence class of rational Cauchy sequences: \(\sqrt{2} = [(x_n)]\).`,
    },
    lang,
  );
}

function createConstructionScene(): Scene<ConstructionData> {
  let chart: Chart | undefined;
  let shell: SceneShell | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: ConstructionData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    const { terms } = data;
    const sqrt2 = Math.SQRT2;

    const x = scaleLinear().domain([0.9, 1.56]).range([0, width]);
    const rows = terms.length;
    const rowH = Math.min(40, (height - 110) / Math.max(1, rows));

    g.selectAll('*').remove();

    // The filled hole: sqrt(2) is now a solid line — it IS the equivalence class.
    g.append('line')
      .attr('x1', x(sqrt2))
      .attr('x2', x(sqrt2))
      .attr('y1', 8)
      .attr('y2', 8 + rows * rowH)
      .attr('stroke', 'var(--accent)')
      .attr('stroke-width', 2);
    g.append('text')
      .attr('x', x(sqrt2) + 6)
      .attr('y', 20)
      .attr('font-size', 12)
      .style('fill', 'var(--accent)')
      .text('√2 = [(xₙ)]');

    terms.forEach((term, i) => {
      const cy = 24 + i * rowH + rowH / 2;
      g.append('circle').attr('cx', x(term.value)).attr('cy', cy).attr('r', 4).attr('fill', 'var(--accent)');
      g.append('text')
        .attr('x', 4)
        .attr('y', cy + 4)
        .attr('font-size', 11)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.7)
        .text(`x${term.n}`);
    });

    const lastTerm = terms[terms.length - 1];
    if (lastTerm !== undefined) {
      const fraction = lastTerm.n <= 4 ? `${lastTerm.p}/${lastTerm.q}` : '…';
      g.append('text')
        .attr('x', 8)
        .attr('y', height - 48)
        .attr('fill', 'currentColor')
        .attr('font-size', 12)
        .text(`x${lastTerm.n} = ${fraction} ≈ ${fmt(lastTerm.value, 10)}`);
      g.append('text')
        .attr('x', 8)
        .attr('y', height - 30)
        .attr('fill', 'currentColor')
        .attr('font-size', 12)
        .text(`|x${lastTerm.n} − √2| ≈ ${fmt(lastTerm.error, 2)}`);
      g.append('text')
        .attr('x', 8)
        .attr('y', height - 12)
        .attr('font-size', 12)
        .style('fill', 'var(--accent)')
        .text(
          localize(
            { ko: '모든 항은 분수 — 그 동치류가 실수 √2이다', en: 'every term is a fraction — its class is the real √2' },
            lang,
          ),
        );
    }

    if (factsSlot && verdictSlot) {
      setRichText(factsSlot, factsText(data, lang));
      setRichText(verdictSlot, verdictText(lang));
    }
  };

  return {
    mount(host, pageLang) {
      lang = pageLang;
      shell = createSceneShell(host);
      const chartWrap = shell.chartWrap;
      const strips = shell.strips;
      const facts = document.createElement('div');
      facts.style.fontWeight = '600';
      const verdict = document.createElement('div');
      verdict.style.fontWeight = '600';
      strips.append(facts, verdict);

      factsSlot = createRichSlot(facts);
      verdictSlot = createRichSlot(verdict);
      chart = createChart(chartWrap);
    },
    render(data, state) {
      last = { data, state };
      draw();
    },
    resize(width, height) {
      chart?.setSize(width, height);
      draw();
    },
    dispose() {
      chart?.destroy();
      chart = undefined;
      factsSlot = undefined;
      verdictSlot = undefined;
      shell?.dispose();
      shell = undefined;
      last = undefined;
    },
  };
}

export default defineScene<ConstructionData>({ model: constructionModel, createScene: createConstructionScene });
