import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the Cantor function scene.
 * Imports nothing except types. Every number below was verified against the model:
 *   f(0) = 0, f(1) = 1 (1 read as 0.222..._3);
 *   f(1/3) = f(2/3) = 1/2 (first ternary digit 1, resp. digits 2,0,0,...);
 *   f(1/4) = 1/3: 1/4 = 0.020202..._3 has no digit 1, so
 *     f(1/4) = 0.010101..._2 = (1/4)/(1 - 1/4) = 1/3;
 *   f is constant 1/2 on (1/3, 2/3) and constant 1/4 on (1/9, 2/9);
 *   preset stage n: 2^n intervals, total length (2/3)^n:
 *     n = 3: 8 intervals, (2/3)^3 = 8/27 ~= 0.29630;
 *     n = 4: 16 intervals, (2/3)^4 = 16/81 ~= 0.19753;
 *     n = 5: 32 intervals, (2/3)^5 = 32/243 ~= 0.13169.
 */
export const problems: readonly ProblemMeta[] = [
  {
    id: 'cantor-function-basic',
    statement: {
      ko: String.raw`칸토어 함수 \(f\)가 잘 정의되고(삼진 전개의 모호성이 값을 바꾸지 않음), 단조증가이며, \([0,1]\)에서 연속임을 증명하세요. 예: \(0.0222\ldots_3 = 0.1_3\)의 두 전개가 모두 \(f = 1/2\)를 주어야 합니다.`,
      en: String.raw`Prove that the Cantor function \(f\) is well-defined (the ambiguity of ternary expansions does not change its value), nondecreasing, and continuous on \([0,1]\). For instance, the two expansions \(0.0222\ldots_3 = 0.1_3\) must both give \(f = 1/2\).`,
    },
    display: [
      String.raw`0.0222\ldots_3:\ N = \infty,\ b = 0.0111\ldots_2 = \tfrac12 \qquad\text{vs}\qquad 0.1_3:\ N = 1,\ b_1 = 1 \Rightarrow f = \tfrac12`,
      String.raw`x < y,\ \text{first differing digit } m \Rightarrow f(x) \le S + 2^{-m} \le f(y)`,
      String.raw`|f - f_n| \le 2^{-n}\ \text{uniformly},\ f_n\ \text{piecewise linear} \Rightarrow f\ \text{continuous}`,
    ],
    preset: { stage: 3 },
    presetCaption: {
      ko: String.raw`단계 3: \(C_3\)은 구간 8개(=\(2^3\)), 전체 길이 \((2/3)^3 = 8/27 \approx 0.29630\)이다 — 계단은 이미 완성된 \(f\)이며, \((1/3,\,2/3)\) 위의 평평한 단이 \(f = 1/2\)에 보인다.`,
      en: String.raw`Stage 3: \(C_3\) has 8 intervals (=\(2^3\)) of total length \((2/3)^3 = 8/27 \approx 0.29630\) — the staircase is already the finished \(f\), with the flat step \(f = 1/2\) over \((1/3,\,2/3)\) visible.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`삼진 전개는 \(k/3^m\) 꼴의 점을 제외하면 유일하고, 그 점들은 정확히 두 개의 전개를 갖는다: 끝나는 전개 \(0.c_1\ldots c_{m-1}1\)과 \(2\)가 반복되는 전개 \(0.c_1\ldots c_{m-1}0222\ldots_3\). \(k < m\)인 \(k\) 중 \(c_k = 1\)인 것이 있으면 두 전개 모두 첫 번째 \(1\)을 같은 자리에서 보므로 \(b\) 수열이 일치한다. 그런 \(k\)가 없으면, 끝나는 전개는 \(N = m\)에서 \(b_m = 1\)을 주고, \(2\)-반복 전개는 \(1\)이 전혀 없으므로 \(b_m = 0\), \(k > m\)에서 \(b_k = 1\)을 준다 — 그런데 \(\sum_{k>m} 2^{-k} = 2^{-m}\)이므로 합은 같다. 예: \(0.0222\ldots_3\)은 \(N = \infty\)이라 \(b = 0.0111\ldots_2 = 1/2\)이고, \(0.1_3\)은 \(N = 1\)이라 \(b_1 = 1\)로 \(f = 1/2\)이다. 따라서 \(f\)는 잘 정의된다.`,
          en: String.raw`Ternary expansions are unique except at points \(k/3^m\), which have exactly two: the terminating one \(0.c_1\ldots c_{m-1}1\) and the repeating-\(2\) one \(0.c_1\ldots c_{m-1}0222\ldots_3\). If some \(c_k = 1\) with \(k < m\), both expansions see the first \(1\) at the same position, so the \(b\)-sequences agree. Otherwise the terminating expansion has \(N = m\) with \(b_m = 1\), while the repeating-\(2\) expansion has no \(1\) at all, giving \(b_m = 0\) and \(b_k = 1\) for \(k > m\) — but \(\sum_{k>m} 2^{-k} = 2^{-m}\), so the totals agree. Example: \(0.0222\ldots_3\) has \(N = \infty\), hence \(b = 0.0111\ldots_2 = 1/2\); \(0.1_3\) has \(N = 1\), hence \(b_1 = 1\) and \(f = 1/2\). So \(f\) is well-defined.`,
        },
      },
      {
        text: {
          ko: String.raw`\(f\)는 단조증가이다. \(x < y\)라 하고 (선택한) 삼진 전개가 처음으로 달라지는 자리를 \(m\)이라 하자. 그러면 \((c_m(x),\, c_m(y))\)는 \((0,1)\), \((0,2)\), \((1,2)\) 중 하나이다. 앞 \(m-1\)자리의 공통 기여를 \(S\)라 쓰자. \((0,1)\)인 경우: \(x\)는 \(b_m = 0\)이고 꼬리가 \(\sum_{k>m} 2^{-k} = 2^{-m}\) 이하이므로 \(f(x) \le S + 2^{-m}\)이고, \(y\)는 \(m\)에서 첫 \(1\)이 나오므로 \(f(y) = S + 2^{-m}\)이다. \((0,2)\)인 경우: \(f(x) \le S + 2^{-m}\)이고 \(y\)는 \(b_m = 1\), 꼬리 \(\ge 0\)이므로 \(f(y) \ge S + 2^{-m}\)이다. \((1,2)\)인 경우: \(f(x) = S + 2^{-m}\)이고 \(f(y) \ge S + 2^{-m}\)이다. 끝점의 모호성은 이미 잘 정의성에서 해소되었으므로 \(f(x) \le f(y)\)이다.`,
          en: String.raw`The function \(f\) is nondecreasing. Let \(x < y\) and let \(m\) be the first index where the (chosen) ternary expansions differ; then \((c_m(x),\, c_m(y))\) is one of \((0,1)\), \((0,2)\), \((1,2)\). Write \(S\) for the shared contribution of the first \(m-1\) digits. Case \((0,1)\): \(x\) has \(b_m = 0\) and tail at most \(\sum_{k>m} 2^{-k} = 2^{-m}\), so \(f(x) \le S + 2^{-m}\); \(y\) sees its first \(1\) at \(m\), so \(f(y) = S + 2^{-m}\). Case \((0,2)\): \(f(x) \le S + 2^{-m}\) while \(y\) has \(b_m = 1\) and tail \(\ge 0\), so \(f(y) \ge S + 2^{-m}\). Case \((1,2)\): \(f(x) = S + 2^{-m}\) and \(f(y) \ge S + 2^{-m}\). Endpoint ambiguity was already settled by well-definedness, so \(f(x) \le f(y)\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(f\)는 연속이다. \(n\)단 삼진 구간의 각 닫힌 구간 \(I\) 위에서는 \(f\)의 변동이 \(2^{-n}\) 이하이다: \(n\)자리 안에 \(1\)이 있으면 꼬리가 0이라 \(f\)가 \(I\) 위에서 정확히 상수이고, 없으면 \(f = \sum_{k\le n}(c_k/2)2^{-k} + \text{꼬리}\) (꼬리는 \(0\)과 \(2^{-n}\) 사이)이다. 끝점 \(k/3^n\)에서 \(f\)를 선형 보간한 연속함수 \(f_n\)을 두면, \(n\)단 구간 \([l,r]\) 위의 모든 \(x\)에 대해 \(f(x)\)와 \(f_n(x)\)는 모두 \([f(l),\,f(r)]\) 안에 들고(단조성), 그 구간의 길이는 \(2^{-n}\) 이하이다. 따라서 \(f_n \to f\) 균등수렴하고, 연속함수의 균등극한은 연속이므로 \(f\)는 \([0,1]\)에서 연속이다. 참고로 \(f(0) = 0\), \(f(1) = 1\)이다 (\(1 = 0.222\ldots_3\)).`,
          en: String.raw`The function \(f\) is continuous. On each closed rank-\(n\) ternary interval \(I\), \(f\) varies by at most \(2^{-n}\): if a \(1\) occurs among the \(n\) digits the tails vanish and \(f\) is exactly constant on \(I\); otherwise \(f = \sum_{k\le n}(c_k/2)2^{-k} + \text{tail}\) with the tail between \(0\) and \(2^{-n}\). Let \(f_n\) be the continuous piecewise-linear interpolant of \(f\) at the endpoints \(k/3^n\). For \(x\) in a rank-\(n\) interval \([l,r]\), both \(f(x)\) and \(f_n(x)\) lie in \([f(l),\,f(r)]\) (by monotonicity), an interval of length at most \(2^{-n}\). Hence \(f_n \to f\) uniformly, and a uniform limit of continuous functions is continuous, so \(f\) is continuous on \([0,1]\). Note \(f(0) = 0\) and \(f(1) = 1\) (reading \(1 = 0.222\ldots_3\)).`,
        },
      },
    ],
  },
  {
    id: 'cantor-function-flat',
    statement: {
      ko: String.raw`칸토어 집합의 여집합을 이루는 모든 열린 구간 위에서 \(f\)가 상수임을 증명하세요. 따라서 여집합의 모든 점에서 \(f' = 0\)이며, 여집합의 전체 길이는 \(1\)입니다.`,
      en: String.raw`Prove that \(f\) is constant on every open interval complementary to the Cantor set. Conclude that \(f' = 0\) at every point of the complement, which has total length \(1\).`,
    },
    display: [
      String.raw`(a,b)\ \text{removed at stage } m:\quad a = 0.c_1\ldots c_{m-1}1_3,\ b = 0.c_1\ldots c_{m-1}2_3`,
      String.raw`x \in (a,b) \Rightarrow c_m(x) = 1 \Rightarrow f(x) = \sum_{k<m}\tfrac{c_k}{2}2^{-k} + 2^{-m}\ \text{(constant)}`,
      String.raw`\sum_{m \ge 1} 2^{m-1} 3^{-m} = \tfrac13\sum_{m\ge 1}\left(\tfrac23\right)^{m-1} = 1`,
    ],
    preset: { stage: 5 },
    presetCaption: {
      ko: String.raw`단계 5: \(C_5\)는 구간 32개(=\(2^5\)), 전체 길이 \((2/3)^5 = 32/243 \approx 0.13169\)이다 — 막대가 가늘어져도 계단의 평평한 단들(예: \((1/3,\,2/3)\) 위 \(f = 1/2\))은 그대로이다.`,
      en: String.raw`Stage 5: \(C_5\) has 32 intervals (=\(2^5\)) of total length \((2/3)^5 = 32/243 \approx 0.13169\) — the bars thin out, but the flat steps of the staircase (e.g. \(f = 1/2\) over \((1/3,\,2/3)\)) stay put.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`칸토어 집합의 여집합은 제거된 열린 가운데 삼등분 구간들의 서로소 합집합이다. 단계 \(m\)에서 제거되는 각 구간은 \((a,b)\) 꼴이며, \(a = 0.c_1\ldots c_{m-1}1_3\) (끝나는 전개), \(b = 0.c_1\ldots c_{m-1}2_3\)이고 \(c_1,\ldots,c_{m-1}\) 중에는 \(1\)이 없다. \(x \in (a,b)\)라 하자. \(x > a\)이므로 \(m\)번째 삼진 자리수는 \(0\)일 수 없고 (\(0\)이면 \(x \le 0.c_1\ldots c_{m-1}0222\ldots_3 = a\)가 된다), \(x < b\)이므로 \(2\)일 수도 없다 (\(2\)이면 \(x \ge 0.c_1\ldots c_{m-1}2000\ldots_3 = b\)가 된다). 따라서 \(c_m(x) = 1\)이고, 그 앞에 \(1\)이 없으므로 \(N(x) = m\)이다. 즉 \(f(x) = \sum_{k<m}(c_k/2)2^{-k} + 2^{-m}\)으로 \(x\)와 무관한 상수이다 — \(f\)는 모든 여집합 구간 위에서 상수이다. 수치 예: \((1/9,\,2/9)\) 위에서는 \(f \equiv 1/4\), \((1/3,\,2/3)\) 위에서는 \(f \equiv 1/2\)이다.`,
          en: String.raw`The complement of the Cantor set is the disjoint union of the removed open middle thirds. Each interval removed at stage \(m\) has the form \((a,b)\) with \(a = 0.c_1\ldots c_{m-1}1_3\) (terminating) and \(b = 0.c_1\ldots c_{m-1}2_3\), where \(c_1,\ldots,c_{m-1}\) contain no \(1\). Let \(x \in (a,b)\). Since \(x > a\), the \(m\)-th ternary digit cannot be \(0\) (that would give \(x \le 0.c_1\ldots c_{m-1}0222\ldots_3 = a\)); since \(x < b\), it cannot be \(2\) (that would give \(x \ge 0.c_1\ldots c_{m-1}2000\ldots_3 = b\)). Hence \(c_m(x) = 1\), and with no \(1\) before it, \(N(x) = m\). So \(f(x) = \sum_{k<m}(c_k/2)2^{-k} + 2^{-m}\), a constant independent of \(x\) — \(f\) is constant on every complementary interval. Numerically: \(f \equiv 1/4\) on \((1/9,\,2/9)\) and \(f \equiv 1/2\) on \((1/3,\,2/3)\).`,
        },
      },
      {
        text: {
          ko: String.raw`열린 구간 위에서 상수인 함수는 그 구간의 모든 점에서 도함수가 \(0\)이다 (차분몫이 항등적으로 \(0\)이므로). 따라서 여집합의 모든 점 \(x\)에서 \(f'(x) = 0\)이다 — 계단은 "거의 모든 곳에서" 평평하다.`,
          en: String.raw`A function constant on an open interval has derivative \(0\) at every point of it (the difference quotient is identically \(0\)). Hence \(f'(x) = 0\) at every point \(x\) of the complement — the staircase is flat "almost everywhere".`,
        },
      },
      {
        text: {
          ko: String.raw`여집합의 전체 길이는 단계 \(m\)에서 제거되는 \(2^{m-1}\)개의 길이 \(3^{-m}\) 구간들을 합한 것으로, \(\sum_{m\ge 1} 2^{m-1}3^{-m} = \frac13\sum_{m\ge 1}(2/3)^{m-1} = \frac13\cdot\frac{1}{1-2/3} = 1\)이다. 즉 \(f' = 0\)인 점들의 집합은 길이가 \(1\)이다 — 계단은 길이가 \(0\)인 칸토어 집합 위에서만 오르면서 전체 \(1\)만큼 상승한다.`,
          en: String.raw`The total length of the complement sums the \(2^{m-1}\) intervals of length \(3^{-m}\) removed at stage \(m\): \(\sum_{m\ge 1} 2^{m-1}3^{-m} = \frac13\sum_{m\ge 1}(2/3)^{m-1} = \frac13\cdot\frac{1}{1-2/3} = 1\). So the set where \(f' = 0\) has length \(1\): the staircase climbs a total of \(1\) while moving only on the Cantor set, which has length \(0\).`,
        },
      },
    ],
  },
  {
    id: 'cantor-function-not-ac',
    statement: {
      ko: String.raw`\(f(1) - f(0) = 1\)이지만 \(\int_0^1 f' = 0\)임을 계산하고, 따라서 \(f\)가 절대연속이 아님을 증명하세요. 이것이 바로 미적분학 기본정리가 "거의 모든 곳에서 미분가능"보다 강한 가설을 필요로 하는 이유입니다. (절대연속의 정의 자체는 아이디어 수준으로 서술해도 됩니다.)`,
      en: String.raw`Compute that \(f(1) - f(0) = 1\) yet \(\int_0^1 f' = 0\), and prove that \(f\) is therefore not absolutely continuous. This is why the Fundamental Theorem of Calculus needs a stronger hypothesis than "differentiable almost everywhere". (The definition of absolute continuity itself may be stated at idea level.)`,
    },
    display: [
      String.raw`\text{AC:}\quad \forall\varepsilon > 0\ \exists\delta > 0:\ \sum (y_i - x_i) < \delta \Rightarrow \sum |f(y_i) - f(x_i)| < \varepsilon`,
      String.raw`f(1) - f(0) = 1,\qquad \int_0^1 f' = 0\ \ (\text{since } f' = 0\ \text{a.e.})`,
      String.raw`\sum_{C_n\text{ intervals}} (r_i - l_i) = \left(\tfrac23\right)^n,\qquad \sum (f(r_i) - f(l_i)) = 1 \not< \tfrac12`,
    ],
    preset: { stage: 4 },
    presetCaption: {
      ko: String.raw`단계 4: \(C_4\)는 구간 16개(=\(2^4\)), 전체 길이 \((2/3)^4 = 16/81 \approx 0.19753\)이다 — 이 가느다란 막대들 위에서만 \(f\)가 \(0\)에서 \(1\)까지 오른다.`,
      en: String.raw`Stage 4: \(C_4\) has 16 intervals (=\(2^4\)) of total length \((2/3)^4 = 16/81 \approx 0.19753\) — \(f\) climbs from \(0\) to \(1\) on these thin bars alone.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`문제 1에서 \(f\)는 \([0,1]\)에서 연속이고 \(f(0) = 0\), \(f(1) = 1\)이므로 \(f(1) - f(0) = 1\)이다. 한편 단조함수는 거의 모든 곳에서 미분가능하다는 르베그 정리와 문제 2에 의해 \(f'\)은 존재하는 거의 모든 점에서 \(0\)이다 — 즉 \(f' = 0\) a.e.이므로 (르베그) 적분 \(\int_0^1 f' = 0\)이다.`,
          en: String.raw`By problem 1, \(f\) is continuous on \([0,1]\) with \(f(0) = 0\) and \(f(1) = 1\), so \(f(1) - f(0) = 1\). On the other hand, Lebesgue's theorem says a monotone function is differentiable almost everywhere, and problem 2 gives \(f' = 0\) wherever it exists — so \(f' = 0\) a.e., and the (Lebesgue) integral \(\int_0^1 f' = 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(f\)가 절대연속이었다면 미적분학 기본정리에 의해 \(f(1) - f(0) = \int_0^1 f'\)이어야 한다. 그러나 \(1 \neq 0\)이므로 모순이다. 따라서 \(f\)는 절대연속이 아니다 — 연속이고 거의 모든 곳에서 미분가능해도 기본정리가 성립하지 않는다. "거의 모든 곳에서 미분가능"은 적분으로 함수를 복원하기에 충분하지 않고, 절대연속성이 정확한 가설이다.`,
          en: String.raw`If \(f\) were absolutely continuous, the Fundamental Theorem of Calculus would give \(f(1) - f(0) = \int_0^1 f'\). But \(1 \neq 0\) — a contradiction. Hence \(f\) is not absolutely continuous: continuity plus differentiability almost everywhere does not imply the FTC. "Differentiable almost everywhere" is not enough to recover a function by integration; absolute continuity is the sharp hypothesis.`,
        },
      },
      {
        text: {
          ko: String.raw`직접 확인도 된다. 절대연속이란: 모든 \(\varepsilon > 0\)에 대해, 서로소인 유한 구간족의 길이 합이 \(\delta\)보다 작으면 \(|f|\)-증가분 합도 \(\varepsilon\)보다 작게 만드는 \(\delta > 0\)이 존재한다는 뜻이다. \(\varepsilon = 1/2\)를 잡자. \(C_n\)의 \(2^n\)개 구간은 길이 합이 \((2/3)^n \to 0\)이므로 \(n\)이 크면 어떤 \(\delta\)보다도 작아진다. 그러나 \(f\)는 그 사이의 틈에서는 상수이고 단조증가이므로 \(\sum_i (f(r_i) - f(l_i)) = f(1) - f(0) = 1 \ge \varepsilon\)이다 — 모든 \(\delta\)가 실패한다. 칸토어 집합은 길이는 \(0\)에 가까워도 \(f\)-값으로는 \([0,1]\) 전체를 덮는다 (\(f\)는 \(C\)를 \([0,1]\) 위로 올린다).`,
          en: String.raw`This can also be seen directly. Absolute continuity means: for every \(\varepsilon > 0\) there is \(\delta > 0\) such that any finite family of disjoint intervals with total length below \(\delta\) has total \(|f|\)-increment below \(\varepsilon\). Take \(\varepsilon = 1/2\). The \(2^n\) intervals of \(C_n\) have total length \((2/3)^n \to 0\), eventually below any \(\delta\). But \(f\) is constant on the gaps between them and nondecreasing, so \(\sum_i (f(r_i) - f(l_i)) = f(1) - f(0) = 1 \ge \varepsilon\) — every \(\delta\) fails. The Cantor set is nearly \(0\) in length yet covers all of \([0,1]\) in \(f\)-value (\(f\) maps \(C\) onto \([0,1]\)).`,
        },
      },
    ],
  },
];
