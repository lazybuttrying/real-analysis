import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the density-of-rationals scene
 * (Tao, Analysis I, Propositions 4.4.1 and 4.4.3). Imports nothing except types.
 * Every number below was verified against the model (tests/density-of-rationals.test.ts):
 *   preset a (1, 2):       n = 2,  m = 3,   q = 3/2 = 1.5;
 *   preset b (0, 0.1):     n = 11, m = 1,   q = 1/11 = 0.090909...;
 *   preset c (-3.5, -3.4): n = 11, m = -38, q = -38/11 = -3.4545...;
 *   x < m/n < y holds strictly for all three presets.
 */
export const densityOfRationalsProblems: readonly ProblemMeta[] = [
  {
    id: 'density-integer-step',
    statement: {
      ko: String.raw`실수 \(x\)에 대해 \(n \le x < n+1\)을 만족하는 정수 \(n\)이 존재함을 아르키메데스 성질로 완전히 증명하세요 (Tao, 명제 4.4.1).`,
      en: String.raw`Prove completely, from the Archimedean property, that for every real \(x\) there is an integer \(n\) with \(n \le x < n+1\) (Tao, Proposition 4.4.1).`,
    },
    display: [
      String.raw`\forall\, x \in \mathbb{R}\ \exists\, n \in \mathbb{Z}:\ n \le x < n+1`,
    ],
    preset: { preset: 'a', denom: 24 },
    presetCaption: {
      ko: String.raw`구간 \((1, 2)\): \(n = \lfloor 1/(2-1) \rfloor + 1 = 2\), \(m = \lfloor 2 \cdot 1 \rfloor + 1 = 3\)이므로 \(q = 3/2 = 1.5\)가 구간 안에 들어갑니다. 아래 증명은 이 구성이 항상 통함을 보입니다.`,
      en: String.raw`Interval \((1, 2)\): \(n = \lfloor 1/(2-1) \rfloor + 1 = 2\), \(m = \lfloor 2 \cdot 1 \rfloor + 1 = 3\), so \(q = 3/2 = 1.5\) lands inside. The proof below shows this recipe always works.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(S = \{k \in \mathbb{Z} : k \le x\}\)라 둡니다. 아르키메데스 성질에 의해 \(-x\)보다 큰 자연수 \(K\)가 존재하고, \(-K < x\)이므로 \(-K \in S\) — \(S\)는 비어 있지 않으며 \(x\)를 상계로 갖습니다.`,
          en: String.raw`Let \(S = \{k \in \mathbb{Z} : k \le x\}\). By the Archimedean property there is a natural number \(K > -x\); then \(-K < x\), so \(-K \in S\) — \(S\) is nonempty and bounded above by \(x\).`,
        },
      },
      {
        text: {
          ko: String.raw`위로 유계인 정수의 비어 있지 않은 집합은 최댓값을 가집니다: \(x\)보다 큰 정수 \(M\)을 잡으면(아르키메데스), \(S'' = \{M - s : s \in S\}\)는 \(0\) 이상의 정수들로 이루어진 비어 있지 않은 집합이므로 정렬성 원리에 의해 최소 원소 \(M - n\) (\(n \in S\))을 갖습니다. 모든 \(s \in S\)에 대해 \(M - s \ge M - n\), 즉 \(s \le n\)이므로 \(n = \max S\)입니다.`,
          en: String.raw`A nonempty set of integers bounded above has a maximum: pick an integer \(M > x\) (Archimedean); then \(S'' = \{M - s : s \in S\}\) is a nonempty set of nonnegative integers, so by well-ordering it has a least element \(M - n\) with \(n \in S\). Every \(s \in S\) satisfies \(M - s \ge M - n\), i.e. \(s \le n\), so \(n = \max S\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(n \in S\)이므로 \(n \le x\)입니다. 또한 \(n + 1 > x\)입니다: 그렇지 않으면 \(n + 1 \le x\)라서 \(n + 1 \in S\)가 되어 \(n\)의 최대성에 모순이기 때문입니다. 따라서 \(n \le x < n+1\) — 모든 실수는 정수 눈금 두 칸 사이에 정확히 들어갑니다.`,
          en: String.raw`Since \(n \in S\), \(n \le x\). Also \(n + 1 > x\): otherwise \(n + 1 \le x\) would put \(n + 1 \in S\), contradicting the maximality of \(n\). Hence \(n \le x < n+1\) — every real sits exactly between two consecutive integer marks.`,
        },
      },
    ],
  },
  {
    id: 'density-rationals-proof',
    statement: {
      ko: String.raw`\(x < y\)인 실수에 대해 \(x < q < y\)인 유리수 \(q\)가 존재함을 완전히 증명하세요 — 유리수는 실수에서 조밀합니다 (Tao, 명제 4.4.3).`,
      en: String.raw`Prove completely that for reals \(x < y\) there is a rational \(q\) with \(x < q < y\) — the rationals are dense in the reals (Tao, Proposition 4.4.3).`,
    },
    display: [
      String.raw`x < y \Rightarrow \exists\, q \in \mathbb{Q}:\ x < q < y`,
      String.raw`n = \left\lfloor\frac{1}{y-x}\right\rfloor + 1,\quad m = \lfloor nx \rfloor + 1,\quad q = \frac{m}{n}`,
    ],
    preset: { preset: 'a', denom: 24 },
    presetCaption: {
      ko: String.raw`구간 \((1, 2)\): \(1/n < y - x\)를 만족하는 \(n = 2\)를 잡으면 간격 \(1/2\)짜리 눈금 \(\dots, 1, 3/2, 2, \dots\) 중 \(3/2\)가 구간 안에 떨어집니다 — 증명의 구성이 눈앞에서 실행된 것입니다.`,
      en: String.raw`Interval \((1, 2)\): taking \(n = 2\) with \(1/n < y - x\), one of the \(1/2\)-spaced marks \(\dots, 1, 3/2, 2, \dots\) — namely \(3/2\) — falls inside the interval: the proof's recipe executed live.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(y - x > 0\)이므로 아르키메데스 성질에 의해 \(\frac{1}{y-x}\)보다 큰 자연수 \(n\)이 존재합니다 — 즉 \(\frac{1}{n} < y - x\)입니다. 모델은 \(n = \left\lfloor\frac{1}{y-x}\right\rfloor + 1\)로 이 \(n\)을 직접 계산합니다.`,
          en: String.raw`Since \(y - x > 0\), the Archimedean property gives a natural number \(n\) larger than \(\frac{1}{y-x}\) — i.e. \(\frac{1}{n} < y - x\). The model computes such an \(n\) directly as \(n = \left\lfloor\frac{1}{y-x}\right\rfloor + 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`위 문제 1을 \(nx\)에 적용하면 \(m - 1 \le nx < m\)인 정수 \(m\)이 존재합니다 (모델은 \(m = \lfloor nx \rfloor + 1\)로 계산합니다). \(q = m/n\)이라 두면, \(m > nx\)에서 \(\frac{m}{n} > \frac{nx}{n} = x\)입니다.`,
          en: String.raw`Applying problem 1 to \(nx\) gives an integer \(m\) with \(m - 1 \le nx < m\) (the model computes \(m = \lfloor nx \rfloor + 1\)). Put \(q = m/n\); from \(m > nx\) we get \(\frac{m}{n} > \frac{nx}{n} = x\).`,
        },
      },
      {
        text: {
          ko: String.raw`또한 \(m < nx + 1\)이고, \(\frac{1}{n} < y - x\)는 \(1 < n(y - x)\)와 동치이므로 \(nx + 1 < nx + n(y - x) = ny\)입니다. 따라서 \(m < ny\), 즉 \(\frac{m}{n} < y\)입니다. 두 부등식을 합치면 \(x < \frac{m}{n} < y\) — 원하는 유리수 \(q = m/n\)을 찾았습니다.`,
          en: String.raw`Also \(m < nx + 1\), and \(\frac{1}{n} < y - x\) is equivalent to \(1 < n(y - x)\), so \(nx + 1 < nx + n(y - x) = ny\). Hence \(m < ny\), i.e. \(\frac{m}{n} < y\). Together: \(x < \frac{m}{n} < y\) — the desired rational \(q = m/n\) is found.`,
        },
      },
      {
        text: {
          ko: String.raw`핵심 아이디어는 이것입니다: 구간 길이보다 잘게 눈금을 나누면(\(1/n < y - x\)), 눈금 하나가 구간을 건너뛰어 넘어갈 수 없습니다. 구간이 아무리 좁아도(\((0, 0.1)\), \((-3.5, -3.4)\) 프리셋을 보세요) 눈금을 더 잘게 나누면 되므로, 예외는 없습니다.`,
          en: String.raw`The key idea: once the marks are spaced finer than the interval (\(\frac{1}{n} < y - x\)), no mark can jump clean over it. However narrow the interval (try the \((0, 0.1)\) and \((-3.5, -3.4)\) presets), finer marks always work — there are no exceptions.`,
        },
      },
    ],
  },
  {
    id: 'density-irrationals',
    statement: {
      ko: String.raw`무리수도 실수에서 조밀함을 증명하세요: \(x < y\)이면 \(x < z < y\)인 무리수 \(z\)가 존재합니다 (힌트: 유리수 \(r < s\)를 \((x, y)\) 안에서 잡고, \(z = r + (s-r)\frac{\sqrt{2}}{2}\)를 이용하세요).`,
      en: String.raw`Prove the irrationals are dense too: if \(x < y\) there is an irrational \(z\) with \(x < z < y\) (hint: pick rationals \(r < s\) inside \((x, y)\) and use \(z = r + (s-r)\frac{\sqrt{2}}{2}\)).`,
    },
    display: [
      String.raw`z = r + (s-r)\frac{\sqrt{2}}{2} \in (x, y),\qquad z \notin \mathbb{Q}`,
    ],
    preset: { preset: 'a', denom: 24 },
    presetCaption: {
      ko: String.raw`구간 \((1, 2)\): 유리수 \(r = 3/2\), \(s = 7/4\)를 잡으면 \(z = \frac{3}{2} + \frac{1}{4}\cdot\frac{\sqrt{2}}{2} \approx 1.677\)은 \((1, 2)\) 안의 무리수입니다 — 유리수 눈금 사이에 무리수가 반드시 끼어듭니다.`,
      en: String.raw`Interval \((1, 2)\): with rationals \(r = 3/2\), \(s = 7/4\), \(z = \frac{3}{2} + \frac{1}{4}\cdot\frac{\sqrt{2}}{2} \approx 1.677\) is an irrational inside \((1, 2)\) — an irrational always squeezes between rational marks.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`위 문제 2는 유리수 하나만 주므로 두 번 적용합니다: 중간점 \(m = (x + y)/2\)에 대해 문제 2를 \((x, m)\)에 적용해 유리수 \(r\) (\(x < r < m\))을 얻고, \((m, y)\)에 적용해 유리수 \(s\) (\(m < s < y\))를 얻으면 \(r < m < s\)라서 \((x, y)\) 안에 유리수 \(r < s\)가 존재합니다. \(z = r + (s - r)\frac{\sqrt{2}}{2}\)라 둡니다. \(1 < 2 < 4\)이고 제곱은 \([0, \infty)\)에서 엄격히 증가하므로(위 sqrt2-irrational 장면의 문제 1과 n제곱근 장면), \(1 < \sqrt{2} < 2\) — 따라서 \(0 < \frac{\sqrt{2}}{2} < 1\)입니다.`,
          en: String.raw`Problem 2 alone gives only one rational, so apply it twice: with the midpoint \(m = (x + y)/2\), applying problem 2 in \((x, m)\) gives a rational \(r\) with \(x < r < m\), and applying it in \((m, y)\) gives a rational \(s\) with \(m < s < y\); since \(r < m < s\), there are rationals \(r < s\) inside \((x, y)\). Put \(z = r + (s - r)\frac{\sqrt{2}}{2}\). Since \(1 < 2 < 4\) and squaring is strictly increasing on \([0, \infty)\) (problem 1 of the sqrt2-irrational scene, plus the n-th root scene), \(1 < \sqrt{2} < 2\) — hence \(0 < \frac{\sqrt{2}}{2} < 1\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(s - r > 0\)이므로 \(0 < (s-r)\frac{\sqrt{2}}{2} < s - r\)이고, 양변에 \(r\)을 더하면 \(r < z < s\)입니다. \(x < r\)이고 \(s < y\)이므로 \(x < z < y\) — \(z\)는 구간 안에 들어갑니다.`,
          en: String.raw`Since \(s - r > 0\), \(0 < (s-r)\frac{\sqrt{2}}{2} < s - r\); adding \(r\) gives \(r < z < s\). With \(x < r\) and \(s < y\), \(x < z < y\) — \(z\) lies in the interval.`,
        },
      },
      {
        text: {
          ko: String.raw`\(z\)가 무리수임을 보입니다. 만약 \(z\)가 유리수라면 \(\sqrt{2} = \frac{2(z - r)}{s - r}\)인데, 우변은 분모가 \(0\)이 아닌 유리수들의 사칙연산이므로 유리수 — \(\sqrt{2}\)가 무리수라는 명제 4.4.4(sqrt2-irrational 장면 문제 1)에 모순입니다. 따라서 \(z\)는 무리수이며, \(x < z < y\)를 만족합니다.`,
          en: String.raw`Now \(z\) is irrational: if it were rational, \(\sqrt{2} = \frac{2(z - r)}{s - r}\) would be rational too (the right side is arithmetic on rationals with nonzero denominator) — contradicting Proposition 4.4.4 that \(\sqrt{2}\) is irrational (problem 1 of the sqrt2-irrational scene). Hence \(z\) is irrational with \(x < z < y\).`,
        },
      },
      {
        text: {
          ko: String.raw`따름정리: 실수 직선의 모든 열린 구간은 유리수도 무리수도 모두 포함합니다. 유리수가 조밀하다고 해서 "거의 모든" 실수가 유리수라는 뜻은 아닙니다 — 오히려 그 반대가 참입니다 (가산성 장면).`,
          en: String.raw`Corollary: every open interval of the real line contains both rationals and irrationals. Density of the rationals does not mean "almost all" reals are rational — quite the opposite is true (the countability scene).`,
        },
      },
    ],
  },
];
