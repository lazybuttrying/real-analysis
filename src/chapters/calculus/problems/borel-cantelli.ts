import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Borel-Cantelli scene
 * (E_n = [0, 1/n^2] summable vs cycling dyadic intervals nonsummable).
 * Imports nothing except types. Every number below was verified against
 * the model (tests/borel-cantelli.test.ts): sum_{k<=20} 1/k^2 = 1.5962...,
 * sum_{k<=40} 1/k^2 = 1.6202..., pi^2/6 = 1.6449...; the first 31
 * nonsummable sets are exactly dyadic levels 0..4 with total length 5.
 */
export const borelCantelliProblems: readonly ProblemMeta[] = [
  {
    id: 'bc1-example',
    statement: {
      ko: String.raw`\(E_n = [0, \frac{1}{n^2}]\) (\(n \ge 1\))라 하세요.

\(\limsup_{n \to \infty} E_n = \{0\}\)임을 직접 확인하고, 부등식 \(m(\limsup E_n) \le \sum_{k \ge N} m(E_k)\)를 이용해 \(m(\limsup E_n) = 0\)임을 완전히 증명하세요 — 이 예에 대한 Borel–Cantelli 제1정리입니다.`,
      en: String.raw`Let \(E_n = [0, \frac{1}{n^2}]\) (\(n \ge 1\)).

Verify directly that \(\limsup_{n \to \infty} E_n = \{0\}\), and prove completely, via the bound \(m(\limsup E_n) \le \sum_{k \ge N} m(E_k)\), that \(m(\limsup E_n) = 0\) — the first Borel–Cantelli lemma for this example.`,
    },
    display: [
      String.raw`\limsup_{n \to \infty} E_n = \bigcap_{N \ge 1}\bigcup_{k \ge N} E_k = \{0\}`,
      String.raw`m(\limsup E_n) \le \sum_{k \ge N} \frac{1}{k^2} \;\xrightarrow[N \to \infty]{}\; 0`,
    ],
    preset: { mode: 'summable', n: 20 },
    presetCaption: {
      ko: String.raw`합 수렴 모드, \(n = 20\): 누적 길이 \(\sum_{k \le 20} \frac{1}{k^2} \approx 1.5962\) (\(\frac{\pi^2}{6} \approx 1.6449\) 중), 빨간 limsup 근사는 \([0, 0.01]\) 근처로만 몰립니다.`,
      en: String.raw`Summable mode, \(n = 20\): cumulative length \(\sum_{k \le 20} \frac{1}{k^2} \approx 1.5962\) (of \(\frac{\pi^2}{6} \approx 1.6449\)); the red limsup approximation piles up near \([0, 0.01]\) only.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\limsup_{n \to \infty} E_n = \bigcap_{N \ge 1} \bigcup_{k \ge N} E_k\)는 "무한히 많은 \(E_k\)에 속하는 점"들의 집합입니다.

\(E_k = [0, \frac{1}{k^2}]\)는 감소수열이므로 \(\bigcup_{k \ge N} E_k = E_N = [0, \frac{1}{N^2}]\)이고, \(\bigcap_{N \ge 1} [0, \frac{1}{N^2}] = \{0\}\)입니다 (0이 아닌 점은 \(\frac{1}{N^2}\)보다 작아지는 \(N\)에서 탈락합니다).

따라서 \(\limsup E_n = \{0\}\) — 측도 0인 한 점입니다.`,
          en: String.raw`\(\limsup_{n \to \infty} E_n = \bigcap_{N \ge 1} \bigcup_{k \ge N} E_k\) is the set of points belonging to infinitely many \(E_k\).

Since \(E_k = [0, \frac{1}{k^2}]\) is decreasing, \(\bigcup_{k \ge N} E_k = E_N = [0, \frac{1}{N^2}]\), and \(\bigcap_{N \ge 1} [0, \frac{1}{N^2}] = \{0\}\) (any nonzero point is dropped once \(\frac{1}{N^2}\) falls below it).

Hence \(\limsup E_n = \{0\}\) — a single point of measure 0.`,
        },
      },
      {
        text: {
          ko: String.raw`이제 측도 부등식을 증명합니다.

각 \(N\)에 대해 \(\limsup E_n \subseteq \bigcup_{k \ge N} E_k\)이므로, 가산 열가법성(countable subadditivity)에 의해 \(m(\limsup E_n) \le \sum_{k \ge N} m(E_k) = \sum_{k \ge N} \frac{1}{k^2}\)입니다.

이 부등식은 모든 \(N\)에 대해 성립합니다.`,
          en: String.raw`Now the measure bound.

For each \(N\), \(\limsup E_n \subseteq \bigcup_{k \ge N} E_k\), so by countable subadditivity \(m(\limsup E_n) \le \sum_{k \ge N} m(E_k) = \sum_{k \ge N} \frac{1}{k^2}\).

This holds for every \(N\).`,
        },
      },
      {
        text: {
          ko: String.raw`먼저 \(\sum_{k \ge 1} \frac{1}{k^2}\)의 수렴을 자체적으로 확인합니다: \(k \ge 2\)이면 \(\frac{1}{k^2} \le \frac{1}{k(k-1)} = \frac{1}{k-1} - \frac{1}{k}\)이므로 부분합은 망원합으로 \(\sum_{k=1}^{N} \frac{1}{k^2} \le 1 + \sum_{k=2}^{N} \left(\frac{1}{k-1} - \frac{1}{k}\right) = 2 - \frac{1}{N} \le 2\)입니다.

따라서 급수는 수렴합니다 (값은 \(\frac{\pi^2}{6}\))이고 꼬리합은 0으로 갑니다: \(\varepsilon > 0\)마다 \(\sum_{k \ge N} \frac{1}{k^2} < \varepsilon\)인 \(N\)이 있습니다.

따라서 \(m(\limsup E_n) < \varepsilon\)이 모든 \(\varepsilon > 0\)에 대해 성립하므로 \(m(\limsup E_n) = 0\)입니다. 직접 계산한 \(\{0\}\)과 일치합니다 — 이것이 Borel–Cantelli 제1정리의 이 예 버전입니다.`,
          en: String.raw`First ground the convergence of \(\sum_{k \ge 1} \frac{1}{k^2}\) self-containedly: for \(k \ge 2\), \(\frac{1}{k^2} \le \frac{1}{k(k-1)} = \frac{1}{k-1} - \frac{1}{k}\), so the partial sums telescope: \(\sum_{k=1}^{N} \frac{1}{k^2} \le 1 + \sum_{k=2}^{N} \left(\frac{1}{k-1} - \frac{1}{k}\right) = 2 - \frac{1}{N} \le 2\).

Hence the series converges (its value is \(\frac{\pi^2}{6}\)) and the tail sums vanish: for every \(\varepsilon > 0\) there is \(N\) with \(\sum_{k \ge N} \frac{1}{k^2} < \varepsilon\).

Hence \(m(\limsup E_n) < \varepsilon\) for every \(\varepsilon > 0\), so \(m(\limsup E_n) = 0\) — matching the direct computation \(\{0\}\). That is the first Borel–Cantelli lemma on this example.`,
        },
      },
    ],
  },
  {
    id: 'bc1-general',
    statement: {
      ko: String.raw`측도공간 \((X, m)\)에서 \(\sum_{n \ge 1} m(E_n) < \infty\)인 임의의 가측집합 수열 \(\{E_n\}\)에 대해 \(m(\limsup_{n \to \infty} E_n) = 0\)임을 완전히 증명하세요 (Borel–Cantelli 제1정리).

독립성은 필요 없습니다.`,
      en: String.raw`In a measure space \((X, m)\), prove completely that for any sequence of measurable sets \(\{E_n\}\) with \(\sum_{n \ge 1} m(E_n) < \infty\), \(m(\limsup_{n \to \infty} E_n) = 0\) (the first Borel–Cantelli lemma).

No independence is needed.`,
    },
    display: [
      String.raw`\limsup_{n \to \infty} E_n = \bigcap_{N \ge 1}\bigcup_{k \ge N} E_k \subseteq \bigcup_{k \ge N} E_k`,
      String.raw`m(\limsup E_n) \le \sum_{k=N}^{\infty} m(E_k) \;\xrightarrow[N \to \infty]{}\; 0`,
    ],
    preset: { mode: 'summable', n: 40 },
    presetCaption: {
      ko: String.raw`합 수렴 모드, \(n = 40\): 누적 길이 \(\approx 1.6202\)로 \(\frac{\pi^2}{6} \approx 1.6449\)에 더 다가갑니다 — 꼬리 \(\sum_{k > 40} \frac{1}{k^2} < \frac{1}{40} = 0.025\)가 limsup 측도의 상계입니다.`,
      en: String.raw`Summable mode, \(n = 40\): cumulative length \(\approx 1.6202\), closer to \(\frac{\pi^2}{6} \approx 1.6449\) — the tail \(\sum_{k > 40} \frac{1}{k^2} < \frac{1}{40} = 0.025\) bounds the limsup measure.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\limsup_{n \to \infty} E_n = \bigcap_{N \ge 1} A_N\)이라 쓰세요. 여기서 \(A_N = \bigcup_{k \ge N} E_k\)는 감소수열입니다 (\(N\)이 커지면 합집합에 들어가는 항이 줄어듭니다).

정의에서 바로 \(\limsup E_n \subseteq A_N\)이 모든 \(N\)에 대해 성립합니다.`,
          en: String.raw`Write \(\limsup_{n \to \infty} E_n = \bigcap_{N \ge 1} A_N\) where \(A_N = \bigcup_{k \ge N} E_k\) is a decreasing sequence (larger \(N\) means fewer terms in the union). By definition, \(\limsup E_n \subseteq A_N\) for every \(N\).`,
        },
      },
      {
        text: {
          ko: String.raw`단조성과 가산 열가법성에 의해 \(m(\limsup E_n) \le m(A_N) \le \sum_{k \ge N} m(E_k)\)입니다. 여기서 두 번째 부등식은 가산 개의 집합의 합집합의 측도가 각 측도의 합을 넘지 않는다는 것뿐입니다 — 서로소일 필요도, 독립일 필요도 없습니다.`,
          en: String.raw`By monotonicity and countable subadditivity, \(m(\limsup E_n) \le m(A_N) \le \sum_{k \ge N} m(E_k)\). The second inequality is just that the measure of a countable union never exceeds the sum of the measures — no disjointness, no independence needed.`,
        },
      },
      {
        text: {
          ko: String.raw`가정 \(\sum_{k \ge 1} m(E_k) < \infty\)에 의해 꼬리합 \(\sum_{k \ge N} m(E_k)\)는 \(N \to \infty\)에서 0으로 갑니다 (수렴 급수의 꼬리).

따라서 \(0 \le m(\limsup E_n) \le \sum_{k \ge N} m(E_k) \to 0\)이므로 \(m(\limsup E_n) = 0\)입니다.

증명 완료 — 이것이 Borel–Cantelli 제1정리이며, 문제 1의 예는 \(m(E_k) = 1/k^2\)인 특수한 경우입니다.`,
          en: String.raw`By the hypothesis \(\sum_{k \ge 1} m(E_k) < \infty\), the tail sums \(\sum_{k \ge N} m(E_k)\) tend to 0 as \(N \to \infty\) (tails of a convergent series).

Hence \(0 \le m(\limsup E_n) \le \sum_{k \ge N} m(E_k) \to 0\), so \(m(\limsup E_n) = 0\).

The proof is complete — this is the first Borel–Cantelli lemma, and problem 1's example is the special case \(m(E_k) = 1/k^2\).`,
        },
      },
    ],
  },
  {
    id: 'bc2-dice',
    statement: {
      ko: String.raw`주사위를 무한히 던져 \(E_n =\) "\(n\)번째 던짐이 6"이라 하세요.

각 \(E_n\)은 독립이고 \(P(E_n) = \frac16\), \(\sum P(E_n) = \infty\)입니다.

곱 \(\prod_{k=N}^{M}(1 - \frac16) = (\frac56)^{M-N+1} \to 0\) (\(M \to \infty\))을 엄밀히 증명하고, 이를 이용해 \(P(\limsup_{n \to \infty} E_n) = 1\)임을 완전히 보이세요 — 독립성 하의 Borel–Cantelli 제2정리입니다.`,
      en: String.raw`Toss a die forever and let \(E_n =\) "the \(n\)-th toss is a 6".

The \(E_n\) are independent with \(P(E_n) = \frac16\) and \(\sum P(E_n) = \infty\).

Prove rigorously that \(\prod_{k=N}^{M}(1 - \frac16) = (\frac56)^{M-N+1} \to 0\) (\(M \to \infty\)), and use it to show completely that \(P(\limsup_{n \to \infty} E_n) = 1\) — the second Borel–Cantelli lemma under independence.`,
    },
    display: [
      String.raw`P\!\left(\bigcap_{k=N}^{M} E_k^c\right) = \prod_{k=N}^{M}\left(1 - \tfrac16\right) = \left(\tfrac56\right)^{M-N+1} \to 0`,
      String.raw`P(\limsup E_n) = 1 - P\!\left(\bigcup_{N \ge 1}\bigcap_{k \ge N} E_k^c\right) = 1`,
    ],
    preset: { mode: 'nonsummable', n: 31 },
    presetCaption: {
      ko: String.raw`합 발산 모드, \(n = 31\): 처음 31개 집합은 dyadic 레벨 0~4 전체로 총 길이 \(5.00\) — 발산하며, 모든 점이 매 레벨마다 포함되므로 \(\limsup = [0, 1]\)입니다.`,
      en: String.raw`Nonsummable mode, \(n = 31\): the first 31 sets are exactly dyadic levels 0–4, total length \(5.00\) — diverging, and every point is covered at every level, so \(\limsup = [0, 1]\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 곱이 0으로 감을 엄밀히 보입니다. 독립성에 의해 \(P\left(\bigcap_{k=N}^{M} E_k^c\right) = \prod_{k=N}^{M} P(E_k^c) = \prod_{k=N}^{M} (1 - \frac16) = (\frac56)^{M-N+1}\)입니다.

로그를 취하면 \(\log\left((\frac56)^{M-N+1}\right) = (M-N+1)\,\log(\frac56)\)이고 \(\log(\frac56) < 0\)이므로 \(M \to \infty\)에서 \(-\infty\)로 갑니다.

따라서 \((\frac56)^{M-N+1} \to 0\)입니다 — "\(N\)번째부터 \(M\)번째까지 6이 한 번도 안 나올 확률"이 0으로 갑니다.`,
          en: String.raw`First, the product rigorously. By independence, \(P\left(\bigcap_{k=N}^{M} E_k^c\right) = \prod_{k=N}^{M} P(E_k^c) = \prod_{k=N}^{M} (1 - \frac16) = (\frac56)^{M-N+1}\).

Taking logs, \(\log\left((\frac56)^{M-N+1}\right) = (M-N+1)\,\log(\frac56)\), and since \(\log(\frac56) < 0\) this tends to \(-\infty\) as \(M \to \infty\).

Hence \((\frac56)^{M-N+1} \to 0\) — the probability of "no 6 from toss \(N\) through \(M\)" vanishes.`,
        },
      },
      {
        text: {
          ko: String.raw`이제 위에서의 측도 연속성(continuity from above)을 씁니다: \(P\)는 확률측도이므로 \(P \le 1 < \infty\) — 유한측도 가정이 성립합니다. 집합열 \(\bigcap_{k=N}^{M} E_k^c\)는 \(M\)에 대해 감소하므로 \(P\left(\bigcap_{k \ge N} E_k^c\right) = \lim_{M \to \infty} P\left(\bigcap_{k=N}^{M} E_k^c\right) = \lim_{M \to \infty} (\frac56)^{M-N+1} = 0\)입니다 — 모든 \(N\)에 대해 "\(N\)번째 이후로 6이 영원히 안 나온다"는 확률 0 사건입니다.`,
          en: String.raw`Now continuity of measure from above: \(P\) is a probability measure, so \(P \le 1 < \infty\) — the finite-measure hypothesis holds. The sets \(\bigcap_{k=N}^{M} E_k^c\) decrease in \(M\), so \(P\left(\bigcap_{k \ge N} E_k^c\right) = \lim_{M \to \infty} P\left(\bigcap_{k=N}^{M} E_k^c\right) = \lim_{M \to \infty} (\frac56)^{M-N+1} = 0\) — for every \(N\), "no 6 ever again from toss \(N\) on" is a probability-0 event.`,
        },
      },
      {
        text: {
          ko: String.raw`\((\limsup E_n)^c = \bigcup_{N \ge 1} \bigcap_{k \ge N} E_k^c\)이므로 (드모르간), 열가법성에 의해 \(P((\limsup E_n)^c) \le \sum_{N \ge 1} P\left(\bigcap_{k \ge N} E_k^c\right) = \sum_{N \ge 1} 0 = 0\)입니다.

따라서 \(P(\limsup E_n) = 1\): 6이 무한히 자주 나옵니다 (almost surely).

같은 논증은 일반적으로도 통합니다 — 독립이고 \(\sum p_n = \infty\)인 경우, 어떤 \(k\)에서 \(p_k = 1\)이면 \(E_k\)가 거의 확실하게 일어나므로 결론은 자명합니다; 남은 경우 \(p_k < 1\)로 가정하면 \(\log(1 - p_k)\)가 정의되고 \(\log(1 - p_k) \le -p_k\)에서 \(\sum_{k=N}^{M} \log(1-p_k) \le -\sum_{k=N}^{M} p_k \to -\infty\)이므로 곱이 0으로 갑니다. 이것이 Borel–Cantelli 제2정리입니다.`,
          en: String.raw`Since \((\limsup E_n)^c = \bigcup_{N \ge 1} \bigcap_{k \ge N} E_k^c\) (de Morgan), subadditivity gives \(P((\limsup E_n)^c) \le \sum_{N \ge 1} P\left(\bigcap_{k \ge N} E_k^c\right) = \sum_{N \ge 1} 0 = 0\).

Hence \(P(\limsup E_n) = 1\): a 6 occurs infinitely often, almost surely.

The same argument works in general — if the events are independent and \(\sum p_n = \infty\), first separate the degenerate case: if \(p_k = 1\) for some \(k\), then \(E_k\) occurs almost surely and the conclusion is trivial; otherwise assume \(p_k < 1\) for all \(k\), so \(\log(1 - p_k)\) is defined, and \(\log(1 - p_k) \le -p_k\) gives \(\sum_{k=N}^{M} \log(1-p_k) \le -\sum_{k=N}^{M} p_k \to -\infty\), so the product tends to 0. That is the second Borel–Cantelli lemma.`,
        },
      },
    ],
  },
];
