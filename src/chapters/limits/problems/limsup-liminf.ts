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
          ko: String.raw`꼬리 상한을 직접 계산합니다. \(\sup_{n \ge N} a_n = \max\left(\sup_{\substack{n \ge N \\ n \text{ 짝수}}} a_n,\; \sup_{\substack{n \ge N \\ n \text{ 홀수}}} a_n\right)\)입니다. 짝수 꼬리에서는 \(a_{2k} = 1 + \frac{1}{2k} \downarrow 1\)이므로 \(\sup_{\text{짝수 } \ge N} a_n = 1 + \frac{1}{2\lceil N/2 \rceil}\)입니다. 홀수 꼬리에서는 모든 항이 \(-1\) 이하이므로 \(\sup_{\text{홀수 } \ge N} a_n \le -1 < 1\)입니다. 따라서 \(\max\)는 짝수 쪽이 결정하고 \(\sup_{n \ge N} a_n = 1 + \frac{1}{2\lceil N/2 \rceil}\)입니다. \(\varepsilon > 0\)에 대해 \(N > \frac{1}{\varepsilon}\)이면 \(0 \le \sup_{n \ge N} a_n - 1 = \frac{1}{2\lceil N/2 \rceil} \le \frac{1}{N} < \varepsilon\) — 즉 \(\sup_{n \ge N} a_n \to 1\)이므로 \(\limsup a_n = 1\)입니다.`,
          en: String.raw`Compute the tail suprema directly. \(\sup_{n \ge N} a_n = \max\left(\sup_{\substack{n \ge N \\ n \text{ even}}} a_n,\; \sup_{\substack{n \ge N \\ n \text{ odd}}} a_n\right)\). On the even tail, \(a_{2k} = 1 + \frac{1}{2k} \downarrow 1\), so \(\sup_{\text{even } \ge N} a_n = 1 + \frac{1}{2\lceil N/2 \rceil}\). On the odd tail every term is at most \(-1\), so \(\sup_{\text{odd } \ge N} a_n \le -1 < 1\). Hence the \(\max\) is decided by the even side: \(\sup_{n \ge N} a_n = 1 + \frac{1}{2\lceil N/2 \rceil}\). Given \(\varepsilon > 0\), \(N > \frac{1}{\varepsilon}\) gives \(0 \le \sup_{n \ge N} a_n - 1 = \frac{1}{2\lceil N/2 \rceil} \le \frac{1}{N} < \varepsilon\) — so \(\sup_{n \ge N} a_n \to 1\) and \(\limsup a_n = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`하한도 대칭적입니다. \(\inf_{n \ge N} a_n = \min\left(\inf_{\text{짝수 } \ge N} a_n,\; \inf_{\text{홀수 } \ge N} a_n\right)\)에서 짝수 쪽은 \(\inf \ge 1 > -1\)이고, 홀수 쪽은 \(a_{2k+1} = -\left(1 + \frac{1}{2k+1}\right) \uparrow -1\)이므로 \(\inf_{\text{홀수 } \ge N} a_n = -\left(1 + \frac{1}{2\lfloor N/2 \rfloor + 1}\right)\)입니다. 따라서 \(\inf_{n \ge N} a_n = -\left(1 + \frac{1}{2\lfloor N/2 \rfloor + 1}\right) \to -1\)이고 \(\liminf a_n = -1\)입니다.`,
          en: String.raw`The infimum is symmetric. In \(\inf_{n \ge N} a_n = \min\left(\inf_{\text{even } \ge N} a_n,\; \inf_{\text{odd } \ge N} a_n\right)\) the even side has \(\inf \ge 1 > -1\), while on the odd side \(a_{2k+1} = -\left(1 + \frac{1}{2k+1}\right) \uparrow -1\), so \(\inf_{\text{odd } \ge N} a_n = -\left(1 + \frac{1}{2\lfloor N/2 \rfloor + 1}\right)\). Hence \(\inf_{n \ge N} a_n = -\left(1 + \frac{1}{2\lfloor N/2 \rfloor + 1}\right) \to -1\) and \(\liminf a_n = -1\).`,
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
          ko: String.raw`먼저 유계성: 수렴수열은 유계입니다 — \(\varepsilon = 1\)로 두면 \(n \ge N_0\)일 때 \(|a_n - L| < 1\)인 \(N_0\)이 있어 꼬리에서는 \(|a_n| \le |L| + 1\)이고, 앞의 유한 개 항은 그 최댓값으로 묶입니다. 따라서 어떤 \(M\)에 대해 모든 \(n\)에서 \(|a_n| \le M\)이며, 모든 꼬리 상한 \(\sup_{n\ge N} a_n\)과 꼬리 하한 \(\inf_{n\ge N} a_n\)은 유한하고 \(\limsup a_n, \liminf a_n\)이 실수로서 잘 정의됩니다. 이제 \(\varepsilon > 0\)이라 합시다. \(\lim a_n = L\)이므로 \(n \ge N\)일 때 \(|a_n - L| < \varepsilon\)인 \(N\)이 존재하고, 즉 \(L - \varepsilon < a_n < L + \varepsilon\)입니다.`,
          en: String.raw`Boundedness first: a convergent sequence is bounded — with \(\varepsilon = 1\) there is \(N_0\) with \(|a_n - L| < 1\) for \(n \ge N_0\), so \(|a_n| \le |L| + 1\) on the tail, and the finitely many earlier terms are bounded by their maximum; hence \(|a_n| \le M\) for all \(n\) and some \(M\). Therefore every tail supremum \(\sup_{n\ge N} a_n\) and tail infimum \(\inf_{n\ge N} a_n\) is finite, and \(\limsup a_n, \liminf a_n\) are well-defined real numbers. Now let \(\varepsilon > 0\). Since \(\lim a_n = L\), there is \(N\) with \(|a_n - L| < \varepsilon\), i.e. \(L - \varepsilon < a_n < L + \varepsilon\), for all \(n \ge N\).`,
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
          ko: String.raw`모든 \(n\)에 대해 \(|a_n|^{1/n} \ge 0\)이므로 \(\rho = \limsup |a_n|^{1/n} \ge 0\)입니다. 따라서 택한 \(r\)은 \(0 \le \rho < r < 1\)을 만족하고 특히 \(0 \le r < 1\)이므로, 등비급수 \(\sum r^n\)은 수렴합니다. 비교판정법으로 \(\sum |a_n|\)이 수렴하므로 \(\sum a_n\)은 절대수렴합니다.`,
          en: String.raw`Since \(|a_n|^{1/n} \ge 0\) for every \(n\), \(\rho = \limsup |a_n|^{1/n} \ge 0\); hence the chosen \(r\) satisfies \(0 \le \rho < r < 1\), in particular \(0 \le r < 1\), so the geometric series \(\sum r^n\) converges. By comparison, \(\sum |a_n|\) converges, so \(\sum a_n\) converges absolutely.`,
        },
      },
    ],
  },
];
