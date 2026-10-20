import { localize, type Lang } from '../../../contracts';
import { type Chart } from '../../../view/d3kit';
import { defineSimpleScene } from '../../../view/simple-scene';
import {
  logicPropositionsModel,
  type Connective,
  type LogicPropositionsData,
  type TruthRow,
} from '../models/logicPropositions';

/**
 * Interactive truth tables. Switch the connective to watch each column
 * change; the toggle adds or removes the contrapositive column. When the
 * connective is 'implies', the P -> Q column and the (not Q) -> (not P)
 * column light up together — they agree row by row — while the differing
 * row of the converse column Q -> P is outlined.
 */

const MARGIN = { top: 36, right: 20, bottom: 52, left: 20 };

const CELL_W = 118;
const CELL_H = 34;
const HEAD_H = 36;

const CONNECTIVE_INFO: Record<Connective, { formula: string; nameKo: string; nameEn: string }> = {
  and: { formula: 'P ∧ Q', nameKo: '논리곱', nameEn: 'conjunction' },
  or: { formula: 'P ∨ Q', nameKo: '논리합', nameEn: 'disjunction' },
  implies: { formula: 'P → Q', nameKo: '함의', nameEn: 'implication' },
  iff: { formula: 'P ↔ Q', nameKo: '동치', nameEn: 'biconditional' },
};

interface Column {
  header: string;
  value: (row: TruthRow) => boolean;
  /** Shaded column (matches the main column when the connective is 'implies'). */
  shade: boolean;
  kind: 'plain' | 'main' | 'contra' | 'converse';
}

function columns(data: LogicPropositionsData, lang: Lang): Column[] {
  const info = CONNECTIVE_INFO[data.connective];
  const cols: Column[] = [
    { header: 'P', value: (row) => row.p, shade: false, kind: 'plain' },
    { header: 'Q', value: (row) => row.q, shade: false, kind: 'plain' },
    { header: info.formula, value: (row) => row.main, shade: data.connective === 'implies', kind: 'main' },
  ];
  if (data.showContrapositive) {
    cols.push({
      header: localize({ ko: '¬Q → ¬P', en: '¬Q → ¬P' }, lang),
      value: (row) => row.contrapositive,
      shade: data.connective === 'implies',
      kind: 'contra',
    });
  }
  cols.push({
    header: localize({ ko: 'Q → P', en: 'Q → P' }, lang),
    value: (row) => row.converse,
    shade: false,
    kind: 'converse',
  });
  return cols;
}

function drawMain(chart: Chart, data: LogicPropositionsData, lang: Lang): void {
  const { g, width } = chart;
  g.selectAll('*').remove();

  const info = CONNECTIVE_INFO[data.connective];
  g.append('text')
    .attr('x', 0)
    .attr('y', -16)
    .attr('font-size', 13)
    .attr('font-weight', 600)
    .attr('fill', 'currentColor')
    .text(
      localize(
        {
          ko: `진리표: ${info.formula} (${info.nameKo})`,
          en: `Truth table: ${info.formula} (${info.nameEn})`,
        },
        lang,
      ),
    );

  const cols = columns(data, lang);
  const tableW = cols.length * CELL_W;
  const x0 = Math.max(0, (width - tableW) / 2);
  const y0 = 8;

  // Shaded band behind the matching columns when the connective is 'implies'.
  if (data.connective === 'implies') {
    const shaded = cols
      .map((col, i) => ({ col, i }))
      .filter(({ col }) => col.shade);
    if (shaded.length > 0) {
      const first = shaded[0] as { i: number };
      const last = shaded[shaded.length - 1] as { i: number };
      g.append('rect')
        .attr('x', x0 + first.i * CELL_W)
        .attr('y', y0)
        .attr('width', (last.i - first.i + 1) * CELL_W)
        .attr('height', HEAD_H + data.rows.length * CELL_H)
        .attr('fill', 'var(--accent)')
        .attr('opacity', 0.14);
    }
  }

  cols.forEach((col, ci) => {
    g.append('rect')
      .attr('x', x0 + ci * CELL_W)
      .attr('y', y0)
      .attr('width', CELL_W)
      .attr('height', HEAD_H)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.16)
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.35);
    g.append('text')
      .attr('x', x0 + ci * CELL_W + CELL_W / 2)
      .attr('y', y0 + HEAD_H / 2 + 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .attr('fill', 'currentColor')
      .text(col.header);
  });

  // Honestly computed: rows where P op Q differs from Q -> P.
  const differRows = new Set<number>();
  data.rows.forEach((row, ri) => {
    if (row.main !== row.converse) differRows.add(ri);
  });

  data.rows.forEach((row, ri) => {
    cols.forEach((col, ci) => {
      const v = col.value(row);
      const y = y0 + HEAD_H + ri * CELL_H;
      const marked =
        data.connective === 'implies' && col.kind === 'converse' && differRows.has(ri);
      g.append('rect')
        .attr('x', x0 + ci * CELL_W)
        .attr('y', y)
        .attr('width', CELL_W)
        .attr('height', CELL_H)
        .attr('fill', v ? '#2e7d32' : '#c62828')
        .attr('opacity', marked ? 0.3 : 0.14)
        .attr('stroke', marked ? 'var(--accent)' : 'currentColor')
        .attr('stroke-opacity', marked ? 1 : 0.35)
        .attr('stroke-width', marked ? 2.5 : 1);
      g.append('text')
        .attr('x', x0 + ci * CELL_W + CELL_W / 2)
        .attr('y', y + CELL_H / 2 + 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', 13)
        .attr('font-weight', 600)
        .attr('fill', 'currentColor')
        .text(v ? 'T' : 'F');
    });
  });

  if (data.connective === 'implies' && differRows.size > 0) {
    g.append('text')
      .attr('x', x0)
      .attr('y', y0 + HEAD_H + data.rows.length * CELL_H + 26)
      .attr('font-size', 12)
      .attr('fill', 'currentColor')
      .attr('opacity', 0.8)
      .text(
        localize(
          {
            ko: '굵은 테두리: 역(Q → P)이 원명제(P → Q)와 달라지는 행 (P=T, Q=F)',
            en: 'Bold outline: the row (P=T, Q=F) where the converse (Q → P) differs from P → Q',
          },
          lang,
        ),
      );
  }
}

function readoutText(data: LogicPropositionsData, lang: Lang): string {
  const info = CONNECTIVE_INFO[data.connective];
  if (data.connective === 'implies') {
    return localize(
      {
        ko: String.raw`연결사 함의 \(P \to Q\)의 진리표 판정:
\(P \to Q\)와 대우 \(\lnot Q \to \lnot P\)는 4개 행에서 모두 일치합니다 — 논리적으로 동치입니다.
역 \(Q \to P\)는 \((P, Q) = (T, F)\) 행에서 다릅니다: \(P \to Q\)는 \(F\), \(Q \to P\)는 \(T\).`,
        en: String.raw`Truth-table verdict for the implication \(P \to Q\):
\(P \to Q\) and its contrapositive \(\lnot Q \to \lnot P\) agree in all 4 rows — they are logically equivalent.
The converse \(Q \to P\) differs in the row \((P, Q) = (T, F)\): \(P \to Q\) is \(F\) there while \(Q \to P\) is \(T\).`,
      },
      lang,
    );
  }
  const contraDiff = data.rows.filter((row) => row.main !== row.contrapositive).length;
  const converseDiff = data.rows.filter((row) => row.main !== row.converse).length;
  return localize(
    {
      ko: String.raw`연결사 \({info.formula}\) (연결사 ${info.nameKo})의 진리표 판정:
\(P \,\mathrm{op}\, Q\)와 \(\lnot Q \to \lnot P\)는 ${contraDiff}개 행에서 다릅니다 — 대우는 함의에만 붙는 이름입니다.
역 \(Q \to P\)와는 ${converseDiff}개 행에서 다릅니다.`,
      en: String.raw`Truth-table verdict for \({info.formula}\) (${info.nameEn}):
\(P \,\mathrm{op}\, Q\) and \(\lnot Q \to \lnot P\) differ in ${contraDiff} rows — the "contrapositive" name belongs to the implication.
It differs from the converse \(Q \to P\) in ${converseDiff} rows.`,
    },
    lang,
  );
}

function explainText(_data: LogicPropositionsData, lang: Lang): string {
  return localize(
    {
      ko: String.raw`두 명제가 모든 행에서 같은 진릿값을 가지면 논리적으로 동치(logically equivalent) — 가능한 모든 경우에 "언제 참인가"가 똑같기 때문입니다.
함의 \(P \to Q\)의 대우 \(\lnot Q \to \lnot P\)가 바로 그 경우입니다: 음영 열 두 개를 행마다 비교해 보세요.
이것이 대우 증명법의 엔진입니다 — "\(P\)이면 \(Q\)이다"를 직접 보이기 어려울 때, 동치인 "\(\lnot Q\)이면 \(\lnot P\)이다"를 증명하면 됩니다.`,
      en: String.raw`Two propositions are logically equivalent when their truth columns match in every row — their "when is this true" answers coincide in every possible case.
The contrapositive \(\lnot Q \to \lnot P\) of the implication \(P \to Q\) is exactly such a pair: compare the two shaded columns row by row.
That is the engine of proof by contrapositive — when "\(P\) implies \(Q\)" is hard to show directly, prove the equivalent "\(\lnot Q\) implies \(\lnot P\)" instead.`,
    },
    lang,
  );
}

function converseText(data: LogicPropositionsData, lang: Lang): string {
  const differ = data.rows.filter((row) => row.main !== row.converse).length;
  return localize(
    {
      ko: String.raw`반면 역 \(Q \to P\)는 어느 연결사에서든 전 행에서 일치하지 않습니다 — 지금은 ${differ}개 행에서 다릅니다.
역은 선택된 연결사가 아니라 함의로 만들어진 식이기 때문입니다: 예컨대 \(P \land Q\)와 \(Q \to P\)는 \((T, F)\) 행에서 \(F\)와 \(T\)로 갈라집니다.`,
      en: String.raw`The converse \(Q \to P\), by contrast, never matches in every row for any connective — right now it differs in ${differ} rows.
That is because the converse is built with implication, not with the selected connective: for instance \(P \land Q\) and \(Q \to P\) split \(F\) vs \(T\) in the row \((T, F)\).`,
    },
    lang,
  );
}

export default defineSimpleScene<LogicPropositionsData>({
  model: logicPropositionsModel,
  margin: MARGIN,
  fallbackHeight: 340,
  drawMain,
  slots: [
    { text: readoutText, cssText: 'font-weight: 600; white-space: pre-line;' },
    { text: explainText, cssText: 'white-space: pre-line; margin-top: 4px;' },
    { text: converseText, cssText: 'white-space: pre-line; margin-top: 4px;' },
  ],
});
