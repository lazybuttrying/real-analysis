import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'sum-to-n',
    statement: {
      ko: String.raw`\(P(n): \sum_{k=1}^{n} k = \frac{n(n+1)}{2}\)이라 하자.

수학적 귀납법으로 모든 자연수 \(n\)에 대해 이 식이 성립함을 증명하세요.`,
      en: String.raw`Let \(P(n)\) be the statement \(\sum_{k=1}^{n} k = \frac{n(n+1)}{2}\).

Prove by mathematical induction that it holds for every natural number \(n\).`,
    },
    display: [String.raw`1 + 2 + \cdots + n = \frac{n(n+1)}{2}`],
    preset: { n: 6 },
    presetCaption: {
      ko: String.raw`\(n = 6\) — 도미노 6개, 즉 \(1+2+\cdots+6 = 21\)인 경우.`,
      en: String.raw`\(n = 6\) — six dominoes, i.e. the case \(1+2+\cdots+6 = 21\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`기저: \(n = 1\)일 때 좌변은 \(1\)이고 우변은 \(\frac{1\cdot 2}{2} = 1\)이므로 \(P(1)\)은 참입니다. 첫 도미노가 쓰러졌습니다.`,
          en: String.raw`Base: for \(n = 1\) the left side is \(1\) and the right side is \(\frac{1\cdot 2}{2} = 1\), so \(P(1)\) holds. The first domino falls.`,
        },
      },
      {
        text: {
          ko: String.raw`귀납 단계: \(P(k)\)가 참이라 가정합니다, 즉 \(1+2+\cdots+k = \frac{k(k+1)}{2}\)입니다. 양변에 \(k+1\)을 더하면

\(1+2+\cdots+k+(k+1) = \frac{k(k+1)}{2} + (k+1) = \frac{(k+1)(k+2)}{2}\)를 얻습니다. 이는 정확히 \(P(k+1)\)입니다. 따라서 \(P(k) \Rightarrow P(k+1)\) — 쓰러진 도미노가 다음 도미노를 쓰러뜨립니다.`,
          en: String.raw`Inductive step: assume \(P(k)\) holds, i.e. \(1+2+\cdots+k = \frac{k(k+1)}{2}\).

Adding \(k+1\) to both sides gives
\(1+2+\cdots+k+(k+1) = \frac{k(k+1)}{2} + (k+1) = \frac{(k+1)(k+2)}{2}\), which is exactly \(P(k+1)\). Hence \(P(k) \Rightarrow P(k+1)\) — each fallen domino knocks over the next.`,
        },
      },
      {
        text: {
          ko: String.raw`귀납 원리에 의해 \(P(n)\)은 모든 자연수 \(n\)에 대해 참입니다. 따라서 \(\sum_{k=1}^{n} k = \frac{n(n+1)}{2}\) — 기저와 귀납 단계 두 가지 검사로 무한히 많은 식이 한 번에 증명되었습니다.`,
          en: String.raw`By the induction principle, \(P(n)\) holds for every natural number \(n\). Hence \(\sum_{k=1}^{n} k = \frac{n(n+1)}{2}\) — the base case plus one inductive step proves infinitely many statements at once.`,
        },
      },
    ],
  },
  {
    id: 'bernoulli',
    statement: {
      ko: String.raw`\(x > -1\)인 모든 실수 \(x\)와 모든 자연수 \(n\)에 대해 \((1+x)^n \ge 1+nx\)임을 수학적 귀납법으로 증명하세요 (베르누이 부등식).`,
      en: String.raw`Prove by mathematical induction that \((1+x)^n \ge 1+nx\) for every real \(x > -1\) and every natural number \(n\) (Bernoulli's inequality).`,
    },
    display: [String.raw`(1+x)^n \geq 1 + nx \quad (x > -1)`],
    preset: { n: 6 },
    presetCaption: {
      ko: String.raw`\(n = 6\) — \(x > -1\)인 모든 \(x\)에 대해 \((1+x)^6 \ge 1+6x\).`,
      en: String.raw`\(n = 6\) — \((1+x)^6 \ge 1+6x\) for every \(x > -1\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`기저: \(n = 1\)일 때 \((1+x)^1 = 1+x = 1+1\cdot x\)이므로 부등식은 등호로 성립합니다. \(x > -1\) 가정은 여기서는 아직 쓰이지 않았습니다.`,
          en: String.raw`Base: for \(n = 1\), \((1+x)^1 = 1+x = 1+1\cdot x\), so the inequality holds with equality. The hypothesis \(x > -1\) is not needed yet.`,
        },
      },
      {
        text: {
          ko: String.raw`귀납 단계: \((1+x)^k \ge 1+kx\)라 가정합니다. \(x > -1\)이므로 \(1+x > 0\)이고, 부등식의 양변에 양수 \(1+x\)를 곱해도 부등호 방향이 바뀌지 않습니다:

\((1+x)^{k+1} \ge (1+kx)(1+x) = 1 + (k+1)x + kx^2\). 여기서 \(kx^2 \ge 0\)이므로 우변은 \(1+(k+1)x\) 이상입니다. 따라서 \((1+x)^{k+1} \ge 1+(k+1)x\) — 즉 \(P(k) \Rightarrow P(k+1)\)입니다.`,
          en: String.raw`Inductive step: assume \((1+x)^k \ge 1+kx\). Since \(x > -1\), we have \(1+x > 0\), and multiplying both sides of the inequality by the positive number \(1+x\) preserves its direction:

\((1+x)^{k+1} \ge (1+kx)(1+x) = 1 + (k+1)x + kx^2\). Because \(kx^2 \ge 0\), the right side is at least \(1+(k+1)x\). Hence \((1+x)^{k+1} \ge 1+(k+1)x\) — that is, \(P(k) \Rightarrow P(k+1)\).`,
        },
      },
      {
        text: {
          ko: String.raw`귀납 원리에 의해 모든 자연수 \(n\)에 대해 \((1+x)^n \ge 1+nx\)가 성립합니다. \(1+x > 0\)이라는 조건이 귀납 단계의 핵심이었습니다 — 부등식에 양수가 아닌 수를 곱하면 부등호가 뒤집히기 때문입니다.`,
          en: String.raw`By the induction principle, \((1+x)^n \ge 1+nx\) holds for every natural number \(n\). The condition \(1+x > 0\) was the key to the inductive step — multiplying an inequality by a non-positive number would flip the inequality sign.`,
        },
      },
    ],
  },
  {
    id: 'powers-of-two',
    statement: {
      ko: String.raw`모든 자연수 \(n\)에 대해 \(2^n > n\)임을 수학적 귀납법으로 증명하세요.`,
      en: String.raw`Prove by mathematical induction that \(2^n > n\) for every natural number \(n\).`,
    },
    display: [String.raw`2^n > n \quad (n \in \mathbb{N})`],
    preset: { n: 6 },
    presetCaption: {
      ko: String.raw`\(n = 6\) — \(2^6 = 64 > 6\)처럼 지수함수가 선형을 앞지른다.`,
      en: String.raw`\(n = 6\) — \(2^6 = 64 > 6\): the exponential pulls ahead of the linear term.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`기저: \(n = 1\)일 때 \(2^1 = 2 > 1\)이므로 \(P(1)\)은 참입니다.`,
          en: String.raw`Base: for \(n = 1\), \(2^1 = 2 > 1\), so \(P(1)\) holds.`,
        },
      },
      {
        text: {
          ko: String.raw`귀납 단계: \(2^k > k\)라 가정합니다. 양변에 \(2\)를 곱하면 \(2^{k+1} = 2\cdot 2^k > 2k\)를 얻습니다.

그런데 \(k \ge 1\)이므로 \(2k = k+k \ge k+1\)입니다. 따라서 \(2^{k+1} > k+1\) — 즉 \(P(k) \Rightarrow P(k+1)\)입니다.`,
          en: String.raw`Inductive step: assume \(2^k > k\). Multiplying both sides by \(2\) gives \(2^{k+1} = 2\cdot 2^k > 2k\).

Since \(k \ge 1\), we have \(2k = k+k \ge k+1\). Hence \(2^{k+1} > k+1\) — that is, \(P(k) \Rightarrow P(k+1)\).`,
        },
      },
      {
        text: {
          ko: String.raw`귀납 원리에 의해 모든 자연수 \(n\)에 대해 \(2^n > n\)입니다. 지수적 증가는 결국 선형 증가를 압도합니다 — 이 증명은 그 압도의 최소 단위인 "\(2\)를 곱하면 \(1\)을 더하는 것보다 크다"는 관찰을 \(n\)번 반복하는 것입니다.`,
          en: String.raw`By the induction principle, \(2^n > n\) for every natural number \(n\). Exponential growth eventually dominates linear growth — this proof just repeats \(n\) times the elementary observation that "doubling beats adding one".`,
        },
      },
    ],
  },
];
