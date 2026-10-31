import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the ordered-fields scene.
 * Imports nothing except types.
 */
export const orderedFieldsProblems: readonly ProblemMeta[] = [
  {
    id: 'squares-nonnegative',
    statement: {
      ko: String.raw`순서체에서 모든 원소 \(a\)에 대해 \(a^2 \ge 0\)이고 \(1 > 0\)임을 양의 원뿔 공리로부터 완전히 증명하세요.`,
      en: String.raw`Prove completely, from the positive cone axioms, that in an ordered field \(a^2 \ge 0\) for every element \(a\), and \(1 > 0\).`,
    },
    display: [String.raw`a \ne 0 \ \Longrightarrow \ a^2 > 0, \qquad 1 = 1^2 > 0`],
    preset: { mode: 'q', p: 1.25, q: 0.75 },
    presetCaption: {
      ko: String.raw`제곱은 음수가 될 수 없습니다.`,
      en: String.raw`A square can never be negative.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(a > 0\)인 경우: 양의 원뿔은 곱셈에 닫혀 있어 \(a^2 = a \cdot a > 0\)입니다. \(a = 0\)인 경우: \(a^2 = 0\)입니다.`,
          en: String.raw`Case \(a > 0\): the cone is closed under multiplication, so \(a^2 = a \cdot a > 0\). Case \(a = 0\): \(a^2 = 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(a < 0\)인 경우: 삼분법으로 \(-a > 0\)이라 \((-a)^2 > 0\)입니다. 그런데 \((-a)^2 = a^2\)이므로 \(a^2 > 0\)입니다. 세 경우를 합치면 \(a \ne 0\)일 때 \(a^2 > 0\), 항상 \(a^2 \ge 0\)입니다.`,
          en: String.raw`Case \(a < 0\): trichotomy gives \(-a > 0\), so \((-a)^2 > 0\). But \((-a)^2 = a^2\), hence \(a^2 > 0\). Combining the cases: \(a^2 > 0\) whenever \(a \ne 0\), and \(a^2 \ge 0\) always.`,
        },
      },
      {
        text: {
          ko: String.raw`\(1 > 0\): 체에서 \(1 \ne 0\)이고 \(1 = 1^2\)이므로 앞 결과로 \(1 > 0\)입니다.`,
          en: String.raw`\(1 > 0\): in a field \(1 \ne 0\), and \(1 = 1^2\), so the result above gives \(1 > 0\).`,
        },
      },
    ],
  },
  {
    id: 'order-rules-from-cone',
    statement: {
      ko: String.raw`\(a < b\)이면 임의의 \(c\)에 대해 \(a + c < b + c\)이고, \(c > 0\)이면 \(ac < bc\)임을 양의 원뿔 공리로부터 완전히 증명하세요.`,
      en: String.raw`Prove completely, from the positive cone axioms, that \(a < b\) implies \(a + c < b + c\) for every \(c\), and \(ac < bc\) when \(c > 0\).`,
    },
    display: [String.raw`a < b \iff b - a \in P`],
    preset: { mode: 'q', p: 2, q: 0.5 },
    presetCaption: {
      ko: String.raw`순서는 차이 하나로 판정됩니다.`,
      en: String.raw`Order is judged by a single difference.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`정의로 \(a < b\)는 \(b - a \in P\)와 같습니다. 한편 \((b + c) - (a + c) = b - a \in P\)이므로 \(a + c < b + c\)입니다.`,
          en: String.raw`By definition \(a < b\) means \(b - a \in P\). And \((b + c) - (a + c) = b - a \in P\), so \(a + c < b + c\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(c > 0\)이면 원뿔이 곱셈에 닫혀 있어 \(bc - ac = c(b - a) \in P\)입니다. 따라서 \(ac < bc\)입니다.`,
          en: String.raw`When \(c > 0\), cone closure under multiplication gives \(bc - ac = c(b - a) \in P\). Hence \(ac < bc\).`,
        },
      },
    ],
  },
  {
    id: 'complex-not-ordered',
    statement: {
      ko: String.raw`복소수체 \(\mathbb{C}\)는 순서체가 될 수 없음을 완전히 증명하세요.`,
      en: String.raw`Prove completely that the complex field \(\mathbb{C}\) cannot be made into an ordered field.`,
    },
    display: [String.raw`i^2 = -1, \qquad a \ne 0 \ \Longrightarrow \ a^2 > 0`],
    preset: { mode: 'z7' },
    presetCaption: {
      ko: String.raw`순서를 넣을 수 없는 체는 복소수만이 아닙니다.`,
      en: String.raw`The complexes are not the only field that refuses an order.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\mathbb{C}\)에 양의 원뿔 공리를 만족하는 순서가 있다고 가정합니다. \(i \ne 0\)이므로 제곱 결과에 의해 \(i^2 > 0\)이어야 합니다.`,
          en: String.raw`Suppose \(\mathbb{C}\) carried an order satisfying the positive cone axioms. Since \(i \ne 0\), the square result forces \(i^2 > 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`그런데 \(i^2 = -1\)입니다. 한편 \(1 > 0\)이므로 양변에 \(-1\)을 더하면 \(0 > -1\)입니다. 즉 \(-1 > 0\)이면서 \(-1 < 0\)이라 삼분법에 어긋나는 모순입니다.`,
          en: String.raw`But \(i^2 = -1\). And \(1 > 0\), so adding \(-1\) to both sides gives \(0 > -1\). Thus \(-1 > 0\) and \(-1 < 0\) at once, contradicting trichotomy.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 어떤 양의 원뿔도 \(\mathbb{C}\)에 순서를 줄 수 없습니다.`,
          en: String.raw`Hence no positive cone can order \(\mathbb{C}\).`,
        },
      },
    ],
  },
];
