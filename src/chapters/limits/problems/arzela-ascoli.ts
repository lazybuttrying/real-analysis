import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Arzela-Ascoli scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/arzela-ascoli.test.ts):
 *   a_k = 1/2 + (-1)^k/(k+2): a_1 = 1/6, a_2 = 3/4, a_12 = 1/2 + 1/14;
 *   sup errors ||f_{a_k} - f*||_inf = 1/(k+2) exactly (k = 1..12),
 *     strictly decreasing, = 1/14 = 0.071428... at k = 12;
 *   max Lipschitz constant 2|a_k| over k = 1..12 is 1.5 (at k = 2);
 *   contrast pairwise sup distance (401-point grid) = 0.472470...,
 *     attained at (2, 8) and (8, 32).
 *
 * NOTE: the demo sequence leaves [-1/2, 1/2] (a_2 = 3/4), so the scene
 * takes the family as |a| <= 3/4 — uniformly bounded by 3/4, uniformly
 * 3/2-Lipschitz, hence equicontinuous.
 */
export const arzelaAscoliProblems: readonly ProblemMeta[] = [
  {
    id: 'rel-compact-equicont',
    statement: {
      ko: String.raw`\(K\)를 컴팩트 거리공간, \(F \subset C(K)\)를 상한 노름에서 상대 컴팩트라고 하자. 유한 \(\varepsilon/3\)-net을 이용해 \(F\)가 등연속임을 증명하세요 (힌트: 각 net 원소는 컴팩트 \(K\) 위에서 균등연속).`,
      en: String.raw`Let \(K\) be a compact metric space and \(F \subset C(K)\) relatively compact in the sup norm. Prove \(F\) is equicontinuous using a finite \(\varepsilon/3\)-net (hint: each net member is uniformly continuous on the compact \(K\)).`,
    },
    display: [
      String.raw`\lvert f(x) - f(y) \rvert \le \lVert f - g_j \rVert_\infty + \lvert g_j(x) - g_j(y) \rvert + \lVert g_j - f \rVert_\infty < \varepsilon`,
    ],
    preset: { members: 6 },
    presetCaption: {
      ko: String.raw`멤버 6개: 상한 오차 \(\frac13 \to \frac14 \to \frac15 \to \frac16 \to \frac17 \to \frac18 = 0.125\) — \(|a_k| \le \frac34\)인 \(\frac32\)-Lipschitz 수열이 균등수렴합니다.`,
      en: String.raw`6 members: sup errors \(\frac13 \to \frac14 \to \frac15 \to \frac16 \to \frac17 \to \frac18 = 0.125\) — a \(\frac32\)-Lipschitz sequence with \(|a_k| \le \frac34\) converging uniformly.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`상대 컴팩트이면 완전 유계입니다: 임의의 \(\varepsilon > 0\)에 대해 폐포 \(\overline{F}\)의 유한 \(\varepsilon/3\)-net \(\{g_1, \dots, g_m\}\)이 존재합니다. 즉 모든 \(f \in F\)에 대해 \(\lVert f - g_j \rVert_\infty < \varepsilon/3\)인 \(g_j\)가 있습니다. \(g_j\)는 \(F\)에 속하지 않아도 됩니다 — 연속이기만 하면 됩니다.`,
          en: String.raw`Relatively compact implies totally bounded: for any \(\varepsilon > 0\) there is a finite \(\varepsilon/3\)-net \(\{g_1, \dots, g_m\}\) of the closure \(\overline{F}\). That is, every \(f \in F\) has some \(g_j\) with \(\lVert f - g_j \rVert_\infty < \varepsilon/3\). The \(g_j\) need not lie in \(F\) — continuity is all we need.`,
        },
      },
      {
        text: {
          ko: String.raw`각 \(g_j\)는 컴팩트 거리공간 \(K\) 위에서 연속이므로 균등연속입니다 (Heine–Cantor): \(d(x, y) < \delta_j\)이면 \(\lvert g_j(x) - g_j(y) \rvert < \varepsilon/3\)인 \(\delta_j > 0\)이 존재합니다. \(\delta = \min_j \delta_j > 0\)으로 둡니다 — 이 \(\delta\)는 \(f\)에 의존하지 않습니다.`,
          en: String.raw`Each \(g_j\) is continuous on the compact metric space \(K\), hence uniformly continuous (Heine–Cantor): there is \(\delta_j > 0\) with \(\lvert g_j(x) - g_j(y) \rvert < \varepsilon/3\) whenever \(d(x, y) < \delta_j\). Set \(\delta = \min_j \delta_j > 0\) — this \(\delta\) does not depend on \(f\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(f \in F\)와 \(d(x, y) < \delta\)인 \(x, y\)를 봅니다. \(\lVert f - g_j \rVert_\infty < \varepsilon/3\)인 \(g_j\)를 고르면 삼각부등식으로 \(\lvert f(x) - f(y) \rvert \le \lvert f(x) - g_j(x) \rvert + \lvert g_j(x) - g_j(y) \rvert + \lvert g_j(y) - f(y) \rvert < \varepsilon/3 + \varepsilon/3 + \varepsilon/3 = \varepsilon\)입니다. \(\delta\)가 모든 \(f \in F\)에 공통이므로 \(F\)는 등연속입니다.`,
          en: String.raw`Now take \(f \in F\) and \(x, y\) with \(d(x, y) < \delta\). Picking \(g_j\) with \(\lVert f - g_j \rVert_\infty < \varepsilon/3\), the triangle inequality gives \(\lvert f(x) - f(y) \rvert \le \lvert f(x) - g_j(x) \rvert + \lvert g_j(x) - g_j(y) \rvert + \lvert g_j(y) - f(y) \rvert < \varepsilon/3 + \varepsilon/3 + \varepsilon/3 = \varepsilon\). Since \(\delta\) works for every \(f \in F\), the family \(F\) is equicontinuous.`,
        },
      },
      {
        text: {
          ko: String.raw`덧붙여 상대 컴팩트는 균등 유계를 줍니다 (유계 집합의 폐포는 유계): \(M = \sup_{f \in F} \lVert f \rVert_\infty < \infty\). 역으로 컴팩트 \(K\) 위에서는 점별 유계 + 등연속이면 균등 유계가 따라옵니다: \(\varepsilon = 1\)에 대한 등연속 \(\delta\)로 \(K\)를 유한 \(\delta\)-net \(\{y_1, \dots, y_r\}\)로 덮으면, 각 \(x\)는 어떤 \(y_i\)에 \(\delta\)-근접하므로 \(\lvert f(x) \rvert \le \lvert f(y_i) \rvert + 1 \le \max_i \sup_f \lvert f(y_i) \rvert + 1\)입니다.`,
          en: String.raw`In addition, relative compactness gives uniform boundedness (a bounded set has bounded closure): \(M = \sup_{f \in F} \lVert f \rVert_\infty < \infty\). Conversely, on compact \(K\), pointwise bounded + equicontinuous implies uniformly bounded: cover \(K\) by a finite \(\delta\)-net \(\{y_1, \dots, y_r\}\) for the equicontinuity modulus at \(\varepsilon = 1\); each \(x\) is \(\delta\)-close to some \(y_i\), so \(\lvert f(x) \rvert \le \lvert f(y_i) \rvert + 1 \le \max_i \sup_f \lvert f(y_i) \rvert + 1\).`,
        },
      },
    ],
  },
  {
    id: 'diagonal-extraction',
    statement: {
      ko: String.raw`\(K\)를 컴팩트 거리공간, \(\{x_k\}\)를 \(K\)의 가산 조밀 부분집합, \((f_n)\)을 \(\sup_n \lVert f_n \rVert_\infty \le M\)인 \(C(K)\)의 수열이라 하자. 대각선 논법으로 모든 \(x_k\)에서 수렴하는 부분수열을 구성하세요.`,
      en: String.raw`Let \(K\) be a compact metric space, \(\{x_k\}\) a countable dense subset of \(K\), and \((f_n)\) a sequence in \(C(K)\) with \(\sup_n \lVert f_n \rVert_\infty \le M\). Construct, by the diagonal argument, a subsequence converging at every \(x_k\).`,
    },
    display: [
      String.raw`n^{(1)} \supset n^{(2)} \supset \cdots \quad \text{(nested index sequences)}, \qquad m_j = n^{(j)}_j \ \text{(diagonal)}`,
    ],
    preset: { members: 6 },
    presetCaption: {
      ko: String.raw`멤버 6개: 진폭 \(a_k = \frac12 + \frac{(-1)^k}{k+2}\)가 \(\frac16, \frac34, \frac{3}{10}, \frac23, \frac{5}{14}, \frac58\)로 \(\frac12\)를 오가며 접근 — 대각선 추출이 이런 진동 수열을 길어내는 방식입니다.`,
      en: String.raw`6 members: amplitudes \(a_k = \frac12 + \frac{(-1)^k}{k+2}\) oscillate toward \(\frac12\) through \(\frac16, \frac34, \frac{3}{10}, \frac23, \frac{5}{14}, \frac58\) — the way diagonal extraction fishes out such an oscillating sequence.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`컴팩트 거리공간은 가분입니다 (각 \(r\)에 대한 유한 \(1/r\)-net의 합집합). 이제 수열 \((f_n)\)을 봅니다. 각 \(k\)에 대해 수열 \((f_n(x_k))_n\)은 \([-M, M]\)에 갇힌 실수 수열이므로, Bolzano–Weierstrass 정리로 수렴하는 부분수열을 가집니다.`,
          en: String.raw`A compact metric space is separable (take the union of finite \(1/r\)-nets). Now look at \((f_n)\). For each \(k\), the scalar sequence \((f_n(x_k))_n\) is trapped in \([-M, M]\), so by Bolzano–Weierstrass it has a convergent subsequence.`,
        },
      },
      {
        text: {
          ko: String.raw`중첩된 지표 수열을 만듭니다: \(n^{(1)}_1 < n^{(1)}_2 < \cdots\)에서 \(f_{n^{(1)}_j}(x_1)\)이 수렴하도록 고르고, 귀납적으로 \(n^{(k)}\)를 \(n^{(k-1)}\)의 부분수열이면서 \(f_{n^{(k)}_j}(x_k)\)가 수렴하도록 고릅니다. \(k\)를 고정하면 \(n^{(k)}\) 이후의 모든 단계는 그 부분수열이므로, \(x_1, \dots, x_k\)에서의 수렴이 유지됩니다.`,
          en: String.raw`Build nested index sequences: choose \(n^{(1)}_1 < n^{(1)}_2 < \cdots\) so that \(f_{n^{(1)}_j}(x_1)\) converges, and inductively choose \(n^{(k)}\) as a subsequence of \(n^{(k-1)}\) with \(f_{n^{(k)}_j}(x_k)\) convergent. Fixing \(k\), every later stage refines \(n^{(k)}\), so convergence at \(x_1, \dots, x_k\) is preserved.`,
        },
      },
      {
        text: {
          ko: String.raw`대각선 \(m_j = n^{(j)}_j\)를 둡니다. \(k\)를 고정하면, \(j \ge k\)인 꼬리 \((m_j)_{j \ge k}\)는 \((n^{(k)}_j)\)의 부분수열입니다 (중첩 구조 덕분에 \(m_j = n^{(j)}_j\)가 \(n^{(k)}\)의 항들 중에서 strictly increasing하게 뽑히기 때문). 따라서 \(f_{m_j}(x_k)\)가 수렴합니다. \(k\)가 임의였으므로 \((f_{m_j})\)는 모든 \(x_k\)에서 수렴합니다 — 조밀 집합 위의 점별 수렴입니다.`,
          en: String.raw`Set the diagonal \(m_j = n^{(j)}_j\). Fixing \(k\), the tail \((m_j)_{j \ge k}\) is a subsequence of \((n^{(k)}_j)\) (nesting makes \(m_j = n^{(j)}_j\) a strictly increasing pick from the terms of \(n^{(k)}\)). Hence \(f_{m_j}(x_k)\) converges. Since \(k\) was arbitrary, \((f_{m_j})\) converges at every \(x_k\) — pointwise convergence on the dense set.`,
        },
      },
      {
        text: {
          ko: String.raw`주의: 여기서는 점별 유계만 썼습니다. 이 점별 수렴을 \(K\) 전체에서의 균등수렴으로 끌어올리는 것이 등연속의 역할이며, 다음 문제에서 \(\varepsilon/3\) 논증으로 수행합니다.`,
          en: String.raw`Note: only pointwise boundedness was used here. Upgrading this pointwise convergence to uniform convergence on all of \(K\) is the job of equicontinuity, carried out by the \(\varepsilon/3\) argument in the next problem.`,
        },
      },
    ],
  },
  {
    id: 'uniform-upgrade',
    statement: {
      ko: String.raw`등연속인 점별 유계 수열 \((f_n) \subset C(K)\) (\(K\) 컴팩트 거리공간)가 가산 조밀 집합 \(\{x_k\}\) 위에서 점별 수렴한다고 하자. \(\varepsilon/3\) 논증으로 이 수렴이 \(K\) 전체에서 균등함을 증명하고, 따름정리로 \((x^n)\)이 \([0,1]\)에서 균등수렴하는 부분수열을 갖지 않음을 보이세요.`,
      en: String.raw`Let \((f_n) \subset C(K)\) be equicontinuous and pointwise bounded (\(K\) compact metric), converging pointwise on a countable dense set \(\{x_k\}\). Prove by the \(\varepsilon/3\) argument that the convergence is uniform on all of \(K\), and deduce as a corollary that \((x^n)\) has no uniformly convergent subsequence on \([0,1]\).`,
    },
    display: [
      String.raw`\lvert f_{m_j}(x) - f_{m_\ell}(x) \rvert \le \tfrac{\varepsilon}{3} + \tfrac{\varepsilon}{3} + \tfrac{\varepsilon}{3} = \varepsilon \quad \text{(uniformly Cauchy)}`,
      String.raw`x^n \to \begin{cases} 0 & x \in [0, 1) \\ 1 & x = 1 \end{cases} \quad \text{(discontinuous pointwise limit)}`,
    ],
    preset: { members: 6 },
    presetCaption: {
      ko: String.raw`멤버 6개: \(\lVert f_{a_k} - f^* \rVert_\infty = \frac{1}{k+2}\)가 0으로 — 등연속성이 조밀 집합 위의 수렴을 전체 구간으로 퍼뜨린 결과입니다.`,
      en: String.raw`6 members: \(\lVert f_{a_k} - f^* \rVert_\infty = \frac{1}{k+2} \to 0\) — equicontinuity spreading convergence from the dense set to the whole interval.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 주어지면 등연속성에서 \(\delta > 0\)을 얻습니다: \(d(x, y) < \delta\)이면 모든 \(n\)에 대해 \(\lvert f_n(x) - f_n(y) \rvert < \varepsilon/3\). \(K\)가 컴팩트이므로 조밀 집합 \(\{x_k\}\) 중에서 유한 \(\delta\)-net \(x_{k_1}, \dots, x_{k_r}\)을 뽑을 수 있습니다.`,
          en: String.raw`Given \(\varepsilon > 0\), equicontinuity yields \(\delta > 0\): \(d(x, y) < \delta\) implies \(\lvert f_n(x) - f_n(y) \rvert < \varepsilon/3\) for every \(n\). Since \(K\) is compact, finitely many points \(x_{k_1}, \dots, x_{k_r}\) from the dense set \(\{x_k\}\) form a \(\delta\)-net of \(K\).`,
        },
      },
      {
        text: {
          ko: String.raw`유한 개의 점 \(x_{k_i}\)에서는 점별 수렴이 "균등"해집니다: \(N\)을 크게 잡아 \(j, \ell \ge N\)이면 모든 \(i\)에 대해 \(\lvert f_{m_j}(x_{k_i}) - f_{m_\ell}(x_{k_i}) \rvert < \varepsilon/3\)이 되도록 합니다 (유한 교집합).`,
          en: String.raw`At the finitely many net points, pointwise convergence becomes "uniform": choose \(N\) so large that \(j, \ell \ge N\) gives \(\lvert f_{m_j}(x_{k_i}) - f_{m_\ell}(x_{k_i}) \rvert < \varepsilon/3\) for every \(i\) (a finite intersection of tails).`,
        },
      },
      {
        text: {
          ko: String.raw`임의의 \(x \in K\)에 대해 \(d(x, x_{k_i}) < \delta\)인 \(x_{k_i}\)를 고릅니다. 삼각부등식: \(\lvert f_{m_j}(x) - f_{m_\ell}(x) \rvert \le \lvert f_{m_j}(x) - f_{m_j}(x_{k_i}) \rvert + \lvert f_{m_j}(x_{k_i}) - f_{m_\ell}(x_{k_i}) \rvert + \lvert f_{m_\ell}(x_{k_i}) - f_{m_\ell}(x) \rvert < \varepsilon/3 + \varepsilon/3 + \varepsilon/3 = \varepsilon\). 따라서 \((f_{m_j})\)는 균등 Cauchy이므로, \(C(K)\)의 완비성에 의해 균등수렴합니다.`,
          en: String.raw`For arbitrary \(x \in K\), pick \(x_{k_i}\) with \(d(x, x_{k_i}) < \delta\). By the triangle inequality, \(\lvert f_{m_j}(x) - f_{m_\ell}(x) \rvert \le \lvert f_{m_j}(x) - f_{m_j}(x_{k_i}) \rvert + \lvert f_{m_j}(x_{k_i}) - f_{m_\ell}(x_{k_i}) \rvert + \lvert f_{m_\ell}(x_{k_i}) - f_{m_\ell}(x) \rvert < \varepsilon/3 + \varepsilon/3 + \varepsilon/3 = \varepsilon\). Hence \((f_{m_j})\) is uniformly Cauchy, so it converges uniformly by completeness of \(C(K)\).`,
        },
      },
      {
        text: {
          ko: String.raw`이로써 (\(\Longleftarrow\))가 완성됩니다: 점별 유계 + 등연속이면 (앞 문제의 언급대로) 균등 유계이고, 모든 수열이 균등수렴 부분수열을 가지므로, 거리공간에서의 순차 컴팩트성에 의해 집합은 상대 컴팩트입니다.`,
          en: String.raw`This completes (\(\Longleftarrow\)): pointwise bounded + equicontinuous implies uniformly bounded (as noted in the first problem), and every sequence has a uniformly convergent subsequence, so by sequential compactness in metric spaces the set is relatively compact.`,
        },
      },
      {
        text: {
          ko: String.raw`따름정리: \((x^n)\)은 \([0,1]\)에서 균등수렴하는 부분수열을 갖지 않습니다. 점별 극한은 \([0,1)\)에서 0, \(x = 1\)에서 1로 불연속입니다. 만약 어떤 부분수열이 균등수렴했다면 그 극한은 연속함수들의 균등 극한이므로 연속이어야 하고, 점별 극한과 일치해야 하므로 모순입니다. 즉 \(\{x^n\}\)은 \(x = 1\)에서 등연속이 아닙니다 — 씬의 대조군 차트가 보여주듯 서로 다른 두 항의 상한 거리는 0.47 이상으로 벌어진 채 남습니다.`,
          en: String.raw`Corollary: \((x^n)\) has no uniformly convergent subsequence on \([0,1]\). Its pointwise limit is discontinuous — 0 on \([0,1)\), 1 at \(x = 1\). If some subsequence converged uniformly, its limit would be continuous (a uniform limit of continuous functions) and would have to equal the pointwise limit — contradiction. So \(\{x^n\}\) is not equicontinuous at \(x = 1\): as the scene's contrast chart shows, pairwise sup distances between distinct members stay at least 0.47 apart.`,
        },
      },
    ],
  },
];
