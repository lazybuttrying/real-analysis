import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the bounded scene.
 * Imports nothing except types.
 */
export const boundedProblems: readonly ProblemMeta[] = [
  {
    id: 'ratio-bounded-sup',
    statement: {
      ko: String.raw`수열 \(a_n = \frac{n}{n + 1}\)이 유계임을 보이고, 그 상한이 1이며 어떤 항도 1에 도달하지 않음을 완전히 증명하세요.`,
      en: String.raw`Show the sequence \(a_n = \frac{n}{n + 1}\) is bounded, and prove completely that its supremum is 1, a value no term ever reaches.`,
    },
    display: [String.raw`0 < \frac{n}{n + 1} < 1, \qquad \sup_n a_n = 1`],
    preset: { kind: 'ratio', n: 20 },
    presetCaption: {
      ko: String.raw`1에 다가가지만 닿지는 않습니다.`,
      en: String.raw`Approaching 1 but never touching it.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`유계성: \(n \ge 1\)이면 \(0 < n < n + 1\)이라 \(0 < a_n < 1\)입니다. 따라서 모든 항이 \(|a_n| \le 1\)을 만족해 유계입니다.`,
          en: String.raw`Boundedness: for \(n \ge 1\), \(0 < n < n + 1\), so \(0 < a_n < 1\). Hence every term satisfies \(|a_n| \le 1\): the sequence is bounded.`,
        },
      },
      {
        text: {
          ko: String.raw`1이 상계 중 가장 작음: \(\varepsilon > 0\)이 주어지면 아르키메데스 성질로 \(\frac{1}{\varepsilon} < n + 1\)인 \(n\)이 있습니다. 그 \(n\)에 대해 \(a_n = 1 - \frac{1}{n + 1} > 1 - \varepsilon\)입니다. 즉 1보다 작은 수는 상계가 될 수 없습니다.`,
          en: String.raw`1 is the least upper bound: given \(\varepsilon > 0\), the Archimedean property gives \(n\) with \(\frac{1}{\varepsilon} < n + 1\). For that \(n\), \(a_n = 1 - \frac{1}{n + 1} > 1 - \varepsilon\). So no number below 1 is an upper bound.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(\sup a_n = 1\)입니다. 그리고 모든 항이 \(a_n < 1\)이라 상한에 도달하는 항은 없습니다.`,
          en: String.raw`Hence \(\sup a_n = 1\). And since every term satisfies \(a_n < 1\), no term attains the supremum.`,
        },
      },
    ],
  },
  {
    id: 'convergent-implies-bounded',
    statement: {
      ko: String.raw`수렴하는 수열은 항상 유계임을 완전히 증명하세요.`,
      en: String.raw`Prove completely that every convergent sequence is bounded.`,
    },
    display: [String.raw`a_n \to L \ \Longrightarrow \ (a_n) \text{ is bounded}`],
    preset: { kind: 'ratio', n: 12 },
    presetCaption: {
      ko: String.raw`수렴하는 예 — 꼬리는 극한 근처에 갇히고, 머리는 유한 개뿐입니다.`,
      en: String.raw`A convergent example — the tail is trapped near the limit, and the head has only finitely many terms.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(a_n \to L\)이라 하자. \(\varepsilon = 1\)로 수렴의 정의를 적용하면 어떤 \(N\)이 있어 \(n > N\)인 모든 항은 \(|a_n - L| < 1\), 즉 \(|a_n| < |L| + 1\)을 만족합니다. 꼬리는 가둬졌습니다.`,
          en: String.raw`Suppose \(a_n \to L\). Applying the definition of convergence with \(\varepsilon = 1\) gives \(N\) such that every \(n > N\) has \(|a_n - L| < 1\), hence \(|a_n| < |L| + 1\). The tail is trapped.`,
        },
      },
      {
        text: {
          ko: String.raw`머리는 유한합니다: \(a_1, \dots, a_N\)은 유한 개라 \(M_0 = \max(|a_1|, \dots, |a_N|)\)이 존재합니다.`,
          en: String.raw`The head is finite: \(a_1, \dots, a_N\) are finitely many numbers, so \(M_0 = \max(|a_1|, \dots, |a_N|)\) exists.`,
        },
      },
      {
        text: {
          ko: String.raw`\(M = \max(M_0, |L| + 1)\)로 두면 머리 항도 꼬리 항도 모두 \(|a_n| \le M\)을 만족합니다. 따라서 수열은 유계입니다.`,
          en: String.raw`With \(M = \max(M_0, |L| + 1)\), both head terms and tail terms satisfy \(|a_n| \le M\). So the sequence is bounded.`,
        },
      },
    ],
  },
  {
    id: 'alt-bounded-divergent',
    statement: {
      ko: String.raw`수열 \(a_n = (-1)^n\)은 유계이지만 수렴하지 않음을 완전히 증명하세요.`,
      en: String.raw`Prove completely that the sequence \(a_n = (-1)^n\) is bounded but does not converge.`,
    },
    display: [String.raw`|a_n| = 1 \ \forall n, \qquad a_n \not\to L \ \forall L`],
    preset: { kind: 'alt', n: 20 },
    presetCaption: {
      ko: String.raw`울타리 안에서는 왔다 갔다만 합니다.`,
      en: String.raw`Inside the fence, just bouncing back and forth.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`유계성: 모든 항이 \(|a_n| = 1\)이라 \(M = 1\)이 울타리입니다.`,
          en: String.raw`Boundedness: every term has \(|a_n| = 1\), so \(M = 1\) is a fence.`,
        },
      },
      {
        text: {
          ko: String.raw`수렴하지 않음: 어떤 실수 \(L\)로 수렴한다고 가정하자. 이웃한 두 항은 \(|a_{n + 1} - a_n| = 2\)입니다. 그런데 수렴하면 \(\varepsilon = \frac{1}{2}\)에 대해 어떤 \(N\) 뒤의 모든 항은 \(L\)에서 \(\frac{1}{2}\) 안에 들어갑니다. 그러면 이웃한 두 항 사이의 거리는 삼각부등식으로 \(|a_{n + 1} - a_n| \le |a_{n + 1} - L| + |L - a_n| < 1\)이어야 합니다.`,
          en: String.raw`Non-convergence: suppose it converged to some real \(L\). Neighbouring terms satisfy \(|a_{n + 1} - a_n| = 2\). But convergence with \(\varepsilon = \frac{1}{2}\) puts every term past some \(N\) within \(\frac{1}{2}\) of \(L\). Then neighbouring terms would satisfy \(|a_{n + 1} - a_n| \le |a_{n + 1} - L| + |L - a_n| < 1\) by the triangle inequality.`,
        },
      },
      {
        text: {
          ko: String.raw`\(2 < 1\)일 수는 없으므로 모순입니다. 어떤 \(L\)로도 수렴하지 않습니다. 유계이지만 수렴하지 않는 수열이 존재합니다.`,
          en: String.raw`But \(2 < 1\) is impossible — a contradiction. So it converges to no \(L\). A bounded sequence need not converge.`,
        },
      },
    ],
  },
];
