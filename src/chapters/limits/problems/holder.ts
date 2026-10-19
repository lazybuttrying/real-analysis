import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Hölder scene. Imports nothing
 * except types. Every number below was verified against the model
 * (tests/holder.test.ts): for a = (1, 1/2, ..., 1/n), b = (1, ..., 1),
 * LHS = H_n, RHS = (sum k^{-p})^{1/p} n^{1/q}, gap >= 0 over the full
 * p/n sweep, with the gap closing as p -> 1+.
 */
export const holderProblems: readonly ProblemMeta[] = [
  {
    id: 'holder-young',
    statement: {
      ko: String.raw`켤레 지수 \(1/p + 1/q = 1\) (\(1 < p, q < \infty\))에 대해 영의 부등식 \(ab \le \frac{a^p}{p} + \frac{b^q}{q}\) (\(a, b \ge 0\))를 \(\log\)의 오목성을 이용해 완전히 증명하세요.`,
      en: String.raw`For conjugate exponents \(1/p + 1/q = 1\) (\(1 < p, q < \infty\)), prove Young's inequality \(ab \le \frac{a^p}{p} + \frac{b^q}{q}\) (\(a, b \ge 0\)) completely, using the concavity of \(\log\).`,
    },
    display: [
      String.raw`ab \le \frac{a^p}{p} + \frac{b^q}{q}, \qquad \text{equality} \iff a^p = b^q`,
    ],
    preset: { p: 2, n: 8 },
    presetCaption: {
      ko: String.raw`\(p = 2\), \(n = 8\): 영의 부등식은 각 항 \(a_k b_k \le \frac{a_k^2}{2} + \frac{b_k^2}{2}\)에 들어가고, 합하면 횔더 부등식(코시-슈바르츠)이 됩니다.`,
      en: String.raw`\(p = 2\), \(n = 8\): Young's inequality feeds each term \(a_k b_k \le \frac{a_k^2}{2} + \frac{b_k^2}{2}\), and summing gives Hölder (Cauchy–Schwarz).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(a = 0\) 또는 \(b = 0\)이면 양변이 자명하므로 (\(0 \le\) 우변) \(a, b > 0\)이라 둡니다. \(ab = \exp(\log a + \log b) = \exp\left(\frac{1}{p}\log(a^p) + \frac{1}{q}\log(b^q)\right)\)입니다. \(\log\)는 오목함수이므로 가중 젠센 부등식 \(\log\left(\frac{X}{p} + \frac{Y}{q}\right) \ge \frac{1}{p}\log X + \frac{1}{q}\log Y\) (\(X, Y > 0\))가 성립합니다.`,
          en: String.raw`If \(a = 0\) or \(b = 0\) both sides are trivial (\(0 \le\) the right side), so take \(a, b > 0\). Then \(ab = \exp(\log a + \log b) = \exp\left(\frac{1}{p}\log(a^p) + \frac{1}{q}\log(b^q)\right)\). Since \(\log\) is concave, the weighted Jensen inequality \(\log\left(\frac{X}{p} + \frac{Y}{q}\right) \ge \frac{1}{p}\log X + \frac{1}{q}\log Y\) (\(X, Y > 0\)) holds.`,
        },
      },
      {
        text: {
          ko: String.raw`\(X = a^p\), \(Y = b^q\)를 대입하면 \(\frac{1}{p}\log(a^p) + \frac{1}{q}\log(b^q) \le \log\left(\frac{a^p}{p} + \frac{b^q}{q}\right)\)입니다. 양변에 단조증가인 \(\exp\)를 씌우면 \(\exp\left(\frac{1}{p}\log(a^p) + \frac{1}{q}\log(b^q)\right) = ab \le \frac{a^p}{p} + \frac{b^q}{q}\) — 영의 부등식 증명 완료.`,
          en: String.raw`With \(X = a^p\), \(Y = b^q\) this gives \(\frac{1}{p}\log(a^p) + \frac{1}{q}\log(b^q) \le \log\left(\frac{a^p}{p} + \frac{b^q}{q}\right)\). Applying the monotone \(\exp\) to both sides, \(\exp\left(\frac{1}{p}\log(a^p) + \frac{1}{q}\log(b^q)\right) = ab \le \frac{a^p}{p} + \frac{b^q}{q}\) — Young's inequality proved.`,
        },
      },
      {
        text: {
          ko: String.raw`등호 조건: \(\log\)는 엄격 오목(stricly concave)이므로 젠센에서 등호는 \(X = Y\)일 때, 즉 \(a^p = b^q\)일 때만 성립합니다. 이 등호 조건이 아래 문제 3에서 횔더의 등호 조건으로 이어집니다.`,
          en: String.raw`Equality case: \(\log\) is strictly concave, so Jensen gives equality only when \(X = Y\), i.e. \(a^p = b^q\). This equality condition becomes Hölder's equality case in problem 3 below.`,
        },
      },
    ],
  },
  {
    id: 'holder-from-young',
    statement: {
      ko: String.raw`영의 부등식으로부터 정규화(normalization) 논증으로 횔더 부등식 \(\sum_{k=1}^{n} |a_k b_k| \le \left(\sum |a_k|^p\right)^{1/p}\left(\sum |b_k|^q\right)^{1/q}\)를 완전히 증명하세요.`,
      en: String.raw`Derive Hölder's inequality \(\sum_{k=1}^{n} |a_k b_k| \le \left(\sum |a_k|^p\right)^{1/p}\left(\sum |b_k|^q\right)^{1/q}\) completely from Young's inequality by the normalization argument.`,
    },
    display: [
      String.raw`\sum A_k B_k \le \sum\left(\frac{A_k^p}{p} + \frac{B_k^q}{q}\right) = \frac{1}{p} + \frac{1}{q} = 1`,
    ],
    preset: { p: 3, n: 8 },
    presetCaption: {
      ko: String.raw`\(p = 3\) (\(q = 1.5\)), \(n = 8\): 좌변 \(H_8 \approx 2.7179\), 우변 \(\approx 4.245\) — 틈새가 양수이며 부등식이 성립합니다.`,
      en: String.raw`\(p = 3\) (\(q = 1.5\)), \(n = 8\): left side \(H_8 \approx 2.7179\), right side \(\approx 4.245\) — the gap is positive and the inequality holds.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(\|a\|_p = 0\)이면 모든 \(a_k = 0\)이라 양변이 0이고, \(\|b\|_q = 0\)도 마찬가지이므로, \(\|a\|_p, \|b\|_q > 0\)이라 둡니다. 정규화된 수열 \(A_k = |a_k|/\|a\|_p\), \(B_k = |b_k|/\|b\|_q\)를 정의하면 \(\sum A_k^p = 1\), \(\sum B_k^q = 1\)입니다.`,
          en: String.raw`If \(\|a\|_p = 0\) then every \(a_k = 0\) and both sides are 0; likewise for \(\|b\|_q = 0\). So assume \(\|a\|_p, \|b\|_q > 0\). Define the normalized sequences \(A_k = |a_k|/\|a\|_p\), \(B_k = |b_k|/\|b\|_q\); then \(\sum A_k^p = 1\) and \(\sum B_k^q = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`각 \(k\)에 영의 부등식을 적용합니다: \(A_k B_k \le \frac{A_k^p}{p} + \frac{B_k^q}{q}\). \(k = 1, \dots, n\)에 대해 합하면 \(\sum A_k B_k \le \frac{1}{p}\sum A_k^p + \frac{1}{q}\sum B_k^q = \frac{1}{p} + \frac{1}{q} = 1\)입니다.`,
          en: String.raw`Apply Young's inequality to each \(k\): \(A_k B_k \le \frac{A_k^p}{p} + \frac{B_k^q}{q}\). Summing over \(k = 1, \dots, n\) gives \(\sum A_k B_k \le \frac{1}{p}\sum A_k^p + \frac{1}{q}\sum B_k^q = \frac{1}{p} + \frac{1}{q} = 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`양변에 \(\|a\|_p\|b\|_q\)를 곱하면 \(\sum |a_k b_k| = \|a\|_p\|b\|_q \sum A_k B_k \le \|a\|_p\|b\|_q\) — 횔더 부등식 증명 완료. \(p = q = 2\)인 경우가 코시-슈바르츠 부등식입니다. 씬에서 \(p\)를 움직이면 이 우변이 어떻게 팽창·수축하는지 보입니다.`,
          en: String.raw`Multiplying both sides by \(\|a\|_p\|b\|_q\) gives \(\sum |a_k b_k| = \|a\|_p\|b\|_q \sum A_k B_k \le \|a\|_p\|b\|_q\) — Hölder's inequality proved. The case \(p = q = 2\) is Cauchy–Schwarz. Sliding \(p\) in the scene shows how this right side inflates and deflates.`,
        },
      },
    ],
  },
  {
    id: 'holder-equality',
    statement: {
      ko: String.raw`횔더 부등식에서 등호가 성립할 조건이 \(|a_k|^p\)와 \(|b_k|^q\)의 비례 관계임을 증명하세요: \(|a_k|^p = C\,|b_k|^q\) (모든 \(k\), 어떤 상수 \(C \ge 0\)).`,
      en: String.raw`Prove that equality in Hölder's inequality holds exactly when \(|a_k|^p\) is proportional to \(|b_k|^q\): \(|a_k|^p = C\,|b_k|^q\) for all \(k\) and some constant \(C \ge 0\).`,
    },
    display: [
      String.raw`\text{equality} \iff \left[\|a\|_p = 0 \text{ or } \|b\|_q = 0\right] \text{ or } \left[A_k^p = B_k^q \;\forall k \iff |a_k|^p = C\,|b_k|^q\right]`,
    ],
    preset: { p: 2, n: 8 },
    presetCaption: {
      ko: String.raw`\(p = 2\), \(n = 8\): \(a_k = 1/k\)는 상수 수열 \(b_k = 1\)과 비례하지 않으므로 틈새가 0이 아닙니다 — 등호 조건이 왜 깨지는지 보입니다.`,
      en: String.raw`\(p = 2\), \(n = 8\): \(a_k = 1/k\) is not proportional to the constant sequence \(b_k = 1\), so the gap is nonzero — showing why the equality condition fails.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 퇴화 경우를 분리합니다. \(\|a\|_p = 0\)이면 모든 \(a_k = 0\)이므로 \(\sum |a_k b_k| = 0 = 0 \cdot \|b\|_q\) — 등호가 자동으로 성립합니다 (\(\|b\|_q = 0\)인 경우도 마찬가지). 주의: \(b = 0\)이고 \(a \ne 0\)인 경우 등호 \(\sum |a_k b_k| = 0 = \|a\|_p \cdot 0\)은 성립하지만, \(|a_k|^p = C|b_k|^q\)를 만족하는 \(C \ge 0\)은 존재하지 않습니다 (우변은 항상 0인데 어떤 \(k\)에서는 \(|a_k|^p > 0\)). 따라서 비례 관계는 \(\|a\|_p, \|b\|_q > 0\)인 경우의 등호 조건이며, 전체 정확한 서술은 "한 수열이 0이거나, 두 노름이 모두 양수이고 거듭제곱이 비례"입니다.`,
          en: String.raw`Separate the degenerate case first. If \(\|a\|_p = 0\) then every \(a_k = 0\), so \(\sum |a_k b_k| = 0 = 0 \cdot \|b\|_q\) — equality holds automatically (likewise if \(\|b\|_q = 0\)). Note: with \(b = 0\) but \(a \ne 0\), the equality \(\sum |a_k b_k| = 0 = \|a\|_p \cdot 0\) holds, yet no \(C \ge 0\) satisfies \(|a_k|^p = C|b_k|^q\) (the right side is identically 0 while some \(|a_k|^p > 0\)). So proportionality is the equality condition only when \(\|a\|_p, \|b\|_q > 0\); the full precise statement is "either one sequence is zero, or both norms are positive and the powers are proportional".`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(\|a\|_p, \|b\|_q > 0\)이라 둡니다. 문제 2의 증명에서 부등식은 딱 한 곳에서만 일어났습니다: 각 항에 적용한 영의 부등식 \(A_k B_k \le \frac{A_k^p}{p} + \frac{B_k^q}{q}\)입니다 (그 합 \(\frac{1}{p}\sum A_k^p + \frac{1}{q}\sum B_k^q = 1\)은 항등식). 따라서 전체에서 등호가 성립할 필요충분조건은 모든 \(k\)에서 영의 부등식이 등호가 되는 것입니다. 문제 1의 등호 조건에 의해 이는 \(A_k^p = B_k^q\) (모든 \(k\))와 동치이고, 정규화를 풀면 \(\frac{|a_k|^p}{\|a\|_p^p} = \frac{|b_k|^q}{\|b\|_q^q}\) — 즉 \(|a_k|^p = C|b_k|^q\) (단 \(C = \|a\|_p^p/\|b\|_q^q \ge 0\)는 \(k\)와 무관)입니다. 역도 성립합니다: 이 비례식이 있으면 정규화 후 \(A_k^p = B_k^q\)가 되어 모든 영의 부등식이 등호가 됩니다.`,
          en: String.raw`Now assume \(\|a\|_p, \|b\|_q > 0\). In problem 2's proof the inequality happened in exactly one place: Young's inequality \(A_k B_k \le \frac{A_k^p}{p} + \frac{B_k^q}{q}\) applied to each term (its sum \(\frac{1}{p}\sum A_k^p + \frac{1}{q}\sum B_k^q = 1\) is an identity). So equality overall holds if and only if Young's inequality is an equality for every \(k\). By problem 1's equality condition this is equivalent to \(A_k^p = B_k^q\) for every \(k\); unwinding the normalization gives \(\frac{|a_k|^p}{\|a\|_p^p} = \frac{|b_k|^q}{\|b\|_q^q}\) — i.e. \(|a_k|^p = C|b_k|^q\) with \(C = \|a\|_p^p/\|b\|_q^q \ge 0\) independent of \(k\). The converse holds too: this proportionality gives \(A_k^p = B_k^q\) after normalization, making every Young's inequality an equality.`,
        },
      },
      {
        text: {
          ko: String.raw`씬의 \(a_k = 1/k\), \(b_k = 1\)에서는 두 노름이 모두 양수이고 \(|a_k|^p\)가 상수가 아니므로 틈새가 0이 될 수 없습니다 — \(p \to 1^+\)에서 틈새가 0으로 가는 것은 비례 때문이 아니라 우변 자체가 무너지는 극한 현상입니다.`,
          en: String.raw`In the scene, \(a_k = 1/k\) and \(b_k = 1\) have both norms positive but \(|a_k|^p\) is not constant, so the gap can never be 0 — the gap closing as \(p \to 1^+\) is a collapse of the right side itself, not proportionality.`,
        },
      },
    ],
  },
];
