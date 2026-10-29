import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the absolute-value scene.
 * Imports nothing except types. Numbers verified against the model
 * (tests/absolute-value.test.ts).
 */
export const absoluteValueProblems: readonly ProblemMeta[] = [
  {
    id: 'abs-triangle-inequality',
    statement: {
      ko: String.raw`모든 실수 \(x, y\)에 대해 삼각부등식 \(|x + y| \le |x| + |y|\)가 성립함을 완전히 증명하세요.`,
      en: String.raw`Prove completely that for all real \(x, y\), the triangle inequality \(|x + y| \le |x| + |y|\) holds.`,
    },
    display: [String.raw`|x + y| \le |x| + |y|`],
    preset: { x: 1.5, y: -0.5 },
    presetCaption: {
      ko: String.raw`부호가 다른 경우 — 합이 한쪽을 상쇄해서 여유가 생깁니다.`,
      en: String.raw`Opposite signs — the sum cancels in part, leaving slack.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`양변 모두 음이 아니므로 제곱해서 비교합니다. \(|x + y|^2 = (x + y)^2 = x^2 + 2xy + y^2\)입니다.`,
          en: String.raw`Both sides are non-negative, so compare their squares. \(|x + y|^2 = (x + y)^2 = x^2 + 2xy + y^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`가운데 항을 가둡니다: \(xy \le |xy| = |x| \, |y|\)이므로 \(|x + y|^2 \le |x|^2 + 2|x| \, |y| + |y|^2 = (|x| + |y|)^2\)입니다.`,
          en: String.raw`Trap the middle term: \(xy \le |xy| = |x| \, |y|\), so \(|x + y|^2 \le |x|^2 + 2|x| \, |y| + |y|^2 = (|x| + |y|)^2\).`,
        },
      },
      {
        text: {
          ko: String.raw`음이 아닌 수에서는 제곱근이 순서를 지킵니다. 양변에 제곱근을 취하면 \(|x + y| \le |x| + |y|\)가 됩니다. 증명이 완료됩니다.`,
          en: String.raw`On non-negative numbers the square root preserves order. Taking square roots of both sides gives \(|x + y| \le |x| + |y|\). The proof is complete.`,
        },
      },
    ],
  },
  {
    id: 'abs-reverse-triangle',
    statement: {
      ko: String.raw`모든 실수 \(x, y\)에 대해 \(\bigl| |x| - |y| \bigr| \le |x - y|\)가 성립함을 완전히 증명하세요.`,
      en: String.raw`Prove completely that for all real \(x, y\), \(\bigl| |x| - |y| \bigr| \le |x - y|\) holds.`,
    },
    display: [String.raw`\bigl| |x| - |y| \bigr| \le |x - y|`],
    preset: { x: 2, y: 0.5 },
    presetCaption: {
      ko: String.raw`같은 방향의 두 점 — 길이의 차가 거리를 넘지 않습니다.`,
      en: String.raw`Two points in the same direction — the difference of lengths never exceeds the distance.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(x = (x - y) + y\)이므로 삼각부등식으로 \(|x| \le |x - y| + |y|\)입니다. 정리하면 \(|x| - |y| \le |x - y|\)입니다.`,
          en: String.raw`Since \(x = (x - y) + y\), the triangle inequality gives \(|x| \le |x - y| + |y|\). Rearranging, \(|x| - |y| \le |x - y|\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(x\)와 \(y\)의 역할을 바꾸면 \(|y| - |x| \le |y - x|\)입니다. 그런데 \(|y - x| = |x - y|\)이므로 \(|y| - |x| \le |x - y|\)도 성립합니다.`,
          en: String.raw`Swapping the roles of \(x\) and \(y\) gives \(|y| - |x| \le |y - x|\). But \(|y - x| = |x - y|\), so \(|y| - |x| \le |x - y|\) holds too.`,
        },
      },
      {
        text: {
          ko: String.raw`두 부등식을 합치면 \(\bigl| |x| - |y| \bigr| = \max(|x| - |y|, |y| - |x|) \le |x - y|\)입니다. 증명이 완료됩니다.`,
          en: String.raw`Combining the two, \(\bigl| |x| - |y| \bigr| = \max(|x| - |y|, |y| - |x|) \le |x - y|\). The proof is complete.`,
        },
      },
    ],
  },
  {
    id: 'abs-solve-inequality',
    statement: {
      ko: String.raw`부등식 \(|x - 1| < 2\)를 만족하는 모든 실수 \(x\)를 구하고, 그 동치를 완전히 증명하세요.`,
      en: String.raw`Find all real \(x\) satisfying \(|x - 1| < 2\), and prove the equivalence completely.`,
    },
    display: [String.raw`|x - 1| < 2 \iff -1 < x < 3`],
    preset: { x: 1, y: 0 },
    presetCaption: {
      ko: String.raw`\(x = 1\) — 중심점에서는 거리가 0입니다.`,
      en: String.raw`\(x = 1\) — at the center the distance is 0.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`절댓값의 정의로, 음이 아닌 수 \(a\)와 \(r > 0\)에 대해 \(|a| < r\)인 것은 \(-r < a < r\)인 것과 동치입니다. 부호를 나눠 확인합니다: \(a \ge 0\)이면 \(|a| = a\)라 \(a < r\)이고 \(-r < 0 \le a\)라 성립하고, \(a < 0\)이면 \(|a| = -a\)라 \(-a < r\), 즉 \(-r < a\)이고 \(a < 0 < r\)이라 성립합니다.`,
          en: String.raw`By the definition, for \(r > 0\), \(|a| < r\) is equivalent to \(-r < a < r\). Check by sign: if \(a \ge 0\) then \(|a| = a\), so \(a < r\) and \(-r < 0 \le a\); if \(a < 0\) then \(|a| = -a\), so \(-a < r\), i.e. \(-r < a\), and \(a < 0 < r\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(a = x - 1\), \(r = 2\)로 적용하면 \(|x - 1| < 2\)는 \(-2 < x - 1 < 2\)와 동치입니다. 세 변에 1을 더하면 \(-1 < x < 3\)입니다.`,
          en: String.raw`Applying this with \(a = x - 1\) and \(r = 2\), \(|x - 1| < 2\) is equivalent to \(-2 < x - 1 < 2\). Adding 1 throughout gives \(-1 < x < 3\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 해는 열린 구간 \((-1, 3)\)입니다. 말로 하면, 1에서 거리가 2보다 가까운 점들의 모임입니다.`,
          en: String.raw`So the solution set is the open interval \((-1, 3)\): exactly the points whose distance from 1 is less than 2.`,
        },
      },
    ],
  },
];
