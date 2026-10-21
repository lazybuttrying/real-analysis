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
          ko: String.raw`등호 조건: \(\log\)는 엄격 오목(strictly concave)이므로 \(a, b > 0\)인 경우 젠센에서 등호는 \(X = Y\)일 때, 즉 \(a^p = b^q\)일 때만 성립합니다. 0인 경우도 직접 확인합니다: \(a = 0\)이면 좌변은 \(ab = 0\)이고 부등식은 \(0 \le \frac{b^q}{q}\)가 되는데, 등호는 \(b^q = 0\), 즉 \(b = 0\)일 때만 성립합니다 — 이는 \(a^p = b^q\) (\(0 = b^q\))와 정확히 일치합니다 (\(b = 0\)인 경우도 대칭으로 같습니다). 따라서 모든 경우에 등호 \(\iff a^p = b^q\)입니다. 이 등호 조건이 아래 문제 3에서 횔더의 등호 조건으로 이어집니다.`,
          en: String.raw`Equality case: \(\log\) is strictly concave, so for \(a, b > 0\) Jensen gives equality only when \(X = Y\), i.e. \(a^p = b^q\). Verify the zero cases directly as well: if \(a = 0\) then the left side is \(ab = 0\) and the inequality reads \(0 \le \frac{b^q}{q}\), with equality only when \(b^q = 0\), i.e. \(b = 0\) — exactly what \(a^p = b^q\) (namely \(0 = b^q\)) asserts; the case \(b = 0\) is symmetric. Hence in all cases equality holds if and only if \(a^p = b^q\). This equality condition becomes Hölder's equality case in problem 3 below.`,
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
      ko: String.raw`횔더 부등식의 등호 조건을 정확히 증명하세요: 등호가 성립하는 것은 \(\|a\|_p \|b\|_q = 0\) (\(a, b\) 중 하나가 0인 수열이라 양변이 모두 0)인 경우이거나, 모든 \(k\)에 대해 \(|a_k|^p = C\,|b_k|^q\)인 상수 \(C > 0\)이 존재하는 경우이며, 이 두 경우가 전부입니다.`,
      en: String.raw`Prove the exact equality condition in Hölder's inequality: equality holds if and only if either \(\|a\|_p \|b\|_q = 0\) (one of \(a, b\) is the zero sequence, so both sides are \(0\)), or there exists a constant \(C > 0\) with \(|a_k|^p = C\,|b_k|^q\) for all \(k\).`,
    },
    display: [
      String.raw`\text{equality} \iff \Big[\|a\|_p \|b\|_q = 0\Big] \ \text{or}\ \Big[\exists\, C > 0:\ |a_k|^p = C\,|b_k|^q \ \forall k\Big]`,
    ],
    preset: { p: 2, n: 8 },
    presetCaption: {
      ko: String.raw`\(p = 2\), \(n = 8\): \(a_k = 1/k\)는 상수 수열 \(b_k = 1\)과 비례하지 않으므로 틈새가 0이 아닙니다 — 등호 조건이 왜 깨지는지 보입니다.`,
      en: String.raw`\(p = 2\), \(n = 8\): \(a_k = 1/k\) is not proportional to the constant sequence \(b_k = 1\), so the gap is nonzero — showing why the equality condition fails.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`먼저 퇴화 경우를 분리합니다. \(\|a\|_p \|b\|_q = 0\)이면 \(a, b\) 중 하나가 0인 수열이므로 \(\sum |a_k b_k| = 0\)이고 우변도 \(0\) — 등호가 자동으로 성립합니다. 주의: \(b = 0\)이고 \(a \ne 0\)인 경우 이 등호는 성립하지만, \(|a_k|^p = C|b_k|^q\)를 만족하는 상수는 \(C > 0\)은커녕 \(C \ge 0\)조차 존재하지 않습니다 (우변은 항상 0인데 어떤 \(k\)에서는 \(|a_k|^p > 0\)). 그래서 명제의 첫 번째 가지가 반드시 필요합니다. 아래 두 방향 모두에서 퇴화 경우는 이 단락으로 처리하고, 비례 가지는 \(\|a\|_p, \|b\|_q > 0\)인 경우로 한정합니다.`,
          en: String.raw`Separate the degenerate case first. If \(\|a\|_p \|b\|_q = 0\) then one of \(a, b\) is the zero sequence, so \(\sum |a_k b_k| = 0\) and the right side is also \(0\) — equality holds automatically. Note: with \(b = 0\) but \(a \ne 0\), this equality holds, yet no constant — not even \(C \ge 0\), let alone \(C > 0\) — satisfies \(|a_k|^p = C|b_k|^q\) (the right side is identically 0 while some \(|a_k|^p > 0\)). That is why the first branch of the statement is indispensable. In both directions below, the degenerate case is settled by this paragraph, and the proportional branch is treated under \(\|a\|_p, \|b\|_q > 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`\((\Rightarrow)\) \(\|a\|_p, \|b\|_q > 0\)이라 두고, 전체에서 등호가 성립한다고 가정합니다. 문제 2의 증명에서 부등식은 딱 한 곳에서만 일어났습니다: 각 항에 적용한 영의 부등식 \(A_k B_k \le \frac{A_k^p}{p} + \frac{B_k^q}{q}\)입니다. 등호인 경우 \(\sum_k A_k B_k = 1\)이고, \(\sum_k \left(\frac{A_k^p}{p} + \frac{B_k^q}{q}\right) = \frac{1}{p}\sum A_k^p + \frac{1}{q}\sum B_k^q = 1\)은 항등식이므로, 어느 한 항이라도 영의 부등식이 엄격하면 합의 부등식도 엄격해집니다 — 따라서 모든 \(k\)에서 등호입니다. 문제 1의 등호 조건에 의해 \(A_k^p = B_k^q\) (모든 \(k\))이고, 정규화를 풀면 \(\frac{|a_k|^p}{\|a\|_p^p} = \frac{|b_k|^q}{\|b\|_q^q}\) — 즉 \(|a_k|^p = C|b_k|^q\) (단 \(C = \|a\|_p^p/\|b\|_q^q > 0\) — 두 노름이 모두 양수이므로 — 이고 \(k\)와 무관)입니다.`,
          en: String.raw`\((\Rightarrow)\) Assume \(\|a\|_p, \|b\|_q > 0\) and that equality holds overall. In problem 2's proof the inequality happened in exactly one place: Young's inequality \(A_k B_k \le \frac{A_k^p}{p} + \frac{B_k^q}{q}\) applied to each term. Equality gives \(\sum_k A_k B_k = 1\), while \(\sum_k \left(\frac{A_k^p}{p} + \frac{B_k^q}{q}\right) = \frac{1}{p}\sum A_k^p + \frac{1}{q}\sum B_k^q = 1\) is an identity, so if any single term were strict, the summed inequality would be strict — hence equality holds for every \(k\). By problem 1's equality condition, \(A_k^p = B_k^q\) for every \(k\); unwinding the normalization gives \(\frac{|a_k|^p}{\|a\|_p^p} = \frac{|b_k|^q}{\|b\|_q^q}\) — i.e. \(|a_k|^p = C|b_k|^q\) with \(C = \|a\|_p^p/\|b\|_q^q > 0\) (both norms are positive) independent of \(k\).`,
        },
      },
      {
        text: {
          ko: String.raw`\((\Leftarrow)\) 반대로, 두 가지 중 하나를 가정합니다. 퇴화 가지 \(\|a\|_p \|b\|_q = 0\)이면 첫 단락에서 이미 양변이 \(0\)이라 등호를 확인했습니다 — 여기에 \(C = 0\)인 경우도 포함됩니다: \(|a_k|^p = 0 \cdot |b_k|^q\) (모든 \(k\))이면 \(a = 0\)이라 노름으로 나눌 필요 없이 첫 가지로 끝납니다. 비례 가지에서는 어떤 \(C > 0\)에 대해 \(|a_k|^p = C|b_k|^q\) (모든 \(k\))라 가정합니다. \(\|b\|_q = 0\)이면 \(b = 0\)이라 비례식에서 \(a = 0\)까지 따라와 퇴화 가지로 돌아가고, \(\|a\|_p = 0\)이면 \(a = 0\)이라 역시 퇴화 가지입니다. 남은 경우 \(\|a\|_p, \|b\|_q > 0\)에서는 노름으로 나누는 것이 정당합니다: 모든 \(k\)에 대해 합산하면 \(C = \|a\|_p^p/\|b\|_q^q\)이어야 하고, 정규화하면 \(A_k^p = \frac{|a_k|^p}{\|a\|_p^p} = \frac{|b_k|^q}{\|b\|_q^q} = B_k^q\)이므로, 문제 1의 등호 조건에 의해 모든 영의 부등식이 등호가 됩니다: \(A_k B_k = \frac{A_k^p}{p} + \frac{B_k^q}{q}\). 모두 합하면 \(\sum_k A_k B_k = \frac{1}{p}\sum_k A_k^p + \frac{1}{q}\sum_k B_k^q = \frac{1}{p} + \frac{1}{q} = 1\), 즉 \(\sum_k |a_k b_k| = \|a\|_p \|b\|_q\) — 횔더 부등식에서 등호가 성립합니다.`,
          en: String.raw`\((\Leftarrow)\) Conversely, assume one of the two branches. If the degenerate branch \(\|a\|_p \|b\|_q = 0\) holds, the first paragraph already verified equality with both sides \(0\) — this also covers the \(C = 0\) case: if \(|a_k|^p = 0 \cdot |b_k|^q\) for all \(k\), then \(a = 0\) and the first branch applies with no division by any norm. For the proportional branch, assume \(|a_k|^p = C|b_k|^q\) for all \(k\) and some \(C > 0\). If \(\|b\|_q = 0\) then \(b = 0\) and proportionality forces \(a = 0\) as well, returning to the degenerate branch; if \(\|a\|_p = 0\) then \(a = 0\), again the degenerate branch. In the remaining case \(\|a\|_p, \|b\|_q > 0\), division by the norms is legitimate: summing the proportionality over \(k\) forces \(C = \|a\|_p^p/\|b\|_q^q\), and after normalization \(A_k^p = \frac{|a_k|^p}{\|a\|_p^p} = \frac{|b_k|^q}{\|b\|_q^q} = B_k^q\), so by problem 1's equality condition every Young's inequality is an equality: \(A_k B_k = \frac{A_k^p}{p} + \frac{B_k^q}{q}\). Summing over \(k\) gives \(\sum_k A_k B_k = \frac{1}{p}\sum_k A_k^p + \frac{1}{q}\sum_k B_k^q = \frac{1}{p} + \frac{1}{q} = 1\), i.e. \(\sum_k |a_k b_k| = \|a\|_p \|b\|_q\) — equality in Hölder's inequality.`,
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
