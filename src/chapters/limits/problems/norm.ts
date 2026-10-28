import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the norm scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/norm.test.ts): for x = (3, 4), the l^1 norm is 7, the
 * l^2 norm is 5, and the l^inf norm is 4.
 */
export const normProblems: readonly ProblemMeta[] = [
  {
    id: 'three-four-norms',
    statement: {
      ko: String.raw`벡터 \\(x = (3, 4)\\)에 대해 \\(\\|x\\|_1\\), \\(\\|x\\|_2\\), \\(\\|x\\|_\\infty\\)를 각각 계산하세요.`,
      en: String.raw`For the vector \\(x = (3, 4)\\), compute \\(\\|x\\|_1\\), \\(\\|x\\|_2\\), and \\(\\|x\\|_\\infty\\) each.`,
    },
    display: [
      String.raw`\|x\|_1 = |x_1| + |x_2|, \qquad \|x\|_2 = \sqrt{x_1^2 + x_2^2}, \qquad \|x\|_\infty = \max(|x_1|, |x_2|)`,
    ],
    preset: { x1: 1.5, x2: 2, y1: 0, y2: 0, p: '2' },
    presetCaption: {
      ko: String.raw`\((3, 4)\)를 2로 나눈 벡터 \((1.5, 2)\) — 동차성으로 길이는 절반이 됩니다.`,
      en: String.raw`The vector \((1.5, 2)\), that is \((3, 4)\) halved — by homogeneity the lengths halve too.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\\(\\|x\\|_1 = |3| + |4| = 7\\)입니다.`,
          en: String.raw`\(\|x\|_1 = |3| + |4| = 7\).`,
        },
      },
      {
        text: {
          ko: String.raw`\\(\\|x\\|_2 = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5\\)입니다.`,
          en: String.raw`\(\|x\|_2 = \sqrt{3^2 + 4^2} = \sqrt{25} = 5\).`,
        },
      },
      {
        text: {
          ko: String.raw`\\(\\|x\\|_\\infty = \\max(|3|, |4|) = 4\\)입니다. 같은 벡터인데 자가 바뀌면 길이가 7, 5, 4로 달라집니다.`,
          en: String.raw`\(\|x\|_\infty = \max(|3|, |4|) = 4\). The same vector measures 7, 5, and 4 under the three rulers.`,
        },
      },
    ],
  },
  {
    id: 'reverse-triangle',
    statement: {
      ko: String.raw`노름의 공리로부터 역삼각부등식 \\(|\\|x\\| - \\|y\\|| \\le \\|x - y\\|\\)를 완전히 증명하세요.`,
      en: String.raw`Prove completely, from the norm axioms, the reverse triangle inequality \(|\|x\| - \|y\|| \le \|x - y\|\).`,
    },
    display: [
      String.raw`|\|x\| - \|y\|| \le \|x - y\|`,
    ],
    preset: { x1: 1, x2: 1, y1: 0.5, y2: 0.5, p: '2' },
    presetCaption: {
      ko: String.raw`\(x = (1, 1)\\), \(y = (0.5, 0.5)\) — 같은 방향이라 길이의 차가 그대로 드러납니다.`,
      en: String.raw`\(x = (1, 1)\), \(y = (0.5, 0.5)\) — parallel, so the difference of lengths shows up directly.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\\(x = (x - y) + y\\)이므로 삼각부등식으로 \\(\\|x\\| \\le \\|x - y\\| + \\|y\\|\\)입니다. 정리하면 \\(\\|x\\| - \\|y\\| \\le \\|x - y\\|\\)입니다.`,
          en: String.raw`Since \(x = (x - y) + y\), the triangle inequality gives \(\|x\| \le \|x - y\| + \|y\|\). Rearranging, \(\|x\| - \|y\| \le \|x - y\|\).`,
        },
      },
      {
        text: {
          ko: String.raw`\\(x\\)와 \\(y\\)의 역할을 바꾸면 \\(\\|y\\| - \\|x\\| \\le \\|y - x\\|\\)입니다. 그런데 \\(\\|y - x\\| = \\|(-1)(x - y)\\| = \\|x - y\\|\\)이므로 \\(\\|y\\| - \\|x\\| \\le \\|x - y\\|\\)도 성립합니다.`,
          en: String.raw`Swapping the roles of \(x\) and \(y\) gives \(\|y\| - \|x\| \le \|y - x\|\). But \(\|y - x\| = \|(-1)(x - y)\| = \|x - y\|\), so \(\|y\| - \|x\| \le \|x - y\|\) holds too.`,
        },
      },
      {
        text: {
          ko: String.raw`두 부등식을 합치면 \\(|\\|x\\| - \\|y\\|| = \\max(\\|x\\| - \\|y\\|, \\|y\\| - \\|x\\|) \\le \\|x - y\\|\\)입니다. 이것이 역삼각부등식입니다.`,
          en: String.raw`Combining the two inequalities, \(|\|x\| - \|y\|| = \max(\|x\| - \|y\|, \|y\| - \|x\|) \le \|x - y\|\). This is the reverse triangle inequality.`,
        },
      },
    ],
  },
  {
    id: 'norm-induces-metric',
    statement: {
      ko: String.raw`노름 \\(\\|\\cdot\\|\\)이 있는 벡터공간에서 \\(d(x, y) = \\|x - y\\|\\)라 두자. \\(d\\)가 거리공간의 공리를 모두 만족함을 완전히 증명하세요.`,
      en: String.raw`On a vector space with a norm \(\|\cdot\|\), put \(d(x, y) = \|x - y\|\). Prove completely that \(d\) satisfies all the metric axioms.`,
    },
    display: [
      String.raw`d(x, y) = \|x - y\|`,
    ],
    preset: { x1: 1, x2: 1, y1: 0, y2: 0, p: '2' },
    presetCaption: {
      ko: String.raw`\(x = (1, 1)\\), \(y = 0\) — 두 점 사이의 거리는 차의 노름입니다.`,
      en: String.raw`\(x = (1, 1)\), \(y = 0\) — the distance between two points is the norm of their difference.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`음이 아님과 분리성: 노름의 첫째 공리로 \\(d(x, y) = \\|x - y\\| \\ge 0\\)이고, \\(d(x, y) = 0\\)은 \\(\\|x - y\\| = 0\\)과 동치이며, 이는 \\(x - y = 0\\), 즉 \\(x = y\\)와 동치입니다.`,
          en: String.raw`Non-negativity and separation: by the first norm axiom, \(d(x, y) = \|x - y\| \ge 0\), and \(d(x, y) = 0\) is equivalent to \(\|x - y\| = 0\), which is equivalent to \(x - y = 0\), that is, \(x = y\).`,
        },
      },
      {
        text: {
          ko: String.raw`대칭성: 노름의 둘째 공리로 \\(d(y, x) = \\|y - x\\| = \\|(-1)(x - y)\\| = |-1| \\|x - y\\| = \\|x - y\\| = d(x, y)\\)입니다.`,
          en: String.raw`Symmetry: by the second norm axiom, \(d(y, x) = \|y - x\| = \|(-1)(x - y)\| = |-1| \|x - y\| = \|x - y\| = d(x, y)\).`,
        },
      },
      {
        text: {
          ko: String.raw`삼각부등식: 노름의 셋째 공리로 \\(d(x, z) = \\|x - z\\| = \\|(x - y) + (y - z)\\| \\le \\|x - y\\| + \\|y - z\\| = d(x, y) + d(y, z)\\)입니다. 네 공리가 모두 성립하므로 \\(d\\)는 거리입니다.`,
          en: String.raw`Triangle inequality: by the third norm axiom, \(d(x, z) = \|x - z\| = \|(x - y) + (y - z)\| \le \|x - y\| + \|y - z\| = d(x, y) + d(y, z)\). All four axioms hold, so \(d\) is a metric.`,
        },
      },
    ],
  },
];
