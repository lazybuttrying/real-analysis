import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Baire category scene.
 * Imports nothing except types. Every number below was verified against
 * the model (tests/baire-category.test.ts):
 *   stage 6:  hits at k = 1 (q_1 = 0), k = 2 (q_2 = 1);
 *             I_6 = [0.75, 0.8125], survivor = 0.78125
 *   stage 7:  extra hit at k = 7 (q_7 = 3/4);
 *             I_7 = [0.796875, 0.8125], survivor = 0.8046875
 *   stage 10: hits at k = 1, 2, 7; I_10 = [0.796875, 0.8125],
 *             survivor = 0.8046875
 *   stage 14: extra hit at k = 11 (q_11 = 4/5);
 *             I_14 = [0.80859375, 0.8125] (length 1/256),
 *             survivor = 0.810546875
 */
export const baireCategoryProblems: readonly ProblemMeta[] = [
  {
    id: 'baire-proof',
    statement: {
      ko: String.raw`Baire Category Theorem을 증명하세요: 완비 거리공간 \(X\)가 nowhere dense인 집합들의 가산합집합 \(X = \bigcup_{n=1}^{\infty} E_n\)으로 표현되는 것은 불가능합니다. 즉 완비 거리공간은 자기 자신 안에서 meagre(제1 범주)가 될 수 없습니다.`,
      en: String.raw`Prove the Baire Category Theorem: a complete metric space \(X\) cannot be written as a countable union \(X = \bigcup_{n=1}^{\infty} E_n\) of nowhere dense sets. In other words, a complete metric space is not meagre (first-category) in itself.`,
    },
    display: [
      String.raw`X = \bigcup_{n=1}^{\infty} E_n, \qquad \operatorname{int}(\overline{E_n}) = \varnothing \ \ \forall n`,
      String.raw`\overline{B}(x_{k+1}, r_{k+1}) \subseteq B(x_k, r_k) \setminus \overline{E_{k+1}}, \qquad 0 < r_{k+1} < r_k/2`,
    ],
    preset: { stage: 6 },
    presetCaption: {
      ko: String.raw`stage 6: \(I_6 = [0.75,\, 0.8125]\), 생존자 \(x \approx 0.78125\) — \(q_1 = 0\), \(q_2 = 1\)을 구간 안에서 회피했고, 나머지는 이미 밖에 있었습니다. 이 중첩 닫힌구간들이 증명의 중첩 닫힌공 \(\overline{B}(x_k, r_k)\)에 해당합니다.`,
      en: String.raw`stage 6: \(I_6 = [0.75,\, 0.8125]\), survivor \(x \approx 0.78125\) — dodged \(q_1 = 0\), \(q_2 = 1\) inside the interval; the rest already lay outside. These nested closed intervals are the proof's nested closed balls \(\overline{B}(x_k, r_k)\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 \(X \ne \varnothing\)라고 가정합니다 — \(X = \varnothing\)이면 \(X = \bigcup_n \varnothing\)로 빈 공간은 자기 안에서 meagre하므로, 비어 있지 않음이 정리에서 필수입니다. \(E_1\)이 nowhere dense이므로 \(\operatorname{int}(\overline{E_1}) = \varnothing\)이고, \(U_1 = X \setminus \overline{E_1}\)은 비어 있지 않은 열린집합입니다 (\(U_1 = \varnothing\)이면 \(\overline{E_1} = X\)라 \(\operatorname{int}(\overline{E_1}) = X \ne \varnothing\)가 되기 때문입니다). \(x_1 \in U_1\)을 잡으면 \(B(x_1, \rho) \subseteq U_1\)인 \(\rho > 0\)이 있고, \(r_1 = \min(\rho/2, 1/2)\)로 두면 닫힌공 \(\overline{B}(x_1, r_1) \subseteq U_1\)이며 \(r_1 < 1\)입니다.`,
          en: String.raw`Assume first that \(X \ne \varnothing\) — if \(X = \varnothing\) then \(X = \bigcup_n \varnothing\), so the empty space is meagre in itself and nonemptiness is essential to the theorem. Since \(E_1\) is nowhere dense, \(\operatorname{int}(\overline{E_1}) = \varnothing\), so \(U_1 = X \setminus \overline{E_1}\) is a nonempty open set (if \(U_1 = \varnothing\) then \(\overline{E_1} = X\), giving \(\operatorname{int}(\overline{E_1}) = X \ne \varnothing\)). Pick \(x_1 \in U_1\); some \(\rho > 0\) has \(B(x_1, \rho) \subseteq U_1\), and with \(r_1 = \min(\rho/2, 1/2)\) the closed ball \(\overline{B}(x_1, r_1) \subseteq U_1\) with \(r_1 < 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`귀납적으로 \(\overline{B}(x_k, r_k)\)가 잡혔다고 하자. \(V = B(x_k, r_k) \setminus \overline{E_{k+1}}\)은 비어 있지 않은 열린집합입니다: \(B(x_k, r_k)\)가 비어 있지 않은 열린집합인데, 만약 \(B(x_k, r_k) \subseteq \overline{E_{k+1}}\)이라면 \(B(x_k, r_k) \subseteq \operatorname{int}(\overline{E_{k+1}}) = \varnothing\)이 되어 모순이기 때문입니다. \(x_{k+1} \in V\)를 잡고 반지름을 \(r_k/2\)보다 작게, 그리고 \(V\) 안에 닫힌공이 들어가도록 줄이면 \(\overline{B}(x_{k+1}, r_{k+1}) \subseteq B(x_k, r_k) \setminus \overline{E_{k+1}}\), \(0 < r_{k+1} < r_k/2\)를 얻습니다.`,
          en: String.raw`Inductively, suppose \(\overline{B}(x_k, r_k)\) is chosen. Then \(V = B(x_k, r_k) \setminus \overline{E_{k+1}}\) is a nonempty open set: \(B(x_k, r_k)\) is nonempty open, and \(B(x_k, r_k) \subseteq \overline{E_{k+1}}\) would give \(B(x_k, r_k) \subseteq \operatorname{int}(\overline{E_{k+1}}) = \varnothing\), a contradiction. Pick \(x_{k+1} \in V\) and shrink the radius below \(r_k/2\) so the closed ball fits in \(V\): \(\overline{B}(x_{k+1}, r_{k+1}) \subseteq B(x_k, r_k) \setminus \overline{E_{k+1}}\) with \(0 < r_{k+1} < r_k/2\).`,
        },
      },
      {
        text: {
          ko: String.raw`수열 \((x_k)\)는 Cauchy입니다: \(m > k\)이면 \(x_m \in \overline{B}(x_{k+1}, r_{k+1}) \subseteq B(x_k, r_k)\)이므로 \(d(x_k, x_m) < r_k\)이고, \(r_k \le 2^{-(k-1)} r_1 \to 0\)이기 때문입니다 (\(k = 1\)에서는 등호이고, \(k \ge 2\)에서는 \(r_{j+1} < r_j/2\)를 반복 적용해 엄격한 부등식을 얻습니다). \(X\)가 완비이므로 \(x_k \to x \in X\)인 극한이 존재합니다.`,
          en: String.raw`The sequence \((x_k)\) is Cauchy: for \(m > k\), \(x_m \in \overline{B}(x_{k+1}, r_{k+1}) \subseteq B(x_k, r_k)\), so \(d(x_k, x_m) < r_k\), and \(r_k \le 2^{-(k-1)} r_1 \to 0\) (equality at \(k = 1\); for \(k \ge 2\) iterating \(r_{j+1} < r_j/2\) gives the strict inequality). Completeness of \(X\) gives a limit \(x_k \to x \in X\).`,
        },
      },
      {
        text: {
          ko: String.raw`고정된 \(k\)에 대해 꼬리 \((x_m)_{m \ge k}\)는 닫힌집합 \(\overline{B}(x_k, r_k)\) 안에 있으므로 극한 \(x \in \overline{B}(x_k, r_k)\)입니다. 따라서 모든 \(k\)에 대해 \(x \in \bigcap_k \overline{B}(x_k, r_k)\)이고, \(x \in \overline{B}(x_1, r_1) \subseteq X \setminus \overline{E_1}\)이며 \(j \ge 2\)에 대해 \(x \in \overline{B}(x_j, r_j) \subseteq B(x_{j-1}, r_{j-1}) \setminus \overline{E_j}\)이므로, \(x \notin E_j\)가 모든 \(j\)에 대해 성립합니다.`,
          en: String.raw`For fixed \(k\), the tail \((x_m)_{m \ge k}\) lies in the closed set \(\overline{B}(x_k, r_k)\), so the limit \(x \in \overline{B}(x_k, r_k)\). Hence \(x \in \bigcap_k \overline{B}(x_k, r_k)\) for all \(k\); with \(x \in \overline{B}(x_1, r_1) \subseteq X \setminus \overline{E_1}\) and, for \(j \ge 2\), \(x \in \overline{B}(x_j, r_j) \subseteq B(x_{j-1}, r_{j-1}) \setminus \overline{E_j}\), we get \(x \notin E_j\) for every \(j\).`,
        },
      },
      {
        text: {
          ko: String.raw`그런데 \(x \in X = \bigcup_j E_j\)이므로 어떤 \(j\)에 대해 \(x \in E_j\)이어야 합니다 — 모순입니다. 따라서 완비 거리공간은 nowhere dense 집합들의 가산합집합이 될 수 없습니다. 직관: nowhere dense 집합은 "구멍"을 남기고, 완비성은 그 구멍들을 따라 내려간 극한점을 공간 안에 붙잡아 둡니다.`,
          en: String.raw`But \(x \in X = \bigcup_j E_j\), so \(x \in E_j\) for some \(j\) — a contradiction. Hence a complete metric space cannot be a countable union of nowhere dense sets. The intuition: each nowhere dense set leaves a "hole", and completeness traps the limit point obtained by descending through those holes inside the space.`,
        },
      },
    ],
  },
  {
    id: 'irrationals',
    statement: {
      ko: String.raw`모델의 중첩구간을 이용해 \([0, 1]\) 안에 무리수가 존재함을 증명하세요: \([0, 1]\)의 유리수를 \(q_1, q_2, \dots\)로 열거하고 각 단계에서 구간 안에 들어온 \(q_k\)를 피하는 닫힌구간 \(I_k\)를 잡습니다. 길이 \(\ell_k = b_k - a_k \to 0\)임을 보이고 (유리수가 조밀하다는 것을 이용), \(\bigcap_k I_k = \{x\}\)인 점 \(x\)가 모든 \(q_k\)와 다름을 보이세요.`,
      en: String.raw`Use the model's nested intervals to prove an irrational exists in \([0, 1]\): enumerate the rationals of \([0, 1]\) as \(q_1, q_2, \dots\) and at each stage take a closed interval \(I_k\) dodging \(q_k\) whenever it lands inside. Show the lengths \(\ell_k = b_k - a_k \to 0\) (using density of the rationals), and that the point \(x\) with \(\bigcap_k I_k = \{x\}\) differs from every \(q_k\).`,
    },
    display: [
      String.raw`q_k \in I_{k-1} \ \Longrightarrow \ \ell_k = \ell_{k-1}/4, \quad q_k \notin I_k`,
      String.raw`\ell_k \to 0, \qquad \bigcap_{k=1}^{\infty} I_k = \{x\}, \qquad x \ne q_k \ \forall k`,
    ],
    preset: { stage: 14 },
    presetCaption: {
      ko: String.raw`stage 14: \(I_{14} = [0.80859375,\, 0.8125]\) (길이 \(1/256\)), 생존자 \(x \approx 0.810546875\) — \(q_1 = 0\), \(q_2 = 1\), \(q_7 = 3/4\), \(q_{11} = 4/5\)를 구간 안에서 회피했고, \(x\)는 열거된 14개의 유리수 모두와 다릅니다.`,
      en: String.raw`stage 14: \(I_{14} = [0.80859375,\, 0.8125]\) (length \(1/256\)), survivor \(x \approx 0.810546875\) — dodged \(q_1 = 0\), \(q_2 = 1\), \(q_7 = 3/4\), \(q_{11} = 4/5\) inside the interval; \(x\) differs from all 14 rationals listed.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`구성에 의해 각 \(I_k\)는 닫힌구간이고 \(I_{k+1} \subseteq I_k\)이며, \(q_k\)가 \(I_{k-1}\) 안에 들어오면 길이가 \(1/4\)로 줄어드는 \(I_k\)를 잡아 \(q_k \notin I_k\)가 됩니다 (\(q_k\)가 이미 밖에 있으면 \(I_k = I_{k-1}\)).`,
          en: String.raw`By construction each \(I_k\) is a closed interval with \(I_{k+1} \subseteq I_k\); when \(q_k\) lands in \(I_{k-1}\) we take \(I_k\) of one-quarter the length with \(q_k \notin I_k\) (if \(q_k\) already lies outside, \(I_k = I_{k-1}\)).`,
        },
      },
      {
        text: {
          ko: String.raw`길이가 \(0\)으로 수렴함을 보입니다. 단계 \(K\) 이후로 더 이상 "적중"이 없다고 가정하면, \(n \ge K\)인 모든 \(n\)에 대해 \(I_n = I_K\)이고 길이는 양수로 고정됩니다. 그런데 \(I_K\)는 양의 길이를 가지므로 유리수를 무한히 많이 포함하고, 각 유리수는 열거에서 정확히 한 번씩 등장하므로, \(m > K\)이면서 \(q_m \in I_K\)인 \(m\)이 존재합니다. 그러면 \(I_{m-1} = I_K \ni q_m\)이므로 단계 \(m\)은 적중 — 모순입니다. 따라서 적중은 무한히 많이 일어나고, 매번 길이가 \(1/4\)이 되므로 \(\ell_k \to 0\)입니다.`,
          en: String.raw`The lengths tend to \(0\). Suppose no more "hits" occur after stage \(K\); then \(I_n = I_K\) for all \(n \ge K\) and the length stays positive. But \(I_K\) has positive length, so it contains infinitely many rationals, each appearing exactly once in the enumeration — hence some \(q_m \in I_K\) has index \(m > K\). Then \(I_{m-1} = I_K \ni q_m\), so stage \(m\) is a hit — a contradiction. Hits therefore occur infinitely often, and each one quarters the length, so \(\ell_k \to 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\mathbb{R}\)의 완비성에 의해 (중첩구간 정리), 길이가 \(0\)으로 가는 중첩 닫힌구간들의 교집합은 정확히 한 점입니다: \(\bigcap_k I_k = \{x\}\). 그리고 \(x \in I_k\)이면서 \(q_k \notin I_k\)이므로, \(x \ne q_k\)가 모든 \(k\)에 대해 성립합니다.`,
          en: String.raw`By completeness of \(\mathbb{R}\) (the nested interval theorem), nested closed intervals whose lengths tend to \(0\) intersect in exactly one point: \(\bigcap_k I_k = \{x\}\). And since \(x \in I_k\) while \(q_k \notin I_k\), we have \(x \ne q_k\) for every \(k\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\{q_k\}\)는 \([0, 1]\)의 모든 유리수를 열거하므로, \(x\)는 \([0, 1]\) 안의 무리수입니다. 따라서 \([0, 1] = \bigcup_k \{q_k\}\) — 점들의 가산합집합 — 일 수 없고, \([0, 1]\)은 비가산입니다. 이것이 Baire 정리의 한 점 버전(point-set version)입니다: 한 점짜리 집합은 \(\mathbb{R}\)에서 nowhere dense이므로, 완비인 \([0, 1]\)이 점들의 가산합집합이면 Baire 정리에 모순됩니다.`,
          en: String.raw`Since \(\{q_k\}\) enumerates every rational of \([0, 1]\), \(x\) is an irrational in \([0, 1]\). Hence \([0, 1] = \bigcup_k \{q_k\}\) — a countable union of points — is impossible, and \([0, 1]\) is uncountable. This is the point-set version of Baire's theorem: a singleton is nowhere dense in \(\mathbb{R}\), so \([0, 1]\), being complete, cannot be a countable union of points without contradicting Baire.`,
        },
      },
    ],
  },
  {
    id: 'typical-nondiff',
    statement: {
      ko: String.raw`[아이디어 스케치 — 완전한 증명이 아닙니다] \(C[0, 1]\)에 sup norm \(\|f\|_\infty\)를 주면 완비 거리공간이 됩니다. \(m \ge 1\)에 대해 \(F_m = \{f : \exists x\ \forall y\ |f(x) - f(y)| \le m|x-y|\}\)라 두세요. 각 \(F_m\)이 closed nowhere dense임(스케치)을 이용해, "어느 점에서도 미분 가능하지 않은 함수가 typical하다" — 즉 comeager — 는 아이디어를 설명하세요. 아래의 closed/nowhere dense 검증은 스케치이며, 완전히 증명하지 않습니다.`,
      en: String.raw`[Idea-level sketch — not a complete proof] \(C[0, 1]\) with the sup norm \(\|f\|_\infty\) is a complete metric space. For \(m \ge 1\) let \(F_m = \{f : \exists x\ \forall y\ |f(x) - f(y)| \le m|x-y|\}\). Using that each \(F_m\) is closed nowhere dense (sketch), explain the idea that "nowhere-differentiable functions are typical" — i.e. comeager. The closed/nowhere-dense verifications below are sketched, not fully proved here.`,
    },
    display: [
      String.raw`F_m = \{f \in C[0,1] : \exists x\ \forall y\ |f(x) - f(y)| \le m|x-y|\}`,
      String.raw`\text{differentiable somewhere} \subseteq \bigcup_{m=1}^{\infty} F_m \quad \text{(meagre)}`,
    ],
    preset: { stage: 10 },
    presetCaption: {
      ko: String.raw`stage 10: \(I_{10} = [0.796875,\, 0.8125]\), 생존자 \(x \approx 0.8046875\) — 세 번의 축소로 \(q_1\), \(q_2\), \(q_7\)을 구간 안에서 회피했습니다. 같은 중첩공 아이디어를 \(C[0, 1]\)에 적용하면 미분 불가능한 함수가 typical해집니다.`,
      en: String.raw`stage 10: \(I_{10} = [0.796875,\, 0.8125]\), survivor \(x \approx 0.8046875\) — three shrinkings dodged \(q_1\), \(q_2\), \(q_7\) inside. The same nested-ball idea, applied in \(C[0,1]\), makes nowhere-differentiable functions typical.`,
    },
    isHint: true,
    proof: [
      {
        text: {
          ko: String.raw`[스케치] \(F_m\)은 닫힌집합입니다. \(f_j \in F_m\)이 \(f_j \to f\) (uniformly)이고 각 \(f_j\)의 witness가 \(x_j\) — 즉 \(|f_j(x_j) - f_j(y)| \le m|x_j - y|\) — 라 하자. Bolzano–Weierstrass로 부분수열 \(x_{j'} \to x\)를 잡으면, 부등식을 극한으로 넘겨 \(|f(x) - f(y)| \le m|x - y|\)를 얻으므로 \(f \in F_m\)입니다.`,
          en: String.raw`[Sketch] \(F_m\) is closed. If \(f_j \in F_m\) with \(f_j \to f\) uniformly, witnessed by \(x_j\) — i.e. \(|f_j(x_j) - f_j(y)| \le m|x_j - y|\) — pass to a convergent subsequence \(x_{j'} \to x\) (Bolzano–Weierstrass); the estimate survives the limit as \(|f(x) - f(y)| \le m|x - y|\), so \(f \in F_m\).`,
        },
      },
      {
        text: {
          ko: String.raw`[스케치] \(F_m\)은 nowhere dense입니다. \(f \in F_m\)와 \(\varepsilon > 0\)가 주어지면, 먼저 \(f\)를 \(\varepsilon/2\) 이내에서 piecewise-linear \(p\)로 근사하고(uniform continuity), 그 위에 진폭 \(<\varepsilon/2\)이면서 기울기가 \(p\)의 기울기보다 \(m\) 이상 큰 미세한 톱니파(zigzag)를 얹습니다. 그러면 어떤 후보점 \(x\)에서도 근처의 톱니 하나가 \(m\)-Lipschitz bound를 깨뜨리므로, 섭동된 \(g\)는 \(F_m\)에 속하지 않으면서 \(\|g - f\|_\infty < \varepsilon\)입니다. 닫힌집합이므로 내부는 비어 있습니다.`,
          en: String.raw`[Sketch] \(F_m\) is nowhere dense. Given \(f \in F_m\) and \(\varepsilon > 0\), first approximate \(f\) within \(\varepsilon/2\) by a piecewise-linear \(p\) (uniform continuity), then superimpose a fine zigzag of amplitude \(<\varepsilon/2\) whose slopes exceed those of \(p\) by more than \(m\). At every candidate point \(x\), a nearby tooth of the zigzag breaks the \(m\)-Lipschitz bound, so the perturbed \(g \notin F_m\) while \(\|g - f\|_\infty < \varepsilon\). Being closed, \(F_m\) has empty interior.`,
        },
      },
      {
        text: {
          ko: String.raw`어느 점에서든 미분 가능한 함수는 \(\bigcup_m F_m\)에 속합니다. \(f'(x_0)\)이 존재하면, \(|y - x_0| < \delta\)에서는 \(|f(y) - f(x_0)| \le m_1|y - x_0|\) (\(m_1 \ge |f'(x_0)| + 1\))이고, \(|y - x_0| \ge \delta\)인 먼 점에서는 유계성으로 \(|f(y) - f(x_0)| \le 2\|f\|_\infty \le \frac{2\|f\|_\infty}{\delta}|y - x_0|\)입니다. 정수 \(m \ge \max(m_1, 2\|f\|_\infty/\delta)\)를 잡으면 모든 \(y\)에 대해 \(|f(y) - f(x_0)| \le m|y - x_0|\) — 즉 \(f \in F_m\)입니다.`,
          en: String.raw`A function differentiable at even one point lies in \(\bigcup_m F_m\). If \(f'(x_0)\) exists, then \(|f(y) - f(x_0)| \le m_1|y - x_0|\) for \(|y - x_0| < \delta\) (take \(m_1 \ge |f'(x_0)| + 1\)), while for far points \(|y - x_0| \ge \delta\) boundedness gives \(|f(y) - f(x_0)| \le 2\|f\|_\infty \le \frac{2\|f\|_\infty}{\delta}|y - x_0|\). With an integer \(m \ge \max(m_1, 2\|f\|_\infty/\delta)\) we get \(|f(y) - f(x_0)| \le m|y - x_0|\) for all \(y\) — i.e. \(f \in F_m\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 "어느 점에서든 미분 가능한 함수들" \(\subseteq \bigcup_{m=1}^{\infty} F_m\)은 nowhere dense 집합들의 가산합집합 — meagre입니다. 그 여집합인 "어디서도 미분 가능하지 않은 함수들"은 comeager이며, Baire 정리(문제 1)에 의해 비어 있지 않을 뿐 아니라 조밀합니다. 다시 강조합니다: 위의 closed/nowhere dense 검증은 아이디어 스케치이며, 완전한 증명은 여기서 다루지 않습니다.`,
          en: String.raw`Hence "functions differentiable somewhere" \(\subseteq \bigcup_{m=1}^{\infty} F_m\) is a countable union of nowhere dense sets — meagre. Its complement, the nowhere-differentiable functions, is comeager, and by Baire (problem 1) it is not just nonempty but dense. To stress again: the closed/nowhere-dense verifications above are idea-level sketches, not complete proofs.`,
        },
      },
    ],
  },
];

