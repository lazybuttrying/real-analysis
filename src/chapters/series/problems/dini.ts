import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Dini's theorem scene.
 * Imports nothing except types. Every number below was verified:
 * compactMaxGap(8) = 1/9 ~= 0.1111, compactMaxGap(12) = 1/13 ~= 0.0769,
 * compactMaxGap(20) = 1/21 ~= 0.0476, noncompactSupGap() = 1 for every n,
 * noncompactTerm(20, 0.5) = 2^-20 ~= 9.5367e-7, noncompactTerm(20, 1) = 1.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'dini-proof',
    statement: {
      ko: String.raw`\(K\)를 컴팩트 거리공간이라 하자. 각 \(f_n : K \to \mathbb{R}\)가 연속이고, 각 \(x \in K\)에서 \(f_n(x)\)가 단조 증가하면서 연속함수 \(f : K \to \mathbb{R}\)에 수렴할 때, \(f_n \to f\)가 \(K\)에서 균등수렴함을 증명하세요.`,
      en: String.raw`Let \(K\) be a compact metric space. If each \(f_n : K \to \mathbb{R}\) is continuous and \(f_n(x)\) increases monotonically to a continuous limit \(f : K \to \mathbb{R}\) at each \(x \in K\), prove that \(f_n \to f\) uniformly on \(K\).`,
    },
    display: [
      String.raw`E_n = \{x \in K : f(x) - f_n(x) < \varepsilon\}, \qquad E_n \subseteq E_{n+1}, \qquad K = \bigcup_{n=1}^{\infty} E_n`,
    ],
    preset: { n: 8, domain: 'compact' },
    presetCaption: {
      ko: String.raw`\(n=8\): 최대 간격 \(1/9 \approx 0.1111\) — \(n\)이 커질수록 간격이 한꺼번에 줄어든다.`,
      en: String.raw`\(n=8\): worst gap \(1/9 \approx 0.1111\) — the gap shrinks across the whole interval at once as \(n\) grows.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)을 고정하고 \(E_n = \{x \in K : f(x) - f_n(x) < \varepsilon\}\)이라 두자. \(f - f_n\)은 연속이므로 각 \(E_n\)은 \(K\)의 열린 부분집합이다. 단조 증가 \(f_n(x) \le f_{n+1}(x)\)이므로 \(f(x) - f_n(x) \ge f(x) - f_{n+1}(x)\)이고, 따라서 \(E_n \subseteq E_{n+1}\)이다.`,
          en: String.raw`Fix \(\varepsilon > 0\) and set \(E_n = \{x \in K : f(x) - f_n(x) < \varepsilon\}\). Each \(E_n\) is open in \(K\) because \(f - f_n\) is continuous. Since \(f_n(x) \le f_{n+1}(x)\) monotonically, \(f(x) - f_n(x) \ge f(x) - f_{n+1}(x)\), so \(E_n \subseteq E_{n+1}\).`,
        },
      },
      {
        text: {
          ko: String.raw`각 \(x\)에서 \(f_n(x) \to f(x)\)이므로, \(f(x) - f_n(x) < \varepsilon\)인 \(n\)이 존재하고 따라서 \(x \in E_n\)이다. 즉 \(\{E_n\}\)은 \(K\)의 열린 덮개이다.`,
          en: String.raw`Since \(f_n(x) \to f(x)\) at each \(x\), there is \(n\) with \(f(x) - f_n(x) < \varepsilon\), so \(x \in E_n\). Hence \(\{E_n\}\) is an open cover of \(K\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(K\)가 컴팩트이므로 유한 부분덮개 \(E_{n_1}, \dots, E_{n_k}\)가 존재한다. \(N = \max\{n_1, \dots, n_k\}\)라 두면 단조성에 의해 \(K \subseteq E_N\)이다. \(n \ge N\)이면 \(E_N \subseteq E_n\)이므로 모든 \(x \in K\)에 대해 \(f(x) - f_n(x) < \varepsilon\)이다 — \(x\)에 의존하지 않는 하나의 \(N\)이 전체 \(K\)에 통하므로 균등수렴이다. (단조 감소인 경우 \(-f_n\)에 적용한다.)`,
          en: String.raw`Compactness of \(K\) gives a finite subcover \(E_{n_1}, \dots, E_{n_k}\). With \(N = \max\{n_1, \dots, n_k\}\), monotonicity yields \(K \subseteq E_N\). For \(n \ge N\), \(E_N \subseteq E_n\), so \(f(x) - f_n(x) < \varepsilon\) for every \(x \in K\) — one \(N\) works for all of \(K\), which is uniform convergence. (For the decreasing case, apply the argument to \(-f_n\).)`,
        },
      },
    ],
  },
  {
    id: 'dini-counterexample',
    statement: {
      ko: String.raw`\(g_n(x) = x^n\)이 \((0,1]\)에서 각 점별로 \(g(x) = 0\) (\((0,1)\)에서, \(g(1) = 1\))에 수렴하지만, 단조 감소임에도 균등수렴하지 않음을 보이세요.`,
      en: String.raw`Show that \(g_n(x) = x^n\) converges pointwise on \((0,1]\) to \(g(x) = 0\) (on \((0,1)\), with \(g(1) = 1\)), yet, despite being monotone decreasing, does not converge uniformly.`,
    },
    display: [
      String.raw`\sup_{x \in (0,1]} |g(x) - g_n(x)| = 1 \quad \text{for every } n`,
    ],
    preset: { n: 20, domain: 'noncompact' },
    presetCaption: {
      ko: String.raw`\(n=20\): sup 간격이 1에 묶여 있음 — 곡선들은 0에 달라붙지만 절대 균등하게 붙지 않는다.`,
      en: String.raw`\(n=20\): the sup gap is stuck at 1 — the curves pile toward 0 but never hug it uniformly.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`각 \(g_n\)은 연속이고, \(0 < x < 1\)에서는 \(g_{n+1}(x) = x^{n+1} \le x^n = g_n(x)\)이므로 단조 감소한다. 각 점별 수렴: \(0 < x < 1\)이면 \(x^n \to 0\)이고, \(x = 1\)에서는 \(g_n(1) = 1\)이므로 극한 \(g\)는 \(x = 1\)에서 불연속이다.`,
          en: String.raw`Each \(g_n\) is continuous, and on \(0 < x < 1\) we have \(g_{n+1}(x) = x^{n+1} \le x^n = g_n(x)\), so the sequence decreases monotonically. Pointwise: \(x^n \to 0\) for \(0 < x < 1\), while \(g_n(1) = 1\) at \(x = 1\), so the limit \(g\) is discontinuous at \(x = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`\((0,1)\) 위에서 \(\sup_{x \in (0,1)} |g(x) - g_n(x)| = \sup_{x \in (0,1)} x^n = 1\)이다 (\(x \to 1^-\)). 즉 \(\varepsilon = \tfrac{1}{2}\)에 대해 어떤 \(n\)도 모든 \(x\)에 동시에 통하지 않으므로 균등수렴이 아니다.`,
          en: String.raw`On \((0,1)\), \(\sup_{x \in (0,1)} |g(x) - g_n(x)| = \sup_{x \in (0,1)} x^n = 1\) (take \(x \to 1^-\)). So for \(\varepsilon = \tfrac{1}{2}\) no \(n\) works for all \(x\) at once: the convergence is not uniform.`,
        },
      },
      {
        text: {
          ko: String.raw`단조성·연속성은 디니 정리와 같은 설정인데도 실패한다 — 빠진 것은 정의역의 컴팩트성이다. \((0,1]\)은 닫혀 있지 않고, 증명의 유한 부분덮개 단계가 여기서 막힌다. 균등수렴하는 연속함수열의 극한은 연속이어야 한다는 사실도 같은 결론을 준다: 극한 \(g\)는 \(x = 1\)에서 불연속이다.`,
          en: String.raw`Monotonicity and continuity match Dini's setup, yet it fails — what is missing is compactness of the domain. \((0,1]\) is not closed, and the finite-subcover step of the proof breaks down here. The fact that a uniform limit of continuous functions must be continuous gives the same conclusion: the limit \(g\) is discontinuous at \(x = 1\).`,
        },
      },
    ],
  },
  {
    id: 'dini-series-xn-n2',
    statement: {
      ko: String.raw`\(\sum_{n=1}^{\infty} \frac{x^n}{n^2}\)가 \([0,1]\)에서 균등수렴함을 디니 정리로 보이세요.`,
      en: String.raw`Show that \(\sum_{n=1}^{\infty} \frac{x^n}{n^2}\) converges uniformly on \([0,1]\) using Dini's theorem.`,
    },
    display: [
      String.raw`S_N(x) = \sum_{k=1}^{N} \frac{x^k}{k^2} \uparrow S(x), \qquad 0 \le \frac{x^k}{k^2} \le \frac{1}{k^2}`,
    ],
    preset: { n: 12, domain: 'compact' },
    presetCaption: {
      ko: String.raw`\(n=12\), compact 모드: \([0,1]\) 위의 단조 연속함수열 — 최대 간격 \(1/13 \approx 0.0769\)가 균등하게 줄어든다.`,
      en: String.raw`\(n=12\), compact mode: a monotone sequence of continuous functions on \([0,1]\) — the worst gap \(1/13 \approx 0.0769\) shrinks uniformly.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`부분합 \(S_N(x) = \sum_{k=1}^{N} \frac{x^k}{k^2}\)은 연속함수의 유한합이므로 연속이고, \([0,1]\)에서 \(S_{N+1}(x) - S_N(x) = \frac{x^{N+1}}{(N+1)^2} \ge 0\)이므로 단조 증가한다.`,
          en: String.raw`The partial sums \(S_N(x) = \sum_{k=1}^{N} \frac{x^k}{k^2}\) are continuous (finite sums of continuous functions) and increasing on \([0,1]\), since \(S_{N+1}(x) - S_N(x) = \frac{x^{N+1}}{(N+1)^2} \ge 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`각 \(x \in [0,1]\)에 대해 \(0 \le \frac{x^k}{k^2} \le \frac{1}{k^2}\)이고 \(\sum \frac{1}{k^2} = \frac{\pi^2}{6} < \infty\)이므로, 각 점별 극한 \(S(x) = \sum_{k=1}^{\infty} \frac{x^k}{k^2}\)이 존재한다.`,
          en: String.raw`For each \(x \in [0,1]\), \(0 \le \frac{x^k}{k^2} \le \frac{1}{k^2}\) and \(\sum \frac{1}{k^2} = \frac{\pi^2}{6} < \infty\), so the pointwise limit \(S(x) = \sum_{k=1}^{\infty} \frac{x^k}{k^2}\) exists.`,
        },
      },
      {
        text: {
          ko: String.raw`\(S\)는 연속이다: \(M_k = \frac{1}{k^2}\)로 M-판정법을 적용하면 급수가 \([0,1]\)에서 균등수렴하므로, \(S\)는 연속함수들의 균등 극한이 되어 연속이다. 따라서 디니 정리의 가설(컴팩트 \([0,1]\) · 연속인 단조열 · 연속인 극한)이 모두 성립하고, \(S_N \to S\)는 \([0,1]\)에서 균등수렴한다.`,
          en: String.raw`\(S\) is continuous: the M-test with \(M_k = \frac{1}{k^2}\) gives uniform convergence of the series on \([0,1]\), making \(S\) the uniform limit of continuous functions, hence continuous. All of Dini's hypotheses hold (compact \([0,1]\), continuous monotone sequence, continuous limit), so \(S_N \to S\) uniformly on \([0,1]\).`,
        },
      },
    ],
  },
];

