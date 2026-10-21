import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the integral test scene
 * (Tao, Prop 11.6.4). Imports nothing except types.
 * Verified numbers (tests/integral-test.test.ts):
 *   p = 2, N = 12: leftSum = 1.5649766384209025,
 *     rightSum = 0.5708937981842162, integral = 12/13 = 0.9230769230769231,
 *     sandwich 0.9231 <= 1.5650 <= 1.9231 holds;
 *   p = 1, N = 12: leftSum = H_12 = 3.103210678210678,
 *     rightSum = 2.1801337551337556, integral = ln 13 = 2.5649493574615367;
 *   p = 2, N = 10: tail R_10 of sum 1/n^2 lies in [1/11, 1/10]
 *     (true value pi^2/6 - sum_{k=1}^{10} 1/k^2 = 0.0951663356816856).
 */
export const integralTestProblems: readonly ProblemMeta[] = [
  {
    id: 'integral-test-proof',
    statement: {
      ko: String.raw`적분 판정법을 완전히 증명하세요: \(f\)가 \([1,\infty)\)에서 양수이며 감소하면, 각 \([n,n+1]\)에서 \(f(n+1) \le \int_n^{n+1} f \le f(n)\)이고, 합하면 \(\int_1^{N+1} f \le \sum_{n=1}^{N} f(n) \le f(1) + \int_1^{N+1} f\)를 얻으며, 따라서 \(\sum f(n)\)의 수렴과 \(\int_1^{\infty} f\)의 수렴은 동치입니다.`,
      en: String.raw`Prove the integral test completely: if \(f\) is positive and decreasing on \([1,\infty)\), then on each \([n,n+1]\) we have \(f(n+1) \le \int_n^{n+1} f \le f(n)\); summing gives \(\int_1^{N+1} f \le \sum_{n=1}^{N} f(n) \le f(1) + \int_1^{N+1} f\), so \(\sum f(n)\) converges iff \(\int_1^{\infty} f\) converges.`,
    },
    display: [
      String.raw`f(n+1) \le \int_n^{n+1} f \le f(n) \qquad (f \text{ decreasing})`,
      String.raw`\int_1^{N+1} f \le \sum_{n=1}^{N} f(n) \le f(1) + \int_1^{N+1} f`,
    ],
    preset: { p: 2, N: 12 },
    presetCaption: {
      ko: String.raw`\(p = 2, N = 12\): \(\int_1^{13} x^{-2}\,dx = 12/13 \approx 0.9231 \le \sum_{k=1}^{12} k^{-2} \approx 1.5650 \le 1 + 0.9231\) — 샌드위치가 수치로 확인됩니다.`,
      en: String.raw`\(p = 2, N = 12\): \(\int_1^{13} x^{-2}\,dx = 12/13 \approx 0.9231 \le \sum_{k=1}^{12} k^{-2} \approx 1.5650 \le 1 + 0.9231\) — the sandwich, numerically.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f\)가 감소하므로 \(x \in [n, n+1]\)에서 \(f(n+1) \le f(x) \le f(n)\)입니다. 구간 길이가 \(1\)인 \([n,n+1]\)에서 적분하면 \(f(n+1) \le \int_n^{n+1} f \le f(n)\)을 얻습니다 (단조성에 의한 적분의 단조성).`,
          en: String.raw`Since \(f\) is decreasing, \(f(n+1) \le f(x) \le f(n)\) for \(x \in [n, n+1]\). Integrating over \([n,n+1]\) (length \(1\)) gives \(f(n+1) \le \int_n^{n+1} f \le f(n)\) by monotonicity of the integral.`,
        },
      },
      {
        text: {
          ko: String.raw`\(n = 1, \ldots, N\)에 대해 합합니다. 왼쪽 부등식들의 합: \(\sum_{n=1}^{N} f(n+1) = \sum_{k=2}^{N+1} f(k) \le \int_1^{N+1} f\). 오른쪽 부등식들의 합: \(\int_1^{N+1} f \le \sum_{n=1}^{N} f(n)\). 둘을 이으면 \(\sum_{k=2}^{N+1} f(k) \le \int_1^{N+1} f \le \sum_{n=1}^{N} f(n)\)이고, \(\sum_{k=2}^{N+1} f(k) = \sum_{n=1}^{N} f(n) - f(1)\)이므로 \(\int_1^{N+1} f \le \sum_{n=1}^{N} f(n) \le f(1) + \int_1^{N+1} f\)입니다.`,
          en: String.raw`Sum over \(n = 1, \ldots, N\). The left inequalities sum to \(\sum_{n=1}^{N} f(n+1) = \sum_{k=2}^{N+1} f(k) \le \int_1^{N+1} f\); the right ones to \(\int_1^{N+1} f \le \sum_{n=1}^{N} f(n)\). Chaining gives \(\sum_{k=2}^{N+1} f(k) \le \int_1^{N+1} f \le \sum_{n=1}^{N} f(n)\), and since \(\sum_{k=2}^{N+1} f(k) = \sum_{n=1}^{N} f(n) - f(1)\), we get \(\int_1^{N+1} f \le \sum_{n=1}^{N} f(n) \le f(1) + \int_1^{N+1} f\).`,
        },
      },
      {
        text: {
          ko: String.raw`\((\Leftarrow)\) \(\int_1^{\infty} f\)가 수렴하면 (즉 \(\int_1^{R} f\)가 \(R \to \infty\)에서 유한 극한을 가지면), 부분합 \(\sum_{n=1}^{N} f(n)\)은 \(f(1) + \int_1^{\infty} f\)로 위가 유계이고 항이 \(0\) 이상이므로 단조수렴정리에 의해 수렴합니다.`,
          en: String.raw`\((\Leftarrow)\) If \(\int_1^{\infty} f\) converges (i.e. \(\int_1^{R} f\) has a finite limit as \(R \to \infty\)), then the partial sums \(\sum_{n=1}^{N} f(n)\) are bounded above by \(f(1) + \int_1^{\infty} f\) and, the terms being nonnegative, converge by the monotone convergence theorem.`,
        },
      },
      {
        text: {
          ko: String.raw`\((\Rightarrow)\) 대우로 보입니다: \(\int_1^{\infty} f\)가 발산하면 (양수 피적분함수이므로 \(+\infty\)로), \(\sum_{n=1}^{N} f(n) \ge \int_1^{N+1} f \to \infty\)이므로 급수도 발산합니다. 따라서 \(\sum f(n)\) 수렴 \(\iff\) \(\int_1^{\infty} f\) 수렴입니다. 증명 끝.`,
          en: String.raw`\((\Rightarrow)\) By contraposition: if \(\int_1^{\infty} f\) diverges (to \(+\infty\), the integrand being positive), then \(\sum_{n=1}^{N} f(n) \ge \int_1^{N+1} f \to \infty\), so the series diverges too. Hence \(\sum f(n)\) converges \(\iff\) \(\int_1^{\infty} f\) converges. QED.`,
        },
      },
    ],
  },
  {
    id: 'p-series',
    statement: {
      ko: String.raw`\(p\)-급수 \(\sum_{n=1}^{\infty} n^{-p}\)가 \(p > 1\)일 때 수렴하고 \(p \le 1\)일 때 발산함을 완전히 증명하세요: \(\int_1^{R} x^{-p}\,dx\)를 직접 계산하고 (\(p = 1\)은 \(\ln R\)), 적분 판정법을 적용하세요.`,
      en: String.raw`Prove the \(p\)-series \(\sum_{n=1}^{\infty} n^{-p}\) converges for \(p > 1\) and diverges for \(p \le 1\), completely: compute \(\int_1^{R} x^{-p}\,dx\) directly (\(p = 1\) gives \(\ln R\)) and apply the integral test.`,
    },
    display: [
      String.raw`\int_1^{R} x^{-p}\,dx = \begin{cases} \ln R & p = 1 \\ \dfrac{R^{1-p} - 1}{1-p} & p \ne 1 \end{cases}`,
      String.raw`\sum_{n=1}^{\infty} n^{-p} \text{ converges } \iff p > 1`,
    ],
    preset: { p: 1, N: 12 },
    presetCaption: {
      ko: String.raw`\(p = 1, N = 12\): 조화급수 부분합 \(H_{12} \approx 3.1032\)는 \(\ln\)처럼 계속 자라고, \(\int_1^{13} \frac{dx}{x} = \ln 13 \approx 2.5649\) — 둘 다 발산합니다.`,
      en: String.raw`\(p = 1, N = 12\): the harmonic partial sum \(H_{12} \approx 3.1032\) keeps growing like \(\ln\), and \(\int_1^{13} \frac{dx}{x} = \ln 13 \approx 2.5649\) — both diverge.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(f(x) = x^{-p}\)는 \([1,\infty)\)에서 양수이며 감소하므로 적분 판정법의 가설을 만족합니다. 부정적분을 계산합니다: \(p = 1\)이면 \(\int_1^{R} x^{-1}\,dx = \ln R\); \(p \ne 1\)이면 \(\int_1^{R} x^{-p}\,dx = \left[\frac{x^{1-p}}{1-p}\right]_1^{R} = \frac{R^{1-p} - 1}{1-p}\)입니다.`,
          en: String.raw`\(f(x) = x^{-p}\) is positive and decreasing on \([1,\infty)\), so the integral test applies. Compute: for \(p = 1\), \(\int_1^{R} x^{-1}\,dx = \ln R\); for \(p \ne 1\), \(\int_1^{R} x^{-p}\,dx = \left[\frac{x^{1-p}}{1-p}\right]_1^{R} = \frac{R^{1-p} - 1}{1-p}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(p > 1\): \(1 - p < 0\)이므로 \(R^{1-p} \to 0\) (\(R \to \infty\)). 따라서 \(\int_1^{\infty} x^{-p}\,dx = \frac{1}{p-1} < \infty\) — 적분이 수렴하므로 적분 판정법에 의해 \(\sum n^{-p}\)도 수렴합니다.`,
          en: String.raw`\(p > 1\): \(1 - p < 0\), so \(R^{1-p} \to 0\) as \(R \to \infty\). Hence \(\int_1^{\infty} x^{-p}\,dx = \frac{1}{p-1} < \infty\) — the integral converges, so by the integral test \(\sum n^{-p}\) converges.`,
        },
      },
      {
        text: {
          ko: String.raw`\(p = 1\): \(\ln R \to \infty\)이므로 적분이 발산하고, 따라서 조화급수 \(\sum 1/n\)도 발산합니다. \(p < 1\): \(1 - p > 0\)이므로 \(\frac{R^{1-p}-1}{1-p} \to \infty\) — 적분이 발산하고 급수도 발산합니다.`,
          en: String.raw`\(p = 1\): \(\ln R \to \infty\), so the integral diverges, and hence the harmonic series \(\sum 1/n\) diverges. \(p < 1\): \(1 - p > 0\), so \(\frac{R^{1-p}-1}{1-p} \to \infty\) — the integral diverges and so does the series.`,
        },
      },
      {
        text: {
          ko: String.raw`정리하면 \(\sum n^{-p}\) 수렴 \(\iff\) \(\int_1^{\infty} x^{-p}\,dx < \infty\) \(\iff\) \(p > 1\)입니다. 증명 끝.`,
          en: String.raw`In summary: \(\sum n^{-p}\) converges \(\iff\) \(\int_1^{\infty} x^{-p}\,dx < \infty\) \(\iff\) \(p > 1\). QED.`,
        },
      },
    ],
  },
  {
    id: 'integral-test-estimate',
    statement: {
      ko: String.raw`나머지 추정을 완전히 증명하세요: \(f\)가 양수이며 감소하고 \(\sum f(n)\)이 수렴하면 꼬리 \(R_N = \sum_{n>N} f(n)\)는 \(\int_{N+1}^{\infty} f \le R_N \le \int_{N}^{\infty} f\)를 만족합니다. 수치 적용: \(\sum 1/n^2\)의 \(N = 10\) 꼬리를 \(1/11 \approx 0.0909\)와 \(1/10 = 0.1\) 사이에 가두세요.`,
      en: String.raw`Prove the remainder estimate completely: if \(f\) is positive, decreasing, and \(\sum f(n)\) converges, the tail \(R_N = \sum_{n>N} f(n)\) satisfies \(\int_{N+1}^{\infty} f \le R_N \le \int_{N}^{\infty} f\). Numerically: trap the \(N = 10\) tail of \(\sum 1/n^2\) between \(1/11 \approx 0.0909\) and \(1/10 = 0.1\).`,
    },
    display: [
      String.raw`\int_{N+1}^{\infty} f \le R_N = \sum_{n>N} f(n) \le \int_{N}^{\infty} f`,
      String.raw`\frac{1}{11} \approx 0.0909 \le R_{10}\!\left(\sum \tfrac{1}{n^2}\right) \le 0.1 = \frac{1}{10}`,
    ],
    preset: { p: 2, N: 10 },
    presetCaption: {
      ko: String.raw`\(p = 2, N = 10\): 꼬리 \(R_{10}\)는 \(\int_{11}^{\infty} x^{-2}\,dx = 1/11 \approx 0.0909\)와 \(\int_{10}^{\infty} x^{-2}\,dx = 1/10 = 0.1\) 사이에 있습니다 (실제 값 \(\approx 0.09517\)).`,
      en: String.raw`\(p = 2, N = 10\): the tail \(R_{10}\) lies between \(\int_{11}^{\infty} x^{-2}\,dx = 1/11 \approx 0.0909\) and \(\int_{10}^{\infty} x^{-2}\,dx = 1/10 = 0.1\) (true value \(\approx 0.09517\)).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`기본 부등식 \(f(n+1) \le \int_n^{n+1} f \le f(n)\) (첫 번째 문제)을 \(n = N+1, \ldots, M\)에 대해 합합니다. 왼쪽: \(\sum_{n=N+1}^{M} f(n+1) = \sum_{k=N+2}^{M+1} f(k) \le \int_{N+1}^{M+1} f\). 오른쪽: \(\int_{N+1}^{M+1} f \le \sum_{n=N+1}^{M} f(n)\).`,
          en: String.raw`Sum the basic inequality \(f(n+1) \le \int_n^{n+1} f \le f(n)\) (first problem) over \(n = N+1, \ldots, M\). Left: \(\sum_{n=N+1}^{M} f(n+1) = \sum_{k=N+2}^{M+1} f(k) \le \int_{N+1}^{M+1} f\). Right: \(\int_{N+1}^{M+1} f \le \sum_{n=N+1}^{M} f(n)\).`,
        },
      },
      {
        text: {
          ko: String.raw`오른쪽 부등식을 한 칸 이동한 버전: \([n-1,n]\)에서의 기본 부등식은 \(f(n) \le \int_{n-1}^{n} f\)이므로, \(n = N+1,\ldots,M\) 합하면 \(\sum_{n=N+1}^{M} f(n) \le \int_{N}^{M} f\)를 얻습니다.`,
          en: String.raw`A shifted version of the right inequality: the basic inequality on \([n-1,n]\) reads \(f(n) \le \int_{n-1}^{n} f\), so summing over \(n = N+1,\ldots,M\) gives \(\sum_{n=N+1}^{M} f(n) \le \int_{N}^{M} f\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(M \to \infty\)로 보냅니다. 급수가 수렴하므로 \(\sum_{n=N+1}^{M} f(n) \to R_N\) (유한)이고, 적분 판정법에 의해 이상적분도 수렴하므로 \(\int_{N+1}^{M+1} f \to \int_{N+1}^{\infty} f\), \(\int_{N}^{M} f \to \int_{N}^{\infty} f\)입니다. 부등식을 유지한 채 극한을 취하면 \(\int_{N+1}^{\infty} f \le R_N \le \int_{N}^{\infty} f\)를 얻습니다. 증명 끝.`,
          en: String.raw`Let \(M \to \infty\). Since the series converges, \(\sum_{n=N+1}^{M} f(n) \to R_N\) (finite), and by the integral test the improper integrals converge too, so \(\int_{N+1}^{M+1} f \to \int_{N+1}^{\infty} f\) and \(\int_{N}^{M} f \to \int_{N}^{\infty} f\). Passing to the limit preserves the inequalities: \(\int_{N+1}^{\infty} f \le R_N \le \int_{N}^{\infty} f\). QED.`,
        },
      },
      {
        text: {
          ko: String.raw`수치 적용: \(f(x) = x^{-2}\), \(N = 10\). \(\int_{11}^{\infty} x^{-2}\,dx = \left[-x^{-1}\right]_{11}^{\infty} = \frac{1}{11} \approx 0.0909\), \(\int_{10}^{\infty} x^{-2}\,dx = \frac{1}{10} = 0.1\)이므로 \(\frac{1}{11} \le R_{10} \le \frac{1}{10}\)입니다. 실제로 \(R_{10} = \frac{\pi^2}{6} - \sum_{k=1}^{10}\frac{1}{k^2} \approx 0.09517\)로 구간 안에 들어갑니다.`,
          en: String.raw`Numerical application: \(f(x) = x^{-2}\), \(N = 10\). \(\int_{11}^{\infty} x^{-2}\,dx = \left[-x^{-1}\right]_{11}^{\infty} = \frac{1}{11} \approx 0.0909\) and \(\int_{10}^{\infty} x^{-2}\,dx = \frac{1}{10} = 0.1\), so \(\frac{1}{11} \le R_{10} \le \frac{1}{10}\). Indeed \(R_{10} = \frac{\pi^2}{6} - \sum_{k=1}^{10}\frac{1}{k^2} \approx 0.09517\) lands inside the interval.`,
        },
      },
    ],
  },
];
