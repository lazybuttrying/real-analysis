import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the subsequence scene.
 * Imports nothing except types.
 */
export const subsequenceProblems: readonly ProblemMeta[] = [
  {
    id: 'subseq-inherits-limit',
    statement: {
      ko: String.raw`\(a_n \to L\)이면 모든 부분수열 \(a_{n_k}\)도 \(L\)로 수렴함을 완전히 증명하세요.`,
      en: String.raw`Prove completely that if \(a_n \to L\), then every subsequence \(a_{n_k}\) also converges to \(L\).`,
    },
    display: [String.raw`a_n \to L \ \Longrightarrow \ a_{n_k} \to L`],
    preset: { part: 'even', n: 24 },
    presetCaption: {
      ko: String.raw`뽑아낸 짝수 항들도 자기 무리의 극한으로 갑니다.`,
      en: String.raw`The picked even terms still head to their crowd's limit.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 번호의 성질: \(n_1 < n_2 < \cdots\)는 자연수에서 엄격히 증가하므로 모든 \(k\)에 대해 \(n_k \ge k\)입니다. \(k\)에 대한 귀납법으로 봅니다: \(n_1 \ge 1\)이고, \(n_{k + 1} \ge n_k + 1 \ge k + 1\)입니다.`,
          en: String.raw`First, a fact about indices: \(n_1 < n_2 < \cdots\) strictly increases in the naturals, so \(n_k \ge k\) for every \(k\). By induction on \(k\): \(n_1 \ge 1\), and \(n_{k + 1} \ge n_k + 1 \ge k + 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 주어지면, \(a_n \to L\)이므로 어떤 \(N\)이 있어 \(n > N\)이면 \(|a_n - L| < \varepsilon\)입니다. \(k > N\)이면 \(n_k \ge k > N\)이라 \(|a_{n_k} - L| < \varepsilon\)입니다.`,
          en: String.raw`Given \(\varepsilon > 0\), convergence \(a_n \to L\) gives \(N\) with \(|a_n - L| < \varepsilon\) for \(n > N\). For \(k > N\) we have \(n_k \ge k > N\), so \(|a_{n_k} - L| < \varepsilon\).`,
        },
      },
      {
        text: {
          ko: String.raw`같은 \(N\)이 부분수열에도 통합니다. 따라서 \(a_{n_k} \to L\)입니다.`,
          en: String.raw`The same \(N\) works for the subsequence. Hence \(a_{n_k} \to L\).`,
        },
      },
    ],
  },
  {
    id: 'subseq-split-diverges',
    statement: {
      ko: String.raw`수열 \(a_n = (-1)^n + \frac{1}{n}\)의 짝수 부분수열과 홀수 부분수열의 극한을 각각 구하고, 원래 수열이 발산함을 완전히 증명하세요.`,
      en: String.raw`Find the limits of the even and odd subsequences of \(a_n = (-1)^n + \frac{1}{n}\), and prove completely that the original sequence diverges.`,
    },
    display: [String.raw`a_{2k} = 1 + \frac{1}{2k} \to 1, \qquad a_{2k - 1} = -1 + \frac{1}{2k - 1} \to -1`],
    preset: { part: 'all', n: 24 },
    presetCaption: {
      ko: String.raw`두 무리가 갈라지는 전체 그림입니다.`,
      en: String.raw`The full picture: the two crowds split apart.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`짝수 항: \(a_{2k} = 1 + \frac{1}{2k}\)이고 \(\frac{1}{2k} \to 0\)이므로 \(a_{2k} \to 1\)입니다. 홀수 항: \(a_{2k - 1} = -1 + \frac{1}{2k - 1}\)이고 \(\frac{1}{2k - 1} \to 0\)이므로 \(a_{2k - 1} \to -1\)입니다.`,
          en: String.raw`Even terms: \(a_{2k} = 1 + \frac{1}{2k}\) with \(\frac{1}{2k} \to 0\), so \(a_{2k} \to 1\). Odd terms: \(a_{2k - 1} = -1 + \frac{1}{2k - 1}\) with \(\frac{1}{2k - 1} \to 0\), so \(a_{2k - 1} \to -1\).`,
        },
      },
      {
        text: {
          ko: String.raw`원래 수열이 어떤 \(L\)로 수렴한다면, 앞 문제로 모든 부분수열이 \(L\)로 수렴해야 합니다. 그런데 짝수 부분수열은 1로, 홀수 부분수열은 \(-1\)로 갑니다. \(1 \ne -1\)이라 둘 다 \(L\)일 수 없습니다.`,
          en: String.raw`If the original sequence converged to some \(L\), the previous problem forces every subsequence to converge to \(L\). But the even subsequence tends to 1 and the odd one to \(-1\). Since \(1 \ne -1\), they cannot both equal \(L\).`,
        },
      },
      {
        text: {
          ko: String.raw`모순이므로 원래 수열은 어떤 값으로도 수렴하지 않습니다. 발산합니다.`,
          en: String.raw`The contradiction shows the original sequence converges to nothing. It diverges.`,
        },
      },
    ],
  },
  {
    id: 'even-odd-join',
    statement: {
      ko: String.raw`\(a_{2k} \to L\)이고 \(a_{2k - 1} \to L\)이면 \(a_n \to L\)임을 완전히 증명하세요.`,
      en: String.raw`Prove completely that if \(a_{2k} \to L\) and \(a_{2k - 1} \to L\), then \(a_n \to L\).`,
    },
    display: [String.raw`a_{2k} \to L, \ a_{2k - 1} \to L \ \Longrightarrow \ a_n \to L`],
    preset: { part: 'odd', n: 24 },
    presetCaption: {
      ko: String.raw`홀수 항들도 같은 값으로 가면, 전체가 따라갑니다.`,
      en: String.raw`When the odd terms head to the same value, the whole sequence follows.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 주어지면, 짝수 부분수열의 수렴으로 어떤 \(K_1\)이 있어 \(k > K_1\)이면 \(|a_{2k} - L| < \varepsilon\)이고, 홀수 부분수열의 수렴으로 어떤 \(K_2\)가 있어 \(k > K_2\)이면 \(|a_{2k - 1} - L| < \varepsilon\)입니다.`,
          en: String.raw`Given \(\varepsilon > 0\), convergence of the even subsequence gives \(K_1\) with \(|a_{2k} - L| < \varepsilon\) for \(k > K_1\), and convergence of the odd subsequence gives \(K_2\) with \(|a_{2k - 1} - L| < \varepsilon\) for \(k > K_2\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(N = 2 \max(K_1, K_2)\)라 두자. \(n > N\)인 항은 짝수거나 홀수입니다. \(n = 2k\)이면 \(k > K_1\)이라 조건이 성립하고, \(n = 2k - 1\)이면 \(k > K_2\)라 성립합니다. 어느 쪽이든 \(|a_n - L| < \varepsilon\)입니다.`,
          en: String.raw`Put \(N = 2 \max(K_1, K_2)\). Any \(n > N\) is even or odd. If \(n = 2k\) then \(k > K_1\) and the bound holds; if \(n = 2k - 1\) then \(k > K_2\) and it holds. Either way \(|a_n - L| < \varepsilon\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon\)은 임의였으므로 \(a_n \to L\)입니다.`,
          en: String.raw`Since \(\varepsilon\) was arbitrary, \(a_n \to L\).`,
        },
      },
    ],
  },
];
