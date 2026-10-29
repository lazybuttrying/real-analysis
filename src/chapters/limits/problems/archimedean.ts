import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the archimedean scene.
 * Imports nothing except types. Numbers verified against the model
 * (tests/archimedean.test.ts).
 */
export const archimedeanProblems: readonly ProblemMeta[] = [
  {
    id: 'archimedean-proof',
    statement: {
      ko: String.raw`상한 공리로부터 아르키메데스 성질을 완전히 증명하세요: 임의의 \(a > 0\)와 실수 \(b\)에 대해 \(na > b\)인 자연수 \(n\)이 존재합니다.`,
      en: String.raw`Prove the Archimedean property completely from the least-upper-bound axiom: for every \(a > 0\) and real \(b\) there is a natural \(n\) with \(na > b\).`,
    },
    display: [String.raw`\forall a > 0, \ \forall b \in \mathbb{R}, \ \exists n \in \mathbb{N}: \ na > b`],
    preset: { a: 0.5, b: 5 },
    presetCaption: {
      ko: String.raw`걸음 0.5, 목표 5 — 11걸음이면 넘어섭니다.`,
      en: String.raw`Step 0.5, target 5 — 11 steps get past.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`모순을 가정합니다: 모든 자연수 \(n\)에 대해 \(na \le b\)라고 하자. 그러면 집합 \(S = \{na : n \in \mathbb{N}\}\)은 \(b\)를 상계로 가져 비어 있지 않은 위로 유계인 집합입니다.`,
          en: String.raw`Assume the contrary: \(na \le b\) for every natural \(n\). Then the set \(S = \{na : n \in \mathbb{N}\}\) is non-empty and bounded above by \(b\).`,
        },
      },
      {
        text: {
          ko: String.raw`상한 공리로 \(s = \sup S\)가 존재합니다. \(a > 0\)이므로 \(s - a < s\)이고, \(s - a\)는 상한보다 작아 \(S\)의 상계가 아닙니다. 따라서 어떤 \(m\)에 대해 \(ma > s - a\)입니다.`,
          en: String.raw`By the least-upper-bound axiom, \(s = \sup S\) exists. Since \(a > 0\), \(s - a < s\), and \(s - a\), being below the supremum, is not an upper bound for \(S\). So for some \(m\), \(ma > s - a\).`,
        },
      },
      {
        text: {
          ko: String.raw`양변에 \(a\)를 더하면 \((m + 1)a > s\)입니다. 그런데 \((m + 1)a \in S\)이므로 이는 \(s\)가 \(S\)의 상한, 특히 상계라는 사실과 모순입니다. 따라서 가정이 틀렸고, \(na > b\)인 \(n\)이 존재합니다.`,
          en: String.raw`Adding \(a\) to both sides gives \((m + 1)a > s\). But \((m + 1)a \in S\), contradicting that \(s\) is an upper bound for \(S\). So the assumption fails, and some \(n\) has \(na > b\).`,
        },
      },
    ],
  },
  {
    id: 'archimedean-reciprocal',
    statement: {
      ko: String.raw`아르키메데스 성질로부터, 임의의 \(\varepsilon > 0\)에 대해 \(\frac{1}{n} < \varepsilon\)인 자연수 \(n\)이 존재함을 완전히 증명하세요.`,
      en: String.raw`Prove completely, from the Archimedean property, that for every \(\varepsilon > 0\) there is a natural \(n\) with \(\frac{1}{n} < \varepsilon\).`,
    },
    display: [String.raw`\forall \varepsilon > 0, \ \exists n \in \mathbb{N}: \ \frac{1}{n} < \varepsilon`],
    preset: { a: 0.25, b: 1 },
    presetCaption: {
      ko: String.raw`걸음 0.25, 목표 1 — 5걸음이면 넘어섭니다. \(\frac{1}{5} < 0.25\)에 해당합니다.`,
      en: String.raw`Step 0.25, target 1 — 5 steps get past, matching \(\frac{1}{5} < 0.25\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)을 걸음으로, \(b = 1\)을 목표로 아르키메데스 성질을 적용합니다: \(n\varepsilon > 1\)인 자연수 \(n\)이 존재합니다.`,
          en: String.raw`Apply the Archimedean property with step \(\varepsilon > 0\) and target \(b = 1\): there is a natural \(n\) with \(n\varepsilon > 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(n, \varepsilon\) 모두 양수이므로 양변을 \(n\varepsilon\)로 나누면 \(\frac{1}{\varepsilon} \cdot \varepsilon = 1\) 쪽이 정리되어 \(\frac{1}{n} < \varepsilon\)이 됩니다. 정확히는 \(n\varepsilon > 1\)을 \(n\)으로 나누어 \(\varepsilon > \frac{1}{n}\)입니다. 증명이 완료됩니다.`,
          en: String.raw`Both \(n\) and \(\varepsilon\) are positive, so dividing \(n\varepsilon > 1\) by \(n\) gives \(\varepsilon > \frac{1}{n}\). The proof is complete.`,
        },
      },
    ],
  },
  {
    id: 'archimedean-only-zero',
    statement: {
      ko: String.raw`\(x \ge 0\)이고 모든 자연수 \(n\)에 대해 \(x < \frac{1}{n}\)이면 \(x = 0\)임을 완전히 증명하세요.`,
      en: String.raw`Prove completely that if \(x \ge 0\) and \(x < \frac{1}{n}\) for every natural \(n\), then \(x = 0\).`,
    },
    display: [String.raw`x \ge 0, \ (\forall n) \ x < \frac{1}{n} \ \Longrightarrow \ x = 0`],
    preset: { a: 0.1, b: 1 },
    presetCaption: {
      ko: String.raw`걸음을 아무리 작게 해도 목표는 넘어섭니다 — 그 사이에 끼인 양수는 없습니다.`,
      en: String.raw`However small the step, the march still passes the target — no positive number fits in between.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`모순을 위해 \(x > 0\)이라 가정합니다. \(\varepsilon = x\)로 앞 문제의 따름정리를 적용하면 \(\frac{1}{n} < x\)인 자연수 \(n\)이 존재합니다.`,
          en: String.raw`Suppose for contradiction that \(x > 0\). Applying the corollary of the previous problem with \(\varepsilon = x\) gives a natural \(n\) with \(\frac{1}{n} < x\).`,
        },
      },
      {
        text: {
          ko: String.raw`그런데 가정에 의해 같은 \(n\)에 대해 \(x < \frac{1}{n}\)입니다. \(\frac{1}{n} < x\)이면서 \(x < \frac{1}{n}\)일 수는 없습니다. 모순이므로 \(x > 0\)은 거짓이고, \(x \ge 0\)과 합치면 \(x = 0\)입니다.`,
          en: String.raw`But the hypothesis gives \(x < \frac{1}{n}\) for the same \(n\). A number cannot satisfy both \(\frac{1}{n} < x\) and \(x < \frac{1}{n}\). The contradiction shows \(x > 0\) is false, and with \(x \ge 0\) this forces \(x = 0\).`,
        },
      },
    ],
  },
];
