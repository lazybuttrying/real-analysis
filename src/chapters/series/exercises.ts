import type { ExerciseMeta } from '../../contracts.ts';

/**
 * Pure data: end-of-chapter exercises for the series chapter.
 * Imports only the type. Twelve original exercises, ordered easy -> hard
 * (4 x difficulty 1, 5 x difficulty 2, 3 x difficulty 3).
 * Every statement is self-contained; every solution is a complete proof.
 * No viz: no scene model in this chapter computes exactly the series used
 * in these exercises, so a reused picture would mislead rather than help.
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
    id: 'poly-radius',
    difficulty: 1,
    topics: ['power-series', 'tests'],
    statement: {
      ko: String.raw`멱급수 \(\sum_{n=0}^{\infty}\frac{n^2+1}{3^n}\,x^n\)의 수렴반경을 구하세요.`,
      en: String.raw`Find the radius of convergence of the power series \(\sum_{n=0}^{\infty}\frac{n^2+1}{3^n}\,x^n\).`,
    },
    display: [String.raw`\left|\frac{c_{n+1}x^{n+1}}{c_n x^n}\right| = \frac{(n+1)^2+1}{n^2+1}\cdot\frac{|x|}{3} \to \frac{|x|}{3}`],
    solution: [
      {
        text: {
          ko: String.raw`\(c_n = \frac{n^2+1}{3^n} > 0\)이라 두면 일반항의 절댓값의 비는 \(\left|\frac{c_{n+1}x^{n+1}}{c_n x^n}\right| = \frac{(n+1)^2+1}{n^2+1}\cdot\frac{|x|}{3}\)입니다.`,
          en: String.raw`With \(c_n = \frac{n^2+1}{3^n} > 0\), the ratio of successive absolute terms is \(\left|\frac{c_{n+1}x^{n+1}}{c_n x^n}\right| = \frac{(n+1)^2+1}{n^2+1}\cdot\frac{|x|}{3}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\frac{(n+1)^2+1}{n^2+1} = \frac{n^2+2n+2}{n^2+1} \to 1\)이므로, 이 비는 \(\frac{|x|}{3}\)로 수렴합니다.`,
          en: String.raw`Since \(\frac{(n+1)^2+1}{n^2+1} = \frac{n^2+2n+2}{n^2+1} \to 1\), the ratio tends to \(\frac{|x|}{3}\).`,
        },
      },
      {
        text: {
          ko: String.raw`비율 판정법에 따라 \(|x| < 3\)이면 급수는 (절대) 수렴하고, \(|x| > 3\)이면 일반항 \(\left|c_n x^n\right| = (n^2+1)\left(\frac{|x|}{3}\right)^n \to \infty\)이므로 발산합니다. 따라서 수렴반경은 \(R = 3\)입니다.`,
          en: String.raw`By the ratio test the series converges (absolutely) for \(|x| < 3\), and for \(|x| > 3\) the general term \(\left|c_n x^n\right| = (n^2+1)\left(\frac{|x|}{3}\right)^n \to \infty\), so it diverges. Hence the radius of convergence is \(R = 3\).`,
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
    id: 'abel-divergent',
    difficulty: 2,
    topics: ['abel-theorem', 'grandi'],
    statement: {
      ko: String.raw`급수 \(\sum_{n=1}^{\infty} n(-1)^n\)은 (보통 의미에서) 발산하지만 Abel 총합가능하며, 그 Abel 합이 \(-\frac{1}{4}\)임을 증명하세요.`,
      en: String.raw`Prove that \(\sum_{n=1}^{\infty} n(-1)^n\) diverges in the ordinary sense but is Abel summable, with Abel sum \(-\frac{1}{4}\).`,
    },
    display: [String.raw`\sum_{n\ge 1} n(-1)^n x^n = -\frac{x}{(1+x)^2} \xrightarrow[x\to 1^{-}]{} -\frac{1}{4}`],
    solution: [
      {
        text: {
          ko: String.raw`먼저 발산: 일반항 \(n(-1)^n\)은 \(0\)으로 수렴하지 않으므로(\(|n(-1)^n| = n \to \infty\)), 제\(n\)항 판정법으로 급수는 발산합니다.`,
          en: String.raw`Divergence first: the general term \(n(-1)^n\) does not tend to \(0\) (since \(|n(-1)^n| = n \to \infty\)), so the series diverges by the \(n\)-th term test.`,
        },
      },
      {
        text: {
          ko: String.raw`\(|z| < 1\)에서 \(\sum_{n=0}^{\infty} z^n = \frac{1}{1-z}\)를 항별 미분하면(멱급수는 수렴원 안에서 항별 미분 가능) \(\sum_{n=1}^{\infty} n z^{n-1} = \frac{1}{(1-z)^2}\)이고, \(z\)를 곱하면 \(\sum_{n=1}^{\infty} n z^n = \frac{z}{(1-z)^2}\)입니다.`,
          en: String.raw`For \(|z| < 1\), differentiating \(\sum_{n=0}^{\infty} z^n = \frac{1}{1-z}\) termwise (a power series may be differentiated termwise inside its disc) gives \(\sum_{n=1}^{\infty} n z^{n-1} = \frac{1}{(1-z)^2}\); multiplying by \(z\) yields \(\sum_{n=1}^{\infty} n z^n = \frac{z}{(1-z)^2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(z = -x\) (\(0 \le x < 1\))를 대입하면 \(n(-x)^n = n(-1)^n x^n\)이므로 \(\sum_{n=1}^{\infty} n(-1)^n x^n = \frac{-x}{(1+x)^2}\)입니다. \(x \to 1^{-}\)일 때 이는 \(-\frac{1}{4}\)로 수렴하므로, Abel 합은 \(-\frac{1}{4}\)입니다. 발산하는 급수도 Abel 총합가능할 수 있습니다.`,
          en: String.raw`Substituting \(z = -x\) (\(0 \le x < 1\)) gives \(n(-x)^n = n(-1)^n x^n\), so \(\sum_{n=1}^{\infty} n(-1)^n x^n = \frac{-x}{(1+x)^2}\). As \(x \to 1^{-}\) this tends to \(-\frac{1}{4}\), the Abel sum. A divergent series can still be Abel summable.`,
        },
      },
    ],
  },
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
    id: 'm-test-rational',
    difficulty: 2,
    topics: ['m-test', 'tests'],
    statement: {
      ko: String.raw`급수 \(\sum_{n=1}^{\infty}\frac{1}{n^2+x^2}\)가 실수 전체 \(\mathbb{R}\)에서 균등수렴함을 M-판정법으로 보이고, 그 합함수가 \(\mathbb{R}\)에서 연속임을 증명하세요.`,
      en: String.raw`Show that \(\sum_{n=1}^{\infty}\frac{1}{n^2+x^2}\) converges uniformly on all of \(\mathbb{R}\) by the M-test, and prove its sum is continuous on \(\mathbb{R}\).`,
    },
    display: [String.raw`\left|\frac{1}{n^2+x^2}\right| \le \frac{1}{n^2} =: M_n, \qquad \sum_{n=1}^{\infty} M_n < \infty`],
    solution: [
      {
        text: {
          ko: String.raw`모든 실수 \(x\)에 대해 \(n^2+x^2 \ge n^2\)이므로 \(\left|\frac{1}{n^2+x^2}\right| \le \frac{1}{n^2} =: M_n\)입니다. \(\sum M_n = \sum \frac{1}{n^2}\)은 수렴하므로(\(p\)-급수, \(p = 2\)), 바이어슈트라스 M-판정법으로 \(\sum_{n=1}^{\infty}\frac{1}{n^2+x^2}\)는 \(\mathbb{R}\)에서 균등수렴합니다.`,
          en: String.raw`For every real \(x\), \(n^2+x^2 \ge n^2\), so \(\left|\frac{1}{n^2+x^2}\right| \le \frac{1}{n^2} =: M_n\). Since \(\sum M_n = \sum \frac{1}{n^2}\) converges (a \(p\)-series with \(p = 2\)), the Weierstrass M-test gives uniform convergence of \(\sum_{n=1}^{\infty}\frac{1}{n^2+x^2}\) on \(\mathbb{R}\).`,
        },
      },
      {
        text: {
          ko: String.raw`각 항 \(f_n(x) = \frac{1}{n^2+x^2}\)은 \(\mathbb{R}\)에서 연속입니다 (분모가 \(0\)이 되지 않음). 연속함수들의 균등수렴 극한은 연속이므로, 합함수 \(S(x) = \sum_{n=1}^{\infty}\frac{1}{n^2+x^2}\)는 \(\mathbb{R}\) 전체에서 연속입니다.`,
          en: String.raw`Each term \(f_n(x) = \frac{1}{n^2+x^2}\) is continuous on \(\mathbb{R}\) (the denominator never vanishes). A uniform limit of continuous functions is continuous, so the sum \(S(x) = \sum_{n=1}^{\infty}\frac{1}{n^2+x^2}\) is continuous on all of \(\mathbb{R}\).`,
        },
      },
    ],
  },
  {
    id: 'conditional-expansion',
    difficulty: 2,
    topics: ['leibniz', 'absolute', 'tests'],
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
  {
    id: 'ppn-proof',
    difficulty: 2,
    topics: ['rearrangement', 'riemann-rearrangement', 'harmonic', 'euler-mascheroni'],
    statement: {
      ko: String.raw`교대조화급수를 "양항 두 개, 음항 한 개"씩 순서대로 재배열한 급수 \(1+\frac{1}{3}-\frac{1}{2}+\frac{1}{5}+\frac{1}{7}-\frac{1}{4}+\cdots\)가 \(\frac{3}{2}\ln 2\)로 수렴함을 엄밀히 증명하세요. (\(H_m = \ln m+\gamma+o(1)\)은 알려진 사실로 사용해도 됩니다.)`,
      en: String.raw`Prove rigorously that the rearrangement of the alternating harmonic series taking "two positive terms, then one negative term" in order, \(1+\frac{1}{3}-\frac{1}{2}+\frac{1}{5}+\frac{1}{7}-\frac{1}{4}+\cdots\), converges to \(\frac{3}{2}\ln 2\). (You may use \(H_m = \ln m+\gamma+o(1)\) as known.)`,
    },
    display: [String.raw`T_{3N} = H_{4N}-\tfrac12 H_{2N}-\tfrac12 H_N \to \tfrac32\ln 2`],
    solution: [
      {
        text: {
          ko: String.raw`이것은 진짜 재배열입니다: 홀수 역수 \(\frac{1}{2k-1}\)와 짝수 역수 \(\frac{1}{2k}\)가 각각 정확히 한 번씩, 순서대로 등장합니다. 처음 \(3N\)개 항의 부분합을 \(T_{3N}\)이라 하면, 사용된 양항은 처음 \(2N\)개의 홀수 역수, 음항은 처음 \(N\)개의 짝수 역수이므로 \(T_{3N} = \sum_{k=1}^{2N}\frac{1}{2k-1}-\sum_{k=1}^{N}\frac{1}{2k}\)입니다.`,
          en: String.raw`This is a genuine rearrangement: the odd reciprocals \(\frac{1}{2k-1}\) and the even reciprocals \(\frac{1}{2k}\) each appear exactly once, in order. Let \(T_{3N}\) be the sum of the first \(3N\) terms; the positive terms used are the first \(2N\) odd reciprocals and the negative terms the first \(N\) even reciprocals, so \(T_{3N} = \sum_{k=1}^{2N}\frac{1}{2k-1}-\sum_{k=1}^{N}\frac{1}{2k}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\sum_{k=1}^{2N}\frac{1}{2k-1} = H_{4N}-\sum_{k=1}^{2N}\frac{1}{2k} = H_{4N}-\frac{1}{2}H_{2N}\)이므로, \(T_{3N} = H_{4N}-\frac{1}{2}H_{2N}-\frac{1}{2}H_N\)입니다.`,
          en: String.raw`Since \(\sum_{k=1}^{2N}\frac{1}{2k-1} = H_{4N}-\sum_{k=1}^{2N}\frac{1}{2k} = H_{4N}-\frac{1}{2}H_{2N}\), we get \(T_{3N} = H_{4N}-\frac{1}{2}H_{2N}-\frac{1}{2}H_N\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(H_m = \ln m+\gamma+\varepsilon_m\) (\(\varepsilon_m \to 0\))를 대입하면 \(T_{3N} = \ln(4N)-\frac{1}{2}\ln(2N)-\frac{1}{2}\ln N+\gamma\left(1-\frac{1}{2}-\frac{1}{2}\right)+o(1)\)입니다. \(\gamma\) 항은 소거되고, 로그 항은 \(\ln 4-\frac{1}{2}\ln 2 = \frac{3}{2}\ln 2\)가 되므로 \(T_{3N} \to \frac{3}{2}\ln 2\)입니다.`,
          en: String.raw`Substituting \(H_m = \ln m+\gamma+\varepsilon_m\) (\(\varepsilon_m \to 0\)) gives \(T_{3N} = \ln(4N)-\frac{1}{2}\ln(2N)-\frac{1}{2}\ln N+\gamma\left(1-\frac{1}{2}-\frac{1}{2}\right)+o(1)\). The \(\gamma\) terms cancel and the logarithms give \(\ln 4-\frac{1}{2}\ln 2 = \frac{3}{2}\ln 2\), so \(T_{3N} \to \frac{3}{2}\ln 2\).`,
        },
      },
      {
        text: {
          ko: String.raw`중간 부분합도 따라갑니다: \(T_{3N+1} = T_{3N}+\frac{1}{4N+1}\), \(T_{3N+2} = T_{3N+1}+\frac{1}{4N+3}\)이고 추가 항들은 \(0\)으로 가므로, 전체 수열 \(T_m\)이 \(\frac{3}{2}\ln 2\)로 수렴합니다. 조건수렴 급수는 재배열에 따라 합이 달라질 수 있습니다.`,
          en: String.raw`The intermediate partial sums follow: \(T_{3N+1} = T_{3N}+\frac{1}{4N+1}\) and \(T_{3N+2} = T_{3N+1}+\frac{1}{4N+3}\), and the added terms tend to \(0\), so the whole sequence \(T_m\) converges to \(\frac{3}{2}\ln 2\). A conditionally convergent series can change its sum under rearrangement.`,
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
    topics: ['euler-product', 'basel', 'zeta4'],
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
  {
    id: 'dini-series',
    difficulty: 3,
    topics: ['dini', 'tests'],
    statement: {
      ko: String.raw`\(N \ge 1\)에 대해 \(s_N(x) = \sum_{n=1}^{N}(1-x)x^n\)이라 둡니다. (a) \(s_N\)이 \([0,a]\) (\(0 < a < 1\))에서 디니 정리로 균등수렴함을 보이세요. (b) \([0,1]\)에서는 균등수렴하지 않음을 증명하세요.`,
      en: String.raw`Let \(s_N(x) = \sum_{n=1}^{N}(1-x)x^n\) for \(N \ge 1\). (a) Show \(s_N\) converges uniformly on \([0,a]\) (\(0 < a < 1\)) via Dini's theorem. (b) Prove it does not converge uniformly on \([0,1]\).`,
    },
    display: [String.raw`s_N(x) = x(1-x^N) \uparrow x \quad (0 \le x < 1), \qquad s_N(1) = 0`],
    solution: [
      {
        text: {
          ko: String.raw`\(x \ne 1\)에서 \(\sum_{n=1}^{N}x^n = \frac{x(1-x^N)}{1-x}\)이므로 \(s_N(x) = x(1-x^N)\)입니다 (\(x = 1\)에서도 각 항이 \(0\)이므로 같은 식이 성립). 각 \(s_N\)은 다항식이므로 연속이고, \(s_{N+1}(x)-s_N(x) = (1-x)x^{N+1} \ge 0\) (\(0 \le x \le 1\))이므로 \(s_N\)은 단조증가합니다.`,
          en: String.raw`For \(x \ne 1\), \(\sum_{n=1}^{N}x^n = \frac{x(1-x^N)}{1-x}\), so \(s_N(x) = x(1-x^N)\) (the same formula holds at \(x = 1\), where every term is \(0\)). Each \(s_N\) is a polynomial, hence continuous, and \(s_{N+1}(x)-s_N(x) = (1-x)x^{N+1} \ge 0\) (\(0 \le x \le 1\)), so \(s_N\) is monotone increasing.`,
        },
      },
      {
        text: {
          ko: String.raw`(a) \(0 \le x \le a < 1\)에서 \(x^N \to 0\)이므로 \(s_N(x) \to x\)입니다. 극한함수 \(s(x) = x\)는 \([0,a]\)에서 연속이고, 연속함수들의 단조증가 수열이 연속 극한으로 각 점 수렴하므로, 디니 정리에 의해 수렴은 균등합니다.`,
          en: String.raw`(a) For \(0 \le x \le a < 1\), \(x^N \to 0\), so \(s_N(x) \to x\). The limit \(s(x) = x\) is continuous on \([0,a]\); a monotone increasing sequence of continuous functions converging pointwise to a continuous limit converges uniformly by Dini's theorem.`,
        },
      },
      {
        text: {
          ko: String.raw`(b) \([0,1]\)에서의 각 점별 극한은 \(s(x) = x\) (\(x < 1\)), \(s(1) = 0\)으로, \(x = 1\)에서 불연속입니다 (\(\lim_{x\to 1^{-}}s(x) = 1 \ne 0 = s(1)\)). 연속함수들의 균등수렴 극한은 연속이어야 하므로, \([0,1]\)에서의 수렴은 균등할 수 없습니다.`,
          en: String.raw`(b) The pointwise limit on \([0,1]\) is \(s(x) = x\) (\(x < 1\)), \(s(1) = 0\), which is discontinuous at \(x = 1\) (\(\lim_{x\to 1^{-}}s(x) = 1 \ne 0 = s(1)\)). A uniform limit of continuous functions must be continuous, so convergence on \([0,1]\) cannot be uniform.`,
        },
      },
    ],
  },
];
