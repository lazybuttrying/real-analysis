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
import { integersRationalsModel, type IntegersRationalsData } from '../models/integers-rationals';

/**
 * Integers from naturals, rationals from integers — both as equivalence
 * classes of pairs. The rationals view draws reduced fractions as dots on a
 * number line and stacks the whole class of 1/2 (1/2, 2/4, 3/6, ...) at the
 * same point: one stack, one number. The same "a number is an equivalence
 * class" technique builds the reals from the rationals in the construction
 * scene.
 */

function factsText(data: IntegersRationalsData, lang: Lang): string {
  if (data.set === 'naturals') {
    return localize(
      {
        ko: String.raw`자연수 \(0,1,2,\dots,8\) — 점 9개. 각 수는 그대로 점 하나다.`,
        en: String.raw`Naturals \(0,1,2,\dots,8\) — nine dots. Each number is just one dot.`,
      },
      lang,
    );
  }
  if (data.set === 'integers') {
    return localize(
      {
        ko: String.raw`정수 \(-8,\dots,8\) — 점 17개. 각 정수는 자연수 순서쌍의 동치류: \([(3,1)] = [(5,3)] = 2\), 즉 "\(a-b\)"의 정식 정의다.`,
        en: String.raw`Integers \(-8,\dots,8\) — seventeen dots. Each integer is an equivalence class of natural pairs: \([(3,1)] = [(5,3)] = 2\), the formal definition of "\(a-b\)".`,
      },
      lang,
    );
  }
  const members = data.class12.map(({ r, s }) => `${r}/${s}`).join(' = ');
  return localize(
    {
      ko: String.raw`분모 \(\le ${data.denom}\)인 기약분수 ${data.fractions.length}개. \(0.5\) 지점에 겹쳐진 점들은 모두 같은 수 — 동치류 \([1/2]\): ${members}. \(\frac{a}{b} \ne 0\)이면 \(\frac{b}{a}\)가 곱셈 역원이므로 \(\mathbb{Q}\)는 체다 (자세한 것은 groups-fields 씬).`,
      en: String.raw`${data.fractions.length} reduced fractions with denominator \(\le ${data.denom}\). The dots stacked at \(0.5\) are all the same number — the class \([1/2]\): ${members}. Every nonzero \(\frac{a}{b}\) has inverse \(\frac{b}{a}\), so \(\mathbb{Q}\) is a field (see the groups-fields scene).`,
    },
    lang,
  );
}

function verdictText(lang: Lang): string {
  return localize(
    {
      ko: String.raw`\(\mathbb{Z}\): \((a,b)\sim(c,d)\iff a+d=b+c\); \(\mathbb{Q}\): \((a,b)\sim(c,d)\iff ad=bc\). 겹친 점 하나가 수 하나 — 이 "동치류로 수를 만든다"는 기술은 유리수에서 실수를 만들 때 다시 등장한다.`,
      en: String.raw`\(\mathbb{Z}\): \((a,b)\sim(c,d)\iff a+d=b+c\); \(\mathbb{Q}\): \((a,b)\sim(c,d)\iff ad=bc\). Each overlapping stack is one number — this "numbers as equivalence classes" trick returns when the reals are built from the rationals.`,
    },
    lang,
  );
}

function createIntegersRationalsScene(): Scene<IntegersRationalsData> {
  let chart: Chart | undefined;
  let shell: SceneShell | undefined;
  let factsSlot: RichSlot | undefined;
  let verdictSlot: RichSlot | undefined;
  let lang: Lang = 'ko';
  let last: { data: IntegersRationalsData; state: ControlState } | undefined;

  const draw = (): void => {
    if (!chart || !last) return;
    const { data } = last;
    const { g, width, height } = chart;
    g.selectAll('*').remove();

    const midY = Math.round(height * 0.42);
    const x = scaleLinear()
      .domain(data.set === 'naturals' ? [-0.6, 8.6] : data.set === 'integers' ? [-8.6, 8.6] : [-2.3, 2.3])
      .range([0, width]);

    // Number line.
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', midY)
      .attr('y2', midY)
      .attr('stroke', 'currentColor')
      .attr('opacity', 0.55);

    const drawDot = (value: number): void => {
      g.append('circle')
        .attr('cx', x(value))
        .attr('cy', midY)
        .attr('r', 4.5)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.75);
    };

    const drawTickLabel = (value: number): void => {
      g.append('text')
        .attr('x', x(value))
        .attr('y', midY + 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', 11)
        .attr('fill', 'currentColor')
        .attr('opacity', 0.75)
        .text(String(value));
    };

    if (data.set === 'rationals') {
      for (const f of data.fractions) drawDot(f.value);
      for (let k = -2; k <= 2; k++) drawTickLabel(k);

      // The equivalence class of 1/2: every member stacked at the same point.
      const cx = x(0.5);
      const members = data.class12;
      members.forEach(({ r, s }, i) => {
        const cy = midY - 20 - i * 14;
        g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 5).attr('fill', 'var(--accent)');
        g.append('text')
          .attr('x', cx + 12)
          .attr('y', cy + 4)
          .attr('font-size', 11)
          .attr('fill', 'var(--accent)')
          .text(`${r}/${s}`);
      });
      g.append('text')
        .attr('x', cx + 12)
        .attr('y', midY - 22 - members.length * 14)
        .attr('font-size', 12)
        .attr('font-weight', '600')
        .attr('fill', 'var(--accent)')
        .text(localize({ ko: '같은 점 = 같은 수', en: 'same point = same number' }, lang));
    } else {
      const lo = data.set === 'naturals' ? 0 : -8;
      for (let k = lo; k <= 8; k++) {
        drawDot(k);
        drawTickLabel(k);
      }
      if (data.set === 'integers') {
        // The integer 2 is the class [(3,1)] = [(5,3)]: one dot, many names.
        g.append('circle')
          .attr('cx', x(2))
          .attr('cy', midY)
          .attr('r', 8)
          .attr('fill', 'none')
          .attr('stroke', 'var(--accent)')
          .attr('stroke-width', 1.5);
        g.append('text')
          .attr('x', x(2))
          .attr('y', midY - 30)
          .attr('text-anchor', 'middle')
          .attr('font-size', 12)
          .attr('fill', 'var(--accent)')
          .text('2 = [(3,1)] = [(5,3)]');
      }
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

export default defineScene<IntegersRationalsData>({ model: integersRationalsModel, createScene: createIntegersRationalsScene });
