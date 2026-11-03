import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's problems.ts (sibling data module).
 */
export const convergenceAtlasProblems: readonly ProblemMeta[] = [
  {
    id: 'geometric-closed-form',
    statement: {
      ko: String.raw`기하급수 \(\sum_{k=1}^{\infty} (1/2)^k\)의 부분합 닫힌 형태 \(S_n = 1 - 2^{-n}\)을 구하고 극한을 보이세요.`,
      en: String.raw`Find the closed form \(S_n = 1 - 2^{-n}\) for the partial sums of \(\sum_{k=1}^{\infty} (1/2)^k\) and its limit.`,
    },
    display: [String.raw`S_n = \frac12 + \frac14 + \cdots + \frac{1}{2^n} = 1 - \frac{1}{2^n} \to 1`],
    preset: { n: 40, focus: 'geometric' },
    presetCaption: {
      ko: String.raw`부분합이 1에 아래에서 붙어 올라갑니다. 간격은 매번 절반으로 줄어듭니다.`,
      en: String.raw`The partial sums climb onto 1 from below, the gap halving each time.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(2S_n = 1 + \frac12 + \cdots + \frac{1}{2^{n-1}} = 1 + S_n - \frac{1}{2^n}\)이므로 \(S_n = 1 - 2^{-n}\)입니다.`,
          en: String.raw`Since \(2S_n = 1 + \frac12 + \cdots + \frac{1}{2^{n-1}} = 1 + S_n - \frac{1}{2^n}\), we get \(S_n = 1 - 2^{-n}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(2^{-n} \to 0\)이므로 \(S_n \to 1\)입니다. 공비의 절댓값이 1보다 작은 기하급수는 항상 이 방법으로 닫힌 형태가 나옵니다.`,
          en: String.raw`As \(2^{-n} \to 0\), \(S_n \to 1\). Every geometric series with ratio of absolute value below 1 yields to the same trick.`,
        },
      },
    ],
  },
  {
    id: 'harmonic-grouping',
    statement: {
      ko: String.raw`조화급수가 발산함을 항을 \(2\)의 거듭제곱 블록으로 묶어 보이세요. 항이 \(0\)으로 가는 것만으로는 왜 부족한지도 설명하세요.`,
      en: String.raw`Show the harmonic series diverges by grouping terms into blocks of powers of \(2\), and explain why terms going to \(0\) is not enough.`,
    },
    display: [String.raw`\frac{1}{2^k + 1} + \cdots + \frac{1}{2^{k+1}} \ge 2^k \cdot \frac{1}{2^{k+1}} = \frac12`],
    preset: { n: 120, focus: 'harmonic' },
    presetCaption: {
      ko: String.raw`\(n = 120\)에서도 부분합은 계속 자랍니다. 느리지만 멈추지 않습니다.`,
      en: String.raw`Even at \(n = 120\) the partial sums keep growing, slowly but without stopping.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(2^k + 1\)부터 \(2^{k+1}\)까지의 블록은 항이 \(2^k\)개이고 각 항이 \(\frac{1}{2^{k+1}}\) 이상이라, 블록 합은 \(\frac12\) 이상입니다.`,
          en: String.raw`The block from \(2^k + 1\) to \(2^{k+1}\) has \(2^k\) terms, each at least \(\frac{1}{2^{k+1}}\), so each block sums to at least \(\frac12\).`,
        },
      },
      {
        text: {
          ko: String.raw`블록은 무한히 많으므로 부분합은 어떤 상한도 넘어섭니다. 즉 조화급수는 발산합니다.`,
          en: String.raw`There are infinitely many blocks, so the partial sums pass every bound: the harmonic series diverges.`,
        },
      },
      {
        text: {
          ko: String.raw`항 \(\frac1k\)는 \(0\)으로 가지만 급수는 발산합니다. 항이 \(0\)으로 가는 것은 수렴의 필요조건일 뿐 충분조건이 아닙니다. 이 카드가 그 반례입니다.`,
          en: String.raw`The terms \(\frac1k\) go to \(0\) yet the series diverges. Terms going to \(0\) is necessary for convergence, never sufficient, and this card is the counterexample.`,
        },
      },
    ],
  },
  {
    id: 'leibniz-conditional',
    statement: {
      ko: String.raw`교대 조화급수는 수렴하지만 절대수렴하지 않음을 보이세요.`,
      en: String.raw`Show the alternating harmonic series converges but does not converge absolutely.`,
    },
    display: [String.raw`\sum_{k=1}^{\infty} \frac{(-1)^{k+1}}{k} = \ln 2, \qquad \sum_{k=1}^{\infty} \left|\frac{(-1)^{k+1}}{k}\right| = \sum_{k=1}^{\infty} \frac1k = \infty`],
    preset: { n: 120, focus: 'leibniz' },
    presetCaption: {
      ko: String.raw`부분합이 \(\ln 2\)를 위아래로 오가며 좁혀집니다. 절댓값 카드와 비교해 보세요.`,
      en: String.raw`The partial sums close in on \(\ln 2\) from both sides. Compare the absolute card.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`항 \(\frac1k\)는 단조롭게 \(0\)으로 감소하므로 라이프니츠 판정법으로 교대급수는 수렴합니다. 짝수 부분합과 홀수 부분합이 같은 극한으로 좁혀지는 것도 직접 확인할 수 있습니다.`,
          en: String.raw`The terms \(\frac1k\) decrease monotonically to \(0\), so the Leibniz test gives convergence. The even and odd partial sums can also be seen closing on one limit directly.`,
        },
      },
      {
        text: {
          ko: String.raw`절댓값을 취하면 조화급수가 되어 발산합니다. 따라서 이 급수는 조건부로만 수렴합니다.`,
          en: String.raw`Taking absolute values gives the harmonic series, which diverges. So the convergence is conditional only.`,
        },
      },
      {
        text: {
          ko: String.raw`합의 값은 \(\ln 2\)입니다. \(\ln(1 + x)\)의 급수를 \(x = 1\)에서 평가한 것으로, 수렴 속도가 느려 부분합의 오차는 대략 \(\frac{1}{n}\) 수준입니다.`,
          en: String.raw`The sum is \(\ln 2\), from the series for \(\ln(1 + x)\) at \(x = 1\), and the convergence is slow: the partial-sum error is of order \(\frac{1}{n}\).`,
        },
      },
    ],
  },
];
