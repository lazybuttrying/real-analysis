import type { ExerciseMeta } from '../../contracts.ts';

/**
 * Pure data: end-of-chapter exercises for the calculus chapter.
 * Imports nothing except types. Ordered easy -> hard: 4 x difficulty 1,
 * then 5 x difficulty 2, then 3 x difficulty 3.
 * Every exercise is an original composition; statements are self-contained.
 */
export const exercises: readonly ExerciseMeta[] = [
  // ------------------------------------------------------------------
  // Difficulty 1
  // ------------------------------------------------------------------
  {
    id: 'lipschitz-bounded-derivative',
    difficulty: 1,
    topics: ['mvt', 'diffcont'],
    statement: {
      ko: String.raw`함수 \(f\)가 \([a,b]\)에서 연속이고 \((a,b)\)에서 미분가능하며, 어떤 상수 \(M \ge 0\)에 대해 모든 \(x \in (a,b)\)에서 \(\lvert f'(x) \rvert \le M\)을 만족한다고 하자. 이때 모든 \(x, y \in [a,b]\)에 대해 \(\lvert f(x) - f(y) \rvert \le M\lvert x - y \rvert\)임을 보이세요. (따라서 \(f\)는 \([a,b]\)에서 균일연속입니다.)`,
      en: String.raw`Let \(f\) be continuous on \([a,b]\) and differentiable on \((a,b)\), with \(\lvert f'(x) \rvert \le M\) for all \(x \in (a,b)\) and some constant \(M \ge 0\). Prove that \(\lvert f(x) - f(y) \rvert \le M\lvert x - y \rvert\) for all \(x, y \in [a,b]\). (Hence \(f\) is uniformly continuous on \([a,b]\).)`,
    },
    solution: [
      {
        text: {
          ko: String.raw`\(x = y\)인 경우는 자명하므로 \(x < y\)라 하자. \(f\)는 \([x,y] \subset [a,b]\)에서 연속이고 \((x,y) \subset (a,b)\)에서 미분가능하므로, 평균값 정리를 \([x,y]\)에 적용할 수 있다: 어떤 \(c \in (x,y)\)에 대해 \(f(y) - f(x) = f'(c)(y - x)\)이다.`,
          en: String.raw`The case \(x = y\) is trivial, so let \(x < y\). Since \(f\) is continuous on \([x,y] \subset [a,b]\) and differentiable on \((x,y) \subset (a,b)\), the Mean Value Theorem applies on \([x,y]\): for some \(c \in (x,y)\), \(f(y) - f(x) = f'(c)(y - x)\).`,
        },
      },
      {
        text: {
          ko: String.raw`절댓값을 취하면 \(\lvert f(y) - f(x) \rvert = \lvert f'(c) \rvert \cdot \lvert y - x \rvert \le M\lvert y - x \rvert\)이다. \(x > y\)인 경우도 \(x\)와 \(y\)를 바꾸면 같고, 따라서 모든 \(x, y \in [a,b]\)에 대해 부등식이 성립한다. 이는 립시츠 조건이므로, \(\delta = \varepsilon / M\) (단 \(M = 0\)이면 임의의 \(\delta > 0\))로 두면 균일연속성이 따라온다.`,
          en: String.raw`Taking absolute values, \(\lvert f(y) - f(x) \rvert = \lvert f'(c) \rvert \cdot \lvert y - x \rvert \le M\lvert y - x \rvert\). The case \(x > y\) is the same with the roles swapped, so the inequality holds for all \(x, y \in [a,b]\). This is the Lipschitz condition, and uniform continuity follows with \(\delta = \varepsilon / M\) (any \(\delta > 0\) if \(M = 0\)).`,
        },
      },
    ],
  },
  {
    id: 'riemann-point-mass',
    difficulty: 1,
    topics: ['riemann'],
    statement: {
      ko: String.raw`\([0,1]\) 위의 함수 \(f\)를 \(f(1/2) = 1\)이고 \(x \ne 1/2\)에서는 \(f(x) = 0\)이라 정의하자. \(f\)가 리만 적분가능하고 \(\int_0^1 f = 0\)임을, 상합·하합을 직접 평가하여 증명하세요.`,
      en: String.raw`Define \(f\) on \([0,1]\) by \(f(1/2) = 1\) and \(f(x) = 0\) for \(x \ne 1/2\). Prove directly from upper and lower sums that \(f\) is Riemann integrable with \(\int_0^1 f = 0\).`,
    },
    solution: [
      {
        text: {
          ko: String.raw`\(f\)는 유계이다 (\(0 \le f \le 1\)). \(0 < \delta < 1/2\)에 대해 분할 \(P_\delta = \{0,\ 1/2 - \delta,\ 1/2 + \delta,\ 1\}\)을 잡자. 양쪽 바깥 구간에서는 \(f \equiv 0\)이므로 상한·하한이 모두 \(0\)이고, 가운데 구간 \([1/2-\delta,\ 1/2+\delta]\)에서는 하한이 \(0\) (1/2가 아닌 점이 존재)이고 상한이 \(1\) (\(f(1/2) = 1\))이다.`,
          en: String.raw`The function \(f\) is bounded (\(0 \le f \le 1\)). For \(0 < \delta < 1/2\) take the partition \(P_\delta = \{0,\ 1/2 - \delta,\ 1/2 + \delta,\ 1\}\). On the two outer intervals \(f \equiv 0\), so both the infimum and supremum are \(0\); on the middle interval \([1/2-\delta,\ 1/2+\delta]\) the infimum is \(0\) (points other than \(1/2\) exist) and the supremum is \(1\) (since \(f(1/2) = 1\)).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 하합은 \(L(P_\delta, f) = 0\)이고 상합은 \(U(P_\delta, f) = 1 \cdot 2\delta = 2\delta\)이다. \(U - L = 2\delta \to 0\) (\(\delta \to 0^+\))이므로 리만 판정법에 의해 \(f\)는 적분가능하다. 적분값은 \(0 = L(P_\delta, f) \le \int_0^1 f \le U(P_\delta, f) = 2\delta\)를 모든 \(\delta > 0\)에 대해 만족하므로 \(0\)이다 — 한 점에서의 값은 리만 적분에 영향을 주지 않는다.`,
          en: String.raw`Hence the lower sum is \(L(P_\delta, f) = 0\) and the upper sum is \(U(P_\delta, f) = 1 \cdot 2\delta = 2\delta\). Since \(U - L = 2\delta \to 0\) as \(\delta \to 0^+\), the Riemann criterion gives integrability. The integral satisfies \(0 = L(P_\delta, f) \le \int_0^1 f \le U(P_\delta, f) = 2\delta\) for every \(\delta > 0\), so it equals \(0\) — the value at a single point does not affect the Riemann integral.`,
        },
      },
    ],
  },
  {
    id: 'newton-monotone-sqrt2',
    difficulty: 1,
    topics: ['newton'],
    statement: {
      ko: String.raw`\(x^2 - 2 = 0\)에 대한 뉴턴 반복 \(x_{n+1} = x_n - \dfrac{x_n^2 - 2}{2x_n} = \dfrac{x_n + 2/x_n}{2}\)을 \(x_0 = 1\)에서 시작하자. (a) 모든 \(n\)에 대해 \(x_n > 0\)임을 보이세요. (b) 산술-기하 평균 부등식으로 모든 \(n\)에 대해 \(x_{n+1} \ge \sqrt{2}\)임을 보이세요. (c) \(x_1 > \sqrt{2}\)이고 수열 \((x_n)_{n \ge 1}\)이 감소함을 보이세요. (d) \(x_n \to \sqrt{2}\)임을 결론지으세요.`,
      en: String.raw`Start Newton's iteration for \(x^2 - 2 = 0\), \(x_{n+1} = x_n - \dfrac{x_n^2 - 2}{2x_n} = \dfrac{x_n + 2/x_n}{2}\), at \(x_0 = 1\). (a) Show \(x_n > 0\) for all \(n\). (b) Use AM-GM to show \(x_{n+1} \ge \sqrt{2}\) for all \(n\). (c) Show \(x_1 > \sqrt{2}\) and that \((x_n)_{n \ge 1}\) is decreasing. (d) Conclude \(x_n \to \sqrt{2}\).`,
    },
    display: [String.raw`x_{n+1} = \frac{x_n + 2/x_n}{2}, \qquad x_0 = 1, \quad x_1 = \frac32`],
    solution: [
      {
        text: {
          ko: String.raw`(a) \(x_0 = 1 > 0\)이고, \(x_n > 0\)이면 \(x_{n+1}\)은 두 양수의 평균이므로 양수이다 — 귀납법으로 모든 \(n\)에 대해 \(x_n > 0\)이다. (b) 산술-기하 평균 부등식에 의해 \(x_{n+1} = \dfrac{x_n + 2/x_n}{2} \ge \sqrt{x_n \cdot \dfrac{2}{x_n}} = \sqrt{2}\)이다.`,
          en: String.raw`(a) \(x_0 = 1 > 0\), and if \(x_n > 0\) then \(x_{n+1}\) is the average of two positive numbers, hence positive — by induction \(x_n > 0\) for all \(n\). (b) By AM-GM, \(x_{n+1} = \dfrac{x_n + 2/x_n}{2} \ge \sqrt{x_n \cdot \dfrac{2}{x_n}} = \sqrt{2}\).`,
        },
      },
      {
        text: {
          ko: String.raw`(c) \(x_1 = \dfrac{1 + 2}{2} = \dfrac32\)이고 \(\left(\dfrac32\right)^2 = \dfrac94 > 2\)이므로 \(x_1 > \sqrt{2}\)이다 — 첫 단계에서 근을 지나친다. \(n \ge 1\)에 대해 \(x_{n+1} - x_n = \dfrac{2/x_n - x_n}{2} = \dfrac{2 - x_n^2}{2x_n}\)인데, (b)에 의해 \(x_n \ge \sqrt{2}\)이므로 분자가 \(0\) 이하이다. 따라서 \((x_n)_{n \ge 1}\)은 감소수열이다.`,
          en: String.raw`(c) \(x_1 = \dfrac{1 + 2}{2} = \dfrac32\), and \(\left(\dfrac32\right)^2 = \dfrac94 > 2\), so \(x_1 > \sqrt{2}\) — the first step overshoots the root. For \(n \ge 1\), \(x_{n+1} - x_n = \dfrac{2/x_n - x_n}{2} = \dfrac{2 - x_n^2}{2x_n}\); by (b), \(x_n \ge \sqrt{2}\), so the numerator is \(\le 0\). Hence \((x_n)_{n \ge 1}\) is decreasing.`,
        },
      },
      {
        text: {
          ko: String.raw`(d) \((x_n)_{n \ge 1}\)은 감소하고 아래로 \(\sqrt{2}\)에 의해 유계이므로 극한 \(L \ge \sqrt{2}\)에 수렴한다. 점화식에 극한을 취하면 \(L = \dfrac{L + 2/L}{2}\)이므로 \(2L = L + 2/L\), 즉 \(L = 2/L\)이다. \(L > 0\)이므로 \(L^2 = 2\), 곧 \(L = \sqrt{2}\)이다.`,
          en: String.raw`(d) \((x_n)_{n \ge 1}\) is decreasing and bounded below by \(\sqrt{2}\), so it converges to some \(L \ge \sqrt{2}\). Passing to the limit in the recurrence gives \(L = \dfrac{L + 2/L}{2}\), i.e. \(2L = L + 2/L\), so \(L = 2/L\). Since \(L > 0\), \(L^2 = 2\), i.e. \(L = \sqrt{2}\).`,
        },
      },
    ],
    viz: {
      sceneId: 'newton',
      preset: { fn: 'x^2-2', x0: 1, n: 4 },
      presetCaption: {
        ko: String.raw`\(x_0 = 1\)에서 시작: 첫 접선이 \(\sqrt{2}\)를 지나쳐 \(x_1 = 3/2\)에 닿고, 이후 단조롭게 근으로 내려간다.`,
        en: String.raw`Starting at \(x_0 = 1\): the first tangent overshoots \(\sqrt{2}\) to \(x_1 = 3/2\), then the iterates descend monotonically to the root.`,
      },
    },
  },
  {
    id: 'convex-abs-value',
    difficulty: 1,
    topics: ['convex'],
    statement: {
      ko: String.raw`\(f(x) = \lvert x \rvert\)가 \(\mathbb{R}\)에서 볼록함수임을 삼각부등식으로 증명하고, 볼록함수의 연속성 정리를 인용하여 \(f\)가 연속임을 결론지으세요. \(f\)가 \(0\)에서 미분가능하지 않음을 보여, 볼록성이 미분가능성을 함의하지 않음을 확인하세요.`,
      en: String.raw`Prove via the triangle inequality that \(f(x) = \lvert x \rvert\) is convex on \(\mathbb{R}\), and cite the continuity theorem for convex functions to conclude \(f\) is continuous. Show \(f\) is not differentiable at \(0\), confirming that convexity does not imply differentiability.`,
    },
    display: [String.raw`\lvert tx + (1-t)y \rvert \le t\lvert x \rvert + (1-t)\lvert y \rvert \qquad (0 \le t \le 1)`],
    solution: [
      {
        text: {
          ko: String.raw`\(0 \le t \le 1\)과 \(x, y \in \mathbb{R}\)에 대해 삼각부등식과 절댓값의 동차성으로 \(\lvert tx + (1-t)y \rvert \le \lvert tx \rvert + \lvert (1-t)y \rvert = t\lvert x \rvert + (1-t)\lvert y \rvert\)이다. 이는 정확히 볼록성의 정의이므로 \(f\)는 \(\mathbb{R}\)에서 볼록하다. 볼록함수는 열린 구간에서 연속이므로 (볼록 장면의 정리), \(f\)는 모든 점에서 연속이다.`,
          en: String.raw`For \(0 \le t \le 1\) and \(x, y \in \mathbb{R}\), the triangle inequality and homogeneity of the absolute value give \(\lvert tx + (1-t)y \rvert \le \lvert tx \rvert + \lvert (1-t)y \rvert = t\lvert x \rvert + (1-t)\lvert y \rvert\). This is exactly the definition of convexity, so \(f\) is convex on \(\mathbb{R}\). A convex function is continuous on every open interval (the theorem of the convex scene), so \(f\) is continuous everywhere.`,
        },
      },
      {
        text: {
          ko: String.raw`그러나 \(0\)에서의 차분몫은 \(\dfrac{f(h) - f(0)}{h} = \dfrac{\lvert h \rvert}{h} = \begin{cases} 1 & h > 0 \\ -1 & h < 0 \end{cases}\)이므로 극한이 존재하지 않는다. 따라서 \(f\)는 \(0\)에서 미분가능하지 않다 — 볼록하고 연속이지만 미분가능하지 않은 함수의 가장 간단한 예이다.`,
          en: String.raw`But the difference quotient at \(0\) is \(\dfrac{f(h) - f(0)}{h} = \dfrac{\lvert h \rvert}{h} = \begin{cases} 1 & h > 0 \\ -1 & h < 0 \end{cases}\), which has no limit. Hence \(f\) is not differentiable at \(0\) — the simplest example of a function that is convex and continuous but not differentiable.`,
        },
      },
    ],
  },
  // ------------------------------------------------------------------
  // Difficulty 2
  // ------------------------------------------------------------------
  {
    id: 'darboux-nonvanishing-monotone',
    difficulty: 2,
    topics: ['darboux', 'mvt'],
    statement: {
      ko: String.raw`\(f\)가 \([a,b]\)에서 미분가능하고 모든 \(x \in [a,b]\)에 대해 \(f'(x) \ne 0\)이라고 하자. 다르부 정리와 평균값 정리를 결합하여 \(f\)가 \([a,b]\)에서 엄격히 단조임을 증명하세요.`,
      en: String.raw`Let \(f\) be differentiable on \([a,b]\) with \(f'(x) \ne 0\) for every \(x \in [a,b]\). Combining Darboux's theorem with the Mean Value Theorem, prove that \(f\) is strictly monotone on \([a,b]\).`,
    },
    solution: [
      {
        text: {
          ko: String.raw`다르부 정리에 의해 \(f'\)은 중간값 성질을 갖는다. \(f'\)이 부호를 바꾼다고 하자: \(f'(u) > 0 > f'(v)\)인 \(u, v \in [a,b]\)가 존재한다고 가정하자. \(u\)와 \(v\) 사이의 구간에 다르부 정리를 적용하면 \(f'(c) = 0\)인 점 \(c\)가 존재해야 하는데, 이는 가정에 모순이다. 따라서 \(f'\)은 부호를 바꿀 수 없고, \(0\)이 되는 일도 없으므로, \([a,b]\) 전체에서 항상 양수이거나 항상 음수이다.`,
          en: String.raw`By Darboux's theorem, \(f'\) has the intermediate value property. Suppose \(f'\) changed sign: there exist \(u, v \in [a,b]\) with \(f'(u) > 0 > f'(v)\). Applying Darboux's theorem on the interval between \(u\) and \(v\) would produce a point \(c\) with \(f'(c) = 0\), contradicting the hypothesis. Hence \(f'\) cannot change sign, and since it never vanishes, it is either everywhere positive or everywhere negative on \([a,b]\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(f' > 0\)인 경우를 보자 (음수인 경우도 부호만 반대이다). \(x < y\)인 두 점에 평균값 정리를 적용하면 \(f(y) - f(x) = f'(c)(y - x)\)인 \(c \in (x,y)\)가 존재하고, \(f'(c) > 0\)이므로 \(f(y) > f(x)\)이다. 즉 \(f\)는 엄격히 증가한다. 마찬가지로 \(f' < 0\)이면 \(f\)는 엄격히 감소한다.`,
          en: String.raw`Consider the case \(f' > 0\) (the negative case differs only in sign). For \(x < y\), the Mean Value Theorem gives \(c \in (x,y)\) with \(f(y) - f(x) = f'(c)(y - x)\); since \(f'(c) > 0\), we get \(f(y) > f(x)\). So \(f\) is strictly increasing. Likewise \(f' < 0\) makes \(f\) strictly decreasing.`,
        },
      },
    ],
  },
  {
    id: 'taylor-integral-remainder',
    difficulty: 2,
    topics: ['taylor-thm', 'taylor'],
    statement: {
      ko: String.raw`\(f\)가 \([a,b]\)에서 \(n+1\)번 연속 미분가능하다고 하자 (\(n \ge 0\)). \(a \le x \le b\)에 대해 적분형 나머지를 갖는 테일러 공식
      \[f(x) = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!}(x-a)^k + R_n(x), \qquad R_n(x) = \frac{1}{n!}\int_a^x (x-t)^n f^{(n+1)}(t)\,dt\]
      를 보이세요. \(n = 0\)인 경우는 미적분학 기본정리이고, 귀납 단계에서는 부분적분을 한 번 적용하세요.`,
      en: String.raw`Let \(f\) be \(n+1\) times continuously differentiable on \([a,b]\) (\(n \ge 0\)). For \(a \le x \le b\), prove Taylor's formula with integral remainder
      \[f(x) = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!}(x-a)^k + R_n(x), \qquad R_n(x) = \frac{1}{n!}\int_a^x (x-t)^n f^{(n+1)}(t)\,dt.\]
      The case \(n = 0\) is the Fundamental Theorem of Calculus; for the induction step apply integration by parts once.`,
    },
    solution: [
      {
        text: {
          ko: String.raw`\(n = 0\)일 때 공식은 \(f(x) = f(a) + \int_a^x f'(t)\,dt\)이며, 이는 미적분학 기본정리이다. 귀납 가설로, \(n\)에 대한 공식이 \(C^{n+1}\) 함수에 대해 성립한다고 하자. \(g \in C^{n+2}\)에 대해 \(g\)에 가설을 적용하면 \(g(x) = T_n(x) + \frac{1}{n!}\int_a^x (x-t)^n g^{(n+1)}(t)\,dt\)이다. 여기서 \(T_n\)은 \(n\)차 테일러 다항식이다.`,
          en: String.raw`For \(n = 0\) the formula is \(f(x) = f(a) + \int_a^x f'(t)\,dt\), the Fundamental Theorem of Calculus. As the induction hypothesis, assume the formula for \(n\) holds for \(C^{n+1}\) functions. For \(g \in C^{n+2}\), applying it to \(g\) gives \(g(x) = T_n(x) + \frac{1}{n!}\int_a^x (x-t)^n g^{(n+1)}(t)\,dt\), where \(T_n\) is the degree-\(n\) Taylor polynomial.`,
        },
      },
      {
        text: {
          ko: String.raw`나머지 적분에 부분적분을 적용하자: \(u = g^{(n+1)}(t)\), \(dv = (x-t)^n\,dt\)라 두면 \(du = g^{(n+2)}(t)\,dt\), \(v = -\dfrac{(x-t)^{n+1}}{n+1}\)이다. \(g^{(n+1)}\)과 \((x-t)^{n+1}\)이 연속이므로 부분적분이 정당하고,
          \[\int_a^x (x-t)^n g^{(n+1)}(t)\,dt = \left[-\frac{(x-t)^{n+1}}{n+1}\,g^{(n+1)}(t)\right]_a^x + \frac{1}{n+1}\int_a^x (x-t)^{n+1} g^{(n+2)}(t)\,dt\]
          를 얻는다. 경계항은 \(t = x\)에서 \(0\)이고 \(t = a\)에서 \(\dfrac{(x-a)^{n+1}}{n+1}\,g^{(n+1)}(a)\)를 준다 (마이너스 부호가 뒤집힌다).`,
          en: String.raw`Apply integration by parts to the remainder integral: with \(u = g^{(n+1)}(t)\) and \(dv = (x-t)^n\,dt\), we have \(du = g^{(n+2)}(t)\,dt\) and \(v = -\dfrac{(x-t)^{n+1}}{n+1}\). Since \(g^{(n+1)}\) and \((x-t)^{n+1}\) are continuous, parts is legitimate and
          \[\int_a^x (x-t)^n g^{(n+1)}(t)\,dt = \left[-\frac{(x-t)^{n+1}}{n+1}\,g^{(n+1)}(t)\right]_a^x + \frac{1}{n+1}\int_a^x (x-t)^{n+1} g^{(n+2)}(t)\,dt.\]
          The boundary term is \(0\) at \(t = x\) and gives \(\dfrac{(x-a)^{n+1}}{n+1}\,g^{(n+1)}(a)\) at \(t = a\) (the minus sign flips).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\frac{1}{n!}\)을 곱하면 나머지 적분은 \(\dfrac{g^{(n+1)}(a)}{(n+1)!}(x-a)^{n+1} + \dfrac{1}{(n+1)!}\int_a^x (x-t)^{n+1} g^{(n+2)}(t)\,dt\)가 된다. 첫 항은 정확히 \(n+1\)차 테일러 항이고, 둘째 항은 \(R_{n+1}(x)\)이다. 따라서 \(g(x) = T_{n+1}(x) + R_{n+1}(x)\)이며, 이는 \(n+1\)에 대한 공식이다. 귀납법으로 모든 \(n \ge 0\)에 대해 증명이 끝난다.`,
          en: String.raw`Multiplying by \(\frac{1}{n!}\), the remainder integral becomes \(\dfrac{g^{(n+1)}(a)}{(n+1)!}(x-a)^{n+1} + \dfrac{1}{(n+1)!}\int_a^x (x-t)^{n+1} g^{(n+2)}(t)\,dt\). The first term is exactly the degree-\((n+1)\) Taylor term, and the second is \(R_{n+1}(x)\). Hence \(g(x) = T_{n+1}(x) + R_{n+1}(x)\), which is the formula for \(n+1\). By induction the proof is complete for all \(n \ge 0\).`,
        },
      },
    ],
    viz: {
      sceneId: 'taylor-thm',
      preset: { degree: 5 },
      presetCaption: {
        ko: String.raw`차수 \(n = 5\): 나머지 \(R_5(x)\)가 갇히는 띠 — 적분형 나머지는 이 오차를 정확히 재는 공식이다.`,
        en: String.raw`Degree \(n = 5\): the band trapping the remainder \(R_5(x)\) — the integral remainder is the exact formula measuring this error.`,
      },
    },
  },
  {
    id: 'ftc-unbounded-derivative',
    difficulty: 2,
    topics: ['ftc'],
    statement: {
      ko: String.raw`\(F(x) = x^2\sin(1/x^2)\) (\(x \ne 0\)), \(F(0) = 0\)이라 하자. \(F\)가 \([-1,1]\)의 모든 점에서 미분가능함을 보이고, 도함수 \(F'\)이 \(0\)의 모든 근방에서 무계임을 보이세요. \(F'\)이 \([-1,1]\)에서 리만 적분가능하지 않음을 결론짓고, 이것이 미적분학 기본정리 제2형태의 가설 "도함수가 리만 적분가능하다"가 왜 필요한지 설명하세요.`,
      en: String.raw`Let \(F(x) = x^2\sin(1/x^2)\) for \(x \ne 0\) and \(F(0) = 0\). Show \(F\) is differentiable at every point of \([-1,1]\), but that \(F'\) is unbounded on every neighborhood of \(0\). Conclude \(F'\) is not Riemann integrable on \([-1,1]\), and explain why this shows the hypothesis "the derivative is Riemann integrable" in FTC-II cannot be dropped.`,
    },
    display: [
      String.raw`F'(0) = \lim_{h \to 0} h\sin(1/h^2) = 0`,
      String.raw`F'(x) = 2x\sin(1/x^2) - \frac{2}{x}\cos(1/x^2) \quad (x \ne 0)`,
      String.raw`x_k = \frac{1}{\sqrt{2\pi k}}:\quad F'(x_k) = -2\sqrt{2\pi k} \to -\infty`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`\(F'(0)\)을 정의로 구한다: \(\dfrac{F(h) - F(0)}{h} = h\sin(1/h^2)\)이고 \(\lvert h\sin(1/h^2) \rvert \le \lvert h \rvert\)이므로 조임 정리로 극한은 \(0\)이다. \(x \ne 0\)에서는 곱·합성 미분법으로 \(F'(x) = 2x\sin(1/x^2) + x^2\cos(1/x^2)\cdot(-2/x^3) = 2x\sin(1/x^2) - \dfrac{2}{x}\cos(1/x^2)\)이다. 따라서 \(F\)는 \([-1,1]\)의 모든 점에서 미분가능하다.`,
          en: String.raw`Get \(F'(0)\) from the definition: \(\dfrac{F(h) - F(0)}{h} = h\sin(1/h^2)\), and \(\lvert h\sin(1/h^2) \rvert \le \lvert h \rvert\), so the squeeze theorem gives the limit \(0\). For \(x \ne 0\), the product and chain rules give \(F'(x) = 2x\sin(1/x^2) + x^2\cos(1/x^2)\cdot(-2/x^3) = 2x\sin(1/x^2) - \dfrac{2}{x}\cos(1/x^2)\). Hence \(F\) is differentiable at every point of \([-1,1]\).`,
        },
      },
      {
        text: {
          ko: String.raw`그러나 \(F'\)은 \(0\) 근처에서 무계이다. \(x_k = \dfrac{1}{\sqrt{2\pi k}} \to 0^+\) (\(k = 1, 2, \dots\))라 두면 \(\sin(1/x_k^2) = \sin(2\pi k) = 0\), \(\cos(1/x_k^2) = \cos(2\pi k) = 1\)이므로 \(F'(x_k) = -\dfrac{2}{x_k} = -2\sqrt{2\pi k} \to -\infty\)이다. \(0\)의 모든 근방은 \(k\)가 큰 \(x_k\)를 포함하므로, \(F'\)은 그 위에서 무계이다.`,
          en: String.raw`But \(F'\) is unbounded near \(0\). Put \(x_k = \dfrac{1}{\sqrt{2\pi k}} \to 0^+\) (\(k = 1, 2, \dots\)): then \(\sin(1/x_k^2) = \sin(2\pi k) = 0\) and \(\cos(1/x_k^2) = \cos(2\pi k) = 1\), so \(F'(x_k) = -\dfrac{2}{x_k} = -2\sqrt{2\pi k} \to -\infty\). Every neighborhood of \(0\) contains \(x_k\) for large \(k\), so \(F'\) is unbounded there.`,
        },
      },
      {
        text: {
          ko: String.raw`리만 적분가능한 함수는 유계이어야 하므로 (상합이 유한하려면 필요), \(F'\)은 \([-1,1]\)에서 리만 적분가능하지 않다. 미적분학 기본정리 제2형태는 "\(\int_a^b F' = F(b) - F(a)\)"를 주장하지만, 그 전제로 \(F'\)의 리만 적분가능성을 요구한다 — 이 예는 그 전제가 없으면 적분 \(\int_{-1}^{1} F'\) 자체가 존재하지 않으므로 정리를 적용할 수 없음을 보여준다. 미분가능성만으로는 부족하다.`,
          en: String.raw`A Riemann integrable function must be bounded (needed for finite upper sums), so \(F'\) is not Riemann integrable on \([-1,1]\). FTC-II asserts "\(\int_a^b F' = F(b) - F(a)\)" but requires \(F'\) to be Riemann integrable as a hypothesis — this example shows that without it the integral \(\int_{-1}^{1} F'\) does not even exist, so the theorem cannot be applied. Differentiability alone is not enough.`,
        },
      },
    ],
  },
  {
    id: 'bv-product',
    difficulty: 2,
    topics: ['bounded-variation'],
    statement: {
      ko: String.raw`\(f\)와 \(g\)가 \([a,b]\)에서 유계변동이라고 하자. 먼저 유계변동 함수가 유계임을 보이고 (힌트: \(\lvert f(x) - f(a) \rvert \le V_a^b(f)\)), 그 다음 곱 \(fg\)도 \([a,b]\)에서 유계변동임을 증명하세요. 전변동에 대한 상한을 구하세요.`,
      en: String.raw`Let \(f\) and \(g\) be of bounded variation on \([a,b]\). First show a BV function is bounded (hint: \(\lvert f(x) - f(a) \rvert \le V_a^b(f)\)), then prove the product \(fg\) is also of bounded variation on \([a,b]\). Find an upper bound for its total variation.`,
    },
    display: [String.raw`V_a^b(fg) \le M_f\,V_a^b(g) + M_g\,V_a^b(f), \qquad M_f = \sup_{[a,b]}\lvert f \rvert,\ M_g = \sup_{[a,b]}\lvert g \rvert`],
    solution: [
      {
        text: {
          ko: String.raw`\(x \in [a,b]\)에 대해 분할 \(\{a, x, b\}\)를 생각하면 \(\lvert f(x) - f(a) \rvert \le V_a^b(f)\)이므로, 삼각부등식으로 \(\lvert f(x) \rvert \le \lvert f(a) \rvert + V_a^b(f) < \infty\)이다. 따라서 \(f\)는 유계이고 \(M_f = \sup_{[a,b]}\lvert f \rvert < \infty\)이며, \(g\)도 마찬가지이다.`,
          en: String.raw`For \(x \in [a,b]\), the partition \(\{a, x, b\}\) gives \(\lvert f(x) - f(a) \rvert \le V_a^b(f)\), so by the triangle inequality \(\lvert f(x) \rvert \le \lvert f(a) \rvert + V_a^b(f) < \infty\). Hence \(f\) is bounded with \(M_f = \sup_{[a,b]}\lvert f \rvert < \infty\), and likewise for \(g\).`,
        },
      },
      {
        text: {
          ko: String.raw`임의의 분할 \(P = \{x_0, \dots, x_n\}\)에 대해 항등식 \(f(x_i)g(x_i) - f(x_{i-1})g(x_{i-1}) = f(x_i)\bigl(g(x_i) - g(x_{i-1})\bigr) + g(x_{i-1})\bigl(f(x_i) - f(x_{i-1})\bigr)\)을 쓰자. 절댓값을 취하고 합하면
          \[\sum_{i=1}^{n}\lvert (fg)(x_i) - (fg)(x_{i-1}) \rvert \le M_f \sum_{i=1}^{n}\lvert g(x_i) - g(x_{i-1}) \rvert + M_g \sum_{i=1}^{n}\lvert f(x_i) - f(x_{i-1}) \rvert \le M_f V_a^b(g) + M_g V_a^b(f).\]
          우변은 \(P\)와 무관하므로, 상한을 취해 \(V_a^b(fg) \le M_f V_a^b(g) + M_g V_a^b(f) < \infty\)를 얻는다. 즉 \(fg\)는 유계변동이다.`,
          en: String.raw`For any partition \(P = \{x_0, \dots, x_n\}\), use the identity \(f(x_i)g(x_i) - f(x_{i-1})g(x_{i-1}) = f(x_i)\bigl(g(x_i) - g(x_{i-1})\bigr) + g(x_{i-1})\bigl(f(x_i) - f(x_{i-1})\bigr)\). Taking absolute values and summing,
          \[\sum_{i=1}^{n}\lvert (fg)(x_i) - (fg)(x_{i-1}) \rvert \le M_f \sum_{i=1}^{n}\lvert g(x_i) - g(x_{i-1}) \rvert + M_g \sum_{i=1}^{n}\lvert f(x_i) - f(x_{i-1}) \rvert \le M_f V_a^b(g) + M_g V_a^b(f).\]
          The right side is independent of \(P\), so taking the supremum gives \(V_a^b(fg) \le M_f V_a^b(g) + M_g V_a^b(f) < \infty\): \(fg\) is of bounded variation.`,
        },
      },
    ],
  },
  {
    id: 'banach-reciprocal-contraction',
    difficulty: 2,
    topics: ['banach'],
    statement: {
      ko: String.raw`\([0,1]\) 위의 사상 \(T(x) = \dfrac{1}{2+x}\)를 생각하자. (a) \(T\)가 \([0,1]\)을 자기 자신으로 보내고, 상수 \(c = 1/4\)인 축소사상임을 보이세요. (b) 바나흐 고정점 정리를 인용하여 \(T\)의 유일한 고정점을 구하고 (이차방정식을 풀어), 임의의 시작점에서의 반복이 그 점으로 수렴함을 설명하세요.`,
      en: String.raw`Consider the map \(T(x) = \dfrac{1}{2+x}\) on \([0,1]\). (a) Show \(T\) maps \([0,1]\) into itself and is a contraction with constant \(c = 1/4\). (b) Cite the Banach fixed point theorem to find the unique fixed point of \(T\) (solve the quadratic), and explain why iteration from any starting point converges to it.`,
    },
    display: [
      String.raw`\lvert T(x) - T(y) \rvert = \frac{\lvert x - y \rvert}{(2+x)(2+y)} \le \frac14\,\lvert x - y \rvert`,
      String.raw`x = \frac{1}{2+x} \iff x^2 + 2x - 1 = 0 \iff x = \sqrt{2} - 1 \approx 0.4142`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`(a) \(T\)는 \([0,1]\)에서 감소하고 \(T(0) = 1/2\), \(T(1) = 1/3\)이므로 \(T([0,1]) = [1/3, 1/2] \subset [0,1]\)이다. \(x, y \in [0,1]\)에 대해 \(\lvert T(x) - T(y) \rvert = \left\lvert \dfrac{2+y-(2+x)}{(2+x)(2+y)} \right\rvert = \dfrac{\lvert x - y \rvert}{(2+x)(2+y)}\)이다. \((2+x)(2+y) \ge 2 \cdot 2 = 4\)이므로 \(\lvert T(x) - T(y) \rvert \le \dfrac14\lvert x - y \rvert\)이다 — 상수 \(1/4\)인 축소사상이다.`,
          en: String.raw`(a) \(T\) is decreasing on \([0,1]\) with \(T(0) = 1/2\) and \(T(1) = 1/3\), so \(T([0,1]) = [1/3, 1/2] \subset [0,1]\). For \(x, y \in [0,1]\), \(\lvert T(x) - T(y) \rvert = \left\lvert \dfrac{2+y-(2+x)}{(2+x)(2+y)} \right\rvert = \dfrac{\lvert x - y \rvert}{(2+x)(2+y)}\). Since \((2+x)(2+y) \ge 2 \cdot 2 = 4\), we get \(\lvert T(x) - T(y) \rvert \le \dfrac14\lvert x - y \rvert\) — a contraction with constant \(1/4\).`,
        },
      },
      {
        text: {
          ko: String.raw`(b) \([0,1]\)은 완비이므로 바나흐 고정점 정리(바나흐 장면)에 의해 \(T\)는 유일한 고정점 \(x^\ast \in [0,1]\)을 갖는다. \(x = \dfrac{1}{2+x}\)는 \(x^2 + 2x - 1 = 0\)과 동치이고, 근은 \(x = -1 \pm \sqrt{2}\)이다. \([0,1]\) 안에 있는 것은 \(x^\ast = \sqrt{2} - 1 \approx 0.4142\)뿐이다. 같은 정리에 의해 임의의 \(x_0 \in [0,1]\)에서 시작한 반복 \(x_{n+1} = T(x_n)\)은 \(x^\ast\)로 수렴한다 — 오차는 매 단계 최소 \(1/4\)씩 줄어든다.`,
          en: String.raw`(b) \([0,1]\) is complete, so the Banach fixed point theorem (the Banach scene) gives \(T\) a unique fixed point \(x^\ast \in [0,1]\). The equation \(x = \dfrac{1}{2+x}\) is equivalent to \(x^2 + 2x - 1 = 0\), with roots \(x = -1 \pm \sqrt{2}\). The only one in \([0,1]\) is \(x^\ast = \sqrt{2} - 1 \approx 0.4142\). By the same theorem, the iteration \(x_{n+1} = T(x_n)\) from any \(x_0 \in [0,1]\) converges to \(x^\ast\) — the error shrinks by at least a factor of \(1/4\) each step.`,
        },
      },
    ],
  },
  // ------------------------------------------------------------------
  // Difficulty 3
  // ------------------------------------------------------------------
  {
    id: 'bv-uniform-limit-fails',
    difficulty: 3,
    topics: ['bounded-variation'],
    statement: {
      ko: String.raw`연속함수의 균일극한은 연속이다 (바이어슈트라스 장면). 유계변동에 대해서는 이것이 성립하지 않음을 보이세요: \(g(x) = x^2\sin(1/x^2)\) (\(x > 0\)), \(g(0) = 0\)이라 하고,
      \[g_n(x) = \begin{cases} g(1/n) & 0 \le x \le 1/n \\ g(x) & 1/n \le x \le 1 \end{cases}\]
      라 하자. (a) \(g\)가 \([0,1]\)에서 유계변동이 아님을, 점 \(x_k = \sqrt{2/((2k+1)\pi)}\)에서의 진동을 이용해 보이세요. (b) 각 \(g_n\)은 \([0,1]\)에서 유계변동이고 \(g_n \to g\) 균일수렴임을 보이세요.`,
      en: String.raw`The uniform limit of continuous functions is continuous (the Weierstrass scene). Show this fails for bounded variation: with \(g(x) = x^2\sin(1/x^2)\) for \(x > 0\) and \(g(0) = 0\), put
      \[g_n(x) = \begin{cases} g(1/n) & 0 \le x \le 1/n \\ g(x) & 1/n \le x \le 1 \end{cases}.\]
      (a) Show \(g\) is NOT of bounded variation on \([0,1]\), using the oscillation at the points \(x_k = \sqrt{2/((2k+1)\pi)}\). (b) Show each \(g_n\) is of bounded variation on \([0,1]\) and \(g_n \to g\) uniformly.`,
    },
    display: [
      String.raw`x_k = \frac{1}{\sqrt{\pi/2 + k\pi}},\qquad g(x_k) = (-1)^k\,\frac{2}{(2k+1)\pi}`,
      String.raw`\sum_{k=1}^{N}\lvert g(x_{k-1}) - g(x_k) \rvert = \frac{2}{\pi}\sum_{k=1}^{N}\left(\frac{1}{2k-1} + \frac{1}{2k+1}\right) \to \infty`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`(a) \(x_k = \dfrac{1}{\sqrt{\pi/2 + k\pi}}\)라 두면 \(x_k \downarrow 0\)이고 \(\sin(1/x_k^2) = \sin(\pi/2 + k\pi) = (-1)^k\)이므로 \(g(x_k) = (-1)^k x_k^2 = (-1)^k\,\dfrac{2}{(2k+1)\pi}\)이다. 또한 \(x_0 = \sqrt{2/\pi} \approx 0.798 < 1\)이다. 분할 \(0 < x_N < x_{N-1} < \cdots < x_1 < x_0 < 1\)에 대해, 이웃한 두 점의 함수값은 부호가 반대이므로
          \[\lvert g(x_{k-1}) - g(x_k) \rvert = \frac{2}{\pi}\left(\frac{1}{2k-1} + \frac{1}{2k+1}\right) \qquad (k = 1, \dots, N).\]
          따라서 이 분할 위의 변동합은 \(\dfrac{2}{\pi}\sum_{k=1}^{N}\left(\dfrac{1}{2k-1} + \dfrac{1}{2k+1}\right) \ge \dfrac{2}{\pi}\sum_{k=1}^{N}\dfrac{1}{2k+1} \ge \dfrac{1}{\pi}\sum_{k=1}^{N}\dfrac{1}{k+1} \to \infty\) (\(N \to \infty\), 조화급수)이다. 전변동이 무한하므로 \(g\)는 유계변동이 아니다.`,
          en: String.raw`(a) Put \(x_k = \dfrac{1}{\sqrt{\pi/2 + k\pi}}\); then \(x_k \downarrow 0\) and \(\sin(1/x_k^2) = \sin(\pi/2 + k\pi) = (-1)^k\), so \(g(x_k) = (-1)^k x_k^2 = (-1)^k\,\dfrac{2}{(2k+1)\pi}\). Also \(x_0 = \sqrt{2/\pi} \approx 0.798 < 1\). On the partition \(0 < x_N < x_{N-1} < \cdots < x_1 < x_0 < 1\), consecutive values have opposite signs, so
          \[\lvert g(x_{k-1}) - g(x_k) \rvert = \frac{2}{\pi}\left(\frac{1}{2k-1} + \frac{1}{2k+1}\right) \qquad (k = 1, \dots, N).\]
          Hence the variation sum over this partition is \(\dfrac{2}{\pi}\sum_{k=1}^{N}\left(\dfrac{1}{2k-1} + \dfrac{1}{2k+1}\right) \ge \dfrac{2}{\pi}\sum_{k=1}^{N}\dfrac{1}{2k+1} \ge \dfrac{1}{\pi}\sum_{k=1}^{N}\dfrac{1}{k+1} \to \infty\) as \(N \to \infty\) (harmonic series). The total variation is infinite, so \(g\) is not of bounded variation.`,
        },
      },
      {
        text: {
          ko: String.raw`(b) \(g_n\)은 \(x = 1/n\)에서 연속이다 (양쪽 값이 모두 \(g(1/n)\)). \([0, 1/n]\)에서는 상수이므로 유계변동이고, \([1/n, 1]\)에서는 \(g\)가 \(C^1\)이므로 유계변동이다 (\(V_{1/n}^1(g) \le \int_{1/n}^1 \lvert g' \rvert < \infty\) — \(g'\)은 콤팩트 구간에서 연속). 따라서 \(g_n\)은 \([0,1]\)에서 유계변동이다. 균일수렴: \([1/n, 1]\)에서는 \(g_n = g\)이므로 차이가 \(0\)이고, \([0, 1/n]\)에서는 \(\lvert g_n(x) - g(x) \rvert = \lvert g(1/n) - g(x) \rvert \le \lvert g(1/n) \rvert + \lvert g(x) \rvert \le \dfrac{1}{n^2} + \dfrac{1}{n^2} = \dfrac{2}{n^2} \to 0\)이다 (\(\lvert g(t) \rvert \le t^2\) 이용). 즉 \(\lVert g_n - g \rVert_\infty \to 0\)이다.`,
          en: String.raw`(b) \(g_n\) is continuous at \(x = 1/n\) (both sides equal \(g(1/n)\)). It is constant, hence BV, on \([0, 1/n]\), and \(g\) is \(C^1\), hence BV, on \([1/n, 1]\) (\(V_{1/n}^1(g) \le \int_{1/n}^1 \lvert g' \rvert < \infty\) since \(g'\) is continuous on a compact interval). So each \(g_n\) is of bounded variation on \([0,1]\). For uniform convergence: on \([1/n, 1]\), \(g_n = g\), so the difference is \(0\); on \([0, 1/n]\), \(\lvert g_n(x) - g(x) \rvert = \lvert g(1/n) - g(x) \rvert \le \lvert g(1/n) \rvert + \lvert g(x) \rvert \le \dfrac{1}{n^2} + \dfrac{1}{n^2} = \dfrac{2}{n^2} \to 0\) (using \(\lvert g(t) \rvert \le t^2\)). Thus \(\lVert g_n - g \rVert_\infty \to 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`결론: 각 \(g_n\)은 유계변동이고 \(g_n \to g\) 균일수렴이지만, 극한 \(g\)는 유계변동이 아니다. 균일극한은 연속성은 보존하지만 유계변동성은 보존하지 않는다 — 변동이 극한 과정에서 "새어 나갈" 수 있다.`,
          en: String.raw`Conclusion: each \(g_n\) is of bounded variation and \(g_n \to g\) uniformly, but the limit \(g\) is not of bounded variation. Uniform limits preserve continuity but not bounded variation — variation can "leak out" in the limit.`,
        },
      },
    ],
  },
  {
    id: 'approximate-identity-general',
    difficulty: 3,
    topics: ['fejer-theorem', 'fourier'],
    statement: {
      ko: String.raw`연속인 \(2\pi\)-주기 핵 \(K_n \ge 0\)이 다음을 만족한다고 하자: (i) \(\dfrac{1}{2\pi}\int_{-\pi}^{\pi} K_n(t)\,dt = 1\); (ii) 질량 집중: 모든 \(\delta > 0\)에 대해 \(\dfrac{1}{2\pi}\int_{\delta \le \lvert t \rvert \le \pi} K_n(t)\,dt \to 0\) (\(n \to \infty\)). 연속인 \(2\pi\)-주기 함수 \(f\)에 대해 합성곱 \((f \ast K_n)(x) = \dfrac{1}{2\pi}\int_{-\pi}^{\pi} f(x-t)K_n(t)\,dt\)이 \(f\)로 균일수렴함을 증명하세요. (페이예르 핵은 이 가설들을 만족하므로 — 페이예르 장면 참조 — 이는 페이예르 정리를 일반화합니다.)`,
      en: String.raw`Let \(K_n \ge 0\) be continuous \(2\pi\)-periodic kernels satisfying: (i) \(\dfrac{1}{2\pi}\int_{-\pi}^{\pi} K_n(t)\,dt = 1\); (ii) mass concentration: for every \(\delta > 0\), \(\dfrac{1}{2\pi}\int_{\delta \le \lvert t \rvert \le \pi} K_n(t)\,dt \to 0\) as \(n \to \infty\). For \(f\) continuous and \(2\pi\)-periodic, prove the convolution \((f \ast K_n)(x) = \dfrac{1}{2\pi}\int_{-\pi}^{\pi} f(x-t)K_n(t)\,dt\) converges to \(f\) uniformly. (The Fejér kernel satisfies these hypotheses — see the Fejér scene — so this generalizes Fejér's theorem.)`,
    },
    display: [
      String.raw`\lvert (f \ast K_n)(x) - f(x) \rvert \le \frac{1}{2\pi}\int_{-\pi}^{\pi} K_n(t)\,\lvert f(x-t) - f(x) \rvert\,dt`,
      String.raw`= \underbrace{\frac{1}{2\pi}\int_{\lvert t \rvert < \delta} \cdots}_{\text{uniform continuity}} + \underbrace{\frac{1}{2\pi}\int_{\delta \le \lvert t \rvert \le \pi} \cdots}_{\text{tail } \to 0}`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`질량이 \(1\)이므로 \(f(x) = \dfrac{1}{2\pi}\int_{-\pi}^{\pi} f(x)K_n(t)\,dt\)라 쓸 수 있다 (\(f\)는 \(2\pi\)-주기이므로 \(f(x-t)\)는 \(t \in [-\pi,\pi]\)에서 문제없이 정의된다). 빼고 절댓값을 취하면 모든 \(x\)에 대해
          \[\lvert (f \ast K_n)(x) - f(x) \rvert \le \frac{1}{2\pi}\int_{-\pi}^{\pi} K_n(t)\,\lvert f(x-t) - f(x) \rvert\,dt\]
          를 얻는다. 적분을 \(\lvert t \rvert < \delta\)와 \(\delta \le \lvert t \rvert \le \pi\)로 나눈다.`,
          en: String.raw`Since the mass is \(1\), write \(f(x) = \dfrac{1}{2\pi}\int_{-\pi}^{\pi} f(x)K_n(t)\,dt\) (\(f(x-t)\) is well defined for \(t \in [-\pi,\pi]\) because \(f\) is \(2\pi\)-periodic). Subtracting and taking absolute values gives, for every \(x\),
          \[\lvert (f \ast K_n)(x) - f(x) \rvert \le \frac{1}{2\pi}\int_{-\pi}^{\pi} K_n(t)\,\lvert f(x-t) - f(x) \rvert\,dt.\]
          Split the integral into \(\lvert t \rvert < \delta\) and \(\delta \le \lvert t \rvert \le \pi\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(\varepsilon > 0\)이 주어졌다고 하자. \(f\)는 콤팩트 집합 \(\mathbb{R}\) 위에서 연속인 주기함수이므로 균일연속이다: \(\lvert t \rvert < \delta\)이면 모든 \(x\)에 대해 \(\lvert f(x-t) - f(x) \rvert < \varepsilon/2\)인 \(\delta > 0\)이 존재한다. \(K_n \ge 0\)이고 질량이 \(1\)이므로 첫 번째 적분은 \(\le \varepsilon/2\)이다 (\(x\)와 무관하게).`,
          en: String.raw`Let \(\varepsilon > 0\). As a continuous periodic function, \(f\) is uniformly continuous on \(\mathbb{R}\): there is \(\delta > 0\) such that \(\lvert t \rvert < \delta\) implies \(\lvert f(x-t) - f(x) \rvert < \varepsilon/2\) for all \(x\). Since \(K_n \ge 0\) with mass \(1\), the first integral is \(\le \varepsilon/2\), independently of \(x\).`,
        },
      },
      {
        text: {
          ko: String.raw`꼬리 적분은 \(\lvert f(x-t) - f(x) \rvert \le 2\lVert f \rVert_\infty\)로 상한이 잡히므로
          \[\frac{1}{2\pi}\int_{\delta \le \lvert t \rvert \le \pi} K_n(t)\,\lvert f(x-t) - f(x) \rvert\,dt \le 2\lVert f \rVert_\infty \cdot \frac{1}{2\pi}\int_{\delta \le \lvert t \rvert \le \pi} K_n(t)\,dt \to 0\]
          이다 (\(n \to \infty\), 가설 (ii)). 따라서 \(n\)이 충분히 크면 꼬리도 \(x\)와 무관하게 \(<\varepsilon/2\)이다. 합하면 \(\lVert f \ast K_n - f \rVert_\infty < \varepsilon\) — 균일수렴이다. 페이예르 핵 \(K_N\)은 \(K_N \ge 0\), 질량 \(1\), 그리고 꼬리 상한 \(K_N(t) \le \dfrac{1}{N\sin^2(\delta/2)}\) (\(\delta \le \lvert t \rvert \le \pi\))을 만족하므로 (페이예르 장면의 문제들), 페이예르 정리는 이 일반 정리의 따름정리이다.`,
          en: String.raw`The tail integral is bounded via \(\lvert f(x-t) - f(x) \rvert \le 2\lVert f \rVert_\infty\):
          \[\frac{1}{2\pi}\int_{\delta \le \lvert t \rvert \le \pi} K_n(t)\,\lvert f(x-t) - f(x) \rvert\,dt \le 2\lVert f \rVert_\infty \cdot \frac{1}{2\pi}\int_{\delta \le \lvert t \rvert \le \pi} K_n(t)\,dt \to 0\]
          as \(n \to \infty\), by hypothesis (ii). So for large \(n\) the tail is \(<\varepsilon/2\) independently of \(x\). Together, \(\lVert f \ast K_n - f \rVert_\infty < \varepsilon\) — uniform convergence. The Fejér kernel \(K_N\) satisfies \(K_N \ge 0\), mass \(1\), and the tail bound \(K_N(t) \le \dfrac{1}{N\sin^2(\delta/2)}\) on \(\delta \le \lvert t \rvert \le \pi\) (the Fejér scene's problems), so Fejér's theorem is a corollary of this general result.`,
        },
      },
    ],
  },
  {
    id: 'taylor-flat-function',
    difficulty: 3,
    topics: ['taylor', 'taylor-thm'],
    statement: {
      ko: String.raw`\(f(x) = e^{-1/x^2}\) (\(x \ne 0\)), \(f(0) = 0\)이라 하자. \(f\)가 \(\mathbb{R}\)에서 무한히 미분가능하고 모든 \(n \ge 0\)에 대해 \(f^{(n)}(0) = 0\)임을 증명하세요. 이를 이용해 \(f\)의 매클로린 급수가 모든 \(x\)에서 수렴하지만 \(x = 0\)에서만 \(f(x)\)와 일치함을 보이세요 — 테일러 급수가 함수를 복원하지 않을 수 있습니다.`,
      en: String.raw`Let \(f(x) = e^{-1/x^2}\) for \(x \ne 0\) and \(f(0) = 0\). Prove \(f\) is infinitely differentiable on \(\mathbb{R}\) with \(f^{(n)}(0) = 0\) for every \(n \ge 0\). Deduce that the Maclaurin series of \(f\) converges for every \(x\) but equals \(f(x)\) only at \(x = 0\) — a Taylor series need not recover the function.`,
    },
    display: [
      String.raw`f^{(n)}(x) = P_n(1/x)\,e^{-1/x^2} \quad (x \ne 0),\qquad \lim_{\lvert u \rvert \to \infty} P(u)e^{-u^2} = 0`,
      String.raw`T(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(0)}{n!}x^n \equiv 0 \quad\text{but}\quad f(x) > 0\ (x \ne 0)`,
    ],
    solution: [
      {
        text: {
          ko: String.raw`보조정리: 임의의 다항식 \(P\)에 대해 \(\lim_{\lvert u \rvert \to \infty} P(u)e^{-u^2} = 0\)이다. 실제로 \(v = u^2 \ge 0\)에 대해 \(e^{v} \ge \dfrac{v^m}{m!}\) (지수함수의 테일러 전개에서 한 항)이므로, \(2m > \deg P\)인 \(m\)을 잡으면 \(\lvert P(u) \rvert e^{-u^2} \le m!\,\dfrac{\lvert P(u) \rvert}{u^{2m}} \to 0\)이다.`,
          en: String.raw`Lemma: for any polynomial \(P\), \(\lim_{\lvert u \rvert \to \infty} P(u)e^{-u^2} = 0\). Indeed, for \(v = u^2 \ge 0\), \(e^{v} \ge \dfrac{v^m}{m!}\) (one term of the exponential's Taylor expansion), so with \(2m > \deg P\) we get \(\lvert P(u) \rvert e^{-u^2} \le m!\,\dfrac{\lvert P(u) \rvert}{u^{2m}} \to 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(x \ne 0\)에서 \(f^{(n)}(x) = P_n(1/x)e^{-1/x^2}\)인 다항식 \(P_n\)이 존재함을 귀납법으로 보이자. \(n = 0\)일 때 \(P_0 \equiv 1\)이다. \(u = 1/x\)라 두면
          \[\frac{d}{dx}\Bigl[P(u)e^{-1/x^2}\Bigr] = P'(u)\!\left(-\frac{1}{x^2}\right)e^{-1/x^2} + P(u)e^{-1/x^2}\!\left(\frac{2}{x^3}\right) = \bigl[-u^2P'(u) + 2u^3P(u)\bigr]e^{-u^2},\]
          괄호 안은 \(u\)의 다항식이므로 귀납 단계가 성립한다. 따라서 \(f\)는 \(x \ne 0\)에서 무한히 미분가능하다.`,
          en: String.raw`We claim \(f^{(n)}(x) = P_n(1/x)e^{-1/x^2}\) for \(x \ne 0\), for some polynomial \(P_n\), by induction. For \(n = 0\), \(P_0 \equiv 1\). With \(u = 1/x\),
          \[\frac{d}{dx}\Bigl[P(u)e^{-1/x^2}\Bigr] = P'(u)\!\left(-\frac{1}{x^2}\right)e^{-1/x^2} + P(u)e^{-1/x^2}\!\left(\frac{2}{x^3}\right) = \bigl[-u^2P'(u) + 2u^3P(u)\bigr]e^{-u^2},\]
          and the bracket is a polynomial in \(u\), completing the induction step. Hence \(f\) is infinitely differentiable at \(x \ne 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`이제 \(f^{(n)}(0) = 0\)을 귀납법으로 보인다. \(n = 0\)은 정의이다. \(f'(0) = \lim_{h \to 0} \dfrac{e^{-1/h^2}}{h} = \lim_{\lvert u \rvert \to \infty} u e^{-u^2} = 0\) (보조정리, \(u = 1/h\)). 귀납 가설로 \(f^{(n)}(0) = 0\)이라 하자. 그러면
          \[f^{(n+1)}(0) = \lim_{h \to 0}\frac{f^{(n)}(h) - f^{(n)}(0)}{h} = \lim_{h \to 0}\frac{P_n(1/h)e^{-1/h^2}}{h} = \lim_{\lvert u \rvert \to \infty} uP_n(u)e^{-u^2} = 0\]
          이다 (보조정리를 \(uP_n(u)\)에 적용). 따라서 모든 \(n\)에 대해 \(f^{(n)}(0) = 0\)이고, \(f\)는 \(0\)에서도 무한히 미분가능하다.`,
          en: String.raw`Now \(f^{(n)}(0) = 0\) by induction. The case \(n = 0\) is the definition. \(f'(0) = \lim_{h \to 0} \dfrac{e^{-1/h^2}}{h} = \lim_{\lvert u \rvert \to \infty} u e^{-u^2} = 0\) (lemma, with \(u = 1/h\)). Assuming \(f^{(n)}(0) = 0\),
          \[f^{(n+1)}(0) = \lim_{h \to 0}\frac{f^{(n)}(h) - f^{(n)}(0)}{h} = \lim_{h \to 0}\frac{P_n(1/h)e^{-1/h^2}}{h} = \lim_{\lvert u \rvert \to \infty} uP_n(u)e^{-u^2} = 0\]
          (lemma applied to \(uP_n(u)\)). Thus \(f^{(n)}(0) = 0\) for all \(n\), and \(f\) is infinitely differentiable at \(0\) too.`,
        },
      },
      {
        text: {
          ko: String.raw`매클로린 급수는 \(T(x) = \sum_{n=0}^{\infty} \dfrac{f^{(n)}(0)}{n!}x^n \equiv 0\) — 모든 \(x\)에서 \(0\)으로 수렴한다. 그러나 \(x \ne 0\)에서는 \(f(x) = e^{-1/x^2} > 0\)이다. 즉 테일러 급수는 모든 점에서 수렴하지만 \(x = 0\)에서만 \(f\)와 일치한다: 매끄러운 함수라도 그 테일러 급수가 함수를 복원한다는 보장은 없다.`,
          en: String.raw`The Maclaurin series is \(T(x) = \sum_{n=0}^{\infty} \dfrac{f^{(n)}(0)}{n!}x^n \equiv 0\) — it converges (to \(0\)) at every \(x\). But for \(x \ne 0\), \(f(x) = e^{-1/x^2} > 0\). So the Taylor series converges everywhere yet matches \(f\) only at \(x = 0\): even a smooth function need not be recovered by its Taylor series.`,
        },
      },
    ],
  },
]
