import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the cases-existence scene
 * (proof by cases: |xy| = |x||y|; non-constructive existence:
 * irrational a, b with a^b rational).
 *
 * Every number below was verified against the model
 * (tests/cases-existence.test.ts): at (x, y) = (-2, 3),
 * |xy| = |-6| = 6 = 2 * 3 = |x||y|; sqrt(2)^sqrt(2) ≈ 1.6325269194381528
 * and (sqrt(2)^sqrt(2))^sqrt(2) = 2 to 4.5e-16.
 */
export const casesExistenceProblems: readonly ProblemMeta[] = [
  {
    id: 'cases-abs-product',
    statement: {
      ko: String.raw`경우 나누기로 완전히 증명하세요: 모든 실수 \(x, y\)에 대해 \(|xy| = |x|\,|y|\). 네 가지 부호 경우(0인 경우는 경우 1에 포함)를 빠짐없이 다루고, 각 경우에서 \(|t|\)의 정의(\(t \ge 0\)이면 \(t\), \(t < 0\)이면 \(-t\))를 직접 적용하세요.`,
      en: String.raw`Prove completely by cases: \(|xy| = |x|\,|y|\) for all real \(x, y\). Cover all four sign cases (the zero case folds into case 1) and apply the definition of \(|t|\) (\(t\) if \(t \ge 0\), \(-t\) if \(t < 0\)) directly in each case.`,
    },
    display: [
      String.raw`|xy| = |x|\,|y| \qquad \forall x, y \in \mathbb{R}`,
      String.raw`x < 0 < y \;\Rightarrow\; |xy| = -(xy) = (-x) \cdot y = |x|\,|y|`,
    ],
    preset: { part: 'cases', x: -2, y: 3 },
    presetCaption: {
      ko: String.raw`\((x, y) = (-2, 3)\): 경우 3 (\(x < 0 < y\)) — \(|xy| = |-6| = 6 = 2 \cdot 3 = |x|\,|y|\).`,
      en: String.raw`\((x, y) = (-2, 3)\): case 3 (\(x < 0 < y\)) — \(|xy| = |-6| = 6 = 2 \cdot 3 = |x|\,|y|\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`경우 1: \(x \ge 0\), \(y \ge 0\). 그러면 \(xy \ge 0\)이므로 \(|xy| = xy\)입니다. 또한 \(|x| = x\), \(|y| = y\)이므로 \(|x|\,|y| = xy\) — 양변이 같습니다. (\(x = 0\) 또는 \(y = 0\)인 경우도 여기에 포함됩니다: \(xy = 0\)이라 \(|xy| = 0 = |x|\,|y|\)입니다.)`,
          en: String.raw`Case 1: \(x \ge 0\), \(y \ge 0\). Then \(xy \ge 0\), so \(|xy| = xy\). Also \(|x| = x\) and \(|y| = y\), so \(|x|\,|y| = xy\) — both sides agree. (The case \(x = 0\) or \(y = 0\) folds in here: \(xy = 0\) gives \(|xy| = 0 = |x|\,|y|\).)`,
        },
      },
      {
        text: {
          ko: String.raw`경우 2: \(x > 0\), \(y < 0\). 그러면 \(xy < 0\)이므로 \(|xy| = -(xy)\)입니다. \(-xy = x \cdot (-y)\)이고 \(|x| = x\), \(|y| = -y\)이므로 \(|x|\,|y| = x \cdot (-y)\) — 양변이 같습니다.`,
          en: String.raw`Case 2: \(x > 0\), \(y < 0\). Then \(xy < 0\), so \(|xy| = -(xy)\). Since \(-xy = x \cdot (-y)\) and \(|x| = x\), \(|y| = -y\), we get \(|x|\,|y| = x \cdot (-y)\) — both sides agree.`,
        },
      },
      {
        text: {
          ko: String.raw`경우 3: \(x < 0\), \(y > 0\). 그러면 \(xy < 0\)이므로 \(|xy| = -(xy) = (-x) \cdot y\)입니다. \(|x| = -x\), \(|y| = y\)이므로 \(|x|\,|y| = (-x) \cdot y\) — 양변이 같습니다.`,
          en: String.raw`Case 3: \(x < 0\), \(y > 0\). Then \(xy < 0\), so \(|xy| = -(xy) = (-x) \cdot y\). Since \(|x| = -x\) and \(|y| = y\), we get \(|x|\,|y| = (-x) \cdot y\) — both sides agree.`,
        },
      },
      {
        text: {
          ko: String.raw`경우 4: \(x < 0\), \(y < 0\). 그러면 \(xy > 0\)이므로 \(|xy| = xy\)입니다. \(|x| = -x\), \(|y| = -y\)이므로 \(|x|\,|y| = (-x) \cdot (-y) = xy\) — 양변이 같습니다. 네 경우가 모든 \((x, y) \in \mathbb{R}^2\)를 빠짐없이 덮으므로, \(|xy| = |x|\,|y|\)가 모든 실수 \(x, y\)에 대해 성립합니다. ∎`,
          en: String.raw`Case 4: \(x < 0\), \(y < 0\). Then \(xy > 0\), so \(|xy| = xy\). Since \(|x| = -x\) and \(|y| = -y\), we get \(|x|\,|y| = (-x) \cdot (-y) = xy\) — both sides agree. The four cases cover every \((x, y) \in \mathbb{R}^2\) with nothing left out, so \(|xy| = |x|\,|y|\) holds for all real \(x, y\). ∎`,
        },
      },
    ],
  },
  {
    id: 'existence-irrational-power',
    statement: {
      ko: String.raw`비구성적으로 증명하세요: \(a^b\)가 유리수인 무리수 \(a, b\)가 존재합니다. \(c = \sqrt{2}^{\sqrt{2}}\)로 두고 "\(c\)가 유리수인 경우 / 무리수인 경우"로 나누세요. 지수 단계 \(\big(\sqrt{2}^{\sqrt{2}}\big)^{\sqrt{2}} = \sqrt{2}^{\sqrt{2} \cdot \sqrt{2}} = \sqrt{2}^{2} = 2\)를 지수법칙 \((u^v)^w = u^{vw}\) (\(u > 0\))부터 엄밀히 정당화하고, 왜 이 증명이 비구성적인지 설명하세요.`,
      en: String.raw`Prove non-constructively: there exist irrational numbers \(a, b\) with \(a^b\) rational. Put \(c = \sqrt{2}^{\sqrt{2}}\) and split into "if \(c\) is rational / if \(c\) is irrational". Rigorously justify the exponent step \(\big(\sqrt{2}^{\sqrt{2}}\big)^{\sqrt{2}} = \sqrt{2}^{\sqrt{2} \cdot \sqrt{2}} = \sqrt{2}^{2} = 2\) from the power law \((u^v)^w = u^{vw}\) (\(u > 0\)), and explain why this proof is non-constructive.`,
    },
    display: [
      String.raw`c = \sqrt{2}^{\sqrt{2}} \approx 1.6325269194381528`,
      String.raw`c \in \mathbb{Q} \Rightarrow a = b = \sqrt{2}; \qquad c \notin \mathbb{Q} \Rightarrow a = c,\ b = \sqrt{2},\ a^b = 2`,
    ],
    preset: { part: 'existence', x: -2, y: 3 },
    presetCaption: {
      ko: String.raw`존재 증명 갈래도: \(c = \sqrt{2}^{\sqrt{2}} \approx 1.6325\)에서 두 갈래가 갈라져 "존재한다"로 모인다. \(c^{\sqrt{2}} \approx 2.0000000000\).`,
      en: String.raw`The existence fork: from \(c = \sqrt{2}^{\sqrt{2}} \approx 1.6325\) two branches split and rejoin at "existence". \(c^{\sqrt{2}} \approx 2.0000000000\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\sqrt{2}\)가 무리수임은 이미 알려져 있습니다(씬 'sqrt2-irrational' 문제 참조). \(c = \sqrt{2}^{\sqrt{2}}\)로 두세요 — 무리수의 무리수 제곱입니다. \(c\)가 유리수인지 무리수인지는 묻지 않고, 두 경우를 나눕니다.`,
          en: String.raw`That \(\sqrt{2}\) is irrational is known (see the 'sqrt2-irrational' scene problems). Put \(c = \sqrt{2}^{\sqrt{2}}\) — an irrational power of an irrational. Without asking whether \(c\) is rational or irrational, split into two cases.`,
        },
      },
      {
        text: {
          ko: String.raw`경우 1: \(c\)가 유리수. \(a = b = \sqrt{2}\)로 두면 \(a, b\)는 무리수이고 \(a^b = \sqrt{2}^{\sqrt{2}} = c\)는 유리수 — 증명 끝입니다.`,
          en: String.raw`Case 1: \(c\) is rational. Put \(a = b = \sqrt{2}\): then \(a, b\) are irrational and \(a^b = \sqrt{2}^{\sqrt{2}} = c\) is rational — done.`,
        },
      },
      {
        text: {
          ko: String.raw`경우 2: \(c\)가 무리수. \(a = c\), \(b = \sqrt{2}\)로 두면 \(a, b\)는 무리수이고, 지수법칙 \((u^v)^w = u^{vw}\) (\(u > 0\)인 실수 \(u, v, w\)에 대해 성립)를 \(u = \sqrt{2}\), \(v = w = \sqrt{2}\)에 적용하면 \(a^b = \big(\sqrt{2}^{\sqrt{2}}\big)^{\sqrt{2}} = \sqrt{2}^{\sqrt{2} \cdot \sqrt{2}} = \sqrt{2}^{2} = 2\) — 유리수입니다. 수치로도 확인됩니다: \(c^{\sqrt{2}} \approx 2.0000000000\).`,
          en: String.raw`Case 2: \(c\) is irrational. Put \(a = c\), \(b = \sqrt{2}\): then \(a, b\) are irrational, and applying the power law \((u^v)^w = u^{vw}\) (valid for real \(u > 0\) and real \(v, w\)) with \(u = \sqrt{2}\), \(v = w = \sqrt{2}\) gives \(a^b = \big(\sqrt{2}^{\sqrt{2}}\big)^{\sqrt{2}} = \sqrt{2}^{\sqrt{2} \cdot \sqrt{2}} = \sqrt{2}^{2} = 2\) — rational. Numerically too: \(c^{\sqrt{2}} \approx 2.0000000000\).`,
        },
      },
      {
        text: {
          ko: String.raw`어느 경우든 무리수 \(a, b\)와 유리수 \(a^b\)가 존재하므로 증명이 끝났습니다. 이 증명은 비구성적입니다: 어떤 \((a, b)\) 쌍이 조건을 만족하는지 끝내 말하지 않기 때문입니다 — 경우 1이 참이면 \((\sqrt{2}, \sqrt{2})\)이고 경우 2가 참이면 \((c, \sqrt{2})\)이지만, \(c\)가 유리수인지 무리수인지는 증명 어디에서도 판단하지 않습니다. (참고로 겔폰드-슈나이더 정리에 의해 \(c\)는 실제로 초월수 — 따라서 무리수 — 임이 알려져 경우 2가 참이지만, 위 증명은 그 사실을 전혀 사용하지 않습니다.) ∎`,
          en: String.raw`In either case irrational \(a, b\) exist with \(a^b\) rational, completing the proof. The proof is non-constructive: it never says which pair \((a, b)\) works — \((\sqrt{2}, \sqrt{2})\) if case 1 holds, \((c, \sqrt{2})\) if case 2 holds — because whether \(c\) is rational or irrational is never decided anywhere in the proof. (The Gelfond–Schneider theorem does imply \(c\) is in fact transcendental, hence irrational, so case 2 is the true one — but the proof above never uses that.) ∎`,
        },
      },
    ],
  },
  {
    id: 'cases-squares-mod-4',
    statement: {
      ko: String.raw`경우 나누기(\(n\)이 짝수 / 홀수)로 증명하세요: 모든 정수의 제곱은 \(4\)로 나눈 나머지가 \(0\) 또는 \(1\)입니다. 이를 이용해 방정식 \(x^2 + y^2 = 3\)이 정수 해를 갖지 않음을 보이세요.`,
      en: String.raw`Prove by cases (\(n\) even / \(n\) odd): every integer square is congruent to \(0\) or \(1\) modulo \(4\). Use this to show that \(x^2 + y^2 = 3\) has no integer solutions.`,
    },
    display: [
      String.raw`n = 2k \Rightarrow n^2 = 4k^2 \equiv 0 \pmod 4; \qquad n = 2k+1 \Rightarrow n^2 = 4(k^2+k)+1 \equiv 1 \pmod 4`,
      String.raw`x^2 + y^2 \pmod 4 \in \{0, 1, 2\} \not\ni 3`,
    ],
    preset: { part: 'cases', x: 2, y: 2 },
    presetCaption: {
      ko: String.raw`\((x, y) = (2, 2)\): 경우 1 (\(x, y \ge 0\)) — \(|xy| = 4 = 2 \cdot 2 = |x|\,|y|\).`,
      en: String.raw`\((x, y) = (2, 2)\): case 1 (\(x, y \ge 0\)) — \(|xy| = 4 = 2 \cdot 2 = |x|\,|y|\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`경우 1: \(n\)이 짝수, \(n = 2k\) (\(k \in \mathbb{Z}\)). 그러면 \(n^2 = 4k^2\)이므로 \(n^2 \equiv 0 \pmod 4\)입니다.`,
          en: String.raw`Case 1: \(n\) is even, \(n = 2k\) (\(k \in \mathbb{Z}\)). Then \(n^2 = 4k^2\), so \(n^2 \equiv 0 \pmod 4\).`,
        },
      },
      {
        text: {
          ko: String.raw`경우 2: \(n\)이 홀수, \(n = 2k+1\). 그러면 \(n^2 = 4k^2 + 4k + 1 = 4(k^2 + k) + 1\)이므로 \(n^2 \equiv 1 \pmod 4\)입니다. 두 경우가 모든 정수를 빠짐없이 덮으므로, 정수 제곱의 \(4\) 모듈러 나머지는 항상 \(0\) 또는 \(1\)입니다.`,
          en: String.raw`Case 2: \(n\) is odd, \(n = 2k+1\). Then \(n^2 = 4k^2 + 4k + 1 = 4(k^2 + k) + 1\), so \(n^2 \equiv 1 \pmod 4\). The two cases cover every integer with nothing left out, so every integer square is \(0\) or \(1\) modulo \(4\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(x^2 + y^2 = 3\)이 정수 해를 가진다고 가정하세요 (귀류법). \(x^2 \pmod 4, y^2 \pmod 4 \in \{0, 1\}\)이므로, 그 합 \(x^2 + y^2 \pmod 4\)는 \(\{0, 1, 2\}\) 중 하나입니다: \(0+0 = 0\), \(0+1 = 1\), \(1+1 = 2\). 그런데 \(3 \equiv 3 \pmod 4\)는 이 집합에 없으므로 모순입니다. 따라서 \(x^2 + y^2 = 3\)의 정수 해는 존재하지 않습니다. ∎`,
          en: String.raw`Now suppose \(x^2 + y^2 = 3\) had an integer solution (proof by contradiction). Since \(x^2 \pmod 4, y^2 \pmod 4 \in \{0, 1\}\), their sum \(x^2 + y^2 \pmod 4\) lies in \(\{0, 1, 2\}\): \(0+0 = 0\), \(0+1 = 1\), \(1+1 = 2\). But \(3 \equiv 3 \pmod 4\) is not in this set — a contradiction. Hence \(x^2 + y^2 = 3\) has no integer solutions. ∎`,
        },
      },
    ],
  },
];
