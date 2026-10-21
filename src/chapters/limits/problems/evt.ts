import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for one scene. Imports nothing except types.
 * Imported by the chapter's meta.ts (sibling data module).
 */
export const problems: readonly ProblemMeta[] = [
        {
          id: 'square-evt',
          statement: {
            ko: String.raw`\([0,1]\)에서 \(x^2\)의 최댓값과 최솟값을 구하고, 각각이 어디서 취해지는지 말하세요.`,
            en: String.raw`Find the maximum and minimum of \(x^2\) on \([0,1]\), and say where each is attained.`,
          },
          display: [String.raw`\max_{[0,1]} x^2 = 1\ \text{at } x = 1, \qquad \min_{[0,1]} x^2 = 0\ \text{at } x = 0`],
          preset: { mode: 'closed' },
          presetCaption: {
            ko: String.raw`closed 모드 — 세제곱함수가 양쪽 극값을 모두 취하는 것처럼, \(x^2\)도 \([0,1]\)에서 양쪽을 모두 취합니다.`,
            en: String.raw`Closed mode — as the cubic attains both extremes, so does \(x^2\) on \([0,1]\).`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\([0,1]\)에서 \(x^2\)은 증가함수입니다: \(0 \leq x_1 < x_2 \leq 1\)이면 인수분해 \(x_2^2 - x_1^2 = (x_2 - x_1)(x_1 + x_2)\)에서 \(x_2 - x_1 > 0\)이고, \(x_1 + x_2 > 0\)입니다 (\(x_1 = x_2 = 0\)인 경우는 \(x_1 < x_2\)라 제외되고, \(x_1 = 0 < x_2\)이면 \(x_1 + x_2 = x_2 > 0\)). 따라서 곱이 양수라 \(x_1^2 < x_2^2\)입니다.`,
                en: String.raw`\(x^2\) is increasing on \([0,1]\): if \(0 \leq x_1 < x_2 \leq 1\), factor \(x_2^2 - x_1^2 = (x_2 - x_1)(x_1 + x_2)\); here \(x_2 - x_1 > 0\) and \(x_1 + x_2 > 0\) (the case \(x_1 = x_2 = 0\) is excluded by \(x_1 < x_2\), and if \(x_1 = 0 < x_2\) then \(x_1 + x_2 = x_2 > 0\)). Hence the product is positive, so \(x_1^2 < x_2^2\).`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 모든 \(x \in [0,1]\)에 대해 \(0 = 0^2 \leq x^2 \leq 1^2 = 1\)입니다. \(\max = 1\)은 \(x = 1\)에서, \(\min = 0\)은 \(x = 0\)에서 취해집니다.`,
                en: String.raw`Hence \(0 = 0^2 \leq x^2 \leq 1^2 = 1\) for all \(x \in [0,1]\). The max \(1\) is attained at \(x = 1\); the min \(0\) at \(x = 0\).`,
              },
            },
            {
              text: {
                ko: String.raw`최댓값 정리(인용)와 일치합니다: \([0,1]\)은 닫힌 구간이고 \(x^2\)은 연속이므로, 양쪽 극값이 존재해야 합니다.`,
                en: String.raw`Consistent with the Extreme Value Theorem (cited): \([0,1]\) is closed and \(x^2\) is continuous, so both extremes must exist.`,
              },
            },
          ],
        },
        {
          id: 'reciprocal-no-max',
          statement: {
            ko: String.raw`\((0,1]\)에서 \(f(x) = 1/x\)가 최댓값을 갖지 않음을 증명하고, 어느 가설이 깨졌는지 말하세요.`,
            en: String.raw`Prove \(f(x) = 1/x\) has no maximum on \((0,1]\); name the hypothesis that fails.`,
          },
          display: [String.raw`f\!\left(\frac{1}{M+1}\right) = M + 1 > M \qquad \forall M`],
          preset: { mode: 'open-interval' },
          presetCaption: {
            ko: String.raw`open-interval 모드 — 곡선이 위로 끝없이 빠져나갑니다.`,
            en: String.raw`Open-interval mode — the curve escapes upward without bound.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(M\)이 최댓값이라 가정합니다. \(M < 0\)이면 \(f(1) = 1 > M\)이므로 이미 모순입니다. \(M \geq 0\)인 경우, \(x = \frac{1}{M+1}\)이라 두면 \(0 < x \leq 1\)이므로 \(x \in (0,1]\)이고, \(f(x) = M + 1 > M\) — 모순입니다.`,
                en: String.raw`Suppose \(M\) were a maximum. If \(M < 0\), then \(f(1) = 1 > M\), already a contradiction. If \(M \geq 0\), put \(x = \frac{1}{M+1}\): then \(0 < x \leq 1\), so \(x \in (0,1]\), and \(f(x) = M + 1 > M\) — a contradiction.`,
              },
            },
            {
              text: {
                ko: String.raw`따라서 어떤 \(M\)도 상계가 될 수 없고, \(f\)는 위로 비유계이므로 최댓값은 존재하지 않습니다.`,
                en: String.raw`Hence no \(M\) can be an upper bound: \(f\) is unbounded above, so no maximum exists.`,
              },
            },
            {
              text: {
                ko: String.raw`깨진 가설은 정의역의 닫힘성입니다: \((0,1]\)은 닫힌 구간이 아닙니다. \(x \to 0^+\)로 가면 \(f\)가 발산할 "도망갈 구멍"이 열려 있습니다.`,
                en: String.raw`The broken hypothesis is the closedness of the domain: \((0,1]\) is not a closed interval. As \(x \to 0^+\) there is an open "escape hole" through which \(f\) diverges.`,
              },
            },
          ],
        },
        {
          id: 'jump-no-max',
          statement: {
            ko: String.raw`\(f(x) = x\) (\([0,1)\)에서), \(f(1) = 0\)이라 할 때 \(\sup f = 1\)이지만 \(1\)이 취해지지 않음을 증명하고, 어느 가설이 깨졌는지 말하세요.`,
            en: String.raw`For \(f(x) = x\) on \([0,1)\) with \(f(1) = 0\), prove \(\sup f = 1\) but \(1\) is never attained; name the hypothesis that fails.`,
          },
          display: [String.raw`\sup_{[0,1]} f = 1 \notin f([0,1])`],
          preset: { mode: 'discontinuous' },
          presetCaption: {
            ko: String.raw`discontinuous 모드 — 값 \(1\)에 다가서지만 절대 닿지 않습니다.`,
            en: String.raw`Discontinuous mode — the value \(1\) is approached but never touched.`,
          },
          proof: [
            {
              text: {
                ko: String.raw`\(x \in [0,1)\)이면 \(f(x) = x < 1\)이고, \(f(1) = 0\)입니다. 따라서 모든 \(x\)에 대해 \(f(x) < 1\) — 값 \(1\)을 취하는 점은 없습니다.`,
                en: String.raw`For \(x \in [0,1)\), \(f(x) = x < 1\); and \(f(1) = 0\). So \(f(x) < 1\) for every \(x\) — no point takes the value \(1\).`,
              },
            },
            {
              text: {
                ko: String.raw`\(\sup = 1\): \(1\)은 상계입니다(\(f(x) < 1\)이므로). \(u < 1\)인 임의의 실수에 대해 \(f(x) > u\)인 \(x \in [0,1)\)를 만듭니다. \(u < 0\)이면 \(x = 0\)으로 두면 \(f(0) = 0 > u\)입니다. \(0 \le u < 1\)이면 \(x = \frac{u+1}{2}\)로 두면 \(u \le \frac{u+1}{2} < 1\)이므로 \(x \in [0,1)\)이고 \(f(x) = \frac{u+1}{2} > u\)입니다. (주의: \(u < -1\)에서는 \(\frac{u+1}{2} < 0\)이 되어 \([0,1)\) 밖에 떨어지므로, 그 구간에서는 \(x = 0\)이 필요합니다.) 따라서 \(1\)보다 작은 수는 상계가 아니고, 최소상계는 \(1\)입니다.`,
                en: String.raw`\(\sup = 1\): \(1\) is an upper bound (since \(f(x) < 1\)). For any real \(u < 1\), produce \(x \in [0,1)\) with \(f(x) > u\). If \(u < 0\), take \(x = 0\): \(f(0) = 0 > u\). If \(0 \le u < 1\), take \(x = \frac{u+1}{2}\): then \(u \le \frac{u+1}{2} < 1\), so \(x \in [0,1)\) and \(f(x) = \frac{u+1}{2} > u\). (Note: for \(u < -1\), \(\frac{u+1}{2} < 0\) falls outside \([0,1)\), which is why \(x = 0\) is needed there.) Hence no number below \(1\) is an upper bound, and the least upper bound is \(1\).`,
              },
            },
            {
              text: {
                ko: String.raw`깨진 가설은 \(x = 1\)에서의 연속성입니다: 좌극한은 \(1\)이지만 \(f(1) = 0\)입니다. 닫힌 구간 위에서도 연속성이 빠지면 최댓값이 "도달되지 않는 상한"으로 남을 수 있습니다.`,
                en: String.raw`The broken hypothesis is continuity at \(x = 1\): the left-hand limit is \(1\) but \(f(1) = 0\). Even on a closed interval, dropping continuity can leave the maximum as an unattained supremum.`,
              },
            },
          ],
        },
      ];
