import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the limsup-liminf scene.
 * Imports nothing except types. Imported by the chapter's meta.ts.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'p1-alternating',
    statement: {
      ko: String.raw`수열 \(a_n = (-1)^n\left(1+\frac{1}{n}\right)\)의 \(\limsup a_n\)과 \(\liminf a_n\)을 구하세요.`,
      en: String.raw`Find \(\limsup a_n\) and \(\liminf a_n\) of \(a_n = (-1)^n\left(1+\frac{1}{n}\right)\).`,
    },
    display: [String.raw`a_{2k} = 1+\frac{1}{2k} \to 1, \qquad a_{2k+1} = -\left(1+\frac{1}{2k+1}\right) \to -1`],
    preset: { n: 24 },
    presetCaption: {
      ko: String.raw`\(n=24\): 짝수항 \(a_{24} = \frac{25}{24} \approx 1.0417\), 홀수항 \(a_{23} = -\frac{24}{23} \approx -1.0435\).`,
      en: String.raw`\(n=24\): even term \(a_{24} = \frac{25}{24} \approx 1.0417\), odd term \(a_{23} = -\frac{24}{23} \approx -1.0435\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`짝수 부분수열 \(a_{2k} = 1+\frac{1}{2k}\)는 \(1\)로 감소하며 수렴합니다 (\(a_2 = 1.5\)에서 시작).`,
          en: String.raw`The even subsequence \(a_{2k} = 1+\frac{1}{2k}\) decreases to \(1\) (starting at \(a_2 = 1.5\)).`,
        },
      },
      {
        text: {
          ko: String.raw`홀수 부분수열 \(a_{2k+1} = -\left(1+\frac{1}{2k+1}\right)\)는 \(-1\)로 증가하며 수렴합니다 (\(a_3 = -\frac{4}{3}\)에서 시작).`,
          en: String.raw`The odd subsequence \(a_{2k+1} = -\left(1+\frac{1}{2k+1}\right)\) increases to \(-1\) (starting at \(a_3 = -\frac{4}{3}\)).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 꼬리들의 상한은 \(1\)로, 하한은 \(-1\)로 수렴합니다. 즉 \(\limsup a_n = 1\)이고 \(\liminf a_n = -1\)입니다.`,
          en: String.raw`Hence the suprema of the tails tend to \(1\) and the infima to \(-1\): \(\limsup a_n = 1\) and \(\liminf a_n = -1\).`,
        },
      },
    ],
  },
  {
    id: 'p2-limit-equals',
    statement: {
      ko: String.raw`\(\lim a_n = L\)이 존재하면 \(\limsup a_n = \liminf a_n = L\)임을 증명하세요.`,
      en: String.raw`Prove that if \(\lim a_n = L\) exists, then \(\limsup a_n = \liminf a_n = L\).`,
    },
    display: [String.raw`L-\varepsilon < a_n < L+\varepsilon \quad (n \ge N) \implies L-\varepsilon \le \liminf a_n \le \limsup a_n \le L+\varepsilon`],
    preset: { n: 24 },
    presetCaption: {
      ko: String.raw`\(n=24\): 이 장면의 수열은 수렴하지 않아 \(\limsup = 1\)과 \(\liminf = -1\)이 다릅니다.`,
      en: String.raw`\(n=24\): this scene's sequence does not converge, so \(\limsup = 1\) differs from \(\liminf = -1\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이라 합시다. \(\lim a_n = L\)이므로 \(n \ge N\)일 때 \(|a_n - L| < \varepsilon\)인 \(N\)이 존재하고, 즉 \(L - \varepsilon < a_n < L + \varepsilon\)입니다.`,
          en: String.raw`Let \(\varepsilon > 0\). Since \(\lim a_n = L\), there is \(N\) with \(|a_n - L| < \varepsilon\), i.e. \(L - \varepsilon < a_n < L + \varepsilon\), for all \(n \ge N\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(n \ge N\)인 꼬리에 대해 상한과 하한을 취하면 \(L - \varepsilon \le \inf_{n\ge N} a_n \le \sup_{n\ge N} a_n \le L + \varepsilon\)입니다. \(N \to \infty\)이면 \(L - \varepsilon \le \liminf a_n \le \limsup a_n \le L + \varepsilon\)을 얻습니다.`,
          en: String.raw`Taking sup and inf over the tail \(n \ge N\) gives \(L - \varepsilon \le \inf_{n\ge N} a_n \le \sup_{n\ge N} a_n \le L + \varepsilon\). Letting \(N \to \infty\), \(L - \varepsilon \le \liminf a_n \le \limsup a_n \le L + \varepsilon\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)은 임의이므로 \(\liminf a_n = \limsup a_n = L\)입니다.`,
          en: String.raw`Since \(\varepsilon > 0\) is arbitrary, \(\liminf a_n = \limsup a_n = L\).`,
        },
      },
    ],
  },
  {
    id: 'p3-root-test',
    statement: {
      ko: String.raw`근 판정법을 증명하세요: \(\rho = \limsup |a_n|^{1/n} < 1\)이면 \(\sum a_n\)은 절대수렴합니다.`,
      en: String.raw`Prove the root test: if \(\rho = \limsup |a_n|^{1/n} < 1\), then \(\sum a_n\) converges absolutely.`,
    },
    display: [String.raw`\rho = \limsup |a_n|^{1/n} < 1 \implies |a_n| \le r^n \text{ eventually} \implies \sum |a_n| \text{ converges}`],
    preset: { n: 24 },
    presetCaption: {
      ko: String.raw`\(n=24\): \(|a_{24}|^{1/24} \approx 1.0017\)이며 \(\limsup |a_n|^{1/n} = 1\) — 판정이 안 되는 경계입니다.`,
      en: String.raw`\(n=24\): \(|a_{24}|^{1/24} \approx 1.0017\) and \(\limsup |a_n|^{1/n} = 1\) — the inconclusive boundary.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\rho < r < 1\)인 \(r\)을 택합니다. \(\rho\)는 꼬리 상한들의 극한이므로 \(n \ge N\)일 때 \(|a_n|^{1/n} \le r\), 즉 \(|a_n| \le r^n\)인 \(N\)이 존재합니다.`,
          en: String.raw`Pick \(r\) with \(\rho < r < 1\). Since \(\rho\) is the limit of the tail suprema, there is \(N\) such that \(|a_n|^{1/n} \le r\), i.e. \(|a_n| \le r^n\), for all \(n \ge N\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(0 \le r < 1\)이므로 등비급수 \(\sum r^n\)은 수렴합니다. 비교판정법으로 \(\sum |a_n|\)이 수렴하므로 \(\sum a_n\)은 절대수렴합니다.`,
          en: String.raw`Since \(0 \le r < 1\), the geometric series \(\sum r^n\) converges. By comparison, \(\sum |a_n|\) converges, so \(\sum a_n\) converges absolutely.`,
        },
      },
    ],
  },
];
