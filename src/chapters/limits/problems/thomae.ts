import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Thomae scene. Imports nothing
 * except types. Every number below was verified against the model
 * (tests/thomae.test.ts): dots are (p/q, 1/q) in lowest terms for
 * q <= Q, the tall dots (height >= epsilon) are finite, and delta is
 * the minimum distance from the center to them.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'thomae-discontinuous-at-rationals',
    statement: {
      ko: String.raw`토메 함수 \(f\) (\(f(p/q) = 1/q\) (기약분수), 무리수에서 \(f = 0\))가 모든 유리수 \(x_0\)에서 불연속임을 완전히 증명하세요.`,
      en: String.raw`Prove completely that Thomae's function \(f\) (\(f(p/q) = 1/q\) in lowest terms, \(f = 0\) at irrationals) is discontinuous at every rational \(x_0\).`,
    },
    display: [
      String.raw`x_0 = \frac{p}{q}\ \text{(lowest terms)} \Rightarrow f(x_0) = \frac{1}{q} > 0, \quad \varepsilon = \frac{1}{2q}`,
    ],
    preset: { Q: 12, eps: 0.1, center: 0.5, zoom: 0.1 },
    presetCaption: {
      ko: String.raw`\(x_0 = 1/2\) (유리수)에 중심을 둔 보기: \(f(1/2) = 1/2\)이지만 \(1/2\)에 아무리 가까워도 \(f = 0\)인 무리수가 있어, \(\varepsilon = 1/4\)에 대한 \(\delta\)가 존재하지 않습니다.`,
      en: String.raw`View centered at the rational \(x_0 = 1/2\): \(f(1/2) = 1/2\), yet irrationals with \(f = 0\) sit arbitrarily close, so no \(\delta\) works for \(\varepsilon = 1/4\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(x_0 = p/q\)를 기약분수라 두면 \(f(x_0) = 1/q > 0\)입니다. \(\varepsilon = 1/(2q) > 0\)으로 둡니다.

유리수의 조밀성의 쌍대 — 무리수도 조밀하므로 — 임의의 \(\delta > 0\)에 대해 구간 \((x_0 - \delta, x_0 + \delta)\) 안에는 무리수 \(x\)가 존재합니다.`,
          en: String.raw`Write \(x_0 = p/q\) in lowest terms, so \(f(x_0) = 1/q > 0\). Set \(\varepsilon = 1/(2q) > 0\).

By density of the irrationals, for every \(\delta > 0\) the interval \((x_0 - \delta, x_0 + \delta)\) contains an irrational \(x\).`,
        },
      },
      {
        text: {
          ko: String.raw`무리수 \(x\)에서는 \(f(x) = 0\)이므로 \(|f(x) - f(x_0)| = 1/q > 1/(2q) = \varepsilon\)입니다. 즉, 어떤 \(\delta > 0\)를 잡아도 \(|x - x_0| < \delta\)이면서 \(|f(x) - f(x_0)| \ge \varepsilon\)인 \(x\)가 존재하므로, \(\varepsilon\)-\(\delta\) 정의에 의해 \(f\)는 \(x_0\)에서 연속이 아닙니다.`,
          en: String.raw`At an irrational \(x\), \(f(x) = 0\), so \(|f(x) - f(x_0)| = 1/q > 1/(2q) = \varepsilon\). That is, for every \(\delta > 0\) there is an \(x\) with \(|x - x_0| < \delta\) but \(|f(x) - f(x_0)| \ge \varepsilon\); by the \(\varepsilon\)-\(\delta\) definition, \(f\) is not continuous at \(x_0\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(x_0\)는 임의의 유리수였으므로, 토메 함수는 모든 유리수에서 불연속입니다. 씬에서 중심을 유리수(예: \(1/2\))에 두면 \(\delta = 0\)이 되어 위의 논증이 그대로 드러납니다.`,
          en: String.raw`Since \(x_0\) was an arbitrary rational, Thomae's function is discontinuous at every rational. In the scene, centering on a rational (e.g. \(1/2\)) gives \(\delta = 0\), exhibiting this argument directly.`,
        },
      },
    ],
  },
  {
    id: 'thomae-continuous-at-irrationals',
    statement: {
      ko: String.raw`토메 함수가 모든 무리수 \(x_0\)에서 연속임을 \(\varepsilon\)-\(\delta\) 논증으로 완전히 증명하세요.`,
      en: String.raw`Prove completely, by an \(\varepsilon\)-\(\delta\) argument, that Thomae's function is continuous at every irrational \(x_0\).`,
    },
    display: [
      String.raw`S_\varepsilon = \left\{x \in [0,1] : f(x) \ge \varepsilon\right\} = \left\{\frac{p}{q} : q \le \frac{1}{\varepsilon}\right\}\ \text{finite}`,
    ],
    preset: { Q: 12, eps: 0.1, center: 0.618034, zoom: 0.1 },
    presetCaption: {
      ko: String.raw`무리수 \(x_0 \approx 0.618\)에 중심을 둔 보기: \(\varepsilon = 0.1\) 이상으로 솟은 점은 \(q \le 10\)인 유한개의 점뿐이고, \(\delta\)는 그중 가장 가까운 점까지의 거리입니다.`,
      en: String.raw`View centered at the irrational \(x_0 \approx 0.618\): only finitely many dots (those with \(q \le 10\)) reach height \(\varepsilon = 0.1\), and \(\delta\) is the distance to the nearest one.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(x_0\)를 무리수, \(\varepsilon > 0\)을 임의로 둡니다. \(f(x) \ge \varepsilon\)인 점들의 집합 \(S_\varepsilon = \{x \in [0,1] : f(x) \ge \varepsilon\}\)을 봅니다.

\(f\)의 정의에 의해 \(S_\varepsilon\)의 원소는 \(1/q \ge \varepsilon\), 즉 \(q \le 1/\varepsilon\)인 기약분수 \(p/q\)뿐이므로, \(S_\varepsilon\)은 유한집합입니다.`,
          en: String.raw`Let \(x_0\) be irrational and \(\varepsilon > 0\) arbitrary. Consider \(S_\varepsilon = \{x \in [0,1] : f(x) \ge \varepsilon\}\).

By the definition of \(f\), members of \(S_\varepsilon\) are only lowest-terms fractions \(p/q\) with \(1/q \ge \varepsilon\), i.e. \(q \le 1/\varepsilon\); hence \(S_\varepsilon\) is a finite set.`,
        },
      },
      {
        text: {
          ko: String.raw`퇴화 경우: \(S_\varepsilon = \varnothing\)이면 (이는 \(\varepsilon > 1\)일 때 일어납니다 — 모든 \(x\)에서 \(f(x) \le 1 < \varepsilon\)이므로) 임의의 \(\delta > 0\) (예: \(\delta = 1\))로 충분합니다. 이하 \(S_\varepsilon \ne \varnothing\)라 둡니다. \(x_0\)는 무리수이므로 \(x_0 \notin S_\varepsilon\)입니다.

따라서 유한개의 양수 \(\{|x - x_0| : x \in S_\varepsilon\}\)의 최솟값 \(\delta = \min_{x \in S_\varepsilon} |x - x_0|\)는 \(0\)보다 큽니다. 대우로 논증합니다: \(x \in S_\varepsilon\)이면 정의에 의해 \(|x - x_0| \ge \delta\)입니다. 따라서 \(|x - x_0| < \delta\)이면 \(x \notin S_\varepsilon\) — 즉 \(f(x) < \varepsilon\)입니다 (\(x = x_0\)인 경우 \(f(x_0) = 0 < \varepsilon\)로 자명).`,
          en: String.raw`Degenerate case: if \(S_\varepsilon = \varnothing\) (this happens when \(\varepsilon > 1\), since \(f(x) \le 1 < \varepsilon\) for every \(x\)), any \(\delta > 0\) works (e.g. \(\delta = 1\)). Assume henceforth \(S_\varepsilon \ne \varnothing\). Since \(x_0\) is irrational, \(x_0 \notin S_\varepsilon\).

Thus \(\delta = \min_{x \in S_\varepsilon} |x - x_0|\), the minimum of finitely many positive numbers, is strictly positive. Argue by contrapositive: if \(x \in S_\varepsilon\) then \(|x - x_0| \ge \delta\) by definition of the minimum. Hence \(|x - x_0| < \delta\) implies \(x \notin S_\varepsilon\) — i.e. \(f(x) < \varepsilon\) (for \(x = x_0\) this is trivial since \(f(x_0) = 0 < \varepsilon\)).`,
        },
      },
      {
        text: {
          ko: String.raw`\(|f(x) - f(x_0)| = |f(x) - 0| = f(x) < \varepsilon\)이므로 \(f\)는 \(x_0\)에서 연속입니다. \(x_0\)는 임의의 무리수였으므로 토메 함수는 모든 무리수에서 연속입니다 — 씬의 \(\delta\) 표시가 바로 이 최솟값입니다.`,
          en: String.raw`Since \(|f(x) - f(x_0)| = |f(x) - 0| = f(x) < \varepsilon\), \(f\) is continuous at \(x_0\). As \(x_0\) was an arbitrary irrational, Thomae's function is continuous at every irrational — the \(\delta\) shown in the scene is exactly this minimum.`,
        },
      },
    ],
  },
  {
    id: 'thomae-baire-1',
    statement: {
      ko: String.raw`\([0,1]\) 위에서 토메 함수가 연속함수들의 각 점별 극한(pointwise limit)이 됨을 보이세요 — 즉 베어 1급(Baire class 1) 함수임을 완전히 증명하세요.`,
      en: String.raw`On \([0,1]\), show that Thomae's function is a pointwise limit of continuous functions — i.e. prove completely that it is of Baire class 1.`,
    },
    display: [
      String.raw`f_n(x) = \max_{\substack{p/q \in [0,1]\ \text{lowest terms},\ q \le n}} \max\left(0, \frac{1}{q} - n\left|x - \frac{p}{q}\right|\right) \to f(x)\ \forall x \in [0,1]`,
    ],
    preset: { Q: 30, eps: 0.05, center: 0.618034, zoom: 0.2 },
    presetCaption: {
      ko: String.raw`\(Q = 30\), \(\varepsilon = 0.05\): 연속인 텐트 함수들의 각 점별 극한이 이 팝콘 점들을 그려냅니다 — 베어 1급 함수는 조밀한 연속점 집합을 가져야 하며, 토메 함수의 연속점은 무리수 전체(조밀한 \(G_\delta\))입니다.`,
      en: String.raw`\(Q = 30\), \(\varepsilon = 0.05\): a pointwise limit of continuous tent functions draws these popcorn dots — a Baire-1 function must have a dense set of continuity points, and Thomae's is the irrationals (a dense \(G_\delta\)).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`도메인을 \([0,1]\)로 제한합니다 (이 제한 없이는 아래 유한성이 성립하지 않습니다). 각 \(n \ge 1\)에 대해 \(S_n = \{p/q \in [0,1] : 1 \le q \le n,\ \gcd(p,q) = 1\}\)이라 둡니다. 이는 유한집합입니다: \(0 \le p \le q \le n\)인 쌍 \((p, q)\)가 유한개뿐이기 때문입니다.

\(f_n(x) = \max_{r \in S_n} \max(0, 1/q(r) - n|x - r|)\) (\(r = p/q\)의 분모를 \(q(r)\))로 \([0,1]\) 위에서 정의합니다. 각 텐트 \(x \mapsto \max(0, 1/q - n|x - r|)\)는 연속이고 유한개의 최댓값도 연속이므로, \(f_n\)은 연속함수입니다.`,
          en: String.raw`Restrict the domain to \([0,1]\) (without this restriction the finiteness below fails). For each \(n \ge 1\) let \(S_n = \{p/q \in [0,1] : 1 \le q \le n,\ \gcd(p,q) = 1\}\). This is a finite set: there are only finitely many pairs \((p, q)\) with \(0 \le p \le q \le n\).

Define \(f_n(x) = \max_{r \in S_n} \max(0, 1/q(r) - n|x - r|)\) on \([0,1]\), where \(q(r)\) is the denominator of \(r = p/q\). Each tent \(x \mapsto \max(0, 1/q - n|x - r|)\) is continuous, and a finite maximum of continuous functions is continuous, so each \(f_n\) is continuous.`,
        },
      },
      {
        text: {
          ko: String.raw`\(x = a/b \in [0,1]\)를 기약분수라 두면, \(n \ge b\)일 때 \(r = x \in S_n\)인 텐트가 값 \(1/b\)를 주고, 다른 \(r' = p/q \in S_n\), \(r' \ne x\) (\(q \le n\))에 대해서는 \(|x - r'| \ge 1/(bq)\) (분모가 \(b, q\)인 서로 다른 유리수는 \(1/(bq)\) 이상 떨어져 있음)이므로 \(n|x - r'| \ge n/(bq) \ge 1/q\) — 텐트 값이 0이 됩니다. 따라서 \(n \ge b\)에서 \(f_n(x) = 1/b = f(x)\)입니다.`,
          en: String.raw`Let \(x = a/b \in [0,1]\) in lowest terms. For \(n \ge b\), the tent at \(r = x \in S_n\) itself gives the value \(1/b\), while for any other \(r' = p/q \in S_n\) with \(r' \ne x\) and \(q \le n\) we have \(|x - r'| \ge 1/(bq)\) (distinct rationals with denominators \(b, q\) differ by at least \(1/(bq)\)), so \(n|x - r'| \ge n/(bq) \ge 1/q\) — the tent value is 0. Hence \(f_n(x) = 1/b = f(x)\) for \(n \ge b\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(x \in [0,1]\)가 무리수이면 \(f(x) = 0\)입니다. \(M \ge 1\)을 고정하면, 분모 \(q \le M\)인 텐트는 \(|x - r|\)이 양의 하한을 가지므로(\([0,1]\) 안에서 분모 \(\le M\)인 유리수는 유한개뿐이고 어느 것도 무리수 \(x\)와 같지 않음) \(n\)이 크면 모두 0이 되고, \(q > M\)인 텐트는 값이 \(1/q < 1/M\) 이하입니다.

따라서 \(\limsup_{n \to \infty} f_n(x) \le 1/M\) — \(M\)이 임의이므로 \(f_n(x) \to 0 = f(x)\)입니다. \([0,1]\)의 모든 \(x\)에서 \(f_n \to f\)이므로 토메 함수는 \([0,1]\) 위에서 베어 1급입니다.`,
          en: String.raw`If \(x \in [0,1]\) is irrational, \(f(x) = 0\). Fix \(M \ge 1\): tents with denominator \(q \le M\) all vanish for large \(n\) (there are only finitely many rationals in \([0,1]\) with denominator \(\le M\), each at positive distance from the irrational \(x\)), and tents with \(q > M\) are worth at most \(1/q < 1/M\).

Hence \(\limsup_{n \to \infty} f_n(x) \le 1/M\); since \(M\) is arbitrary, \(f_n(x) \to 0 = f(x)\). So \(f_n \to f\) at every \(x \in [0,1]\): Thomae's function is Baire class 1 on \([0,1]\).`,
        },
      },
    ],
  },
];
