import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the sqrt2-irrational scene
 * (Tao, Analysis I, Proposition 4.4.4). Imports nothing except types.
 * Every number below was verified against the model (tests/sqrt2-irrational.test.ts):
 *   closest rational at N = 5: 7/5, |7/5 - sqrt(2)| = 0.014213562373095234;
 *   closest rational at N = 12: 17/12, |17/12 - sqrt(2)| = 0.0024531042935712446;
 *   (7/5)^2 = 49/25 = 1.96 < 2 < 289/144 = 2.0069444... = (17/12)^2;
 *   17/12 - 7/5 = 1/60 = 0.016666... < 0.06;
 *   min distance is > 0 for every N = 1..12.
 */
export const sqrt2IrrationalProblems: readonly ProblemMeta[] = [
  {
    id: 'sqrt2-irrational-proof',
    statement: {
      ko: String.raw`어떤 유리수 \(p/q\)도 제곱해서 \(2\)가 될 수 없음을 완전히 증명하세요 — 즉 방정식 \(x^2 = 2\)는 유리수 해를 갖지 않습니다 (Tao, 명제 4.4.4).`,
      en: String.raw`Prove completely that no rational number \(p/q\) squares to \(2\) — the equation \(x^2 = 2\) has no rational solution (Tao, Proposition 4.4.4).`,
    },
    display: [
      String.raw`\left(\frac{p}{q}\right)^2 = 2 \text{ has no solution } \frac{p}{q} \in \mathbb{Q}`,
    ],
    preset: { denom: 5 },
    presetCaption: {
      ko: String.raw`\(N = 5\): 분모가 \(5\) 이하인 유리수 중 \(\sqrt{2}\)에 가장 가까운 것은 \(7/5 \approx 1.4\)이며 거리는 약 \(0.0142\)입니다 — 그러나 아래 증명은 이 거리가 \(0\)이 될 수는 절대 없음을 보입니다.`,
      en: String.raw`\(N = 5\): among rationals with denominator at most \(5\), the closest to \(\sqrt{2}\) is \(7/5 \approx 1.4\) at distance about \(0.0142\) — but the proof below shows this distance can never be \(0\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 부호를 줄입니다: 유리수 \(r\)가 \(r^2 = 2\)를 만족하면 \(|r|\)도 유리수이고 \(|r|^2 = r^2 = 2\)이며, \(r \ne 0\)이므로 \(|r|\)는 양의 유리수 해입니다. 따라서 양의 해를 배제하면 충분합니다. \(\left(\frac{p}{q}\right)^2 = 2\)인 양의 유리수 \(p/q\)가 존재한다고 가정합니다. 아래 문제 2에 의해 \(p/q\)는 기약분수, 즉 \(\gcd(p, q) = 1\)로 둘 수 있습니다.`,
          en: String.raw`First reduce the sign: if a rational \(r\) satisfies \(r^2 = 2\), then \(|r|\) is rational, \(|r|^2 = r^2 = 2\), and \(r \ne 0\), so \(|r|\) is a positive rational solution. Hence it suffices to rule out a positive solution. Suppose a positive rational \(p/q\) with \(\left(\frac{p}{q}\right)^2 = 2\) exists. By problem 2 below, we may take \(p/q\) in lowest terms, i.e. \(\gcd(p, q) = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`분모를 없애면 \(p^2 = 2q^2\)이므로 \(p^2\)은 짝수입니다. \(p\)가 홀수이면 \(p^2\)도 홀수이므로(홀수 × 홀수 = 홀수), \(p\)는 짝수여야 합니다: \(p = 2k\)인 양의 정수 \(k\)가 존재합니다.`,
          en: String.raw`Clearing denominators gives \(p^2 = 2q^2\), so \(p^2\) is even. If \(p\) were odd then \(p^2\) would be odd (odd × odd = odd), so \(p\) must be even: \(p = 2k\) for a positive integer \(k\).`,
        },
      },
      {
        text: {
          ko: String.raw`대입하면 \(4k^2 = 2q^2\), 즉 \(q^2 = 2k^2\)이므로 \(q^2\)도 짝수 — 같은 논증으로 \(q\)도 짝수입니다. 그런데 \(p\)와 \(q\)가 모두 짝수이면 \(\gcd(p, q) \ge 2\)로, 기약분수라는 가정에 모순입니다.`,
          en: String.raw`Substituting gives \(4k^2 = 2q^2\), i.e. \(q^2 = 2k^2\), so \(q^2\) is even too — and the same argument makes \(q\) even. But \(p\) and \(q\) both even means \(\gcd(p, q) \ge 2\), contradicting the lowest-terms assumption.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(\left(\frac{p}{q}\right)^2 = 2\)인 유리수는 존재하지 않습니다. \(\frac{7}{5}, \frac{17}{12}\)처럼 제곱이 \(2\)에 아무리 가까워져도 (문제 3) 정확히 \(2\)에 닿는 분수는 없습니다 — 유리수 직선에는 \(\sqrt{2}\) 자리에 구멍이 뚫려 있습니다.`,
          en: String.raw`Hence no rational squares to \(2\). However close a square gets to \(2\) — like \(\frac{7}{5}\) or \(\frac{17}{12}\) (problem 3) — no fraction lands exactly on \(2\): the rational line has a hole where \(\sqrt{2}\) should be.`,
        },
      },
    ],
  },
  {
    id: 'sqrt2-irrational-lowest-terms',
    statement: {
      ko: String.raw`모든 양의 유리수는 기약분수로 나타낼 수 있음을 정렬성 원리(well-ordering)로 완전히 증명하세요.`,
      en: String.raw`Prove completely, by the well-ordering principle, that every positive rational has a lowest-terms representation.`,
    },
    display: [
      String.raw`\forall\, r > 0\ \text{rational},\ \exists\, p, q \in \mathbb{N}:\ r = \frac{p}{q},\ \gcd(p, q) = 1`,
    ],
    preset: { denom: 5 },
    presetCaption: {
      ko: String.raw`\(N = 5\): 점들은 모두 기약분수로 찍혀 있습니다 (예: \(6/4\)가 아니라 \(3/2\)) — 같은 값을 나타내는 분수들 중 분모가 가장 작은 대표를 택한 것입니다.`,
      en: String.raw`\(N = 5\): every dot is drawn in lowest terms (e.g. \(3/2\), never \(6/4\)) — of all fractions naming the same value, the one with the smallest denominator is chosen as the representative.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`양의 유리수 \(r\)를 고정합니다. \(S = \{n \in \mathbb{N} : \text{어떤 } m \in \mathbb{N}\text{에 대해 } r = m/n\}\)이라 두면, \(r = a/b\) (\(a, b\) 양의 정수)라 쓸 수 있으므로 \(b \in S\) — \(S\)는 자연수의 비어 있지 않은 부분집합입니다. (여기서 \(\mathbb{N} = \{1, 2, 3, \dots\}\)입니다.)`,
          en: String.raw`Fix a positive rational \(r\). Let \(S = \{n \in \mathbb{N} : r = m/n \text{ for some } m \in \mathbb{N}\}\); since \(r = a/b\) for positive integers \(a, b\), we have \(b \in S\) — so \(S\) is a nonempty subset of \(\mathbb{N}\). (Here \(\mathbb{N} = \{1, 2, 3, \dots\}\).)`,
        },
      },
      {
        text: {
          ko: String.raw`정렬성 원리에 의해 \(S\)는 최소 원소 \(q_0\)를 갖습니다. \(r = p_0/q_0\)인 \(p_0 \in \mathbb{N}\)를 택합니다. 이제 \(\gcd(p_0, q_0) = 1\)임을 보입니다.`,
          en: String.raw`By the well-ordering principle, \(S\) has a least element \(q_0\). Pick \(p_0 \in \mathbb{N}\) with \(r = p_0/q_0\). We now show \(\gcd(p_0, q_0) = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`만약 \(d = \gcd(p_0, q_0) > 1\)이면 \(r = \frac{p_0/d}{q_0/d}\)이고 \(q_0/d < q_0\)이므로 \(q_0/d \in S\) — \(q_0\)의 최소성에 모순입니다. 따라서 \(d = 1\)이어야 하고, \(r = p_0/q_0\)은 기약분수입니다.`,
          en: String.raw`If \(d = \gcd(p_0, q_0) > 1\), then \(r = \frac{p_0/d}{q_0/d}\) with \(q_0/d < q_0\), so \(q_0/d \in S\) — contradicting the minimality of \(q_0\). Hence \(d = 1\), and \(r = p_0/q_0\) is in lowest terms.`,
        },
      },
      {
        text: {
          ko: String.raw`위 증명은 위 문제 1에서 "기약분수로 둘 수 있다"고 한 근거입니다: 제곱해서 \(2\)가 되는 유리수가 있다면, 분모가 가장 작은 것부터 살펴봐도 되는데, 바로 그 최소 분모의 분수가 짝수/짝수 모순에 걸립니다.`,
          en: String.raw`This justifies the "we may take lowest terms" step in problem 1: if some rational squared to \(2\), we could look at one with the smallest denominator — and it is exactly that minimal-denominator fraction that falls into the even/even contradiction.`,
        },
      },
    ],
  },
  {
    id: 'sqrt2-irrational-convergents',
    statement: {
      ko: String.raw`\(\left(\frac{7}{5}\right)^2 = \frac{49}{25} < 2 < \frac{289}{144} = \left(\frac{17}{12}\right)^2\)임을 직접 계산으로 확인하고, 두 분수의 차가 \(\frac{1}{60} < 0.06\)임을 보여 유리수가 \(2\) (의 제곱근 자리)에 원하는 만큼 가까워질 수 있음을 수치로 입증하세요.`,
      en: String.raw`Verify by direct computation that \(\left(\frac{7}{5}\right)^2 = \frac{49}{25} < 2 < \frac{289}{144} = \left(\frac{17}{12}\right)^2\), and show the two fractions differ by \(\frac{1}{60} < 0.06\) — numerical evidence that rationals get arbitrarily close to the \(\sqrt{2}\) slot.`,
    },
    display: [
      String.raw`\left(\frac{7}{5}\right)^2 = \frac{49}{25} < 2 < \frac{289}{144} = \left(\frac{17}{12}\right)^2`,
      String.raw`\frac{17}{12} - \frac{7}{5} = \frac{1}{60} \approx 0.0167 < 0.06`,
    ],
    preset: { denom: 12 },
    presetCaption: {
      ko: String.raw`\(N = 12\): \(\sqrt{2}\)에 가장 가까운 유리수는 \(17/12 \approx 1.41667\) (거리 약 \(0.00245\))이고, \(7/5 \approx 1.4\)도 점으로 찍혀 있습니다 — 두 분수가 \(2\)를 양쪽에서 조여오는 모습입니다.`,
      en: String.raw`\(N = 12\): the closest rational to \(\sqrt{2}\) is \(17/12 \approx 1.41667\) (distance about \(0.00245\)), and \(7/5 \approx 1.4\) is drawn too — the two fractions squeeze \(2\) from both sides.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`직접 계산합니다: \(\left(\frac{7}{5}\right)^2 = \frac{49}{25} = 1.96 < 2\)이고, \(\left(\frac{17}{12}\right)^2 = \frac{289}{144} = 2.0069\ldots > 2\)입니다 (정수 비교로 정확히 검증됩니다: \(49 < 50 = 2 \times 25\)이므로 \(\frac{49}{25} < 2\), \(289 > 288 = 2 \times 144\)이므로 \(\frac{289}{144} > 2\)).`,
          en: String.raw`Compute directly: \(\left(\frac{7}{5}\right)^2 = \frac{49}{25} = 1.96 < 2\) and \(\left(\frac{17}{12}\right)^2 = \frac{289}{144} = 2.0069\ldots > 2\) (verified exactly by integer comparison: \(49 < 50 = 2 \times 25\) gives \(\frac{49}{25} < 2\), and \(289 > 288 = 2 \times 144\) gives \(\frac{289}{144} > 2\)).`,
        },
      },
      {
        text: {
          ko: String.raw`두 분수의 차이는 \(\frac{17}{12} - \frac{7}{5} = \frac{85 - 84}{60} = \frac{1}{60} \approx 0.0167 < 0.06\)입니다. 제곱값의 차이도 \(\frac{289}{144} - \frac{49}{25} = \frac{7225 - 7056}{3600} = \frac{169}{3600} < 0.05\)로 작습니다 — \(2\)를 사이에 둔 폭 \(0.05\) 미만의 구간 안에 두 유리수의 제곱이 모두 들어갑니다.`,
          en: String.raw`The fractions differ by \(\frac{17}{12} - \frac{7}{5} = \frac{85 - 84}{60} = \frac{1}{60} \approx 0.0167 < 0.06\). Their squares differ by \(\frac{289}{144} - \frac{49}{25} = \frac{7225 - 7056}{3600} = \frac{169}{3600} < 0.05\) — both squares sit inside an interval of width under \(0.05\) straddling \(2\).`,
        },
      },
      {
        text: {
          ko: String.raw`일반 단계 (위의 수치 예시는 설명일 뿐입니다): \(\sqrt{2}\)의 연분수 수렴분수 \(p_k/q_k\) (\(1/1, 3/2, 7/5, 17/12, \dots\), \(q_k\)는 증가하며 무한히 커짐)는 행렬식 항등식 \(|p_k q_{k-1} - p_{k-1} q_k| = 1\)을 만족하므로 \(\left|\frac{p_k}{q_k} - \frac{p_{k-1}}{q_{k-1}}\right| = \frac{1}{q_k q_{k-1}}\)이고, 연속한 수렴분수 사이에 \(\sqrt{2}\)가 끼어 있어 \(\left|\sqrt{2} - \frac{p_k}{q_k}\right| \le \frac{1}{q_k q_{k+1}} \le \frac{1}{q_k^2}\)입니다. 따라서 임의의 \(\varepsilon > 0\)에 대해 \(\frac{1}{q_k^2} < \varepsilon\)인 \(k\)를 택하면 \(\left|\sqrt{2} - \frac{p_k}{q_k}\right| < \varepsilon\)입니다 — 유리수는 \(\sqrt{2}\)에 원하는 만큼 (\( \forall \varepsilon > 0\)) 가까워집니다.`,
          en: String.raw`General step (the numeric instance above is only an illustration): the continued-fraction convergents \(p_k/q_k\) of \(\sqrt{2}\) (\(1/1, 3/2, 7/5, 17/12, \dots\), with \(q_k\) increasing and unbounded) satisfy the determinant identity \(|p_k q_{k-1} - p_{k-1} q_k| = 1\), hence \(\left|\frac{p_k}{q_k} - \frac{p_{k-1}}{q_{k-1}}\right| = \frac{1}{q_k q_{k-1}}\), and since \(\sqrt{2}\) lies between consecutive convergents, \(\left|\sqrt{2} - \frac{p_k}{q_k}\right| \le \frac{1}{q_k q_{k+1}} \le \frac{1}{q_k^2} \to 0\). So given any \(\varepsilon > 0\), choosing \(k\) with \(\frac{1}{q_k^2} < \varepsilon\) gives \(\left|\sqrt{2} - \frac{p_k}{q_k}\right| < \varepsilon\) — rationals get arbitrarily close (\(\forall \varepsilon > 0\)) to \(\sqrt{2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`문제 1에 의해 이 구간 안에 제곱이 정확히 \(2\)인 유리수는 없습니다. 그럼에도 \(\frac{7}{5}, \frac{17}{12}\)처럼 \(2\)를 양쪽에서 조이는 유리수는 얼마든지 찾을 수 있고(모델에서 \(N\)을 키울수록 최단 거리가 \(0.0142 \to 0.00245 \to \cdots\)로 줄어듭니다), 위의 일반 추정과 함께 이는 유리수가 \(\sqrt{2}\) 자리에 원하는 만큼 가까워질 수 있음 — 그러나 결코 닿지 않음 — 을 보여줍니다. 이 구멍을 메우는 수가 바로 상한 공리로 존재가 보장되는 \(\sqrt{2}\)입니다 (n제곱근 장면).`,
          en: String.raw`By problem 1, no rational in this interval squares to exactly \(2\). Yet rationals squeezing \(2\) from both sides, like \(\frac{7}{5}\) and \(\frac{17}{12}\), are easy to find (in the model the shortest distance shrinks \(0.0142 \to 0.00245 \to \cdots\) as \(N\) grows), and together with the general estimate above this shows the rationals get as close as one likes to the \(\sqrt{2}\) slot, but never touch it. The number filling this hole is the \(\sqrt{2}\) whose existence the least-upper-bound axiom guarantees (the n-th root scene).`,
        },
      },
    ],
  },
];
