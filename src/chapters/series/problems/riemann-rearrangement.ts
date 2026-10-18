import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Riemann rearrangement scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/riemann-rearrangement.test.ts):
 *   target s = 1, greedy walk: S_1 = 1 (exact landing), S_2 = 4/3,
 *   S_3 = 5/6, S_4 = 31/30, S_5 = 47/60, S_6 = 389/420,
 *   S_7 = 1307/1260, S_8 = 1097/1260;
 *   crossing gaps: 0, 1/3, 1/6, 1/30, 13/60, 47/1260, 163/1260 —
 *   each at most the crossing term's magnitude;
 *   s = 1, N = 120: final sum 0.9967414472151209, error 0.0032585527848790763,
 *   78 positive takes, 42 negative takes.
 */
export const riemannRearrangementProblems: readonly ProblemMeta[] = [
  {
    id: 'both-diverge',
    statement: {
      ko: String.raw`실수 항 급수 \(\sum a_n\)이 조건수렴한다고 하자. \(p_n = \max(a_n, 0)\), \(q_n = \max(-a_n, 0)\)이라 두면 (0인 항은 무시해도 되므로 양항/음항 부분수열로 다시 번호를 매긴 것과 같다), \(\sum p_n = +\infty\)이고 \(\sum q_n = +\infty\)임을 증명하세요.`,
      en: String.raw`Let \(\sum a_n\) be a real series converging conditionally. With \(p_n = \max(a_n, 0)\) and \(q_n = \max(-a_n, 0)\) (zero terms are harmless, so this is the positive/negative subsequences re-indexed), prove \(\sum p_n = +\infty\) and \(\sum q_n = +\infty\).`,
    },
    display: [
      String.raw`a_n = p_n - q_n, \qquad \lvert a_n \rvert = p_n + q_n`,
      String.raw`\sum p_n < \infty \ \Longrightarrow\ \sum q_n = \sum p_n - \sum a_n < \infty \ \Longrightarrow\ \sum \lvert a_n \rvert < \infty \quad \text{(contradiction)}`,
    ],
    preset: { target: 1.0, terms: 120 },
    presetCaption: {
      ko: String.raw`목표 \(s = 1\), \(N = 120\): \(S_{120} \approx 0.9967\), 오차 \(\approx 0.00326\) — 양항 78개·음항 42개를 썼고, 양쪽 블록이 영원히 반복됩니다 (아래 증명이 그 이유).`,
      en: String.raw`Target \(s = 1\), \(N = 120\): \(S_{120} \approx 0.9967\), error \(\approx 0.00326\) — 78 positive and 42 negative takes, and both blocks recur forever (the proof below is why).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`항별로 \(a_n = p_n - q_n\)이고 \(\lvert a_n \rvert = p_n + q_n\)입니다 (0인 항은 양쪽에 기여하지 않으므로 부분수열로 다시 번호를 매긴 것과 같습니다). 조건수렴 가정은 \(\sum (p_n - q_n)\)이 수렴하고 \(\sum (p_n + q_n)\)이 발산한다는 뜻입니다.`,
          en: String.raw`Termwise \(a_n = p_n - q_n\) and \(\lvert a_n \rvert = p_n + q_n\) (zero terms contribute nothing, so this is the positive/negative subsequences re-indexed). Conditional convergence means \(\sum (p_n - q_n)\) converges while \(\sum (p_n + q_n)\) diverges.`,
        },
      },
      {
        text: {
          ko: String.raw`\(\sum p_n < \infty\)이라고 가정합니다. \(\sum a_n = \sum (p_n - q_n)\)이 수렴하므로, \(q_n = p_n - (p_n - q_n)\)에서 \(\sum q_n = \sum p_n - \sum a_n\)은 수렴급수들의 차로 수렴합니다.`,
          en: String.raw`Suppose \(\sum p_n < \infty\). Since \(\sum a_n = \sum (p_n - q_n)\) converges, and \(q_n = p_n - (p_n - q_n)\), the series \(\sum q_n = \sum p_n - \sum a_n\) converges as a difference of convergent series.`,
        },
      },
      {
        text: {
          ko: String.raw`그러면 \(\sum \lvert a_n \rvert = \sum p_n + \sum q_n < \infty\) — 즉 \(\sum a_n\)이 절대수렴하게 되어, 조건수렴(절대수렴하지 않음) 가정에 모순입니다. 따라서 \(\sum p_n = +\infty\)입니다.`,
          en: String.raw`Then \(\sum \lvert a_n \rvert = \sum p_n + \sum q_n < \infty\) — so \(\sum a_n\) would converge absolutely, contradicting conditional convergence. Hence \(\sum p_n = +\infty\).`,
        },
      },
      {
        text: {
          ko: String.raw`대칭적으로: \(\sum q_n < \infty\)이면 \(p_n = q_n + (p_n - q_n)\)에서 \(\sum p_n = \sum q_n + \sum a_n\)이 수렴하고, 역시 \(\sum \lvert a_n \rvert < \infty\)가 되어 모순입니다. 따라서 \(\sum q_n = +\infty\)입니다. 직관: 조건수렴 급수는 "양의 무한대"와 "음의 무한대"를 둘 다 품고 있어, 재배열이 둘 사이를 오가며 어떤 목표든 맞출 수 있습니다.`,
          en: String.raw`Symmetrically: if \(\sum q_n < \infty\), then \(p_n = q_n + (p_n - q_n)\) gives \(\sum p_n = \sum q_n + \sum a_n\) convergent, again forcing \(\sum \lvert a_n \rvert < \infty\) — contradiction. So \(\sum q_n = +\infty\). The intuition: a conditionally convergent series harbors both "positive infinity" and "negative infinity", and a rearrangement can shuttle between them to hit any target.`,
        },
      },
    ],
  },
  {
    id: 'target-bracket',
    statement: {
      ko: String.raw`이 씬의 탐욕 걸음(greedy walk)으로 목표 \(s = 1\)을 노리세요. 처음 몇 개 블록이 끝난 뒤의 부분합 \(S_2, S_3, S_4, S_5, S_7, S_8\)을 직접 계산하고, 각 overshoot/undershoot이 그 경계를 넘게 한 항의 크기 이하임을 확인하세요.`,
      en: String.raw`Aim the scene's greedy walk at target \(s = 1\). Compute the partial sums \(S_2, S_3, S_4, S_5, S_7, S_8\) at the ends of the first few blocks by hand, and check that each overshoot/undershoot is at most the magnitude of the term that caused the crossing.`,
    },
    display: [
      String.raw`S_2 = \tfrac43,\ S_3 = \tfrac56,\ S_4 = \tfrac{31}{30},\ S_5 = \tfrac{47}{60},\ S_7 = \tfrac{1307}{1260},\ S_8 = \tfrac{1097}{1260}`,
      String.raw`\text{gaps: }\tfrac13,\ \tfrac16,\ \tfrac1{30},\ \tfrac{13}{60},\ \tfrac{47}{1260},\ \tfrac{163}{1260}\ \le\ \text{crossing term each time}`,
    ],
    preset: { target: 1.0, terms: 120 },
    presetCaption: {
      ko: String.raw`목표 \(s = 1\), \(N = 120\): 경계 간격이 \(\frac13 \to \frac16 \to \frac1{30} \to \frac{13}{60} \to \frac{47}{1260} \to \frac{163}{1260}\)으로 조여들며 \(S_{120} \approx 0.9967\), 오차 \(\approx 0.00326\).`,
      en: String.raw`Target \(s = 1\), \(N = 120\): the bracket tightens \(\frac13 \to \frac16 \to \frac1{30} \to \frac{13}{60} \to \frac{47}{1260} \to \frac{163}{1260}\), reaching \(S_{120} \approx 0.9967\) with error \(\approx 0.00326\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`규칙은 \(t \le s\)이면 다음 양항, \(t > s\)이면 다음 음항을 취하는 것입니다. \(s = 1\)에서 \(t_0 = 0\)이므로 첫 항은 양항: \(S_1 = 0 + p_1 = 1\) — 걸음이 목표에 정확히 착지합니다 (간격 0).`,
          en: String.raw`The rule: take the next positive term while \(t \le s\), the next negative term while \(t > s\). For \(s = 1\) with \(t_0 = 0\), the first take is positive: \(S_1 = 0 + p_1 = 1\) — the walk lands exactly on the target (gap 0).`,
        },
      },
      {
        text: {
          ko: String.raw`\(S_1 = 1 \le 1\)이므로 양항을 한 번 더: \(S_2 = 1 + p_2 = 1 + \frac13 = \frac43\) — 첫 양항 블록이 끝나고 overshoot은 \(\frac13 = p_2\)입니다 (걸음이 \(s\) 위에 정확히 서 있는 상태에서 위로 넘으면 등호가 성립; 아래 보조정리 참조). 이어서 \(S_3 = \frac43 - q_1 = \frac43 - \frac12 = \frac56\) — 첫 음항 블록, undershoot \(\frac16 < q_1 = \frac12\).`,
          en: String.raw`Since \(S_1 = 1 \le 1\), one more positive: \(S_2 = 1 + p_2 = 1 + \frac13 = \frac43\) — the first positive block ends with overshoot \(\frac13 = p_2\) (equality holds when crossing upward from exactly \(s\); see the lemma below). Then \(S_3 = \frac43 - q_1 = \frac43 - \frac12 = \frac56\) — the first negative block, undershoot \(\frac16 < q_1 = \frac12\).`,
        },
      },
      {
        text: {
          ko: String.raw`계속합니다: \(S_4 = \frac56 + p_3 = \frac56 + \frac15 = \frac{31}{30}\) (overshoot \(\frac1{30} < p_3 = \frac15\)), \(S_5 = \frac{31}{30} - q_2 = \frac{31}{30} - \frac14 = \frac{47}{60}\) (undershoot \(\frac{13}{60} < q_2 = \frac14\)). 다음 양항 블록은 두 항을 씁니다: \(S_6 = \frac{47}{60} + p_4 = \frac{389}{420} < 1\) (아직 경계를 못 넘음), \(S_7 = \frac{389}{420} + p_5 = \frac{1307}{1260}\) (overshoot \(\frac{47}{1260} < p_5 = \frac19\)). 그리고 \(S_8 = \frac{1307}{1260} - q_3 = \frac{1097}{1260}\) (undershoot \(\frac{163}{1260} < q_3 = \frac16\)).`,
          en: String.raw`Continuing: \(S_4 = \frac56 + p_3 = \frac56 + \frac15 = \frac{31}{30}\) (overshoot \(\frac1{30} < p_3 = \frac15\)), \(S_5 = \frac{31}{30} - q_2 = \frac{31}{30} - \frac14 = \frac{47}{60}\) (undershoot \(\frac{13}{60} < q_2 = \frac14\)). The next positive block takes two terms: \(S_6 = \frac{47}{60} + p_4 = \frac{389}{420} < 1\) (not yet across), \(S_7 = \frac{389}{420} + p_5 = \frac{1307}{1260}\) (overshoot \(\frac{47}{1260} < p_5 = \frac19\)). And \(S_8 = \frac{1307}{1260} - q_3 = \frac{1097}{1260}\) (undershoot \(\frac{163}{1260} < q_3 = \frac16\)).`,
        },
      },
      {
        text: {
          ko: String.raw`모든 값이 모델 계산과 일치합니다 (테스트에서 유리수 그대로 검증). 간격 수열 \(\frac13, \frac16, \frac1{30}, \frac{13}{60}, \frac{47}{1260}, \frac{163}{1260}\)은 단조가 아니지만, 각 간격이 그 경계를 넘게 한 항의 크기 이하이며 항의 크기는 \(0\)으로 갑니다. 120개 항 뒤에는 \(S_{120} \approx 0.9967\), 오차 \(\approx 0.00326\) — 걸음이 목표를 향해 조여들고 있습니다.`,
          en: String.raw`Every value matches the model computation (verified as exact rationals in the tests). The gap sequence \(\frac13, \frac16, \frac1{30}, \frac{13}{60}, \frac{47}{1260}, \frac{163}{1260}\) is not monotone, but each gap is at most its crossing term, and the crossing terms tend to 0. After 120 terms the walk sits at \(S_{120} \approx 0.9967\) with error \(\approx 0.00326\) — the bracket is closing in on the target.`,
        },
      },
    ],
  },
  {
    id: 'amplitude-vanishes',
    statement: {
      ko: String.raw`탐욕 재배열이 목표 \(s\)로 수렴함을 증명하세요: 양쪽 블록이 영원히 반복되고, 매번 경계를 넘을 때의 overshoot/undershoot이 그 경계를 넘게 한 항의 크기 이하이며, 항의 크기가 \(0\)으로 가므로 \(\lvert S_N - s \rvert \to 0\)입니다.`,
      en: String.raw`Prove the greedy rearrangement converges to the target \(s\): both blocks recur forever, each crossing overshoot/undershoot is at most the crossing term's magnitude, and since the term magnitudes tend to 0, \(\lvert S_N - s \rvert \to 0\).`,
    },
    display: [
      String.raw`t \le s \Rightarrow S - s \le p \quad (\text{crossing up}), \qquad t > s \Rightarrow s - S < q \quad (\text{crossing down})`,
      String.raw`\lvert S_N - s \rvert \le \max(q_{\text{last}}, p_{\text{cross}}) \;\xrightarrow[N\to\infty]{}\; 0`,
    ],
    preset: { target: 1.0, terms: 120 },
    presetCaption: {
      ko: String.raw`목표 \(s = 1\), \(N = 120\): \(S_{120} \approx 0.9967\), 오차 \(\approx 0.00326\) — 항 크기가 \(0\)으로 가면서 걸음의 진폭도 함께 사라집니다.`,
      en: String.raw`Target \(s = 1\), \(N = 120\): \(S_{120} \approx 0.9967\), error \(\approx 0.00326\) — as the term magnitudes die out, so does the walk's amplitude around the target.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`교대조화급수 \(\sum \frac{(-1)^{n+1}}{n}\)은 조건수렴합니다 (Leibniz 판정법으로 수렴, \(\sum \frac1n\) 발산으로 절대수렴 실패). 양항 \(p_k = \frac{1}{2k-1}\)과 음항 크기 \(q_k = \frac{1}{2k}\)에 대해 \(\sum p_k = \sum q_k = +\infty\)입니다 (앞 문제의 따름정리, 또는 \(\frac{1}{2k-1} \ge \frac{1}{2k}\)와 조화급수 비교로 직접 확인).`,
          en: String.raw`The alternating harmonic series \(\sum \frac{(-1)^{n+1}}{n}\) converges conditionally (Leibniz gives convergence; \(\sum \frac1n\) diverges, so no absolute convergence). For the positive terms \(p_k = \frac{1}{2k-1}\) and negative magnitudes \(q_k = \frac{1}{2k}\), we have \(\sum p_k = \sum q_k = +\infty\) (a corollary of the previous problem, or directly via \(\frac{1}{2k-1} \ge \frac{1}{2k}\) and comparison with the harmonic series).`,
        },
      },
      {
        text: {
          ko: String.raw`양쪽 블록이 영원히 반복됩니다. 양항이 유한 번만 쓰였다고 가정하면, 어느 시점부터는 음항만 취하므로 부분합은 매번 \(q_j\)씩 감소하고 \(\sum q_j = \infty\)이니 \(t \to -\infty\) — 결국 \(t \le s\)가 되어 규칙이 양항을 취하게 되므로 모순입니다. 음항에 대해서도 대칭적으로 (그렇지 않으면 \(t \to +\infty\)가 되어 음항을 취하게 됨) 양쪽 블록이 무한히 반복됩니다. 각 블록은 아직 쓰지 않은 다음 항부터 차례로 쓰므로, 결국 모든 \(p_i\)와 모든 \(q_j\)가 정확히 한 번씩 쓰입니다 — 즉 진짜 재배열입니다.`,
          en: String.raw`Both blocks recur forever. If positives were taken only finitely often, then eventually only negatives are taken: the running sum drops by \(q_j\) each step and \(\sum q_j = \infty\) forces \(t \to -\infty\) — eventually \(t \le s\), and the rule would take a positive: contradiction. Symmetrically for negatives (otherwise \(t \to +\infty\) would force a negative take). Since each block consumes the next unused terms in order, every \(p_i\) and every \(q_j\) is eventually used exactly once — a genuine rearrangement.`,
        },
      },
      {
        text: {
          ko: String.raw`경계 넘기 보조정리: \(t \le s\)에서 \(p\)를 더해 위로 넘으면 새 간격은 \((t + p) - s = p - (s - t) \le p\) (등호는 \(t = s\)일 때만). \(t > s\)에서 \(q\)를 빼 아래로 넘으면 새 간격은 \(s - (t - q) = q - (t - s) < q\). 따라서 매번의 overshoot/undershoot은 그 경계를 넘게 한 항의 크기 이하입니다.`,
          en: String.raw`Crossing lemma: crossing upward from \(t \le s\) by adding \(p\), the new gap is \((t + p) - s = p - (s - t) \le p\) (equality only when \(t = s\)). Crossing downward from \(t > s\) by subtracting \(q\), the new gap is \(s - (t - q) = q - (t - s) < q\). So every crossing overshoot/undershoot is at most its crossing term's magnitude.`,
        },
      },
      {
        text: {
          ko: String.raw`이제 양항 블록 하나를 봅니다 (첫 번째 경계 넘기 이후의 블록; 처음 몇 항은 유한하므로 수렴에 영향 없음). undershoot 간격 \(\varepsilon\) (보조정리로 \(\varepsilon \le q_{\text{last}}\), 마지막으로 쓴 음항 크기)에서 시작해 블록이 단조증가하므로, 경계를 넘기 전에는 \(s - S \le \varepsilon\), 경계를 넘은 단계에서는 \(S - s \le p_{\text{cross}}\)입니다. 즉 블록 전체에서 \(\lvert S_N - s \rvert \le \max(q_{\text{last}}, p_{\text{cross}})\)입니다.`,
          en: String.raw`Now look at one positive block (after the first crossing; finitely many initial steps don't affect convergence). Starting from an undershoot gap \(\varepsilon\) (with \(\varepsilon \le q_{\text{last}}\), the last negative taken, by the lemma), the block increases monotonically, so before the crossing step \(s - S \le \varepsilon\), and at the crossing step \(S - s \le p_{\text{cross}}\). Hence throughout the block \(\lvert S_N - s \rvert \le \max(q_{\text{last}}, p_{\text{cross}})\).`,
        },
      },
      {
        text: {
          ko: String.raw`블록이 영원히 반복되므로 (2단계) 양항·음항 번호는 둘 다 \(\infty\)로 가고, \(q_{\text{last}} \to 0\)이며 \(p_{\text{cross}} \to 0\)입니다 (경계를 넘긴 양항들은 \(p_i\)의 부분수열). 따라서 \(\lvert S_N - s \rvert \to 0\), 즉 \(S_N \to s\)입니다. 음항 블록도 대칭적입니다. 이것은 유한한 \(s\)에 대한 리만 재배열 정리의 탐욕 증명입니다 (\(\pm\infty\)도 같은 기계로, 목표를 무한히 키우며 도달합니다).`,
          en: String.raw`Since the blocks recur forever (step 2), both term indices tend to \(\infty\): \(q_{\text{last}} \to 0\) and \(p_{\text{cross}} \to 0\) (the crossing positives are a subsequence of the \(p_i\)). Hence \(\lvert S_N - s \rvert \to 0\), i.e. \(S_N \to s\). Negative blocks are symmetric. This is the greedy proof of Riemann's rearrangement theorem for finite \(s\) (the \(\pm\infty\) cases use the same machine with an ever-growing target).`,
        },
      },
    ],
  },
];
