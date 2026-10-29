import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the squeeze scene.
 * Imports nothing except types.
 */
export const squeezeProblems: readonly ProblemMeta[] = [
  {
    id: 'squeeze-proof',
    statement: {
      ko: String.raw`조임 정리를 완전히 증명하세요: 모든 \(n\)에 대해 \(a_n \le b_n \le c_n\)이고 \(a_n \to L\), \(c_n \to L\)이면 \(b_n \to L\)입니다.`,
      en: String.raw`Prove the squeeze theorem completely: if \(a_n \le b_n \le c_n\) for every \(n\) and \(a_n \to L\), \(c_n \to L\), then \(b_n \to L\).`,
    },
    display: [String.raw`a_n \le b_n \le c_n, \quad a_n \to L, \ c_n \to L \ \Longrightarrow \ b_n \to L`],
    preset: { n: 30 },
    presetCaption: {
      ko: String.raw`\(\frac{\sin n}{n}\) — 양쪽 경비가 0으로 좁혀집니다.`,
      en: String.raw`\(\frac{\sin n}{n}\) — both guards close in on 0.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 주어졌다고 하자. \(a_n \to L\)이므로 어떤 \(N_1\)이 있어 \(n > N_1\)이면 \(|a_n - L| < \varepsilon\), 즉 \(L - \varepsilon < a_n\)입니다. 마찬가지로 \(c_n \to L\)이므로 어떤 \(N_2\)가 있어 \(n > N_2\)이면 \(c_n < L + \varepsilon\)입니다.`,
          en: String.raw`Let \(\varepsilon > 0\) be given. Since \(a_n \to L\), there is \(N_1\) with \(|a_n - L| < \varepsilon\) for \(n > N_1\), i.e. \(L - \varepsilon < a_n\). Likewise \(c_n \to L\) gives \(N_2\) with \(c_n < L + \varepsilon\) for \(n > N_2\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(N = \max(N_1, N_2)\)라 두자. \(n > N\)이면 두 조건이 동시에 성립하고 끼인 부등식과 합치면 \(L - \varepsilon < a_n \le b_n \le c_n < L + \varepsilon\)입니다. 따라서 \(|b_n - L| < \varepsilon\)입니다.`,
          en: String.raw`Put \(N = \max(N_1, N_2)\). For \(n > N\) both conditions hold at once, and combining with the trapping inequality gives \(L - \varepsilon < a_n \le b_n \le c_n < L + \varepsilon\). Hence \(|b_n - L| < \varepsilon\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon\)은 임의였으므로 \(b_n \to L\)입니다. 증명이 완료됩니다.`,
          en: String.raw`Since \(\varepsilon\) was arbitrary, \(b_n \to L\). The proof is complete.`,
        },
      },
    ],
  },
  {
    id: 'squeeze-sin-over-n',
    statement: {
      ko: String.raw`조임 정리로 \(\lim_{n \to \infty} \frac{\sin n}{n} = 0\)임을 완전히 증명하세요.`,
      en: String.raw`Using the squeeze theorem, prove completely that \(\lim_{n \to \infty} \frac{\sin n}{n} = 0\).`,
    },
    display: [String.raw`-\frac{1}{n} \le \frac{\sin n}{n} \le \frac{1}{n}`],
    preset: { n: 45 },
    presetCaption: {
      ko: String.raw`항을 늘리면 진동하면서도 0으로 좁혀집니다.`,
      en: String.raw`More terms: still oscillating, but closing in on 0.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`모든 실수 \(t\)에 대해 \(|\sin t| \le 1\)입니다. \(n \ge 1\)에서 양변을 \(n\)으로 나누면 \(-\frac{1}{n} \le \frac{\sin n}{n} \le \frac{1}{n}\)입니다.`,
          en: String.raw`For every real \(t\), \(|\sin t| \le 1\). Dividing by \(n \ge 1\) gives \(-\frac{1}{n} \le \frac{\sin n}{n} \le \frac{1}{n}\).`,
        },
      },
      {
        text: {
          ko: String.raw`양쪽 끝은 모두 0으로 갑니다: \(\frac{1}{n} \to 0\)이고 \(-\frac{1}{n} \to 0\)입니다 (아르키메데스 따름정리). 조임 정리를 적용하면 \(\frac{\sin n}{n} \to 0\)입니다.`,
          en: String.raw`Both ends tend to 0: \(\frac{1}{n} \to 0\) and \(-\frac{1}{n} \to 0\) (the Archimedean corollary). The squeeze theorem now gives \(\frac{\sin n}{n} \to 0\).`,
        },
      },
    ],
  },
  {
    id: 'squeeze-alternating',
    statement: {
      ko: String.raw`조임 정리로 \(\lim_{n \to \infty} \frac{n + (-1)^n}{n} = 1\)임을 완전히 증명하세요.`,
      en: String.raw`Using the squeeze theorem, prove completely that \(\lim_{n \to \infty} \frac{n + (-1)^n}{n} = 1\).`,
    },
    display: [String.raw`\frac{n - 1}{n} \le \frac{n + (-1)^n}{n} \le \frac{n + 1}{n}`],
    preset: { n: 15 },
    presetCaption: {
      ko: String.raw`진동 항이 있어도 비율은 1로 좁혀집니다.`,
      en: String.raw`Even with the oscillating term, the ratio is squeezed to 1.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\((-1)^n\)은 \(-1\)과 \(1\) 사이이므로 \(-1 \le (-1)^n \le 1\)입니다. \(n\)을 더하고 \(n\)으로 나누면 \(\frac{n - 1}{n} \le \frac{n + (-1)^n}{n} \le \frac{n + 1}{n}\)입니다.`,
          en: String.raw`Since \((-1)^n\) is either \(-1\) or \(1\), \(-1 \le (-1)^n \le 1\). Adding \(n\) and dividing by \(n\) gives \(\frac{n - 1}{n} \le \frac{n + (-1)^n}{n} \le \frac{n + 1}{n}\).`,
        },
      },
      {
        text: {
          ko: String.raw`왼쪽 끝은 \(\frac{n - 1}{n} = 1 - \frac{1}{n} \to 1\)이고, 오른쪽 끝은 \(\frac{n + 1}{n} = 1 + \frac{1}{n} \to 1\)입니다. 조임 정리로 가운데도 1로 갑니다.`,
          en: String.raw`The left end is \(\frac{n - 1}{n} = 1 - \frac{1}{n} \to 1\) and the right end is \(\frac{n + 1}{n} = 1 + \frac{1}{n} \to 1\). By the squeeze theorem the middle tends to 1 as well.`,
        },
      },
    ],
  },
];
