import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Baire class 1 scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/baire-1.test.ts):
 *   The model sums over REDUCED fractions only (the Farey set of order n).
 *   A naive double sum over all (p, q) would stack 1/2 + 1/4 + 1/6 + ...
 *   at x = 1/2 and diverge, so it cannot converge to Thomae.
 *   On an 8001-point grid of [0, 1], the maximum number of tents with
 *   tri(n^3 (x - p/q)) > 0 at a single x is 1 for every n = 2..12
 *   (pairwise disjoint tents); the minimum spacing of the Farey set of
 *   order n equals 1/(n(n-1)) for n = 2..12, strictly larger than the tent
 *   width 2/n^3.
 *   f_n(1/2) = 0.5 exactly for n >= 2; f_n(1/3) = 1/3 exactly for n >= 3
 *   (f_2(1/3) = 0, no tent reaches 1/3 yet);
 *   f_12(sqrt(2)/2) = 0 and f_12(pi/4) = 0 (both < 0.05);
 *   f_n >= 0 everywhere on the grid; bump counts n = 5 -> 11, n = 12 -> 47.
 */
export const baireOneProblems: readonly ProblemMeta[] = [
  {
    id: 'thomae-approximants',
    statement: {
      ko: String.raw`\(n \ge 2\)에 대해 \(f_n(x) = \sum \frac{1}{q}\,\mathrm{tri}(n^3(x - p/q))\)라 두세요. 합은 \(1 \le q \le n\), \(0 \le p \le q\), \(\gcd(p,q) = 1\)인 기약분수들에 대해서만 취하고, \(\mathrm{tri}(t) = \max(0, 1 - |t|)\)입니다. 각 \(f_n\)이 \([0, 1]\)에서 연속이고, Thomae 함수 \(T\) (기약분수 \(p/q\)에서 \(1/q\), 무리수에서 \(0\), \(T(0) = T(1) = 1\))로 점별수렴 \(f_n(x) \to T(x)\) 함을 증명하세요.`,
      en: String.raw`For \(n \ge 2\) let \(f_n(x) = \sum \frac{1}{q}\,\mathrm{tri}(n^3(x - p/q))\), summed over reduced fractions with \(1 \le q \le n\), \(0 \le p \le q\), \(\gcd(p,q) = 1\), where \(\mathrm{tri}(t) = \max(0, 1 - |t|)\). Prove each \(f_n\) is continuous on \([0, 1]\) and converges pointwise to Thomae's function \(T\) (\(1/q\) at reduced \(p/q\), \(0\) at irrationals, \(T(0) = T(1) = 1\)): \(f_n(x) \to T(x)\) for every \(x\).`,
    },
    display: [
      String.raw`f_n(x) = \sum_{\substack{1 \le q \le n \\ 0 \le p \le q \\ \gcd(p,q)=1}} \frac{1}{q}\,\mathrm{tri}\!\left(n^3\left(x - \tfrac{p}{q}\right)\right)`,
      String.raw`\text{tent width } \frac{2}{n^3} < \frac{1}{n(n-1)} \le \text{ spacing of reduced fractions} \;\Longrightarrow\; \text{disjoint tents}`,
    ],
    preset: { N: 12 },
    presetCaption: {
      ko: String.raw`\(N = 12\): 47개의 텐트가 서로 겹치지 않습니다. \(f_{12}(1/2) = 0.5\), \(f_{12}(\sqrt{2}/2) = 0\), \(f_{12}(1/3) = 1/3\) — 탐침점에서 이미 Thomae 값과 정확히 일치합니다. 아래 증명이 이 점별수렴의 기계입니다.`,
      en: String.raw`\(N = 12\): 47 pairwise disjoint tents. \(f_{12}(1/2) = 0.5\), \(f_{12}(\sqrt{2}/2) = 0\), \(f_{12}(1/3) = 1/3\) — the probes already match Thomae exactly. The proof below is the machine behind this pointwise convergence.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 합이 기약분수에 대해서만 취해지는 이유를 분명히 합니다. 모든 순서쌍 \((p, q)\)에 대해 합하면 같은 유리수가 여러 번 세어집니다 (\(1/2 = 2/4 = 3/6 = \cdots\)). 그러면 \(x = 1/2\)에서 높이가 \(1/2 + 1/4 + 1/6 + \cdots\)로 쌓여 발산하므로 Thomae 함수로 수렴할 수 없습니다. 기약분수만 취하면 각 유리수가 정확히 한 번씩 등장합니다.`,
          en: String.raw`First, why the sum is over reduced fractions only. Summing over all pairs \((p, q)\) counts each rational many times (\(1/2 = 2/4 = 3/6 = \cdots\)): at \(x = 1/2\) the stacked heights \(1/2 + 1/4 + 1/6 + \cdots\) would diverge, so the sum could never converge to Thomae. With reduced fractions each rational appears exactly once.`,
        },
      },
      {
        text: {
          ko: String.raw`각 텐트 \(x \mapsto \mathrm{tri}(n^3(x - p/q))\)는 연속함수들의 합성이므로 연속이고, 합은 유한합(항이 최대 \(\sum_{q \le n}(q+1)\)개)이므로 \(f_n\)은 연속입니다. 또한 \(f_n \ge 0\)입니다.`,
          en: String.raw`Each tent \(x \mapsto \mathrm{tri}(n^3(x - p/q))\) is continuous (a composition of continuous maps), and the sum is finite (at most \(\sum_{q \le n}(q+1)\) terms), so \(f_n\) is continuous. Also \(f_n \ge 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`텐트들은 서로 겹치지 않습니다. 분모가 \(\le n\)인 서로 다른 기약분수 \(p/q \ne r/s\)에 대해 \(\left|\frac{p}{q} - \frac{r}{s}\right| = \frac{|ps - qr|}{qs} \ge \frac{1}{qs}\)입니다. \(qs \le n(n-1)\)이면 이는 \(\ge 1/(n(n-1))\)이고, \(qs = n^2\)이면 \(q = s = n\)이므로 \(|ps - qr| = n|p - r| \ge n\)이어서 몫은 \(\ge 1/n \ge 1/(n(n-1))\)입니다. 따라서 간격은 항상 \(\ge 1/(n(n-1))\)입니다.`,
          en: String.raw`The tents are pairwise disjoint. For distinct reduced fractions \(p/q \ne r/s\) with denominators \(\le n\), \(\left|\frac{p}{q} - \frac{r}{s}\right| = \frac{|ps - qr|}{qs} \ge \frac{1}{qs}\). If \(qs \le n(n-1)\) this is \(\ge 1/(n(n-1))\); if \(qs = n^2\) then \(q = s = n\), so \(|ps - qr| = n|p - r| \ge n\) and the quotient is \(\ge 1/n \ge 1/(n(n-1))\). Hence the spacing is always \(\ge 1/(n(n-1))\).`,
        },
      },
      {
        text: {
          ko: String.raw`텐트의 받침(support) 너비는 \(2/n^3\)인데, \(2/n^3 < 1/(n(n-1))\)입니다 (\(2(n-1) < n^2\), 즉 \((n-1)^2 + 1 > 0\)). 따라서 두 텐트의 받침이 겹칠 수 없고, 각 점 \(x\)에서는 최대 하나의 텐트만 0이 아닙니다.`,
          en: String.raw`Each tent's support has width \(2/n^3\), and \(2/n^3 < 1/(n(n-1))\) (since \(2(n-1) < n^2\), i.e. \((n-1)^2 + 1 > 0\)). So no two tent supports overlap: at each \(x\) at most one tent is nonzero.`,
        },
      },
      {
        text: {
          ko: String.raw`유리수 \(x = a/b\) (기약분수, \(0 \le a \le b\))인 경우: \(n \ge b\)이면 \((a, b)\) 텐트가 \(\frac{1}{b}\,\mathrm{tri}(0) = 1/b\)를 기여합니다. 다른 기약분수 \(p/q\) (\(q \le n\))와의 거리는 \(\ge 1/(n(n-1)) > 1/n^3\)이므로 그 텐트는 \(x\)에서 0입니다. 따라서 \(f_n(a/b) = 1/b = T(a/b)\) — \(n \ge b\)부터 영원히 정확합니다.`,
          en: String.raw`For rational \(x = a/b\) in lowest terms (\(0 \le a \le b\)): if \(n \ge b\), the tent at \((a, b)\) contributes \(\frac{1}{b}\,\mathrm{tri}(0) = 1/b\). Every other reduced \(p/q\) (\(q \le n\)) is at distance \(\ge 1/(n(n-1)) > 1/n^3\) from \(x\), so its tent vanishes at \(x\). Hence \(f_n(a/b) = 1/b = T(a/b)\) — exact from \(n \ge b\) onward.`,
        },
      },
      {
        text: {
          ko: String.raw`무리수 \(x\)인 경우: \(\varepsilon > 0\)에 대해 \(1/Q_0 < \varepsilon\)인 정수 \(Q_0 \ge 1\)을 택합니다. 분모 \(\le Q_0\)인 기약분수는 \([0, 1]\) 안에 유한개뿐이고 모두 \(x\)와 다르므로, \(c := \min|x - p/q| > 0\)입니다. \(n^3 c > 1\)인 \(n\)에 대해 분모 \(\le Q_0\)인 텐트들은 \(x\)를 빗나가고, 나머지 텐트들의 높이는 \(\le 1/(Q_0+1) < \varepsilon\)이며, \(x\)에서 0이 아닌 텐트는 최대 하나뿐입니다. 따라서 \(0 \le f_n(x) < \varepsilon\) — 즉 \(f_n(x) \to 0 = T(x)\)입니다.`,
          en: String.raw`For irrational \(x\): given \(\varepsilon > 0\), pick an integer \(Q_0 \ge 1\) with \(1/Q_0 < \varepsilon\). The reduced rationals in \([0, 1]\) with denominator \(\le Q_0\) are finitely many, all different from \(x\), so \(c := \min|x - p/q| > 0\). For \(n\) with \(n^3 c > 1\), the tents with denominator \(\le Q_0\) miss \(x\); every other tent has height \(\le 1/(Q_0+1) < \varepsilon\); and at most one tent is nonzero at \(x\). Hence \(0 \le f_n(x) < \varepsilon\) — i.e. \(f_n(x) \to 0 = T(x)\).`,
        },
      },
    ],
  },
  {
    id: 'thomae-continuity',
    statement: {
      ko: String.raw`Thomae 함수 \(T\)가 모든 유리수에서 불연속이고 모든 무리수에서 연속임을 증명하세요. 즉 \(T\)의 연속점 집합은 무리수 전체 — 조밀한 \(G_\delta\) 집합 — 입니다.`,
      en: String.raw`Prove Thomae's function \(T\) is discontinuous at every rational and continuous at every irrational. That is, the continuity set of \(T\) is exactly the irrationals — a dense \(G_\delta\).`,
    },
    display: [
      String.raw`T(x) = \begin{cases} 1/q & x = p/q \text{ in lowest terms} \\ 0 & x \text{ irrational} \end{cases}`,
      String.raw`\{x : T \text{ continuous at } x\} = \mathbb{R} \setminus \mathbb{Q} = \bigcap_{q=1}^{\infty} \bigcap_{p \in \mathbb{Z}} \left(\mathbb{R} \setminus \left\{\tfrac{p}{q}\right\}\right)`,
    ],
    preset: { N: 5 },
    presetCaption: {
      ko: String.raw`\(N = 5\): \(f_5\)는 11개의 텐트로 이루어진 연속함수입니다. 극한 \(T\)는 유리수 \(1/2, 1/3\)에서는 봉우리(\(0.5, 1/3\))를 세우지만 무리수에서는 \(0\)으로 가라앉습니다 — 아래 증명이 이 갈라짐의 이유입니다.`,
      en: String.raw`\(N = 5\): \(f_5\) is continuous, built from 11 tents. The limit \(T\) spikes (\(0.5, 1/3\)) at the rationals \(1/2, 1/3\) but sinks to \(0\) at irrationals — the proof below is why the split happens.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`유리수 \(r = a/b\) (기약분수)에서는 \(T(r) = 1/b > 0\)입니다. 무리수는 조밀하므로 \(r\)로 수렴하는 무리수열 \(x_k \to r\)이 있고, \(T(x_k) = 0 \not\to 1/b = T(r)\)입니다. 따라서 \(T\)는 \(r\)에서 불연속입니다.`,
          en: String.raw`At a rational \(r = a/b\) in lowest terms, \(T(r) = 1/b > 0\). The irrationals are dense, so there is a sequence of irrationals \(x_k \to r\) with \(T(x_k) = 0 \not\to 1/b = T(r)\). Hence \(T\) is discontinuous at \(r\).`,
        },
      },
      {
        text: {
          ko: String.raw`무리수 \(x_0\)에서는 \(T(x_0) = 0\)입니다. \(\varepsilon > 0\)에 대해 \(M > 1/\varepsilon\)인 정수를 택합니다. \(1/b \ge \varepsilon\)인 유리수, 즉 분모 \(b \le M\)인 유리수는 구간 \([x_0 - 1, x_0 + 1]\) 안에 유한개뿐입니다. \(\delta\)를 그 유한집합에서 \(x_0\)까지의 최소 거리라 하면 (\(x_0\)가 무리수이므로 \(\delta > 0\)), \(|x - x_0| < \delta\)인 모든 \(x\)에 대해: \(x\)가 유리수이면 분모가 \(M\)보다 크므로 \(T(x) < \varepsilon\)이고, 무리수이면 \(T(x) = 0\)입니다. 즉 \(|T(x) - T(x_0)| < \varepsilon\) — \(T\)는 \(x_0\)에서 연속입니다.`,
          en: String.raw`At an irrational \(x_0\), \(T(x_0) = 0\). Given \(\varepsilon > 0\), pick an integer \(M > 1/\varepsilon\). The rationals with \(1/b \ge \varepsilon\), i.e. denominator \(b \le M\), are finitely many in \([x_0 - 1, x_0 + 1]\). Let \(\delta\) be the minimum distance from \(x_0\) to this finite set (\(\delta > 0\) since \(x_0\) is irrational). Then for \(|x - x_0| < \delta\): if \(x\) is rational its denominator exceeds \(M\), so \(T(x) < \varepsilon\); if irrational, \(T(x) = 0\). Thus \(|T(x) - T(x_0)| < \varepsilon\) — \(T\) is continuous at \(x_0\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 연속점 집합은 무리수 전체 \(\mathbb{R} \setminus \mathbb{Q}\)입니다. 각 유리수 \(\{p/q\}\)는 닫힌집합이므로 그 여집합 \(\mathbb{R} \setminus \{p/q\}\)는 열린 조밀집합입니다. 고정된 \(q\)에 대해 모든 \(p\)를 제거해야 하므로 교집합을 취합니다: \(\mathbb{R} \setminus \mathbb{Q} = \bigcap_{q \ge 1}\bigcap_{p \in \mathbb{Z}}(\mathbb{R} \setminus \{p/q\})\) — 순서쌍 \((p, q)\)가 가산개이므로 이는 열린집합들의 가산교집합, 즉 \(G_\delta\)입니다. 무리수는 조밀하므로 이는 조밀한 \(G_\delta\)입니다.`,
          en: String.raw`Hence the continuity set is exactly the irrationals \(\mathbb{R} \setminus \mathbb{Q}\). Each singleton \(\{p/q\}\) is closed, so its complement \(\mathbb{R} \setminus \{p/q\}\) is open and dense. For fixed \(q\) every \(p\) must be removed, so the inner operation is an intersection: \(\mathbb{R} \setminus \mathbb{Q} = \bigcap_{q \ge 1}\bigcap_{p \in \mathbb{Z}}(\mathbb{R} \setminus \{p/q\})\) — the pairs \((p, q)\) are countable, so this is a countable intersection of open sets, a \(G_\delta\). The irrationals are dense, so it is a dense \(G_\delta\).`,
        },
      },
    ],
  },
  {
    id: 'baire-one-theorem',
    statement: {
      ko: String.raw`\(f: \mathbb{R} \to \mathbb{R}\)가 Baire 1급 함수(연속함수열의 점별 극한)라고 하세요. 진동(oscillation) \(\omega_f(x) = \inf\{\mathrm{diam}\,f(U) : U \ni x \text{인 근방}\}\)에 대해 각 집합 \(\{x : \omega_f(x) < 1/k\}\)가 열린 조밀집합임을 증명하고, Baire 카테고리 정리로부터 \(f\)의 연속점 집합이 조밀한 \(G_\delta\)를 포함함을 결론지으세요.`,
      en: String.raw`Let \(f: \mathbb{R} \to \mathbb{R}\) be Baire class 1 (a pointwise limit of continuous functions). For the oscillation \(\omega_f(x) = \inf\{\mathrm{diam}\,f(U) : U \text{ a neighborhood of } x\}\), prove each set \(\{x : \omega_f(x) < 1/k\}\) is open and dense, and conclude via the Baire category theorem that the continuity set of \(f\) contains a dense \(G_\delta\).`,
    },
    display: [
      String.raw`\omega_f(x) = \inf_{U \ni x} \mathrm{diam}\,f(U), \qquad \omega_f(x) = 0 \iff f \text{ continuous at } x`,
      String.raw`\{x : f \text{ continuous at } x\} \supseteq \bigcap_{k=1}^{\infty} \left\{x : \omega_f(x) < \tfrac{1}{k}\right\}, \text{ a dense } G_\delta`,
    ],
    preset: { N: 5 },
    presetCaption: {
      ko: String.raw`\(N = 5\): Thomae 함수는 Baire 1급이면서 연속이 아닙니다 — 그래도 연속점(무리수)이 조밀한 \(G_\delta\)를 이룹니다. 아래 증명은 이것이 모든 Baire 1급 함수에 대해 성립함을 보입니다.`,
      en: String.raw`\(N = 5\): Thomae's function is Baire-1 yet discontinuous — but its continuity points (the irrationals) still form a dense \(G_\delta\). The proof below shows this holds for every Baire-1 function.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 \(\omega_f(x) = 0\)가 \(x\)에서의 연속성과 동치임을 확인합니다. (\(\Rightarrow\)) \(\omega_f(x) = 0\)이면 모든 \(\varepsilon > 0\)에 대해 \(\mathrm{diam}\,f(U) < \varepsilon\)인 근방 \(U\)가 있어, \(y \in U\)일 때 \(|f(y) - f(x)| \le \mathrm{diam}\,f(U) < \varepsilon\)입니다. (\(\Leftarrow\)) \(f\)가 \(x\)에서 연속이면 모든 \(\varepsilon > 0\)에 대해 \(f(U) \subseteq (f(x) - \varepsilon, f(x) + \varepsilon)\)인 근방 \(U\)가 있어 \(\mathrm{diam}\,f(U) \le 2\varepsilon\), 즉 \(\omega_f(x) \le 2\varepsilon\)입니다. \(\varepsilon\)이 임의이므로 \(\omega_f(x) = 0\)입니다.`,
          en: String.raw`First, \(\omega_f(x) = 0\) iff \(f\) is continuous at \(x\). (\(\Rightarrow\)) If \(\omega_f(x) = 0\), every \(\varepsilon > 0\) admits a neighborhood \(U\) with \(\mathrm{diam}\,f(U) < \varepsilon\), so \(|f(y) - f(x)| \le \mathrm{diam}\,f(U) < \varepsilon\) for \(y \in U\). (\(\Leftarrow\)) If \(f\) is continuous at \(x\), every \(\varepsilon > 0\) admits a neighborhood \(U\) with \(f(U) \subseteq (f(x) - \varepsilon, f(x) + \varepsilon)\), so \(\mathrm{diam}\,f(U) \le 2\varepsilon\) and \(\omega_f(x) \le 2\varepsilon\); \(\varepsilon\) arbitrary gives \(\omega_f(x) = 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\{x : \omega_f(x) < 1/k\}\)는 열려 있습니다: \(\omega_f(x_0) < c < 1/k\)이면 \(\mathrm{diam}\,f(U) < c\)인 근방 \(U\)가 존재하고, 모든 \(x \in U\)에 대해 \(U\) 자체가 \(x\)의 근방이므로 \(\omega_f(x) \le \mathrm{diam}\,f(U) < c < 1/k\)입니다. 즉 \(U \subseteq \{\omega_f < 1/k\}\)입니다.`,
          en: String.raw`\(\{x : \omega_f(x) < 1/k\}\) is open: if \(\omega_f(x_0) < c < 1/k\), some neighborhood \(U\) has \(\mathrm{diam}\,f(U) < c\); for every \(x \in U\), \(U\) is itself a neighborhood of \(x\), so \(\omega_f(x) \le \mathrm{diam}\,f(U) < c < 1/k\). Thus \(U \subseteq \{\omega_f < 1/k\}\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 조밀성을 보입니다. \(f_n \to f\)를 점별수렴하는 연속함수열이라 하세요. \(\mathbb{R}\)을 길이 \(< 1/(2k)\)인 닫힌구간들 \(V_j\) (\(j \in \mathbb{Z}\))로 덮되, 그 내부들도 \(\mathbb{R}\)을 덮도록 합니다 (예: \(V_j = [\frac{j}{8k} - \frac{1}{8k}, \frac{j}{8k} + \frac{1}{8k}]\)). 비어 있지 않은 열린집합 \(U_0\)를 고정합니다. 각 \(x \in U_0\)에 대해 \(f(x)\)는 어떤 \(\mathrm{int}(V_j)\)에 속하고, \(f_m(x) \to f(x)\)이므로 \(m \ge n\)일 때 \(f_m(x) \in V_j\)인 \(n\)이 존재합니다. 따라서 \(U_0 = \bigcup_{n,j} H_{n,j}\)입니다. 여기서 \(H_{n,j} = \{x \in U_0 : m \ge n \Rightarrow f_m(x) \in V_j\}\)는 \(U_0\)에서 상대적으로 닫힌집합입니다 (\(f_m\) 연속, \(V_j\) 닫힘).`,
          en: String.raw`Now density. Let \(f_n \to f\) pointwise with \(f_n\) continuous. Cover \(\mathbb{R}\) by closed intervals \(V_j\) (\(j \in \mathbb{Z}\)) of length \(< 1/(2k)\) whose interiors also cover \(\mathbb{R}\) (e.g. \(V_j = [\frac{j}{8k} - \frac{1}{8k}, \frac{j}{8k} + \frac{1}{8k}]\)). Fix a nonempty open \(U_0\). For each \(x \in U_0\), \(f(x)\) lies in some \(\mathrm{int}(V_j)\), and since \(f_m(x) \to f(x)\) there is \(n\) with \(f_m(x) \in V_j\) for all \(m \ge n\). Hence \(U_0 = \bigcup_{n,j} H_{n,j}\), where \(H_{n,j} = \{x \in U_0 : f_m(x) \in V_j \ \forall m \ge n\}\) is relatively closed in \(U_0\) (\(f_m\) continuous, \(V_j\) closed).`,
        },
      },
      {
        text: {
          ko: String.raw`\(U_0\) 자체는 완비가 아니므로 Baire 정리를 \(U_0\)에 직접 적용할 수는 없습니다 — 대신 닫힌공으로 제한합니다. \(U_0\)가 열려 있고 비어 있지 않으므로 \(\overline{B}(x_0, r) \subseteq U_0\)인 닫힌공이 있고, \(\overline{B}(x_0, r)\)는 완비입니다. \(\overline{B}(x_0, r) = \bigcup_{n,j} (H_{n,j} \cap \overline{B}(x_0, r))\)이고 각 \(H_{n,j} \cap \overline{B}(x_0, r)\)는 이 완비공간에서 닫혀 있으므로, Baire 정리에 의해 어떤 \(H_{n_0,j_0} \cap \overline{B}(x_0, r)\)는 \(\overline{B}(x_0, r)\)에서 상대내부가 비어 있지 않습니다. 열린공 \(B(x_0, r)\)와 교차시키면 비어 있지 않은 열린집합 \(W \subseteq H_{n_0,j_0}\) (\(W \subseteq U_0\))를 얻습니다 (상대내부를 이루는 열린집합은 \(\overline{B}(x_0, r)\)와 만나므로 그 내부와도 만납니다). \(y \in W\)에 대해 \(f_m(y) \in V_{j_0}\) (\(m \ge n_0\))이고 \(V_{j_0}\)가 닫혔으므로 극한 \(f(y) \in V_{j_0}\)입니다. 즉 \(f(W) \subseteq V_{j_0}\)이므로 \(\mathrm{diam}\,f(W) < 1/(2k)\)입니다. \(W\)는 그 안의 각 점 \(x\)의 근방이므로 \(\omega_f(x) \le \mathrm{diam}\,f(W) < 1/k\)입니다. 따라서 \(W \subseteq U_0 \cap \{\omega_f < 1/k\} \ne \varnothing\) — \(\{\omega_f < 1/k\}\)는 조밀합니다.`,
          en: String.raw`\(U_0\) itself is not complete, so Baire's theorem cannot be applied to \(U_0\) directly — restrict to a closed ball instead. Since \(U_0\) is open and nonempty, some closed ball \(\overline{B}(x_0, r) \subseteq U_0\) exists, and \(\overline{B}(x_0, r)\) is complete. Now \(\overline{B}(x_0, r) = \bigcup_{n,j} (H_{n,j} \cap \overline{B}(x_0, r))\) with each \(H_{n,j} \cap \overline{B}(x_0, r)\) closed in this complete space, so by Baire's theorem some \(H_{n_0,j_0} \cap \overline{B}(x_0, r)\) has nonempty relative interior in \(\overline{B}(x_0, r)\). Intersecting with the open ball \(B(x_0, r)\) gives a nonempty open \(W \subseteq H_{n_0,j_0}\) with \(W \subseteq U_0\) (an open set meeting \(\overline{B}(x_0, r)\) in a relative-interior piece also meets its interior). For \(y \in W\), \(f_m(y) \in V_{j_0}\) for all \(m \ge n_0\), and \(V_{j_0}\) closed gives \(f(y) \in V_{j_0}\). So \(f(W) \subseteq V_{j_0}\) and \(\mathrm{diam}\,f(W) < 1/(2k)\). Since \(W\) is a neighborhood of each of its points \(x\), \(\omega_f(x) \le \mathrm{diam}\,f(W) < 1/k\). Thus \(W \subseteq U_0 \cap \{\omega_f < 1/k\} \ne \varnothing\) — \(\{\omega_f < 1/k\}\) is dense.`,
        },
      },
      {
        text: {
          ko: String.raw`각 \(\{\omega_f < 1/k\}\)가 열린 조밀집합이므로, Baire 카테고리 정리에 의해 \(G := \bigcap_{k=1}^{\infty}\{\omega_f < 1/k\}\)는 조밀한 \(G_\delta\)입니다. 첫 단계에서 \(G \subseteq \{\omega_f = 0\} = \{f\)의 연속점\(\}\)이므로, \(f\)의 연속점 집합은 조밀한 \(G_\delta\)를 포함합니다. ∎`,
          en: String.raw`Each \(\{\omega_f < 1/k\}\) is open and dense, so by the Baire category theorem \(G := \bigcap_{k=1}^{\infty}\{\omega_f < 1/k\}\) is a dense \(G_\delta\). By the first step, \(G \subseteq \{\omega_f = 0\} =\) the continuity set of \(f\), so the continuity set of \(f\) contains a dense \(G_\delta\). ∎`,
        },
      },
    ],
  },
];
