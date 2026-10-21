import type { ProblemMeta } from '../../../contracts.ts';

/**
 * Pure data: examples/exercises for the derivative-monotonicity scene
 * (Tao, Analysis I, Proposition 10.3.3). Imports nothing except types.
 * Every number below was verified against the model
 * (tests/derivative-monotonicity.test.ts):
 *   cubic f'(0) = -3, f'(2) = 9, f'(1) = 0 (critical points x = ±1);
 *   cubic x0 = -1.25 (preset x: 25): f'(x0) = 1.6875;
 *   exp f'(0) = 1, sign +1;
 *   the secant slope sign agrees with the derivative sign on each monotone piece.
 */
export const derivativeMonotonicityProblems: readonly ProblemMeta[] = [
  {
    id: 'derivative-monotonicity-nonneg',
    statement: {
      ko: String.raw`\(f\)가 \([a, b]\)에서 연속이고 \((a, b)\)에서 미분 가능하며, \((a, b)\)의 모든 점에서 \(f' \ge 0\)이라고 하세요. \(f\)가 \([a, b]\)에서 증가함수임을 평균값 정리로 완전히 증명하세요.`,
      en: String.raw`Let \(f\) be continuous on \([a, b]\) and differentiable on \((a, b)\), with \(f' \ge 0\) at every point of \((a, b)\). Prove completely, using the Mean Value Theorem, that \(f\) is increasing on \([a, b]\).`,
    },
    display: [
      String.raw`f(y) - f(x) = f'(c)(y - x) \ge 0 \quad (x < y,\ c \in (x, y))`,
    ],
    preset: { fn: 'cubic', x: 70 },
    presetCaption: {
      ko: String.raw`\(f(x) = x^3 - 3x\), \(x_0 = 1\): 여기서 \(f'(1) = 0\)이지만 (회색 접선) \(f\)는 전체 구간에서 여전히 증가합니다 — \(f' \ge 0\)은 등호를 허용하는 조건입니다.`,
      en: String.raw`\(f(x) = x^3 - 3x\), \(x_0 = 1\): here \(f'(1) = 0\) (gray tangent), yet \(f\) is still increasing across the whole interval — \(f' \ge 0\) allows equality.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\([a, b]\)에서 \(x < y\)인 두 점을 임의로 잡습니다. \(f\)를 \([x, y]\)로 제한하면, 제한된 함수는 \([x, y]\)에서 연속이고 \((x, y)\)에서 미분 가능하므로 평균값 정리의 가정을 만족합니다 (원래 가정이 \([a,b]\) 전체에 대한 것이므로, 부분구간에서도 그대로 성립합니다).`,
          en: String.raw`Take any two points \(x < y\) in \([a, b]\). The restriction of \(f\) to \([x, y]\) is continuous on \([x, y]\) and differentiable on \((x, y)\), so it satisfies the hypotheses of the Mean Value Theorem (the original hypotheses on \([a,b]\) pass down to every subinterval).`,
        },
      },
      {
        text: {
          ko: String.raw`평균값 정리에 의해 \(f(y) - f(x) = f'(c)(y - x)\)를 만족하는 \(c \in (x, y)\)가 존재합니다. 그런데 \(c \in (a, b)\)이므로 가정에서 \(f'(c) \ge 0\)이고, \(y - x > 0\)이므로 곱 \(f'(c)(y - x) \ge 0\)입니다.`,
          en: String.raw`The Mean Value Theorem gives a point \(c \in (x, y)\) with \(f(y) - f(x) = f'(c)(y - x)\). Since \(c \in (a, b)\), the hypothesis yields \(f'(c) \ge 0\), and \(y - x > 0\), so the product \(f'(c)(y - x) \ge 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`따라서 \(f(y) - f(x) \ge 0\), 즉 \(f(x) \le f(y)\)입니다. \(x < y\)가 임의였으므로 \(f\)는 \([a, b]\)에서 증가함수입니다. 여기서 등호가 허용됨(\(\le\))에 주목하세요 — 이것이 다음 문제의 엄격한 부등식과 구분되는 지점입니다.`,
          en: String.raw`Hence \(f(y) - f(x) \ge 0\), i.e. \(f(x) \le f(y)\). Since \(x < y\) were arbitrary, \(f\) is increasing on \([a, b]\). Note the non-strict inequality (\(\le\)) — this is what distinguishes this result from the strict version in the next problem.`,
        },
      },
    ],
  },
  {
    id: 'derivative-monotonicity-strict',
    statement: {
      ko: String.raw`위와 같은 가정에서 \(f' > 0\)이 \((a, b)\)의 모든 점에서 성립하면, \(f\)가 \([a, b]\)에서 엄격히 증가함수임을 증명하세요.`,
      en: String.raw`Under the same hypotheses, if \(f' > 0\) at every point of \((a, b)\), prove that \(f\) is strictly increasing on \([a, b]\).`,
    },
    display: [
      String.raw`f(y) - f(x) = f'(c)(y - x) > 0 \quad (x < y,\ c \in (x, y))`,
    ],
    preset: { fn: 'exp', x: 50 },
    presetCaption: {
      ko: String.raw`\(f(x) = e^x\), \(x_0 = 0\): \(f'(0) = 1 > 0\)이고(초록 접선), 도함수가 어디에서도 0이 되지 않으므로 배경 전체가 초록입니다 — 엄격한 증가의 전형입니다.`,
      en: String.raw`\(f(x) = e^x\), \(x_0 = 0\): \(f'(0) = 1 > 0\) (green tangent), and since the derivative never vanishes the whole background is green — the archetype of strict increase.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\([a, b]\)에서 \(x < y\)를 임의로 잡고, 문제 1과 마찬가지로 \(f\)를 \([x, y]\)에 제한해 평균값 정리를 적용합니다: \(f(y) - f(x) = f'(c)(y - x)\)인 \(c \in (x, y)\)가 존재합니다.`,
          en: String.raw`Take arbitrary \(x < y\) in \([a, b]\) and, as in problem 1, apply the Mean Value Theorem to \(f\) restricted to \([x, y]\): there is \(c \in (x, y)\) with \(f(y) - f(x) = f'(c)(y - x)\).`,
        },
      },
      {
        text: {
          ko: String.raw`이번에는 가정이 엄격합니다: \(c \in (a, b)\)이므로 \(f'(c) > 0\)이고, \(y - x > 0\)이므로 곱 \(f'(c)(y - x) > 0\)입니다. 따라서 \(f(y) - f(x) > 0\), 즉 \(f(x) < f(y)\) — \(f\)는 엄격히 증가합니다.`,
          en: String.raw`This time the hypothesis is strict: \(c \in (a, b)\) gives \(f'(c) > 0\), and \(y - x > 0\), so the product \(f'(c)(y - x) > 0\). Hence \(f(y) - f(x) > 0\), i.e. \(f(x) < f(y)\) — \(f\) is strictly increasing.`,
        },
      },
      {
        text: {
          ko: String.raw`문제 1과의 차이는 오직 부등식의 엄격함뿐입니다: \(f' \ge 0\)은 평평한 구간을 허용합니다 — 예컨대 \([-1, 1]\)에서 \(f(x) = (\max(0, x))^2\)로 두면 \(f\)는 \(C^1\)이고, \([-1, 0]\)에서는 \(f' = 0\), \([0, 1]\)에서는 \(f' = 2x \ge 0\)이며 (\(x = 0\)에서 양쪽 차분몫이 모두 \(0\)으로 가므로 \(f'(0) = 0\)), \(f\)는 비감소이지만 \([-1, 0]\)에서 평평하므로 엄격히 증가하지는 않습니다. 반면 \(f' > 0\)은 모든 할선의 기울기를 양수로 강제하므로 그래프가 한순간도 멈추지 않습니다.`,
          en: String.raw`The only difference from problem 1 is the strictness of the inequality: \(f' \ge 0\) permits flat segments — e.g. \(f(x) = (\max(0, x))^2\) on \([-1, 1]\) is \(C^1\) with \(f' = 0\) on \([-1, 0]\) and \(f' = 2x \ge 0\) on \([0, 1]\) (at \(x = 0\) both one-sided difference quotients tend to \(0\), so \(f'(0) = 0\)); \(f\) is nondecreasing but flat on \([-1, 0]\), hence not strictly increasing. By contrast, \(f' > 0\) forces every secant slope to be positive, so the graph never pauses for an instant.`,
        },
      },
    ],
  },
  {
    id: 'derivative-monotonicity-converse',
    statement: {
      ko: String.raw`\(f\)가 구간 \(I\)에서 미분 가능하고 증가함수이면, \(I\)의 모든 점에서 \(f' \ge 0\)임을 완전히 증명하세요 (부분 역명제).`,
      en: String.raw`Prove completely that if \(f\) is differentiable and increasing on an interval \(I\), then \(f' \ge 0\) at every point of \(I\) (a partial converse).`,
    },
    display: [
      String.raw`f'(x_0) = \lim_{h \to 0}\frac{f(x_0+h) - f(x_0)}{h} \ge 0`,
    ],
    preset: { fn: 'cubic', x: 25 },
    presetCaption: {
      ko: String.raw`\(f(x) = x^3 - 3x\), \(x_0 = -1.25\): \(f'(-1.25) = 1.6875 > 0\)이고(초록 접선) 함수도 이 근처에서 증가합니다 — 증가 구역에서는 도함수가 음수가 될 수 없습니다.`,
      en: String.raw`\(f(x) = x^3 - 3x\), \(x_0 = -1.25\): \(f'(-1.25) = 1.6875 > 0\) (green tangent) and the function is increasing around here — the derivative cannot be negative on an increasing stretch.`,
    },
    proof: [
      {
        text: {
          ko: String.raw`\(x_0 \in I\)를 고정하고 차분몫 \(\frac{f(x_0+h) - f(x_0)}{h}\)의 \(h \to 0\) 극한을 봅니다. \(h > 0\)인 경우 분자 \(f(x_0+h) - f(x_0) \ge 0\)입니다 (\(f\)가 증가하므로) — 분모도 양수라서 차분몫 \(\ge 0\)입니다.`,
          en: String.raw`Fix \(x_0 \in I\) and look at the difference quotient \(\frac{f(x_0+h) - f(x_0)}{h}\) as \(h \to 0\). For \(h > 0\), the numerator \(f(x_0+h) - f(x_0) \ge 0\) (since \(f\) is increasing) — and the denominator is positive, so the quotient is \(\ge 0\).`,
        },
      },
      {
        text: {
          ko: String.raw`\(h < 0\)인 경우도 마찬가지입니다: 증가성에 의해 \(f(x_0+h) \le f(x_0)\)이므로 분자 \(\le 0\)이고, 분모 \(h < 0\)이므로 음수를 음수로 나눈 차분몫은 역시 \(\ge 0\)입니다. 즉 0이 아닌 모든 \(h\)에 대해 차분몫이 음이 아닙니다.`,
          en: String.raw`The same holds for \(h < 0\): monotonicity gives \(f(x_0+h) \le f(x_0)\), so the numerator is \(\le 0\), while the denominator \(h < 0\), and a nonpositive divided by a negative is again \(\ge 0\). So the difference quotient is nonnegative for every nonzero \(h\).`,
        },
      },
      {
        text: {
          ko: String.raw`극한은 약한 부등식을 보존합니다: \(g(h) \ge 0\)이고 \(\lim_{h \to 0} g(h) = L\)이 존재하면 \(L \ge 0\)입니다 (만약 \(L < 0\)이면 \(g(h)\)가 결국 \(L/2 < 0\) 근처에 머물러 모순). \(f\)가 미분 가능하므로 극한 \(f'(x_0)\)이 존재하고, 따라서 \(f'(x_0) \ge 0\)입니다. \(x_0\)이 임의였으므로 \(I\) 전체에서 \(f' \ge 0\)입니다.`,
          en: String.raw`Limits preserve weak inequalities: if \(g(h) \ge 0\) and \(\lim_{h \to 0} g(h) = L\) exists, then \(L \ge 0\) (if \(L < 0\), then \(g(h)\) would eventually stay near \(L/2 < 0\), a contradiction). Since \(f\) is differentiable, the limit \(f'(x_0)\) exists, so \(f'(x_0) \ge 0\). As \(x_0\) was arbitrary, \(f' \ge 0\) throughout \(I\).`,
        },
      },
      {
        text: {
          ko: String.raw`이것은 완전한 역명제가 아닙니다: \(f(x) = x^3\)은 \(\mathbb{R}\)에서 엄격히 증가하지만 \(f'(0) = 0\)이므로, 증가함수라고 해서 \(f' > 0\)까지는 보장되지 않습니다. 얻을 수 있는 것은 \(f' \ge 0\)뿐입니다.`,
          en: String.raw`This is not a full converse: \(f(x) = x^3\) is strictly increasing on \(\mathbb{R}\) yet \(f'(0) = 0\), so an increasing function need not satisfy \(f' > 0\). All we get is \(f' \ge 0\).`,
        },
      },
    ],
  },
];
