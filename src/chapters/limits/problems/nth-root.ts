import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the n-th root scene
 * (Tao, Analysis I, Lemma 5.6.5). Imports nothing except types.
 * Every number below was verified against the model (tests/nth-root.test.ts):
 *   bisectRoot(2, 2) = 1.414213562373095,
 *     |diff| vs Math.SQRT2 = 2.220446049250313e-16;
 *   10 bisection steps on x^2 - 2: x_10 = 1.416015625,
 *     |x_10 - sqrt(2)| = 0.0018020626269048545 < 2/2^10 = 0.001953125.
 */
export const nthRootProblems: readonly ProblemMeta[] = [
  {
    id: 'nth-root-proof',
    statement: {
      ko: String.raw`\(a > 0\)와 자연수 \(n\)에 대해 \(E = \{x \ge 0 : x^n < a\}\)라 두세요. \(E\)가 비어 있지 않고 위로 유계임을 보이고, \(s = \sup E\)라 두었을 때 삼단논법으로 \(s^n = a\)임을 완전히 증명하세요.`,
      en: String.raw`For \(a > 0\) and a natural number \(n\), let \(E = \{x \ge 0 : x^n < a\}\). Show \(E\) is nonempty and bounded above, and with \(s = \sup E\) prove completely by trichotomy that \(s^n = a\).`,
    },
    display: [
      String.raw`E = \{x \ge 0 : x^n < a\}, \qquad s = \sup E, \qquad s^n = a`,
    ],
    preset: { a: 2, n: 2 },
    presetCaption: {
      ko: String.raw`\(a = 2\), \(n = 2\): 회색 영역이 \(E = \{x \ge 0 : x^2 < 2\}\)이고, 그 상한 \(s = \sup E\)가 수직 점선 위치의 \(\sqrt{2} \approx 1.41421356\)입니다. 아래 증명이 이 \(s\)가 정확히 \(a\)의 제곱근임을 보입니다.`,
      en: String.raw`\(a = 2\), \(n = 2\): the shaded region is \(E = \{x \ge 0 : x^2 < 2\}\), and its supremum \(s = \sup E\) sits at the vertical dashed line, \(\sqrt{2} \approx 1.41421356\). The proof below shows this \(s\) is exactly the square root of \(a\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(E\)는 비어 있지 않습니다: \(0^n = 0 < a\)이므로 \(0 \in E\)입니다. 또한 \(a + 1\)은 \(E\)의 상계입니다: \(x > a + 1\)이면 \(a > 0\)이므로 \(x > 1\)이고, 따라서 \(x^n \ge x > a + 1 > a\)라서 \(x \notin E\)입니다.`,
          en: String.raw`\(E\) is nonempty: \(0^n = 0 < a\), so \(0 \in E\). And \(a + 1\) is an upper bound of \(E\): if \(x > a + 1\) then, since \(a > 0\), \(x > 1\), hence \(x^n \ge x > a + 1 > a\), so \(x \notin E\).`,
        },
      },
      {
        text: {
          ko: String.raw`단조성 사실 하나를 직접 증명해 둡니다 (1단계와 4단계에서 쓰이며, 독립된 증명은 다음 문제입니다): \(0 \le u < v\)이면 \(v^n - u^n = (v - u)(v^{n-1} + v^{n-2}u + \cdots + u^{n-1}) > 0\)인데, \(v - u > 0\)이고 두 번째 인자는 \(v^{n-1} > 0\)을 포함하는 음이 아닌 항들의 합이기 때문입니다. 따라서 \(t \mapsto t^n\)은 \([0, \infty)\)에서 엄격히 증가하고, \(x \ge y \ge 0\)이면 \(x^n \ge y^n\)입니다. 실수의 완비성(상한 공리)에 의해 \(s = \sup E\)가 존재합니다. \(s \ge 0\)이며, \(s^n = a\)임을 삼단논법으로 보입니다: \(s^n < a\)와 \(s^n > a\)가 모두 불가능함을 보이면 \(s^n = a\)가 남습니다.`,
          en: String.raw`One monotonicity fact, proved directly (used in steps 1 and 4; the standalone proof is the next problem): for \(0 \le u < v\), \(v^n - u^n = (v - u)(v^{n-1} + v^{n-2}u + \cdots + u^{n-1}) > 0\), because \(v - u > 0\) and the second factor is a sum of nonnegative terms including \(v^{n-1} > 0\). Hence \(t \mapsto t^n\) is strictly increasing on \([0, \infty)\), and \(x \ge y \ge 0\) implies \(x^n \ge y^n\). By completeness of the reals (the least-upper-bound axiom), \(s = \sup E\) exists. We have \(s \ge 0\); we show \(s^n = a\) by trichotomy: ruling out \(s^n < a\) and \(s^n > a\) leaves \(s^n = a\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(s^n < a\)라 가정합니다. \(\delta > 0\)에 대해 이항정리로 \((s+\delta)^n - s^n = \sum_{k=1}^{n}\binom{n}{k}s^{n-k}\delta^k = \delta\sum_{k=1}^{n}\binom{n}{k}s^{n-k}\delta^{k-1}\)입니다. \(0 < \delta < 1\)이면 \(\delta^{k-1} \le 1\)이므로 이 차이는 \(\delta M\) 이하입니다. 여기서 \(M = \sum_{k=1}^{n}\binom{n}{k}(s+1)^{n-k}\)는 \(s\)에만 의존하는 상수입니다. \(0 < \delta < \min(1, (a - s^n)/M)\)을 잡으면 \((s+\delta)^n < s^n + (a - s^n) = a\)이고 \(s + \delta \ge 0\)이므로 \(s + \delta \in E\) — \(s\)가 상한이라는 데 모순입니다.`,
          en: String.raw`Suppose \(s^n < a\). For \(\delta > 0\), the binomial theorem gives \((s+\delta)^n - s^n = \sum_{k=1}^{n}\binom{n}{k}s^{n-k}\delta^k = \delta\sum_{k=1}^{n}\binom{n}{k}s^{n-k}\delta^{k-1}\). For \(0 < \delta < 1\), \(\delta^{k-1} \le 1\), so this difference is at most \(\delta M\), where \(M = \sum_{k=1}^{n}\binom{n}{k}(s+1)^{n-k}\) depends only on \(s\). Picking \(0 < \delta < \min(1, (a - s^n)/M)\) gives \((s+\delta)^n < s^n + (a - s^n) = a\), and \(s + \delta \ge 0\), so \(s + \delta \in E\) — contradicting \(s\) being an upper bound.`,
        },
      },
      {
        text: {
          ko: String.raw`\(s^n > a\)라 가정합니다. \(a \ge 0\)이므로 \(s > 0\)입니다. \(0 < \delta < s\)에 대해 \(t = s - \delta\)라 두면 인수분해 \(s^n - t^n = (s-t)(s^{n-1} + s^{n-2}t + \cdots + t^{n-1})\)에 의해 \(s^n - (s-\delta)^n = \delta\sum_{j=0}^{n-1}s^{n-1-j}t^j \le n\,\delta\,s^{n-1}\)입니다 (\(t \le s\)이므로 각 항이 \(s^{n-1}\) 이하). \(0 < \delta < \min(s, (s^n - a)/(n s^{n-1}))\)을 잡으면 \((s-\delta)^n > a\)입니다. 그런데 \(x \ge s - \delta\)인 모든 \(x\)는 \(x^n \ge (s-\delta)^n > a\)를 만족하므로 \(x \notin E\) — 즉 \(s - \delta\)도 \(E\)의 상계가 되어, \(s\)가 최소상한이라는 데 모순입니다.`,
          en: String.raw`Suppose \(s^n > a\). Since \(a \ge 0\), \(s > 0\). For \(0 < \delta < s\), put \(t = s - \delta\); the factorization \(s^n - t^n = (s-t)(s^{n-1} + s^{n-2}t + \cdots + t^{n-1})\) gives \(s^n - (s-\delta)^n = \delta\sum_{j=0}^{n-1}s^{n-1-j}t^j \le n\,\delta\,s^{n-1}\) (each term is at most \(s^{n-1}\) since \(t \le s\)). Picking \(0 < \delta < \min(s, (s^n - a)/(n s^{n-1}))\) yields \((s-\delta)^n > a\). But every \(x \ge s - \delta\) satisfies \(x^n \ge (s-\delta)^n > a\), so \(x \notin E\) — i.e. \(s - \delta\) is also an upper bound of \(E\), contradicting \(s\) being the least upper bound.`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(s^n = a\)이며, \(s \ge 0\)이므로 \(s\)는 \(a\)의 음이 아닌 \(n\)제곱근입니다. (유일성은 다음 문제.) 이 증명은 \(x^n\)의 연속성을 이항 전개로 직접 손으로 잡아낸 것으로, 상한 공리가 "구멍 없는" 실수 직선을 보장하기에 가능한 논증입니다.`,
          en: String.raw`Hence \(s^n = a\), and since \(s \ge 0\), \(s\) is the nonnegative \(n\)-th root of \(a\). (Uniqueness is the next problem.) This proof grabs the continuity of \(x^n\) by hand through the binomial expansion — an argument that works precisely because the least-upper-bound axiom guarantees a "hole-free" real line.`,
        },
      },
    ],
  },
  {
    id: 'nth-root-unique',
    statement: {
      ko: String.raw`\(s, t \ge 0\)이고 \(s^n = t^n = a\)이면 \(s = t\)임을 증명하세요 — 즉 음이 아닌 \(n\)제곱근은 유일합니다.`,
      en: String.raw`Prove that if \(s, t \ge 0\) and \(s^n = t^n = a\), then \(s = t\) — the nonnegative \(n\)-th root is unique.`,
    },
    display: [
      String.raw`t^n - s^n = (t-s)(t^{n-1} + t^{n-2}s + \cdots + s^{n-1})`,
    ],
    preset: { a: 2, n: 2 },
    presetCaption: {
      ko: String.raw`\(a = 2\), \(n = 2\): 수직 점선은 \(\sqrt{2} \approx 1.41421356\) 한 점에만 그어집니다 — 제곱해서 \(2\)가 되는 음이 아닌 수는 이것 하나뿐입니다.`,
      en: String.raw`\(a = 2\), \(n = 2\): the vertical dashed line is drawn at a single point, \(\sqrt{2} \approx 1.41421356\) — there is exactly one nonnegative number squaring to \(2\).`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(0 \le s < t\)라 가정합니다. 인수분해 \(t^n - s^n = (t-s)(t^{n-1} + t^{n-2}s + \cdots + s^{n-1})\)에서 첫 인자 \(t - s > 0\)이고, 두 번째 인자의 각 항은 \(t > 0\)이므로 \(0\)이 아니며 음이 아닙니다 (특히 \(t^{n-1} > 0\)). 따라서 \(t^n - s^n > 0\), 즉 \(s^n < t^n\)입니다. \(x^n\)은 \([0, \infty)\)에서 엄격히 증가합니다.`,
          en: String.raw`Suppose \(0 \le s < t\). In the factorization \(t^n - s^n = (t-s)(t^{n-1} + t^{n-2}s + \cdots + s^{n-1})\), the first factor \(t - s > 0\), and each term of the second factor is nonnegative and not all zero (in particular \(t^{n-1} > 0\), since \(t > 0\)). Hence \(t^n - s^n > 0\), i.e. \(s^n < t^n\): \(x^n\) is strictly increasing on \([0, \infty)\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(s^n = t^n = a\)인데 \(s \ne t\)라면, 대칭성에 의해 \(s < t\) 또는 \(t < s\)이고, 위에서 \(s^n \ne t^n\)이 되어 모순입니다. 따라서 \(s = t\) — 음이 아닌 \(n\)제곱근은 유일합니다.`,
          en: String.raw`If \(s^n = t^n = a\) with \(s \ne t\), then by symmetry \(s < t\) or \(t < s\), and the above gives \(s^n \ne t^n\) — a contradiction. Hence \(s = t\): the nonnegative \(n\)-th root is unique.`,
        },
      },
    ],
  },
  {
    id: 'nth-root-approx',
    statement: {
      ko: String.raw`이분법으로 \(a\)의 \(n\)제곱근을 근사할 때, \(k\)번째 중점 \(x_k\)에 대한 오차 상한 \(|x_k - s| \le \frac{b_0 - a_0}{2^k}\)를 증명하고, \(a = 2\), \(n = 2\)에서 10단계를 직접 계산해 상한을 수치로 검증하세요.`,
      en: String.raw`When approximating the \(n\)-th root of \(a\) by bisection, prove the error bound \(|x_k - s| \le \frac{b_0 - a_0}{2^k}\) for the \(k\)-th midpoint \(x_k\), and verify it numerically by computing 10 steps for \(a = 2\), \(n = 2\).`,
    },
    display: [
      String.raw`\lvert x_k - s\rvert \le \frac{b_0 - a_0}{2^k}, \qquad x_{10} = 1.416015625`,
      String.raw`\lvert x_{10} - \sqrt{2}\rvert \approx 0.0018021 < \frac{2}{2^{10}} = 0.001953125`,
    ],
    preset: { a: 2, n: 2 },
    presetCaption: {
      ko: String.raw`\(a = 2\), \(n = 2\): 이분법 60회 반복으로 \(\sqrt{2} \approx 1.41421356\)을 얻습니다 (\(|\text{diff}| \approx 2.2\times 10^{-16}\)). 아래는 10단계에서의 오차 상한을 직접 확인합니다.`,
      en: String.raw`\(a = 2\), \(n = 2\): 60 bisection iterations give \(\sqrt{2} \approx 1.41421356\) (\(|\text{diff}| \approx 2.2\times 10^{-16}\)). Below, the error bound is checked directly at 10 steps.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`구간 \([a_0, b_0] = [0, \max(1, a)]\)에서 시작합니다: \(a_0^n - a = -a < 0 \le b_0^n - a\)이므로 (유일한) 근 \(s\)가 이 구간 안에 있습니다. 매 단계 중점 \(m\)에서 \(m^n < a\)이면 왼쪽 구간을 버리고(\(s > m\)), 아니면 오른쪽을 버립니다(\(s \le m\)) — 부호가 \(s\)를 가두므로 불변식 \(s \in [a_k, b_k]\)가 유지되고, 구간 길이는 매번 절반이 됩니다: \(b_k - a_k = \frac{b_0 - a_0}{2^k}\).`,
          en: String.raw`Start from \([a_0, b_0] = [0, \max(1, a)]\): \(a_0^n - a = -a < 0 \le b_0^n - a\), so the (unique) root \(s\) lies inside. At each step, at the midpoint \(m\), if \(m^n < a\) discard the left half (\(s > m\)), else discard the right (\(s \le m\)) — the sign brackets \(s\), so the invariant \(s \in [a_k, b_k]\) is preserved and the length halves each time: \(b_k - a_k = \frac{b_0 - a_0}{2^k}\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(x_k = \frac{a_k + b_k}{2}\)는 구간의 중점이므로, \(s\)가 같은 구간 안에 있으면 \(|x_k - s| \le \frac{b_k - a_k}{2} = \frac{b_0 - a_0}{2^{k+1}} \le \frac{b_0 - a_0}{2^k}\)입니다. (인덱스를 1부터 세면 정확히 \(\frac{b_0-a_0}{2^k}\)가 됩니다.) 오차는 매 단계 최소 절반씩 줄어듭니다.`,
          en: String.raw`Since \(x_k = \frac{a_k + b_k}{2}\) is the midpoint and \(s\) lies in the same interval, \(|x_k - s| \le \frac{b_k - a_k}{2} = \frac{b_0 - a_0}{2^{k+1}} \le \frac{b_0 - a_0}{2^k}\). (Counting steps from 1 gives exactly \(\frac{b_0-a_0}{2^k}\).) The error at least halves every step.`,
        },
      },
      {
        text: {
          ko: String.raw`\(a = 2\), \(n = 2\)에서 \([a_0, b_0] = [0, 2]\)이므로 상한은 \(\frac{2}{2^k}\)입니다. 10단계를 직접 돌리면 \(x_{10} = 1.416015625\)이고, \(|x_{10} - \sqrt{2}| \approx 0.0018021\) — 상한 \(\frac{2}{2^{10}} = \frac{1}{512} \approx 0.0019531\) 안에 들어갑니다. 모델의 60회 반복값 \(1.414213562373095\)는 \(\sqrt{2}\)와 \(2.3\times 10^{-16}\) 이내로 일치합니다.`,
          en: String.raw`For \(a = 2\), \(n = 2\), \([a_0, b_0] = [0, 2]\), so the bound is \(\frac{2}{2^k}\). Running 10 steps by hand gives \(x_{10} = 1.416015625\) and \(|x_{10} - \sqrt{2}| \approx 0.0018021\) — inside the bound \(\frac{2}{2^{10}} = \frac{1}{512} \approx 0.0019531\). The model's 60-iteration value \(1.414213562373095\) agrees with \(\sqrt{2}\) to within \(2.3\times 10^{-16}\).`,
        },
      },
    ],
  },
];
