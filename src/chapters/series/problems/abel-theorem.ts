import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Abel's theorem scene.
 * Imports nothing except types. Every number below was verified:
 * abelSumGrandi(0.9) = 1/1.9 ~= 0.5263; grandi closed form (1-(-x)^{N+1})/(1+x)
 * matches direct summation to ~1e-16; alt-harmonic partial sum at N=100000
 * is 0.69315218 vs ln 2 = 0.69314718 (diff 5.0e-6); S_20(0.9) ~= 0.5839 with
 * exact tail |(-0.9)^{21}|/1.9 ~= 0.0576; presets: alt-harmonic x=0.9 N=40 ->
 * 0.642006 vs ln(1.9)=0.641854; grandi x=0.99 N=100 -> 0.684609 vs
 * 1/1.99=0.502513; alt-harmonic x=0.99 N=100 -> 0.689911 vs ln(1.99)=0.688135.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'abel-theorem-by-parts',
    statement: {
      ko: String.raw`부분합 \(S_n = a_0 + \cdots + a_n\)이 \(S\)로 수렴하면 \(\lim_{x \to 1^{-}} \sum_{n=0}^{\infty} a_n x^n = S\)임을 부분합산(summation by parts)으로 증명하세요.`,
      en: String.raw`Prove by summation by parts that if the partial sums \(S_n = a_0 + \cdots + a_n\) converge to \(S\), then \(\lim_{x \to 1^{-}} \sum_{n=0}^{\infty} a_n x^n = S\).`,
    },
    display: [
      String.raw`\sum_{n=0}^{N} a_n x^n = S_N x^{N+1} + (1-x)\sum_{n=0}^{N} S_n x^n`,
      String.raw`\sum_{n=0}^{\infty} a_n x^n - S = (1-x)\sum_{n=0}^{\infty}(S_n - S)x^n`,
    ],
    preset: { series: 'alt-harmonic', x: 0.9, n: 40 },
    presetCaption: {
      ko: String.raw`수렴급수 예시 \(x=0.9\): \(S_{40}(0.9) \approx 0.6420\), 닫힌식 \(\ln(1.9) \approx 0.6419\) — Abel 합은 보통 합 \(\ln 2\)와 같은 방향을 가리킵니다.`,
      en: String.raw`Convergent example at \(x=0.9\): \(S_{40}(0.9) \approx 0.6420\), closed form \(\ln(1.9) \approx 0.6419\) — the Abel sum points the same way as the ordinary sum \(\ln 2\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(S_{-1} := 0\)이라 두면 \(a_n = S_n - S_{n-1}\)입니다. \(\sum_{n=0}^{N} (S_n - S_{n-1})x^n = \sum_{n=0}^{N} S_n x^n - x\sum_{n=0}^{N-1} S_n x^n\)이므로, 정리하면 \(\sum_{n=0}^{N} a_n x^n = S_N x^{N+1} + (1-x)\sum_{n=0}^{N} S_n x^n\) — Abel 변환(부분합산) 공식입니다.`,
          en: String.raw`With \(S_{-1} := 0\) we have \(a_n = S_n - S_{n-1}\). Since \(\sum_{n=0}^{N} (S_n - S_{n-1})x^n = \sum_{n=0}^{N} S_n x^n - x\sum_{n=0}^{N-1} S_n x^n\), rearranging gives \(\sum_{n=0}^{N} a_n x^n = S_N x^{N+1} + (1-x)\sum_{n=0}^{N} S_n x^n\) — Abel's transformation (summation by parts).`,
        },
      },
      {
        text: {
          ko: String.raw`고정된 \(|x| < 1\)에 대해 \(N \to \infty\)으로 보내면 경계항 \(S_N x^{N+1} \to 0\)입니다 (\(S_N\)은 수렴하므로 유계, \(x^{N+1} \to 0\)). 따라서 \(\sum_{n=0}^{\infty} a_n x^n = (1-x)\sum_{n=0}^{\infty} S_n x^n\) — 우변은 \(S_n\)이 유계이므로 절대수렴합니다.`,
          en: String.raw`For fixed \(|x| < 1\), letting \(N \to \infty\) kills the boundary term \(S_N x^{N+1} \to 0\) (\(S_N\) is convergent hence bounded, \(x^{N+1} \to 0\)). Thus \(\sum_{n=0}^{\infty} a_n x^n = (1-x)\sum_{n=0}^{\infty} S_n x^n\) — the right side converges absolutely since \(S_n\) is bounded.`,
        },
      },
      {
        text: {
          ko: String.raw`\((1-x)\sum_{n=0}^{\infty} x^n = 1\)이므로 \(\sum a_n x^n - S = (1-x)\sum_{n=0}^{\infty}(S_n - S)x^n\)입니다. \(\varepsilon > 0\)에 대해 \(n > N_0\)이면 \(|S_n - S| < \varepsilon/2\)인 \(N_0\)을 잡고 합을 \(n \le N_0\)과 \(n > N_0\)으로 나눕니다.`,
          en: String.raw`Since \((1-x)\sum_{n=0}^{\infty} x^n = 1\), we get \(\sum a_n x^n - S = (1-x)\sum_{n=0}^{\infty}(S_n - S)x^n\). Given \(\varepsilon > 0\), pick \(N_0\) with \(|S_n - S| < \varepsilon/2\) for all \(n > N_0\), and split the sum at \(N_0\).`,
        },
      },
      {
        text: {
          ko: String.raw`꼬리: \(\left|(1-x)\sum_{n>N_0}(S_n - S)x^n\right| \le (1-x)\frac{\varepsilon}{2}\sum_{n>N_0}x^n = \frac{\varepsilon}{2}x^{N_0+1} \le \frac{\varepsilon}{2}\) (\(0 \le x < 1\)).`,
          en: String.raw`Tail: \(\left|(1-x)\sum_{n>N_0}(S_n - S)x^n\right| \le (1-x)\frac{\varepsilon}{2}\sum_{n>N_0}x^n = \frac{\varepsilon}{2}x^{N_0+1} \le \frac{\varepsilon}{2}\) (for \(0 \le x < 1\)).`,
        },
      },
      {
        text: {
          ko: String.raw`앞부분: \(\left|(1-x)\sum_{n=0}^{N_0}(S_n - S)x^n\right| \le (1-x)\sum_{n=0}^{N_0}|S_n - S| = (1-x)M\) (\(x^n \le 1\)). \(M\)은 고정된 상수이므로 \(x \to 1^{-}\)에서 \(0\)으로 갑니다. \(x\)가 \(1\)에 충분히 가까우면 합이 \(\varepsilon\)보다 작아집니다. 따라서 \(\lim_{x \to 1^{-}} \sum a_n x^n = S\). ∎`,
          en: String.raw`Head: \(\left|(1-x)\sum_{n=0}^{N_0}(S_n - S)x^n\right| \le (1-x)\sum_{n=0}^{N_0}|S_n - S| = (1-x)M\) (using \(x^n \le 1\)). \(M\) is a fixed constant, so this tends to \(0\) as \(x \to 1^{-}\). For \(x\) close enough to \(1\) the total is below \(\varepsilon\). Hence \(\lim_{x \to 1^{-}} \sum a_n x^n = S\). ∎`,
        },
      },
    ],
  },
  {
    id: 'grandi-abel-sum',
    statement: {
      ko: String.raw`그란디 급수 \(\sum_{n=0}^{\infty} (-1)^n\)의 Abel 합이 \(\frac{1}{2}\)임을 증명하세요. 급수 자체는 발산한다는 점을 분명히 하세요.`,
      en: String.raw`Prove the Abel sum of Grandi's series \(\sum_{n=0}^{\infty} (-1)^n\) is \(\frac{1}{2}\). Be explicit that the series itself diverges.`,
    },
    display: [
      String.raw`\sum_{n=0}^{N}(-x)^n = \frac{1-(-x)^{N+1}}{1+x} \xrightarrow[N\to\infty]{} \frac{1}{1+x} \quad (|x|<1)`,
      String.raw`\lim_{x\to 1^{-}}\frac{1}{1+x} = \frac{1}{2}`,
    ],
    preset: { series: 'grandi', x: 0.99, n: 100 },
    presetCaption: {
      ko: String.raw`\(x=0.99\), \(N=100\): \(S_{100}(0.99) \approx 0.6846\), 닫힌식 \(1/1.99 \approx 0.5025\) — \(N\)을 늘리고 \(x \to 1^{-}\)로 보내면 \(1/2\)로 다가갑니다.`,
      en: String.raw`\(x=0.99\), \(N=100\): \(S_{100}(0.99) \approx 0.6846\), closed form \(1/1.99 \approx 0.5025\) — raising \(N\) and sending \(x \to 1^{-}\) drives it to \(1/2\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 정직하게: \(\sum_{n=0}^{\infty} (-1)^n\)은 발산합니다. 부분합 \(S_k = 1\) (\(k\) 짝수), \(0\) (\(k\) 홀수)이 영원히 오가며 극한이 없습니다 (그란디 장면). 지금 구하는 것은 급수의 "합"이 아니라 Abel 합입니다.`,
          en: String.raw`First, honestly: \(\sum_{n=0}^{\infty} (-1)^n\) diverges. The partial sums \(S_k = 1\) (\(k\) even), \(0\) (\(k\) odd) bounce forever with no limit (see the Grandi scene). What we compute now is not "the sum" of the series, but its Abel sum.`,
        },
      },
      {
        text: {
          ko: String.raw`\(|x| < 1\)에서 기하급수 공식으로 \(\sum_{n=0}^{N} (-x)^n = \frac{1-(-x)^{N+1}}{1+x}\)입니다. 예: \(x = 0.9\), \(N = 20\)이면 \(S_{20}(0.9) = \frac{1-(-0.9)^{21}}{1.9} \approx 0.5839\), 오차는 정확히 \(\frac{|(-0.9)^{21}|}{1.9} \approx 0.0576\)입니다.`,
          en: String.raw`For \(|x| < 1\) the geometric formula gives \(\sum_{n=0}^{N} (-x)^n = \frac{1-(-x)^{N+1}}{1+x}\). E.g. at \(x = 0.9\), \(N = 20\): \(S_{20}(0.9) = \frac{1-(-0.9)^{21}}{1.9} \approx 0.5839\), with exact error \(\frac{|(-0.9)^{21}|}{1.9} \approx 0.0576\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(|x| < 1\)이면 \((-x)^{N+1} \to 0\)이므로 \(N \to \infty\)에서 \(\sum_{n=0}^{\infty} (-1)^n x^n = \frac{1}{1+x}\)입니다. \(x = 0.9\)에서는 \(1/1.9 \approx 0.5263\) — 이 값이 위 \(S_{20}\)의 진짜 타깃입니다.`,
          en: String.raw`For \(|x| < 1\), \((-x)^{N+1} \to 0\), so letting \(N \to \infty\) gives \(\sum_{n=0}^{\infty} (-1)^n x^n = \frac{1}{1+x}\). At \(x = 0.9\) this is \(1/1.9 \approx 0.5263\) — the true target of the \(S_{20}\) above.`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(x \to 1^{-}\): \(\frac{1}{1+x} \to \frac{1}{2}\). 따라서 Abel 합 \(\lim_{x \to 1^{-}} \sum_{n=0}^{\infty} (-1)^n x^n = \frac{1}{2}\)입니다. 체사로 합 \(\frac{1}{2}\)와 같은 값이지만, 어느 쪽도 발산급수의 "합"은 아닙니다. ∎`,
          en: String.raw`Now let \(x \to 1^{-}\): \(\frac{1}{1+x} \to \frac{1}{2}\). Hence the Abel sum \(\lim_{x \to 1^{-}} \sum_{n=0}^{\infty} (-1)^n x^n = \frac{1}{2}\). It coincides with the Cesàro sum \(\frac{1}{2}\), but neither is "the sum" of a divergent series. ∎`,
        },
      },
    ],
  },
  {
    id: 'alt-harmonic-ln2',
    statement: {
      ko: String.raw`Abel 정리를 교대조화급수 \(\sum_{n=0}^{\infty} \frac{(-1)^n}{n+1} = \ln 2\)에 적용하여 \(\lim_{x \to 1^{-}} \sum_{n=0}^{\infty} \frac{(-1)^n x^{n+1}}{n+1} = \ln 2\)를 증명하세요.`,
      en: String.raw`Apply Abel's theorem to the alternating harmonic series \(\sum_{n=0}^{\infty} \frac{(-1)^n}{n+1} = \ln 2\) to prove \(\lim_{x \to 1^{-}} \sum_{n=0}^{\infty} \frac{(-1)^n x^{n+1}}{n+1} = \ln 2\).`,
    },
    display: [
      String.raw`\sum_{n=0}^{N}\frac{(-1)^n x^{n+1}}{n+1} = \ln(1+x) - R_N(x), \qquad |R_N(x)| \le \frac{x^{N+2}}{N+2}`,
      String.raw`\lim_{x\to 1^{-}}\ln(1+x) = \ln 2 \approx 0.6931`,
    ],
    preset: { series: 'alt-harmonic', x: 0.99, n: 100 },
    presetCaption: {
      ko: String.raw`\(x=0.99\), \(N=100\): \(S_{100}(0.99) \approx 0.6899\), 닫힌식 \(\ln(1.99) \approx 0.6881\) — \(x \to 1^{-}\)에서 \(\ln 2 \approx 0.6931\)로.`,
      en: String.raw`\(x=0.99\), \(N=100\): \(S_{100}(0.99) \approx 0.6899\), closed form \(\ln(1.99) \approx 0.6881\) — tending to \(\ln 2 \approx 0.6931\) as \(x \to 1^{-}\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(a_n = \frac{(-1)^n}{n+1}\)이라 두면 \(\sum_{n=0}^{\infty} a_n\)은 라이프니츠 판정법(교대, \(\frac{1}{n+1} \searrow 0\))으로 수렴하고, 그 값은 \(\ln 2 \approx 0.6931\)입니다 (수치 확인: \(N = 100000\)에서 부분합 \(\approx 0.69315218\), 오차 \(\approx 5.0 \times 10^{-6}\)).`,
          en: String.raw`Set \(a_n = \frac{(-1)^n}{n+1}\). Then \(\sum_{n=0}^{\infty} a_n\) converges by the Leibniz test (alternating, \(\frac{1}{n+1} \searrow 0\)), and its value is \(\ln 2 \approx 0.6931\) (numerical check: at \(N = 100000\) the partial sum is \(\approx 0.69315218\), error \(\approx 5.0 \times 10^{-6}\)).`,
        },
      },
      {
        text: {
          ko: String.raw`Abel 정리(문제 1)를 적용하면 \(\lim_{x \to 1^{-}} \sum_{n=0}^{\infty} a_n x^n = \ln 2\)입니다. 그런데 \(\sum_{n=0}^{\infty} \frac{(-1)^n x^{n+1}}{n+1} = x \cdot \sum_{n=0}^{\infty} a_n x^n\)이고 \(x \to 1\)이므로, 구하는 극한은 \(1 \cdot \ln 2 = \ln 2\)입니다.`,
          en: String.raw`Abel's theorem (Problem 1) gives \(\lim_{x \to 1^{-}} \sum_{n=0}^{\infty} a_n x^n = \ln 2\). But \(\sum_{n=0}^{\infty} \frac{(-1)^n x^{n+1}}{n+1} = x \cdot \sum_{n=0}^{\infty} a_n x^n\), and \(x \to 1\), so the desired limit is \(1 \cdot \ln 2 = \ln 2\).`,
        },
      },
      {
        text: {
          ko: String.raw`직접 확인도 됩니다: \(0 \le x < 1\)로 제한합니다. 이 범위에서는 적분 구간 \([0, x]\) 위의 \(t\)가 \(0 \le t \le x < 1\)을 만족하고 \(1 + t \ge 1\)입니다. \(|t| < 1\)에서 \(\sum_{n=0}^{N} (-t)^n = \frac{1-(-t)^{N+1}}{1+t}\)를 \(0\)부터 \(x\)까지 적분하면 \(\sum_{n=0}^{N} \frac{(-1)^n x^{n+1}}{n+1} = \ln(1+x) - R_N(x)\)이며 \(|R_N(x)| \le \int_0^x \frac{t^{N+1}}{1+t}\,dt \le \int_0^x t^{N+1}\,dt = \frac{x^{N+2}}{N+2} \to 0\) (\(N \to \infty\))입니다(\(1 + t \ge 1\) 사용). 따라서 \(0 \le x < 1\)에서 멱급수의 합은 정확히 \(\ln(1+x)\)입니다. \(x = 1\)인 경우는 이 적분 단계가 아니라 Abel 정리의 연속성으로 따릅니다.`,
          en: String.raw`A direct check agrees: restrict to \(0 \le x < 1\). Then \(t\) on the integration interval \([0, x]\) satisfies \(0 \le t \le x < 1\) and \(1 + t \ge 1\). Integrating \(\sum_{n=0}^{N} (-t)^n = \frac{1-(-t)^{N+1}}{1+t}\) (for \(|t| < 1\)) from \(0\) to \(x\) gives \(\sum_{n=0}^{N} \frac{(-1)^n x^{n+1}}{n+1} = \ln(1+x) - R_N(x)\) with \(|R_N(x)| \le \int_0^x \frac{t^{N+1}}{1+t}\,dt \le \int_0^x t^{N+1}\,dt = \frac{x^{N+2}}{N+2} \to 0\) (\(N \to \infty\)), using \(1 + t \ge 1\). So for \(0 \le x < 1\) the power series sums to exactly \(\ln(1+x)\). The case \(x = 1\) then follows by Abel's theorem (continuity), not by this integration step.`,
        },
      },
      {
        text: {
          ko: String.raw`\(\ln(1+x) \to \ln 2\) (\(x \to 1^{-}\))이므로 극한은 \(\ln 2 \approx 0.6931\) — Abel 정리가 예측한 값과 일치합니다. 수렴급수에서는 Abel 합이 보통 합을 거스르지 않음을 보여주는 예입니다. ∎`,
          en: String.raw`Since \(\ln(1+x) \to \ln 2\) (\(x \to 1^{-}\)), the limit is \(\ln 2 \approx 0.6931\) — matching Abel's theorem's prediction. This shows the Abel sum never contradicts the ordinary sum for a convergent series. ∎`,
        },
      },
    ],
  },
];
