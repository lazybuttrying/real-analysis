import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Jordan decomposition scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/jordan-decomposition.test.ts):
 *   f(1) = sin(1) = 0.8414709848078965 (closed form; f(0) = 0);
 *   grid g(1) = 1.0340625694793135, and g(1) >= |f(1) - f(0)|;
 *   int_0^1 |f'| <= int_0^1 2x dx + int_1^infinity |cos u|/u^2 du <= 1 + 1 = 2
 *   (pencil-and-paper bound; adaptive-Simpson estimate is about 1.0416,
 *   comfortably under 2, so f is BV yet oscillates infinitely near 0).
 */
export const jordanDecompositionProblems: readonly ProblemMeta[] = [
  {
    id: 'variation-function',
    statement: {
      ko: String.raw`\(f\)가 \([a, b]\)에서 유계변동이라고 가정하세요.

\(g(x) = V_a^x(f)\)와 \(h(x) = g(x) - f(x)\)로 두면 \(g\)와 \(h\)가 모두 단조증가이므로 \(f = g - h\)가 성립함을 증명하세요 (조르당 분해의 한 방향).`,
      en: String.raw`Assume \(f\) is of bounded variation on \([a, b]\).

Prove that with \(g(x) = V_a^x(f)\) and \(h(x) = g(x) - f(x)\), both \(g\) and \(h\) are increasing, so \(f = g - h\) (one direction of the Jordan decomposition).`,
    },
    display: [
      String.raw`V_a^{x_2}(f) = V_a^{x_1}(f) + V_{x_1}^{x_2}(f) \qquad (a \le x_1 < x_2 \le b)`,
      String.raw`h(x_2) - h(x_1) = V_{x_1}^{x_2}(f) - \bigl(f(x_2) - f(x_1)\bigr) \ge 0`,
    ],
    preset: { X0: 0.7 },
    presetCaption: {
      ko: String.raw`\(x_0 = 0.7\): 위 그래프에서 \(f = 0.4851\), \(g = 0.6776\), \(h = 0.1926\) — \(g\)와 \(h\)는 둘 다 오른쪽으로 갈수록 올라가고, 그 차이가 정확히 \(f\)입니다.`,
      en: String.raw`At \(x_0 = 0.7\): the plot shows \(f = 0.4851\), \(g = 0.6776\), \(h = 0.1926\) — both \(g\) and \(h\) climb as you move right, and their difference is exactly \(f\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 변동량(variation)의 가산성(additivity)을 증명합니다.

\(a \le x_1 < x_2 \le b\)일 때 \(V_a^{x_2}(f) = V_a^{x_1}(f) + V_{x_1}^{x_2}(f)\)입니다. 부등식 \(\le\)는 다음과 같습니다: \([a, x_2]\)의 임의의 분할 \(P\)에 \(x_1\)이 없으면 추가해도 분할합이 줄어들지 않습니다 (\(\lvert f(v) - f(u)\rvert \le \lvert f(x_1) - f(u)\rvert + \lvert f(v) - f(x_1)\rvert\) 이므로).

\(x_1\)을 포함한 분할의 분할합은 \([a, x_1]\)과 \([x_1, x_2]\)에서의 합으로 갈라지며, 각각은 해당 구간의 변동량 이하이므로, \(P\)에 대한 상한을 취하면 \(\le\)를 얻습니다.`,
          en: String.raw`First prove additivity of variation: for \(a \le x_1 < x_2 \le b\), \(V_a^{x_2}(f) = V_a^{x_1}(f) + V_{x_1}^{x_2}(f)\).

The inequality \(\le\) goes as follows: given any partition \(P\) of \([a, x_2]\), if \(x_1\) is absent we may insert it, since the sum can only grow (\(\lvert f(v) - f(u)\rvert \le \lvert f(x_1) - f(u)\rvert + \lvert f(v) - f(x_1)\rvert\)).

A partition containing \(x_1\) has its sum split into a sum over \([a, x_1]\) plus a sum over \([x_1, x_2]\), each bounded by the variation on that interval; taking the supremum over \(P\) gives \(\le\).`,
        },
      },
      {
        text: {
          ko: String.raw`역부등식 \(\ge\): \([a, x_1]\)의 분할 \(P_1\)과 \([x_1, x_2]\)의 분할 \(P_2\)를 이어 붙이면 \([a, x_2]\)의 분할 \(P_1 \cup P_2\)가 되고, 그 분할합은 두 구간의 분할합의 합과 같습니다.

각 구간에서 상한을 취하면 \(\ge\)를 얻습니다.

\(f\)가 유계변동이므로 모든 상한이 유한합니다.`,
          en: String.raw`The reverse \(\ge\): concatenating a partition \(P_1\) of \([a, x_1]\) with a partition \(P_2\) of \([x_1, x_2]\) gives a partition \(P_1 \cup P_2\) of \([a, x_2]\) whose sum is the sum of the two sums.

Taking suprema on each interval gives \(\ge\).

All suprema are finite since \(f\) is BV.`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(g(x) = V_a^x(f)\)는 단조증가입니다: \(x_1 < x_2\)이면 가산성에 의해 \(g(x_2) = g(x_1) + V_{x_1}^{x_2}(f) \ge g(x_1)\) (변동량은 음이 아닙니다).

그리고 \(h(x_2) - h(x_1) = (g(x_2) - g(x_1)) - (f(x_2) - f(x_1)) = V_{x_1}^{x_2}(f) - (f(x_2) - f(x_1))\)인데, 분할 \(\{x_1, x_2\}\) 하나만 봐도 \(V_{x_1}^{x_2}(f) \ge \lvert f(x_2) - f(x_1)\rvert \ge f(x_2) - f(x_1)\)이므로 \(h(x_2) - h(x_1) \ge 0\) — \(h\)도 단조증가입니다.

\(f = g - h\)는 \(h\)의 정의 그 자체입니다.`,
          en: String.raw`Now \(g(x) = V_a^x(f)\) is increasing: for \(x_1 < x_2\), additivity gives \(g(x_2) = g(x_1) + V_{x_1}^{x_2}(f) \ge g(x_1)\) (variation is nonnegative).

And \(h(x_2) - h(x_1) = (g(x_2) - g(x_1)) - (f(x_2) - f(x_1)) = V_{x_1}^{x_2}(f) - (f(x_2) - f(x_1))\); but \(V_{x_1}^{x_2}(f) \ge \lvert f(x_2) - f(x_1)\rvert \ge f(x_2) - f(x_1)\) from the single partition \(\{x_1, x_2\}\), so \(h(x_2) - h(x_1) \ge 0\) — \(h\) is increasing too.

The identity \(f = g - h\) is the definition of \(h\).`,
        },
      },
    ],
  },
  {
    id: 'converse',
    statement: {
      ko: String.raw`역방향을 증명하세요: \(g, h\)가 \([a, b]\)에서 단조증가이고 \(f = g - h\)이면, \(f\)는 유계변동이고 \(V_a^b(f) \le (g(b) - g(a)) + (h(b) - h(a))\)입니다.`,
      en: String.raw`Prove the converse: if \(g, h\) are increasing on \([a, b]\) and \(f = g - h\), then \(f\) is of bounded variation with \(V_a^b(f) \le (g(b) - g(a)) + (h(b) - h(a))\).`,
    },
    display: [
      String.raw`\lvert f(x_i) - f(x_{i-1})\rvert \le (g(x_i) - g(x_{i-1})) + (h(x_i) - h(x_{i-1}))`,
      String.raw`V_a^b(f) \le (g(b) - g(a)) + (h(b) - h(a))`,
    ],
    preset: { X0: 0.7 },
    presetCaption: {
      ko: String.raw`\(x_0 = 0.7\): \(g\)는 \(0\)에서 \(0.6776\)까지, \(h\)는 \(0\)에서 \(0.1926\)까지 올라갑니다 — 그 합 \(0.8702\)가 \([0, 0.7]\)에서의 \(f\)의 변동량 \(0.6776\)의 상한이 됩니다 (아래 증명의 부등식 그대로).`,
      en: String.raw`At \(x_0 = 0.7\): \(g\) climbs from \(0\) to \(0.6776\) and \(h\) from \(0\) to \(0.1926\) — their sum \(0.8702\) bounds the variation of \(f\) on \([0, 0.7]\), \(0.6776\), exactly as the inequality below says.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\([a, b]\)의 임의의 분할 \(a = x_0 < x_1 < \dots < x_n = b\)를 잡습니다.

각 조각에서
          \(\lvert f(x_i) - f(x_{i-1})\rvert = \lvert (g(x_i) - g(x_{i-1})) - (h(x_i) - h(x_{i-1}))\rvert \le \lvert g(x_i) - g(x_{i-1})\rvert + \lvert h(x_i) - h(x_{i-1})\rvert\) (삼각부등식). \(g\)와 \(h\)가 단조증가이므로 각 차분은 음이 아니어서 절댓값이 그대로 빠집니다.`,
          en: String.raw`Take any partition \(a = x_0 < x_1 < \dots < x_n = b\) of \([a, b]\).

On each piece,
          \(\lvert f(x_i) - f(x_{i-1})\rvert = \lvert (g(x_i) - g(x_{i-1})) - (h(x_i) - h(x_{i-1}))\rvert \le \lvert g(x_i) - g(x_{i-1})\rvert + \lvert h(x_i) - h(x_{i-1})\rvert\) (triangle inequality). Since \(g\) and \(h\) are increasing, each difference is nonnegative, so the absolute values drop away.`,
        },
      },
      {
        text: {
          ko: String.raw`\(i = 1, \dots, n\)에 대해 합하면 \(\sum_{i=1}^{n} \lvert f(x_i) - f(x_{i-1})\rvert \le \sum_{i=1}^{n}(g(x_i) - g(x_{i-1})) + \sum_{i=1}^{n}(h(x_i) - h(x_{i-1}))\)인데, 두 합은 각각 텔레스코핑되어 \((g(b) - g(a)) + (h(b) - h(a))\)가 됩니다. 이 상한은 분할에 무관하므로 모든 분할에 대한 상한을 취하면 \(V_a^b(f) \le (g(b) - g(a)) + (h(b) - h(a)) < \infty\) — \(f\)는 유계변동입니다.`,
          en: String.raw`Summing over \(i = 1, \dots, n\), \(\sum_{i=1}^{n} \lvert f(x_i) - f(x_{i-1})\rvert \le \sum_{i=1}^{n}(g(x_i) - g(x_{i-1})) + \sum_{i=1}^{n}(h(x_i) - h(x_{i-1}))\), and the two sums telescope to \((g(b) - g(a)) + (h(b) - h(a))\). This bound is partition-independent, so taking the supremum over all partitions gives \(V_a^b(f) \le (g(b) - g(a)) + (h(b) - h(a)) < \infty\) — \(f\) is of bounded variation.`,
        },
      },
    ],
  },
  {
    id: 'non-uniqueness',
    statement: {
      ko: String.raw`조르당 분해는 결코 유일하지 않음을 증명하세요: \(f = g - h\) (\(g, h\) 단조증가)이면, 임의의 단조증가 함수 \(u\)에 대해 \(f = (g + u) - (h + u)\)도 또 하나의 분해가 됩니다.`,
      en: String.raw`Prove the Jordan decomposition is never unique: if \(f = g - h\) with \(g, h\) increasing, then for any increasing \(u\), \(f = (g + u) - (h + u)\) is another one.`,
    },
    display: [
      String.raw`f = g - h = (g + u) - (h + u), \qquad u\ \text{increasing}`,
    ],
    preset: { X0: 0.7 },
    presetCaption: {
      ko: String.raw`\(x_0 = 0.7\): 그래프의 \(g\)와 \(h\)에 똑같은 단조증가 함수 \(u\) (예를 들어 \(u(x) = x\))를 더해도 곡선은 둘 다 위로 같은 만큼 올라가고, 차이는 그대로 \(f\) — 분해는 무수히 많습니다.`,
      en: String.raw`At \(x_0 = 0.7\): adding the same increasing \(u\) (say \(u(x) = x\)) to both the \(g\) and \(h\) curves shifts them up in lockstep, leaving the difference \(f\) untouched — there are infinitely many decompositions.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`단조증가 함수의 합은 단조증가입니다: \(x_1 < x_2\)이면 \(g(x_1) \le g(x_2)\)이고 \(u(x_1) \le u(x_2)\)이므로 \((g+u)(x_1) \le (g+u)(x_2)\) — \(h + u\)도 마찬가지입니다.`,
          en: String.raw`A sum of increasing functions is increasing: if \(x_1 < x_2\) then \(g(x_1) \le g(x_2)\) and \(u(x_1) \le u(x_2)\), so \((g+u)(x_1) \le (g+u)(x_2)\) — and the same for \(h + u\).`,
        },
      },
      {
        text: {
          ko: String.raw`그러면 \((g + u) - (h + u) = g - h = f\) — \(u\)가 소거됩니다.

\(u(x) = x\), \(u(x) = x^2\), \(u(x) = 2\) (상수) 등 단조증가 함수는 무수히 많으므로, 조르당 분해도 무수히 많습니다.

유일성을 얻으려면 정규화 조건(예: \(g(a) = 0\) 같은)이 추가로 필요합니다.`,
          en: String.raw`Then \((g + u) - (h + u) = g - h = f\) — the \(u\) cancels.

Since there are infinitely many increasing functions \(u\) (e.g. \(u(x) = x\), \(u(x) = x^2\), \(u(x) = 2\) constant), there are infinitely many Jordan decompositions.

Uniqueness would need an extra normalization (e.g. \(g(a) = 0\)).`,
        },
      },
    ],
  },
];
