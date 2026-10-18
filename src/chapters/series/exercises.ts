import type { ExerciseMeta } from '../../contracts.ts';

/**
 * End-of-chapter exercises for the 급수 chapter.
 * Ordered easy -> hard. All statements are original compositions; solutions
 * are complete bilingual proofs. TeX via String.raw with \(...\) inline math only.
 */
export const exercises: readonly ExerciseMeta[] = [
  // ------------------------------------------------------------------
  // Difficulty 1
  // ------------------------------------------------------------------
  {
    id: 'log-over-square',
    difficulty: 1,
    topics: ['tests', 'condensation'],
    statement: {
      ko: String.raw`급수 \(\sum_{n=2}^{\infty}\frac{\ln n}{n^2}\)가 수렴함을 극한 비교 판정법으로 증명하세요.`,
      en: String.raw`Prove that \(\sum_{n=2}^{\infty}\frac{\ln n}{n^2}\) converges, using the limit comparison test.`,
    },
    display: [String.raw`\frac{\ln n / n^2}{1/n^{3/2}} = \frac{\ln n}{\sqrt{n}} \to 0`],
    solution: [
      {
        text: {
          ko: String.raw`\(a_n = \frac{\ln n}{n^2} > 0\) (\(n \ge 2\))이라 두고, 비교 급수로 \(b_n = \frac{1}{n^{3/2}}\)를 잡습니다. \(\sum b_n\)은 \(p = \frac{3}{2} > 1\)인 \(p\)-급수이므로 수렴합니다.`,
          en: String.raw`Put \(a_n = \frac{\ln n}{n^2} > 0\) (\(n \ge 2\)) and take \(b_n = \frac{1}{n^{3/2}}\) as the comparison series. \(\sum b_n\) converges since it is a \(p\)-series with \(p = \frac{3}{2} > 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\frac{a_n}{b_n} = \frac{\ln n}{\sqrt{n}}\)입니다. 로피탈 정리를 \(x \to \infty\)에 적용하면 \(\frac{\ln x}{x^{1/2}} \to \frac{1/x}{\frac{1}{2}x^{-1/2}} = \frac{2}{\sqrt{x}} \to 0\)이므로, \(\frac{a_n}{b_n} \to 0\)입니다.`,
          en: String.raw`\(\frac{a_n}{b_n} = \frac{\ln n}{\sqrt{n}}\). L'Hôpital's rule as \(x \to \infty\) gives \(\frac{\ln x}{x^{1/2}} \to \frac{1/x}{\frac{1}{2}x^{-1/2}} = \frac{2}{\sqrt{x}} \to 0\), so \(\frac{a_n}{b_n} \to 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`극한 비교 판정법의 "극한이 0인 경우": \(\frac{a_n}{b_n} \to 0\)이고 \(\sum b_n\)이 수렴하면 \(\sum a_n\)도 수렴합니다. 따라서 \(\sum_{n=2}^{\infty}\frac{\ln n}{n^2}\)는 수렴합니다.`,
          en: String.raw`By the limit-\(0\) case of the limit comparison test: if \(\frac{a_n}{b_n} \to 0\) and \(\sum b_n\) converges, then \(\sum a_n\) converges. Hence \(\sum_{n=2}^{\infty}\frac{\ln n}{n^2}\) converges.`,
        },
      },
    ],
  },
  {
    id: 'telescoping-product',
    difficulty: 1,
    topics: ['telescoping', 'wallis'],
    statement: {
      ko: String.raw`\(N \ge 2\)에 대해 부분곱 \(P_N = \prod_{n=2}^{N}\left(1-\frac{1}{n^2}\right)\)을 계산하고, \(\lim_{N\to\infty} P_N = \frac{1}{2}\)임을 증명하세요.`,
      en: String.raw`For \(N \ge 2\), evaluate the partial product \(P_N = \prod_{n=2}^{N}\left(1-\frac{1}{n^2}\right)\) and prove \(\lim_{N\to\infty} P_N = \frac{1}{2}\).`,
    },
    display: [String.raw`P_N = \frac{N+1}{2N} \to \frac{1}{2}`],
    solution: [
      {
        text: {
          ko: String.raw`\(1-\frac{1}{n^2} = \frac{n^2-1}{n^2} = \frac{(n-1)(n+1)}{n^2}\)이므로, 곱을 두 부분으로 나눕니다: \(P_N = \prod_{n=2}^{N}\frac{n-1}{n}\cdot\prod_{n=2}^{N}\frac{n+1}{n}\).`,
          en: String.raw`Since \(1-\frac{1}{n^2} = \frac{n^2-1}{n^2} = \frac{(n-1)(n+1)}{n^2}\), split the product in two: \(P_N = \prod_{n=2}^{N}\frac{n-1}{n}\cdot\prod_{n=2}^{N}\frac{n+1}{n}\).`,
        },
      },
      {
        text: {
          ko: String.raw`첫 번째 곱은 망원곱입니다: \(\frac{1}{2}\cdot\frac{2}{3}\cdots\frac{N-1}{N} = \frac{1}{N}\). 두 번째 곱도 마찬가지입니다: \(\frac{3}{2}\cdot\frac{4}{3}\cdots\frac{N+1}{N} = \frac{N+1}{2}\).`,
          en: String.raw`The first product telescopes: \(\frac{1}{2}\cdot\frac{2}{3}\cdots\frac{N-1}{N} = \frac{1}{N}\). So does the second: \(\frac{3}{2}\cdot\frac{4}{3}\cdots\frac{N+1}{N} = \frac{N+1}{2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(P_N = \frac{1}{N}\cdot\frac{N+1}{2} = \frac{N+1}{2N} = \frac{1}{2}+\frac{1}{2N} \to \frac{1}{2}\)입니다. 즉 무한곱 \(\prod_{n=2}^{\infty}\left(1-\frac{1}{n^2}\right)\)는 \(\frac{1}{2}\)로 수렴합니다.`,
          en: String.raw`Hence \(P_N = \frac{1}{N}\cdot\frac{N+1}{2} = \frac{N+1}{2N} = \frac{1}{2}+\frac{1}{2N} \to \frac{1}{2}\). So the infinite product \(\prod_{n=2}^{\infty}\left(1-\frac{1}{n^2}\right)\) converges to \(\frac{1}{2}\).`,
        },
      },
    ],
  },
  {
    id: 'alternating-bound',
    difficulty: 1,
    topics: ['leibniz', 'tests'],
    statement: {
      ko: String.raw`급수 \(\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n(n+1)}\)가 수렴함을 보이고, 세 번째 부분합 \(S_3\)을 계산한 뒤, 나머지 오차 \(|S - S_3|\)의 상한을 구하세요.`,
      en: String.raw`Show that \(\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n(n+1)}\) converges, compute the third partial sum \(S_3\), and bound the remainder \(|S - S_3|\).`,
    },
    display: [String.raw`S_3 = \frac{1}{2}-\frac{1}{6}+\frac{1}{12} = \frac{5}{12}, \qquad |S-S_3| \le \frac{1}{20}`],
    solution: [
      {
        text: {
          ko: String.raw`\(b_n = \frac{1}{n(n+1)}\)이라 두면 \(n(n+1)\)이 단조증가하므로 \(b_n\)은 \(0\)으로 단조감소합니다. 따라서 교대급수 판정법(라이프니츠)에 의해 급수는 수렴합니다.`,
          en: String.raw`With \(b_n = \frac{1}{n(n+1)}\), \(b_n\) decreases monotonically to \(0\) because \(n(n+1)\) is strictly increasing. Hence the series converges by the alternating series (Leibniz) test.`,
        },
      },
      {
        text: {
          ko: String.raw`\(S_3 = \frac{1}{1\cdot 2}-\frac{1}{2\cdot 3}+\frac{1}{3\cdot 4} = \frac{1}{2}-\frac{1}{6}+\frac{1}{12} = \frac{6-2+1}{12} = \frac{5}{12}\)입니다.`,
          en: String.raw`\(S_3 = \frac{1}{1\cdot 2}-\frac{1}{2\cdot 3}+\frac{1}{3\cdot 4} = \frac{1}{2}-\frac{1}{6}+\frac{1}{12} = \frac{6-2+1}{12} = \frac{5}{12}\).`,
        },
      },
      {
        text: {
          ko: String.raw`교대급수 오차 추정에 의해 \(|S - S_3| \le b_4 = \frac{1}{4\cdot 5} = \frac{1}{20} = 0.05\)입니다. 즉 \(S = \frac{5}{12} \pm 0.05\) 범위 안에 있습니다.`,
          en: String.raw`The alternating-series error bound gives \(|S - S_3| \le b_4 = \frac{1}{4\cdot 5} = \frac{1}{20} = 0.05\). So \(S\) lies within \(0.05\) of \(\frac{5}{12}\).`,
        },
      },
    ],
  },
  // ------------------------------------------------------------------
  // Difficulty 2
  // ------------------------------------------------------------------
  {
    id: 'raabe-weighted-central',
    difficulty: 2,
    topics: ['raabe-test', 'tests'],
    statement: {
      ko: String.raw`급수 \(\sum_{n=1}^{\infty} \frac{(2n)!}{4^n (n!)^2}\cdot\frac{1}{n}\)에 비율 판정법이 왜 결론을 내지 못하는지 설명하고, 라베 판정법으로 수렴함을 증명하세요.`,
      en: String.raw`Explain why the ratio test is inconclusive for \(\sum_{n=1}^{\infty} \frac{(2n)!}{4^n (n!)^2}\cdot\frac{1}{n}\), then prove convergence with Raabe's test.`,
    },
    display: [String.raw`n\left(1-\frac{a_{n+1}}{a_n}\right) = \frac{n(3n+2)}{2(n+1)^2} \to \frac{3}{2} > 1`],
    solution: [
      {
        text: {
          ko: String.raw`\(a_n = \frac{(2n)!}{4^n (n!)^2}\cdot\frac{1}{n} > 0\)이라 둡니다. \(\frac{a_{n+1}}{a_n} = \frac{(2n+2)(2n+1)}{4}\cdot\frac{1}{(n+1)^2}\cdot\frac{n}{n+1} = \frac{n(2n+1)}{2(n+1)^2} \to 1\)이므로 비율 판정법은 결론을 내지 못합니다.`,
          en: String.raw`Put \(a_n = \frac{(2n)!}{4^n (n!)^2}\cdot\frac{1}{n} > 0\). Then \(\frac{a_{n+1}}{a_n} = \frac{(2n+2)(2n+1)}{4}\cdot\frac{1}{(n+1)^2}\cdot\frac{n}{n+1} = \frac{n(2n+1)}{2(n+1)^2} \to 1\), so the ratio test is inconclusive.`,
        },
      },
      {
        text: {
          ko: String.raw`라베 판정량을 계산합니다: \(1-\frac{a_{n+1}}{a_n} = \frac{2(n+1)^2-n(2n+1)}{2(n+1)^2} = \frac{3n+2}{2(n+1)^2}\)이므로, \(n\left(1-\frac{a_{n+1}}{a_n}\right) = \frac{n(3n+2)}{2(n+1)^2} \to \frac{3}{2}\).`,
          en: String.raw`Compute the Raabe quantity: \(1-\frac{a_{n+1}}{a_n} = \frac{2(n+1)^2-n(2n+1)}{2(n+1)^2} = \frac{3n+2}{2(n+1)^2}\), hence \(n\left(1-\frac{a_{n+1}}{a_n}\right) = \frac{n(3n+2)}{2(n+1)^2} \to \frac{3}{2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`극한 \(\frac{3}{2} > 1\)이므로 라베 판정법으로 \(\sum a_n\)은 수렴합니다. (참고로 중심이항계수 \(\binom{2n}{n} \sim \frac{4^n}{\sqrt{\pi n}}\)이므로 \(a_n \sim \frac{1}{\sqrt{\pi}\,n^{3/2}}\)입니다.)`,
          en: String.raw`Since the limit \(\frac{3}{2} > 1\), Raabe's test gives convergence of \(\sum a_n\). (Indeed \(\binom{2n}{n} \sim \frac{4^n}{\sqrt{\pi n}}\), so \(a_n \sim \frac{1}{\sqrt{\pi}\,n^{3/2}}\).)`,
        },
      },
    ],
  },
  {
    id: 'conditional-expansion',
    difficulty: 2,
    topics: ['leibniz', 'tests'],
    statement: {
      ko: String.raw`급수 \(\sum_{n=2}^{\infty}\frac{(-1)^n}{\,n+(-1)^n\sqrt{n}\,}\)가 조건수렴함을 증명하세요. (힌트: \(\frac{1}{1+u} = 1-u+\frac{u^2}{1+u}\)를 이용하세요.)`,
      en: String.raw`Prove that \(\sum_{n=2}^{\infty}\frac{(-1)^n}{\,n+(-1)^n\sqrt{n}\,}\) converges conditionally. (Hint: use \(\frac{1}{1+u} = 1-u+\frac{u^2}{1+u}\).)`,
    },
    display: [String.raw`\frac{(-1)^n}{n+(-1)^n\sqrt{n}} = \frac{(-1)^n}{n}-\frac{1}{n^{3/2}}+\sigma_n, \quad |\sigma_n| \le \frac{C}{n^2}`],
    solution: [
      {
        text: {
          ko: String.raw`\(b_n = \frac{1}{n+(-1)^n\sqrt{n}} > 0\) (\(n \ge 2\))이라 둡니다. 분모에서 \(n\)을 묶으면 \(b_n = \frac{1}{n}\cdot\frac{1}{1+u_n}\) (\(u_n = \frac{(-1)^n}{\sqrt{n}}\), \(|u_n| \le \frac{1}{\sqrt{2}}\))입니다. 힌트의 항등식으로 \(\frac{1}{1+u_n} = 1-u_n+\rho_n\) (\(|\rho_n| = \frac{u_n^2}{|1+u_n|} \le \frac{C}{n}\), \(C = \frac{1}{1-1/\sqrt{2}}\))를 얻습니다.`,
          en: String.raw`Put \(b_n = \frac{1}{n+(-1)^n\sqrt{n}} > 0\) (\(n \ge 2\)). Factoring \(n\) from the denominator, \(b_n = \frac{1}{n}\cdot\frac{1}{1+u_n}\) with \(u_n = \frac{(-1)^n}{\sqrt{n}}\), \(|u_n| \le \frac{1}{\sqrt{2}}\). The hint's identity gives \(\frac{1}{1+u_n} = 1-u_n+\rho_n\) where \(|\rho_n| = \frac{u_n^2}{|1+u_n|} \le \frac{C}{n}\) with \(C = \frac{1}{1-1/\sqrt{2}}\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \((-1)^n b_n = \frac{(-1)^n}{n}-\frac{(-1)^n u_n}{n}+\frac{(-1)^n\rho_n}{n}\)인데, \((-1)^n u_n = \frac{1}{\sqrt{n}}\)이므로 \((-1)^n b_n = \frac{(-1)^n}{n}-\frac{1}{n^{3/2}}+\sigma_n\) (\(|\sigma_n| \le \frac{C}{n^2}\))입니다. 세 급수 \(\sum\frac{(-1)^n}{n}\) (교대급수 판정법), \(\sum\frac{1}{n^{3/2}}\) (\(p\)-급수), \(\sum\sigma_n\) (절대수렴)이 모두 수렴하므로 \(\sum (-1)^n b_n\)은 수렴합니다.`,
          en: String.raw`Hence \((-1)^n b_n = \frac{(-1)^n}{n}-\frac{(-1)^n u_n}{n}+\frac{(-1)^n\rho_n}{n}\), and since \((-1)^n u_n = \frac{1}{\sqrt{n}}\), we get \((-1)^n b_n = \frac{(-1)^n}{n}-\frac{1}{n^{3/2}}+\sigma_n\) with \(|\sigma_n| \le \frac{C}{n^2}\). The three series \(\sum\frac{(-1)^n}{n}\) (alternating series test), \(\sum\frac{1}{n^{3/2}}\) (\(p\)-series), and \(\sum\sigma_n\) (absolutely convergent) all converge, so \(\sum (-1)^n b_n\) converges.`,
        },
      },
      {
        text: {
          ko: String.raw`절대수렴은 하지 않습니다: \(n+(-1)^n\sqrt{n} \le n+\sqrt{n} \le 2n\) (\(n \ge 1\))이므로 \(b_n \ge \frac{1}{2n}\)이고, \(\sum\frac{1}{2n}\)은 발산하므로 비교 판정법으로 \(\sum b_n\)도 발산합니다. 따라서 조건수렴입니다.`,
          en: String.raw`It does not converge absolutely: \(n+(-1)^n\sqrt{n} \le n+\sqrt{n} \le 2n\) (\(n \ge 1\)), so \(b_n \ge \frac{1}{2n}\), and \(\sum\frac{1}{2n}\) diverges; by comparison \(\sum b_n\) diverges too. Hence the convergence is conditional.`,
        },
      },
    ],
  },
  // ------------------------------------------------------------------
  // Difficulty 3
  // ------------------------------------------------------------------
  {
    id: 'bertrand-series',
    difficulty: 3,
    topics: ['condensation', 'tests'],
    statement: {
      ko: String.raw`\(p\)가 실수일 때, 베르트랑 급수 \(\sum_{n=3}^{\infty}\frac{1}{n\,\ln n\,(\ln\ln n)^p}\)가 수렴할 필요충분조건이 \(p > 1\)임을 응축 판정법을 두 번 써서 증명하세요.`,
      en: String.raw`For real \(p\), prove by applying the condensation test twice that the Bertrand series \(\sum_{n=3}^{\infty}\frac{1}{n\,\ln n\,(\ln\ln n)^p}\) converges if and only if \(p > 1\).`,
    },
    display: [String.raw`\sum 2^n a_{2^n} = \sum_{n\ge 3}\frac{1}{\ln 2\cdot n\,(\ln(n\ln 2))^p} \asymp \sum_{n\ge 3}\frac{1}{n(\ln n)^p}`],
    solution: [
      {
        text: {
          ko: String.raw`\(a_n = \frac{1}{n\,\ln n\,(\ln\ln n)^p}\) (\(n \ge 3\))이라 둡니다. \(n \ge 3\)에서 \(\ln\ln n > 0\)이고 \(n\), \(\ln n\), \((\ln\ln n)^p\)가 모두 양의 증가함수이므로, \(a_n\)은 \(0\)으로 단조감소합니다. 응축 판정법을 적용할 수 있습니다.`,
          en: String.raw`Put \(a_n = \frac{1}{n\,\ln n\,(\ln\ln n)^p}\) (\(n \ge 3\)). For \(n \ge 3\), \(\ln\ln n > 0\) and each of \(n\), \(\ln n\), \((\ln\ln n)^p\) is positive and increasing, so \(a_n\) decreases monotonically to \(0\). The condensation test applies.`,
        },
      },
      {
        text: {
          ko: String.raw`첫 번째 응축: \(2^n a_{2^n} = \frac{1}{\ln 2\cdot n\,(\ln(n\ln 2))^p}\)입니다. \(\ln(n\ln 2) = \ln n+\ln\ln 2\)이고 \(\ln\ln 2 \approx -0.3665\)이므로, \(n \ge 3\)에서 \(\frac{1}{2}\ln n \le \ln(n\ln 2) \le \ln n\)입니다 (위쪽은 \(\ln 2 < 1\)에서, 아래쪽은 \(\frac{1}{2}\ln n \ge -\ln\ln 2\) 즉 \(n \ge 3\)에서 성립).`,
          en: String.raw`First condensation: \(2^n a_{2^n} = \frac{1}{\ln 2\cdot n\,(\ln(n\ln 2))^p}\). Since \(\ln(n\ln 2) = \ln n+\ln\ln 2\) with \(\ln\ln 2 \approx -0.3665\), we have \(\frac{1}{2}\ln n \le \ln(n\ln 2) \le \ln n\) for \(n \ge 3\) (the upper bound from \(\ln 2 < 1\); the lower from \(\frac{1}{2}\ln n \ge -\ln\ln 2\), true for \(n \ge 3\)).`,
        },
      },
      {
        text: {
          ko: String.raw`\(p > 0\)인 경우 이 양쪽 부등식으로 응축된 급수는 \(\sum_{n\ge 3}\frac{1}{n(\ln n)^p}\)와 상수배 범위에서 동등합니다 (비교 판정법). 두 번째 응축을 적용하면 \(\sum 2^n\cdot\frac{1}{2^n(n\ln 2)^p} = \frac{1}{(\ln 2)^p}\sum\frac{1}{n^p}\)가 되며, 이는 \(p > 1\)일 때만 수렴합니다. 따라서 \(p > 0\)에서는 \(p > 1\)일 때 수렴, \(0 < p \le 1\)일 때 발산합니다.`,
          en: String.raw`For \(p > 0\) these two-sided bounds make the condensed series comparable, up to constants, to \(\sum_{n\ge 3}\frac{1}{n(\ln n)^p}\) (comparison test). Condensing again gives \(\sum 2^n\cdot\frac{1}{2^n(n\ln 2)^p} = \frac{1}{(\ln 2)^p}\sum\frac{1}{n^p}\), which converges only for \(p > 1\). Hence for \(p > 0\) we get convergence when \(p > 1\) and divergence when \(0 < p \le 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(p \le 0\)인 경우: \(n \ge 16\)이면 \(\ln\ln n \ge 1\)이므로 \((\ln\ln n)^p \le 1\)이고, 따라서 \(a_n \ge \frac{1}{n\ln n}\)입니다. \(\sum\frac{1}{n\ln n}\)은 발산하므로(한 번 응축하면 조화급수의 상수배), 비교 판정법으로 원래 급수도 발산합니다. 이상으로 수렴의 필요충분조건은 \(p > 1\)입니다.`,
          en: String.raw`For \(p \le 0\): if \(n \ge 16\) then \(\ln\ln n \ge 1\), so \((\ln\ln n)^p \le 1\) and \(a_n \ge \frac{1}{n\ln n}\). Since \(\sum\frac{1}{n\ln n}\) diverges (one condensation turns it into a constant multiple of the harmonic series), comparison gives divergence of the original series too. Thus convergence holds if and only if \(p > 1\).`,
        },
      },
    ],
  },
  {
    id: 'euler-product-shift',
    difficulty: 3,
    topics: ['euler-product', 'basel'],
    statement: {
      ko: String.raw`오일러 곱셈식을 이용해 무한곱 \(\prod_{p\ \text{소수}}\left(1+\frac{1}{p^2}\right)\)가 수렴하고 그 값이 \(\frac{15}{\pi^2}\)임을 증명하세요. (\(\zeta(2) = \frac{\pi^2}{6}\), \(\zeta(4) = \frac{\pi^4}{90}\)은 알려진 사실로 사용해도 됩니다.)`,
      en: String.raw`Using the Euler product, prove that the infinite product \(\prod_{p\ \text{prime}}\left(1+\frac{1}{p^2}\right)\) converges and equals \(\frac{15}{\pi^2}\). (You may use \(\zeta(2) = \frac{\pi^2}{6}\) and \(\zeta(4) = \frac{\pi^4}{90}\) as known.)`,
    },
    display: [String.raw`\prod_{p\le x}\left(1+\frac{1}{p^2}\right) = \frac{\prod_{p\le x}(1-p^{-2})^{-1}}{\prod_{p\le x}(1-p^{-4})^{-1}} \to \frac{\zeta(2)}{\zeta(4)} = \frac{15}{\pi^2}`],
    solution: [
      {
        text: {
          ko: String.raw`\(s > 1\)에서 오일러 곱셈식 \(\zeta(s) = \prod_{p}(1-p^{-s})^{-1}\)이 성립합니다 (유한 부분곱의 극한으로 이해). 핵심 항등식은 \(1+\frac{1}{p^2} = \frac{1-p^{-4}}{1-p^{-2}}\)입니다 — 분모가 \(0\)이 아니므로(\(p \ge 2\)) 나눗셈이 정당합니다.`,
          en: String.raw`For \(s > 1\) the Euler product \(\zeta(s) = \prod_{p}(1-p^{-s})^{-1}\) holds (understood as the limit of finite partial products). The key identity is \(1+\frac{1}{p^2} = \frac{1-p^{-4}}{1-p^{-2}}\) — division is legitimate since the denominator is nonzero (\(p \ge 2\)).`,
        },
      },
      {
        text: {
          ko: String.raw`유한한 소수 집합 \(\{p \le x\}\)에 대해 \(\prod_{p\le x}\left(1+\frac{1}{p^2}\right) = \frac{\prod_{p\le x}(1-p^{-4})}{\prod_{p\le x}(1-p^{-2})} = \frac{\prod_{p\le x}(1-p^{-2})^{-1}}{\prod_{p\le x}(1-p^{-4})^{-1}}\)입니다. 모든 인수가 양수이므로 재배열이 문제없습니다.`,
          en: String.raw`Over the finite set of primes \(\{p \le x\}\), \(\prod_{p\le x}\left(1+\frac{1}{p^2}\right) = \frac{\prod_{p\le x}(1-p^{-4})}{\prod_{p\le x}(1-p^{-2})} = \frac{\prod_{p\le x}(1-p^{-2})^{-1}}{\prod_{p\le x}(1-p^{-4})^{-1}}\). Every factor is positive, so no rearrangement issue arises.`,
        },
      },
      {
        text: {
          ko: String.raw`\(x \to \infty\)일 때 분자는 \(\zeta(2) = \frac{\pi^2}{6}\)로, 분모는 \(\zeta(4) = \frac{\pi^4}{90}\)으로 수렴합니다 (오일러 곱셈식). 따라서 무한곱은 수렴하고, 그 값은 \(\frac{\pi^2/6}{\pi^4/90} = \frac{90}{6\pi^2} = \frac{15}{\pi^2}\)입니다.`,
          en: String.raw`As \(x \to \infty\), the numerator tends to \(\zeta(2) = \frac{\pi^2}{6}\) and the denominator to \(\zeta(4) = \frac{\pi^4}{90}\) (Euler product). Hence the infinite product converges to \(\frac{\pi^2/6}{\pi^4/90} = \frac{90}{6\pi^2} = \frac{15}{\pi^2}\).`,
        },
      },
    ],
  },
];
