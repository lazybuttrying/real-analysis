import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Tauber theorem scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/tauber.test.ts):
 *   abelGrandi(0.9) = 1/1.9 = 0.5263157894736842 (IEEE double division);
 *   abelGrandi(0.999) = 1/1.999 = 0.5002501250625312;
 *   Grandi partial sums: S_N = 1 (N even), 0 (N odd), exactly;
 *   |n d_n|: 0.21407671998787478 (n=100), 0.1445783891669132 (n=1000),
 *     0.1085604070758102 (n=10000) -- strictly decreasing,
 *     below 0.5 / 0.15 / 0.11 respectively;
 *   S_2000 = 1.1364157756120048,
 *     |S_4000 - S_2000| = 1.7808884543211467e-5 (< 1e-3);
 *   A_D(0.999) = 1.1366605889895591,
 *     |A_D(0.999) - S_4000| = 2.270024930111081e-4 (< 5e-3);
 *   S_D (N=20000) = 1.1364461306959979.
 */
export const tauberProblems: readonly ProblemMeta[] = [
  {
    id: 'tauber-proof',
    statement: {
      ko: String.raw`타우버 정리를 완전히 증명하세요: \(\sum a_n\)이 \(L\)에 Abel 총합가능하고 \(a_n = o(1/n)\)이면 \(\sum a_n\)이 \(L\)로 수렴합니다.`,
      en: String.raw`Prove Tauber's theorem completely: if \(\sum a_n\) is Abel summable to \(L\) and \(a_n = o(1/n)\), then \(\sum a_n\) converges to \(L\).`,
    },
    display: [
      String.raw`A(r) = \sum_{n \ge 0} a_n r^n \xrightarrow[r \to 1^{-}]{} L, \quad n\,a_n \to 0 \ \Rightarrow\ s_N = \sum_{n \le N} a_n \to L`,
    ],
    preset: { R: 90 },
    presetCaption: {
      ko: String.raw`\(r = 0.9\)에서 그란디의 \(A_G = 1/1.9 \approx 0.5263\)은 \(\frac{1}{2}\)을 향해 가지만, \(|n\,a_n| = n\)이므로 아래 증명의 가설이 깨져 결론도 깨집니다.`,
      en: String.raw`At \(r = 0.9\), Grandi's \(A_G = 1/1.9 \approx 0.5263\) heads toward \(\frac{1}{2}\), but \(|n\,a_n| = n\) breaks the hypothesis of the proof below — so the conclusion breaks too.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(L = 0\)으로 환원합니다: \(a_0\)을 \(a_0 - L\)로 바꾸면 부분합은 \(s_n - L\)이 되고 (목표는 \(0\)), Abel 합은 \(A(r) - L \to 0\)이 되며, \(n \ge 1\)에 대한 \(n\,a_n \to 0\)은 그대로입니다. 이제 \(A(r) \to 0\)이라 가정합니다.`,
          en: String.raw`Reduce to \(L = 0\): replacing \(a_0\) by \(a_0 - L\) turns the partial sums into \(s_n - L\) (target \(0\)), the Abel sum into \(A(r) - L \to 0\), and leaves \(n\,a_n \to 0\) for \(n \ge 1\) untouched. Assume henceforth \(A(r) \to 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`부분합 \(s_n = a_0 + \cdots + a_n\) (\(s_{-1} = 0\))에 대한 Abel 부분합 공식: \(0 \le r < 1\)에서 \(A(r) = (1-r)\sum_{n \ge 0} s_n r^n\)입니다.

정당화: \(n\,a_n \to 0\)이므로 \((a_n)\)은 유계이고 \(s_N = O(N)\)이며, 따라서 \(\sum s_n r^n\)은 \(|r| < 1\)에서 절대수렴하고 (\(\sum N|r|^N < \infty\)), 경계항 \(s_N r^N \to 0\)입니다(지수 감소가 다항 증가를 이깁니다).

이 조건 아래에서 \(a_n = s_n - s_{n-1}\)을 대입한 부분합 재배열 \(\sum (s_n - s_{n-1}) r^n = (1-r)\sum s_n r^n\)이 정당합니다.`,
          en: String.raw`Abel summation by parts for the partial sums \(s_n = a_0 + \cdots + a_n\) (\(s_{-1} = 0\)): for \(0 \le r < 1\), \(A(r) = (1-r)\sum_{n \ge 0} s_n r^n\).

Justification: since \(n\,a_n \to 0\), \((a_n)\) is bounded and \(s_N = O(N)\); hence \(\sum s_n r^n\) converges absolutely for \(|r| < 1\) (\(\sum N|r|^N < \infty\)) and the boundary term satisfies \(s_N r^N \to 0\) (exponential decay beats polynomial growth).

Under these facts, substituting \(a_n = s_n - s_{n-1}\) and rearranging \(\sum (s_n - s_{n-1}) r^n = (1-r)\sum s_n r^n\) is legitimate.`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 주어지면 \(n \ge M\)에서 \(|n\,a_n| \le \varepsilon\)인 \(M\)을 잡습니다 (\(n\,a_n \to 0\)). \(n, N \ge M\)에 대해 \(|s_N - s_n| = |\sum a_k| \le \varepsilon\sum \frac{1}{k} \le \varepsilon\,|\ln(n/N)|\)입니다 (\(\frac{1}{k} \le \int_{k-1}^{k}\frac{dx}{x}\) 이용).`,
          en: String.raw`Given \(\varepsilon > 0\), pick \(M\) with \(|n\,a_n| \le \varepsilon\) for \(n \ge M\) (since \(n\,a_n \to 0\)). For \(n, N \ge M\): \(|s_N - s_n| = |\sum a_k| \le \varepsilon\sum \frac{1}{k} \le \varepsilon\,|\ln(n/N)|\) (using \(\frac{1}{k} \le \int_{k-1}^{k}\frac{dx}{x}\)).`,
        },
      },
      {
        text: {
          ko: String.raw`\((1-r)\sum r^n = 1\)이므로 \(s_N - A(r) = (1-r)\sum_{n \ge 0}(s_N - s_n)\,r^n\)입니다.

\(r = r_N = 1 - \frac{1}{N}\)로 두고 합을 \(n < M\)과 \(n \ge M\)으로 나눕니다.

\(n < M\) 부분: \(|s_N| \le |s_M| + \varepsilon\ln(N/M)\)이므로 기여도는 \(\frac{1}{N}\,M\,(|s_N| + \max_{n<M}|s_n|) \to 0\) (\(N \to \infty\)).`,
          en: String.raw`Since \((1-r)\sum r^n = 1\), \(s_N - A(r) = (1-r)\sum_{n \ge 0}(s_N - s_n)\,r^n\).

Put \(r = r_N = 1 - \frac{1}{N}\) and split at \(M\).

For \(n < M\): \(|s_N| \le |s_M| + \varepsilon\ln(N/M)\), so the contribution is \(\frac{1}{N}\,M\,(|s_N| + \max_{n<M}|s_n|) \to 0\) as \(N \to \infty\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(n \ge M\) 부분은 \((1 - r_N) = \frac{1}{N}\)이므로 \(\varepsilon\cdot\frac{1}{N}\sum_{n \ge M}|\ln(n/N)|\left(1-\frac{1}{N}\right)^n\) 이하입니다.

지배 논증: \(u = n/N\)으로 두면, \(n \le N\)에서는 \(|\ln u|\)의 \(u = 0\) 특이점이 적분가능하고(\(\int_0^1 |\ln u|\,du = 1\)), \(n > N\)에서는 \(\left(1-\frac{1}{N}\right)^n \le e^{-n/(2N)}\) (\(N \ge 2\))이라 꼬리가 \(|\ln u|\,e^{-u/2}\)라는 적분가능한 envelope로 지배됩니다.

\(n < M\) 구간은 유한히 처리됩니다.

따라서 리만합에 대한 지배수렴으로, \(N \to \infty\)에서 이 식은 \(\int_0^{\infty} |\ln u|\,e^{-u}\,du\)로 수렴하므로, 기여도는 \(\varepsilon\,C_0\) (유한 상수 \(C_0 = \int_0^{\infty} |\ln u|\,e^{-u}\,du\))로 수렴합니다.`,
          en: String.raw`For \(n \ge M\) the contribution is at most \(\varepsilon\cdot\frac{1}{N}\sum_{n \ge M}|\ln(n/N)|\left(1-\frac{1}{N}\right)^n\), since \((1 - r_N) = \frac{1}{N}\).

Dominated argument: with \(u = n/N\), the singularity of \(|\ln u|\) at \(u = 0\) is integrable (\(\int_0^1 |\ln u|\,du = 1\)) on the range \(n \le N\), while for \(n > N\), \(\left(1-\frac{1}{N}\right)^n \le e^{-n/(2N)}\) (\(N \ge 2\)), so the tail is dominated by the integrable envelope \(|\ln u|\,e^{-u/2}\); the finitely many indices \(n < M\) are handled separately.

Hence, by dominated convergence for Riemann sums, this expression converges to \(\int_0^{\infty} |\ln u|\,e^{-u}\,du\) as \(N \to \infty\), so the contribution converges to \(\varepsilon\,C_0\) with the finite constant \(C_0 = \int_0^{\infty} |\ln u|\,e^{-u}\,du\).`,
        },
        display: [String.raw`\frac{1}{N}\sum_{n \ge M} \left\lvert\ln\frac{n}{N}\right\rvert \left(1-\frac{1}{N}\right)^n \longrightarrow \int_0^{\infty} \lvert\ln u\rvert\,e^{-u}\,du < \infty`],
      },
      {
        text: {
          ko: String.raw`\(r_N \to 1\)이고 Abel 합이 \(0\)이므로 \(|A(r_N)| \to 0\)입니다.

따라서 \(\limsup_{N \to \infty} |s_N| \le C_0\,\varepsilon\)이고, \(\varepsilon > 0\)이 임의이므로 \(s_N \to 0\) — 즉 \(\sum a_n = L\)이 수렴합니다.

가설 \(n\,a_n \to 0\)이 \(r_N\) 가중치가 \(N\) 근처에 집중될 때 \(s_n \approx s_N\)임을 보장한 것이 증명의 핵심입니다.`,
          en: String.raw`Since \(r_N \to 1\) and the Abel sum is \(0\), \(|A(r_N)| \to 0\).

Hence \(\limsup_{N \to \infty} |s_N| \le C_0\,\varepsilon\), and \(\varepsilon > 0\) being arbitrary gives \(s_N \to 0\) — i.e. \(\sum a_n\) converges to \(L\).

The heart of the proof: the hypothesis \(n\,a_n \to 0\) guarantees \(s_n \approx s_N\) wherever the \(r_N\)-weights concentrate (near \(n = N\)).`,
        },
      },
    ],
  },
  {
    id: 'grandi-fails',
    statement: {
      ko: String.raw`그란디 급수 \(1 - 1 + 1 - \cdots\)에 대해 \(A(r) = \frac{1}{1+r} \to \frac{1}{2}\)를 계산하고, 부분합이 진동하며 발산함과 \(n\,a_n \not\to 0\)임을 보이세요 — 그래서 타우버 정리의 가설과 결론이 모두 깨집니다.`,
      en: String.raw`For Grandi's series \(1 - 1 + 1 - \cdots\), compute \(A(r) = \frac{1}{1+r} \to \frac{1}{2}\), show the partial sums diverge by oscillation, and show \(n\,a_n \not\to 0\) — so both the hypothesis and the conclusion of Tauber's theorem fail.`,
    },
    display: [
      String.raw`A(r) = \sum_{n=0}^{\infty} (-1)^n r^n = \frac{1}{1+r} \xrightarrow[r \to 1^{-}]{} \frac{1}{2}`,
      String.raw`S_N = \begin{cases} 1 & N\ \mathrm{even} \\ 0 & N\ \mathrm{odd} \end{cases}, \qquad \lvert N\,a_N\rvert = N \not\to 0`,
    ],
    preset: { R: 90 },
    presetCaption: {
      ko: String.raw`\(r = 0.9\): \(A_G = 1/1.9 \approx 0.5263\)로 \(\frac{1}{2}\)에 다가가지만, 부분합은 여전히 \(1, 0, 1, 0\ldots\)입니다.`,
      en: String.raw`\(r = 0.9\): \(A_G = 1/1.9 \approx 0.5263\) heads toward \(\frac{1}{2}\), yet the partial sums still bounce \(1, 0, 1, 0\ldots\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(|r| < 1\)에서 \(\sum_{n=0}^{\infty} (-1)^n r^n = \sum_{n=0}^{\infty} (-r)^n = \frac{1}{1-(-r)} = \frac{1}{1+r}\)입니다 (등비급수). \(r \to 1^{-}\)에서 \(A(r) = \frac{1}{1+r} \to \frac{1}{2}\) — 그란디 급수는 \(\frac{1}{2}\)에 Abel 총합가능합니다.`,
          en: String.raw`For \(|r| < 1\), \(\sum_{n=0}^{\infty} (-1)^n r^n = \sum_{n=0}^{\infty} (-r)^n = \frac{1}{1-(-r)} = \frac{1}{1+r}\) (geometric series). As \(r \to 1^{-}\), \(A(r) = \frac{1}{1+r} \to \frac{1}{2}\) — Grandi's series is Abel summable to \(\frac{1}{2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`부분합: \(S_N = 1 - 1 + \cdots \pm 1\)에서 \(N\)이 짝수이면 항이 \(N+1\)개(홀수 개)이므로 \(S_N = 1\), \(N\)이 홀수이면 \(S_N = 0\)입니다. 두 값만 영원히 오가므로 극한이 없고, 급수는 발산합니다 — \(\frac{1}{2}\)는 결코 이 급수의 "합"이 아닙니다.`,
          en: String.raw`Partial sums: \(S_N = 1 - 1 + \cdots \pm 1\) has \(N+1\) (odd) terms for even \(N\), so \(S_N = 1\), and \(S_N = 0\) for odd \(N\). Two values bouncing forever means no limit, so the series diverges — \(\frac{1}{2}\) is never "the sum" of this series.`,
        },
      },
      {
        text: {
          ko: String.raw`\(a_n = (-1)^n\)이므로 \(n\,a_n = n\,(-1)^n\), 즉 \(|n\,a_n| = n \to \infty\)입니다.

타우버 가설 \(a_n = o(1/n)\)이 깨지므로, 정리가 결론(수렴)을 보장하지 않아도 모순이 없습니다 — 실제로 결론도 깨집니다 (발산).

가설 없이는 Abel 합이 수렴을 강제하지 못합니다.`,
          en: String.raw`Since \(a_n = (-1)^n\), \(n\,a_n = n\,(-1)^n\), i.e. \(|n\,a_n| = n \to \infty\).

Tauber's hypothesis \(a_n = o(1/n)\) fails, so the theorem promising nothing is no contradiction — and indeed the conclusion fails too (divergence).

Without the hypothesis, Abel summability cannot force convergence.`,
        },
      },
    ],
  },
  {
    id: 'series-d',
    statement: {
      ko: String.raw`\(d_n = \frac{(-1)^n}{(n+1)\ln(n+2)}\)에 대해 \(n\,d_n \to 0\)을 증명하고 (한 줄), \(\sum d_n\)이 수렴함을 증명하세요 (교대급수 판정법). 그런 뒤 Abel 연속성 정리를 적용해 그 Abel 합이 보통 합과 같음을 결론지으세요.`,
      en: String.raw`For \(d_n = \frac{(-1)^n}{(n+1)\ln(n+2)}\), prove \(n\,d_n \to 0\) (one line) and prove \(\sum d_n\) converges (alternating series test). Then apply Abel's continuity theorem to conclude its Abel sum equals its ordinary sum.`,
    },
    display: [
      String.raw`\lvert n\,d_n\rvert = \frac{n}{(n+1)\ln(n+2)} \to 0`,
      String.raw`S_D \approx 1.13645, \qquad A_D(0.999) \approx 1.13666`,
      String.raw`\lvert A_D(0.999) - S_D \rvert \approx 2.3\times 10^{-4}`,
    ],
    preset: { R: 90 },
    presetCaption: {
      ko: String.raw`\(r = 0.9\): \(A_D(0.9) \approx 1.1583\)이 보통 합 \(S_D \approx 1.13645\)를 향해 가고, \(r = 0.999\)에서는 \(\approx 1.13666\)으로 거의 일치합니다 — 가설이 성립하니 Abel 합이 진짜 합과 일치합니다.`,
      en: String.raw`\(r = 0.9\): \(A_D(0.9) \approx 1.1583\) heads toward the ordinary sum \(S_D \approx 1.13645\), and at \(r = 0.999\) it is \(\approx 1.13666\) — nearly exact. The hypothesis holds, so the Abel sum agrees with the true sum.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(|n\,d_n| = \frac{n}{(n+1)\ln(n+2)} = \frac{1}{1 + 1/n}\cdot\frac{1}{\ln(n+2)} \to 1\cdot 0 = 0\)입니다 — 한 줄로 \(d_n = o(1/n)\)이 성립합니다.`,
          en: String.raw`\(|n\,d_n| = \frac{n}{(n+1)\ln(n+2)} = \frac{1}{1 + 1/n}\cdot\frac{1}{\ln(n+2)} \to 1\cdot 0 = 0\) — in one line, \(d_n = o(1/n)\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(|d_n| = \frac{1}{(n+1)\ln(n+2)}\)는 분모가 \(n\)에 대해 단조증가하므로 \(0\)으로 단조감소합니다. 교대급수 판정법(Leibniz)에 의해 \(\sum d_n\)은 (조건)수렴합니다 — 수치적으로 \(S_D \approx 1.13645\) (20000항), \(|S_{4000} - S_{2000}| \approx 1.8\times 10^{-5}\).`,
          en: String.raw`\(|d_n| = \frac{1}{(n+1)\ln(n+2)}\) decreases monotonically to \(0\) since the denominator increases in \(n\). By the alternating series (Leibniz) test, \(\sum d_n\) converges (conditionally) — numerically \(S_D \approx 1.13645\) (20000 terms), \(|S_{4000} - S_{2000}| \approx 1.8\times 10^{-5}\).`,
        },
      },
      {
        text: {
          ko: String.raw`각 고정된 \(r < 1\)에 대해 \(\sum |d_n|\,r^n\)이 수렴하므로(등비급수 majorant) \(A_D(r)\)이 정의될 뿐, 그것만으로는 \(A_D(r) \to L\)이 나오지 않습니다.

이미 \(\sum d_n\)이 \(S_D\)로 수렴함을 보였으므로, Abel 연속성 정리에 의해 \(A_D(r) \to S_D\) (\(r \to 1^{-}\))입니다 — 즉 Abel 합은 보통 합 \(S_D\)와 같습니다.

(이는 타우버 정리가 아니라, 이미 수렴하는 급수에 대한 Abel 연속성입니다.)

수치 확인: \(A_D(0.999) \approx 1.13666\)으로 \(S_{4000} \approx 1.13643\)과 \(\approx 2.3\times 10^{-4}\) 차이 — 정리가 약속한 일치가 그림에 그대로 나타납니다.`,
          en: String.raw`For each fixed \(r < 1\), \(\sum |d_n|\,r^n\) converges (geometric majorant), so \(A_D(r)\) is defined — but that alone does not give \(A_D(r) \to L\).

Since \(\sum d_n\) was already shown to converge to \(S_D\), Abel's continuity theorem gives \(A_D(r) \to S_D\) as \(r \to 1^{-}\) — i.e. the Abel sum equals the ordinary sum \(S_D\).

(This is Abel continuity for an already-convergent series, not Tauber's theorem.)

Numerical check: \(A_D(0.999) \approx 1.13666\) differs from \(S_{4000} \approx 1.13643\) by only \(\approx 2.3\times 10^{-4}\) — exactly the agreement the theorem promises, visible in the chart.`,
        },
      },
    ],
  },
];
